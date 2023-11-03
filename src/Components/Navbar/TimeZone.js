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
  } = useStateContext();
  const token = localStorage.getItem("auth-token");

  const [currentTime, setCurrentTime] = useState(
    timeZone
      ? moment().tz(timeZone).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
      : moment().tz(moment.tz.guess()).format("D/MM/YYYY, h:mm:ss a [GMT]Z")
  );
  const [timezones, setTimezones] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTimezones = timezones?.filter((timezone) =>
    timezone.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  useEffect(() => {
    // Fetch all timezones
    const fetchedTimezones = moment.tz.names();
    setTimezones(fetchedTimezones);

    console.log("Timezone::", timeZone);
  }, []);

  return (
    <>
      <div className="flex justify-between mb-2">
        <Box>
          <h3 className={`${currentMode === "dark" ? "#fff" : "#000"}`}>
            {timeZone}
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
              <MenuItem value="selected">--- Select a timezone ---</MenuItem>
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
              {filteredTimezones?.map((timezone) => (
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
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
    </>
  );
};

export default TimeZone;
