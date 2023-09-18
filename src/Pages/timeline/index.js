import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Error from "../Error";

import axios from "../../axoisConfig";
import {useNavigate } from "react-router-dom";
import {Backdrop, IconButton, Modal } from "@mui/material";

import {
  BiBed,
  BiCalendarExclamation
} from "react-icons/bi";
import {
  BsTelephone,
  BsBuildings,
  BsBookmarkCheckFill,
  BsClockFill
} from "react-icons/bs";
import {
  FaUserCheck
} from "react-icons/fa";
import {
  GoMail
} from "react-icons/go";
import {
  HiUser,
  HiClock
} from "react-icons/hi";
import {
  IoMdClose
} from "react-icons/io";
import {
  MdOutlineEditNote
} from "react-icons/md";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const Timeline = ({LeadData, handleCloseTimelineModel, timelineModelOpen}) => {
  const { currentMode, BACKEND_URL, isArabic } = useStateContext();
  const [leadsCycle, setLeadsCycle] = useState(null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLeadsData = async (token, LeadID) => {
    // const LeadID = location.pathname.split("/")[2].replace(/%20/g, " ");
    console.log("ID: ", LeadID);
    const urlLeadsCycle = `${BACKEND_URL}/leadscycle/${LeadID}}`;
    const urlLeadDetails = `${BACKEND_URL}/leads/${LeadID}`;
    try {
      const [leadsCycleResult, leadDetailsResult] = await Promise.all([
        axios.get(urlLeadsCycle, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(urlLeadDetails, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);
      setLeadsCycle(leadsCycleResult.data.history);
      setLeadDetails(leadDetailsResult.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError404(true);
      // navigate("/", {
      //   state: { error: "Something Went Wrong! Please Try Again " },
      // });
    }
  };

  useEffect(() => {
    const LeadID = LeadData?.leadId;
    const token = localStorage.getItem("auth-token");
    if (!LeadID) {
      navigate(`/closedeals`);
      return;
    }
    fetchLeadsData(token, LeadID);
    //eslint-disable-next-line
  }, []);

  function groupLeadsByDate(leads) {
    const groups = {};
    leads.forEach((lead) => {
      let date;
      if (lead.CreationDate) date = (lead.CreationDate + " ").split(" ")[0];
      else date = (lead.creationDate + " ").split(" ")[0];

      if (groups[date]) {
        groups[date].push(lead);
      } else {
        groups[date] = [lead];
      }
    });

    let grouped = Object.keys(groups).map((date) => {
      return {
        date: date,
        leads: groups[date],
      };
    });

    grouped = grouped.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    grouped = grouped.map((obj) => {
      const sortedLeads = obj.leads.sort((a, b) => {
        return new Date(b.CreationDate) - new Date(a.CreationDate);
      });
      // return the sorted leads array as part of a new object with the same date
      return { date: obj.date, leads: sortedLeads };
    });

    console.log(grouped);
    return grouped;
  }

  return (
    <>
    
      <Modal
        keepMounted
        open={timelineModelOpen}
        onClose={handleCloseTimelineModel}
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
          className={`w-[calc(100%-20px)] h-[80%] overflow-y-scroll md:w-[900px]  ${
            currentMode === "dark" ? "bg-[#1c1c1c] text-white" : "bg-white"
          } absolute top-1/2 left-1/2 px-10 py-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleCloseTimelineModel}
          >
            <IoMdClose size={18} />
          </IconButton>
          <div className={`w-full`} >
            {error404 ? (
              <Error />
            ) : (
              <div className="mt-5 md:mt-2">
                <div className="w-full flex items-center py-3">
                  <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                  <h1
                    className={`text-lg font-semibold ${
                      currentMode === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    Timeline
                  </h1>
                </div>
                <div>
                  <div
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } p-5 mx-auto`}
                  >
                    <div className="grid sm:grid-cols-12">
                      <div className="col-span-12 md:col-span-3">
                        {loading ? (
                          <div className="flex items-center justify-center w-full">
                            <h1 className="font-semibold text-lg">Loading</h1>
                          </div>
                        ) : (
                          <>
                            <h3 className="text-lg font-semibold uppercase mb-5"
                              style={{
                                fontFamily: isArabic(leadDetails.leadName)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {leadDetails.leadName}
                            </h3>
                            <div className="w-[80%] bg-[#DA1F26] h-0.5 mb-5"></div>
                            <div className="text-center sm:text-left my-3 sm:before:mx-0">
                              {/* CONTACT NUMBER  */}
                              <div className="flex mb-5">
                                <BsTelephone size={16} className="mr-3" />
                                {leadDetails.leadContact !== "" ? (
                                  <p>{leadDetails.leadContact}</p>
                                ) : (
                                  <></>
                                )}
                              </div>
                              {/* EMAIL ADDRESS  */}
                              {leadDetails.leadEmail !== "" && leadDetails.leadEmail != "null" ? (
                                <div className="flex mb-5">
                                  <GoMail size={16} className="mr-3" />
                                  {leadDetails.leadEmail}
                                </div>
                              ) : (
                                <></>
                              )}
                              {/* PROJECT  */}
                              <div className="flex mb-5">
                                <BsBuildings size={16} className="mr-3" />
                                <div>
                                  {leadDetails.project === "null" ? "-" : leadDetails.project} {" "}
                                  {leadDetails.leadType === "null" ? "-" : leadDetails.leadType} {" "}
                                </div>
                              </div>
                              {/* ENQUIRY  */}
                              <div className="flex mb-5">
                                <BiBed size={16} className="mr-3" />
                                <div>
                                  {leadDetails.enquiryType === "null" ? "-" : leadDetails.enquiryType} {" "}
                                  {leadDetails.leadFor === "null" ? "-" : leadDetails.leadFor} {" "}
                                </div>
                              </div>

                              <div className="w-[80%] bg-[#DA1F26] h-0.5 mb-5"></div>

                              {/* CREATION DATE  */}
                              <div className="text-sm mb-5">
                                <p>Lead added on:</p>
                                <p>{leadDetails.creationDate}</p>
                              </div>
                              <div className="text-sm mb-5">
                                <p>Last edited on:</p>
                                <p>{leadDetails.lastEdited}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="relative col-span-12 space-y-6 md:col-span-9">
                        <div className="flex flex-col md:grid grid-cols-12 w-full">
                          {loading ? (
                            <div className="flex items-center justify-center w-full">
                              <h1 className="font-semibold text-lg">Loading</h1>
                            </div>
                          ) : (
                            groupLeadsByDate(leadsCycle).map(
                              (timeline, index) => {
                                return (
                                  <>
                                    <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                      <div className="h-full w-6 flex items-center justify-center">
                                        <div
                                          className="h-full border-b-[#DA1F26] rounded-md px-2 py-1 text-sm"
                                          style={{
                                            width: "min-content",
                                            whiteSpace: "nowrap",
                                          }}
                                        >
                                          {timeline.date}
                                        </div>
                                      </div>
                                    </div>
                                    {timeline.leads.map((timeline, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="flex md:contents"
                                        >
                                          {/* LEAD NOTE  */}
                                          {timeline.leadNote ? (
                                            <>
                                              <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                <div className="h-full w-6 flex items-center justify-center">
                                                  <div className="h-full w-1 bg-[#AAA] pointer-events-none"></div>
                                                </div>
                                                <div className="absolute top-1/2 -mt-5 -ml-2 text-center bg-[#DA1F26] rounded-full p-2">
                                                  <MdOutlineEditNote
                                                    className="text-white"
                                                    size={16}
                                                  />
                                                </div>
                                              </div>
                                              <div
                                                className={`${
                                                  currentMode === "dark"
                                                    ? "bg-[#000000]"
                                                    : "bg-[#EEEEEE]"
                                                } p-4 space-y-3 rounded-md shadow-md col-start-4 col-end-13 my-2 w-full`}
                                                style={{
                                                  transform:
                                                    "translateX(-30px)",
                                                }}
                                              >
                                                {/* ADDED BY  */}
                                                <p
                                                  className="text-xs tracking-wide font-italic justify-end flex items-center"
                                                >
                                                  <HiUser size={12} className="mr-2" />
                                                  {timeline.addedBy}
                                                </p>
                                                {/* LEAD NOTE  */}
                                                <p className="font-semibold tracking-wide mb-2" style={{ fontFamily: isArabic(timeline.leadNote) ? "Noto Kufi Arabic" : "inherit"}}>
                                                  {timeline.leadNote}
                                                </p>
                                                {/* FEEDBACK  */}
                                                {timeline?.feedback &&
                                                timeline.feedback !== "0" && (
                                                  <p className="font-semibold tracking-wide">
                                                    Feedback updated to{" "}
                                                    <span className="font-bold text-main-red-color">
                                                      {timeline.feedback}
                                                    </span>.
                                                  </p>
                                                )}
                                                {/* CREATION DATE  */}
                                                <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                                  {timeline.creationDate ||
                                                    timeline.CreationDate}
                                                </p>
                                              </div>
                                            </>

                                            // MANAGER 
                                          ) : timeline.manager &&
                                            timeline.manager !== "0" ? (
                                            <>
                                            <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                <div className="h-full w-6 flex items-center justify-center">
                                                  <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                                </div>
                                                <div className="absolute top-1/2 -mt-5 -ml-2 text-center bg-[#DA1F26] rounded-full p-2">
                                                  <FaUserCheck
                                                    className="text-white"
                                                    size={16}
                                                  />
                                                </div>
                                              </div>
                                              <div
                                                className={`${
                                                  currentMode === "dark"
                                                    ? "bg-[#000000]"
                                                    : "bg-[#EEEEEE]"
                                                } p-4 space-y-3 rounded-md shadow-md col-start-4 col-end-13 my-2 w-full`}
                                                style={{
                                                  transform:
                                                    "translateX(-30px)",
                                                }}
                                              >
                                                {/* ADDED BY  */}
                                                <p
                                                  className="text-xs tracking-wide font-italic justify-end flex items-center"
                                                >
                                                  <HiUser size={12} className="mr-1 text-[#AAAAAA]" />
                                                  {timeline.addedBy}
                                                </p>
                                                {/* AGENT  */}
                                                <p className="font-semibold tracking-wide">
                                                  Sales manager has been updated to{" "}
                                                  <span className="font-bold text-main-red-color">
                                                    {timeline.manager}
                                                  </span>.
                                                </p>
                                                {/* CREATION DATE  */}
                                                <p className="text-xs tracking-wide uppercase text-[#AAAAAA]">
                                                  {timeline.creationDate ||
                                                    timeline.CreationDate}
                                                </p>
                                              </div>
                                            </>

                                            // SALESPERSON 
                                          ) : timeline.agent &&
                                            timeline.agent !== "0" ? (
                                            <>
                                              <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                <div className="h-full w-6 flex items-center justify-center">
                                                  <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                                </div>
                                                <div className="absolute top-1/2 -mt-5 -ml-2 text-center bg-[#DA1F26] rounded-full p-2">
                                                  <FaUserCheck
                                                    className="text-white"
                                                    size={16}
                                                  />
                                                </div>
                                              </div>
                                              <div
                                                className={`${
                                                  currentMode === "dark"
                                                    ? "bg-[#000000]"
                                                    : "bg-[#EEEEEE]"
                                                } p-4 space-y-3 rounded-md shadow-md col-start-4 col-end-13 my-2 w-full`}
                                                style={{
                                                  transform:
                                                    "translateX(-30px)",
                                                }}
                                              >
                                                {/* ADDED BY  */}
                                                <p
                                                  className="text-xs tracking-wide font-italic justify-end flex items-center"
                                                >
                                                  <HiUser size={12} className="mr-1 text-[#AAAAAA]" />
                                                  {timeline.addedBy}
                                                </p>
                                                {/* AGENT  */}
                                                <p className="font-semibold tracking-wide">
                                                  Sales agent has been updated to{" "}
                                                  <span className="font-bold text-main-red-color">
                                                    {timeline.agent}
                                                  </span>.
                                                </p>
                                                {/* CREATION DATE  */}
                                                <p className="text-xs tracking-wide uppercase text-[#AAAAAA]">
                                                  {timeline.creationDate ||
                                                    timeline.CreationDate}
                                                </p>
                                              </div>
                                            </>

                                            // FEEDBACK
                                          ) : timeline.feedback &&
                                            timeline.feedback !== "0" ? (
                                            <>
                                              <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                <div className="h-full w-6 flex items-center justify-center">
                                                  <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                                </div>
                                                <div className="absolute top-1/2 -mt-5 -ml-2 text-center bg-[#DA1F26] rounded-full p-2">
                                                  <BsBookmarkCheckFill
                                                    className="text-white"
                                                    size={16}
                                                  />
                                                </div>
                                              </div>
                                              <div
                                                className={`${
                                                  currentMode === "dark"
                                                    ? "bg-[#000000]"
                                                    : "bg-[#EEEEEE]"
                                                } p-4 space-y-3 rounded-md shadow-md col-start-4 col-end-13 my-2 w-full`}
                                                style={{
                                                  transform:
                                                    "translateX(-30px)",
                                                }}
                                              >
                                                {/* ADDED BY  */}
                                                <p
                                                  className="text-xs tracking-wide font-italic justify-end flex items-center"
                                                >
                                                  <HiUser size={12} className="mr-1 text-[#AAAAAA]" />
                                                  {timeline.addedBy}
                                                </p>
                                                {/* FEEDBACK  */}
                                                <p className="font-semibold tracking-wide">
                                                  Feedback has been updated to{" "}
                                                  <span className="font-bold text-main-red-color">
                                                    {timeline.feedback}
                                                  </span>.
                                                </p>
                                                {/* CREATION DATE  */}
                                                <p className="text-xs tracking-wide uppercase text-[#AAAAAA]">
                                                  {timeline.creationDate ||
                                                    timeline.CreationDate}
                                                </p>
                                              </div>
                                            </>

                                            // MEETING STATUS 
                                          ) : timeline.meetingStatus &&
                                            timeline.meetingStatus !== "0" ? (
                                            <>
                                              <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                <div className="h-full w-6 flex items-center justify-center">
                                                  <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                                </div>
                                                <div className="absolute top-1/2 -mt-5 -ml-2 text-center bg-[#DA1F26] rounded-full p-2">
                                                  <BiCalendarExclamation
                                                    className="text-white"
                                                    size={16}
                                                  />
                                                </div>
                                              </div>
                                              <div
                                                className={`${
                                                  currentMode === "dark"
                                                    ? "bg-[#000000]"
                                                    : "bg-[#EEEEEE]"
                                                } p-4 space-y-3 rounded-md shadow-md col-start-4 col-end-13 my-2 w-full`}
                                                style={{
                                                  transform:
                                                    "translateX(-30px)",
                                                }}
                                              >
                                                {/* ADDED BY  */}
                                                <p
                                                  className="text-xs tracking-wide font-italic justify-end flex items-center"
                                                >
                                                  <HiUser size={12} className="mr-1 text-[#AAAAAA]" />
                                                  {timeline.addedBy}
                                                </p>
                                                {/* FEEDBACK  */}
                                                <p className="font-semibold tracking-wide">
                                                  Meeting status has been updated to{" "}
                                                  <span className="font-bold text-main-red-color">
                                                    {timeline.meetingStatus}
                                                  </span>.
                                                </p>
                                                {/* CREATION DATE  */}
                                                <p className="text-xs tracking-wide uppercase text-[#AAAAAA]">
                                                  {timeline.creationDate ||
                                                    timeline.CreationDate}
                                                </p>
                                              </div>
                                            </>

                                            // MEETING DATE TIME 
                                          ) : timeline.meetingDate &&
                                            timeline.meetingDate !== "0" ? (
                                            <>
                                              <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                <div className="h-full w-6 flex items-center justify-center">
                                                  <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                                </div>
                                                <div className="absolute top-1/2 -mt-5 -ml-2 text-center bg-[#DA1F26] rounded-full p-2">
                                                  <BsClockFill
                                                    className="text-white"
                                                    size={16}
                                                  />
                                                </div>
                                              </div>
                                              <div
                                                className={`${
                                                  currentMode === "dark"
                                                    ? "bg-[#000000]"
                                                    : "bg-[#EEEEEE]"
                                                } p-4 space-y-3 rounded-md shadow-md col-start-4 col-end-13 my-2 w-full`}
                                                style={{
                                                  transform:
                                                    "translateX(-30px)",
                                                }}
                                              >
                                                {/* ADDED BY  */}
                                                <p
                                                  className="text-xs tracking-wide font-italic justify-end flex items-center"
                                                >
                                                  <HiUser size={12} className="mr-1 text-[#AAAAAA]" />
                                                  {timeline.addedBy}
                                                </p>
                                                {/* FEEDBACK  */}
                                                <p className="font-semibold tracking-wide">
                                                  Meeting has been set for{" "}
                                                  <span className="font-bold text-main-red-color">
                                                    {!timeline.meetingTime ||
                                                    timeline.meetingTime === ""
                                                      ? ""
                                                      : `${timeline.meetingTime}, `}{" "}
                                                    {(timeline.meetingDate ||
                                                      timeline.meetingDate !==
                                                        "") &&
                                                      moment(
                                                        timeline.meetingDate
                                                      ).format("MMMM D, Y")}
                                                  </span>.
                                                </p>
                                                {/* CREATION DATE  */}
                                                <p className="text-xs tracking-wide uppercase text-[#AAAAAA]">
                                                  {timeline.creationDate ||
                                                    timeline.CreationDate}
                                                </p>
                                              </div>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </>
                                );
                              }
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Timeline;
