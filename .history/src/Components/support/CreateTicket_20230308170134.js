
import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const CreateTicket = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={`${currentMode === "dark" ? "text-white" : "text-black"} w-full h-full rounded-md p-5`}>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
        <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-md space-3 p-7`}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              label="Category"
              size="medium"
              className="w-full mb-5"
              required
            >
              <MenuItem value={"0"}>---CATEGORY---</MenuItem>
              <MenuItem value={"1"}>1</MenuItem>
              <MenuItem value={"2"}>2</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="ticket"
            type={"text"}
            label="Ticket Description"
            className="w-full mb-5"
            style={{ marginBottom: "20px" }}
            variant="outlined"
            size="medium"
            value=""
          />
        </div>
        <div className="space-3 p-3">
          dnjimage 
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
