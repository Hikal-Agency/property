import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { ImUserCheck } from "react-icons/im";
import { MdFeedback } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";
import { BsCalendar2EventFill } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";

import { useLocation, useNavigate } from "react-router-dom";

const Tour360 = () => {
    const { currentMode } = useStateContext();
    const location = useLocation();

    // const devproid = location.pathname.split("/")[2].replace(/%20/g, " ");

    const tour = [
        {
            dpid: 1,
            tourlink: "",
        },
        {
            dpid: 2,
            tourlink: "",
        },
        {
            dpid: 3,
            tourlink: "https://kuula.co/share/collection/792Wy?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
        },
        {
            dpid: 4,
            tourlink: "https://kuula.co/share/collection/7FDYx?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
        },
        {
            dpid: 5,
            tourlink: "",
        },
        {
            dpid: 6,
            tourlink: "",
        },
        {
            dpid: 7,
            tourlink: "",
        },
        {
            dpid: 8,
            tourlink: "https://kuula.co/share/collection/7Fmty?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
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
                                    Arada {'>'} Masaar
                                </h1>
                                <div>
                                    <iframe width="100%" height="640" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src="https://kuula.co/share/collection/7FDYx?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1"></iframe>
                                </div>
                                {tour[4]}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Tour360;
