import { Button } from "@material-tailwind/react";
import {
  CircularProgress,
  Dialog,
  FormControl,
  InputLabel,
  IconButton,
  MenuItem,
  // Select,
  TextField,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { MdAccessTime } from "react-icons/md";
import { socket } from "../../Pages/App.js";

import axios from "../../axoisConfig";
import React, { useState, useEffect } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import LocationPicker from "../meetings/LocationPicker";
import dayjs from "dayjs";

const RenderFeedback = ({ cellValues }) => {
  const [btnloading, setbtnloading] = useState(false);
  const [Feedback, setFeedback] = useState(cellValues?.row?.feedback);
  const [newFeedback, setnewFeedback] = useState("");
  const [DialogueVal, setDialogue] = useState(false);
  const [meetingData, setMeetingData] = useState({
    meetingDate: null,
    meetingTime: null,
    meetingStatus: null,
  });
  const [meetingLocation, setMeetingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });
  const {
    currentMode,
    setreloadDataGrid,
    reloadDataGrid,
    fetchSidebarData,
    BACKEND_URL,
    User,
    Managers,
  } = useStateContext();
  const ChangeFeedback = (e) => {
    setnewFeedback(e.target.value);
    setDialogue(true);
  };

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        fontSize: "12px",
        fontWeight: "400",
        // borderLeft: currentMode === "dark" ? "1px solid white" : "1px solid black",
        // borderRight: currentMode === "dark" ? "1px solid white" : "1px solid black",
        border: "none",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };

  console.log("Feedback: ", Feedback);
  const UpdateFeedback = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("lid", cellValues?.row?.leadId);
    UpdateLeadData.append("id", cellValues?.row?.leadId);
    UpdateLeadData.append("feedback", newFeedback);
    if (newFeedback === "Meeting") {
      if (!meetingData.meetingDate || !meetingData.meetingTime) {
        toast.error("Meeting time and date required.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        return;
      }
      UpdateLeadData.append(
        "meetingDate",
        meetingData.meetingDate.toISOString().split("T")[0]
      );
      UpdateLeadData.append(
        "meetingTime",
        new Date(meetingData.meetingTime).toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      UpdateLeadData.append(
        "meetingStatus",
        meetingData.meetingStatus || "Pending"
      );
      UpdateLeadData.append("mLat", String(meetingLocation.lat));
      UpdateLeadData.append("mLong", String(meetingLocation.lng));
      UpdateLeadData.append("meetingLocation", meetingLocation.addressText);
      UpdateLeadData.append("meetingNote", meetingData.notes || "");
    }

    await axios
      .post(`${BACKEND_URL}/leads/${cellValues?.row?.leadId}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        fetchSidebarData();
        console.log("Feedback Updated successfull");
        console.log(result);
        
        toast.success("Feedback Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (newFeedback === "Meeting") {
          socket.emit("notification_meeting_schedule", {
            from: { id: User?.id },
            leadName: cellValues?.row?.leadName,
            meetingDate: meetingData.meetingDate.toISOString().split("T")[0],
            meetingTime: new Date(meetingData.meetingTime).toLocaleTimeString(
              "en-US",
              {
                hour12: false,
                timeZone: "Asia/Dubai",
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            participants: [User?.isParent],
          });
        } else {
          socket.emit("notification_feedback_update", {
            from: { id: User?.id, userName: User?.userName },
            leadName: cellValues?.row?.leadName,
            newFeedback: newFeedback,
            participants: [
              cellValues?.row?.assignedToManager || 0,
              cellValues?.row?.assignedToSales || 0,
            ],
          });
        }
        setbtnloading(false);
        setFeedback(newFeedback);
        setreloadDataGrid(!reloadDataGrid);
        setDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Feedback", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };

  useEffect(() => {
    setFeedback(cellValues?.row?.feedback);
  }, [cellValues]);

  // useEffect(() => {
  //   const geocoder = new window.google.maps.Geocoder();
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     geocoder.geocode(
  //       {
  //         location: {
  //           lat: Number(position.coords.latitude),
  //           lng: Number(position.coords.longitude),
  //         },
  //       },
  //       (results, status) => {
  //         if (status === "OK") {
  //           setMeetingLocation({
  //             lat: Number(position.coords.latitude),
  //             lng: Number(position.coords.longitude),
  //             addressText: results[0].formatted_address,
  //           });
  //         } else {
  //           console.log("Getting address failed due to: " + status);
  //         }
  //       }
  //     );
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Box
      className={`mr-2 w-full h-full flex items-center justify-center `}
      sx={SelectStyles}
    >
      {/* <Select
        id="feedback"
        value={Feedback || ""}
        label="Feedback"
        onChange={ChangeFeedback}
        size="medium"
        className="w-[100%] h-[75%] border-none"
        displayEmpty
        required
      >
        {!Feedback && (
          <MenuItem value={"0"} selected>
            Select Feedback
          </MenuItem>
        )}

        <MenuItem value={"New"}>New</MenuItem>
        <MenuItem value={"Follow Up"}>Follow Up</MenuItem>
        <MenuItem value={"Meeting"}>Meeting</MenuItem>
        <MenuItem value={"Booked"}>Booked</MenuItem>
        <MenuItem value={"Duplicate"}>Duplicate</MenuItem>
        <MenuItem value={"No Answer"}>No Answer</MenuItem>
        <MenuItem value={"Low Budget"}>Low Budget</MenuItem>
        <MenuItem value={"Not Interested"}>Not Interested</MenuItem>
        <MenuItem value={"Unreachable"}>Unreachable</MenuItem>
      </Select> */}
      <FormControl
        className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
        sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}
      >
        <Select
          id="feedback"
          value={Feedback ?? "selected"}
          label="Feedback"
          onChange={ChangeFeedback}
          size="medium"
          // className="w-[100%] h-[75%] border-none render"
          className="w-full border border-gray-300 rounded "
          displayEmpty
          required
          sx={{
            border: "1px solid #000000",
            // color:
            //   currentMode === "dark"
            //     ? "#ffffff !important"
            //     : "#000000 !important",
            // "& .MuiSelect-icon": {
            //   color:
            //     currentMode === "dark"
            //       ? "#ffffff !important"
            //       : "#000000 !important",
            // },
            "& .MuiSelect-select": {
              fontSize: 11,
            },
          }}
        >
          {!Feedback ? (
            <MenuItem value={"selected"} selected>
              ---Feedback---
            </MenuItem>
          ) : null}

          <MenuItem value={"New"}>New</MenuItem>
          <MenuItem value={"Follow Up"}>Follow Up</MenuItem>
          <MenuItem value={"Meeting"}>Meeting</MenuItem>
          <MenuItem value={"Booked"}>Booked</MenuItem>
          <MenuItem value={"Low Budget"}>Low Budget</MenuItem>
          <MenuItem value={"Not Interested"}>Not Interested</MenuItem>
          <MenuItem value={"No Answer"}>No Answer</MenuItem>
          <MenuItem value={"Unreachable"}>Unreachable</MenuItem>
          <MenuItem value={"Duplicate"}>Duplicate</MenuItem>
          <MenuItem value={"Dead"}>Dead</MenuItem>
          <MenuItem value={"Wrong Number"}>Wrong Number</MenuItem>

        </Select>
      </FormControl>

      {DialogueVal && (
        <>
          <Dialog
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "none !important",
              },
              "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                {
                  backgroundColor: "rgba(0, 0, 0, 0.5) !important",
                },
            }}
            open={DialogueVal}
            onClose={(e) => setDialogue(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="relative"
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setDialogue(false)}
            >
              <IoMdClose size={18} />
            </IconButton>
            <div className="px-10 py-5">
              <div className="flex flex-col justify-center items-center">
                <IoIosAlert
                  size={50}
                  className="text-primary text-2xl"
                />
                <h1 className="font-semibold pt-3 text-lg text-center">
                  Do You Really Want Change the Feedback from{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {Feedback ?? "No feedback"}
                  </span>{" "}
                  to{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {newFeedback}
                  </span>{" "}
                  ?
                </h1>
              </div>
              {newFeedback === "Meeting" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateFeedback(cellValues);
                  }}
                >
                  <div className="flex flex-col justify-center items-center gap-4 mt-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Meeting Date *"
                        value={meetingData.meetingDate}
                        views={["year", "month", "day"]}
                        onChange={(newValue) => {
                          setMeetingData({
                            ...meetingData,
                            meetingDate: newValue,
                          });
                        }}
                        format="yyyy-MM-dd"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                            fullWidth
                          />
                        )}
                        minDate={dayjs().startOf("day").toDate()}
                        InputProps={{ required: true }}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        // ampm={false}
                        label="Meeting Time *"
                        format="hh:mm A"
                        value={meetingData.meetingTime}
                        onChange={(newValue) => {
                          setMeetingData({
                            ...meetingData,
                            meetingTime: newValue,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <IconButton>
                                  <MdAccessTime color={"#000000"} />
                                </IconButton>
                              ),
                            }}
                          />
                        )}
                        InputProps={{ required: true }}
                      />
                    </LocalizationProvider>
                    <FormControl fullWidth>
                      <InputLabel id="meeting-status">
                        Meeting Status *
                      </InputLabel>
                      <Select
                        labelId="meeting-status"
                        label="Meeting Status *"
                        value={meetingData.meetingStatus}
                        onChange={(e) => {
                          setMeetingData({
                            ...meetingData,
                            meetingStatus: e.target.value,
                          });
                        }}
                        required
                      >
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Postponed"}>Postponed</MenuItem>
                        <MenuItem value={"Attended"}>Attended</MenuItem>
                        <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      id="text"
                      type={"text"}
                      sx={{
                        "& input": {
                          fontFamily: "Noto Kufi Arabic",
                        },
                      }}
                      label="Meeting Notes "
                      className="w-full mb-3"
                      style={{ marginBottom: "20px" }}
                      variant="outlined"
                      name="text"
                      size="medium"
                      onChange={(e) => {
                        setMeetingData({
                          ...meetingData,
                          notes: e.target.value,
                        });
                      }}
                      required
                    />

                    <LocationPicker
                      meetingLocation={meetingLocation}
                      currLocByDefault={true}
                      setMeetingLocation={setMeetingLocation}
                    />
                  </div>
                  <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                    <Button
                      className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                      ripple={true}
                      size="lg"
                      type="submit"
                    >
                      {btnloading ? (
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      ) : (
                        <span>Confirm</span>
                      )}
                    </Button>

                    <Button
                      onClick={() => setDialogue(false)}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none px-2 rounded-md text-sm  ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-primary border-primary"
                      }`}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                  <Button
                    className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                    ripple={true}
                    size="lg"
                    onClick={() => UpdateFeedback(cellValues)}
                  >
                    {btnloading ? (
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                      <span>Confirm</span>
                    )}
                  </Button>

                  <Button
                    onClick={() => setDialogue(false)}
                    ripple={true}
                    variant="outlined"
                    className={`shadow-none  rounded-md text-sm  ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-primary border-primary"
                    }`}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RenderFeedback;
