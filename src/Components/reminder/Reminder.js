import moment from "moment";
import React, { useEffect, useState } from "react";
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

const Reminder = () => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [reminder, setReminder] = useState([]);
  const token = localStorage.getItem("auth-token");

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

  const UpdateReminder = async (value, id) => {
    setbtnLoading(true);
    console.log("value :", value);
    let reminderStatus;

    if (value === 1) {
      reminderStatus = "Completed";
    } else {
      reminderStatus = "Cancelled";
    }

    const ReminderUpdate = new FormData();
    ReminderUpdate.append("reminder_status", reminderStatus);

    try {
      const reminders = await axios.post(
        `${BACKEND_URL}/reminders/${id}`,
        ReminderUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setbtnLoading(false);

      toast.success("Successfully update reminder.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      fetchRminders(token);
    } catch (error) {
      setbtnLoading(false);
      console.log("Reminder error: ", error);
      toast.error("Unable to Update Reminders.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const fetchRminders = async () => {
    try {
      const reminders = await axios.get(`${BACKEND_URL}/reminders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          reminder_status: "Pending",
        },
      });

      setReminder(reminders.data.reminder.data);

      console.log("Reminders: ", reminders.data.reminder.data);
    } catch (error) {
      console.log("Reminder error: ", error);
      toast.error("Unable to Fetch Reminders.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchRminders();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
        {reminder?.map((meeting, index) => {
          return (
            <div
              key={meeting.id}
              className={`w-[350px] flex flex-col justify-between ${
                currentMode === "dark" ? "bg-black" : "bg-white"
              } rounded-md mb-3`}
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
                      }, ${moment(meeting?.reminder_date).format(
                        "MMMM D, Y"
                      )}`}</p>
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
                    onClick={() => {
                      UpdateReminder(1, meeting?.id);
                    }}
                  >
                    {btnLoading ? (
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
                    onClick={() => {
                      UpdateReminder(0, meeting?.id);
                    }}
                  >
                    {btnLoading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : (
                      <CloseIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Reminder;
