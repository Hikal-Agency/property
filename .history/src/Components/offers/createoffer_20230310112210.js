import React from "react";
import { Box, TextField, FormControl, Radio, RadioGroup, FormControlLabel, Button } from "@mui/material";
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
            <div className={`${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"} rounded-md p-5`}>
                <h3 className="text-main-red-color font-semibold mb-3 text-center">Create New Offer</h3>
                <hr className="mb-5"></hr>
                    
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
                    <Box sx={darkModeColors}>
                        <TextField
                            type={"text"}
                            label="Offer Title"
                            className="w-full mb-3"
                            style={{ marginBottom: "20px"}}
                            variant="outlined"
                            size="medium"
                            value=""
                        />
                        <TextField
                            type={"text"}
                            label="Offer Description"
                            className="w-full mb-3"
                            style={{ marginBottom: "20px"}}
                            variant="outlined"
                            size="medium"
                            value=""
                        />
                         <Button 
                            type="submit"
                            size="medium"
                            className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
                            style={{ backgroundColor: "#da1f26", color: "#ffffff"}}
                            >
                            CREATE
                        </Button>
                    </Box>
                    <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} rounded-md p-5 mx-5`}>
                        <Box sx={darkModeColors}>
                            <label className="font-semibold text-sm"><span className="text-main-red-color">Valid for:</span></label>
                            <br></br>
                            <FormControl>
                                <RadioGroup
                                    defaultValue="Both"
                                    name="radio-buttons-group"
                                    className="mb-5"
                                >
                                    <FormControlLabel className="m-1" value="Managers" control={<Radio />} label="Sales Managers" />
                                    <FormControlLabel className="m-1" value="Agents" control={<Radio />} label="Sales Agents" />
                                    <FormControlLabel className="m-1" value="Both" control={<Radio />} label="Both" />
                                </RadioGroup>
                            </FormControl>
                        </Box>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOffer;
