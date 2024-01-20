import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  Modal,
  Backdrop,
  CircularProgress,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  FaStripe,
  FaPaypal,
  FaUniversity,
  FaCreditCard,
  FaWallet,
} from "react-icons/fa";

import axios from "../../axoisConfig";
import Error404 from "../../Pages/Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../../Pages/App";

import { BiBed, BiBath } from "react-icons/bi";
import {
  BsImages,
  BsFiles,
  BsPen,
  BsFileEarmarkText,
  BsTrash,
} from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdLocationPin, MdClose } from "react-icons/md";
import {
  TbCurrentLocation,
  TbPhone,
  TbMail,
  TbUserCircle,
} from "react-icons/tb";
import { IoLocation } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";

import {
  FaUser,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaLinkedin,
} from "react-icons/fa";
import { IoIosMail, IoLogoYoutube } from "react-icons/io";

import usePermission from "../../utils/usePermission";
import { FaMoneyBillWave } from "react-icons/fa";
import { CountryDropdown } from "react-country-region-selector";
import AddDocumentModal from "../../Pages/listings/AddDocumentModal";

const EditClient = ({
  setOpenEdit,
  openEdit,
  FetchProperty,
  loading,
  setloading,
  client,
  singleClient,
  setSingleClient,
  fetchCrmClients,
}) => {
  console.log("edit property data (client)::: ", client);
  let project = client;
  const navigate = useNavigate();
  const [onBoardData, setBoardData] = useState({
    bussiness_name: client?.bussiness_name,
    country: client?.country,
    name_of_person: client?.name_of_person,
    contact: client?.contact,
    email: client?.email,
    logo: client?.logo,
    documents: client?.documents || [],
    account_type: client?.account_type || null,
    no_of_users: client?.no_of_users,
    payment_duration: client?.payment_duration || "monthly",
    linkedin: client?.linkedin,
    facebook: client?.facebook,
    instagram: client?.instagram,
    tiktok: client?.tiktok,
    snapchat: client?.snapchat,
    youtube: client?.youtube,
    terms_and_conditions: true,
  });

  const imagesInputRef = useRef(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [customAccountType, setCustomAccountType] = useState("");

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("Uploaded img: ", file);

    setBoardData({
      ...onBoardData,
      logo: file,
    });
  };

  const social_links = [
    {
      name: "linkedin",
      icon: <FaLinkedin color="#0A66C2" size={14} />,
    },
    {
      name: "facebook",
      icon: <FaFacebookF color="#0866FF" size={14} />,
    },
    {
      name: "instagram",
      icon: <FaInstagram color="#C40FEC" size={14} />,
    },
    {
      name: "tiktok",
      icon: <FaTiktok color="#2CF5F0" size={14} />,
    },
    {
      name: "snapchat",
      icon: <FaSnapchat color="#FFFC09" size={14} />,
    },
    {
      name: "youtube",
      icon: <IoLogoYoutube color="#FE0808" size={14} />,
    },
  ];

  const handleAddCategory = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("btnclicked==============>");
    setShowTextInput(true);
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
  // const [loading, setloading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listData, setListingData] = useState({});
  const [leadNotFound, setLeadNotFound] = useState(false);
  const { hasPermission } = usePermission();
  const [singleImageModal, setSingleImageModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });
  const [singleDocModal, setSingleDocModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });

  const [selectDocumentModal, setSelectDocumentModal] = useState({
    isOpen: false,
    listingId: null,
  });

  const [documentModal, setDocumentModal] = useState(false);

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });
  const [allDocs, setAllDocs] = useState([]);
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    t,
    themeBgImg,
    darkModeColors,
    fontFam,
  } = useStateContext();
  const [allImages, setAllImages] = useState([]);

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenEdit(false);
    }, 1000);
  };

  const handleEdit = () => {
    setOpenEdit(listData);

    // setTimeout(() => {
    //   setIsClosing(false);
    //   setOpenEdit({
    //     open: false,
    //   });
    // }, 1000);
  };
  // const { lid } = useParams();
  const lid = project?.id;
  console.log("lid ===================", lid);

  const openDoc = (open, url) => {
    window.open(url, "__blank");
  };

  let lat = "";
  let long = "";

  const handleDeleteDocument = async (id) => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const deleteDoc = await axios.delete(
        `${BACKEND_URL}/destroy/documents/${project?.id}`,
        {
          params: {
            document_id: id,
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Document deleted successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setBtnLoading(false);
      handleClose();
      FetchProperty();
    } catch (error) {
      setBtnLoading(false);
      console.log("Error", error);

      toast.error("Something went wrong!", {
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
  const fetchSingleListing = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const listing = await axios.get(`${BACKEND_URL}/projects/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("SINGLE Listings: ", listing);
      setListingData(listing?.data?.data?.data[0]);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("Error", error);
      if (error?.response?.status === 404) {
        setLeadNotFound(true);
      } else {
        toast.error("Something went wrong!", {
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
    }
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  const selectCountry = (e) => {
    setBoardData((prev) => ({
      ...prev,
      country: e,
    }));
  };

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
        `${BACKEND_URL}/onboarding/${client?.id}`,
        Board,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Client Updated : ", submitOnBoard);
      setSingleClient(submitOnBoard?.data?.data);
      fetchCrmClients();

      toast.success("Client Updated.", {
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

  return (
    <>
      {/* <div
        className={`flex min-h-screen w-full p-4 ${
          !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
        } ${currentMode === "dark" ? "text-white" : "text-black"}`}
      > */}
      <Modal
        keepMounted
        open={openEdit}
        // onClose={handleCloseTimelineModel}
        onClose={handleClose}
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
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
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
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } p-4 h-[100vh] w-[80vw] overflow-y-scroll `}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                {leadNotFound ? (
                  <Error404 />
                ) : (
                  <div className="w-full">
                    <div
                      className={`p-3 rounded-lg ${
                        themeBgImg &&
                        (currentMode === "dark"
                          ? "blur-bg-dark"
                          : "blur-bg-light")
                      }`}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 py-5">
                        <Box
                          sx={{
                            ...darkModeColors,
                            "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                              {
                                right: isLangRTL(i18n.language)
                                  ? "2.5rem"
                                  : "inherit",
                                transformOrigin: isLangRTL(i18n.language)
                                  ? "right"
                                  : "left",
                              },
                            "& legend": {
                              textAlign: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          }}
                          className={`p-4 ${
                            !themeBgImg &&
                            (currentMode === "dark"
                              ? "bg-[#1c1c1c]"
                              : "bg-[#EEEEEE]")
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
                              setBoardData({
                                ...onBoardData,
                                bussiness_name: e.target.value,
                              })
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
                              padding: "6px 8px",
                              border: `1px solid ${
                                currentMode === "dark" ? "#fff" : "#000"
                              }`,
                              background: "none",
                              marginBottom: "20px",
                            }}
                          />

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
                              setBoardData({
                                ...onBoardData,
                                name_of_person: e.target.value,
                              })
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
                                setBoardData({
                                  ...onBoardData,
                                  contact: e.target.value,
                                })
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
                                setBoardData({
                                  ...onBoardData,
                                  email: e.target.value,
                                })
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
                                    currentMode === "dark"
                                      ? "text-white"
                                      : "text-dark"
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
                                onClick={() => {
                                  setDocumentModal(true);
                                }}
                                disabled={loading ? true : false}
                              >
                                <span>{t("form_document")}</span>
                              </Button>
                              <p className="text-primary mt-2 italic">
                                {allDocs?.length > 0
                                  ? `${allDocs?.length} documents selected.`
                                  : null}
                              </p>
                            </label>
                          </div>
                        </Box>
                        <div
                          className={`${
                            !themeBgImg &&
                            (currentMode === "dark"
                              ? "bg-[#1c1c1c]"
                              : "bg-[#EEEEEE]")
                          }
              } rounded-lg p-5`}
                        >
                          <Box
                            sx={{
                              ...darkModeColors,
                              "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                                {
                                  right: isLangRTL(i18n.language)
                                    ? "2.5rem"
                                    : "inherit",
                                  transformOrigin: isLangRTL(i18n.language)
                                    ? "right"
                                    : "left",
                                },
                              "& legend": {
                                textAlign: isLangRTL(i18n.language)
                                  ? "right"
                                  : "left",
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
                                  setBoardData((prevData) => ({
                                    ...prevData,
                                    [social?.name]: e.target.value,
                                  }))
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
                          (currentMode === "dark"
                            ? "bg-[#1c1c1c]"
                            : "bg-[#EEEEEE]")
                        }
              } rounded-lg p-5`}
                      >
                        <Box
                          sx={{
                            ...darkModeColors,
                            "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                              {
                                right: isLangRTL(i18n.language)
                                  ? "2.5rem"
                                  : "inherit",
                                transformOrigin: isLangRTL(i18n.language)
                                  ? "right"
                                  : "left",
                              },
                            "& legend": {
                              textAlign: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
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
                                value={onBoardData?.account_type || ""}
                                onChange={(e) => {
                                  console.log(
                                    "print on changes:: ",
                                    e.target.value
                                  );
                                  setBoardData({
                                    ...onBoardData,
                                    account_type: e.target.value,
                                  });
                                }}
                                displayEmpty
                                select
                                required
                              >
                                {accountTypes?.map((type) => (
                                  <MenuItem
                                    key={type?.value}
                                    value={type?.value}
                                  >
                                    {type?.icon}
                                    {type?.label}
                                  </MenuItem>
                                ))}

                                <MenuItem value={onBoardData?.account_type}>
                                  {onBoardData?.account_type}
                                </MenuItem>
                                {!showTextInput && (
                                  <MenuItem>
                                    <span
                                      className="fw-bold ml-4 cursor-pointer mt-3"
                                      onClick={handleAddCategory}
                                      sx={{ marginLeft: "200px" }}
                                    >
                                      + {t("form_account_custom")}
                                    </span>
                                  </MenuItem>
                                )}
                                {showTextInput ? (
                                  <>
                                    <MenuItem
                                      onKeyDown={(e) => e.stopPropagation()}
                                    >
                                      <TextField
                                        placeholder={t(
                                          "form_account_custom_placeholder"
                                        )}
                                        value={customAccountType}
                                        onChange={(e) =>
                                          setCustomAccountType(e.target.value)
                                        }
                                        fullWidth
                                      />
                                    </MenuItem>
                                    <Button
                                      size="medium"
                                      className="bg-btn-primary text-white rounded-lg py-3 font-semibold mb-3 ml-5"
                                      style={{ color: "#ffffff" }}
                                      sx={{ marginLeft: "20px" }}
                                      onClick={handleCreateCustomAccountType}
                                    >
                                      <span>{t("btn_add")}</span>
                                    </Button>
                                  </>
                                ) : (
                                  ""
                                )}
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
                            </div>
                            <div className="px-4">
                              <FormControl>
                                <FormLabel
                                  id="demo-radio-buttons-group-label"
                                  className={`${
                                    currentMode === "dark"
                                      ? "#ffffff"
                                      : "#000000"
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
                      {onBoardData?.terms_and_conditions == true ? (
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
                            <span>{t("update_client")}</span>
                          )}
                        </Button>
                      ) : (
                        ""
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
                  </div>
                )}
                {/* <Footer /> */}
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default EditClient;
