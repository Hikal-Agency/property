// import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import axios from "../../axoisConfig";
import BlockIPModal from "./BlockIPModal";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { VscCallOutgoing, VscMail, VscEdit } from "react-icons/vsc";
import moment from "moment";
import AddListingModal from "./listings/AddListingModal";
import { datetimeAMPM, datetimeLong } from "../_elements/formatDateTime";

import { IoIosAlert } from "react-icons/io";
import { 
  MdClose,
} from "react-icons/md";
import { 
  BiBlock,
  BiBed 
} from "react-icons/bi";
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
  BsPersonGear
} from "react-icons/bs";

const SingleLead = ({
  LeadModelOpen,
  handleLeadModelClose,
  LeadData,
  setLeadData,
  handleUpdateLeadModelOpen,
  FetchLeads,
  setDeleteModelOpen,
  setBulkDeleteClicked,
  setLeadToDelete,
  isBookedDeal,
  lead_origin,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
  } = useStateContext();
  const { hasPermission } = usePermission();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [singleLeadData, setsingleLeadData] = useState({});
  const [open, setOpen] = useState(false);
  const [requestBtnLoading, setRequestBtnLoading] = useState(false);

  const [addNoteloading, setaddNoteloading] = useState(false);
  const [lastNote, setLastNote] = useState("");
  const [lastNoteDate, setLastNoteDate] = useState("");
  const [lastNoteAddedBy, setLastNoteAddedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [blockIPModalOpened, setBlockIPModalOpened] = useState({
    lead: null,
    isOpened: false,
  });
  const [deleteloading, setdeleteloading] = useState(false);
  const handleCloseListingModal = () => setListingModalOpen(false);

  const handleCloseRequestModel = () => {
    setOpen(false);
  };

  // EDIT BTN CLICK FUNC
  const HandleEditFunc = (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params);
    handleUpdateLeadModelOpen();
  };

  // open listing modal
  const handleOpenListingModal = () => {
    setListingModalOpen(true);
    handleLeadModelClose();
  };

  // RESHUFFLE LEAD HAND FUNCTION
  // const handleRequest = async (e, data) => {
  //   e.preventDefault();
  //   const currentDate = moment().format("YYYY-MM-DD");

  //   // notification
  //   const requestData = new FormData();
  //   const title = `${User?.userName} has requested to reshuffle the lead ${data?.leadName}`;
  //   requestData?.append("title", title);
  //   requestData?.append("lead_id", data?.leadId);
  //   requestData?.append("user_id", User?.isParent);
  //   requestData?.append("addedBy", User?.id);
  //   requestData?.append("type", "Reshuffle");

  //   // updatelead
  //   const updateLead = new FormData();
  //   updateLead.append("transferRequest", 1);
  //   updateLead.append("transferredFrom", User?.id);
  //   updateLead.append("transferredFromName", User?.userName);
  //   updateLead.append("transferredDate", currentDate);

  //   try {
  //     const token = localStorage.getItem("auth-token");
  //     const notification = await axios.post(
  //       `${BACKEND_URL}/allnotifications`,
  //       requestData,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );

  //     const updatelead = await axios.post(
  //       `${BACKEND_URL}/leads/${data.leadId}`,
  //       updateLead,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );

  //     console.log("request: ", notification);
  //     console.log("updatelead: ", updatelead);

  //     toast.success("Reshuffle request sent.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });

  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log("error", error);
  //     toast.error("Unable to send the request.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };

  const handleRequest = async (e, data) => {
    console.log("open: ", open);
    setRequestBtnLoading(true);
    e.preventDefault();
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

    // notification
    const requestData = new FormData();
    const title = `${User?.userName} has requested to reshuffle the lead ${data?.leadName}`;
    requestData?.append("title", title);
    requestData?.append("lead_id", data?.leadId);
    requestData?.append("user_id", User?.isParent);
    requestData?.append("addedBy", User?.id);
    requestData?.append("type", "Reshuffle");

    // updatelead
    const UpdateLeadData = new FormData();
    UpdateLeadData.append("id", data?.leadId);
    UpdateLeadData.append("transferRequest", 1);
    UpdateLeadData.append("transferredFrom", User?.id);
    UpdateLeadData.append("transferredFromName", User?.userName);
    UpdateLeadData.append("transferredDate", currentDate);

    // Wrap the code in a Promise to ensure both requests are successful
    return new Promise(async (resolve, reject) => {
      try {
        const token = localStorage.getItem("auth-token");

        const [notification, updatelead] = await Promise.all([
          axios.post(`${BACKEND_URL}/allnotifications`, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }),
          axios.post(`${BACKEND_URL}/leads/${data.leadId}`, UpdateLeadData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }),
        ]);

        console.log("request: ", notification);
        console.log("updatelead: ", updatelead);
        setOpen(false);

        toast.success("Reshuffle request sent.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setLoading(false);
        setRequestBtnLoading(false);

        // Resolve the Promise when both requests are successful
        resolve("Both requests completed successfully.");
      } catch (error) {
        setRequestBtnLoading(false);

        setLoading(false);
        console.log("error", error);
        toast.error("Unable to send the request.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // Reject the Promise if there's an error
        reject(error);
      }
    });
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const FetchLead = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/leads/${LeadData}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("leads: ", result);

      setLeadData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const AddNote = (note = "") => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");

    const data = {
      leadId: LeadData.leadId || LeadData.id,
      leadNote: note || AddNoteTxt,
      addedBy: User?.id,
      addedByName: User?.userName,
    };
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
        if (!note) {
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
        }
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

  const fetchLastNote = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(
        `${BACKEND_URL}/lastnote/${LeadData?.leadId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const lastNoteText = result.data?.notes?.data[0]?.leadNote;
      const lastNoteDate = result.data?.notes?.data[0]?.creationDate;
      const lastNoteAddedBy = result.data?.notes?.data[0]?.addedByName;
      setLastNote(lastNoteText);
      setLastNoteDate(lastNoteDate);
      setLastNoteAddedBy(lastNoteAddedBy);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleBlockIP = async (params) => {
    setBlockIPModalOpened({
      lead: params,
      isOpened: true,
    });
  };

  useEffect(() => {
    if (LeadData?.leadId) {
      fetchLastNote();
    }

    console.log("leaddata: ", LeadData);

    if (typeof LeadData === "number") {
      FetchLead(LeadData);
    }

    console.log("LeadData::", LeadData);
  }, [LeadData]);

  // Replace last 4 digits with "*"
  const stearics =
    LeadData?.leadContact?.slice(0, LeadData?.leadContact?.length - 4) + "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = LeadData?.leadContact;
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = LeadData?.leadContact;
  }

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
        open={LeadModelOpen}
        onClose={handleLeadModelClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className="w-[100vw] h-[100vh] flex items-start justify-end">
          <button onClick={handleLeadModelClose}
            className="bg-primary w-fit h-fit p-3 rounded-l-full my-4 z-10"
          >
            <MdClose size={18} color={"white"} className="hover:border hover:border-white hover:rounded-full" />
          </button>

          <div
            style={style}
            className={` ${currentMode === "dark" ? "bg-[#1C1C1C] text-white" : "bg-[#FFFFFF] text-black"}
             p-4 h-[100vh] w-[80vw] rounded-l-md overflow-y-scroll
            `}
          >
            {loading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="w-full flex items-center pb-3 ">
                    <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                    <h1
                      className={`text-lg font-semibold ${
                        currentMode === "dark"
                          ? "text-white"
                          : "text-black"
                      }`}
                    >
                      {LeadData?.leadName}
                    </h1>
                  </div>

                  <div className="w-full flex justify-end items-center">
                    {/* CALL  */}
                    <p
                      style={{ cursor: "pointer" }}
                      className={`${
                        currentMode === "dark"
                          ? "text-[#FFFFFF] bg-[#262626]"
                          : "text-[#1C1C1C] bg-[#EEEEEE]"
                      } hover:bg-green-600 hover:text-white rounded-full shadow-none p-1.5 mx-1 flex items-center`}
                    >
                      <Tooltip title="Call" arrow>
                        <CallButton phone={LeadData?.leadContact} />
                      </Tooltip>
                    </p>

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
                        } hover:bg-[#0078d7] hover:text-white rounded-full shadow-none p-1.5 mx-1 flex items-center`}
                      >
                        <Tooltip title="Send Mail" arrow>
                          <EmailButton email={LeadData?.leadEmail} />
                        </Tooltip>
                      </p>
                    )}

                    {/* EDIT  */}
                    <p
                      style={{ cursor: "pointer" }}
                      className={`${
                        currentMode === "dark"
                          ? "text-[#FFFFFF] bg-[#262626]"
                          : "text-[#1C1C1C] bg-[#EEEEEE]"
                      } hover:bg-[#019a9a] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                    >
                      <Tooltip title="Update Details" arrow>
                        <button onClick={() => HandleEditFunc(LeadData)}>
                          <VscEdit size={16} />
                        </button>
                      </Tooltip>
                    </p>

                    {/* DELETE  */}
                    {hasPermission("lead_delete") && !isBookedDeal && (
                      <p
                        style={{ cursor: "pointer" }}
                        disabled={deleteloading ? true : false}
                        className={`${
                          currentMode === "dark"
                            ? "text-[#FFFFFF] bg-[#262626]"
                            : "text-[#1C1C1C] bg-[#EEEEEE]"
                        } hover:bg-[#DA1F26] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                      >
                        <Tooltip title="Delete Lead" arrow>
                          <button
                            onClick={() => {
                              setLeadToDelete(LeadData?.leadId);
                              setDeleteModelOpen(true);
                              if (setBulkDeleteClicked) setBulkDeleteClicked(false);
                            }}
                          >
                            <BsTrash
                              className="deleteLeadBtn"
                              size={18}
                              style={{ color: "inherit" }}
                            />
                          </button>
                        </Tooltip>
                      </p>
                    )}

                    {/* listing */}
                    <p
                      style={{ cursor: "pointer" }}
                      disabled={deleteloading ? true : false}
                      className={`${
                        currentMode === "dark"
                          ? "text-[#FFFFFF] bg-[#262626]"
                          : "text-[#1C1C1C] bg-[#EEEEEE]"
                      } hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                    >
                      <Tooltip title="Add Listing" arrow>
                        <button onClick={handleOpenListingModal}>
                          <BsBuildingGear
                            className="listingbtn"
                            size={18}
                            style={{ color: "inherit" }}
                          />
                        </button>
                      </Tooltip>
                    </p>

                    {/* RESHUFFLED REQUEST  */}
                    {User?.role === 1 ||
                    LeadData?.transferRequest === 1 ||
                    LeadData?.transferRequest === 1 ? (
                      <></>
                    ) : hasPermission("reshuffle_button") ? (
                      <p
                        style={{ cursor: "pointer" }}
                        className={`${
                          currentMode === "dark"
                            ? "text-[#FFFFFF] bg-[#262626]"
                            : "text-[#1C1C1C] bg-[#EEEEEE]"
                        } hover:bg-purple-600 hover:text-white rounded-full shadow-none p-1.5 mx-1 flex items-center`}
                      >
                        <Tooltip title="Request for Reshuffle" arrow>
                          {/* <button onClick={(e) => handleRequest(e, LeadData)}> */}
                          <button onClick={(e) => setOpen([true, e, LeadData])}>
                            <BsShuffle size={16} />
                          </button>
                        </Tooltip>
                      </p>
                    ) : null}

                    {/* IP BLOCKING */}
                    {LeadData?.ip && (
                      <p
                        style={{ cursor: "pointer" }}
                        disabled={deleteloading ? true : false}
                        className={`${
                          currentMode === "dark"
                            ? "text-[#FFFFFF] bg-[#262626]"
                            : "text-[#1C1C1C] bg-[#EEEEEE]"
                        } hover:bg-red-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                      >
                        <Tooltip title="Block IP" arrow>
                          <button onClick={() => HandleBlockIP(LeadData)}>
                            <BiBlock
                              className="listingbtn"
                              size={18}
                              style={{ color: "inherit" }}
                            />
                          </button>
                        </Tooltip>
                      </p>
                    )}
                    <Link
                      sx={{ my: 0, w: "100%" }}
                      to={`/lead/${LeadData?.leadId || LeadData?.id}`}
                      target="_blank"
                      className="mx-2"
                    >
                      <Button
                        fullWidth
                        sx={{ my: 0 }}
                        variant="contained"
                        style={{
                          backgroundColor: primaryColor,
                        }}
                        size="medium"
                      >
                        View Lead Details
                      </Button>

                      {/* <Tooltip title="View Lead Dettails" arrow>
                        <Button
                          className="rounded-full"
                          sx={{
                            "& svg": {
                              color:
                                currentMode === "dark"
                                  ? "white !important"
                                  : "black !important",
                            },
                          }}
                        >
                          <BsPersonVcard size={18}/>
                        </Button>
                      </Tooltip> */}
                    </Link>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-5 p-5">
                  {/* USER DETAILS  */}
                  <div className={`p-4 rounded-md card-hover
                    ${currentMode === "dark" ? "blur-bg-dark text-white" : "blur-bg-light text-black"}`}
                  >
                    <h1 className="text-center uppercase font-semibold">User details</h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsTelephone size={16} className="text-primary" />
                        <div className="col-span-7">{contact}</div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsEnvelopeAt size={16} className="text-primary" />
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
                        <BsType size={16} className="text-primary" />
                        <div className="col-span-7">{LeadData?.language}{" "}Language</div>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT DETAILS  */}
                  <div className={`p-4 rounded-md card-hover
                    ${currentMode === "dark" ? "blur-bg-dark text-white" : "blur-bg-light text-black"}`}
                  >
                    <h1 className="text-center uppercase font-semibold">Enquiry details</h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsBuildings size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.project === "null" ? "-" : LeadData?.project}
                          {" "}
                          {LeadData?.leadType === "null" ? "-" : LeadData?.leadType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BiBed size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.enquiryType === "null"
                          ? "-"
                          : LeadData?.enquiryType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsHouseGear size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.leadFor === "null" ? "-" : `For ${LeadData?.leadFor}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS  */}
                  <div className={`sm:col-span-1 md:col-span-2 p-4 rounded-md card-hover text-center
                    ${currentMode === "dark" ? "blur-bg-dark text-white" : "blur-bg-light text-black"}`}
                  >
                    <h1 className="text-center uppercase flex items-center justify-center">
                      <BsBookmarkFill size={16} className="mx-2 text-primary" />
                      Feedback
                      <span className="mx-2  font-semibold">{LeadData?.feedback ?? "---"}</span>
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="flex items-center gap-5 my-4 md:px-5">
                        <BsPersonPlus size={16} className="text-primary" />
                        <div className="text-start">
                          Lead added on {datetimeLong(LeadData?.creationDate)}
                        </div>
                      </div>
                      <div class="flex items-center gap-5 my-4 md:px-5">
                        <BsPersonGear size={16} className="text-primary" />
                        <div className="text-start">
                          Last updated on {LeadData?.lastEdited === "" ? "-" : datetimeLong(LeadData?.lastEdited)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* <div className="p-5">
                  <div className="bg-primary h-0.5 w-full my-1"></div>
                </div> */}

                {/* LAST NOTE  */}
                <div className="p-5">
                  <div className={`w-full p-4 rounded-md card-hover text-center
                      ${currentMode === "dark" ? "blur-bg-dark text-white" : "blur-bg-light text-black"}`}
                    >
                    <div className="w-full my-4">
                      {lastNote ? (
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "text-white bg-black border-gray-800"
                              : "text-black bg-[#EEEEEE] border-gray-300"
                          } border-2 flex items-center my-2 gap-5 w-full rounded-md`}
                        >
                          <div className="p-3 text-center text-sm">
                            <div className="mb-1">
                              {lastNoteAddedBy}
                            </div>
                            <div className="mt-1 text-[#AAAAAA]">
                              {lastNoteDate}
                            </div>
                          </div>
                          <div className="bg-primary h-10 w-0.5"></div>
                          <div className="p-3 flex-grow text-start">
                            <p
                              style={{
                                fontFamily: isArabic(lastNote)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {lastNote}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="italic text-xs text-primary text-center">
                          No notes available
                        </div>
                      )}
                    </div>
                    <div className="my-4 w-full">
                      <form
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
                          label="Note"
                          className="w-full"
                          variant="outlined"
                          size="small"
                          multiline
                          minRows={2}
                          required
                          value={AddNoteTxt}
                          onChange={(e) => setAddNoteTxt(e.target.value)}
                        />

                        <button
                          disabled={addNoteloading ? true : false}
                          type="submit"
                          className="mt-4 disabled:opacity-50 disabled:cursor-not-allowed bg-btn-primary group relative flex w-full justify-center rounded-md border border-transparent p-1 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 text-md font-bold uppercase"
                        >
                          {addNoteloading ? (
                            <CircularProgress
                              sx={{ color: "white" }}
                              size={25}
                              className="text-white"
                            />
                          ) : (
                            <span>Add New Note</span>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
      <BlockIPModal
      handleLeadModelClose={handleLeadModelClose}
      FetchLeads={FetchLeads}
        addNote={AddNote}
        blockIPModalOpened={blockIPModalOpened?.isOpened}
        handleCloseIPModal={() =>
          setBlockIPModalOpened({
            isOpened: false,
            lead: null,
          })
        }
        lead={LeadData}
      />

      {open[0] && (
        <Modal
          keepMounted
          open={open[0]}
          onClose={handleCloseRequestModel}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div
            style={style}
            className={`w-[calc(100%-20px)] md:w-[40%]  ${
              currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
            } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
          >
            <div className="flex flex-col justify-center items-center">
              <IoIosAlert size={50} className="text-main-red-color text-2xl" />
              <h1
                className={`font-semibold pt-3 text-lg ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Do you really want to send reshuffle request?
              </h1>
            </div>

            <div className="action buttons mt-5 flex items-center justify-center space-x-2">
              <Button
                className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                ripple="true"
                size="lg"
                onClick={(e) => handleRequest(e, open[2])}
              >
                {requestBtnLoading ? (
                  <CircularProgress size={18} sx={{ color: "blue" }} />
                ) : (
                  <span>Confirm</span>
                )}
              </Button>

              <Button
                onClick={handleCloseRequestModel}
                ripple="true"
                variant="outlined"
                className={`shadow-none  rounded-md text-sm  ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-main-red-color border-main-red-color"
                }`}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* {listingModalOpen && (

      )} */}
    </>
  );
};

export default SingleLead;
