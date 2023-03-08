import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const AllOffers = ({
    tabValue,
    setTabValue,
    isLoading,
}) => {
  const { currentMode, darkModeColors } = useStateContext();

  const handleChange = (event, newValue) => {
      setTabValue(newValue);
  };

  const offer = [
        {
            "creationDate":"2022-03-03",
            "offerTitle":"Win iPhone 14 Pro Max",
            "offerDescription": "Get a chance to win latest iPhone 14 Pro Max by closing AED 3 Million plus deals this month.",
            "out_answered_calls": 209,
            "out_notanswered_calls":89,
            "out_rejected_calls":5,
            "incoming_calls":35,
            "in_answered_calls":35,
            "in_missed_calls":0,
        },
    ];

  return (
        <div>
            <Box
            className="mt-1 p-5"
            sx={
                isLoading && {
                opacity: 0.3,
                }
            }
            >
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-3 gap-y-3 pb-3">
                    {offer.map((call, index) => {
                        return (
                            <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} p-3 rounded-md`}>
                                <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">   
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 xl:grid-cols-1 2xl:grid-cols-5 gap-3">
                                    
                                <h4 className="font-bold text-lg my-2 text-main-red-color col-span-5">{call.offerTitle}</h4>  
                                    <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-2 sm:col-span-1 md:col-span-1 lg:col-span-3 xl:col-span-1 2xl:col-span-3`}>
                                        <h6 className="text-center font-semibold">Outgoing</h6>
                                        <hr></hr>
                                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 mt-2">
                                            <div>
                                                <h1 className="font-semibold text-center text-lg">{call.out_answered_calls}</h1>
                                                <h6 className="text-main-red-color text-center">ANSWERED</h6>
                                            </div>
                                            <div>
                                                <h1 className="font-semibold text-center text-lg">{call.out_notanswered_calls}</h1>
                                                <h6 className="text-main-red-color text-center">NOT ANSWERED</h6>
                                            </div>
                                            <div>
                                                <h1 className="font-semibold text-center text-lg">{call.out_rejected_calls}</h1>
                                                <h6 className="text-main-red-color text-center">REJECTED</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-2 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-1 2xl:col-span-2`}>
                                        <h6 className="text-center font-semibold">Incoming</h6>
                                        <hr></hr>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-3 mt-2">
                                            <div>
                                                <h1 className="font-semibold text-center text-lg">{call.in_answered_calls}</h1>
                                                <h6 className="text-main-red-color text-center">RECEIVED</h6>
                                            </div>
                                            <div>
                                                <h1 className="font-semibold text-center text-lg">{call.in_missed_calls}</h1>
                                                <h6 className="text-main-red-color text-center">MISSED</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Box>
        </div>
    );
};

export default AllOffers;
