import {
  Modal,
  Backdrop,
  IconButton,
  CircularProgress,
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import { IoMdClose } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect, useState } from "react";
import ListingLocation from "./PortfolioLocation";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const EditPropertyModal = ({ openEdit, setOpenEdit, setOpenModal }) => {
  console.log("edit porperty ::: ", openEdit);
  const LeadData = openEdit;
  const token = localStorage.getItem("auth-token");
  const splitLocation = LeadData?.latLong.split(",");

  const { currentMode, darkModeColors, User, BACKEND_URL, isLangRTL, i18n, t } =
    useStateContext();
  const [developer, setDeveloper] = useState([]);

  const [loading, setloading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);
  const [listingLocation, setListingLocation] = useState({
    lat: parseFloat(splitLocation[0]),
    lng: parseFloat(splitLocation[1]),
    addressText: LeadData?.location || "",
  });
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenEdit(false);
      setOpenModal({ open: false });
    }, 1000);
  };

  const [projectData, setprojectData] = useState({
    projectName: LeadData?.projectName,
    developer_id: LeadData?.developer_id,
    price: LeadData?.price,
    projectLocation: LeadData?.projectLocation,
    area: LeadData?.area,
    tourLink: LeadData?.tourLink,
    projectStatus: LeadData?.projectStatus,
    bedrooms: LeadData?.bedrooms || [],
    city: LeadData?.city,
    country: LeadData?.country,
    location: LeadData?.location,
    addedBy: User?.id,
    images: LeadData?.images || [],
  });

  const handleBeds = (value) => {
    setprojectData((prev) => {
      if (prev.bedrooms.includes(value)) {
        // Remove the value from the array if already selected
        return {
          ...prev,
          bedrooms: prev.bedrooms.filter((item) => item !== value),
        };
      } else {
        // Add the value to the array if not selected
        return { ...prev, bedrooms: [...prev.bedrooms, value] };
      }
    });
  };

  const [value, setValue] = useState();
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setprojectData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function removeNull(value) {
    if (value === "null" || value === null) {
      value = "";
    }

    return value;
  }
  function getCityAndCountry(lat, lng, callback) {
    const latlng = new window.google.maps.LatLng(
      parseFloat(lat),
      parseFloat(lng)
    );
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ latLng: latlng }, function (results, status) {
      if (status === "OK") {
        let city = null;
        let country = null;

        for (let i = 0; i < results.length; i++) {
          const result = results[i];

          for (let j = 0; j < result.address_components.length; j++) {
            const component = result.address_components[j];

            if (!city && component.types.includes("locality")) {
              city = component.long_name;
            } else if (
              !city &&
              component.types.includes("administrative_area_level_1")
            ) {
              city = component.long_name;
            } else if (!country && component.types.includes("country")) {
              country = component.long_name;
            }

            if (city && country) {
              break;
            }
          }

          if (city && country) {
            break;
          }
        }

        callback({
          city: city,
          country: country,
        });
      } else {
        console.error("Geocoder failed due to: " + status);
        callback(null);
      }
    });
  }

  const getDevelopers = () => {
    setloading(true);
    const token = localStorage.getItem("auth-token");

    axios
      .get(`${BACKEND_URL}/dev-with-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setDeveloper(result?.data?.data?.developers);
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
        toast.error("Unable to fetch developers.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const submitListing = async (e) => {
    setBtnLoading(true);
    e.preventDefault();

    const lat = listingLocation?.lat;
    const lng = listingLocation?.lng;
    const location = [lat, lng].join(",");

    if (
      !projectData?.projectName ||
      !projectData?.projectLocation ||
      !projectData?.area ||
      !projectData?.developer_id
    ) {
      setBtnLoading(false);
      toast.error("Kindly fill all the required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    projectData["latLong"] = [listingLocation?.lat, listingLocation?.lng].join(
      ","
    );
    projectData["location"] = listingLocation?.addressText;

    const Data = new FormData();

    Object.entries(projectData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          Data.append(`${key}[${index}]`, item);
        });
      } else {
        Data.append(key, value);
      }
    });

    try {
      const result = await axios.post(
        `${BACKEND_URL}/projects/${LeadData?.id}`,
        Data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(result);
      setBtnLoading();

      toast.success("Property Updated Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      handleClose();
      //   fetchSingleListing();
    } catch (error) {
      console.error("Error:", error);
      setloading(false);
      setBtnLoading();
      toast.error("Something went wrong! Please Try Again", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleCurrentLocationClick = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setListingLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        addressText: "", // You may want to update this if you have an address
      });
    });
  };

  useEffect(() => {
    getCityAndCountry(listingLocation?.lat, listingLocation?.lng, (result) => {
      setprojectData({
        ...projectData,
        city: result?.city,
        country: result?.country,
      });
    });
  }, [listingLocation]);

  useEffect(() => {
    getDevelopers();
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={openEdit}
        onClose={() => handleClose()}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
            w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
              bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
            />
          </button>
          {/* <div
              style={style}
              className={`overflow-y-scroll md:w-[70%] border-2 border-solid shadow-lg  ${
                currentMode === "dark"
                  ? "bg-black border-gray-800"
                  : "bg-white border-gray-200"
              }                p-4 h-[100vh] w-[80vw] overflow-y-scroll
              `}
            > */}
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#1C1C1C] text-white"
                : "bg-[#FFFFFF] text-black"
            }
                p-4 h-[100vh] w-[80vw] md:w-[70%] overflow-y-scroll
                `}
          >
            <div className="w-full flex items-center py-1 mb-2">
              {/* <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div> */}
              <div
                className={`text-lg bg-primary font-semibold rounded-xl w-1 h-10 ${
                  currentMode === "dark" ? "text-white" : "text-white"
                }`}
              ></div>
              <h1
                className={`text-lg font-semibold mx-3 ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("update_property")}
              </h1>
            </div>

            <div className="mx-auto ">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // AddLead();
                }}
                disabled={loading ? true : false}
              >
                <div className="grid grid-cols-1 mt-9 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
                  <div className="px-4">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("project_details_form")}
                      </h4>

                      <TextField
                        id="legalName"
                        type={"text"}
                        label={t("project_form_name")}
                        name="projectName"
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={projectData?.projectName}
                        onChange={handleChange}
                        required
                      />

                      <TextField
                        id="Manager"
                        select
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        label={t("form_developer_name")}
                        size="small"
                        className="w-full"
                        displayEmpty
                        value={projectData?.developer_id}
                        onChange={handleChange}
                        name="developer_id"
                        required
                      >
                        {developer?.map((developer, index) => (
                          <MenuItem key={index} value={developer?.id}>
                            {developer?.developerName}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("form_project_priceRange")}
                        name="price"
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={removeNull(projectData?.price)}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>

                  <div className="px-4">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("location_details")}
                      </h4>

                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("form_project_location")}
                        className="w-full"
                        name="projectLocation"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={projectData?.projectLocation}
                        onChange={handleChange}
                      />

                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("form_project_area")}
                        className="w-full"
                        name="area"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={projectData?.area}
                        onChange={handleChange}
                      />

                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("form_project_360View")}
                        className="w-full"
                        name="area"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={projectData?.tourLink}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>

                  <div className="px-4">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("project_availability")}
                      </h4>

                      <TextField
                        id="Manager"
                        select
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        label={t("form_project_status")}
                        size="small"
                        className="w-full"
                        value={projectData?.projectStatus}
                        name="projectStatus"
                        onChange={handleChange}
                        displayEmpty
                        required
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="sold-out">Sold-Out</MenuItem>
                      </TextField>

                      <div>
                        <FormControl>
                          <FormLabel id="demo-checkbox-group-label">
                            Bedrooms
                          </FormLabel>
                          <FormGroup>
                            <div className="flex">
                              <div>
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Studio"
                                  onChange={() => handleBeds("Studio")}
                                  checked={projectData.bedrooms.includes(
                                    "Studio"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="1 Bedroom"
                                  onChange={() => handleBeds("1 Bedroom")}
                                  checked={projectData.bedrooms.includes(
                                    "1 Bedroom"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="2 Bedrooms"
                                  onChange={() => handleBeds("2 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "2 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="3 Bedrooms"
                                  onChange={() => handleBeds("3 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "3 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="4 Bedrooms"
                                  onChange={() => handleBeds("4 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "4 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="5 Bedrooms"
                                  onChange={() => handleBeds("5 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "5 Bedrooms"
                                  )}
                                />
                              </div>
                              <div>
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="6 Bedrooms"
                                  onChange={() => handleBeds("6 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "6 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="7 Bedrooms"
                                  onChange={() => handleBeds("7 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "7 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="8 Bedrooms"
                                  onChange={() => handleBeds("8 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "8 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="9 Bedrooms"
                                  onChange={() => handleBeds("9 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "9 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="10 Bedrooms"
                                  onChange={() => handleBeds("10 Bedrooms")}
                                  checked={projectData.bedrooms.includes(
                                    "10 Bedrooms"
                                  )}
                                />
                                <FormControlLabel
                                  control={<Checkbox />}
                                  label="Retail"
                                  onChange={() => handleBeds("Retail")}
                                  checked={projectData.bedrooms.includes(
                                    "Retail"
                                  )}
                                />
                              </div>
                            </div>
                          </FormGroup>
                        </FormControl>
                      </div>
                    </Box>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 gap-5 pt-5 px-4 md:px-10">
                  <Box sx={darkModeColors}>
                    {/* {!displayMap && (
                        <Button
                          variant="contained"
                          size="medium"
                          className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                          style={{
                            // backgroundColor: "#111827",
                            color: "#ffffff",
                            // border: "1px solid #DA1F26",
                          }}
                          onClick={() => setDisplayMap(true)}
                          component="span"
                          disabled={loading ? true : false}
                          startIcon={loading ? null : <CiMapPin />}
                        >
                          <span>Select location in map *</span>
                        </Button>
                      )}
    
                      {displayMap && ( */}
                    <ListingLocation
                      listingLocation={listingLocation}
                      currLocByDefault={true}
                      setListingLocation={setListingLocation}
                      required
                    />
                    {/* )} */}
                  </Box>
                </div>

                {/* <div className="w-full flex justify-center mr-4 items-center my-4 space-x-5">
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="contained-button-file"
                      type="file"
                      name="picture"
                      onChange={handleImgUpload}
                      multiple
                    />
                    <label htmlFor="contained-button-file">
                      <Button
                        variant="contained"
                        size="medium"
                        className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                        style={{
                          // backgroundColor: "#111827",
                          color: "#ffffff",
                          // border: "1px solid #DA1F26",
                        }}
                        component="span"
                        disabled={loading ? true : false}
                        startIcon={loading ? null : <MdFileUpload />}
                      >
                        <span>Upload Image</span>
                      </Button>
                    </label>
                    <input
                      accept=".pdf"
                      style={{ display: "none" }}
                      id="contained-button-document"
                      type="file"
                      name="document"
                      onChange={handleDocumentUpload}
                      multiple
                    />
                    <label htmlFor="contained-button-document">
                      <Button
                        variant="contained"
                        size="medium"
                        className="bg-main-red-color border-primary w-full text-white rounded-lg py-3 bg-btn-primary font-semibold my-3"
                        style={{
                          // backgroundColor: "#111827",
                          color: "#ffffff",
                          // border: "1px solid ",
                        }}
                        component="span"
                        disabled={loading ? true : false}
                        startIcon={loading ? null : <MdFileUpload />}
                      >
                        <span>Upload Document</span>
                      </Button>
                    </label>
                  </div> */}

                <div
                  className={`${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } px-5 mx-5 py-2 text-center sm:px-6`}
                >
                  <Button
                    ripple={true}
                    size="lg"
                    type="submit"
                    className="bg-btn-primary"
                    disabled={loading ? true : false}
                    style={{
                      // background: "#da1f26",
                      color: "#ffffff",
                      marginTop: "10px",
                      width: "100%",
                      borderRadius: "6px",
                    }}
                    onClick={submitListing}
                  >
                    {btnLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white" }}
                        className="text-white"
                      />
                    ) : (
                      <span>Update property for secondary market</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditPropertyModal;
