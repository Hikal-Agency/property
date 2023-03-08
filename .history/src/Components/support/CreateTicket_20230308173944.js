
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
          <h3 className="mb-3 font-semibold text-main-red-color text-center">Ticket Details</h3>
          <hr className="mb-5"></hr>

          {/* TICKET CATEGORY  */}
          <FormControl fullWidth>
            <InputLabel>Ticket Category</InputLabel>
            <Select
              label="Ticket Category"
              size="medium"
              className="w-full mb-5"
              required
            >
              <MenuItem value={null}>- - -</MenuItem>
              <MenuItem value={"1"}>1</MenuItem>
              <MenuItem value={"2"}>2</MenuItem>
            </Select>
          </FormControl>

          {/* TICKET DESCRIPTION  */}
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

          {/* SUPORT VIA  */}
          <FormControl fullWidth>
            <InputLabel>Support Source</InputLabel>
            <Select
              label="Support Source"
              size="medium"
              className="w-full mb-5"
              required
            >
              <MenuItem value={null}>- - -</MenuItem>
              <MenuItem value={"Email"}>Email</MenuItem>
              <MenuItem value={"Video Call"}>Video Call</MenuItem>
              <MenuItem value={"Phone Call"}>Phone Call</MenuItem>
              <MenuItem value={"WhatsApp Chat"}>WhatsApp Chat</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="space-3 p-5">
          <h3 className="mb-3 font-semibold text-main-red-color text-center">24x7 Real-time Support</h3>
          <h6 className="mb-3 text-center">We're here 24 hours a day, every day of the week, including holidays.</h6>
          <hr className="mb-5"></hr>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
