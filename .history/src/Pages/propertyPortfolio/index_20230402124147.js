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

const PropertyPortfolio = () => {
    const { currentMode } = useStateContext();

    const developer = [
        {
            developer: "Alef",
            projects: []
        },
        {
            developer: "Azizi",
            projects: [
                "Beach Oasis",
                "Riviera",
                "Park Avenue",
            ]
        },
        {
            developer: "Arada",
            projects: [
                "Masaar",
            ]
        },
        {
            developer: "Binghatti",
            projects: [
                "Crescent",
                "Onyx",
                "Nova",
                "Business Bay",
            ]
        },
    ]

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
                                    Property Portfolio
                                </h1>

                                <div className="space-y-3">
                                    {developer.length > 0 ? (
                                        developer.map((developer, index) => {
                                            return (
                                                <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} w-full p-3 bg-gray-200 rounded-md space-y-3`}>
                                                    <div className="font-semibold text-center">
                                                        <p>{developer.developer}</p>
                                                    </div>
                                                    {developer.projects.length > 0 ? (
                                                        <></>
                                                    ) : (
                                                        <p className="italic text-sm">No projects to show</p>
                                                    )}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <>Nothing to show</>
                                    )}
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

export default PropertyPortfolio;
