import React, { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import { Button, Typography } from "@mui/material";
import { AiOutlineGoogle } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import CreateEvent from "./CreateEvent";

const GoogleCalendarAppointment = () => {
  const gapi = window.gapi;
  const google = window.google;

  const CLIENT_ID =
    "108967934345-qmc2aeu201lkd11okq1u7ce02p0453p0.apps.googleusercontent.com";
  const API_KEY = "AIzaSyAw3D7ewU2csP8e6B5Fc5EuBnkxAG_j0BI";
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [createEventModal, setCreateEventModal] = useState({
    isOpen: false,
  });

  const [session, setSession] = useState({
    expiresIn: localStorage.getItem("expires_in"),
    accessToken: localStorage.getItem("access_token"),
  });

  const tokenClient = useRef({});

  useEffect(() => {
    //const expiryTime = new Date().getTime() + expiresIn * 1000;
    gapiLoaded();
    gisLoaded();
  }, []);

  useEffect(() => {
    if (gapiInited && gisInited) {
      setLoading(false);
    }
  }, [gapiInited, gisInited]);

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

  //Enables user interaction after all libraries are loaded.

  function handleAuthClick() {
    tokenClient.current.callback = async (resp) => {
      if (resp.error) {
        throw resp;
      }
      await listUpcomingEvents();
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      setSession({
        accessToken: access_token,
        expiresIn: expires_in,
      });
    };

    if (!(session.accessToken && session.expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.current.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.current.requestAccessToken({ prompt: "" });
    }
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
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      setMessageText(err.message);
      return;
    }

    const events = response.result.items;
    console.log(events);
    if (!events || events.length === 0) {
      setMessageText("No events found.");
      return;
    }
    // Flatten to string to display
    setMessageText("");
    const fullCalendarEvents = events.map((event) => ({
      title: event.summary,
      start: new Date(event.start.dateTime).toISOString(),
      end: new Date(event.end.dateTime).toISOString(),
      description: event.description,
      url: event.htmlLink,
    }));
    setEvents(fullCalendarEvents);
  }

  function addManualEvent() {
    setCreateEventModal({ isOpen: true });
  }

  const isLoggedIn = session.accessToken && session.expiresIn;
  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
        {!isLoggedIn && (
          <div className="min-h-[50vh] flex flex-col justify-center items-center">
            <Typography variant="h5">
              Create and Manage Appointments on the Go!
            </Typography>
            <Button
              color="primary"
              sx={{ marginRight: "4px", marginTop: "12px" }}
              variant="contained"
              id="authorize_button"
              onClick={handleAuthClick}
            >
              <AiOutlineGoogle size={18} />{" "}
              <span style={{ paddingLeft: "8px" }}>Sign In With Google</span>
            </Button>
          </div>
        )}
        {isLoggedIn && (
          <>
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
              onClick={addManualEvent}
            >
              <IoMdAdd size={18} style={{ color: "white" }} />{" "}
              <span style={{ paddingLeft: "8px" }}>Add Event</span>
            </Button>

            <pre
              className="mt-3"
              id="content"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {messageText}
            </pre>

            <div className="my-12">
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
          </>
        )}

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
