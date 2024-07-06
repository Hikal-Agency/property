import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { socket } from "../../Pages/App";
import axios from "../../axoisConfig";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import "react-phone-number-input/style.css";
import dayjs from "dayjs";
import { BsCalendarDate, BsClock, BsPen } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";

import {
  DatePicker,
  LocalizationProvider,
  // TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import moment from "moment";

const AddReminder = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  FetchLeads,
}) => {
  console.log("Single Lead: ", LeadData);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    setSalesPerson: setAllSalesPersons,
    SalesPerson: AllSalesPersons,
    formatNum,
  } = useStateContext();
  const [value, setValue] = useState();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const [ReminderNotes, setReminderNotes] = useState("");
  const [ReminderEmail, setReminderEmail] = useState(User?.userEmail);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [reminderTimeValue, setTimeValue] = useState({});

  console.log("reminder:: ", reminderDate);

  const [error, setError] = useState(false);
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const AddReminderFunction = async () => {
    setbtnloading(true);
    if (!ReminderEmail) {
      toast.error("Email is required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,

        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
    }
    const token = localStorage.getItem("auth-token");
    const creationDate = new Date();
    const AddReminderData = new FormData();
    AddReminderData.append("reminder_note", ReminderNotes);
    AddReminderData.append("reminder_time", reminderTime);
    AddReminderData.append("reminder_date", reminderDate);
    AddReminderData.append("email", ReminderEmail);
    AddReminderData.append("leadName", LeadData?.leadName);
    AddReminderData.append("lead_id", LeadData?.leadId);
    AddReminderData.append("user_id", User?.id);
    AddReminderData.append("reminder_status", "Pending");
    // AddReminderData.append("reminder_enquiryType", LeadData?.enquiryType);
    // AddReminderData.append("reminder_project", LeadData?.project);

    await axios
      .post(`${BACKEND_URL}/reminders`, AddReminderData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Reminder added successfull");
        console.log(result);
        toast.success("Reminder Added Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        // fetching reminders after adding new reminder
        const fetchRminders = async () => {
          try {
            const reminders = await axios.get(`${BACKEND_URL}/reminders`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              params: {
                reminder_status: "Pending",
                user_id: User?.id,
              },
            });

            socket.emit("get_all_reminders", reminders.data.reminder.data);
          } catch (error) {
            console.log("Reminder error: ", error);
          }
        };
        fetchRminders();
        setbtnloading(false);
        handleLeadModelClose();
      })
      .catch((err) => {
        toast.error("Error in adding reminder", {
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
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={LeadModelOpen}
        onClose={handleLeadModelClose}
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
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleLeadModelClose}
          >
            <IoMdClose size={18} />
          </IconButton>
          <h1
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            } text-center font-semibold text-lg pb-7`}
          >
            Reminder
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              AddReminderFunction();
            }}
          >
            <div className="reminder grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-5">
              <div className="space-y-5">
                <Box sx={darkModeColors}>
                  <TextField
                    id="LeadName"
                    type={"text"}
                    sx={{
                      "& input": {
                        fontFamily: "Noto Kufi Arabic",
                      },
                    }}
                    label="Reminder Note"
                    className="w-full"
                    variant="outlined"
                    size="small"
                    required
                    value={ReminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <BsPen size={16} color={"#AAAAAA"} />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
                <Box sx={darkModeColors}>
                  <TextField
                    id="LeadName"
                    type={"text"}
                    sx={{
                      "& input": {
                        fontFamily: "Noto Kufi Arabic",
                        margintTop: "10px !important",
                      },
                    }}
                    label="Email"
                    className="w-full mt-3"
                    variant="outlined"
                    size="small"
                    required
                    value={ReminderEmail}
                    onChange={(e) => setReminderEmail(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <IconButton>
                          <AiOutlineMail size={16} color={"#AAAAAA"} />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year", "month", "day"]}
                    onChange={(newValue) => {
                      setReminderDate(
                        formatNum(newValue?.$d?.getUTCFullYear()) +
                          "-" +
                          formatNum(newValue?.$d?.getUTCMonth() + 1) +
                          "-" +
                          formatNum(newValue?.$d?.getUTCDate() + 1)
                      );
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        marginRight: "50px",
                      },
                    }}
                    format="yyyy-MM-dd"
                    InputProps={{ required: true }}
                    value={reminderDate}
                    renderInput={(params) => (
                      <TextField
                        label="Reminder Date"
                        sx={{
                          "& .MuiFormLabel-root": {
                            background: currentMode === "dark" ? "#111827" : "",
                            color: currentMode === "dark" ? "white" : "",
                          },
                          "& input": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "&": {
                            borderRadius: "4px",
                            border:
                              currentMode === "dark" ? "1px solid white" : "",
                          },
                          "& .MuiSvgIcon-root": {
                            color:
                              currentMode === "dark" ? "#AAAAAA" : "#AAAAAA",
                            marginRight: "10px",
                          },
                        }}
                        fullWidth
                        {...params}
                        onKeyDown={(e) => e.preventDefault()}
                        readOnly={true}
                        size="small"
                        // InputProps={{
                        //   endAdornment: (
                        //     <IconButton>
                        //       <BsCalendarDate size={16} color={"#AAAAAA"} />
                        //     </IconButton>
                        //   ),
                        // }}
                      />
                    )}
                    minDate={dayjs().startOf("day").toDate()}
                  />
                </LocalizationProvider> */}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year", "month", "day"]}
                    onChange={(newValue) => {
                      // setReminderDate(
                      //   formatNum(newValue?.$d?.getUTCFullYear()) +
                      //     "-" +
                      //     formatNum(newValue?.$d?.getUTCMonth() + 1) +
                      //     "-" +
                      //     formatNum(newValue?.$d?.getUTCDate() + 1)
                      // );

                      const formattedDate = moment(newValue?.$d).format(
                        "YYYY-MM-DD"
                      );
                      setReminderDate(formattedDate);
                    }}
                    format="yyyy-MM-dd"
                    InputProps={{ required: true }}
                    value={reminderDate}
                    renderInput={(params) => (
                      <TextField
                        label="Reminder Date"
                        sx={{
                          "& .MuiFormLabel-root": {
                            background: currentMode === "dark" ? "#111827" : "",
                            color: currentMode === "dark" ? "white" : "",
                          },
                          "& input": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "&": {
                            borderRadius: "4px",
                            border:
                              currentMode === "dark"
                                ? "1px solid white"
                                : "0px solid black",
                          },
                          "& .MuiSvgIcon-root": {
                            color: "#AAAAAA",
                            marginRight: "10px",
                          },
                        }}
                        fullWidth
                        {...params}
                        onKeyDown={(e) => e.preventDefault()}
                        readOnly={true}
                        size="small"
                      />
                    )}
                    minDate={dayjs().startOf("day").toDate()}
                  />
                </LocalizationProvider>

                {/*  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    ampm={false}
                    format="HH:mm"
                    value={reminderTimeValue}
                    onChange={(newValue) => {
                      setReminderTime(
                        formatNum(newValue?.$d?.getHours()) +
                          ":" +
                          formatNum(newValue?.$d?.getMinutes())
                      );
                      setTimeValue(newValue);
                    }}
                    InputProps={{ required: true }}
                    sx={{ marginTop: "3px !important" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label="Reminder Time"
                        sx={{
                          "& .MuiFormLabel-root": {
                            background: currentMode === "dark" ? "#111827" : "",
                            color: currentMode === "dark" ? "white" : "",
                          },
                          "& input": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "& .MuiSvgIcon-root": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "&": {
                            borderRadius: "4px",
                            border:
                              currentMode === "dark" ? "1px solid white" : "",
                          },
                          "&:focus": {
                            border: "",
                          },
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        readOnly={true}
                      />
                    )}
                  />
                </LocalizationProvider>{" "}
                */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileTimePicker
                    // ampm={false}
                    format="hh:mm A"
                    value={reminderTimeValue}
                    onChange={(newValue) => {
                      setReminderTime(
                        formatNum(newValue?.$d?.getHours()) +
                          ":" +
                          formatNum(newValue?.$d?.getMinutes())
                      );
                      setTimeValue(newValue);
                    }}
                    InputProps={{ required: true }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        size="small"
                        label="Reminder Time"
                        sx={{
                          "& .MuiFormLabel-root": {
                            background: currentMode === "dark" ? "#111827" : "",
                            color: currentMode === "dark" ? "white" : "",
                          },
                          "& input": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "& .MuiSvgIcon-root": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "&": {
                            borderRadius: "4px",
                            // border:
                            //   currentMode === "dark" ? "1px solid white" : "",
                          },
                          "&:focus": {
                            border: "",
                          },
                        }}
                        onKeyDown={(e) => e.preventDefault()}
                        readOnly={true}
                        InputProps={{
                          endAdornment: (
                            <IconButton>
                              <BsClock size={16} color={"#AAAAAA"} />
                            </IconButton>
                          ),
                        }}
                      />
                    )}
                    // views={["hours", "minutes", "seconds"]}
                    // defaultView={"hours"}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <Button
              className={`min-w-fit w-full mt-5 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
              ripple={true}
              size="lg"
              style={{ color: "white" }}
              type="submit"
              disabled={btnloading ? true : false}
            >
              {btnloading ? (
                <div className="flex items-center justify-center space-x-1 mt-5">
                  <CircularProgress size={18} sx={{ color: "white" }} />
                </div>
              ) : (
                <span>Set Reminder</span>
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default AddReminder;
