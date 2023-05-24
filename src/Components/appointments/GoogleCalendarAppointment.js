import React from 'react';
import { GoogleAuth } from 'googleapis';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
class GoogleCalendarAppointment extends React.Component {
  componentDidMount() {
    // Load the Google API client
    window.gapi.load('client', this.initClient);
  }
  initClient = () => {
    window.gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    }).then(() => {
      // Listen for sign-in state changes
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
    });
  };
  updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      // Create the appointment
      this.createAppointment();
    } else {
      // Sign in with Google
      window.gapi.auth2.getAuthInstance().signIn();
    }
  };
  createAppointment = () => {
    const event = {
      summary: 'Appointment Summary',
      location: 'Appointment Location',
      description: 'Appointment Description',
      start: {
        dateTime: '2023-05-22T10:00:00',
        timeZone: 'YOUR_TIMEZONE',
      },
      end: {
        dateTime: '2023-05-22T11:00:00',
        timeZone: 'YOUR_TIMEZONE',
      },
    };
    window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    }).then(() => {
      console.log('Appointment created successfully!');
    }).catch((error) => {
      console.error('Error creating appointment:', error);
    });
  };
  render() {
    return (
      <div>
        <h1>Google Calendar Appointment</h1>
      </div>
    );
  }
}
export default GoogleCalendarAppointment;