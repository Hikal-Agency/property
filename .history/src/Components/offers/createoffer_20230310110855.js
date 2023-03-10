import React from "react";
import { Box, TextField } from "@mui/material";
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
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
                <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-5`}>
                    <h3 className="text-main-red-color font-semibold mb-3 text-center">Create New Offer</h3>
                    <hr className="mb-3"></hr>
                    
                    <Box sx={{darkModeColors}}>
                        <TextField />
                    </Box>
                </div>
            </div>
        </div>
    );
};

export default CreateOffer;
