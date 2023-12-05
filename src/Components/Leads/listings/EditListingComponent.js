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
import Select from "react-select";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import { IoMdClose } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../../context/ContextProvider";
import { useEffect, useState } from "react";
import ListingLocation from "./ListingLocation";
import axios from "../../../axoisConfig";
import { toast } from "react-toastify";
import { bathroom_options, enquiry_options, listing_options, property_options } from "../../_elements/SelectOptions";
import { selectStyles } from "../../_elements/SelectStyles";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const EditListingModal = ({ handleClose, openEdit, fetchSingleListing }) => {
  const LeadData = openEdit;
  const token = localStorage.getItem("auth-token");
  const splitLocation = LeadData?.latlong.split(",");

  const { 
    currentMode, 
    darkModeColors, 
    User, 
    BACKEND_URL, 
    isLangRTL, 
    i18n ,
    t,
    primaryColor
  } =
    useStateContext();
  const [loading, setloading] = useState(false);
  const [displayMap, setDisplayMap] = useState(false);
  const [listingLocation, setListingLocation] = useState({
    lat: parseFloat(splitLocation[0]),
    lng: parseFloat(splitLocation[1]),
    addressText: LeadData?.location || "",
  });
  const [isClosing, setIsClosing] = useState(false);
  const handleEditClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleClose();
    }, 1000);
  };

  const [sellerDetails, setSellerDetails] = useState({
    leadName: LeadData?.seller_name,
    leadContact: LeadData?.seller_contact,
    leadEmail: LeadData?.seller_email || "",
    propertyPrice: LeadData?.price,
  });
  const [projectDetails, setProjectDetails] = useState({
    property_type: LeadData?.property_type,
    project: LeadData?.project,
    bedrooms: LeadData?.bedrooms,
    bathrooms: LeadData?.bathrooms,
  });

  const [otherDetails, setOtherDetails] = useState({
    address: LeadData?.address,
    area: LeadData?.area,
    listing_status: LeadData?.listing_status,
    city: "",
    country: "",
    listingType: LeadData?.listing_type || "",
  });
  const [value, setValue] = useState();
  const [error, setError] = useState(false);

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
    console.log("name value: ", name, value);

    setOtherDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContact = () => {
    setError(false);
    const inputValue = value;
    console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setSellerDetails?.leadContact(formatPhoneNumberIntl(inputValue));
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

  // const handleImgUpload = (e) => {
  //   const files = e.target.files;

  //   const filesArray = Array.from(files);

  //   setOtherDetails((prev) => ({
  //     ...prev,
  //     picture: [...prev.picture, ...filesArray],
  //   }));

  //   // Clear the file input to allow selecting more files if needed
  //   e.target.value = null;

  //   console.log("Updated otherDetails.picture:", otherDetails.picture);
  // };

  // const handleDocumentUpload = (e) => {
  //   const documentFiles = e.target.files;

  //   const documentFilesArray = Array.from(documentFiles);

  //   setOtherDetails((prev) => ({
  //     ...prev,
  //     document: [...prev.document, ...documentFilesArray],
  //   }));

  //   // Clear the file input to allow selecting more files if needed
  //   e.target.value = null;

  //   console.log("Updated otherDetails.document:", otherDetails.document);
  // };

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
    const lat = listingLocation?.lat;
    const lng = listingLocation?.lng;
    const location = [lat, lng].join(",");

    // getCityAndCountry(lat, lng, (result) => {
    //   console.log("Result:", result);
    // })

    const Data = new FormData();

    if (otherDetails?.city) Data.append("city", otherDetails?.city);
    if (otherDetails?.country) Data.append("country", otherDetails?.country);

    if (sellerDetails?.leadName)
      Data.append("seller_name", sellerDetails?.leadName);
    if (sellerDetails?.leadContact?.replaceAll(" ", ""))
      Data.append(
        "seller_contact",
        sellerDetails?.leadContact?.replaceAll(" ", "")
      );
    if (sellerDetails?.leadEmail)
      Data.append("seller_email", sellerDetails?.leadEmail);
    if (sellerDetails?.propertyPrice)
      Data.append("price", sellerDetails?.propertyPrice);
    if (projectDetails?.property_type)
      Data.append("property_type", projectDetails?.property_type);
    if (projectDetails?.project)
      Data.append("project", projectDetails?.project);
    if (projectDetails?.bedrooms)
      Data.append("bedrooms", projectDetails?.bedrooms);
    if (listingLocation?.addressText)
      Data.append("location", listingLocation?.addressText);
    if (projectDetails?.bathrooms)
      Data.append("bathrooms", projectDetails?.bathrooms);
    if (otherDetails?.address) Data.append("address", otherDetails?.address);
    if (otherDetails?.area) Data.append("area", otherDetails?.area);
    if (LeadData?.leadId) Data.append("lead_id", LeadData?.leadId);
    if (location) Data.append("latlong", location);
    if (otherDetails?.listing_status)
      Data.append("listing_status", otherDetails?.listing_status);
    if (otherDetails?.listingType)
      Data.append("listing_type", otherDetails?.listingType);
    // Data.append("listing_status", "New"); //Always appended
    Data.append("addedBy", User?.id);
    Data.append("addedBy_name", User?.userName);

    for (var pair of Data.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    try {
      const result = await axios.post(
        `${BACKEND_URL}/listings/${LeadData?.id}`,
        Data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
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

      handleClose();
      fetchSingleListing();
    } catch (error) {
      console.error("Error:", error);
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
      setOtherDetails({
        ...otherDetails,
        city: result?.city,
        country: result?.country,
      });
    });
  }, [listingLocation]);

  const status_options = (t) => [
    {
      value: "New",
      label: t("feedback_new")
    },
    {
      value: "Available",
      label: t("available")
    }, 
    {
      value: "Sold",
      label: t("sold")
    }
  ];

  return (
    <>
      <Modal
        keepMounted
        open={openEdit}
        onClose={() => handleEditClose()}
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
            onClick={handleEditClose}
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
            } ${
              currentMode === "dark" && (isLangRTL(i18n.language) ? "border-primary border-r-2" : "border-primary border-l-2")
            }
              p-4 h-[100vh] w-[80vw] md:w-[70%] overflow-y-scroll
              `}
          >
            <div className="w-full flex items-center py-1 mb-2">
              <div className={`text-lg bg-primary font-semibold rounded-xl w-1 h-10`}></div>
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
                          marginBottom: "20px",
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={removeNull(sellerDetails?.leadName)}
                        onChange={handleChange}
                      />

                      {/* SELLER CONTACT  */}
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
                          // background: `${
                          //   currentMode === "dark" ? "#000000" : "#fff"
                          // }`,
                          "& .PhoneInputCountryIconImg": {
                            color: "#fff",
                          },
                          // color: "#808080",
                          border: `1px solid ${
                            currentMode === "dark" ? "#fff" : "#ccc"
                          }`,
                          borderRadius: "5px",
                          outline: "none",
                          marginBottom: "20px"
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

                      {/* SELLER EMAIL  */}
                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("label_email_address")}
                        name="leadEmail"
                        className="w-full"
                        style={{
                          marginBottom: "20px",
                        }}
                        variant="outlined"
                        size="small"
                        required
                        value={removeNull(sellerDetails?.leadEmail)}
                        onChange={handleChange}
                      />

                      {/* PROPERTY PRICE  */}
                      <TextField
                        id="notes"
                        type={"text"}
                        label={t("label_property_price")}
                        className="w-full"
                        name="propertyPrice"
                        stylex={{
                          marginBottom: "20px",
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
                        {t("project_details")}
                      </h4>

                      {/* PROJECT NAME  */}
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

                      {/* PROPERTY TYPE  */}
                      <Select
                        id="property-type"
                        value={projectDetails?.property_type
                          ? {
                            value: property_options(t).find(option => option.value === projectDetails?.property_type),
                            label: property_options(t).find(option => option.value === projectDetails?.property_type).label,
                          }
                          : null
                        }
                        options={property_options(t)}
                        onChange={(selectedOption) => {
                          setProjectDetails((prev) => ({
                            ...prev,
                            property_type: selectedOption.value,
                          }));
                        }}
                        placeholder={t("label_property_type")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      {/* <TextField
                        id="property-type"
                        value={projectDetails?.property_type}
                        label={t("label_property_type")}
                        onChange={handleProjectDetails}
                        size="small"
                        className="w-full mb-5"
                        name="property_type"
                        displayEmpty
                        style={{
                          marginBottom: "20px",
                        }}
                        select
                      >
                        <MenuItem value="" disabled>
                          Property type
                          <span className="ml-1" style={{ color: "red" }}>
                            *
                          </span>
                        </MenuItem>
                        <MenuItem value={"Apartment"}>{t("property_apartment")}</MenuItem>
                        <MenuItem value={"Villa"}>{t("property_villa")}</MenuItem>
                        <MenuItem value={"retail"}>{t("enquiry_retail")}</MenuItem>
                      </TextField> */}

                      {/* BEDRROMS  */}
                      <Select
                        id="enquiry"
                        value={projectDetails?.bedrooms
                          ? {
                            value: enquiry_options(t).find(option => option.value === projectDetails?.bedrooms),
                            label: enquiry_options(t).find(option => option.value === projectDetails?.bedrooms).label,
                          }
                          : null
                        }
                        options={enquiry_options(t)}
                        onChange={(selectedOption) => {
                          setProjectDetails((prev) => ({
                            ...prev,
                            bedrooms: selectedOption.value,
                          }));
                        }}
                        placeholder={t("number_of_bedrooms")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      {/* <TextField
                        id="enquiry"
                        label={t("number_of_bedrooms")}
                        value={projectDetails?.bedrooms}
                        onChange={handleProjectDetails}
                        size="small"
                        name="bedrooms"
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "20px",
                          },
                        }}
                        displayEmpty
                        select
                      >
                        <MenuItem value="" disabled>
                        {t("number_of_bedrooms")}
                          <span className="ml-1" style={{ color: "red" }}>
                            *
                          </span>
                        </MenuItem>
                        <MenuItem value={"Studio"}>{t("enquiry_studio")}</MenuItem>
                        <MenuItem value={"1 Bedroom"}>{t("enquiry_1bed")}</MenuItem>
                        <MenuItem value={"2 Bedrooms"}>{t("enquiry_2bed")}</MenuItem>
                        <MenuItem value={"3 Bedrooms"}>{t("enquiry_3bed")}</MenuItem>
                        <MenuItem value={"4 Bedrooms"}>{t("enquiry_4bed")}</MenuItem>
                        <MenuItem value={"5 Bedrooms"}>{t("enquiry_5bed")}</MenuItem>
                        <MenuItem value={"6 Bedrooms"}>{t("enquiry_6bed")}</MenuItem>
                        <MenuItem value={"7 Bedrooms"}>{t("enquiry_7bed")}</MenuItem>
                        <MenuItem value={"8 Bedrooms"}>{t("enquiry_8bed")}</MenuItem>
                        <MenuItem value={"9 Bedrooms"}>{t("enquiry_9bed")}</MenuItem>
                        <MenuItem value={"10 Bedrooms"}>{t("enquiry_10bed")}</MenuItem>
                        <MenuItem value={"Retail"}>{t("enquiry_retail")}</MenuItem>
                      </TextField> */}

                      {/* BATHROOMS  */}
                      <Select
                        id="for"
                        value={projectDetails?.bathrooms
                          ? {
                            value: bathroom_options(t).find(option => option.value === projectDetails?.bathrooms),
                            label: bathroom_options(t).find(option => option.value === projectDetails?.bathrooms).label,
                          }
                          : null
                        }
                        options={bathroom_options(t)}
                        onChange={(selectedOption) => {
                          setProjectDetails((prev) => ({
                            ...prev,
                            bathrooms: selectedOption.value,
                          }));
                        }}
                        placeholder={t("number_of_bathrooms")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      {/* <TextField
                        id="for"
                        value={projectDetails?.bathrooms}
                        label={t("number_of_bathrooms")}
                        onChange={handleProjectDetails}
                        size="small"
                        className="w-full"
                        name="bathrooms"
                        sx={{
                          "&": {
                            marginBottom: "20px",
                          },
                        }}
                        displayEmpty
                        select
                      >
                        <MenuItem value="" disabled>
                          {t("number_of_bathrooms")}
                          <span className="ml-1" style={{ color: "red" }}>
                            *
                          </span>
                        </MenuItem>
                        <MenuItem value={"1 Bathroom"}>{t("bathroom_1")}</MenuItem>
                        <MenuItem value={"2 Bathrooms"}>{t("bathroom_2")}</MenuItem>
                        <MenuItem value={"3 Bathrooms"}>{t("bathroom_3")}</MenuItem>
                        <MenuItem value={"4 Bathrooms"}>{t("bathroom_4")}</MenuItem>
                        <MenuItem value={"5 Bathrooms"}>{t("bathroom_5")}</MenuItem>
                        <MenuItem value={"6 Bathrooms"}>{t("bathroom_6")}</MenuItem>
                        <MenuItem value={"7 Bathrooms"}>{t("bathroom_7")}</MenuItem>
                        <MenuItem value={"8 Bathrooms"}>{t("bathroom_8")}</MenuItem>
                        <MenuItem value={"9 Bathrooms"}>{t("bathroom_9")}</MenuItem>
                        <MenuItem value={"10 Bathrooms"}>{t("bathroom_10")}</MenuItem>
                        <MenuItem value={"Unavailabe"}>{t("label_unavailable")}</MenuItem>
                      </TextField> */}

                      {/* LISTING TYPE  */}
                      <Select
                        id="type"
                        value={otherDetails?.listingType
                          ? {
                            value: listing_options(t).find(option => option.value === otherDetails?.listingType),
                            label: listing_options(t).find(option => option.value === otherDetails?.listingType).label,
                          }
                          : null
                        }
                        options={listing_options(t)}
                        onChange={(selectedOption) => {
                          setOtherDetails((prev) => ({
                            ...prev,
                            listingType: selectedOption.value,
                          }));
                        }}
                        placeholder={t("label_listing_type")}
                        className="w-full"
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
                            marginBottom: "20px",
                          },
                        }}
                        displayEmpty
                        select
                        required
                      >
                        <MenuItem value={"Secondary"}>{t("menu_secondary")}</MenuItem>
                        <MenuItem value={"Off-plan"}>{t("category_off_plan")}</MenuItem>
                      </TextField> */}

                    </Box>
                  </div>

                  <div className="px-4">
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark" ? "text-primary" : "text-black"
                        } text-center font-semibold pb-5`}
                      >
                        {t("label_other_details")}
                      </h4>

                      {/* ADDRESS  */}
                      <TextField
                        id="LeadEmailAddress"
                        type={"text"}
                        label={t("label_address")}
                        className="w-full"
                        style={{
                          marginBottom: "20px",
                        }}
                        variant="outlined"
                        size="small"
                        name="address"
                        value={otherDetails?.address}
                        onChange={handleOtherDetails}
                      />

                      {/* AREA  */}
                      <TextField
                        id="LeadArea"
                        type={"text"}
                        label="Area"
                        className="w-full"
                        name="area"
                        style={{
                          marginBottom: "20px",
                        }}
                        variant="outlined"
                        size="small"
                        value={otherDetails?.area}
                        onChange={handleOtherDetails}
                      />

                      {/* CITY  */}
                      <TextField
                        id="leadCity"
                        type={"text"}
                        label="City"
                        className="w-full"
                        name="city"
                        style={{
                          marginBottom: "20px",
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
                        label="Country"
                        className="w-full"
                        name="country"
                        style={{
                          marginBottom: "20px",
                        }}
                        variant="outlined"
                        size="small"
                        value={otherDetails?.country}
                        required
                        onChange={handleOtherDetails}
                      />

                      {/* STATUS  */}
                      <Select
                        id="listing-status"
                        value={otherDetails?.listing_status
                          ? {
                            value: otherDetails?.listing_status,
                            label: status_options(t).find(option => option.value === otherDetails?.listing_status).label,
                          }
                          : null
                        }
                        options={status_options(t)}
                        onChange={(selectedOption) => {
                          setOtherDetails((prev) => ({
                            ...prev,
                            listing_status: selectedOption.value,
                          }));
                        }}
                        placeholder={t("status")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      
                      {/* <TextField
                        id="listing-status"
                        value={otherDetails?.listing_status}
                        label="Listing Status"
                        disabled={
                          LeadData?.listing_status.toLowerCase() === "sold"
                        }
                        onChange={handleOtherDetails}
                        size="small"
                        className="w-full mb-5"
                        name="listing_status"
                        displayEmpty
                        sx={{
                          "&": {
                            marginBottom: "20px",
                          },
                          "& .MuiSelect-select .MuiSelect-outlined .Mui-disabled .MuiInputBase-input .MuiOutlinedInput-input .Mui-disabled .MuiInputBase-inputSizeSmall css-jedpe8-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
                            {
                              color: "red !important",
                            },
                        }}
                        select
                      >
                        <MenuItem value="" disabled>
                          Listing Status
                          <span className="ml-1" style={{ color: "red" }}>
                            *
                          </span>
                        </MenuItem>
                        <MenuItem value={"Available"}>Available</MenuItem>
                        <MenuItem
                          value={"Sold"}
                          selected={
                            LeadData?.listing_status.toLowerCase() === "sold"
                          }
                        >
                          Sold
                        </MenuItem>
                      </TextField> */}
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
                    {loading ? (
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

export default EditListingModal;
