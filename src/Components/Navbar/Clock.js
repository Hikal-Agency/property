import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import {
  MenuItem,
  Select,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";

import AnalogClock from "./AnalogClock";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import TimeZone from "./TimeZone";

const Clock = ({ handleClose }) => {
  const {
    currentMode,
    darkModeColors,
    t,
    BACKEND_URL,
    User,
    timeZone,
    setTimezone,
    timeZones,
    setTimezones,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");
  console.log("TIMEZONE::::> ", timeZone);
  // const [currentTime, setCurrentTime] = useState(
  //   localStorage.getItem("timezone")
  //     ? moment()
  //         .tz(localStorage.getItem("timezone"))
  //         .format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  //     : moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  // );
  const [currentTime, setCurrentTime] = useState(
    timeZone
      ? moment().tz(timeZone).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
      : moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  );
  // const [timezones, setTimezones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   if (localStorage.getItem("timezone")) {
  //     setTimezone(localStorage.getItem("timezone"));
  //   }
  // }, []);

  useEffect(() => {
    // Fetch all timezones
    // const fetchedTimezones = moment.tz.names();
    // setTimezones(fetchedTimezones);
    // console.log("first timeZone:: ", timeZone);

    if (!timeZone) {
      setTimezone(moment.tz.guess());
    }

    console.log("Timezone::", timeZone);
  }, []);

  let interval;

  useEffect(() => {
    // Update current time every second
    if (interval) {
      clearInterval(interval);
    }

    interval = setInterval(() => {
      setCurrentTime(
        moment().tz(timeZone).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeZone]);

  console.log("User?.timzone: ", User?.timezone);

  const filteredTimezones = timeZones?.filter((timezone) =>
    timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("filtered timezone list: ", filteredTimezones);

  const handleTimezoneChange = async (e) => {
    const timeZone = e.target.innerText?.trim();
    console.log("timzone selected : ", e);
    // localStorage.setItem("timezone", e.target.innerText?.trim());
    try {
      const updateTimezone = await axios.post(
        `${BACKEND_URL}/updateuser/${User?.id}`,
        { timezone: timeZone },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setTimezone(e.target.innerText?.trim());
      toast.success("Timezone updated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("Response: ", updateTimezone);
    } catch (error) {
      toast.error("Unable set timezone.", {
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

  return (
    <div
      // onMouseLeave={handleClose}
      style={{
        margin: 0,
        padding: "0.5rem 0.5rem",
        "& .MuiList-root": {
          backgroundColor:
            currentMode === "dark"
              ? "#1C1C1C !important"
              : "#1C1C1C !important",
        },
        "& .MuiPaper-root-MuiPopover-paper-MuiMenu-paper, .MuiList-root .clock-div":
          {
            backgroundColor:
              currentMode === "dark"
                ? "#1C1C1C !important"
                : "#1C1C1C !important",
          },
      }}
      className={`${
        currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#000000]"
      } clock-div`}
    >
      <TimeZone />
      <div className="flex justify-center h-[300px]">
        <AnalogClock timeString={currentTime} timezone={timeZone} />
        {/* <AnalogClock /> */}
      </div>
      <div className="flex justify-center my-2">
        <h2
          style={{
            marginRight: 8,
            fontSize: 12,
            color: currentMode === "dark" ? "white" : "black",
          }}
        >
          {currentTime}
        </h2>
      </div>
    </div>
  );
};

export default Clock;
