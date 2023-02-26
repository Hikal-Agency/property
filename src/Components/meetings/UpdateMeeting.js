import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useStateContext } from "../../context/ContextProvider";

const UpdateMeeting = ({
  meetingModalOpen,
  handleMeetingModalClose,
  FetchLeads,
}) => {
  // eslint-disable-next-line
  const { darkModeColors, currentMode, User, BACKEND_URL } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingTimeValue, setMeetingTimeValue] = useState({});
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingDateValue, setMeetingDateValue] = useState({});
  const [meetingLocation, setMeetingLocation] = useState("");
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  useEffect(() => {
    const getMeeting = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const { id } = meetingModalOpen;

        const meetingData = new FormData();
        meetingData.append("id", id);
        const response = await axios.post(
          `${BACKEND_URL}/updateMeeting`,
          meetingData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.meeting) {
          console.log("Hello");
          toast.error("Error in Fetching the Meeting", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          const { meetingStatus, meetingDate, meetingLocation, meetingTime } =
            response.data.meeting;
          setMeetingStatus(meetingStatus);
          setMeetingDateValue(dayjs(meetingDate));
          setMeetingTimeValue(dayjs("2023-01-01 " + meetingTime));
          setMeetingLocation(meetingLocation);
        }
      } catch (error) {
        console.log("Error in fetching single meeting: ", error);
        toast.error("Error in Fetching the Meeting", {
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
      setLoading(false);
    };

    getMeeting();
    //eslint-disable-next-line
  }, []);

  const update = async () => {
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      const { id } = meetingModalOpen;

      const meetingData = new FormData();
      meetingData.append("id", id);
      meetingData.append("meetingStatus", meetingStatus);
      meetingData.append("meetingTime", meetingTime);
      meetingData.append("meetingDate", meetingDate);
      meetingData.append("meetingLocation", meetingLocation);

      const response = await axios.post(
        `${BACKEND_URL}/updateMeeting`,
        meetingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (!response.data.meeting) {
        toast.error("Error in Updating the Meeting", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.success("Meeting Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleMeetingModalClose();
        FetchLeads(token);
      }
    } catch (error) {
      console.log("error in updating meeting: ", error);
      toast.error("Error in Updating the Meeting", {
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
    // setreloadDataGrid(true);
    setbtnloading(false);
  };

  function format(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={meetingModalOpen.open}
        onClose={handleMeetingModalClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center space-x-1">
              <CircularProgress size={20} />
              <span className="font-semibold text-lg">
                {" "}
                Fetching The Meeting
              </span>
            </div>
          ) : (
            <>
              <ToastContainer />
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl pb-10`}
              >
                Update Meeting details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  update();
                }}
              >
                <div className="grid sm:grid-cols-1 gap-5">
                  <div className="flex flex-col justify-center items-center gap-4 mt-2 mb-4">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Meeting Date"
                        value={meetingDateValue}
                        views={["year", "month", "day"]}
                        onChange={(newValue) => {
                          setMeetingDateValue(newValue);
                          setMeetingDate(
                            format(newValue.$d.getUTCFullYear()) +
                              "-" +
                              format(newValue.$d.getUTCMonth() + 1) +
                              "-" +
                              format(newValue.$d.getUTCDate() + 1)
                          );
                        }}
                        format="yyyy-MM-dd"
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        ampm={false}
                        label="Meeting Time"
                        format="HH:mm"
                        value={meetingTimeValue}
                        onChange={(newValue) => {
                          setMeetingTime(
                            format(newValue.$d.getHours()) +
                              ":" +
                              format(newValue.$d.getMinutes())
                          );
                          setMeetingTimeValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                      />
                    </LocalizationProvider>
                    <FormControl fullWidth>
                      <InputLabel id="meeting-status">
                        Meeting Status
                      </InputLabel>
                      <Select
                        labelId="meeting-status"
                        label="Meeting Status"
                        value={meetingStatus}
                        onChange={(e) => {
                          setMeetingStatus(e.target.value);
                        }}
                      >
                        <MenuItem value={"Pending"}>Pending</MenuItem>
                        <MenuItem value={"Postponed"}>Postponed</MenuItem>
                        <MenuItem value={"Attended"}>Attended</MenuItem>
                        <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Meeting Location"
                      value={meetingLocation}
                      onChange={(e) => {
                        setMeetingLocation(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                  ripple={true}
                  size="lg"
                  type="submit"
                  disabled={btnloading ? true : false}
                >
                  {btnloading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    </div>
                  ) : (
                    <span> Update Meeting</span>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default UpdateMeeting;
