import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { ImUserCheck } from "react-icons/im";
import { MdFeedback } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";
import { HiClock } from "react-icons/hi";
import Error from "../Error";
import axios from "axios";
import { FaCalendarDay } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const Timeline = () => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [leadsCycle, setLeadsCycle] = useState(null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
    const LeadID = location.pathname.split("/")[2].replace(/%20/g, " ");
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
      {/* <Head>
        <title>HIKAL CRM - Timeline</title>
        <meta name="description" content="Timeline - HIKAL CRM" />
      </Head> */}
      <div className="min-h-screen">
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <Navbar />
              {error404 ? (
                <Error />
              ) : (
                <div className="mt-5 md:mt-2">
                  <h1
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-red-600"
                    } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                  >
                    Timeline
                    {/* <span className="px-5 pb-3 rounded-md">Leaderboard</span> */}
                    {/* <span className="px-5 pb-3 rounded-md">Call Log Board</span> */}
                  </h1>
                  <div>
                    <div
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } container p-10 mx-auto`}
                    >
                      <div className="grid sm:grid-cols-12">
                        <div className="col-span-12 sm:col-span-2">
                          {loading ? (
                            <div className="flex items-center justify-center w-full">
                              <h1 className="font-semibold text-lg">Loading</h1>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-xl font-bold uppercase mb-5">
                                {leadDetails.leadName}
                              </h3>
                              <div className="text-center sm:text-left mb-5 before:block before:w-24 before:h-1 before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:bg-main-red-color">
                                <div className="space-y-2">
                                  {leadDetails.leadContact !== "" ? (
                                    <p>{leadDetails.leadContact}</p>
                                  ) : (
                                    <></>
                                  )}
                                  {leadDetails.leadEmail !== "" ? (
                                    <p>{leadDetails.leadEmail}</p>
                                  ) : (
                                    <></>
                                  )}
                                  <br></br>
                                  <p className="font-bold underline">
                                    Project details
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Project:{" "}
                                    </span>
                                    {leadDetails.project}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Enquiry for:{" "}
                                    </span>
                                    {leadDetails.enquiryType}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Property type:{" "}
                                    </span>
                                    {leadDetails.leadType}
                                  </p>
                                  <p>
                                    <span className="font-semibold">
                                      Purpose:{" "}
                                    </span>
                                    {leadDetails.leadFor}
                                  </p>
                                  <br></br>
                                  <p className="font-bold">Lead added on:</p>
                                  <p>{leadDetails.creationDate}</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="relative col-span-12 space-y-6 sm:col-span-10">
                          <div className="flex flex-col md:grid grid-cols-12">
                            {loading ? (
                              <div className="flex items-center justify-center w-full">
                                <h1 className="font-semibold text-lg">
                                  Loading
                                </h1>
                              </div>
                            ) : (
                              groupLeadsByDate(leadsCycle).map(
                                (timeline, index) => {
                                  return (
                                    <>
                                      <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                        <div className="h-full w-6 flex items-center justify-center">
                                          <div
                                            className="h-full bg-main-red-color rounded-lg px-3 py-1 text-white font-bold"
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
                                            {timeline.leadNote ? (
                                              <>
                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                  </div>
                                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                    <MdStickyNote2
                                                      className="bg-main-red-color text-white p-2 rounded-full"
                                                      size={33}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    currentMode === "dark"
                                                      ? "bg-gray-900"
                                                      : "bg-gray-200"
                                                  } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                                  style={{
                                                    transform:
                                                      "translateX(-30px)",
                                                  }}
                                                >
                                                  <p
                                                    className="text-xs font-italic float-right tracking-wide mt-4"
                                                    style={{
                                                      display: "inline-flex",
                                                    }}
                                                  >
                                                    <svg
                                                      focusable="false"
                                                      aria-hidden="true"
                                                      viewBox="0 0 24 24"
                                                      style={{ width: "15px" }}
                                                      fill="gray"
                                                    >
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                                    </svg>
                                                    {"  "}
                                                    {timeline.addedBy}
                                                  </p>
                                                  <p className="font-semibold tracking-wide">
                                                    {timeline.leadNote}
                                                  </p>
                                                  {timeline?.feedback &&
                                                    timeline.feedback !==
                                                      "0" && (
                                                      <p className="font-semibold tracking-wide">
                                                        Feedback updated to:{" "}
                                                        <span className="font-bold text-main-red-color">
                                                          {timeline.feedback}
                                                        </span>
                                                      </p>
                                                    )}
                                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                                    {timeline.creationDate ||
                                                      timeline.CreationDate}
                                                  </p>
                                                </div>
                                              </>
                                            ) : timeline.manager &&
                                              timeline.manager !== "0" ? (
                                              <>
                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                  </div>
                                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                    <ImUserCheck
                                                      className="bg-main-red-color text-white p-2 rounded-full"
                                                      size={33}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    currentMode === "dark"
                                                      ? "bg-gray-900"
                                                      : "bg-gray-200"
                                                  } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                                  style={{
                                                    transform:
                                                      "translateX(-30px)",
                                                  }}
                                                >
                                                  <p
                                                    className="text-xs font-italic float-right tracking-wide mt-4"
                                                    style={{
                                                      display: "inline-flex",
                                                    }}
                                                  >
                                                    <svg
                                                      focusable="false"
                                                      aria-hidden="true"
                                                      viewBox="0 0 24 24"
                                                      style={{ width: "15px" }}
                                                      fill="gray"
                                                    >
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                                    </svg>
                                                    {"  "}
                                                    {timeline.addedBy}
                                                  </p>
                                                  <p className="font-semibold tracking-wide">
                                                    Sales Manger updated to:{" "}
                                                    <span className="font-bold text-main-red-color">
                                                      {timeline.manager}
                                                    </span>
                                                  </p>
                                                  {timeline?.feedback &&
                                                    timeline.feedback !==
                                                      "0" && (
                                                      <p className="font-semibold tracking-wide">
                                                        Feedback updated to:{" "}
                                                        <span className="font-bold text-main-red-color">
                                                          {timeline.feedback}
                                                        </span>
                                                      </p>
                                                    )}
                                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                                    {timeline.creationDate ||
                                                      timeline.CreationDate}
                                                  </p>
                                                </div>
                                              </>
                                            ) : timeline.agent &&
                                              timeline.agent !== "0" ? (
                                              <>
                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                  </div>
                                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                    <ImUserCheck
                                                      className="bg-main-red-color text-white p-2 rounded-full"
                                                      size={33}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    currentMode === "dark"
                                                      ? "bg-gray-900"
                                                      : "bg-gray-200"
                                                  } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                                  style={{
                                                    transform:
                                                      "translateX(-30px)",
                                                  }}
                                                >
                                                  <p
                                                    className="text-xs font-italic float-right tracking-wide mt-4"
                                                    style={{
                                                      display: "inline-flex",
                                                    }}
                                                  >
                                                    <svg
                                                      focusable="false"
                                                      aria-hidden="true"
                                                      viewBox="0 0 24 24"
                                                      style={{ width: "15px" }}
                                                      fill="gray"
                                                    >
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                                    </svg>
                                                    {"  "}
                                                    {timeline.addedBy}
                                                  </p>
                                                  <p className="font-semibold tracking-wide">
                                                    Salesperson updated to:{" "}
                                                    <span className="font-bold text-main-red-color">
                                                      {timeline.agent}
                                                    </span>
                                                  </p>
                                                  {timeline?.feedback &&
                                                    timeline.feedback !==
                                                      "0" && (
                                                      <p className="font-semibold tracking-wide">
                                                        Feedback updated to:{" "}
                                                        <span className="font-bold text-main-red-color">
                                                          {timeline.feedback}
                                                        </span>
                                                      </p>
                                                    )}
                                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                                    {timeline.creationDate ||
                                                      timeline.CreationDate}
                                                  </p>
                                                </div>
                                              </>
                                            ) : timeline.feedback &&
                                              timeline.feedback !== "0" ? (
                                              <>
                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                  </div>
                                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                    <MdFeedback
                                                      className="bg-main-red-color text-white p-2 rounded-full"
                                                      size={33}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    currentMode === "dark"
                                                      ? "bg-gray-900"
                                                      : "bg-gray-200"
                                                  } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                                  style={{
                                                    transform:
                                                      "translateX(-30px)",
                                                  }}
                                                >
                                                  <p
                                                    className="text-xs font-italic float-right tracking-wide mt-4"
                                                    style={{
                                                      display: "inline-flex",
                                                    }}
                                                  >
                                                    <svg
                                                      focusable="false"
                                                      aria-hidden="true"
                                                      viewBox="0 0 24 24"
                                                      style={{ width: "15px" }}
                                                      fill="gray"
                                                    >
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                                    </svg>
                                                    {"  "}
                                                    {timeline.addedBy}
                                                  </p>
                                                  <p className="font-semibold tracking-wide">
                                                    Feedback updated to:{" "}
                                                    <span className="font-bold text-main-red-color">
                                                      {timeline.feedback}
                                                    </span>
                                                  </p>
                                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                                    {timeline.creationDate ||
                                                      timeline.CreationDate}
                                                  </p>
                                                </div>
                                              </>
                                            ) : timeline.meetingStatus &&
                                              timeline.meetingStatus !== "0" ? (
                                              <>
                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                  </div>
                                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                    <FaCalendarDay
                                                      className="bg-main-red-color text-white p-2 rounded-full"
                                                      size={33}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    currentMode === "dark"
                                                      ? "bg-gray-900"
                                                      : "bg-gray-200"
                                                  } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                                  style={{
                                                    transform:
                                                      "translateX(-30px)",
                                                  }}
                                                >
                                                  <p
                                                    className="text-xs font-italic float-right tracking-wide mt-4"
                                                    style={{
                                                      display: "inline-flex",
                                                    }}
                                                  >
                                                    <svg
                                                      focusable="false"
                                                      aria-hidden="true"
                                                      viewBox="0 0 24 24"
                                                      style={{ width: "15px" }}
                                                      fill="gray"
                                                    >
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                                    </svg>
                                                    {"  "}
                                                    {timeline.addedBy}
                                                  </p>
                                                  <p className="font-semibold tracking-wide">
                                                    Meeting status updated to:{" "}
                                                    <span className="font-bold text-main-red-color">
                                                      {timeline.meetingStatus}
                                                    </span>
                                                  </p>
                                                  {timeline?.feedback &&
                                                    timeline.feedback !==
                                                      "0" && (
                                                      <p className="font-semibold tracking-wide">
                                                        Feedback updated to:{" "}
                                                        <span className="font-bold text-main-red-color">
                                                          {timeline.feedback}
                                                        </span>
                                                      </p>
                                                    )}
                                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                                    {timeline.creationDate ||
                                                      timeline.CreationDate}
                                                  </p>
                                                </div>
                                              </>
                                            ) : timeline.meetingDate &&
                                              timeline.meetingDate !== "0" ? (
                                              <>
                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                  </div>
                                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                    <HiClock
                                                      className="bg-main-red-color text-white p-2 rounded-full"
                                                      size={33}
                                                    />
                                                  </div>
                                                </div>
                                                <div
                                                  className={`${
                                                    currentMode === "dark"
                                                      ? "bg-gray-900"
                                                      : "bg-gray-200"
                                                  } px-5 pb-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                                  style={{
                                                    transform:
                                                      "translateX(-30px)",
                                                  }}
                                                >
                                                  <p
                                                    className="text-xs font-italic float-right tracking-wide mt-4"
                                                    style={{
                                                      display: "inline-flex",
                                                    }}
                                                  >
                                                    <svg
                                                      focusable="false"
                                                      aria-hidden="true"
                                                      viewBox="0 0 24 24"
                                                      style={{ width: "15px" }}
                                                      fill="gray"
                                                    >
                                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                                    </svg>
                                                    {"  "}
                                                    {timeline.addedBy}
                                                  </p>
                                                  <p className="font-semibold tracking-wide">
                                                    Meeting set on:{" "}
                                                    <span className="font-bold text-main-red-color">
                                                      {!timeline.meetingTime ||
                                                      timeline.meetingTime ===
                                                        ""
                                                        ? ""
                                                        : `${timeline.meetingTime}, `}{" "}
                                                      {(timeline.meetingDate ||
                                                        timeline.meetingDate !==
                                                          "") &&
                                                        moment(
                                                          timeline.meetingDate
                                                        ).format("MMMM D, Y")}
                                                    </span>
                                                  </p>
                                                  {timeline?.feedback &&
                                                    timeline.feedback !==
                                                      "0" && (
                                                      <p className="font-semibold tracking-wide">
                                                        Feedback updated to:{" "}
                                                        <span className="font-bold text-main-red-color">
                                                          {timeline.feedback}
                                                        </span>
                                                      </p>
                                                    )}
                                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
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
                                      ,
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
        <Footer />
      </div>
    </>
  );
};

export default Timeline;
