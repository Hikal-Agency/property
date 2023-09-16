import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import { MenuItem, Select, Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import AnalogClock from "./AnalogClock";

const Clock = ({handleClose}) => {
  const [currentTime, setCurrentTime] = useState(
    localStorage.getItem("timezone") ? moment().tz(localStorage.getItem("timezone")).format("D/MM/YYYY, h:mm:ss a [GMT]Z") :
    moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  );
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(moment.tz.guess());
  const { currentMode, darkModeColors } = useStateContext();

  console.log("mode: ", currentMode);

  useEffect(() => {
    if(localStorage.getItem("timezone")) {
      setSelectedTimezone(localStorage.getItem("timezone"));
    }
  }, []);

  useEffect(() => {
    // Fetch all timezones
    const fetchedTimezones = moment.tz.names();
    setTimezones(fetchedTimezones);

    // Update current time every second
    const interval = setInterval(() => {
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
    localStorage.setItem("timezone", e.target.value);
  };

  

  return (
    <div
    onMouseLeave={handleClose}
      style={{
        margin: 0,
        padding: "0.5rem 0.5rem",
        "& .MuiList-root": {
          backgroundColor:
            currentMode === "dark"
              ? "#1C1C1C !important"
              : "#1C1C1C !important",
        },
        "& .MuiPaper-root-MuiPopover-paper-MuiMenu-paper, .MuiList-root .clock-div": {
          backgroundColor:
            currentMode === "dark"
              ? "#1C1C1C !important"
              : "#1C1C1C !important",
        }
      }}
      className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#000000]"} clock-div`}
    >
      <div className="flex justify-end mb-2">
        <Box sx={darkModeColors} style={{ minWidth: "30px"}} >
          <Select
            className="time-zone-select"
            sx={{
              padding: 0,
              "& .MuiSelect-select": {
                padding: "5px 20px 5px 5px !important",
              },
              color: currentMode === "dark" ? "#FFF !important" : "#000 !important",
            }}
            size="small"
            variant="standard"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
          >
            {timezones?.map((timezone) => (
              <MenuItem onClick={(e) => e.stopPropagation()} key={timezone} value={timezone}>
                {timezone}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </div>
      <div className="flex justify-center">
        <AnalogClock timeString={currentTime} timezone={selectedTimezone} />
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
