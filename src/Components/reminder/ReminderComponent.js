import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { BsClock, BsChatSquareText } from "react-icons/bs";
import moment from "moment";
import { useState } from "react";
import "../../styles/animation.css";

const ReminderComponent = ({
  reminder,
  handleClick,
  isLoading,
  fetchRminders,
}) => {
  console.log("reminders component: ", reminder);
  const { currentMode, BACKEND_URL, isArabic, themeBgImg } = useStateContext();
  const [completeLoading, setCompletebtnLoading] = useState(false);
  const [cancleLoading, setCanclebtnLoading] = useState(false);
  // const [reminder, setReminder] = useState([]);
  const token = localStorage.getItem("auth-token");
  const [loadingStates, setLoadingStates] = useState({});

  const UpdateReminder = async (value, id) => {
    console.log("value :", value);
    let reminderStatus;

    if (value === 1) {
      setCompletebtnLoading(true);
      reminderStatus = "Completed";
    } else {
      setCanclebtnLoading(true);
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

      setCanclebtnLoading(false);
      setCompletebtnLoading(false);

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
      setCanclebtnLoading(false);
      setCompletebtnLoading(false);
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

  const handleButtonClick = async (event, status, meetingId) => {
    event.stopPropagation();
    console.log("i am clicked: ", event, status, meetingId);
    // Set loading state to true for the current meeting button that is clicked
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [meetingId]: true,
    }));

    await UpdateReminder(status, meetingId);

    // After the API call is complete, set loading state to false for the current meeting button
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [meetingId]: false,
    }));
  };

  return (
    <>
      <div
        key={reminder.id}
        className={`w-[350px] flex flex-col justify-between ${!themeBgImg
          ? (currentMode === "dark"
            ? "bg-dark-neu"
            : "bg-light-neu")
          : (currentMode === "dark"
            ? "blur-bg-black"
            : "blur-bg-white")
          } my-2 cursor-pointer `}
        onClick={() => handleClick(reminder?.lead_id)}
      >
        <div className="p-5 grid grid-cols-9">
          <div className="col-span-8 space-y-3">
            <h2 className={` ${!themeBgImg ? "text-primary" : (currentMode === "dark" ? "text-white" : "text-black")} text-md font-semibold`}
              style={{
                fontFamily: isArabic(reminder?.leadName) ? 'Noto Kufi Arabic' : 'inherit',
              }}
            >
              {reminder?.leadName || "No Lead Name"}
            </h2>

            <div className="grid grid-cols-11">
              <BsClock
                size={16}
                className={`mr-3 ${currentMode === "dark" ? "text-white" : "text-black"
                  }`}
              />
              <p className="text-sm mr-3 col-span-10">
                {reminder?.reminder_date && reminder?.reminder_time ? (
                  <>
                    {`${reminder?.reminder_time
                      }, ${moment(reminder?.reminder_date).format("MMMM D, Y")}`}
                  </>
                ) : (
                  "Unavailable"
                )}
              </p>
            </div>

            <div className="grid grid-cols-11">
              <BsChatSquareText
                size={16}
                className={`mr-3 ${currentMode === "dark" ? "text-white" : "text-black"
                  }`}
              />
              <p className="text-sm mr-3 col-span-10" style={{ fontFamily: isArabic(reminder?.reminder_note) ? "Noto Kufi Arabic" : "inherit" }}>
                {reminder?.reminder_note || "No Notes"}
              </p>
            </div>
          </div>

          <div className="col-span-1 space-y-2">
            <Tooltip title="Mark as Complete" arrow>
              <IconButton
                style={{ backgroundColor: "#269144", color: "white" }}
                className="rounded-full"
                onClick={(event) => handleButtonClick(event, 1, reminder?.id)}
                disabled={completeLoading}
              >
                {completeLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  <CheckIcon size={16} />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Cancel Reminder" arrow>
              <IconButton
                style={{ color: "white", backgroundColor: "#d0382c" }}
                className="rounded-full"
                onClick={(event) => handleButtonClick(event, 0, reminder?.id)}
                disabled={cancleLoading}
              >
                {cancleLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : (
                  <CloseIcon size={16} />
                )}
              </IconButton>
            </Tooltip>
          </div>

        </div>
      </div>
    </>
  );
};

export default ReminderComponent;
