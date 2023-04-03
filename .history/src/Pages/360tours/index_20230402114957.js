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

const Tour360 = () => {
    const { currentMode } = useStateContext();

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
                                    Masaar
                                </h1>
                                <div>
                                    <iframe width="100%" height="640" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src="https://kuula.co/share/collection/7FDYx?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1"></iframe>
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

export default Tour360;
