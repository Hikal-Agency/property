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
            developer: "Alef Group",
            projects: []
        },
        {
            developer: "Azizi Developments",
            projects: [
                "Beach Oasis",
                "Riviera",
                "Park Avenue",
            ]
        },
        {
            developer: "Arada Developers",
            projects: [
                "Masaar",
            ]
        },
        {
            developer: "Binghatti Developments",
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
                                                    <div className="font-semibold text-md text-center">
                                                        <p className="text-lg">{developer.developer}</p>
                                                    </div>
                                                    {developer.projects.length > 0 ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                                            {developer.projects[developer.projects.length - 1]}
                                                            {developer.projects[developer.projects.length - 2]}
                                                        </div>
                                                    ) : (
                                                        <p className="italic text-sm text-main-red-color">No projects to show</p>
                                                    )}
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="italic text-sm">Nothing to show</p>
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
