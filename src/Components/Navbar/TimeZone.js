import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import moment from "moment";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
// import { FormControl } from "@mui/base";

const TimeZone = () => {
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
    pinnedZone,
    setPinnedZone,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");

  console.log("pinnedzone:::: ", pinnedZone);

  const [currentTime, setCurrentTime] = useState(
    timeZone
      ? moment().tz(timeZone).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
      : moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  );
  // const [timezones, setTimezones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTimezones = timeZones?.filter((timezone) =>
    timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedTimezones = filteredTimezones?.filter((timezone) =>
    pinnedZone.includes(timezone)
  );

  const unpinnedTimezones = filteredTimezones?.filter(
    (timezone) => !pinnedZone.includes(timezone)
  );

  const handlePinTimeZone = async (e, timezone, type) => {
    e.stopPropagation();
    e.preventDefault();

    console.log("timezone in handlechange:: ", timezone);

    console.log("pinnedZone in handlechange: ", pinnedZone);

    // Fetch the previous pinned values from the state
    const previousPinnedValues = pinnedZone || [];

    console.log("prev pinnedZones:: ", previousPinnedValues);
    console.log("prev pinnedZones:: ", previousPinnedValues.length);

    // Check if the timezone is already pinned
    const isPinned = previousPinnedValues.includes(timezone);

    let updatedPinnedValues;

    // Remove the timezone if it already exists
    if (isPinned) {
      updatedPinnedValues = previousPinnedValues.filter(
        (existingTimezone) => existingTimezone !== timezone
      );
    } else {
      if (previousPinnedValues.length > 2) {
        toast.error("You can only pin up to 3 timezones.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }
      // Append the new timezone
      updatedPinnedValues = [...previousPinnedValues, timezone];
      // updatedPinnedValues = timezone;
    }

    try {
      const pinTimeZone = await axios.post(
        `${BACKEND_URL}/updateuser/${User?.id}`,
        { pinned: updatedPinnedValues },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setPinnedZone(updatedPinnedValues);

      toast.success(`Timezone ${type === 0 ? "Unpinned" : "Pinned"}.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("Response: ", pinTimeZone);
    } catch (error) {
      toast.error("Unable to pin timezone.", {
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

  const handleTimezoneChange = async (e) => {
    // const timeZone = e.target.innerText?.trim();
    // const timeZone = e.target.innerText?.trim().replace("⚑", "");
    const timeZone = e.target.innerText
      ?.trim()
      .replace(/[\u2691\u2690\n]/g, "");

    // const updateTimzone = timeZone.slice(timeZone.indexOf("\u2691") + 1);
    console.log("timzone selected : ", e);
    console.log("trimmed timezone::: ", timeZone);

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

      setTimezone(timeZone);
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

  useEffect(() => {
    // Fetch all timezones
    const fetchedTimezones = moment.tz.names();
    setTimezones(fetchedTimezones);

    console.log("Timezone::", timeZone);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-2 px-4">
        <Box>
          <h3 className={`${currentMode === "dark" ? "#fff" : "#000"}`}>
            {/* {timeZone} */}
          </h3>
        </Box>
        <Box sx={darkModeColors} style={{ minWidth: "50px" }}>
          <FormControl fullWidth>
            {/* <InputLabel id="demo-simple-select-label">
              Select a timezone
            </InputLabel> */}

            <Select
              className="time-zone-select"
              id="demo-simple-select-standard"
              sx={{
                padding: 0,
                "& .MuiSelect-select": {
                  padding: "5px 20px 5px 5px !important",
                },
                color:
                  currentMode === "dark"
                    ? "#FFF !important"
                    : "#000 !important",
              }}
              size="small"
              variant="standard"
              value={"selected"}
              labelId="demo-simple-select-label"
              // onChange={handleTimezoneChange}
            >
              <MenuItem className="uppercase" value="selected">
                {timeZone ?? "---SELECT---"}
                {/* ---SELECT--- */}
              </MenuItem>
              <MenuItem
                value={"search"}
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
              {/* {filteredTimezones?.map((timezone) => (
                <>
                  <MenuItem
                    // onKeyDown={(e) => e.stopPropagation()}
                    key={timezone}
                    value={timezone}
                    onClick={handleTimezoneChange}
                  >
                    {timezone}
                  </MenuItem>
                </>
              ))} */}
              {pinnedTimezones?.map((timezone) => (
                <MenuItem
                  key={timezone}
                  value={timezone}
                  onClick={handleTimezoneChange}
                >
                  <span
                    style={{ marginRight: "8px", cursor: "pointer" }}
                    onClick={(e) => handlePinTimeZone(e, timezone, 0)}
                    value={pinnedZone}
                  >
                    {"\u2690"}
                  </span>
                  {timezone}
                </MenuItem>
              ))}

              {unpinnedTimezones?.map((timezone) => (
                <MenuItem
                  key={timezone}
                  value={timezone}
                  onClick={handleTimezoneChange}
                >
                  <span
                    style={{ marginRight: "8px", cursor: "pointer" }}
                    onClick={(e) => handlePinTimeZone(e, timezone)}
                    value={pinnedZone}
                  >
                    {"\u2691"}
                  </span>
                  {timezone}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    </>
  );
};

export default TimeZone;
