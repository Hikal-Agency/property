import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { GrCheckboxSelected, GrCheckbox } from "react-icons/gr";
import { MdFeedback } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";
import { BsCalendar2EventFill } from "react-icons/bs";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";

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
                {
                    project: "Beach Oasis",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    projectStatus: "Available",
                    tour360: 1,
                    retail: 1,
                },
                {
                    project: "Park Avenue",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    projectStatus: "Sold Out",
                    tour360: 1,
                    retail: 1,
                },
                {
                    project: "Riviera",
                    studio: 1,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    projectStatus: "Available",
                    tour360: 1,
                    retail: 1,
                },
            ]
        },
        {
            developer: "Arada Developers",
            projects: [
                {
                    project: "Masaar",
                    studio: 0,
                    onebed: 0,
                    twobed: 0,
                    threebed: 1,
                    fourbed: 1,
                    fivebed: 1,
                    sixbed: 1,
                    projectStatus: "Available",
                    tour360: 1,
                    retail: 1,
                },
            ]
        },
        {
            developer: "Binghatti Developments",
            projects: [
                {
                    project: "Crescent",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Sold Out",
                    tour360: 1,
                },
                {
                    project: "Onyx",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Available",
                    tour360: 1,
                },
                {
                    project: "Nova",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Sold Out",
                    tour360: 1,
                },
                {
                    project: "Business Bay",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Available",
                    tour360: 1,
                },
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
                                        developer.map((developer) => {
                                            return (
                                                <>
                                                    <div className={`${currentMode === "dark" ? "text-white" : "text-black"} w-full p-3 rounded-md space-y-3`}>
                                                        <div className="font-semibold text-md">
                                                            <p className="text-lg">{developer.developer}</p>
                                                        </div>
                                                        {developer.projects.length > 0 ? (
                                                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                                                {developer.projects.map((project) => {
                                                                    return (
                                                                        <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-full p-3 rounded-md space-y-1`}>
                                                                            <div className="text-main-red-color font-semibold text-center">{project.project}</div>
                                                                            <hr className="h-0.5"></hr>
                                                                            {project.projectStatus === "Available" ? (
                                                                                <div className="flex items-center justify-center gap-3 bg-[#0f9a56] text-white text-sm rounded-sm">
                                                                                    <p>Available</p>
                                                                                </div>
                                                                            ) : project.projectStatus === "Sold Out" ? (
                                                                                <div className="flex items-center justify-center gap-3 bg-[#da1f26] text-white text-sm rounded-sm">
                                                                                    <p>Sold Out</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center justify-center gap-3 bg-[#ff6c37] text-white text-sm rounded-sm">
                                                                                    <p>Unknown</p>
                                                                                </div>
                                                                            )}
                                                                            <div className="flex items-center gap-3">
                                                                                {project.studio === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>Studio</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.onebed === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>1 Bedroom</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.twobed === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>2 Bedrooms</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.threebed === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>3 Bedrooms</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.fourbed === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>4 Bedrooms</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.fivebed === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>5 Bedrooms</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.sixbed === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>6 Bedrooms</p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                {project.retail === 1 ? (
                                                                                    <BiCheckboxChecked size={"30px"} className="text-[#0f9a56]" />
                                                                                ) : (
                                                                                    <BiCheckboxMinus size={"30px"} className="text-[#da1f26]"  />
                                                                                )}
                                                                                <p>Retail</p>
                                                                            </div>
                                                                            {project.tour360 === 1 ? (
                                                                                <div className="flex items-center justify-center gap-3 bg-[#0f9a56] text-white text-sm rounded-sm">
                                                                                    <p>Available</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center justify-center gap-3 bg-[#ff6c37] text-white text-sm rounded-sm">
                                                                                    <p>Unknown</p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                                {/* <div>{developer.projects[developer.projects.length - 1]}</div>
                                                                <div>{developer.projects[developer.projects.length - 2]}</div> */}
                                                            </div>
                                                        ) : (
                                                            <p className="italic text-sm text-main-red-color">No projects to show</p>
                                                        )}
                                                    </div>
                                                    <hr></hr>
                                                </>
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
