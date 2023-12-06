import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { MdFileUpload } from "react-icons/md";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Textarea } from "@material-tailwind/react";
import { t } from "i18next";

const currentDate = dayjs();

const OnBoardingForm = ({ isLoading }) => {
  const {
    currentMode,
    darkModeColors,
    formatNum,
    BACKEND_URL,
    User,
    t,
    primaryColor,
    themeBgImg,
    fontFam,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [validFromDate, setValidFromDate] = useState("");
  const [validFromDateValue, setValidFromDateValue] = useState({});
  const [validToDate, setValidToDate] = useState("");
  const [validToDateValue, setValidToDateValue] = useState({});
  const [loading, setloading] = useState(false);
  const [img, setImg] = useState();

  const [offerData, setOfferData] = useState({
    offerTitle: "",
    offerDescription: "",
    validToManager: 1,
    validToSales: 1,
  });

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("Uploaded img: ", file);

    setImg(file);
  };

  console.log("img state: ", img);

  const handleClick = async (e) => {
    e.preventDefault();

    const { offerTitle, offerDescription } = offerData;

    if (!offerTitle || !offerDescription || !validFromDate || !validToDate) {
      toast.error("Please fill all the required fields", {
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

    // check if validTo date is greater than validFrom date
    if (new Date(validToDate) < new Date(validFromDate)) {
      toast.error("Valid To date cannot be before Valid From date", {
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

    console.log("OFFer Data: ", offerData);
    console.log("OFFer Valid from: ", validFromDate);
    console.log("OFFer Valid To: ", validToDate);

    setloading(true);
    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("img: ", img);
    console.log("User", user);

    let validToSales;
    let validToManager;

    if (User?.role === 3) {
      validToSales = 1;
    } else {
      validToSales = offerData.validToSales;
      validToManager = offerData.validToManager;
    }
    const creationDate = new Date();
    const Offer = new FormData();

    Offer.append(
      "creationDate",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );
    Offer.append("offerTitle", offerData.offerTitle);
    Offer.append("offer_image", img);
    Offer.append("offerDescription", offerData.offerDescription);
    Offer.append("status", "Open");
    Offer.append("validFrom", validFromDate);
    Offer.append("validTill", validToDate);
    Offer.append("offerFrom", User?.id);
    Offer.append("offerAgency", User?.agency);
    if (User?.role !== 3) {
      Offer.append("validToManager", validToManager);
    }
    Offer.append("validToSales", validToSales);

    console.log("Offer append: ", Offer);
    console.log("Click img state: ", img);

    try {
      const submitOffer = await axios.post(`${BACKEND_URL}/offers`, Offer, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });

      console.log("OFFer submitted: ", submitOffer);

      toast.success("Offer Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setOfferData({
        offerTitle: "",
        offerDescription: "",
        validToManager: "",
        validToSales: "",
      });
      setValidFromDate("");
      setValidToDate("");

      setloading(false);
    } catch (error) {
      console.log("Error: ", error);
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

  // useEffect(() => {
  //   setValidFromDateValue(dayjs("2023-01-01"));
  //   setValidToDateValue(dayjs("2023-01-01"));
  // }, []);
  return (
    <div
      className={`p-3 rounded-lg ${
        themeBgImg &&
        (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
        <Box
          sx={{
            ...darkModeColors,
            "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
              {
                left: isLangRTL(i18n.language) ? "inherit" : "1.75rem",
                right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
              },
            "& legend": {
              textAlign: isLangRTL(i18n.language) ? "right" : "left",
            },
          }}
          className={`p-4 ${
            !themeBgImg &&
            (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
          }`}
        >
          <h3 className="text-primary text-center font-semibold text-lg">{` ${t(
            "boarding_business_details"
          )}`}</h3>
          <br></br>
          <TextField
            type={"text"}
            label={t("form_business_details")}
            className="w-full mt-3"
            style={{
              marginBottom: "20px",
            }}
            variant="outlined"
            name="offerTitle"
            size="small"
            value={offerData.offerTitle}
            onChange={(e) =>
              setOfferData({ ...offerData, offerTitle: e.target.value })
            }
            required
          />
          <TextField
            type="text"
            label={t("form_person_name")}
            className="w-full"
            name="offerDescription"
            style={{ marginBottom: "20px" }}
            variant="outlined"
            size="small"
            value={offerData.offerDescription}
            required
            onChange={(e) =>
              setOfferData({ ...offerData, offerDescription: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3 mb-1">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={`${t("offer")} ${t("label_valid_from")}`}
                className="w-full"
                style={{ marginBottom: "15px" }}
                value={validFromDateValue}
                views={["year", "month", "day"]}
                minDate={currentDate.toDate()}
                onChange={(newValue) => {
                  setValidFromDateValue(newValue);
                  setValidFromDate(
                    formatNum(newValue?.$d?.getUTCFullYear()) +
                      "-" +
                      formatNum(newValue?.$d?.getUTCMonth() + 1) +
                      "-" +
                      formatNum(newValue?.$d?.getUTCDate() + 1)
                  );
                }}
                format="yyyy-MM-dd"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onKeyDown={(e) => e.preventDefault()}
                    readOnly={true}
                    size={"small"}
                    style={{
                      marginBottom: "20px",
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={`${t("offer")} ${t("label_valid_till")}`}
                className="w-full"
                style={{ marginBottom: "15px" }}
                value={validToDateValue}
                views={["year", "month", "day"]}
                minDate={currentDate.toDate()}
                onChange={(newValue) => {
                  setValidToDateValue(newValue);
                  setValidToDate(
                    formatNum(newValue?.$d?.getUTCFullYear()) +
                      "-" +
                      formatNum(newValue?.$d?.getUTCMonth() + 1) +
                      "-" +
                      formatNum(newValue?.$d?.getUTCDate() + 1)
                  );
                }}
                format="yyyy-MM-dd"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onKeyDown={(e) => e.preventDefault()}
                    readOnly={true}
                    size={"small"}
                    style={{
                      marginBottom: "20px",
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </div>
        </Box>
        <Box sx={darkModeColors} className="p-2">
          {User?.role !== 3 && (
            <div
              className={`${
                !themeBgImg &&
                (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
              }
              } rounded-lg p-5`}
            >
              <Box
                sx={{
                  ...darkModeColors,
                  "& .MuiTypography-root": {
                    fontFamily: fontFam,
                  },
                }}
              >
                <label className="font-semibold mb-1">
                  <span className="text-primary">{`${t("offer")} ${t(
                    "label_validity"
                  )}`}</span>
                </label>
                <br></br>
                <FormControl>
                  <RadioGroup defaultValue="Both" name="radio-buttons-group">
                    <FormControlLabel
                      className="mt-1"
                      value="manager"
                      name="validToManager"
                      control={<Radio />}
                      label={t("sales_managers")}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          validToManager: 1,
                          validToSales: 0,
                        })
                      }
                    />
                    <FormControlLabel
                      className="mt-1"
                      value="agent"
                      name="validToSales"
                      control={<Radio />}
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          validToSales: 1,
                          validToManager: 0,
                        })
                      }
                      label={t("sales_agents")}
                    />
                    <FormControlLabel
                      className="mt-1"
                      value="Both"
                      onChange={(e) =>
                        setOfferData({
                          ...offerData,
                          validToSales: 1,
                          validToManager: 1,
                        })
                      }
                      control={<Radio />}
                      label={t("managers_and_agents")}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </div>
          )}

          {/* <div className="grid grid-cols-2 gap-3 mt-3"> */}
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="contained-button-file"
            type="file"
            onChange={handleImgUpload}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              size="medium"
              className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold my-3"
              style={{
                color: "#ffffff",
                border: "1px solid white",
                fontFamily: fontFam,
              }}
              component="span" // Required so the button doesn't automatically submit form
              disabled={loading ? true : false}
              startIcon={
                loading ? null : <MdFileUpload className="mx-2" size={16} />
              }
            >
              <span>{t("button_upload_image")}</span>
            </Button>
          </label>
          {/* </div> */}
        </Box>
      </div>

      <Button
        type="submit"
        size="medium"
        style={{
          color: "white",
          fontFamily: fontFam,
        }}
        className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
        onClick={handleClick}
        disabled={loading ? true : false}
      >
        {loading ? (
          <CircularProgress
            size={23}
            sx={{ color: "white" }}
            className="text-white"
          />
        ) : (
          <span>{t("create")}</span>
        )}
      </Button>
    </div>
  );
};

export default OnBoardingForm;
