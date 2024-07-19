import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import Select from "react-select";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import dayjs from "dayjs";
const AddListingMeta = () => {
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
  const [listingMeta, setListingMeta] = useState({
    slug: "",
    long_description: "",
    year_build_in: "",
    promo_video: "",
    is_featured: "",
    meta_title: "",
    meta_keywords: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    json_ld: "",
    canonical: "",
    banner: "",
  });

  const handleChange = (e) => {
    setListingMeta((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const AddListMeta = () => {
    setBtnLoading(true);

    axios
      .post(`${BACKEND_URL}/listing-attribute-types`, listingMeta, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing attr added : ", result);
        setBtnLoading(false);

        toast.success("Listing Meta added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setListingMeta({
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
        {t("heading_listing_meta_tag")}
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
            placeholder={t("menu_listings")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            id="long_description"
            type={"text"}
            label={t("description")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.long_description}
            name="projectLocation"
            onChange={handleChange}
            required
          />

          <TextField
            id="promo_video"
            type={"text"}
            label={t("label_promo_video")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.promo_video}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="meta_title"
            type={"text"}
            label={t("label_meta_title")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.meta_title}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <TextField
            id="canonical"
            type={"text"}
            label={t("label_cano")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.canonical}
            name="projectLocation"
            onChange={handleChange}
            required
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
              // onClick={() =>
              //   setSelectImagesModal({
              //     isOpen: true,
              //   })
              // }
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginTop: "20px",
              }}
              component="span"
              // disabled={loading ? true : false}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("label_banner")}</span>
            </Button>
            {/* <p className="text-primary mt-2 italic">
              {allImages?.length > 0
                ? `${allImages?.length} images selected.`
                : null}
            </p> */}
          </label>
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
          <TextField
            id="slug"
            type={"text"}
            label={t("label_slug")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.slug}
            name="area"
            onChange={handleChange}
            required
          />
          <TextField
            id="meta_description"
            type={"text"}
            label={t("label_meta_desc")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.meta_description}
            name="area"
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                value={listingMeta?.is_featured}
                onClick={handleChange}
                // checked={checked}
                name="permissionCheckbox"
                id="is_featured"
                fullWidth
                inputProps={{ "aria-label": "controlled" }}
                style={{
                  color: currentMode === "dark" ? "#fff" : "#000",
                }}
              />
            }
            label={t("label_is_featured")}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={t("label_built_year")}
              value={listingMeta?.year_build_in}
              views={["year"]}
              onChange={(newValue) => {
                console.log("meeting date: ", newValue);

                const formattedDate = moment(newValue?.$d).format("YYYY");

                setListingMeta({
                  ...listingMeta,
                  year_build_in: formattedDate,
                });
              }}
              format="YYYY"
              renderInput={(params) => (
                <TextField
                  {...params}
                  onKeyDown={(e) => e.preventDefault()}
                  readOnly={true}
                  fullWidth
                  size="small"
                  sx={{
                    marginTop: "20px !important",
                  }}
                />
              )}
              minDate={dayjs().startOf("day").toDate()}
              InputProps={{ required: true }}
            />
          </LocalizationProvider>

          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
              // onClick={() =>
              //   setSelectImagesModal({
              //     isOpen: true,
              //   })
              // }
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginTop: "20px",
              }}
              component="span"
              // disabled={loading ? true : false}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("label_additional_images")}</span>
            </Button>
            {/* <p className="text-primary mt-2 italic">
              {allImages?.length > 0
                ? `${allImages?.length} images selected.`
                : null}
            </p> */}
          </label>

          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
              // onClick={() =>
              //   setSelectImagesModal({
              //     isOpen: true,
              //   })
              // }
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginTop: "20px",
              }}
              component="span"
              // disabled={loading ? true : false}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("label_og_img")}</span>
            </Button>
            {/* <p className="text-primary mt-2 italic">
              {allImages?.length > 0
                ? `${allImages?.length} images selected.`
                : null}
            </p> */}
          </label>

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
            sx={{ marginTop: "20px" }}
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

export default AddListingMeta;
