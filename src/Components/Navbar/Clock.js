import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { MenuItem, Select } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(
    moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  );
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
  const { currentMode } = useStateContext();

  useEffect(() => {
    // Fetch all timezones
    const fetchedTimezones = moment.tz.names();
    setTimezones(fetchedTimezones);

    // Set default timezone
    // setSelectedTimezone(moment.tz.guess());

    // Update current time every second
    const interval = setInterval(() => {
      console.log(selectedTimezone);
      setCurrentTime(
        moment().tz(selectedTimezone).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedTimezone]);

  const handleTimezoneChange = (e) => {
    setSelectedTimezone(e.target.value);
  };

  const SelectStyles = {
    "&": {
      // color: currentMode === "dark" ? "white !important" : "black !important",
      color: "#ffffff",
      fontSize: "0.9rem",
      fontWeight: "500",
    },
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
      {
        // color: currentMode === "dark" ? "white !important" : "black !important",
        color: "#ffffff",
        fontSize: "0.9rem",
        fontWeight: "500",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor:
      //   currentMode === "dark" ? "white !important" : "black !important",
      borderColor: "#ffffff",
    },
    "& .MuiFormLabel-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
  };

  return (
    <div
      style={{
        background: "#ffffff",
      }}
      className="py-2 px-3 ml-3"
    >
      <div className="flex items-center  ">
        <h2
          style={{
            marginRight: 8,
            fontSize: 14,
            // color: currentMode === "dark" ? "white" : "black",
            color: "#000000",
          }}
        >
          {currentTime}
        </h2>
        <Select
          className="time-zone-select"
          sx={{
            ...SelectStyles,
            padding: 0,
            "& .MuiSelect-select": {
              padding: "0 25px 0 5px !important",
            },
            color: "#000000 !important",
          }}
          size="small"
          value={selectedTimezone}
          onChange={handleTimezoneChange}
        >
          {timezones?.map((timezone) => (
            <MenuItem key={timezone} value={timezone}>
              {timezone}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default Clock;
