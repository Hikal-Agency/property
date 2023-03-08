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
                    {offer.map((offer, index) => {
                        return (
                            <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} p-3 rounded-md`}>
                                <h1 className="font-semibold text-main-red-color">{offer.offerTitle}</h1>
                            </div>
                        )
                    })}
                </div>
            </Box>
        </div>
    );
};

export default AllOffers;
