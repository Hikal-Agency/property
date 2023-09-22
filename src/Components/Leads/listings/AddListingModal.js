import {
  Modal,
  Backdrop,
  IconButton,
  CircularProgress,
  Box,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { useStateContext } from "../../../context/ContextProvider";
import { useState } from "react";
import LocationPicker from "../../meetings/LocationPicker";
import ListingLocation from "./ListingLocation";
import { MdFileUpload } from "react-icons/md";
import { CiMapPin } from "react-icons/ci";
import axios from "../../../axoisConfig";
import { toast } from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const AddListingModal = ({
  setListingModalOpen,
  handleCloseListingModal,
  LeadData,
}) => {
  console.log("lead data in listing: ", LeadData);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
  const [loading, setloading] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [listingLocation, setLisitingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });
  const [sellerDetails, setSellerDetails] = useState({
    leadName: LeadData?.leadName,
    leadContact: LeadData?.leadContact,
    leadEmail: LeadData?.leadEmail || "",
    propertyPrice: null,
  });
  const [projectDetails, setProjectDetails] = useState({
    property_type: "",
    project: "",
    bedrooms: "",
    bathrooms: "",
  });

  const [otherDetails, setOtherDetails] = useState({
    address: "",
    area: "",
    picture: [],
    document: [],
  });

  console.log("other details: ", otherDetails);
  console.log("city,country: ", city, country);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProjectDetails = (e) => {
    const { name, value } = e.target;

    setProjectDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtherDetails = (e) => {
    const { name, value } = e.target;

    setOtherDetails((prev) => ({
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

  const handleImgUpload = (e) => {
    const files = e.target.files;

    const filesArray = Array.from(files);

    setOtherDetails((prev) => ({
      ...prev,
      picture: [...prev.picture, ...filesArray],
    }));

    // Clear the file input to allow selecting more files if needed
    e.target.value = null;

    console.log("Updated otherDetails.picture:", otherDetails.picture);
  };

  const handleDocumentUpload = (e) => {
    const documentFiles = e.target.files;

    const documentFilesArray = Array.from(documentFiles);

    setOtherDetails((prev) => ({
      ...prev,
      document: [...prev.document, ...documentFilesArray],
    }));

    // Clear the file input to allow selecting more files if needed
    e.target.value = null;

    console.log("Updated otherDetails.document:", otherDetails.document);
  };

  const submitListing = async (e) => {
    setloading(true);
    e.preventDefault();

    const token = localStorage.getItem("auth-token");

    const lat = listingLocation?.lat;
    const lng = listingLocation?.lng;
    const location = [lat, lng].join(",");

    // const formData = new FormData();
    // formData.append("seller_name", sellerDetails?.leadName);
    // formData.append("seller_contact", sellerDetails?.leadContact);
    // formData.append("seller_email", sellerDetails?.leadEmail);
    // formData.append("price", sellerDetails?.propertyPrice);
    // formData.append("property_type", projectDetails?.property_type);
    // formData.append("project", projectDetails?.project);
    // formData.append("bedrooms", projectDetails?.bedrooms);
    // formData.append("bathrooms", projectDetails?.bathrooms);
    // formData.append("address", otherDetails?.address);
    // formData.append("area", otherDetails?.area);
    // formData.append("listing_type", "Secondary");
    // formData.append("listing_status", "New");
    // formData.append("lead_id", LeadData?.leadId);
    // formData.append("latlong", location);
    // formData.append("latlong", location);
    // formData.append("pictures", otherDetails?.picture);
    // formData.append("documents", otherDetails?.document);

    const formData = {
      seller_name: sellerDetails?.leadName,
      seller_contact: sellerDetails?.leadContact,
      seller_email: sellerDetails?.leadEmail,
      price: sellerDetails?.propertyPrice,
      property_type: projectDetails?.property_type,
      project: projectDetails?.project,
      bedrooms: projectDetails?.bedrooms,
      bathrooms: projectDetails?.bathrooms,
      address: otherDetails?.address,
      area: otherDetails?.area,
      listing_type: "Secondary",
      listing_status: "New",
      lead_id: LeadData?.leadId,
      latlong: location,
      pictures: otherDetails?.picture,
      documents: otherDetails?.document,
    };

    try {
      const postListing = await axios.post(
        `${BACKEND_URL}/listings`,
        JSON.stringify(formData),
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("post listing:: ", postListing);
      setloading(false);

      toast.success("List Added Successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      handleCloseListingModal();
    } catch (error) {
      setloading(false);
      console.log("error: ", error);

      toast.error("Unable to add list.", {
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

  return (
    <>
      <Modal
        keepMounted
        open={setListingModalOpen}
        onClose={() => handleCloseListingModal()}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] ${
            displayMap ? "h-[80%]" : "h-[60%]"
          } overflow-y-scroll md:w-[50%] border-2 border-solid shadow-lg  ${
            currentMode === "dark"
              ? "bg-black border-gray-800"
              : "bg-white border-gray-200"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => handleCloseListingModal()}
          >
            <IoMdClose size={18} />
          </IconButton>

          <div className="w-full flex items-center py-1 mb-2">
            {/* <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div> */}
            <h1
              className={`text-lg bg-primary font-semibold  py-2 px-6 ${
                currentMode === "dark" ? "text-white" : "text-white"
              }`}
            >
              Secondary
            </h1>
            <h1
              className={`text-lg font-semibold ml-3 ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              Add Property
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
              <div className="grid grid-cols-1 mt-9 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 px-4 md:px-10 ">
                <div className="px-4">
                  <Box sx={darkModeColors}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      Seller Details
                    </h4>

                    <TextField
                      id="legalName"
                      type={"text"}
                      label="Legal Name"
                      name="leadName"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      value={removeNull(sellerDetails?.leadName)}
                      onChange={handleChange}
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label="Contacts"
                      className="w-full"
                      name="leadContact"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      value={removeNull(sellerDetails?.leadContact)}
                      onChange={handleChange}
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label="Email"
                      name="leadEmail"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      value={removeNull(sellerDetails?.leadEmail)}
                      onChange={handleChange}
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label="Property Price"
                      className="w-full"
                      name="propertyPrice"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      value={sellerDetails?.propertyPrice}
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
                      Project details
                    </h4>

                    <TextField
                      id="property-type"
                      value={projectDetails?.property_type}
                      label="Property type"
                      onChange={handleProjectDetails}
                      size="small"
                      className="w-full mb-5"
                      name="property_type"
                      displayEmpty
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      select
                    >
                      <MenuItem value="" disabled>
                        Property type
                        <span className="ml-1" style={{ color: "red" }}>
                          *
                        </span>
                      </MenuItem>
                      <MenuItem value={"Apartment"}>Apartment</MenuItem>
                      <MenuItem value={"Villa"}>Villa</MenuItem>
                      <MenuItem value={"Rental"}>Rental</MenuItem>
                    </TextField>

                    <TextField
                      id="notes"
                      type={"text"}
                      label="Project/Name of Building"
                      className="w-full"
                      name="project"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      required
                      value={projectDetails?.project}
                      onChange={handleProjectDetails}
                    />

                    <TextField
                      id="enquiry"
                      label="Number Of Bedrooms"
                      value={projectDetails?.bedrooms}
                      onChange={handleProjectDetails}
                      size="small"
                      name="bedrooms"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                        Number of Bedrooms
                        <span className="ml-1" style={{ color: "red" }}>
                          *
                        </span>
                      </MenuItem>
                      <MenuItem value={"Studio"}>Studio</MenuItem>
                      <MenuItem value={"1 Bedroom"}>1 Bedroom</MenuItem>
                      <MenuItem value={"2 Bedrooms"}>2 Bedrooms</MenuItem>
                      <MenuItem value={"3 Bedrooms"}>3 Bedrooms</MenuItem>
                      <MenuItem value={"4 Bedrooms"}>4 Bedrooms</MenuItem>
                      <MenuItem value={"5 Bedrooms"}>5 Bedrooms</MenuItem>
                      <MenuItem value={"6 Bedrooms"}>6 Bedrooms</MenuItem>
                      <MenuItem value={"7 Bedrooms"}>7 Bedrooms</MenuItem>
                      <MenuItem value={"8 Bedrooms"}>8 Bedrooms</MenuItem>
                      <MenuItem value={"9 Bedrooms"}>9 Bedrooms</MenuItem>
                      <MenuItem value={"10 Bedrooms"}>10 Bedrooms</MenuItem>
                      <MenuItem value={"Retail"}>Retail</MenuItem>
                    </TextField>

                    <TextField
                      id="for"
                      value={projectDetails?.bathrooms}
                      label="Number of Bathrooms"
                      onChange={handleProjectDetails}
                      size="small"
                      className="w-full"
                      name="bathrooms"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                        Number of Bathrooms
                        <span className="ml-1" style={{ color: "red" }}>
                          *
                        </span>
                      </MenuItem>
                      <MenuItem value={"1 Bathroom"}>1 Bathroom</MenuItem>
                      <MenuItem value={"2 Bathrooms"}>2 Bathrooms</MenuItem>
                      <MenuItem value={"3 Bathrooms"}>3 Bathrooms</MenuItem>
                      <MenuItem value={"4 Bathrooms"}>4 Bathrooms</MenuItem>
                      <MenuItem value={"5 Bathrooms"}>5 Bathrooms</MenuItem>
                      <MenuItem value={"6 Bathrooms"}>6 Bathrooms</MenuItem>
                      <MenuItem value={"7 Bathrooms"}>7 Bathrooms</MenuItem>
                      <MenuItem value={"8 Bathrooms"}>8 Bathrooms</MenuItem>
                      <MenuItem value={"9 Bathrooms"}>9 Bathrooms</MenuItem>
                      <MenuItem value={"10 Bathrooms"}>10 Bathrooms</MenuItem>
                      <MenuItem value={"Unavailabe"}>Unavailabe</MenuItem>
                    </TextField>
                  </Box>
                </div>

                <div className="px-4">
                  <Box sx={darkModeColors}>
                    <h4
                      className={`${
                        currentMode === "dark" ? "text-primary" : "text-black"
                      } text-center font-semibold pb-5`}
                    >
                      Other Details
                    </h4>

                    <TextField
                      id="LeadEmailAddress"
                      type={"text"}
                      label="Address"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      name="address"
                      value={otherDetails?.address}
                      onChange={handleOtherDetails}
                    />
                    <TextField
                      id="LeadEmailAddress"
                      type={"text"}
                      label="Area"
                      className="w-full"
                      name="area"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={otherDetails?.area}
                      onChange={handleOtherDetails}
                    />

                    {!displayMap && (
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
                        <span>Location In Map</span>
                      </Button>
                    )}

                    {displayMap && (
                      <ListingLocation
                        listingLocation={listingLocation}
                        currLocByDefault={true}
                        setLisitingLocation={setLisitingLocation}
                        city={city}
                        setCity={setCity}
                        country={country}
                        setCountry={setCountry}
                      />
                    )}
                  </Box>
                </div>
              </div>

              <div className="w-full flex justify-center mr-4 items-center my-4 space-x-5">
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
              </div>

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
                  {loading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "white" }}
                      className="text-white"
                    />
                  ) : (
                    <span>Add property for secondary market</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddListingModal;
