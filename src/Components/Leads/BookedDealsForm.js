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

import { useStateContext } from "../../context/ContextProvider";
import { datetimeLong } from "../_elements/formatDateTime";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";
import BlockIPModal from "./BlockIPModal";
import AddNewListingModal from "../Listings/AddNewListingModal";
import { getCountryFromNumber } from "../_elements/CountryCodeChecker";

import { VscCallOutgoing, VscMail, VscEdit } from "react-icons/vsc";
import { IoIosAlert } from "react-icons/io";
import { MdClose } from "react-icons/md";
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

const BookedDealsForm = ({
  BookedForm,
  handleBookedFormClose,
  newFeedback,
  Feedback,
}) => {
  console.log("Booked Form: ", BookedForm);
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
                      fontFamily: isArabic(Feedback?.leadName)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    <h1 className="font-semibold pt-3 text-lg text-center">
                      {t("want_to_change_feedback")} {t("from")}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {t(
                          "feedback_" +
                            Feedback?.toLowerCase()?.replaceAll(" ", "_")
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
                    <Select
                      id="Manager"
                      //   options={Managers.map((person) => ({
                      //     value: person.id,
                      //     label: person.userName,
                      //   }))}
                      value={null}
                      //   onChange={ChangeManager}
                      placeholder={t("label_select_manager")}
                      className={`mb-5`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                    <Select
                      id="Manager"
                      //   options={Managers.map((person) => ({
                      //     value: person.id,
                      //     label: person.userName,
                      //   }))}
                      value={null}
                      //   onChange={ChangeManager}
                      placeholder={t("label_select_manager")}
                      className={`mb-5`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
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
                    <Select
                      id="Manager"
                      //   options={Managers.map((person) => ({
                      //     value: person.id,
                      //     label: person.userName,
                      //   }))}
                      value={null}
                      isDisabled={User?.role === 3}
                      //   onChange={ChangeManager}
                      placeholder={t("label_select_manager")}
                      className={`mb-5`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
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
                    <Select
                      id="Manager"
                      //   options={Managers.map((person) => ({
                      //     value: person.id,
                      //     label: person.userName,
                      //   }))}
                      value={null}
                      //   onChange={ChangeManager}
                      placeholder={t("label_select_manager")}
                      className={`mb-5`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookedDealsForm;
