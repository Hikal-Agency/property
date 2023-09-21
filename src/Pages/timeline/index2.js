import Image from "next/image";
import moment from "moment";
import React from "react";
import { useLayoutEffect, useState, useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import DeviceComponent from "../../Components/whatsapp-marketing/DeviceComponent";
import Head from "next/head";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";
import { ImUserCheck } from "react-icons/im";
import { MdStickyNote2, MdCategory } from "react-icons/md";
import { TiFlash } from "react-icons/ti";
import { HiClock } from "react-icons/hi";
import { FaCalendarDay } from "react-icons/fa";

const Timeline = () => {
  const { currentMode } = useStateContext();

  const Timeline = [
    {
      creationDate: "2023-02-01 11:30:00",
      addedBy: "Yasmin Amin",
      note: "",
      manager: "Nada Amin",
      sales: "0",
      feedback: "0",
      meetingStatus: "0",
      meetingDate: "0",
      meetingTime: "",
    },
    {
      creationDate: "2023-02-02 11:30:00",
      addedBy: "Nada Amin",
      note: "",
      manager: "0",
      sales: "Ameer Ali",
      feedback: "0",
      meetingStatus: "0",
      meetingDate: "0",
      meetingTime: "",
    },
    {
      creationDate: "2023-02-03 11:30:00",
      addedBy: "Ameer Ali",
      note: "",
      manager: "0",
      sales: "0",
      feedback: "Follow Up",
      meetingStatus: "0",
      meetingDate: "0",
      meetingTime: "",
    },
    {
      creationDate: "2023-02-03 11:30:00",
      addedBy: "Ameer Ali",
      note: "hey this is test",
      manager: "0",
      sales: "0",
      feedback: "0",
      meetingStatus: "0",
      meetingDate: "0",
      meetingTime: "",
    },
    {
      creationDate: "2023-02-03 11:30:00",
      addedBy: "Ameer Ali",
      note: "",
      manager: "0",
      sales: "0",
      feedback: "Meeting",
      meetingStatus: "0",
      meetingDate: "0",
      meetingTime: "",
    },
    {
      creationDate: "2023-02-03 11:30:00",
      addedBy: "Ameer Ali",
      note: "",
      manager: "0",
      sales: "0",
      feedback: "0",
      meetingStatus: "Pending",
      meetingDate: "0",
      meetingTime: "",
    },
    {
      creationDate: "2023-02-03 11:30:00",
      addedBy: "Ameer Ali",
      note: "",
      manager: "0",
      sales: "0",
      feedback: "0",
      meetingStatus: "0",
      meetingDate: "2023-02-03",
      meetingTime: "11:00",
    },
  ];

  const LeadDetails = [
    {
      leadName: "Mohammad Alam",
      leadContact: "971567876456",
      leadEmail: "",
      leadCreationDate: "2022-02-01 09:00:00",
      assignManager: "Nada Amin",
      assignSales: "Ameer Ali",
      project: "Riviera",
      enquiry: "2 Bedrooms",
      property: "Apartment",
      purpose: "Investment",
      feedback: "Meeting",
    },
  ];

  return (
    <>
      <Head>
        <title>HIKAL CRM - Timeline</title>
        <meta name="description" content="Timeline - HIKAL CRM" />
      </Head>
      <div className="min-h-screen">
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="pl-3">
            <div className="mt-5 md:mt-2">
              <h1
                className={`font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-primary"
                } text-lg ml-2 mb-3 auto-cols-max gap-x-3`}
              >
                Timeline
                {/* <span className="px-5 py-3 rounded-md">Leaderboard</span> */}
                {/* <span className="px-5 py-3 rounded-md">Call Log Board</span> */}
              </h1>
              <div>
                <div
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } container p-10 mx-auto`}
                >
                  <div className="grid sm:grid-cols-12">
                    <div className="col-span-12 sm:col-span-2">
                      {LeadDetails.map((item, index) => (
                        <>
                          <h3 className="text-lg font-bold uppercase mb-5">
                            {item.leadName}
                          </h3>
                          <div className="text-center sm:text-left mb-5 before:block before:w-24 before:h-1 before:mb-5 before:rounded-md before:mx-auto sm:before:mx-0 before:bg-primary">
                            <div className="space-y-2">
                              {item.leadContact != "" ? (
                                <p>{item.leadContact}</p>
                              ) : (
                                <></>
                              )}
                              {item.leadEmail != "" ? (
                                <p>{item.leadEmail}</p>
                              ) : (
                                <></>
                              )}
                              <br></br>
                              <p className="font-bold underline">
                                Project details
                              </p>
                              <p>
                                <span className="font-semibold">Project: </span>
                                {item.project}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Enquiry for:{" "}
                                </span>
                                {item.enquiry}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Property type:{" "}
                                </span>
                                {item.property}
                              </p>
                              <p>
                                <span className="font-semibold">Purpose: </span>
                                {item.purpose}
                              </p>
                              <br></br>
                              <p className="font-bold">Lead added on:</p>
                              <p>{item.leadCreationDate}</p>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>

                    <div className="relative col-span-12 space-y-6 sm:col-span-10">
                      <div className="flex flex-col md:grid grid-cols-12">
                        {Timeline.map((timeline, index) => (
                          <div className="flex md:contents">
                            {timeline.note != "" ? (
                              <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div className="h-full w-1 bg-primary pointer-events-none"></div>
                                  </div>
                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                    <MdStickyNote2
                                      className="bg-primary text-white p-2 rounded-full"
                                      size={33}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } px-5 py-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                >
                                  <p className="text-xs font-italic float-right tracking-wide">
                                    {timeline.creationDate}
                                  </p>
                                  <p className="font-semibold tracking-wide">
                                    {timeline.note}
                                  </p>
                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                    {timeline.addedBy}
                                  </p>
                                </div>
                              </>
                            ) : timeline.manager != "0" ? (
                              <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div className="h-full w-1 bg-primary pointer-events-none"></div>
                                  </div>
                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                    <ImUserCheck
                                      className="bg-primary text-white p-2 rounded-full"
                                      size={33}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } px-5 py-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                >
                                  <p className="text-xs font-italic float-right tracking-wide">
                                    {timeline.creationDate}
                                  </p>
                                  <p className="font-semibold tracking-wide">
                                    Assigned to manager:{" "}
                                    <span className="font-bold text-primary">
                                      {timeline.manager}
                                    </span>
                                  </p>
                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                    {timeline.addedBy}
                                  </p>
                                </div>
                              </>
                            ) : timeline.sales != "0" ? (
                              <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div className="h-full w-1 bg-primary pointer-events-none"></div>
                                  </div>
                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                    <ImUserCheck
                                      className="bg-primary text-white p-2 rounded-full"
                                      size={33}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } px-5 py-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                >
                                  <p className="text-xs font-italic float-right tracking-wide">
                                    {timeline.creationDate}
                                  </p>
                                  <p className="font-semibold tracking-wide">
                                    Assigned to agent:{" "}
                                    <span className="font-bold text-primary">
                                      {timeline.sales}
                                    </span>
                                  </p>
                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                    {timeline.addedBy}
                                  </p>
                                </div>
                              </>
                            ) : timeline.feedback != "0" ? (
                              <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div className="h-full w-1 bg-primary pointer-events-none"></div>
                                  </div>
                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                    <TiFlash
                                      className="bg-primary text-white p-2 rounded-full"
                                      size={33}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } px-5 py-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                >
                                  <p className="text-xs font-italic float-right tracking-wide">
                                    {timeline.creationDate}
                                  </p>
                                  <p className="font-semibold tracking-wide">
                                    Feedback updated to:{" "}
                                    <span className="font-bold text-primary">
                                      {timeline.feedback}
                                    </span>
                                  </p>
                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                    {timeline.addedBy}
                                  </p>
                                </div>
                              </>
                            ) : timeline.meetingStatus != "0" ? (
                              <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div className="h-full w-1 bg-primary pointer-events-none"></div>
                                  </div>
                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                    <FaCalendarDay
                                      className="bg-primary text-white p-2 rounded-full"
                                      size={33}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } px-5 py-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                >
                                  <p className="text-xs font-italic float-right tracking-wide">
                                    {timeline.creationDate}
                                  </p>
                                  <p className="font-semibold tracking-wide">
                                    Meeting status updated to:{" "}
                                    <span className="font-bold text-primary">
                                      {timeline.meetingStatus}
                                    </span>
                                  </p>
                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                    {timeline.addedBy}
                                  </p>
                                </div>
                              </>
                            ) : timeline.meetingDate != "0" ? (
                              <>
                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                  <div className="h-full w-6 flex items-center justify-center">
                                    <div className="h-full w-1 bg-primary pointer-events-none"></div>
                                  </div>
                                  <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                    <HiClock
                                      className="bg-primary text-white p-2 rounded-full"
                                      size={33}
                                    />
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#1c1c1c]"
                                      : "bg-gray-200"
                                  } px-5 py-3 space-y-3 rounded-md shadow-md col-start-4 col-end-12 my-2 w-full`}
                                >
                                  <p className="text-xs font-italic float-right tracking-wide">
                                    {timeline.creationDate}
                                  </p>
                                  <p className="font-semibold tracking-wide">
                                    Meeting set on:{" "}
                                    <span className="font-bold text-primary">
                                      {timeline?.meetingTime === ""
                                        ? ""
                                        : `${timeline?.meetingTime}, `}{" "}
                                      {moment(timeline?.meetingDate).format(
                                        "MMMM D, Y"
                                      )}
                                    </span>
                                  </p>
                                  <p className="text-xs tracking-wide uppercase dark:text-gray-400">
                                    {timeline.addedBy}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default Timeline;
