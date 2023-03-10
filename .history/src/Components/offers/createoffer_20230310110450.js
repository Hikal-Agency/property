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
            <Box sx={{darkModeColors}}>
                
            </Box>
        </div>
    );
};

export default CreateOffer;
