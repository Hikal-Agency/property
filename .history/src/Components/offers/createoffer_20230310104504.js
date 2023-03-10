import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { useStateContext } from "../../context/ContextProvider";

const CreateOffer = ({
    tabValue,
    setTabValue,
    isLoading,
}) => {
  const { currentMode, darkModeColors } = useStateContext();

  const handleChange = (event, newValue) => {
      setTabValue(newValue);
  };


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
                                    <h6 className="mb-3 p-2">{offer.offerDescription}</h6>
                                    <hr className="mb-3"></hr>
                                    <h1 className="font-semibold mb-3">Valid from {offer.valid_from} to {offer.valid_to}</h1>
                                    <hr className="mb-3"></hr>
                                    <h6 className="mb-3 bg-main-red-color text-white p-2 rounded-md">Offer from Mr. {offer.offerBy}</h6>
                                </div>
                            // ) : (
                            //     <>l
                            //     </>
                            // )
                        )
                    })}
                </div>
            </Box>
        </div>
    );
};

export default CreateOffer;
