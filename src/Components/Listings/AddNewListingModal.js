import { useEffect, useState } from "react";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import { toast } from "react-toastify";
import Select from "react-select";
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
} from "@mui/material";
import classNames from "classnames";
import ListingLocation from "../Leads/listings/ListingLocation";
import axios from "../../axoisConfig";
import AddImageModal from "../../Pages/listings/AddImageModal";
import AddDocumentModal from "../../Pages/listings/AddDocumentModal";
import { useStateContext } from "../../context/ContextProvider";
import { selectStyles } from "../_elements/SelectStyles";
import { 
  property_options, 
  enquiry_options,
  bathroom_options,
  listing_options
} from "../_elements/SelectOptions";

import { 
  MdFileUpload,
  MdClose 
} from "react-icons/md";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const AddNewListingModal = ({
  LeadData,
  setListingModalOpen,
  handleCloseListingModal,
}) => {
  const { currentMode, darkModeColors, User, BACKEND_URL, t, isLangRTL, i18n, primaryColor } =
    useStateContext();
  const [loading, setloading] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [documentModal, setDocumentModal] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [allDocs, setAllDocs] = useState([]);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseListingModal();
    }, 1000);
  };

  console.log("Lead Data:", LeadData);

  const [listingLocation, setListingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });
  const [sellerDetails, setSellerDetails] = useState({
    leadName: LeadData?.leadName,
    leadContact: LeadData?.leadContact?.replaceAll(" ", ""),
    leadEmail: LeadData?.leadEmail,
    propertyPrice: "",
  });
  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });
  const [projectDetails, setProjectDetails] = useState({
    property_type: LeadData?.leadType,
    project: LeadData?.project,
    bedrooms: LeadData?.enquiryType,
    bathrooms: "",
  });

  const [otherDetails, setOtherDetails] = useState({
    address: "",
    area: "",
    city: "",
    country: "",
    listingType: "Secondary",
    // picture: [],
    document: "",
  });
  const [value, setValue] = useState();
  const [error, setError] = useState(false);

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
      [name]: value.value ? value.value : value,
    }));
  };

  const handleOtherDetails = (e) => {
    const { name, value } = e.target;

    setOtherDetails((prev) => ({
      ...prev,
      [name]: value.value ? value.value : value,
    }));
  };

  // const handleContact = () => {
  //   setError(false);
  //   const inputValue = value;
  //   console.log("Phone: ", inputValue);
  //   if (inputValue && isPossiblePhoneNumber(inputValue)) {
  //     console.log("Possible: ", inputValue);
  //     if (isValidPhoneNumber(inputValue)) {
  //       setSellerDetails?.leadContact(formatPhoneNumberIntl(inputValue));
  //       console.log("Valid lead contact: ", sellerDetails?.leadContact);
  //       console.log("Valid input: ", inputValue);
  //       setError(false);
  //     } else {
  //       setError("Not a valid number.");
  //     }
  //   } else {
  //     setError("Not a valid number.");
  //   }
  // };

  const handleContact = () => {
    setError(false);
    const inputValue = value;
    console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setSellerDetails({
          ...sellerDetails,
          leadContact: formatPhoneNumberIntl(inputValue),
        });
        console.log("Valid lead contact: ", sellerDetails?.leadContact);
        console.log("Valid input: ", inputValue);
        setError(false);
      } else {
        setError("Not a valid number.");
      }
    } else {
      setError("Not a valid number.");
    }
  };

  function removeNull(value) {
    if (value === "null" || value === null) {
      value = "";
    }

    return value;
  }

  const submitListing = async (e) => {
    setloading(true);
    e.preventDefault();

    if (!sellerDetails?.leadContact?.replaceAll(" ", "")) {
      setloading(false);
      toast.error("Contact number is required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setloading(false);
      return;
    }
    const token = localStorage.getItem("auth-token");
    const lat = listingLocation?.lat;
    const lng = listingLocation?.lng;
    const location = [lat, lng].join(",");

    const LeadData = new FormData();

    if (otherDetails?.city) LeadData.append("city", otherDetails?.city);
    if (otherDetails?.country)
      LeadData.append("country", otherDetails?.country);

    if (sellerDetails?.leadName)
      LeadData.append("seller_name", sellerDetails?.leadName);
    if (sellerDetails?.leadContact?.replaceAll(" ", ""))
      LeadData.append("seller_contact", sellerDetails?.leadContact?.replaceAll(" ", ""));
    if (sellerDetails?.leadEmail)
      LeadData.append("seller_email", sellerDetails?.leadEmail);
    if (sellerDetails?.propertyPrice)
      LeadData.append("price", sellerDetails?.propertyPrice);
    if (projectDetails?.property_type)
      LeadData.append("property_type", projectDetails?.property_type);
    if (projectDetails?.project)
      LeadData.append("project", projectDetails?.project);
    if (projectDetails?.bedrooms)
      LeadData.append("bedrooms", projectDetails?.bedrooms);
    if (projectDetails?.bathrooms)
      LeadData.append("bathrooms", projectDetails?.bathrooms);
    if (otherDetails?.address)
      LeadData.append("address", otherDetails?.address);
    if (otherDetails?.area) LeadData.append("area", otherDetails?.area);
    if (otherDetails?.listingType)
      LeadData.append("listing_type", otherDetails?.listingType);
    if (listingLocation?.addressText)
      LeadData.append("location", listingLocation?.addressText);
    if (otherDetails?.document)
      LeadData.append("documents", otherDetails?.document);
    if (LeadData?.leadId) LeadData.append("lead_id", LeadData?.leadId);
    if (location) LeadData.append("latlong", location);
    // LeadData.append("listing_type", "Secondary"); //Always appended
    LeadData.append("listing_status", "New"); //Always appended
    LeadData.append("addedBy", User?.id);

    LeadData.append("addedBy_name", User?.userName);
    if (allImages?.length > 0)
      allImages?.forEach((image, index) => {
        console.log("i am image: ", image);
        LeadData.append(`img_name[${index}]`, image);
      });

    if (allDocs?.length > 0)
      allDocs?.forEach((doc, index) => {
        LeadData.append(`doc_name[${index}]`, doc);
      });

    for (var pair of LeadData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    await axios
      .post(`${BACKEND_URL}/listings`, LeadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result);
        setloading(false);

        toast.success("Listing Added Successfully", {
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
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
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
      });
  };

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
      setOtherDetails({
        ...otherDetails,
        city: result?.city,
        country: result?.country,
      });
    });
  }, [listingLocation]);

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
        {/* <div
          style={style}
          className={`w-[calc(100%-20px)] ${
            displayMap ? "h-[80%]" : "h-[60%]"
          } overflow-y-scroll md:w-[70%] border-2 border-solid shadow-lg  ${
            currentMode === "dark"
              ? "bg-black border-gray-800"
              : "bg-white border-gray-200"
          } absolute top-1/2 left-1/2 p-3 rounded-md`}
        > */}
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
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${isLangRTL(i18n.language) 
              ? (currentMode === "dark" && "border-r-2 border-primary") 
              : (currentMode === "dark" && "border-l-2 border-primary")}
             p-4 h-[100vh] w-[80vw] overflow-y-scroll
            `}
          >
            <div className="w-full flex items-center py-1 mb-2">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ml-3 ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("btn_add_new_listing")}
              </h1>
            </div>

            <div className="mx-auto ">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                disabled={loading ? true : false}
              >
                <div className="grid grid-cols-1 mt-5 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 px-4 md:px-10 ">
                  <div className="px-3">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("label_seller_details")}
                      </h4>

                      {/* SELLER NAME  */}
                      <TextField
                        id="legalName"
                        type={"text"}
                        label={t("label_legal_name")}
                        name="leadName"
                        className="w-full"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={removeNull(sellerDetails?.leadName)}
                        onChange={handleChange}
                      />
                      
                      {/* CONTACT NUMBER  */}
                      <PhoneInput
                        placeholder={t("label_contact_number")}
                        onChange={(value) => setValue(value)}
                        onKeyUp={handleContact}
                        error={error}
                        value={removeNull(sellerDetails?.leadContact)}
                        className={` ${classNames({
                          "dark-mode": currentMode === "dark",
                          "phone-input-light": currentMode !== "dark",
                          "phone-input-dark": currentMode === "dark",
                        })} mb-5`}
                        size="small"
                        style={{
                          marginBottom: "20px",
                          background: `${
                            currentMode === "dark" ? "#000000" : "#fff"
                          }`,
                          "& .PhoneInputCountryIconImg": {
                            color: "#fff",
                          },
                          color: "#AAAAAA",
                          border: `1px solid ${
                            currentMode === "dark" ? "#fff" : "#ccc"
                          }`,
                          borderRadius: "5px",
                          outline: "none",
                        }}
                        inputStyle={{
                          outline: "none !important",
                        }}
                        required
                      />

                      {error && (
                        <Typography variant="body2" color="error">
                          {error}
                        </Typography>
                      )}

                      {/* EMAIL  */}
                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("label_email")}
                        name="leadEmail"
                        className="w-full"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        value={removeNull(sellerDetails?.leadEmail)}
                        onChange={handleChange}
                      />

                      {/* PRICE  */}
                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("label_property_price")}
                        className="w-full"
                        name="propertyPrice"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={sellerDetails?.propertyPrice}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>

                  <div className="px-3">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("project_details")}
                      </h4>

                      {/* PROPERTY TYPE  */}
                      <Select
                        id="property-type"
                        value={property_options(t).find(option => option.value === projectDetails?.property_type?.value)}
                        onChange={(selectedOption) => handleProjectDetails({ target: { name: 'property_type', value: selectedOption } })}
                        // onChange={handleProjectDetails}
                        options={property_options(t)}
                        placeholder={t("label_property_type")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                        required
                      />

                      {/* PROJECT / NAME OF THE BUILDING   */}
                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("project_name_of_building")}
                        className="w-full"
                        name="project"
                        style={{
                          marginBottom: "20px",
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={projectDetails?.project}
                        onChange={handleProjectDetails}
                      />

                      {/* ENQUIRY   */}
                      <Select
                        id="enquiry"
                        value={enquiry_options(t).find(option => option.value === projectDetails?.bedrooms?.value)}
                        onChange={(selectedOption) => handleProjectDetails({ target: { name: 'bedrooms', value: selectedOption } })}
                        options={enquiry_options(t)}
                        placeholder={t("number_of_bedrooms")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                        required
                      />

                      {/* BATHROOM  */}
                      <Select
                        id="for"
                        value={bathroom_options(t).find(option => option.value === projectDetails?.bathrooms?.value)}
                        onChange={(selectedOption) => handleProjectDetails({ target: { name: 'bathrooms', value: selectedOption } })}
                        options={bathroom_options(t)}
                        placeholder={t("number_of_bathrooms")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                        required
                      />
                    </Box>
                  </div>

                  <div className="px-3">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("label_other_details")}
                      </h4>

                      {/* LISTING TYPE  */}
                      <Select
                        id="type"
                        value={listing_options(t).find(option => option.value === otherDetails?.listingType?.value)}
                        onChange={(selectedOption) => handleOtherDetails({ target: { name: 'listingType', value: selectedOption } })}
                        options={listing_options(t)}
                        placeholder={t("label_listing_type")}
                        className="w-full"
                        required
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      {/* <TextField
                        id="type"
                        value={otherDetails?.listingType}
                        label={t("label_listing_type")}
                        onChange={handleOtherDetails}
                        size="small"
                        className="w-full"
                        name="listingType"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        displayEmpty
                        select
                        required
                      >
                        <MenuItem value={"Secondary"}>
                          {t("menu_secondary")}
                        </MenuItem>
                        <MenuItem value={"Off-plan"}>
                          {t("category_off_plan")}
                        </MenuItem>
                      </TextField> */}

                      {/* CITY  */}
                      <TextField
                        id="leadCity"
                        type={"text"}
                        label={t("label_city")}
                        className="w-full"
                        name="city"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        value={otherDetails?.city}
                        onChange={handleOtherDetails}
                        required
                      />

                      {/* COUNTRY  */}
                      <TextField
                        id="leadCountry"
                        type={"text"}
                        label={t("label_country")}
                        className="w-full"
                        name="country"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        value={otherDetails?.country}
                        required
                        onChange={handleOtherDetails}
                      />

                      {/* ADDRESS  */}
                      <TextField
                        id="LeadEmailAddress"
                        type={"text"}
                        label={t("label_address")}
                        className="w-full"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        name="address"
                        value={otherDetails?.address}
                        onChange={handleOtherDetails}
                      />

                      {/* AREA  */}
                      <TextField
                        id="LeadEmailAddress"
                        type={"text"}
                        label={t("label_area")}
                        className="w-full"
                        name="area"
                        style={{
                          marginBottom: "20px"
                        }}
                        variant="outlined"
                        size="small"
                        value={otherDetails?.area}
                        onChange={handleOtherDetails}
                      />
                    </Box>
                  </div>
                </div>

                <div className="w-full flex items-center justify-center gap-5 grid grid-cols-2 px-7">
                  <label htmlFor="contained-button-file" className="p-4">
                    <Button
                      variant="contained"
                      size="medium"
                      className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                      onClick={() =>
                        setSelectImagesModal({
                          isOpen: true,
                        })
                      }
                      style={{
                        // backgroundColor: "#111827",
                        color: "#ffffff",
                        // border: "1px solid #DA1F26",
                      }}
                      component="span"
                      disabled={loading ? true : false}
                      startIcon={loading ? null : <MdFileUpload />}
                    >
                      <span>{t("button_upload_image")}</span>
                    </Button>
                    <p className="text-primary mt-2 italic">
                      {allImages?.length > 0
                        ? `${allImages?.length} images selected.`
                        : null}
                    </p>
                  </label>

                  <label htmlFor="contained-button-document" className="p-4">
                    <Button
                      variant="contained"
                      size="medium"
                      className="bg-main-red-color border-primary w-full text-white rounded-lg py-3 bg-btn-primary font-semibold my-3"
                      style={{
                        color: "#ffffff",
                      }}
                      onClick={() => {
                        setDocumentModal(true);
                      }}
                      component="span"
                      disabled={loading ? true : false}
                      startIcon={loading ? null : <MdFileUpload />}
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

                <div className="w-full grid grid-cols-1 gap-5 pt-5 px-4 md:px-10">
                  <Box sx={darkModeColors}>
                    <ListingLocation
                      listingLocation={listingLocation}
                      currLocByDefault={true}
                      setListingLocation={setListingLocation}
                      city={city}
                      setCity={setCity}
                      country={country}
                      setCountry={setCountry}
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
                      <span>{t("add_property_to_secondary")}</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          {selectImagesModal?.isOpen && (
            <AddImageModal
              selectImagesModal={selectImagesModal}
              handleClose={() => setSelectImagesModal({ isOpen: false })}
              allImages={allImages}
              setAllImages={setAllImages}
            />
          )}
          {documentModal && (
            <AddDocumentModal
              documentModal={documentModal}
              handleClose={() => setDocumentModal(false)}
              allDocs={allDocs}
              setAllDocs={setAllDocs}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default AddNewListingModal;
