import React, { useState, useEffect } from "react";
// import { socket } from "../..Pages/App";
import { socket } from "../../Pages/App";
import { IoIosNotifications } from "react-icons/io";
import Snackbar from "@mui/material/Snackbar";
import reminderImage from "./stopwatch.png";
import notificationRingTone from "../../assets/notification-ringtone.mp3";
const LiveReminderNotifications = () => {
  const [isLiveReminderNotification, setIsLiveReminderNotification] = useState({
    isOpen: false,
    data: {},
  });

  useEffect(() => {
    socket.on("five_minute_reminder_notification", (data) => {
      setIsLiveReminderNotification({ isOpen: true, data: data });
      const newSound = new Audio(notificationRingTone);
      newSound.play();
    });
    socket.on("current_time", (data) => {
      console.log(data, "current time in server");
    });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Prevent closing on clickaway
    }
    setIsLiveReminderNotification({ data: {}, isOpen: false });
  };

  return (
    <Snackbar
      open={isLiveReminderNotification?.isOpen}
      autoHideDuration={null}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <div className="w-[380px]  shadow-2xl rounded-lg p-5 text-[14px]  flex flex-col gap-3 relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur rounded-lg"></div>
        <div className="relative z-10 text-white bg-transparent">
          <div className="flex gap-4 items-center">
            <div>
              {/* <IoIosNotifications size={22} className="text-white" /> */}
              <img
                src={reminderImage}
                alt="clock image"
                className="w-[40px] "
              />
            </div>

            <p>You have reminder after 5 minutes</p>
          </div>
          <div className="flex ml-[52px]">
            <span className="mr-3">Note:</span>{" "}
            <p>{isLiveReminderNotification?.data?.reminder_note}</p>
          </div>
          <div className="ml-[52px]">
            <span className="mr-3">Time:</span>
            {isLiveReminderNotification?.data?.reminder_date},
            {isLiveReminderNotification?.data?.reminder_time}:00
          </div>

          <div className="flex justify-end">
            <button
              className="text-white  bg-[#26A6FE] px-3 py-2 rounded-lg"
              onClick={() =>
                setIsLiveReminderNotification({ data: {}, isOpen: false })
              }
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Snackbar>
  );
};

export default LiveReminderNotifications;

export const LiveMeetingNotifications = () => {
  const [isLiveMeetingNotification, setIsLiveMeetingNotification] = useState({
    isOpen: false,
    data: {},
  });

  useEffect(() => {
    socket.on("thirty_minute_meeting_notification", (data) => {
      setIsLiveMeetingNotification({ isOpen: true, data: data });
      const newSound = new Audio(notificationRingTone);
      newSound.play();
      // alert("notification is occured");
    });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Prevent closing on clickaway
    }
    setIsLiveMeetingNotification({ data: {}, isOpen: false });
  };

  return (
    <Snackbar
      open={isLiveMeetingNotification?.isOpen}
      autoHideDuration={null}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <div className="w-[380px]  shadow-2xl rounded-lg p-5 text-[14px]  flex flex-col gap-3 relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur rounded-lg"></div>
        <div className="relative z-10 text-white bg-transparent">
          <div className="flex gap-4 items-center">
            <div>
              {/* <IoIosNotifications size={22} className="text-white" /> */}
              <img
                src={reminderImage}
                alt="clock image"
                className="w-[40px] "
              />
            </div>
            <p>You have a meeting after 30 minutes</p>
          </div>
          <p className="ml-[52px]">
            <span className="mr-3">Location:</span>{" "}
            {isLiveMeetingNotification?.data?.meetingLocation}
          </p>
          <div className="ml-[52px] flex gap-2">
            <span className="mr-3"> Time: </span>
            {isLiveMeetingNotification?.data?.meetingDate},
            {isLiveMeetingNotification?.data?.meetingTime}:00
          </div>

          <div className="flex justify-end">
            <button
              className="text-white  bg-[#26A6FE] px-3 py-2 rounded-lg"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Snackbar>
  );
};
