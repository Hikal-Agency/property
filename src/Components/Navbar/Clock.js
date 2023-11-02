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

const Clock = ({ handleClose }) => {
  const { currentMode, darkModeColors, t, BACKEND_URL, User } =
    useStateContext();
  const token = localStorage.getItem("auth-token");
  // const [currentTime, setCurrentTime] = useState(
  //   localStorage.getItem("timezone")
  //     ? moment()
  //         .tz(localStorage.getItem("timezone"))
  //         .format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  //     : moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  // );
  const [currentTime, setCurrentTime] = useState(
    User?.timezone
      ? moment().tz(User?.timezone).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
      : moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  );
  const [timezones, setTimezones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTimezone, setSelectedTimezone] = useState(
    // localStorage.getItem("timezone") || moment.tz.guess()
    User?.timezone || moment.tz.guess()
  );

  console.log("mode: ", currentMode);

  useEffect(() => {
    if (localStorage.getItem("timezone")) {
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

  console.log("User?.timzone: ", User?.timezone);

  const filteredTimezones = timezones?.filter((timezone) =>
    timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("filtered timezone list: ", filteredTimezones);

  const handleTimezoneChange = async (e) => {
    const timeZone = e.target.value;
    console.log("timzone selected : ", e.target.value);
    setSelectedTimezone(e.target.value);
    localStorage.setItem("timezone", e.target.value);
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
      onClick={(e) => e.stopPropagation()}
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
      <div className="flex justify-end mb-2">
        <Box sx={darkModeColors} style={{ minWidth: "30px" }}>
          <Select
            className="time-zone-select"
            sx={{
              padding: 0,
              "& .MuiSelect-select": {
                padding: "5px 20px 5px 5px !important",
              },
              color:
                currentMode === "dark" ? "#FFF !important" : "#000 !important",
            }}
            size="small"
            variant="standard"
            value={selectedTimezone}
            onClick={handleTimezoneChange}
          >
            <MenuItem
              onKeyDown={(e) => {
                e.stopPropagation();
                // e.preventDefault();
              }}
            >
              {/* <Box sx={darkModeColors}> */}
              <TextField
                placeholder={t("search_timezone")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  "& input": {
                    border: "0",
                  },
                }}
                variant="standard"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        sx={{ padding: 1 }}
                        // onClick={(e) => {
                        //   e.preventDefault();
                        //   const inputValue =
                        //     searchRef.current.querySelector("input").value;
                        //   if (inputValue) {
                        //     fetchUsers(inputValue);
                        //   }
                        // }}
                      >
                        <BsSearch className={`text-[#AAAAAA]`} size={18} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              />
              {/* </Box> */}
            </MenuItem>
            {filteredTimezones?.map((timezone) => (
              <>
                <MenuItem
                  // selected={timezone === selectedTimezone}
                  onKeyDown={(e) => e.stopPropagation()}
                  key={timezone}
                  value={timezone}
                >
                  {timezone}
                </MenuItem>
              </>
            ))}
          </Select>
        </Box>
      </div>
      <div className="flex justify-center h-[300px]">
        <AnalogClock timeString={currentTime} timezone={selectedTimezone} />
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
