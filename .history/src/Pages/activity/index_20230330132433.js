import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { ImUserCheck } from "react-icons/im";
import { MdFeedback } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { HiClock } from "react-icons/hi";
import Error from "../Error";
import axios from "axios";
import { FaCalendarDay } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const ActivityLog = () => {
  const { currentMode, BACKEND_URL } = useStateContext();

  const activity = [
    {
        creationDate: "2023-03-03 12:00:00",
        addedBy: "Hala Hikal",
        feedback: "Meeting",
        note: "Feedback updated to Meeting.",
        meetingDate: "2023-03-30",
        meetingTime: "12:30",
        leadId: "#123",
        leadName: "Lead Name",
        project: "Riviera Project",
        enquiryType: "1 Bedroom",
    },
    {
        creationDate: "2023-03-03 12:00:00",
        addedBy: "Hala Hikal",
        feedback: "Follow Up",
        note: "Feedback updated to Follow Up.",
        meetingDate: "",
        meetingTime: "",
        leadId: "#123",
        leadName: "Lead Name",
        project: "Riviera Project",
        enquiryType: "1 Bedroom",
    },
    {
        creationDate: "2023-03-03 12:00:00",
        addedBy: "Hala Hikal",
        feedback: "Follow Up",
        note: "Feedback updated to Follow Up.",
        meetingDate: "",
        meetingTime: "",
        leadId: "#321",
        leadName: "Lead Name 2",
        project: "Emmar Project",
        enquiryType: "3 Bedrooms",
    },
    {
        creationDate: "2023-03-03 12:00:00",
        addedBy: "Hala Hikal",
        feedback: "No Answer",
        note: "Feedback updated to No Answer.",
        meetingDate: "",
        meetingTime: "",
        leadId: "#231",
        leadName: "Lead Name 3",
        project: "Onyx Project",
        enquiryType: "3 Bedrooms",
    },
    {
        creationDate: "2023-03-03 12:00:00",
        addedBy: "Hala Hikal",
        feedback: "",
        note: "Lead assigned to Abdulrhman Makawi.",
        meetingDate: "",
        meetingTime: "",
        leadId: "#231",
        leadName: "Lead Name 3",
        project: "Onyx Project",
        enquiryType: "3 Bedrooms",
    },
  ];

    return (
        <>
            <div className="min-h-screen">
                <div className="flex">
                    <Sidebarmui />
                    <div
                        className={`w-full  ${
                        currentMode === "dark" ? "bg-black" : "bg-white"
                        }`}
                    >
                        <div className="px-5">
                            <Navbar />
              
                            <div className="mt-5 md:mt-2">
                                <h1
                                className={`font-semibold ${
                                    currentMode === "dark" ? "text-white" : "text-red-600"
                                } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                                >
                                    Activity Log
                                </h1>
                                <div>
                                    <div
                                        className={`${
                                        currentMode === "dark" ? "text-white" : "text-black"
                                        } container p-10 mx-auto`}
                                    >
                                        <div className="relative space-y-6">
                                            <div className="flex flex-col md:grid grid-cols-12">

                                                {activity.map((activity, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="flex md:contents"
                                                    >
                                                        {activity.feedback !== "" ? (
                                                            activity.feedback !== "Meeting" ? (
                                                                <>
                                                                    <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                                        <div className="h-full w-6 flex items-center justify-center">
                                                                            <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                                        </div>
                                                                        <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                                            <MdStickyNote2
                                                                                className="bg-main-red-color text-white p-2 rounded-md"
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
                                                                        transform: "translateX(-30px)",
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
                                                                            {activity.leadName}
                                                                        </p>
                                                                        <p className="font-semibold tracking-wide">
                                                                            {activity.note}
                                                                        </p>
                                                                        <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic">
                                                                            {activity.creationDate ||
                                                                            activity.creationDate}
                                                                        </p>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                                        <div className="h-full w-6 flex items-center justify-center">
                                                                            <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                                        </div>
                                                                        <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                                            <BsFillCalendarEventFill
                                                                                className="bg-main-red-color text-white p-2 rounded-md"
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
                                                                        transform: "translateX(-30px)",
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
                                                                            {activity.addedBy}
                                                                        </p>
                                                                        <p className="font-semibold tracking-wide">
                                                                            {activity.note}
                                                                        </p>
                                                                        <p className="font-semibold tracking-wide">
                                                                            Meeting Scheduled for <span class="text-main-red-color">{activity.meetingDate} {activity.meetingTime}</span>
                                                                        </p>
                                                                        <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic">
                                                                            {activity.creationDate ||
                                                                            activity.creationDate}
                                                                        </p>
                                                                    </div>
                                                                </>
                                                            )
                                                        ) : (
                                                            <>
                                                                <div className="col-start-2 col-end-4 mr-3 md:mx-auto relative">
                                                                    <div className="h-full w-6 flex items-center justify-center">
                                                                        <div className="h-full w-1 bg-main-red-color pointer-events-none"></div>
                                                                    </div>
                                                                    <div className="absolute top-1/2 -mt-4 -ml-1 text-center">
                                                                        <ImUserCheck
                                                                            className="bg-main-red-color text-white p-2 rounded-md"
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
                                                                    transform: "translateX(-30px)",
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
                                                                        {activity.addedBy}
                                                                    </p>
                                                                    <p className="font-semibold tracking-wide">
                                                                        {activity.note}
                                                                    </p>
                                                                    <p className="text-xs mt-2 tracking-wide uppercase dark:text-gray-400 italic">
                                                                        {activity.creationDate ||
                                                                        activity.creationDate}
                                                                    </p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default ActivityLog;
