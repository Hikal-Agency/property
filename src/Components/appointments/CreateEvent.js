import { useState } from "react";
import {
  Modal,
  Button,
  Backdrop,
  IconButton,
  TextField,
  CircularProgress,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { Textarea } from "@material-tailwind/react";
import { DatePicker, MobileTimePicker } from "@mui/x-date-pickers";
import { MdAccessTime } from "react-icons/md";
// import moment from "moment";
import moment from "moment-timezone";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateEvent = ({
  createEventModal,
  setCreateEventModal,
  gapi,
  listUpcomingEvents,
}) => {
  console.log("create event modal: ", createEventModal);
  const { currentMode, formatNum } = useStateContext();
  const modal_type = createEventModal?.action;
  console.log("modal type: ", modal_type);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const [taskData, setTaskData] = useState({
    taskTitle: "",
    taskDescription: "",
  });

  const [values, setValues] = useState({
    appointmentTitle: "",
    appointmentDescription: "",
    assignedTo: "",
  });
  const [btnloading, setbtnloading] = useState(false);
  const [dateTime, setDateTime] = useState({
    from: "",
    to: "",
  });
  const [dateTimeValues, setDateTimeValues] = useState({
    from: "",
    to: "",
  });
  const [time, setTime] = useState({
    from: "",
    to: "",
  });
  const [timeValue, setTimeValue] = useState({
    from: "",
    to: "",
  });

  // console.log("date===> : ", dateTime);
  // console.log("time===> : ", time);
  console.log("date===> : ", dateTime);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setbtnloading(true);
    function combineDateTime(date, time) {
      const timeZone = moment.tz.guess();
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const formattedTime = moment(time, "hh:mm A").format("HH:mm:ss");

      const offsetMinutes = moment().tz(timeZone).utcOffset();
      const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
      const offsetMinutesPart = Math.abs(offsetMinutes) % 60;
      const offset = `${offsetHours
        .toString()
        .padStart(2, "0")}:${offsetMinutesPart.toString().padStart(2, "0")}`;

      return `${formattedDate}T${formattedTime}-${offset}`;
    }

    // const startDateTime = combineDateTime(dateTime?.from, time?.from);
    // const endDateTime = combineDateTime(dateTime?.to, time?.to);
    const startDateTime = combineDateTime(dateTime?.from, time?.from);
    const endDateTime = combineDateTime(dateTime?.to, time?.to);
    // const timeZone = moment.tz.guess();
    // const offset = moment.tz(timeZone).format("Z");

    try {
      var event = JSON.stringify({
        kind: "calendar#event",

        summary: values.appointmentTitle,
        // location: "",
        description: values.appointmentDescription,

        start: {
          dateTime: dateTime.from,
          // dateTime: startDateTime,
          // dateTime: "2023-08-11T19:00:00-07:00",
        },
        end: {
          dateTime: dateTime.to,
          // dateTime: endDateTime,
          // dateTime: "2023-08-11T17:00:00-07:00",
          // timeZone: timeZone,
        },

        // attendees: [
        //   { email: "mjunaid.swe@gmail.com.com", responseStatus: "needsAction" },
        // ],
        reminders: {
          useDefault: true,
        },
        guestsCanSeeOtherGuests: true,
      });

      console.log("submitted event data: ", event);
      const accessToken = localStorage.getItem("access_token");

      // var request = gapi.client.calendar.events.insert({
      //   calendarId: "primary",
      //   resource: event,
      //   // sendUpdates: "all",
      //   auth: accessToken,
      // });

      var request = gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      request.execute(
        (event) => {
          console.log("event created:  ", event);
          // listUpcomingEvents();
          setbtnloading(false);
          toast.success("Appointment Created Successfuly", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          navigator.clipboard.writeText(event.htmlLink);
          setTimeout(() => {
            toast.success("Link of Appointment Copied to clipboard", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }, 2000);
        },
        (error) => {
          console.error(error);
          setbtnloading(false);
          toast.error("Failed to create a new event", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      );
      setCreateEventModal({ ...createEventModal, isOpen: false });
      listUpcomingEvents();
      setbtnloading(false);
    } catch (error) {
      console.log(error);
      setbtnloading(false);
      toast.error("Failed to create a new event", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    setbtnloading(true);

    try {
      const task = JSON.stringify({
        title: taskData?.taskTitle,
        notes: taskData?.taskDescription,
        assignedTo: taskData?.assignedTo,
        type: "Email",
        date: "2023-08-12",
      });

      const response = await gapi.client.tasks.tasks.insert({
        tasklist: "@default", // Use default task list
        resource: task,
      });

      console.log("Task created:", response.result);

      toast.success("Task Created Successfuly.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("error: ", error);
      setbtnloading(false);
      toast.error("Unable to add tasks.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Modal
        keepMounted
        open={createEventModal.isOpen}
        onClose={() => setCreateEventModal({ isOpen: false })}
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
          className={`w-[calc(100%-20px)] md:w-[40%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-[45%] left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setCreateEventModal({ isOpen: false })}
          >
            <IoMdClose size={18} />
          </IconButton>
          <h1
            className={`text-center font-bold mb-5 text-xl ${
              currentMode === "dark" ? "text-white" : "text-dark"
            }`}
          >
            Create {`${modal_type === 0 ? "an appoitment" : "a task"}`}
          </h1>
          <form className="mt-3">
            <div className="grid grid-cols-6 gap-x-3">
              <div className="col-span-6">
                {modal_type === 0 ? (
                  <Textarea
                    type="text"
                    placeholder="Appointment Description"
                    // label="Offer Description"
                    className="w-full mb-3"
                    name="offerDescription"
                    // variant="outlined"
                    size="lg"
                    value={values.appointmentDescription}
                    required
                    onChange={(e) =>
                      setValues({
                        ...values,
                        appointmentDescription: e.target.value,
                      })
                    }
                  />
                ) : (
                  <>
                    <div className="col-span-6">
                      <TextField
                        type={"text"}
                        placeholder="Title"
                        // label="Offer Description"
                        className="w-full mb-3"
                        name="taskTitle"
                        style={{ marginBottom: "20px" }}
                        // variant="outlined"
                        size="lg"
                        value={taskData?.taskTitle}
                        required
                        onChange={(e) =>
                          setTaskData({
                            ...taskData,
                            taskTitle: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Textarea
                      type="text"
                      placeholder="Task Description"
                      className="w-full mb-3"
                      name="TaskDesc"
                      // variant="outlined"
                      size="lg"
                      value={taskData.taskDescription}
                      required
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          taskDescription: e.target.value,
                        })
                      }
                    />
                  </>
                )}
              </div>
              {modal_type === 0 && (
                <>
                  <div className="col-span-6">
                    <TextField
                      id="appointment-title"
                      type={"text"}
                      label="Appointment Title"
                      className="w-full mb-5"
                      style={{ marginBottom: "10px" }}
                      variant="outlined"
                      size="medium"
                      required
                      value={values.appointmentTitle}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          appointmentTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* <div className="col-span-6">
                    <TextField
                      id="appointment-description"
                      type={"text"}
                      label="Appointment Description"
                      className="w-full mb-5"
                      style={{ marginBottom: "10px" }}
                      variant="outlined"
                      size="medium"
                      required
                      value={values.appointmentDescription}
                      onChange={(e) =>
                        setValues({
                          ...values,
                          appointmentDescription: e.target.value,
                        })
                      }
                    />
                  </div> */}
                </>
              )}

              {modal_type === 1 && (
                <>
                  {/* <div className="col-span-3">
                    <TextField
                      select
                      id="user-role"
                      // value={UserRole}
                      label="Lead"
                      // onChange={ChangeUserRole}
                      size="medium"
                      className="w-full"
                      displayEmpty
                      required
                    >
                      <MenuItem value="" disabled>
                        User Role
                      </MenuItem>

                      <MenuItem>lead</MenuItem>
                    </TextField>
                  </div> */}

                  <div className="col-span-6">
                    <TextField
                      type={"text"}
                      placeholder="Assign To"
                      // label="Offer Description"
                      className="w-full mb-3"
                      name="offerDescription"
                      style={{ marginBottom: "20px" }}
                      // variant="outlined"
                      size="lg"
                      value={taskData?.assignedTo}
                      required
                      onChange={(e) =>
                        setTaskData({
                          ...taskData,
                          assignedTo: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {modal_type === 1 && (
                <>
                  <div className="col-span-3">
                    <h1
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      } text-lg font-semibold mb-2`}
                    >
                      Type:
                    </h1>
                  </div>
                  <div className="col-span-8">
                    <div className="flex justify-between">
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Email"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Email")}
                        >
                          <p className="text-center text-white">Email</p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          // style={{
                          //   backgroundColor: "rgba(218, 31, 38, 0.7)",
                          // }}
                          className={`${
                            selectedOption === "Call"
                              ? "bg-[#da1f26]"
                              : // : "bg-gray-700"
                                "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Call")}
                        >
                          <p className="text-center text-white">Call</p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Text"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Text")}
                        >
                          <p className="text-center text-white">Text</p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Other"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Other")}
                        >
                          <p className="text-center text-white">Other</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3">
                    <h1
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      } text-lg font-semibold my-2`}
                    >
                      Date:
                    </h1>
                  </div>
                  <div className="col-span-8">
                    <div className="flex justify-between">
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Email"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Email")}
                        >
                          <p className="text-center text-white">Today</p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Call"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Call")}
                        >
                          <p className="text-center text-white">Tomorrow</p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Text"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Text")}
                        >
                          <p className="text-center text-white">2 Days Later</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-8">
                    <div className="flex justify-between">
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Email"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Email")}
                        >
                          <p className="text-center text-white">1 week later</p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Call"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Call")}
                        >
                          <p className="text-center text-white">
                            1 month Later
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1">
                        <div
                          className={`${
                            selectedOption === "Text"
                              ? "bg-[#da1f26]"
                              : "bg-gray-700"
                          } p-4 m-2 rounded-md w-full cursor-pointer`}
                          onClick={() => handleOptionClick("Text")}
                        >
                          <p className="text-center text-white"> Next Monday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="col-span-6 mt-3">
                {modal_type === 1 && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Calendar"
                      value={dateTime.from}
                      onChange={(newValue) => {
                        setDateTimeValues({
                          ...dateTimeValues,
                          from: new Date(newValue.$d).toISOString(),
                        });
                        setDateTime({ ...dateTime, from: dayjs(newValue) });
                      }}
                      // format="yyyy-MM-dd"
                      renderInput={(params) => (
                        <TextField
                          required
                          style={{ marginBottom: "10px" }}
                          fullWidth
                          {...params}
                          onKeyDown={(e) => e.preventDefault()}
                          readOnly={true}
                        />
                      )}
                      minDate={dayjs().startOf("day").toDate()}
                    />
                  </LocalizationProvider>
                )}
              </div>
              {modal_type === 0 && (
                <>
                  <div className="col-span-6">
                    <h1
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      } text-lg font-semibold `}
                    >
                      Start:
                    </h1>
                  </div>
                  {/* <div className="col-span-3 mt-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Starts"
                        value={dateTime.from}
                        onChange={(newValue) => {
                          setDateTimeValues({
                            ...dateTimeValues,
                            from: newValue,
                          });
                          setDateTime({
                            ...dateTime,
                            from:
                              formatNum(newValue?.$d?.getUTCFullYear()) +
                              "-" +
                              formatNum(newValue?.$d?.getUTCMonth() + 1) +
                              "-" +
                              formatNum(newValue?.$d?.getUTCDate() + 1),
                          });
                        }}
                        // format="yyyy-MM-dd"
                        renderInput={(params) => (
                          <TextField
                            required
                            style={{ marginBottom: "10px" }}
                            fullWidth
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                          />
                        )}
                        minDate={dayjs().startOf("day").toDate()}
                      />
                    </LocalizationProvider>
                  </div> */}
                  <div className="col-span-6 mt-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="From"
                        value={dateTime.from}
                        onChange={(newValue) => {
                          setDateTimeValues({
                            ...dateTimeValues,
                            from: new Date(newValue.$d).toISOString(),
                          });
                          setDateTime({ ...dateTime, from: dayjs(newValue) });
                        }}
                        // format="yyyy-MM-dd"
                        renderInput={(params) => (
                          <TextField
                            required
                            style={{ marginBottom: "10px" }}
                            fullWidth
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                          />
                        )}
                        minDate={dayjs().startOf("day").toDate()}
                      />
                    </LocalizationProvider>
                  </div>
                </>
              )}
              {modal_type === 0 && (
                <>
                  <div className="col-span-6">
                    <h1
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      } text-lg font-semibold`}
                    >
                      Ends:
                    </h1>
                  </div>
                  <div className="col-span-6 mt-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="To"
                        value={dateTime.to}
                        onChange={(newValue) => {
                          setDateTimeValues({
                            ...dateTimeValues,
                            to: new Date(newValue.$d).toISOString(),
                          });
                          setDateTime({ ...dateTime, to: dayjs(newValue) });
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            style={{ marginBottom: "10px" }}
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                            required
                          />
                        )}
                        minDate={dayjs().startOf("day").toDate()}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-span-3 mt-3">
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        // ampm={false}
                        format="hh:mm A"
                        value={timeValue?.to}
                        onChange={(newValue) => {
                          console.log("newvalue to : ", newValue);
                          setTime({
                            ...time,
                            to:
                              formatNum(newValue?.$d?.getHours()) +
                              ":" +
                              formatNum(newValue?.$d?.getMinutes()) +
                              ":" +
                              formatNum(newValue?.$d?.getSeconds()),
                          });
                          setTimeValue({ ...setTimeValue, to: newValue });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            label="Meeting Ends"
                            sx={{
                              "& .MuiFormLabel-root": {
                                background:
                                  currentMode === "dark" ? "#111827" : "",
                                color: currentMode === "dark" ? "white" : "",
                              },
                              "& input": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "& .MuiSvgIcon-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "&": {
                                borderRadius: "4px",
                                border:
                                  currentMode === "dark"
                                    ? "1px solid white"
                                    : "",
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
                                  {currentMode === "dark" ? (
                                    <MdAccessTime color={"#ffffff"} />
                                  ) : (
                                    <MdAccessTime color={"#000000"} />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider> */}
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        // ampm={false}
                        format="hh:mm A"
                        value={timeValue?.to}
                        onChange={(newValue) => {
                          console.log("newvalue to : ", newValue);
                          const formattedTime = moment(newValue)
                            .utc()
                            .format("HH:mm:ss");
                          setTime((prevTime) => ({
                            ...prevTime,
                            to: formattedTime,
                          }));
                          setTimeValue({ ...timeValue, to: newValue });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            label="Meeting Ends"
                            sx={{
                              "& .MuiFormLabel-root": {
                                background:
                                  currentMode === "dark" ? "#111827" : "",
                                color: currentMode === "dark" ? "white" : "",
                              },
                              "& input": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "& .MuiSvgIcon-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "&": {
                                borderRadius: "4px",
                                border:
                                  currentMode === "dark"
                                    ? "1px solid white"
                                    : "",
                              },
                              "&:focus": {
                                border: "",
                              },
                            }}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                            InputProps={{
                              endAdornment: (
                                <IconButton></IconButton>
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider> */}
                  </div>
                  <div className="col-span-6 ">
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="All Day"
                      />
                    </FormGroup>
                  </div>

                  {/* <div className="col-span-6">
                    <TextField
                      select
                      id="user-role"
                      // value={UserRole}
                      label="Owner"
                      // onChange={ChangeUserRole}
                      size="medium"
                      className="w-full"
                      displayEmpty
                      required
                    >
                      <MenuItem value="" disabled>
                        User Role
                      </MenuItem>

                      <MenuItem>lead</MenuItem>
                    </TextField>
                  </div> */}
                  {/* 
                  <div className="col-span-6">
                    <TextField
                      type={"text"}
                      placeholder="Participants"
                      // label="Offer Description"
                      className="w-full mb-3 mt-3"
                      name="offerDescription"
                      style={{ marginBottom: "20px", marginTop: "20px" }}
                      // variant="outlined"
                      size="lg"
                      // value={offerData.offerDescription}
                      required
                      // onChange={(e) =>
                      //   setOfferData({
                      //     ...offerData,
                      //     offerDescription: e.target.value,
                      //   })
                      // }
                    />
                  </div> */}
                </>
              )}
            </div>

            {modal_type === 0 ? (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ padding: "10px 0", background: "#da1f26" }}
                onClick={handleSubmit}
              >
                {btnloading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <span>Create Appointment</span>
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{ padding: "10px 0", background: "#da1f26" }}
                onClick={createTask}
              >
                {btnloading ? (
                  <CircularProgress size={18} sx={{ color: "white" }} />
                ) : (
                  <span>Create Task</span>
                )}
              </Button>
            )}
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateEvent;
