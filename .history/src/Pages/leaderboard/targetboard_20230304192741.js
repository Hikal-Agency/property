import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";

const TargetBoard = ({
    tabValue,
    setTabValue,
    isLoading,
}) => {
    const { currentMode, darkModeColors } = useStateContext();

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const Manager = [
        {
            name: "Belal Hikal",
            target: "5000000",
            achieved: "5000000",
            teamDeals: "3",
            directDeals: "2",
        },
        {
            name: "Hossam Hassan",
            target: "5000000",
            achieved: "3000000",
            teamDeals: "0",
            directDeals: "1",
        },
        {
            name: "Nada Amin",
            target: "5000000",
            achieved: "2900000",
            teamDeals: "1",
            directDeals: "2",
        },
    ];

    const Agent = [
        {
            name: "Hassan Lodhi",
            target: "3000000",
            achieved: "3000000",
            totalClosed: "2",
        },
        {
            name: "Abdulrhman Makkawi",
            target: "3000000",
            achieved: "2567000",
            totalClosed: "5",
        },
        {
            name: "Ameer Ali",
            target: "3000000",
            achieved: "2500000",
            totalClosed: "2",
        },
        {
            name: "Hala Hikal",
            target: "3000000",
            achieved: "2000000",
            totalClosed: "2",
        },
        {
            name: "Zainab Ezzaldien",
            target: "3000000",
            achieved: "1900000",
            totalClosed: "1",
        },
    ];


    return (
        <div>
            <Box sx={darkModeColors} className="font-semibold">
                <Tabs value={tabValue} onChange={handleChange} variant="standard">
                    <Tab label="All TIME" />
                    <Tab label="LAST MONTH" />
                    <Tab label="THIS MONTH" />
                </Tabs>
            </Box>
            <Box
            className="mt-1 p-5"
            sx={
                isLoading && {
                opacity: 0.3,
                }
            }
            >
                <TabPanel value={tabValue} index={0}>
                    <div className="mb-10 mx-3">
                        <h1 className="font-semibold text-center">
                            <span className="font-bold">32</span>&nbsp;&nbsp;Closed Deals of&nbsp;<span className="font-bold">AED 50000000</span>
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-12">
                    <div
                    className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                    } p-3 rounded-md`}
                    >
                        {/* MANAGER  */}
                        <div
                        className={`${
                            currentMode === "dark"
                            ? "text-red-600"
                            : "text-main-red-color"
                        } text-xl font-bold`}
                        >MANAGER</div>
                            <div>
                                {Manager.map((item, index) => {
                                    return (
                                        <div
                                        key={index}
                                        className="grid grid-cols-12 gap-x-5 gap-y-5 rounded-md my-3 content-center align-center items-center"
                                        >
                                            <div className="col-span-4 flex items-center">
                                                <img
                                                    src="/favicon.png"
                                                    height={60}
                                                    width={60}
                                                    className="rounded-full cursor-pointer"
                                                    alt=""
                                                    />
                                                <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                                            </div>
                                            <div className="col-span-8 flex gap-x-3 align-center content-center items-center">
                                                {item.achieved >= item.target ? (
                                                    <span
                                                    className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                                                    >
                                                    AED: {item.teamDeals}
                                                    </span>
                                                ) : item.achieved < item.target ? (
                                                    <div
                                                    style={{width: `${(item.achieved / item.target) * 100}%`}}
                                                    className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                                                    >
                                                    Team deals: {item.teamDeals} / Direct deals:{" "}
                                                    {item.directDeals}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                            <div></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AGENT  */}
                        <div
                        className={`${
                            currentMode === "dark" ? "text-white" : "text-black"
                        } p-3 rounded-md`}
                        >
                            <div
                            className={`${
                                currentMode === "dark" ? "text-red-600" : "text-main-red-color"
                            } text-xl font-bold`}
                            >AGENT</div>
                            <div>
                                {Agent.map((item, index) => {
                                    return (
                                        <div
                                        key={index}
                                        className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                                        >
                                            <div className="col-span-2">
                                                <h4 className="font-bold my-1">{item.name}</h4>
                                            </div>
                                            <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                                                {item.achieved >= item.target ? (
                                                    <span
                                                    className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                                                    >
                                                        Closed deals: {item.totalClosed}
                                                    </span>
                                                ) : item.achieved < item.target ? (
                                                    <div
                                                    style={{width: `${(item.achieved / item.target) * 100}%`}}
                                                    className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5`}
                                                    >
                                                        Closed deals: {item.totalClosed}
                                                    </div>
                                                ) : (
                                                    <></>
                                                )}
                                                <img
                                                src="/favicon.png"
                                                height={50}
                                                width={50}
                                                className="rounded-full cursor-pointer"
                                                alt=""
                                                />
                                        </div>
                                        <div></div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
        
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
            
                </TabPanel>
            </Box>
        </div>
    );

    function TabPanel(props) {
        const { children, value, index } = props;
        return <div>{value === index && <div>{children}</div>}</div>;
    }
};

export default TargetBoard;
