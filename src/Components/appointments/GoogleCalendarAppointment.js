import React, { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import { Button } from "@mui/material";

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
  const [data, setData] = useState('');

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
        expiresIn: ""
      });
      setData("");
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
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await gapi.client.calendar.events.list(request);
    } catch (err) {
      setData(err.message);
      return;
    }

    const events = response.result.items;
    if (!events || events.length === 0) {
      setData("No events found.");
      return;
    }
    // Flatten to string to display
    const output = events.reduce(
      (str, event) =>
        `${str}${event.summary} (${
          event.start.dateTime || event.start.date
        })\n`,
      "Events:\n"
    );
    setData(output);
  }

  function addManualEvent() {
    var event = {
      kind: "calendar#event",
      summary: "Hikal Event",
      location: "I8 Islamabad",
      description: "Pizza Party",
      start: {
        dateTime: "2023-06-10T01:05:00.000Z",
        timeZone: "UTC",
      },
      end: {
        dateTime: "2023-06-30T01:35:00.000Z",
        timeZone: "UTC",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
      attendees: [
        { email: "mjunaid.swe@gmail.com.com", responseStatus: "needsAction" },
      ],
      reminders: {
        useDefault: true,
      },
      guestsCanSeeOtherGuests: true,
    };

    var request = gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
      sendUpdates: "all",
    });
    request.execute(
      (event) => {
        console.log(event);
        listUpcomingEvents();
        window.open(event.htmlLink);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div>
      {!(session.accessToken && session.expiresIn) &&
        <Button
          color="success"
          sx={{ marginRight: "4px" }}
          variant="contained"
          id="authorize_button"
          onClick={handleAuthClick}
        >
          Authorize
        </Button>
      }
        {(session.accessToken && session.expiresIn) &&
        <Button
          color="error"
          sx={{ marginRight: "4px" }}
          variant="contained"
          id="signout_button"
          onClick={handleSignoutClick}
        >
          Sign Out
        </Button>
        }

        {(session.accessToken && session.expiresIn) &&
        <Button
          color="primary"
          variant="contained"
          sx={{ marginRight: "4px" }}
          id="add_manual_event"
          onClick={addManualEvent}
        >
          Add Event
        </Button>
        }
        <pre
          className="mt-3"
          id="content"
          style={{ whiteSpace: "pre-wrap" }}
        >{data}</pre>
      </div>
    );
  }
};

export default GoogleCalendarAppointment;
