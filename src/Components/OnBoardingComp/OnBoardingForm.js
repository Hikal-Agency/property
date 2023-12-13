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
  MenuItem,
  InputAdornment,
  Checkbox,
  FormLabel,
} from "@mui/material";
import { FaLinkedin } from "react-icons/fa";

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
import { ImFacebook2 } from "react-icons/im";
import { FaInstagramSquare, FaTiktok, FaSnapchat } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import {
  CountryDropdown,
  RegionDropdown,
  CountryRegionData,
} from "react-country-region-selector";
import { FaStripe, FaPaypal, FaUniversity, FaCreditCard } from "react-icons/fa";
import { useRef } from "react";

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

  const [country, setCountry] = useState("");
  const imagesInputRef = useRef(null);

  const [onBoardData, setBoardData] = useState({
    bussiness_name: "",
    country: "",
    name_of_person: "",
    contact: "",
    email: "",
    logo: "",
    documents: [],
    account_type: "",
    no_of_users: "",
    payment_duration: "monthly",
  });

  const selectCountry = (e) => {
    setBoardData((prev) => ({
      ...prev,
      country: e,
    }));
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("Uploaded img: ", file);

    setBoardData({
      ...onBoardData,
      logo: file,
    });
  };

  console.log("img state: ", img);

  const handleClick = async (e) => {
    e.preventDefault();

    const { bussiness_name, country } = onBoardData;

    if (!bussiness_name || !country) {
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

    console.log("OFFer Data: ", onBoardData);

    setloading(true);
    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user"));

    const creationDate = new Date();
    const Board = new FormData();

    Board.append(
      "creationDate",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );
    Board.append("bussiness_name", onBoardData.bussiness_name);
    // Board.append("offer_image", img);
    Board.append("country", onBoardData.country);
    Board.append("name_of_person", onBoardData.name_of_person);
    Board.append("contact", onBoardData.contact);
    Board.append("email", onBoardData.email);
    Board.append("account_type", onBoardData?.account_type);
    Board.append("no_of_users", onBoardData?.no_of_users);
    Board.append("payment_duration", onBoardData?.payment_duration);
    Board.append("logo", onBoardData?.logo);

    social_links.forEach((social) => {
      const socialLinkValue = onBoardData[social?.name];
      if (socialLinkValue) {
        Board.append(social.name, socialLinkValue);
      }
    });

    try {
      const submitOnBoard = await axios.post(
        `${BACKEND_URL}/onboarding/store`,
        Board,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Client request submitted: ", submitOnBoard);

      toast.success("Registeration Successfull.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setBoardData({
        bussiness_name: "",
        country: "",
        name_of_person: "",
        contact: "",
        email: "",
        account_type: "",
        no_of_users: "",
        documents: [],
        logo: "",
        payment_duration: "monthly",
      });

      social_links.forEach((social) => {
        const socialLinkValue = onBoardData[social?.name];
        if (socialLinkValue) {
          setBoardData({
            socialLinkValue: "",
          });
        }
      });

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

  const social_links = [
    {
      name: "linkedin",
      icon: <FaLinkedin color="#0A66C2" size={20} />,
    },
    {
      name: "facebook",
      icon: <ImFacebook2 color="#0866FF" size={20} />,
    },
    {
      name: "instagram",
      icon: <FaInstagramSquare color="#C40FEC" size={20} />,
    },
    {
      name: "tiktok",
      icon: <FaTiktok color="#2CF5F0" size={20} />,
    },
    {
      name: "snapchat",
      icon: <FaSnapchat color="#FFFC09" size={20} />,
    },
    {
      name: "youtube",
      icon: <IoLogoYoutube color="#FE0808" size={20} />,
    },
  ];

  return (
    <div
      className={`p-3 rounded-lg ${
        themeBgImg &&
        (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 py-5">
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
          } col-span-2`}
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
            name="bussiness_name"
            size="small"
            value={onBoardData.bussiness_name}
            onChange={(e) =>
              setBoardData({ ...onBoardData, bussiness_name: e.target.value })
            }
            required
          />
          <CountryDropdown
            value={onBoardData?.country}
            onChange={selectCountry}
            label={t("form_country")}
            className="country-dropdown-container"
            style={{
              width: "100%",
              borderRadius: "5px",
              padding: "6px 4px",
              border: `1px solid ${currentMode === "dark" ? "#fff" : "#000"}`,
              background: "none",
              marginBottom: "20px",
              color: "#000 ",
            }}
          />
          {/* <TextField
            id="enquiry"
            label={t("form_country")}
            size="small"
            value={onBoardData?.country}
            className="w-full"
            sx={{
              "&": {
                marginBottom: "1.25rem !important",
              },
            }}
            displayEmpty
            select
          >
            <MenuItem value={"Studio"}>{t("enquiry_studio")}</MenuItem>
          </TextField> */}
          <TextField
            type="text"
            label={t("form_person_name")}
            className="w-full"
            name="name_of_person"
            style={{ marginBottom: "20px" }}
            variant="outlined"
            size="small"
            value={onBoardData.name_of_person}
            required
            onChange={(e) =>
              setBoardData({ ...onBoardData, name_of_person: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3 mb-1">
            <TextField
              type="text"
              label={t("form_person_contact")}
              className="w-full"
              name="contact"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="small"
              value={onBoardData.contact}
              required
              onChange={(e) =>
                setBoardData({ ...onBoardData, contact: e.target.value })
              }
            />
            <TextField
              type="email"
              label={t("form_email_address")}
              className="w-full"
              name="email"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="small"
              value={onBoardData.email}
              required
              onChange={(e) =>
                setBoardData({ ...onBoardData, email: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-1">
            <label htmlFor="contained-button-file">
              <Button
                variant="contained"
                size="lg"
                className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                style={{
                  // backgroundColor: "#111827",
                  color: "#ffffff",
                  // border: "1px solid #DA1F26",
                }}
                component="span"
                disabled={loading ? true : false}
                onClick={() => {
                  imagesInputRef.current?.click();
                }}
                // startIcon={loading ? null : <MdFileUpload />}
              >
                <span>{t("form_logo")}</span>
              </Button>
              {onBoardData?.logo && (
                <span
                  className={`text-sm italic  mt-3 ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  logo selected.
                </span>
              )}
            </label>
            <input
              type="file"
              alt=""
              hidden
              ref={imagesInputRef}
              onInput={handleImgUpload}
            />

            <label htmlFor="contained-button-document">
              <Button
                variant="contained"
                size="lg"
                className="min-w-fit bg-main-red-color border-primary w-full text-white rounded-lg py-3 bg-btn-primary font-semibold my-3"
                style={{
                  color: "#ffffff",
                }}
                component="span"
                disabled={loading ? true : false}
              >
                <span>{t("form_document")}</span>
              </Button>
            </label>
          </div>
        </Box>
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
            className="p-2"
          >
            <h3 className="text-primary text-center font-semibold text-lg">{` ${t(
              "boarding_social_profiles"
            )}`}</h3>
            <br></br>

            {social_links?.map((social) => (
              <TextField
                type={"text"}
                className="w-full mt-3"
                style={{
                  marginBottom: "20px",
                }}
                variant="outlined"
                name={social?.name}
                size="small"
                value={onBoardData[social?.name]}
                onChange={(e) =>
                  setBoardData({
                    ...onBoardData,
                    [social?.name]: e.target.value,
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {social?.icon}
                    </InputAdornment>
                  ),
                }}
              />
            ))}
          </Box>
        </div>
      </div>

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
          className="p-2"
        >
          <h3 className="text-primary text-center font-semibold text-lg">{` ${t(
            "form_account_details"
          )}`}</h3>
          <br></br>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
            <div>
              <TextField
                id="enquiry"
                label={t("form_account_type")}
                size="small"
                className="w-full"
                sx={{
                  "&": {
                    marginBottom: "1.25rem !important",
                  },
                }}
                value={onBoardData?.account_type}
                onChange={(e) =>
                  setBoardData({ ...onBoardData, account_type: e.target.value })
                }
                displayEmpty
                select
              >
                <MenuItem value={"stripe"}>
                  <FaStripe
                    size={30}
                    color="blue"
                    style={{ marginRight: "10px" }}
                  />
                  {t("form_account_stripe")}
                </MenuItem>
                <MenuItem value={"paypal"}>
                  <FaPaypal
                    size={20}
                    color="blue"
                    style={{ marginRight: "10px" }}
                  />

                  {t("form_account_paypal")}
                </MenuItem>

                <MenuItem value={"credit"}>
                  <FaCreditCard
                    size={20}
                    color="blue"
                    style={{ marginRight: "10px" }}
                  />

                  {t("form_account_credit")}
                </MenuItem>
                <MenuItem value={"bank"}>
                  <FaUniversity
                    size={20}
                    color="blue"
                    style={{ marginRight: "10px" }}
                  />

                  {t("form_account_bank")}
                </MenuItem>
              </TextField>
              <TextField
                type="number"
                label={t("form_account_usersList")}
                className="w-full"
                name="no_of_users"
                style={{ marginBottom: "20px" }}
                variant="outlined"
                size="small"
                value={onBoardData.no_of_users}
                required
                onChange={(e) =>
                  setBoardData({
                    ...onBoardData,
                    no_of_users: e.target.value,
                  })
                }
              />

              <FormControlLabel
                onChange={(e) =>
                  setBoardData({ ...onBoardData, email: e.target.value })
                }
                control={<Checkbox defaultChecked />}
                label="Terms And Condition"
              />
            </div>
            <div className="px-4">
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  className={`${
                    currentMode === "dark" ? "#ffffff" : "#000000"
                  }`}
                >
                  Payment Duration
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="monthly"
                  name="radio-buttons-group"
                  onChange={(e) =>
                    setBoardData({
                      ...onBoardData,
                      payment_duration: e.target.value,
                    })
                  }
                >
                  <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label="123 AED Monthly"
                  />
                  <FormControlLabel
                    value="yearly"
                    control={<Radio />}
                    label="123 AED Yearly"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
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
