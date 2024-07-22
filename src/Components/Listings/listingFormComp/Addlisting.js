import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import Select from "react-select";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";

const Addlisting = ({ data }) => {
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
  const [listingData, setlistingData] = useState({
    title: "",
    meta_tags_for_listings_id: 2,
    listing_type_id: "",
    user_id: 3,
    listing_attribute_id: "",
    listing_arrtibute_type_id: "",
    country_id: 1,
    state_id: 2,
    city_id: 2,
    short_description: "",
    thumbnail: "",
    status: 1,
  });

  const handleChange = (e) => {
    setlistingData((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListings = () => {
    setBtnLoading(true);

    axios
      .post(`${BACKEND_URL}/new-listings`, listingData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing  added : ", result);
        setBtnLoading(false);

        toast.success("New List added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setlistingData({
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
        {t("heading_add_listing")}
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
            label={t("title")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            // value={projectData?.projectLocation}
            name="projectLocation"
            // onChange={handleChange}
            required
          />
          <Select
            id="listing_attribute_id"
            value={{
              value: listingData?.listing_attribute_id,
              label: listingData?.listing_attribute_id
                ? data?.list_attribute?.filter(
                    (list_type) =>
                      list_type.id === listingData?.listing_attribute_id
                  )[0]?.name
                : t("label_list_attr"),
            }}
            onChange={(e) => {
              setlistingData({
                ...listingData,
                listing_attribute_id: e.value,
              });
            }}
            options={data?.list_attribute?.map((list_type) => ({
              value: list_type.id,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_list_attr")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />

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
            placeholder={t("label_country")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
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
            placeholder={t("label_city")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
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
            placeholder={t("status")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
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
            id="listing_type_id"
            value={{
              value: listingData?.listing_type_id,
              label: listingData?.listing_type_id
                ? data?.list_type?.filter(
                    (list_type) => list_type.id === listingData?.listing_type_id
                  )[0]?.name
                : t("label_listing_type"),
            }}
            onChange={(e) => {
              setlistingData({
                ...listingData,
                listing_type_id: e.value,
              });
            }}
            options={data?.list_type?.map((list_type) => ({
              value: list_type.id,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_listing_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />

          <Select
            id="listing_arrtibute_type_id"
            value={{
              value: listingData?.listing_arrtibute_type_id,
              label: listingData?.listing_arrtibute_type_id
                ? data?.list_attr_type?.filter(
                    (list_type) =>
                      list_type.id === listingData?.listing_arrtibute_type_id
                  )[0]?.name
                : t("label_list_attr_type"),
            }}
            onChange={(e) => {
              setlistingData({
                ...listingData,
                listing_arrtibute_type_id: e.value,
              });
            }}
            options={data?.list_attr_type?.map((list_type) => ({
              value: list_type.id,
              label: list_type.name,
            }))}
            className="w-full"
            placeholder={t("label_list_attr_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />

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
            placeholder={t("state")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />

          <TextField
            id="short_description"
            type={"text"}
            label={t("description")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingData?.short_description}
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
            onClick={AddListings}
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

export default Addlisting;
