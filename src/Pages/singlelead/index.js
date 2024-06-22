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
} from "@mui/material";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { datetimeLong } from "../../Components/_elements/formatDateTime";

import { BiArchive, BiBed } from "react-icons/bi";
import {
  BsSnow2,
  BsPatchQuestion,
  BsFire,
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
import { GiMagnifyingGlass } from "react-icons/gi";
import { TbLanguage, TbPhone, TbBuildingCommunity } from "react-icons/tb";
import Timeline from "../timeline";

const SingleLeadPage = () => {
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
    themeBgImg,
    t,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const { lid } = useParams();

  console.log("LID: ", lid);

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
      console.log("LEAD DATA::::::::::::::::::::", LeadData);
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

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-5 mt-2 ${!themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
              }`}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div>
                <div className="w-full flex items-center justify-between pb-3">
                  <div class="flex items-center">
                    <div className={`${currentMode === "dark"
                      ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                      } w-fit rounded-md py-1 px-2 text-white flex items-center justify-center`}
                    >
                      {LeadData?.id}
                    </div>
                    <h1
                      className={`text-lg mx-2 uppercase ${currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      style={{
                        fontFamily: isArabic(LeadData?.leadName) ? "Noto Kufi Arabic" : "inherit"
                      }}
                    >
                      {LeadData?.leadName}
                    </h1>
                  </div>
                  <p
                    style={{ cursor: "pointer" }}
                    className={`${themeBgImg
                      ? (currentMode === "dark"
                        ? "text-white blur-bg-black"
                        : "text-black blur-bg-white")
                      : (currentMode === "dark"
                        ? "text-white bg-dark-neu"
                        : "text-black bg-light-neu")
                      } hover:text-white hover:bg-blue-600 rounded-full p-2 flex items-center timelineBtn`}
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

                <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* USER DETAILS  */}
                  <div
                    className={`p-4
                    ${!themeBgImg
                        ? currentMode === "dark"
                          ? "bg-dark-neu text-white"
                          : "bg-light-neu text-black"
                        : currentMode === "dark"
                          ? "blur-bg-dark text-white"
                          : "blur-bg-light text-black"
                      }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("user_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-3" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsTelephone
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
                            }`}
                        />
                        <div className="col-span-7">{contact}</div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsEnvelopeAt
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
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
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsType
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
                            }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.language}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT DETAILS  */}
                  <div
                    className={`p-4
                    ${!themeBgImg
                        ? currentMode === "dark"
                          ? "bg-dark-neu text-white"
                          : "bg-light-neu text-black"
                        : currentMode === "dark"
                          ? "blur-bg-dark text-white"
                          : "blur-bg-light text-black"
                      }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("enquiry_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-3" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsBuildings
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
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
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BiBed
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
                            }`}
                        />
                        <div className="col-span-7">
                          {LeadData?.enquiryType === "null"
                            ? "-"
                            : LeadData?.enquiryType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsHouseGear
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
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
                    className={`p-4 text-center
                    ${!themeBgImg
                        ? currentMode === "dark"
                          ? "bg-dark-neu text-white"
                          : "bg-light-neu text-black"
                        : currentMode === "dark"
                          ? "blur-bg-dark text-white"
                          : "blur-bg-light text-black"
                      }`}
                  >
                    <h1 className="text-center uppercase flex break-all">
                      <span>
                        <BsBookmarkFill size={16} className={`text-primary`} />
                      </span>
                      <span className="mx-2 font-semibold">
                        <span className="font-normal">
                          {t("label_feedback")?.toUpperCase()}
                        </span>
                        {" "}
                        {t(
                          "feedback_" +
                          LeadData?.feedback
                            ?.toLowerCase()
                            ?.replaceAll(" ", "_")
                            ?.replace(/[()]/g, "")
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
                        <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                          <BsChatLeftText
                            size={16}
                            className={`${currentMode === "dark"
                              ? "text-white"
                              : "text-black"
                              }`}
                          />
                          <div
                            className="col-span-7 text-start"
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
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsPersonPlus
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
                            }`}
                        />
                        <div className="col-span-7 text-start">
                          {t("lead_added_on")}{" "}
                          {datetimeLong(LeadData?.creationDate)}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-2">
                        <BsPersonGear
                          size={16}
                          className={`${currentMode === "dark" ? "text-white" : "text-black"
                            }`}
                        />
                        <div className="col-span-7 text-start">
                          {t("last_updated_on")}{" "}
                          {LeadData?.lastEdited === ""
                            ? "-"
                            : datetimeLong(LeadData?.lastEdited)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-xl p-4 my-7 ${!themeBgImg
                    ? currentMode === "dark"
                      ? "bg-dark-neu"
                      : "bg-light-neu"
                    : currentMode === "dark"
                      ? "blur-bg-dark"
                      : "blur-bg-light"
                    } mb-5`}
                >
                  <h1
                    className={` ${currentMode === "dark" ? "text-white" : "text-dark"
                      } font-semibold text-lg text-center mb-3`}
                  >
                    {t("lead_notes")}
                  </h1>

                  {LeadNotesData?.notes?.data?.length === 0 ? (
                    <p
                      className={`mt-3 italic ${currentMode === "dark"
                        ? "text-white"
                        : "text-main-red-color"
                        }`}
                    >
                      {t("nothing_to_show")}
                    </p>
                  ) : (
                    <TableContainer component={Paper}>
                      <Table
                        sx={{
                          minWidth: 650,
                          "& .MuiTableCell-root": {
                            color: currentMode === "dark" && "white",
                          },
                        }}
                        size="small"
                        aria-label="simple table"
                      >
                        <TableHead
                          sx={{
                            "& .MuiTableCell-head": {
                              color: "white",
                              fontWeight: "400",
                              // background: "#DA1F26"
                            },
                          }}
                          className={`${currentMode === "dark"
                            ? "bg-primary"
                            : "bg-[#000000]"
                            }`}
                        >
                          <TableRow>
                            <TableCell align="center" className="w-[5%]">
                              #
                            </TableCell>
                            <TableCell align="center" className="w-[15%]">
                              {t("ticket_cat_header_date")}
                            </TableCell>
                            <TableCell align="center" className="w-[15%]">
                              {t("label_added_by")}
                            </TableCell>
                            <TableCell align="center" className="w-[65%]">
                              {t("label_note")}
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody
                          sx={{
                            "& .MuiTableRow-root:nth-of-type(odd)": {
                              backgroundColor:
                                currentMode === "dark" && "#212121",
                            },
                            "& .MuiTableRow-root:nth-of-type(even)": {
                              backgroundColor:
                                currentMode === "dark" && "#3b3d44",
                            },
                          }}
                        >
                          {LeadNotesData?.notes?.data?.map((row, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {index + 1}
                              </TableCell>
                              <TableCell align="center">
                                {row?.creationDate}
                              </TableCell>
                              <TableCell align="center">
                                {row?.userName}
                              </TableCell>
                              <TableCell align="left">
                                <p
                                  style={{
                                    fontFamily: isArabic(row?.leadNote)
                                      ? "Noto Kufi Arabic"
                                      : "inherit",
                                  }}
                                >
                                  {row?.leadNote}
                                </p>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  <form
                    className="mt-5"
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
                      value={AddNoteTxt}
                      onChange={(e) => setAddNoteTxt(e.target.value)}
                    />
                    <button
                      disabled={addNoteloading ? true : false}
                      style={{ color: "white" }}
                      // type="submit"
                      className={`${!themeBgImg
                        ? currentMode === "dark"
                        ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                        : "bg-primary rounded-lg shadow-md border"
                      } my-3 disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center p-3 text-white focus:outline-none focus:ring-2  focus:ring-offset-2 text-md font-bold uppercase`}
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
            )}
            {/* <Footer /> */}
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
    </>
  );
};

export default SingleLeadPage;
