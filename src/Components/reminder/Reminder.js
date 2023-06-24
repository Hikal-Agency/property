import moment from "moment";
import React, { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { useStateContext } from "../../context/ContextProvider";
import { IconButton, Tooltip } from "@mui/material";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";
import { RiStickyNoteLine } from "react-icons/ri";

const Reminder = () => {
  const { currentMode } = useStateContext();
  const [isModalOpened, setIsModalOpened] = useState(false);

  const upcoming_reminders = [
    {
      id: 1,
      leadName: "Meeting 1",
      notes: "Reminder notes 1",
      date: "2023-06-25",
      time: "09:00",
      completed: false,
    },
    {
      id: 2,
      leadName: "Meeting 2",
      notes: "Reminder notes 2",
      date: "2023-06-26",
      time: "14:30",
      completed: false,
    },
    {
      id: 3,
      leadName: "Meeting 3",
      notes: "Reminder notes 3",
      date: "2023-06-27",
      time: "11:15",
      completed: true,
    },
  ];

  return (
    <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
      {upcoming_reminders?.map((meeting, index) => {
        return (
          <div
            key={meeting.id}
            className={`w-[350px] flex flex-col justify-between ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            } rounded-md mb-3`}
          >
            <div className="px-5 py-5 space-y-3">
              <h2 className="text-main-red-color text-md font-bold">
                {meeting.leadName}
              </h2>
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <RiStickyNoteLine
                    className={`mr-2 ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                  <p className="text-sm mr-3">{meeting.notes}</p>
                </div>
              </div>
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <ImClock
                    className={`mr-2 ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                  <p className="text-sm mr-3">{`${meeting.time}, ${moment(
                    meeting.date
                  ).format("MMMM D, Y")}`}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between px-5 py-3">
              <Tooltip title="Complete" arrow>
                <IconButton
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                  className="rounded-full"
                >
                  <CheckIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel" arrow>
                <IconButton
                  style={{ backgroundColor: "#DC2626", color: "white" }}
                  className="rounded-full"
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Reminder;
