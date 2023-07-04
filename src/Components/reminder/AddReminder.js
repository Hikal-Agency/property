import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
// import axios from "axios";
import axios from "../../axoisConfig";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import "react-phone-number-input/style.css";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import dayjs from "dayjs";

import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [reminderTimeValue, setTimeValue] = useState({});

  const [error, setError] = useState(false);
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const AddReminderFunction = async () => {
    setbtnloading(true);

    const token = localStorage.getItem("auth-token");
    const creationDate = new Date();
    const AddReminderData = new FormData();
    AddReminderData.append("reminder_note", ReminderNotes);
    AddReminderData.append("reminder_time", reminderTime);
    AddReminderData.append("reminder_date", reminderDate);
    AddReminderData.append("leadName", LeadData?.leadName);
    AddReminderData.append("lead_id", LeadData?.leadId);
    AddReminderData.append("user_id", User?.id);
    AddReminderData.append("reminder_status", "Pending");

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
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
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
            } text-center font-bold text-xl pb-10`}
          >
            Set Reminder
          </h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              AddReminderFunction();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 gap-5">
              <div className="space-y-5">
                <Box sx={darkModeColors}>
                  <TextField
                    id="LeadName"
                    type={"text"}
                    label="Reminder Notes"
                    className="w-full"
                    variant="outlined"
                    size="medium"
                    required
                    value={ReminderNotes}
                    onChange={(e) => setReminderNotes(e.target.value)}
                  />
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year", "month", "day"]}
                    onChange={(newValue) => {
                      // setMeetingDateValue(newValue);
                      setReminderDate(
                        formatNum(newValue?.$d?.getUTCFullYear()) +
                          "-" +
                          formatNum(newValue?.$d?.getUTCMonth() + 1) +
                          "-" +
                          formatNum(newValue?.$d?.getUTCDate() + 1)
                      );
                    }}
                    format="yyyy-MM-dd"
                    InputProps={{ required: true }}
                    value={reminderDate}
                    renderInput={(params) => (
                      <TextField
                        sx={{
                          "& input": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                          "&": {
                            borderRadius: "4px",
                            border:
                              currentMode === "dark"
                                ? "1px solid white"
                                : "1px solid black",
                          },
                          "& .MuiSvgIcon-root": {
                            color: currentMode === "dark" ? "white" : "black",
                          },
                        }}
                        fullWidth
                        label="Reminder Date"
                        {...params}
                        onKeyDown={(e) => e.preventDefault()}
                        readOnly={true}
                      />
                    )}
                    minDate={dayjs().startOf("day").toDate()}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                </LocalizationProvider>
              </div>
            </div>

            <Button
              className={`min-w-fit w-full mt-5 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
              ripple={true}
              size="lg"
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
