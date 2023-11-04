import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai";
import {
  Box,
  TextField,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Modal,
  Backdrop
} from "@mui/material";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { datetimeLong } from "../../Components/_elements/formatDateTime";
import Timeline from "../timeline";

import { 
  BiBlock, 
  BiBed 
} from "react-icons/bi";
import {
  BsShuffle,
  BsTrash,
  BsBuildingGear,
  BsPersonCircle,
  BsTelephone,
  BsEnvelopeAt,
  BsType,
  BsBuildings,
  BsHouse,
  BsBookmarkFill,
  BsChatLeftText,
  BsPersonPlus,
  BsPersonGear,
  BsHouseGear,
} from "react-icons/bs";
import {
  MdClose
} from "react-icons/md";
import { 
  VscCallOutgoing,
  VscMail
} from "react-icons/vsc";
import { TbLanguage, TbPhone, TbBuildingCommunity } from "react-icons/tb";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const SingleLeadModal = ({
  singleLeadModelOpen,
  handleCloseSingleLeadModel,
  LeadID
}) => {
  const [loading, setloading] = useState(true);
  const [LeadData, setLeadData] = useState({});
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [LeadNotesData, setLeadNotesData] = useState(null);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const [timelinePopup, setTimelinePopup] = useState({ isOpen: false });

  const {
    currentMode,
    setopenBackDrop,
    User,
    BACKEND_URL,
    darkModeColors,
    isArabic,
    t,
    isLangRTL,
    i18n
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseSingleLeadModel();
    }, 1000);
  }

  const lid = LeadID;

  const fetchLeadNotes = async () => {
    const token = localStorage.getItem("auth-token");
    await axios
      .get(`${BACKEND_URL}/leadNotes/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("lead notes are given below");
        console.log(result);
        setLeadNotesData(result.data);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddNote = () => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");
    const data = {
      leadId: LeadData.id,
      leadNote: AddNoteTxt,
      addedBy: User?.id,
      // creationDate: moment(new Date()).format("YYYY/MM/DD"),
      // creationDate: datetimeString,
    };
    console.log("Data: ");
    console.log("Data: ", data);
    axios
      .post(`${BACKEND_URL}/leadNotes`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setaddNoteloading(false);
        setAddNoteTxt("");
        fetchLeadNotes();
        toast.success("Note added Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // console.log(result);
      })
      .catch((err) => {
        setaddNoteloading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const fetchSingleLead = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/leads/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("SINGLE LEAD: ", result);
      setLeadData(result.data.data);
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

  useEffect(() => {
    console.log("Lead::", LeadData);
    if (LeadData?.id) {
      fetchLeadNotes();
      // console.log("LEAD DATA::::::::::::::::::::", LeadData);
    }
  }, [LeadData]);

  // Replace last 4 digits with "*"
  const stearics =
    LeadData?.leadContact?.replaceAll(" ", "")?.slice(0, LeadData?.leadContact?.replaceAll(" ", "")?.length - 4) + "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = LeadData?.leadContact?.replaceAll(" ", "");
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = LeadData?.leadContact?.replaceAll(" ", "");
  }

  useEffect(() => {
    setopenBackDrop(false);
    fetchSingleLead(lid);
    // eslint-disable-next-line
  }, []);

  const EmailButton = ({ email }) => {
    // console.log("email:::::::::::::::::::: ", email);
    const handleEmailClick = (event) => {
      event.stopPropagation();
      window.location.href = `mailto:${email}`;
    };

    return (
      <button className="email-button" onClick={handleEmailClick}>
        <VscMail size={16} />
      </button>
    );
  };

  const CallButton = ({ phone }) => {
    const handlePhoneClick = (event) => {
      event.stopPropagation();
      window.location.href = `tel:${phone}`;
    };

    return (
      <button className="call-button" onClick={handlePhoneClick}>
        <VscCallOutgoing size={16} />
      </button>
    );
  };

  return (
    <>
      <Modal
        keepMounted
        open={singleLeadModelOpen}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={`${isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"} ${isClosing ? (isLangRTL(i18n.language) ? "modal-close-left" : "modal-close-right") : ""}
        w-[100vw] h-[100vh] flex items-start justify-end `}>
          <button
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
            className={`${isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"}
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
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${isLangRTL(i18n.language) ? (currentMode === "dark" && " border-primary border-r-2") : (currentMode === "dark" && " border-primary border-l-2")} 
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div>
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="w-full flex items-center pb-3 ">
                    <div className={`${isLangRTL(i18n.language) ? "ml-2" : "mr-2"}
                    bg-primary w-fit rounded-md my-1 py-1 px-2 text-white flex items-center justify-center`}>
                      {LeadData?.id}
                    </div>
                    <h1
                      className={`text-lg font-semibold ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                      style={{
                        fontFamily: isArabic(LeadData?.leadName)
                          ? "Noto Kufi Arabic"
                          : "inherit",
                      }}
                    >
                      {LeadData?.leadName}
                    </h1>
                  </div>

                  <div className="w-full flex justify-end items-center">
                    {/* CALL  */}
                    <Tooltip title="Call" arrow>
                      <p
                        style={{ cursor: "pointer" }}
                        className={`${
                          currentMode === "dark"
                            ? "text-[#FFFFFF] bg-[#262626]"
                            : "text-[#1C1C1C] bg-[#EEEEEE]"
                        } hover:bg-green-600 hover:text-white rounded-full shadow-none p-1.5 mx-1 flex items-center`}
                      >
                        <CallButton phone={LeadData?.leadContact} />
                      </p>
                    </Tooltip>

                    {/* EMAIL  */}
                    {LeadData?.leadEmail === "" ||
                    LeadData?.leadEmail === "null" ||
                    LeadData?.leadEmail === "undefined" ||
                    LeadData?.leadEmail === "-" ||
                    LeadData?.leadEmail === null ||
                    LeadData?.leadEmail === undefined ? (
                      <></>
                    ) : (
                      <p
                        style={{ cursor: "pointer" }}
                        className={`${
                          currentMode === "dark"
                            ? "text-[#FFFFFF] bg-[#262626]"
                            : "text-[#1C1C1C] bg-[#EEEEEE]"
                        } hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mx-1 flex items-center`}
                      >
                        <Tooltip title="Send Mail" arrow>
                          <EmailButton email={LeadData?.leadEmail} />
                        </Tooltip>
                      </p>
                    )}

                    <p
                      style={{ cursor: "pointer" }}
                      className={`${
                        currentMode === "dark"
                          ? "text-[#FFFFFF] bg-[#262626]"
                          : "text-[#1C1C1C] bg-[#EEEEEE]"
                      } hover:text-white hover:bg-orange-600 rounded-full shadow-none p-1.5 mx-1 flex items-center timelineBtn`}
                    >
                      <Tooltip title="View Timeline" arrow>
                        <button
                          onClick={() => setTimelinePopup({ isOpen: true })}
                        >
                          <AiOutlineHistory size={16} />
                        </button>
                      </Tooltip>
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* USER DETAILS  */}
                  <div className="p-4">
                    <h1 className="text-center uppercase font-semibold">
                      {t("user_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsTelephone
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">{contact}</div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsEnvelopeAt
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.leadEmail === "" ||
                          LeadData?.leadEmail === "null" ||
                          LeadData?.leadEmail === "undefined" ||
                          LeadData?.leadEmail === "-" ||
                          LeadData?.leadEmail === null ||
                          LeadData?.leadEmail === undefined
                            ? "-"
                            : LeadData?.leadEmail}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsType
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.language} Language
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT DETAILS  */}
                  <div className="p-4">
                    <h1 className="text-center uppercase font-semibold">
                      {t("enquiry_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsBuildings
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.project === "null"
                            ? "-"
                            : LeadData?.project}{" "}
                          {LeadData?.leadType === "null"
                            ? "-"
                            : LeadData?.leadType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BiBed
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.enquiryType === "null"
                            ? "-"
                            : LeadData?.enquiryType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsHouseGear
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.leadFor === "null"
                            ? "-"
                            : `For ${LeadData?.leadFor}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS  */}
                  <div
                    className={`sm:col-span-1 md:col-span-2 lg:col-span-1 p-4`}
                  >
                    <h1 className="text-center uppercase flex items-center justify-center">
                      <BsBookmarkFill size={16} className={`text-primary ${isLangRTL(i18n.language) ? "ml-2" : "mr-2"}`} />
                      {t("label_feedback")?.toUpperCase()}
                      <span className="mx-2 font-semibold">
                        {t(
                          "feedback_" +
                            LeadData?.feedback
                              ?.toLowerCase()
                              ?.replaceAll(" ", "_")
                        ) ?? "---"}
                      </span>
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      {LeadData?.notes === null ||
                      LeadData?.notes === "" ||
                      LeadData?.notes === "null" ||
                      LeadData?.notes === "-" ? (
                        <></>
                      ) : (
                        <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                          <BsChatLeftText
                            size={16}
                            className={`${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-black"
                            }`}
                          />
                          <div
                            className="col-span-7"
                            style={{
                              fontFamily: isArabic(LeadData?.notes)
                                ? "Noto Kufi Arabic"
                                : "inherit",
                            }}
                          >
                            {LeadData?.notes}
                          </div>
                        </div>
                      )}
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsPersonPlus
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {t("lead_added_on")}{" "}
                          {datetimeLong(LeadData?.creationDate)}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsPersonGear
                          size={16}
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <div className="col-span-7">
                          {t("last_updated_on")}{" "}
                          {LeadData?.lastEdited === ""
                            ? "-"
                            : datetimeLong(LeadData?.lastEdited)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className={`my-4 rounded-xl p-4 shadow-sm ${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"}`}>
                    <form
                      className="my-5"
                      onSubmit={(e) => {
                        e.preventDefault();
                        AddNote();
                      }}
                    >
                      <TextField
                        sx={{
                          ...darkModeColors,
                          "& input": {
                            fontFamily: "Noto Kufi Arabic",
                          },
                        }}
                        id="note"
                        type={"text"}
                        label="Your Note"
                        className="w-full"
                        variant="outlined"
                        size="small"
                        required
                        multiline
                        minRows={2}
                        value={AddNoteTxt}
                        onChange={(e) => setAddNoteTxt(e.target.value)}
                      />
                      <button
                        disabled={addNoteloading ? true : false}
                        style={{ color: "white" }}
                        type="submit"
                        className="mt-3 disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-btn-primary p-1 text-white focus:outline-none focus:ring-2  focus:ring-offset-2 text-md font-bold uppercase"
                      >
                        {addNoteloading ? (
                          <CircularProgress
                            sx={{ color: "white" }}
                            size={25}
                            className="text-white"
                          />
                        ) : (
                          <span>Add Note</span>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                <div
                  className={`p-4`}
                >
                  <h1
                    className={` ${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    } font-semibold text-lg text-center uppercase`}
                  >
                    {t("lead_notes")}
                  </h1>

                  {LeadNotesData?.notes?.data?.length === 0 ? (
                    <div className="italic text-xs text-primary text-center mt-4 p-4">
                      {t("no_notes_available")}
                    </div>
                  ) : (
                    <>
                      {LeadNotesData?.notes?.data?.map((row, index) => (
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "text-white bg-black border-gray-800"
                              : "text-black bg-white border-gray-300"
                          } border-2 flex items-center my-2 gap-5 w-full rounded-xl shadow-sm`}
                        >
                          <div className="p-3 text-center text-sm">
                            <div className="mb-1">
                              {row?.userName}
                            </div>
                            <div className="mt-1 text-[#AAAAAA]">
                              {datetimeLong(row?.creationDate)}
                            </div>
                          </div>
                          <div className="bg-primary h-10 w-0.5"></div>
                          <div className="p-3 flex-grow">
                            <p
                              style={{
                                fontFamily: isArabic(row?.leadNote)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {row?.leadNote}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                </div>
              </div>
            )}

            {timelinePopup?.isOpen && (
              <Timeline
                timelineModelOpen={timelinePopup?.isOpen}
                handleCloseTimelineModel={() => setTimelinePopup({ isOpen: false })}
                LeadData={{ leadId: LeadData?.id }}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SingleLeadModal;
