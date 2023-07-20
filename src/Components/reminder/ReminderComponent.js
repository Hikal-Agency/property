import React from "react";
import { ImClock } from "react-icons/im";
import { useStateContext } from "../../context/ContextProvider";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";
import { RiStickyNoteLine } from "react-icons/ri";
import axios from "../../axoisConfig";
import { ToastContainer, toast } from "react-toastify";
import { BsBuilding } from "react-icons/bs";
import SingleLead from "../Leads/SingleLead";

const ReminderComponent = ({ reminder, handleButtonClick, handleClick }) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();

  return (
    <div>
      <div
        key={meeting.id}
        className={`w-[350px] flex flex-col justify-between ${
          currentMode === "dark" ? "bg-black" : "bg-white"
        } rounded-md mb-3 cursor-pointer`}
        onClick={() => handleClick(meeting?.lead_id)}
      >
        <div className="px-5 py-5 space-y-3">
          <h2 className="text-main-red-color text-md font-bold">
            {meeting?.leadName || "No Lead Name"}
          </h2>
          {/* <div className="flex items-center space-x-1">
                  <BsBuilding
                    className={`mr-2 ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                  <p className="text-sm mr-3">
                    {meeting?.project} {meeting?.enquiryType}{" "}
                    {meeting?.leadType} {meeting?.leadFor}
                  </p>
                </div> */}
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <ImClock
                className={`mr-2 ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              />
              {meeting?.reminder_date && meeting?.reminder_time ? (
                <p className="text-sm mr-3">{`${
                  meeting?.reminder_time
                }, ${moment(meeting?.reminder_date).format("MMMM D, Y")}`}</p>
              ) : (
                "No time and date."
              )}
            </div>
          </div>
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <RiStickyNoteLine
                className={`mr-2 ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              />
              <p className="text-sm mr-3">
                {meeting?.reminder_note || "No Notes"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-5 py-3">
          <Tooltip title="Complete" arrow>
            <IconButton
              style={{ backgroundColor: "#4CAF50", color: "white" }}
              className="rounded-full"
              onClick={(event) => handleButtonClick(event, 0, meeting?.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <CheckIcon />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Cancel" arrow>
            <IconButton
              style={{ backgroundColor: "#DC2626", color: "white" }}
              className="rounded-full"
              onClick={(event) => handleButtonClick(event, 0, meeting?.id)}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                <CloseIcon />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default ReminderComponent;
