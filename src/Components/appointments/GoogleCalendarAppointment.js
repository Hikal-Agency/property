import React, { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AiOutlineGoogle } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import CreateEvent from "./CreateEvent";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { Box } from "@mui/system";
import { BsChevronCompactDown } from "react-icons/bs";
import Menu from "@mui/material/Menu";
import { useNavigate } from "react-router";
import moment from "moment";

const GoogleCalendarAppointment = ({ meetingsCount, setMeetingCount }) => {
  const { currentMode, formatNum, darkModeColors, setSession, session } =
    useStateContext();
  const gapi = window.gapi;
  const google = window.google;
  const navigate = useNavigate();

  const CLIENT_ID = process.env.REACT_APP_GC_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_GC_API;
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [calendarsList, setCalendars] = useState([]);
  const [selectedCalender, setSelectedCalendar] = useState();
  const [checked, setChecked] = useState(false);

  console.log("checked: ", checked);

  const [createEventModal, setCreateEventModal] = useState({
    isOpen: false,
    action: null,
  });

  const tokenClient = useRef({});

  useEffect(() => {
    // Check if the access token is present
    const accessToken = localStorage.getItem("access_token");
    const expiresIn = localStorage.getItem("expires_in");

    if (!accessToken) {
      // If access token is missing, navigate to "/integrations"
      navigate("/integrations");
    } else {
      const expiryTime = new Date().getTime() + expiresIn * 1000;

      // Check if the access token has expired
      if (new Date().getTime() > expiryTime) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        // If token has expired, navigate to "/integrations"
        navigate("/integrations");
      } else {
        // Token is valid, proceed with initialization
        gapiLoaded();
        gisLoaded();
      }
    }
  }, []);

  useEffect(() => {
    if (gapiInited && gisInited) {
      setLoading(false);
    }
  }, [gapiInited, gisInited]);

  useEffect(() => {
    let calendarId = selectedCalender;
    if (!checked) {
      calendarId = "primary";
    }
    listUpcomingEvents(calendarId);
  }, [selectedCalender]);

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);

    if (session.accessToken && session.expiresIn) {
      gapi.client.setToken({
        access_token: session.accessToken,
        expires_in: session.expiresIn,
      });
      await listUpcomingEvents();
    }
  }

  function gisLoaded() {
    tokenClient.current = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });

    setGisInited(true);
  }

  //Sign out the user upon button click.
  function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      setSession({
        accessToken: "",
        expiresIn: "",
      });

      setMessageText("");

      navigate("/integrations");
    }
  }

  async function listUpcomingEvents(selectedCalenderId) {
    let eventsResponse;
    let calendarsResponse;
    const currentDate = moment();
    const endOfMonth = currentDate.clone().endOf("month");
    console.log("one month:: ", endOfMonth);

    const requestEvents = {
      calendarId: selectedCalenderId || "primary",
      // timeMin: new Date().toISOString(),
      timeMax: endOfMonth.toISOString(),
      showDeleted: false,
      singleEvents: true,
      orderBy: "startTime",
    };
    const requestCalendars = {
      minAccessRole: "owner",
      showHidden: true,
    };

    try {
      if (selectedCalenderId) {
        eventsResponse = await gapi.client.calendar.events.list(requestEvents);

        console.log("single calendar event: ", eventsResponse);

        const singleEvent = eventsResponse.result.items;
        setEvents(singleEvent);
        setDataLoading(false);
        return;
      }
      setDataLoading(true);

      [eventsResponse, calendarsResponse] = await Promise.all([
        gapi.client.calendar.events.list(requestEvents),
        gapi.client.calendar.calendarList.list(requestCalendars),
      ]);

      setDataLoading(false);
    } catch (err) {
      setDataLoading(false);

      console.log("events err: ", err);
      setMessageText(err.message);
      if (err.status === 401) {
        toast.error("Session Expired! You need to Sign in again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/integrations");
      }
      return;
    }

    const events = eventsResponse.result.items;
    const calendars = calendarsResponse.result.items;
    setCalendars(calendars);
    console.log("events log: ", events);
    console.log("events log: ", calendars);
    if (!events || events.length === 0) {
      setMessageText("No events found.");
      return;
    }

    // get counts of pending and cmopleted meetings
    const completedMeetings = [];
    const pendingMeetings = [];

    events.forEach((event) => {
      const eventStartTime = moment(event.start.dateTime);
      const eventEndTime = moment(event.end.dateTime);
      const now = moment();

      if (eventEndTime.isBefore(now)) {
        completedMeetings.push(event);
      } else {
        pendingMeetings.push(event);
      }
    });

    const completedMeetingsCount = completedMeetings.length;
    const pendingMeetingsCount = pendingMeetings.length;

    console.log(`Completed Meetings: ${completedMeetingsCount}`);
    console.log(`Pending Meetings: ${pendingMeetingsCount}`);

    setMeetingCount({
      ...meetingsCount,
      pendingMeeting: pendingMeetingsCount,
      completedMeetings: completedMeetingsCount,
    });
    // Flatten to string to display
    setMessageText("");
    const fullCalendarEvents = pendingMeetings?.map((event) => ({
      title: event.summary,
      start: new Date(event.start.dateTime).toISOString(),
      end: new Date(event.end.dateTime).toISOString(),
      description: event.description,
      url: event.htmlLink,
    }));
    setEvents(fullCalendarEvents);
  }

  function addManualEvent(btnId) {
    setCreateEventModal({ isOpen: true, action: btnId });
  }

  //  DROPDOWN OPEN CLOSE
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem) => {
    // Handle the menu item click here, for example, redirect to different pages or perform actions.
    console.log(`Clicked on ${menuItem}`);
    handleClose();
  };

  //  DROPDOWN OPEN CLOSE

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
        <>
          <div className="flex justify-between">
            <div className="mt-3">
              {" "}
              <h2
                className={`font-bold text-lg ${
                  currentMode === "dark" ? "text-white" : " text-dark"
                }`}
              >
                HIKAL'S CALENDAR
              </h2>
            </div>
            <div>
              <Button
                color="error"
                sx={{ marginRight: "7px" }}
                variant="contained"
                id="signout_button"
                onClick={handleSignoutClick}
              >
                <FaSignOutAlt size={18} />{" "}
                <span style={{ paddingLeft: "8px" }}>Sign Out</span>
              </Button>

              <Button
                color="success"
                variant="contained"
                sx={{ marginRight: "6px" }}
                id="add_manual_event"
                onClick={handleClick}
              >
                <IoMdAdd size={18} style={{ color: "white" }} />{" "}
                <span style={{ paddingLeft: "8px" }}>Create</span>
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={() => addManualEvent(0)}>
                  Appointments
                </MenuItem>
                <MenuItem onClick={() => addManualEvent(1)}>Tasks</MenuItem>
              </Menu>
            </div>
          </div>

          <pre className="mt-3" id="content" style={{ whiteSpace: "pre-wrap" }}>
            {messageText}
          </pre>

          <div
            className="grid grid-cols-1 md:grid-cols-[1fr,3fr] lg:grid-cols-[1fr,3fr] gap-x-3 pb-3"
            style={{}}
          >
            <div
              className={`${
                currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-200"
              } p-4 shadow-md rounded-md `}
            >
              <div
                className="side_calendar justify-center mb-3"
                style={{ color: "#ffffff" }}
              >
                <FullCalendar
                  headerToolbar={{
                    start: "title",
                    center: "",
                    // end: "today dayGridMonth,dayGridWeek,dayGridDay prev,next",
                  }}
                  events={events}
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                  dayRender={(date, cell) => {
                    if (date.getDate() === 2) {
                      cell.style.backgroundColor = "red";
                    }
                  }}
                />
              </div>

              {/* <div className="justify-center mb-3 mt-10">
                <p className={`font-bold text-md mb-3 text-white`}>
                  Your Meeting Link
                </p>
                <Box
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "white !important",
                    },

                    // TEXT FIELDS LABEL COLOR
                    "& .MuiFormLabel-root, & .MuiInputLabel-root, & .MuiInputLabel-formControl":
                      {
                        color: "white !important",
                      },

                    // border color of text fields and select fields
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "white !important",
                    },
                  }}
                >
                  <TextField
                    id="notes"
                    type={"text"}
                    label="Link"
                    className="w-full mb-5"
                    style={{ marginBottom: "20px" }}
                    variant="outlined"
                    size="small"
                    // value={LeadNotes}
                    // onChange={(e) => setLeadNotes(e.target.value)}
                  />
                </Box>
              </div> */}

              <div className="justify-center mb-3">
                {/* <Accordion className="mb-4" defaultExpanded={true}>
                  <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                    <Typography>Integrated Calendars</Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      ubaid@gmail.com
                      <hr className="mb-2" />
                    </Typography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      Birthdays
                      <hr className="mb-2" />
                    </Typography>
                    <Typography sx={{ wordWrap: "break-word" }}>
                      Meetings
                      <hr className="mb-2" />
                    </Typography>
                  </AccordionDetails>
                </Accordion> */}
                <Accordion className="mb-4" defaultExpanded={true}>
                  <AccordionSummary expandIcon={<BsChevronCompactDown />}>
                    <Typography>Integrated Calendars</Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    {!dataLoading ? (
                      calendarsList?.length > 0 ? (
                        calendarsList?.map((calender) => (
                          <>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  value={calender?.id}
                                  onChange={(e) => {
                                    console.log(
                                      "selected calendar: ",
                                      e.target.value
                                    );
                                    if (e.target.checked) {
                                      setChecked(true);
                                      setSelectedCalendar(e.target.value);
                                    } else {
                                      setChecked(false);
                                      setSelectedCalendar("primary");
                                    }
                                  }}
                                />
                              }
                              label={calender?.summary}
                            />
                            <hr className="mb-2" />
                          </>
                        ))
                      ) : (
                        "No Calendars Found."
                      )
                    ) : (
                      <div className="flex justify-center">
                        <CircularProgress />
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
            {/* </div> */}
            {/* </div> */}
            {/* </div> */}
            <div
              className={` ${
                currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-200"
              }   p-5`}
            >
              <div
                className={`calendar-container ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                <FullCalendar
                  headerToolbar={{
                    start: "title",
                    center: "",
                    end: "today dayGridMonth,dayGridWeek,dayGridDay prev,next",
                  }}
                  events={events}
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  initialView="dayGridMonth"
                />
              </div>
            </div>
          </div>
        </>
        {/* )} */}

        {createEventModal.isOpen && (
          <CreateEvent
            createEventModal={createEventModal}
            gapi={gapi}
            listUpcomingEvents={listUpcomingEvents}
            setCreateEventModal={setCreateEventModal}
          />
        )}
      </div>
    );
  }
};

export default GoogleCalendarAppointment;
