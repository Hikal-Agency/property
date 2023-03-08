import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
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
                    <Tab label="THIS MONTH" />
                    <Tab label="LAST MONTH" />
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
                {/* THIS_MONTH */}
                <TabPanel value={tabValue} index={0}>
                    <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12">
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
                                        className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                                        >
                                            <div className="col-span-4 sm:col-span-12 md:col-span-12 lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex items-center">
                                                <img
                                                src="/favicon.png"
                                                height={60}
                                                width={60}
                                                className="rounded-full cursor-pointer"
                                                alt=""
                                                />
                                                <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                                            </div>
                                            <div className="col-span-8 sm:col-span-12 md:col-span-12 lg:col-span-8 xl:col-span-8 2xl:col-span-8 flex gap-x-3 align-center content-center items-center">
                                                {item.achieved >= item.target ? (
                                                    <span
                                                    className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                                                    >
                                                    {(item.achieved / item.target * 100).toFixed(2)}%
                                                    </span>
                                                ) : item.achieved < item.target ? (
                                                    <div
                                                    style={{width: `${(item.achieved / item.target) * 100}%`}}
                                                    className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                                                    >
                                                    {(item.achieved / item.target * 100).toFixed(2)}%
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
                                        className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
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
                                                        {(item.achieved / item.target * 100).toFixed(2)}%
                                                    </span>
                                                ) : item.achieved < item.target ? (
                                                    <div
                                                    style={{width: `${(item.achieved / item.target) * 100}%`}}
                                                    className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5`}
                                                    >
                                                        {(item.achieved / item.target * 100).toFixed(2)}%
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
                    </div>
                </TabPanel>

                {/* LAST_MONTH */}
                <TabPanel value={tabValue} index={1}>
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
                                        className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
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
                                                    {(item.achieved / item.target * 100).toFixed(2)}%
                                                    </span>
                                                ) : item.achieved < item.target ? (
                                                    <div
                                                    style={{width: `${(item.achieved / item.target) * 100}%`}}
                                                    className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                                                    >
                                                    {(item.achieved / item.target * 100).toFixed(2)}%
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
                                        className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
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
                                                        {(item.achieved / item.target * 100).toFixed(2)}%
                                                    </span>
                                                ) : item.achieved < item.target ? (
                                                    <div
                                                    style={{width: `${(item.achieved / item.target) * 100}%`}}
                                                    className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5`}
                                                    >
                                                        {(item.achieved / item.target * 100).toFixed(2)}%
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
                    </div>
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
