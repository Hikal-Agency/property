import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";

const AddListingAttrType = () => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    fontFam,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");

  const [btnLoading, setBtnLoading] = useState(false);
  const [listingAttrType, setListingAttrType] = useState({
    name: "",
    listing_attribute_id: 3,
    type: "",
    price: "",
    amenities: "",
    near_by: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setListingAttrType((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListAttrType = () => {
    setBtnLoading(true);

    axios
      .post(`${BACKEND_URL}/listing-attribute-types`, listingAttrType, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing attr added : ", result);
        setBtnLoading(false);

        toast.success("Listing Attribute type added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setListingAttrType({
          name: "",
          listing_attribute_id: 3,
          type: "",
          price: "",
          amenities: "",
          near_by: "",
          latitude: "",
          longitude: "",
        });
      })
      .catch((err) => {
        console.error(err);
        setBtnLoading(false);
        console.log(err);
        const errors = err.response?.data?.errors;

        if (errors) {
          const errorMessages = Object.values(errors).flat().join(" ");
          toast.error(`Errors: ${errorMessages}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error("Something Went Wrong! Please Try Again", {
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
      });
  };

  return (
    <div className="my-4">
      <h4 className={`text-primary text-center font-semibold pb-5`}>
        {t("heading_listing_attr_type")}
      </h4>

      <div className="grid sm:grid-cols-1   md:grid-cols-2 lg:grid-cols-2 gap-3">
        <Box
          sx={{
            ...darkModeColors,
            "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
              {
                right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
              },
            "& legend": {
              textAlign: isLangRTL(i18n.language) ? "right" : "left",
            },
          }}
        >
          <TextField
            id="name"
            type={"text"}
            label={t("name")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.name}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="type"
            type={"text"}
            label={t("type")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.type}
            name="area"
            onChange={handleChange}
            required
          />

          <TextField
            id="amenities"
            type={"text"}
            label={t("form_label_amenities")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.amenities}
            name="tourLink"
            onChange={handleChange}
          />

          <TextField
            id="gallery"
            type={"text"}
            label={t("gallery")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.gallery}
            name="tourLink"
            onChange={handleChange}
          />

          <TextField
            id="latitude"
            type={"text"}
            label={t("form_label_lat")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.latitude}
            name="tourLink"
            onChange={handleChange}
          />
        </Box>
        <Box
          sx={{
            ...darkModeColors,
            "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
              {
                right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
              },
            "& legend": {
              textAlign: isLangRTL(i18n.language) ? "right" : "left",
            },
          }}
        >
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("label_list_attr")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            id="price"
            type={"text"}
            label={t("label_price")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.price}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="near_by"
            type={"text"}
            label={t("label_nearby")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.near_by}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="longitude"
            type={"text"}
            label={t("form_label_long")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingAttrType?.longitude}
            name="area"
            onChange={handleChange}
            required
          />

          <Button
            className={`min-w-fit text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
            ripple={true}
            style={{
              fontFamily: fontFam,
              background: `${primaryColor}`,
            }}
            size="lg"
            type="submit"
            disabled={btnLoading ? true : false}
            onClick={AddListAttrType}
          >
            {btnLoading ? (
              <CircularProgress
                size={20}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <span className="text-white">{t("submit")}</span>
            )}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default AddListingAttrType;
