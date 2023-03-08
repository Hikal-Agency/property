import React from "react";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const CallLogBoard = () => {
  const { currentMode } = useStateContext();

  const calldata = [
        {
            "userImage":"",
            "userName":"Hala Hikal",
            "outgoing_calls": 303,
            "out_answered_calls": 209,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":35,
            "in_missed_calls":0,
        },
        {
            "userImage":"",
            "userName":"Ameer Ali",
            "outgoing_calls": 203,
            "out_answered_calls": 109,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":30,
            "in_missed_calls":5,
        },
        {
            "userImage":"",
            "userName":"Hassan Lodhi",
            "outgoing_calls": 303,
            "out_answered_calls": 209,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":35,
            "in_missed_calls":0,
        },
        {
            "userImage":"",
            "userName":"Rahul TR",
            "outgoing_calls": 203,
            "out_answered_calls": 109,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":30,
            "in_missed_calls":5,
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
                {/* ALL-TIME */}
                <TabPanel value={tabValue} index={0}>
                    <div className="mb-10 mx-3">
                        <h1 className="font-semibold text-center">
                            <span className="font-bold">32</span>&nbsp;&nbsp;Closed Deals of&nbsp;<span className="font-bold">AED 50000000</span>
                        </h1>
                    </div>
                    <div
                    className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                    } p-3 rounded-md`}
                    >
                        <div
                        className={`${
                            currentMode === "dark"
                            ? "text-red-600"
                            : "text-main-red-color"
                        } text-xl font-bold`}
                        >Sales Manager</div>
                        <div>
                            {Manager.map((item, index) => {
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
                                                Team deals: {item.teamDeals} / Direct deals:{" "}
                                                {item.directDeals}
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
                    <div
                    className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                    } p-3 rounded-md`}
                    >
                        <div
                        className={`${
                            currentMode === "dark" ? "text-red-600" : "text-main-red-color"
                        } text-xl font-bold`}
                        >Sales Agent</div>
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
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
        
                </TabPanel>
                <TabPanel value={tabValue} index={2}>
            
                </TabPanel>
            </Box>
        </div>
    );
};

export default CallLogBoard;
