import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);

  const [listingData, setlistingData] = useState({
    title: "",
    // meta_tags_for_listings_id: 2,
    listing_type_id: "",
    user_id: 3,
    listing_attribute_id: "",
    listing_arrtibute_type_id: "",
    country_id: 1,
    state_id: "",
    city_id: "",
    short_description: "",
    thumbnail: "",
    status: 1,
  });

  console.log("listing data :: ", listingData);

  const handleChange = (e) => {
    setlistingData((prevListingAttr) => ({
      ...prevListingAttr,
      [e.target.id]: e.target.value,
    }));
  };

  const fetchCountries = () => {
    axios
      .get(`${BACKEND_URL}/countries`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("countries list : ", result);
        setCountryList(result?.data?.data?.data);
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
          toast.error("Unable to fetch countries", {
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

  const FetchCitynState = () => {
    setCityLoading(true);

    const country_id = listingData.country_id;

    const citiesApi = axios.get(`${BACKEND_URL}/cities`, {
      params: { country_id },
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const statesApi = axios.get(`${BACKEND_URL}/states`, {
      params: { country_id },
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    Promise.all([citiesApi, statesApi])
      .then(([citiesResult, statesResult]) => {
        console.log("Cities: ", citiesResult.data);
        console.log("States: ", statesResult.data);

        setCityList(citiesResult?.data?.data);
        setStateList(statesResult?.data?.data);
        setCityLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setCityLoading(false);
        const error = err.response?.data?.message;

        if (error) {
          toast.error(` ${error}`, {
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
          toast.error("Unable to fetch city and state", {
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

  useEffect(() => {
    fetchCountries();
  }, []);
  useEffect(() => {
    if (listingData?.country_id) {
      FetchCitynState();
    }
  }, [listingData?.country_id]);

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
            id="title"
            type={"text"}
            label={t("title")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            value={listingData?.title}
            name="projectLocation"
            onChange={handleChange}
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
            id="country_id"
            value={{
              value: listingData?.country_id,
              label: listingData?.country_id
                ? countryList?.find(
                    (cont) => cont.id === listingData?.country_id
                  )?.name || ""
                : t("label_country"),
            }}
            onChange={(e) => {
              setlistingData({
                ...listingData,
                country_id: e.value,
              });
            }}
            options={countryList?.map((cont) => ({
              value: cont.id,
              label: cont.name,
            }))}
            className="w-full"
            placeholder={t("label_country")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="city_id"
            value={{
              value: listingData?.city_id,
              label: listingData?.city_id
                ? cityList?.find((cont) => cont.id === listingData?.city_id)
                    ?.name || ""
                : t("label_city"),
            }}
            onChange={(e) => {
              setlistingData({
                ...listingData,
                city_id: e.value,
              });
            }}
            options={cityList?.map((cont) => ({
              value: cont.id,
              label: cont.name,
            }))}
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
            value={{
              value: listingData?.state_id,
              label: listingData?.state_id
                ? stateList?.find((cont) => cont.id === listingData?.state_id)
                    ?.name || ""
                : t("state"),
            }}
            onChange={(e) => {
              setlistingData({
                ...listingData,
                state_id: e.value,
              });
            }}
            options={stateList?.map((cont) => ({
              value: cont.id,
              label: cont.name,
            }))}
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

          <input
            accept="image/*"
            style={{ display: "none" }}
            id="list-thumb"
            type="file"
            name="picture"
            onChange={(e) => {
              console.log("event of og image: ", e);

              setlistingData({
                ...listingData,
                thumbnail: e.target.files,
              });
            }}
          />

          <label htmlFor="list-thumb">
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
              <span>{t("thumbnail")}</span>
            </Button>
            <p className="text-primary mt-2 italic">
              {listingData?.thumbnail ? `thumbnail selected.` : null}
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
