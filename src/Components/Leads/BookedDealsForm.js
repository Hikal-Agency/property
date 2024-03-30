import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import momentTimeZone from "moment-timezone";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Tooltip,
  Box,
} from "@mui/material";
import Select from "react-select";
import { currencies } from "../_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import { datetimeLong } from "../_elements/formatDateTime";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";
import BlockIPModal from "./BlockIPModal";
import AddNewListingModal from "../Listings/AddNewListingModal";
import { getCountryFromNumber } from "../_elements/CountryCodeChecker";

import { VscCallOutgoing, VscMail, VscEdit } from "react-icons/vsc";
import { IoIosAlert } from "react-icons/io";
import { MdClose, MdFileUpload } from "react-icons/md";
import { BiBlock, BiBed } from "react-icons/bi";
import {
  BsShuffle,
  BsTelephone,
  BsEnvelopeAt,
  BsType,
  BsHouseGear,
  BsBuildings,
  BsTrash,
  BsBuildingGear,
  BsPersonPlus,
  BsBookmarkFill,
  BsPersonGear,
  BsChatLeftText,
  BsClockHistory,
  BsPhone,
} from "react-icons/bs";
import { selectStyles } from "../_elements/SelectStyles";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const BookedDealsForm = ({
  BookedForm,
  handleBookedFormClose,
  newFeedback,
  Feedback,
}) => {
  console.log("Booked Form: ", BookedForm);
  console.log("Booked Data: ", Feedback);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    fontFam,
    t,
    isLangRTL,
    i18n,
    primaryColor,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleBookedFormClose();
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  //   const AddNote = (note = "") => {
  //     setaddNoteloading(true);
  //     const token = localStorage.getItem("auth-token");

  //     const data = {
  //       leadId: LeadData.leadId || LeadData.id,
  //       leadNote: note || AddNoteTxt,
  //       addedBy: User?.id,
  //       addedByName: User?.userName,
  //     };
  //     axios
  //       .post(`${BACKEND_URL}/leadNotes`, data, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((result) => {
  //         console.log("Result: ");
  //         console.log("Result: ", result);
  //         setaddNoteloading(false);
  //         setAddNoteTxt("");
  //         if (!note) {
  //           toast.success("Note added Successfully", {
  //             position: "top-right",
  //             autoClose: 3000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "light",
  //           });
  //         }
  //       })
  //       .catch((err) => {
  //         setaddNoteloading(false);
  //         console.log(err);
  //         toast.error("Soemthing Went Wrong! Please Try Again", {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //       });
  //   };

  return (
    <Modal
      keepMounted
      open={BookedForm}
      // onClose={handleBookedFormClose}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      openAfterTransition
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 1000,
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
      w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
          onClick={handleClose}
          className={`${
            isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
          }
          bg-primary w-fit h-fit p-3 my-4 z-10`}
        >
          <MdClose
            size={18}
            color={"white"}
            className="hover:border hover:border-white hover:rounded-full"
          />
        </button>
        <div
          style={style}
          className={` ${
            currentMode === "dark"
              ? "bg-[#000000] text-white"
              : "bg-[#FFFFFF] text-black"
          } ${
            isLangRTL(i18n.language)
              ? currentMode === "dark" && " border-primary border-r-2"
              : currentMode === "dark" && " border-primary border-l-2"
          }
            p-4 h-[100vh] w-[80vw] overflow-y-scroll 
          `}
        >
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="w-full flex items-center pb-3 ">
                  <div
                    className={`${
                      isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                    } bg-primary h-10 w-1 rounded-full my-1`}
                  ></div>
                  <h1
                    className={`text-lg font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                    style={{
                      fontFamily: isArabic(Feedback?.feedback)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    <h1 className="font-semibold pt-3 text-lg text-center">
                      {t("want_to_change_feedback")} {t("from")}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {t(
                          "feedback_" +
                            Feedback?.feedback
                              ?.toLowerCase()
                              ?.replaceAll(" ", "_")
                        )}
                      </span>{" "}
                      {t("to")}{" "}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {t(
                          "feedback_" +
                            newFeedback?.toLowerCase()?.replaceAll(" ", "_")
                        )}
                      </span>{" "}
                      ?
                    </h1>
                  </h1>
                </div>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {/* Project DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("project_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
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
                    >
                      <TextField
                        id="project_name"
                        type={"text"}
                        label={t("label_project_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={Feedback?.project}
                        //   onChange={(e) => setLeadNotes(e.target.value)}
                        required
                      />
                      <TextField
                        id="project_name"
                        type={"text"}
                        label={t("label_enquiry_for")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={Feedback?.enquiryType}
                        //   onChange={(e) => setLeadNotes(e.target.value)}
                        required
                      />
                      <TextField
                        id="selling_amount"
                        type={"text"}
                        label={t("selling_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={Feedback?.enquiryType}
                        //   onChange={(e) => setLeadNotes(e.target.value)}
                        required
                      />
                      <TextField
                        id="unit"
                        type={"text"}
                        label={t("unit")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        // value={Feedback?.enquiryType}
                        //   onChange={(e) => setLeadNotes(e.target.value)}
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* Booked DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("booking_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                        // marginTop:"20p"
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          //   value={reportMonthValue || new Date()?.toString()}
                          label={t("booking_date")}
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
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
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
                      <TextField
                        id="project_name"
                        type={"text"}
                        label={t("booked_perc")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        // value={Feedback?.enquiryType}
                        //   onChange={(e) => setLeadNotes(e.target.value)}
                        required
                      />
                      <Select
                        id="Manager"
                        options={currencies(t)?.map((curr) => ({
                          value: curr.value,
                          label: curr.label,
                        }))}
                        value={null}
                        //   onChange={ChangeManager}
                        placeholder={t("label_select_currency")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      <TextField
                        id="booking_amount"
                        type={"text"}
                        label={t("booking_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={Feedback?.enquiryType}
                        //   onChange={(e) => setLeadNotes(e.target.value)}
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* CLIENT  DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("client_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box sx={darkModeColors} className="p-2">
                      {/* <Box
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
                        </Box> */}

                      <div className="  mb-5 flex items-center justify-center ">
                        <div className=" rounded-lg border">
                          <img
                            //   src={imagePreview}
                            width="100px"
                            height="100px"
                          />
                        </div>
                      </div>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                        //   onChange={handleImgUpload}
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
                            loading ? null : (
                              <MdFileUpload className="mx-2" size={16} />
                            )
                          }
                        >
                          <span>{t("label_passport_image")}</span>
                        </Button>
                      </label>
                    </Box>
                  </div>
                </div>
              </div>
            </>
          )}
          <Button
            type="submit"
            size="medium"
            style={{
              color: "white",
              fontFamily: fontFam,
            }}
            className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
            //   onClick={handleClick}
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
      </div>
    </Modal>
  );
};

export default BookedDealsForm;
