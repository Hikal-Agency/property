import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../axoisConfig";

const AssignedToSelectBox = ({
  assignedTo,
  users,
  ticketId,
  fetchTicketsAndUsers,
}) => {
  console.log("users in dropdown:: ", users);
  console.log("ticketId:: ", ticketId);
  console.log("assignedTo:: ", assignedTo);

  const { currentMode, BACKEND_URL, pageState, setpageState } =
    useStateContext();
  const token = localStorage.getItem("auth-token");
  const [loading, setLoading] = useState(false);

  const updateTickets = async (assigned_to) => {
    setLoading(true);

    const selectedUserName = users.find(
      (user) => user.id === assigned_to
    )?.userName;

    console.log("assigned Updated: ", assigned_to, selectedUserName);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/tickets/${ticketId}`,
        { assigned_to: assigned_to },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("assigned response: ", response);
      toast.success(`Ticket successfully assigned to ${selectedUserName}.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setLoading(false);
      fetchTicketsAndUsers();
    } catch (error) {
      setLoading(false);
      console.log(error);

      toast.error("Unable to assign. Kindly try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        fontSize: "12px",
        fontWeight: "400",
        // borderLeft: currentMode === "dark" ? "1px solid white" : "1px solid black",
        // borderRight: currentMode === "dark" ? "1px solid white" : "1px solid black",
        border: "none",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };

  return (
    <>
      <Box
        className={`mr-2 w-full h-full flex items-center justify-center  `}
        sx={SelectStyles}
      >
        <FormControl
          className={`${
            currentMode === "dark" ? "text-white" : "text-black"
          }  `}
          sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}
        >
          <Select
            id="feedback"
            value={assignedTo ?? "selected"}
            label="Feedback"
            onChange={(e) => {
              //   setAssigned_to(e.target.value);
              updateTickets(e.target.value);
            }}
            size="medium"
            // className="w-[100%] h-[75%] border-none render"
            className="w-full border border-gray-300 rounded "
            displayEmpty
            required
            sx={{
              border: "1px solid #000000",
              "& .MuiSelect-select": {
                fontSize: 11,
              },
            }}
          >
            {!assignedTo ? (
              <MenuItem value={"selected"} selected>
                ---Assign To---
              </MenuItem>
            ) : null}

            {/* <div className="h-60 overflow-auto "> */}
            {users?.map((user) => (
              <MenuItem value={user?.id} className="selectbox-scrolling">
                {user?.userName}
              </MenuItem>
            ))}
            {/* </div> */}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};

export default AssignedToSelectBox;
