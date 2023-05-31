import { useState } from "react";
import {
  Modal,
  Button,
  Backdrop,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

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
  const { currentMode } = useStateContext();
  const [values, setValues] = useState({
    appointmentTitle: "",
    appointmentDescription: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      var event = {
        kind: "calendar#event",
        summary: "Hikal Event",
        location: "I8 Islamabad",
        description: "Pizza Party",
        start: {
          dateTime: "2023-06-10T01:05:00.000Z",
        },
        end: {
          dateTime: "2023-06-30T01:35:00.000Z",
        },
        attendees: [
          { email: "mjunaid.swe@gmail.com.com", responseStatus: "needsAction" },
        ],
        reminders: {
          useDefault: true,
        },
        guestsCanSeeOtherGuests: true,
      };

      console.log({
        ...values, ...dateTimeValues
      })

      // var request = gapi.client.calendar.events.insert({
      //   calendarId: "primary",
      //   resource: event,
      //   sendUpdates: "all",
      // });
      // request.execute(
      //   (event) => {
      //     console.log(event);
      //     listUpcomingEvents();
      //     window.open(event.htmlLink);
      //   },
      //   (error) => {
      //     console.error(error);
      //   }
      // );
      setbtnloading(true);
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

  return (
    <>
      <ToastContainer />
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
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
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
          <h1>
            <strong>Create an Event</strong>
          </h1>
          <form onSubmit={handleSubmit} className="mt-3">
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
                setValues({ ...values, appointmentTitle: e.target.value })
              }
            />

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
                setValues({ ...values, appointmentDescription: e.target.value })
              }
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="From"
                value={dateTime.from}
                onChange={(newValue) => {
                  setDateTimeValues({
                    ...dateTimeValues,
                    from: new Date(newValue.$d),
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
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="To"
                value={dateTime.to}
                onChange={(newValue) => {
                  setDateTimeValues({
                    ...dateTimeValues,
                    to: new Date(newValue.$d),
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

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ padding: "10px 0" }}
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default CreateEvent;
