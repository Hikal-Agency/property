import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import Select from "react-select";
import { selectStyles } from "../../../Components/_elements/SelectStyles";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import dayjs from "dayjs";
import AddImageModal from "../../../Pages/listings/AddImageModal";
import ListingDataGrid from "../ListingDataGrid";
const AddListingMeta = ({ data, setData, loading, setLoading }) => {
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
  const [listings, setAllListings] = useState([]);
  const [listingLoading, setListingLoading] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [listingMeta, setListingMeta] = useState({
    new_listing_id: "",
    long_description: "",
    year_build_in: "",
    promo_video: "",
    is_featured: 0,
    meta_title: "",
    meta_keywords: "",
    meta_description: "",

    banner: "",
    additional_gallery: [],
  });

  console.log("listingMeta: ", listingMeta);

  const fetchListings = () => {
    setListingLoading(true);
    axios
      .get(`${BACKEND_URL}/new-listings`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setListingLoading(false);
        console.log("listings list : ", result);
        setAllListings(result?.data?.data);
      })
      .catch((err) => {
        setListingLoading(false);
        console.error("error:: ", err);
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
          toast.error("Unable to fetch listings", {
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

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    gallery: null,
  });

  const handleChange = (e) => {
    console.log("chekcbox:::", e.target.value);

    setListingMeta((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const handleCheckboxChange = (event) => {
    console.log("checkbox: ", event.target.checked);
    setListingMeta({
      ...listingMeta,
      is_featured: event.target.checked ? 1 : 0,
    });
  };

  const AddListMeta = () => {
    setBtnLoading(true);

    const listingMetaData = {
      ...listingMeta,
      additional_gallery: allImages,
    };

    console.log("sending meta data:: ", listingMetaData);

    axios
      .post(`${BACKEND_URL}/meta-tags-for-listings`, listingMetaData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("listing ,eta added : ", result);
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
          long_description: "",
          year_build_in: "",
          promo_video: "",
          is_featured: "",
          meta_title: "",
          meta_keywords: "",
          meta_description: "",

          banner: "",
          additional_gallery: [],
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

  useEffect(() => {
    fetchListings();
  }, []);

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
            id="new_listing_id"
            value={{
              value: listingMeta?.new_listing_id,
              label: listingMeta?.new_listing_id
                ? listings?.find(
                    (list) => list.id === listingMeta?.new_listing_id
                  )?.title || ""
                : t("menu_listings"),
            }}
            onChange={(e) => {
              setListingMeta({
                ...listingMeta,
                new_listing_id: e.value,
              });
            }}
            options={listings?.map((list) => ({
              value: list.id,
              label: list.title,
            }))}
            isLoading={listingLoading}
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

          <input
            accept="video/*"
            style={{ display: "none" }}
            id="promo-video-file"
            type="file"
            name="video"
            onChange={(e) => {
              console.log("event of video file: ", e);

              setListingMeta({
                ...listingMeta,
                promo_video: e.target.files[0],
              });
            }}
          />
          <label htmlFor="promo-video-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary text-white rounded-lg py-3 border-primary font-semibold my-3"
              style={{
                fontFamily: fontFam,
                color: "#ffffff",
                marginBottom: "10px",
              }}
              component="span"
            >
              <span>{t("label_promo_video")}</span>
            </Button>
            <p className="text-primary mt-2 italic">
              {listingMeta?.promo_video ? `Promo video selected.` : null}
            </p>
          </label>

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

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="banner-image-file"
            type="file"
            name="picture"
            onChange={(e) => {
              console.log("event of og image: ", e);

              setListingMeta({
                ...listingMeta,
                banner: e.target.files[0],
              });
            }}
          />
          <label htmlFor="banner-image-file">
            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3 "
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
            <p className="text-primary mt-2 italic">
              {listingMeta?.banner ? `banner image selected.` : null}
            </p>
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
          <TextField
            id="meta_keywords"
            type={"text"}
            label={t("label_meta_keywords")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingMeta?.meta_keywords}
            name="area"
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                value={listingMeta?.is_featured}
                onChange={handleCheckboxChange}
                checked={listingMeta?.is_featured}
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
              onClick={() =>
                setSelectImagesModal({
                  isOpen: true,
                  gallery: true,
                })
              }
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
            <p className="text-primary mt-2 italic">
              {allImages?.length > 0
                ? `${allImages?.length} images selected.`
                : null}
            </p>
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
            onClick={AddListMeta}
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
        {selectImagesModal?.isOpen && (
          <AddImageModal
            selectImagesModal={selectImagesModal}
            handleClose={() => setSelectImagesModal({ isOpen: false })}
            allImages={allImages}
            setAllImages={setAllImages}
          />
        )}

        {/* <div className=" mt-5">
          <ListingDataGrid
            data={data}
            setData={setData}
            column={columns}
            // setColumn={setColumn}
            type="list_type"
          />
        </div> */}
      </div>
    </div>
  );
};

export default AddListingMeta;
