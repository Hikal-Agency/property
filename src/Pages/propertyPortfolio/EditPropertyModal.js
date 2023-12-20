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
import Select from "react-select";
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
import PropertyImageUpload from "./PropertyImageUpload";
import PropertyDocModal from "./PropertyDocumentUpload";
import { selectStyles } from "../../Components/_elements/SelectStyles";
import { enquiry_options, project_status_options } from "../../Components/_elements/SelectOptions";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const EditPropertyModal = ({
  openEdit,
  setOpenEdit,
  setOpenModal,
  FetchProperty,
}) => {
  console.log("edit porperty ::: ", openEdit);
  const LeadData = openEdit;
  const token = localStorage.getItem("auth-token");
  const splitLocation = LeadData?.latLong?.split(",");

  const { currentMode, darkModeColors, User, BACKEND_URL, isLangRTL,
    primaryColor, 
    i18n, t,
    fontFam
  } = useStateContext();
  const [developer, setDeveloper] = useState([]);

  const [documentModal, setDocumentModal] = useState(false);

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });
  const [allImages, setAllImages] = useState([]);
  const [allDocs, setAllDocs] = useState([]);

  console.log("update images::: ", allImages);
  console.log("update docs::: ", allDocs);

  const [loading, setloading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listingLocation, setListingLocation] = useState({
    lat: parseFloat(splitLocation[0]),
    lng: parseFloat(splitLocation[1]),
    addressText: LeadData?.location || "",
  });
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = (close) => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenEdit(false);
      if (close !== "close") {
        setOpenModal({ open: false });
      }
    }, 1000);
  };

  const [projectData, setprojectData] = useState({
    projectName: LeadData?.projectName,
    developer_id: LeadData?.developer_id,
    price: LeadData?.price,
    projectLocation: LeadData?.projectLocation,
    area: LeadData?.area,
    tourlink: LeadData?.tourlink,
    projectStatus: LeadData?.projectStatus,
    bedrooms: LeadData?.bedrooms || [],
    city: LeadData?.city,
    country: LeadData?.country,
    location: LeadData?.location,
    addedBy: User?.id,
    images: LeadData?.images || [],
    documents: LeadData?.documents || [],
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

  const updateProperty = async (e) => {
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

    if (allImages?.length > 0) {
      // Append each image to the FormData object

      allImages.forEach((image, index) => {
        console.log("appending images::: ", image);

        Data.append(`images[${index}]`, image);
      });
    }

    if (allDocs?.length > 0) {
      // Append each document to the FormData object
      allDocs.forEach((doc, index) => {
        console.log("appending documents::: ", doc);
        Data.append(`documents[${index}]`, doc);
      });
    }

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
            "Content-Type": "multipart/form-data",
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
      FetchProperty();
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

  const options = enquiry_options(t);

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
            onClick={() => handleClose("close")}
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

          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#1C1C1C] text-white"
                : "bg-[#FFFFFF] text-black"
            } p-4 h-[100vh] w-[80vw] md:w-[70%] overflow-y-scroll ${
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-r-2 border-primary"
                : "border-l-2 border-primary")
            }`}
          >
            <div className="w-full flex items-center py-1 mb-2">
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

            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                disabled={loading ? true : false}
              >
                <div className="grid grid-cols-1 my-5 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
                  {/* PROJECT DETAILS  */}
                  <Box 
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language)
                          ? "2.5rem"
                          : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                  }}>
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
                    
                    <Select
                      id="Developer"
                      value={{
                        value: projectData?.developer_id,
                        label: developer.find((dev) => dev.id === projectData?.developer_id)?.developerName || '',
                      }}
                      onChange={(selectedOption) => {
                        handleChange({ target: { name: 'developer_id', value: selectedOption.value } });
                      }}
                      options={developer.map((dev) => ({ value: dev.id, label: dev.developerName }))}
                      className="w-full"
                      placeholder={t('form_developer_name')}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />

                    <TextField
                      id="price_range"
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
                    
                    <Select
                      id="Availability"
                      value={project_status_options(t).find(option => option.value === projectData?.projectStatus)}
                      onChange={(selectedOption) => {
                        handleChange({ target: { name: 'projectStatus', value: selectedOption.value } });
                      }}
                      options={project_status_options(t)}
                      className="w-full"
                      placeholder={t('form_project_status')}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                  </Box>
                  {/* LOCATION DETAILS  */}
                  <Box 
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language)
                          ? "2.5rem"
                          : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                  }}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      {t("location_details")}
                    </h4>

                    <TextField
                      id="location"
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
                      id="area"
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
                      id="view_360"
                      type={"text"}
                      label={t("form_project_360View")}
                      className="w-full"
                      name="tourLink"
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
                  {/* BEDROOMS  */}
                  <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language)
                          ? "2.5rem"
                          : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                  }}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      {t("bedrooms")}
                    </h4>

                    {/* <TextField
                      id="Availability"
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
                      <MenuItem value="Available">{t("project_available")}</MenuItem>
                      <MenuItem value="Sold Out">{t("project_soldout")}</MenuItem>
                    </TextField> */}

                    <div className="flex justify-center w-full">
                      <FormControl>
                        <FormGroup>
                          <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4 px-4">
                            {options.map((option) => (
                              <FormControlLabel
                                key={option.value}
                                control={<Checkbox />}
                                label={option.label}
                                onChange={() => handleBeds(option.value)}
                                checked={projectData.bedrooms.includes(option.value)}
                              />
                            ))}
                          </div>
                        </FormGroup>
                      </FormControl>
                    </div>

                    {/* <div>
                      <FormControl>
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
                    </div> */}
                  </Box>
                </div>
                  
                {/* UPLOAD IMAGE AND DOCUMENT  */}
                <div className="w-full flex justify-center items-center my-1 gap-4">
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      size="lg"
                      className="bg-main-red-color w-full bg-btn-primary text-white rounded-lg py-3 border-primary font-semibold my-1"
                      onClick={() =>
                        setSelectImagesModal({
                          isOpen: true,
                        })
                      }
                      style={{
                        fontFamily: fontFam,
                        color: "#ffffff",
                      }}
                      component="span"
                      disabled={loading ? true : false}
                      // startIcon={loading ? null : <MdFileUpload />}
                    >
                      <span>{t("button_upload_image")}</span>
                    </Button>
                    <p className="text-primary mt-2 italic">
                      {allImages?.length > 0
                        ? `${allImages?.length} images selected.`
                        : null}
                    </p>
                  </label>
                  <label htmlFor="contained-button-document">
                    <Button
                      variant="contained"
                      size="lg"
                      className="min-w-fit bg-main-red-color border-primary w-full text-white rounded-lg py-3 bg-btn-primary font-semibold my-1"
                      style={{
                        fontFamily: fontFam,
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        setDocumentModal(true);
                      }}
                      component="span"
                      disabled={loading ? true : false}
                      // startIcon={loading ? null : <MdFileUpload />}
                    >
                      <span>{t("button_upload_document")}</span>
                    </Button>
                    <p className="text-primary mt-2 italic">
                      {allDocs?.length > 0
                        ? `${allDocs?.length} documents selected.`
                        : null}
                    </p>
                  </label>
                </div>
                
                {/* LOCATION MAP  */}
                <div className="w-full grid grid-cols-1 gap-5 pt-4">
                  <Box sx={darkModeColors}>
                    <ListingLocation
                      listingLocation={listingLocation}
                      currLocByDefault={true}
                      setListingLocation={setListingLocation}
                      required
                    />
                  </Box>
                </div>
                {/* BUTTON  */}
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
                      fontFamily: fontFam,
                      color: "#ffffff",
                      marginTop: "10px",
                      width: "100%",
                      borderRadius: "6px",
                    }}
                    onClick={updateProperty}
                  >
                    {btnLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white" }}
                        className="text-white"
                      />
                    ) : (
                      <span>{t("update_property")}</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            {selectImagesModal?.isOpen && (
              <PropertyImageUpload
                selectImagesModal={selectImagesModal}
                handleClose={() => setSelectImagesModal({ isOpen: false })}
                allImages={allImages}
                setAllImages={setAllImages}
              />
            )}
            {documentModal && (
              <PropertyDocModal
                documentModal={documentModal}
                handleClose={() => setDocumentModal(false)}
                allDocs={allDocs}
                setAllDocs={setAllDocs}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EditPropertyModal;
