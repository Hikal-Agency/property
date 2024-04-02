import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import Select from "react-select";
// import { Select as libSelect } from "@mui/material";
import { FaHome } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { ImFacebook2 } from "react-icons/im";
import { FaInstagramSquare, FaTiktok, FaSnapchat } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { CountryDropdown } from "react-country-region-selector";
import { FaStripe, FaPaypal, FaUniversity, FaCreditCard } from "react-icons/fa";
import { useRef } from "react";
import { FaWallet } from "react-icons/fa";
import {
  currencies,
  payment_source,
  transaction_type,
} from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";

const currentDate = dayjs();

const Transactions = ({ isLoading }) => {
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
  const [showTextInput, setShowTextInput] = useState(false);
  const [img, setImg] = useState();

  const token = localStorage.getItem("auth-token");
  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUSer] = useState(null);
  const searchRef = useRef("");

  const fetchUsers = async (keyword = "", pageNo = 1) => {
    console.log("keyword: ", keyword);
    if (!keyword) {
      setUserLoading(true);
    }
    try {
      let url = "";
      if (keyword) {
        url = `${BACKEND_URL}/users?title=${keyword}`;
      } else {
        url = `${BACKEND_URL}/users?page=${pageNo}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      setUser(response?.data?.managers?.data);
      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
      console.log(error);
      toast.error("Unable to fetch users.", {
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
    terms_and_conditions: true,
  });
  const [allDocs, setAllDocs] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);
  const [customAccountType, setCustomAccountType] = useState("");

  const selectCountry = (e) => {
    setBoardData((prev) => ({
      ...prev,
      country: e,
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("btnclicked==============>");
    setShowTextInput(true);
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("Uploaded img: ", file);

    setBoardData({
      ...onBoardData,
      logo: file,
    });
  };

  const [accountTypes, setAccountTypes] = useState([
    {
      value: "stripe",
      label: "Stripe",
      icon: <FaStripe size={30} color="#635bff" className="mr-2" />,
    },
    {
      value: "paypal",
      label: "PayPal",
      icon: <FaPaypal size={20} color="#00207d" className="mr-2" />,
    },
    {
      value: "credit",
      label: "Credit Card",
      icon: <FaCreditCard size={20} color="#dd2122" className="mr-2" />,
    },
    {
      value: "bank",
      label: "Bank",
      icon: <FaUniversity size={20} color="black" className="mr-2" />,
    },
  ]);
  const handleCreateCustomAccountType = () => {
    if (customAccountType.trim() !== "") {
      setAccountTypes((prevTypes) => [
        ...prevTypes,
        {
          value: customAccountType.toLowerCase(),
          label: customAccountType,
          icon: <FaWallet size={20} color="green" className="mr-2" />,
        },
      ]);
      setCustomAccountType("");
      setShowTextInput(false);
    }
  };

  console.log("img state: ", img);

  const handleClick = async (e) => {
    e.preventDefault();

    const {
      bussiness_name,
      country,
      account_type,
      contact,
      name_of_person,
      no_of_users,
      email,
    } = onBoardData;

    if (
      !bussiness_name ||
      !country ||
      !account_type ||
      !contact ||
      !name_of_person ||
      !no_of_users ||
      !email
    ) {
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
    Board.append("terms_and_conditions", onBoardData?.terms_and_conditions);

    social_links.forEach((social) => {
      const socialLinkValue = onBoardData[social?.name];
      if (socialLinkValue) {
        Board.append(social.name, socialLinkValue);
      }
    });

    if (allDocs?.length > 0)
      allDocs?.forEach((doc, index) => {
        Board.append(`documents[${index}]`, doc);
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
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 py-5">
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
          className={`p-4 ${
            !themeBgImg &&
            (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
          }`}
        >
          <h3 className="text-primary text-center font-semibold text-lg">{` ${t(
            "new_transaction"
          )}`}</h3>
          <br></br>
          <Select
            id="Manager"
            options={transaction_type(t)?.map((trans) => ({
              value: trans.value,
              label: trans.label,
            }))}
            value={null}
            //   onChange={ChangeManager}
            placeholder={t("type")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Manager"
            options={transaction_type(t)?.map((trans) => ({
              value: trans.value,
              label: trans.label,
            }))}
            value={null}
            //   onChange={ChangeManager}
            placeholder={t("category")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <CountryDropdown
            value={onBoardData?.country}
            onChange={selectCountry}
            label={t("form_country")}
            className="country-dropdown-container"
            style={{
              width: "100%",
              borderRadius: "5px",
              padding: "6px 8px",
              border: `1px solid ${currentMode === "dark" ? "#fff" : "#000"}`,
              background: "none",
              marginBottom: "20px",
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              //   value={reportMonthValue || new Date()?.toString()}
              label={t("date")}
              views={["month", "year"]}
              //   onChange={(newValue) => {
              //     if (newValue) {
              //       // Extract the month digit
              //       const monthDigit = moment(newValue.$d).format(
              //         "M"
              //       );

              //       // Convert the month digit string to an integer
              //       const monthDigitInt = parseInt(monthDigit, 10);
              //       console.log(
              //         "month digit int :: ",
              //         typeof monthDigitInt
              //       );

              //       // Extract the year
              //       const year = moment(newValue.$d).format("YYYY");

              //       // Set the report month digit as an integer and the year
              //       setReportMonth({
              //         month: monthDigitInt,
              //         year: parseInt(year, 10),
              //       });
              //     }
              //     console.log("val:", newValue);

              //     setReportMonthValue(newValue?.$d);
              //   }}
              format="MM-YYYY"
              renderInput={(params) => (
                <TextField
                  sx={{
                    "& input": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                    "& .MuiSvgIcon-root": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                    marginBottom: "15px",
                  }}
                  fullWidth
                  size="small"
                  {...params}
                  onKeyDown={(e) => e.preventDefault()}
                  readOnly={true}
                />
              )}
              maxDate={dayjs().startOf("day").toDate()}
            />
          </LocalizationProvider>
          <Select
            id="Manager"
            options={[
              {
                value: "paid",
                label: t("payment_paid"),
              },
              {
                value: "unpaid",
                label: t("payment_unpaid"),
              },
            ]}
            value={null}
            //   onChange={ChangeManager}
            placeholder={t("status")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Manager"
            options={payment_source(t)?.map((payment) => ({
              value: payment.value,
              label: payment.label,
            }))}
            value={null}
            //   onChange={ChangeManager}
            placeholder={t("payment_source")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Manager"
            options={payment_source(t)?.map((payment) => ({
              value: payment.value,
              label: payment.label,
            }))}
            value={null}
            //   onChange={ChangeManager}
            placeholder={t("vendor")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />

          <Select
            id="Manager"
            options={currencies(t)?.map((curr) => ({
              value: curr.value,
              label: curr.label,
            }))}
            value={null}
            //   onChange={ChangeManager}
            placeholder={t("label_currency")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            type={"text"}
            label={t("percent")}
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
          <TextField
            type={"text"}
            label={t("amount")}
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

          <Button
            variant="contained"
            size="lg"
            className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
            style={{
              // backgroundColor: "#111827",
              color: "#ffffff",
              // border: "1px solid #DA1F26",
            }}
            // component="span"
            disabled={loading ? true : false}
            onClick={() => {
              imagesInputRef.current?.click();
            }}
            // startIcon={loading ? null : <MdFileUpload />}
          >
            <span>{t("btn_new_transaction")}</span>
          </Button>
        </Box>
        <div>
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
            className="p-2"
          >
            <div>
              <p>29 March,2024</p>
              <div className="flex items-center justify-between my-3">
                <div>
                  <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                      <span className="border rounded-md p-3 mr-3">
                        <FaHome size={20} />
                      </span>
                      <p>Vendor Name</p>
                    </div>
                    <p className="text-sm self-start pl-[calc(20px+2rem)]">
                      Commission
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-green-600">+ AED 50000</p>
                </div>
              </div>
            </div>
          </Box>
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
              "btn_filters"
            )}`}</h3>
            <br></br>

            <Select
              id="Manager"
              options={transaction_type(t)?.map((trans) => ({
                value: trans.value,
                label: trans.label,
              }))}
              value={null}
              //   onChange={ChangeManager}
              placeholder={t("type")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <Select
              id="Manager"
              options={transaction_type(t)?.map((trans) => ({
                value: trans.value,
                label: trans.label,
              }))}
              value={null}
              //   onChange={ChangeManager}
              placeholder={t("category")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <CountryDropdown
              value={onBoardData?.country}
              onChange={selectCountry}
              label={t("form_country")}
              className="country-dropdown-container"
              style={{
                width: "100%",
                borderRadius: "5px",
                padding: "6px 8px",
                border: `1px solid ${currentMode === "dark" ? "#fff" : "#000"}`,
                background: "none",
                marginBottom: "20px",
              }}
            />

            <Select
              id="Manager"
              options={[
                {
                  value: "paid",
                  label: t("payment_paid"),
                },
                {
                  value: "unpaid",
                  label: t("payment_unpaid"),
                },
              ]}
              value={null}
              //   onChange={ChangeManager}
              placeholder={t("status")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <Select
              id="Manager"
              options={payment_source(t)?.map((payment) => ({
                value: payment.value,
                label: payment.label,
              }))}
              value={null}
              //   onChange={ChangeManager}
              placeholder={t("payment_source")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <Select
              id="Manager"
              options={payment_source(t)?.map((payment) => ({
                value: payment.value,
                label: payment.label,
              }))}
              value={null}
              //   onChange={ChangeManager}
              placeholder={t("vendor")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />

            <Select
              id="Manager"
              options={currencies(t)?.map((curr) => ({
                value: curr.value,
                label: curr.label,
              }))}
              value={null}
              //   onChange={ChangeManager}
              placeholder={t("label_currency")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <TextField
              type={"text"}
              label={t("percent")}
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
            <TextField
              type={"text"}
              label={t("amount")}
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

            <Button
              variant="contained"
              size="lg"
              className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
              style={{
                // backgroundColor: "#111827",
                color: "#ffffff",
                // border: "1px solid #DA1F26",
              }}
              // component="span"
              disabled={loading ? true : false}
              onClick={() => {
                imagesInputRef.current?.click();
              }}
              // startIcon={loading ? null : <MdFileUpload />}
            >
              <span>{t("clear_all")}</span>
            </Button>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
