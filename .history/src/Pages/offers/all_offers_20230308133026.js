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
            "offerTitle":"Win iPad",
            "offerDescription": "Get a chance to win latest iPad 14 Pro Max by closing AED 7 Million plus direct deals this month.",
            "valid_from": "2022-03-01",
            "valid_to":"2023-03-30",
            "validToManager": 1,
            "validToSales": 1,
            "offerBy": "Mohamed Hikal",
        },
        {
            "creationDate":"2022-03-03",
            "offerTitle":"Win iPhone 14 Pro Max",
            "offerDescription": "Get a chance to win latest iPhone 14 Pro Max by closing AED 3 Million plus deals this month.",
            "valid_from": "2022-03-01",
            "valid_to":"2023-03-30",
            "validToManager": 0,
            "validToSales": 1,
            "offerBy": "Mohamed Hikal",
        },
        {
            "creationDate":"2022-03-07",
            "offerTitle":"Win iPhone 14 Pro Max",
            "offerDescription": "Get a chance to win latest iPhone 14 Pro Max by closing AED 10 Million plus deals this month.",
            "valid_from": "2022-03-01",
            "valid_to":"2023-03-30",
            "validToManager": 1,
            "validToSales": 0,
            "offerBy": "Mohamed Hikal",
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
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-3 gap-y-3 pb-4 text-center">
                    {offer.map((offer, index) => {
                        return (
                            // offer.validToManager === 1 && offer.validToSales === 1 ? (
                                <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} p-5 rounded-md`}>
                                    <h1 className="bg-main-red-color text-white font-semibold rounded-md p-2 mb-3">{offer.offerTitle}</h1>
                                    <hr className="mb-3"></hr>
                                    <h6 className="mb-3 p-2">{offer.offerDescription}</h6>
                                    <hr className="mb-3"></hr>
                                    <h1 className="bg-main-red-color text-white font-semibold rounded-md p-2 mb-3">Valid from {offer.valid_from} to {offer.valid_to}</h1>
                                    <h6 className="mb-3">Offer From {offer.offerBy}</h6>
                                </div>
                            // ) : (
                            //     <>
                            //     </>
                            // )
                        )
                    })}
                </div>
            </Box>
        </div>
    );
};

export default AllOffers;
