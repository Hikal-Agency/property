
import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  Select,
  CircularProgress,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const CreateTicket = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} w-full h-full rounded-md p-5`}>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
        <div className="space-3 p-3">
          <Select
            id=""
            value=""
            disabled="false"
            label="Manager"
            size="medium"
            className="w-full mb-5"
            required
          >
            <MenuItem value="">
              CATEGORY
            </MenuItem>

            <MenuItem value="">hi</MenuItem>
            <MenuItem value="">hi</MenuItem>
          </Select>
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
