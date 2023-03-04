import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

const meetingDataa = {
  "meeting": [
    {
      "meetingDetails": {
        "mId":1,
        "leadId":28,
        "meetingBy":"Agent 2",
        "meetingDate":"2023-03-03",
        "meetingTime":"15:00",
        "meetingLocation":"API World Tower, 2704, Sheikh Zayed Road",
        "coordinates": [25.364647, 55.674632]
      },
      "leadDetails": {
        "lid":28,
        "leadName":"test lead name",
        "project":"Riviera",
        "enquiryType":"2 Bedrooms",
        "leadType":"Apartment",
        "leadFor":"Investment"
      },
    },
    {
      "meetingDetails": {
        "mId":2,
        "leadId":222,
        "meetingBy":"Agent 1",
        "meetingDate":"2023-03-03",
        "meetingTime":"15:00",
        "meetingLocation":"API World Tower, 2704, Sheikh Zayed Road",
        "coordinates": [24.999, 55.674632]
      },
      "leadDetails": {
        "lid":222,
        "leadName":"test lead name 222",
        "project":"Riviera",
        "enquiryType":"2 Bedrooms",
        "leadType":"Apartment",
        "leadFor":"Investment"
      },
    },
  ]
};

const meetingData = [
  {
    "id": 737,
    "userName": "Zainab Ezzaldien",
    "userId": 122,
    "meetingDate": "2024-01-01",
    "meetingTime": "",
    "meetingStatus": "Pending",
    "mLat": null,
    "mLong": null,
    "leadName": "وليد بشار ",
    "leadContact": "050****",
    "project": "Crescent",
    "enquiryType": "1 Bedroom",
    "leadStatus": "New",
    "leadType": "Apartment",
    "leadFor": "Investment"
  },
  {
      "id": 339,
      "userName": "Hossam Hassan",
      "userId": 133,
      "meetingDate": "2023-12-12",
      "meetingTime": "",
      "meetingStatus": "Pending",
      "mLat": null,
      "mLong": null,
      "leadName": "مامون سلامه",
      "leadContact": "050****",
      "project": "Riviera",
      "enquiryType": "2 Bedrooms",
      "leadStatus": "New",
      "leadType": "Apartment",
      "leadFor": ""
  },
  {
      "id": 593,
      "userName": "Hossam Hassan",
      "userId": 133,
      "meetingDate": "2023-12-04",
      "meetingTime": "",
      "meetingStatus": "Pending",
      "mLat": null,
      "mLong": null,
      "leadName": "Najwa",
      "leadContact": "050****",
      "project": "Crescent",
      "enquiryType": "2 Bedrooms",
      "leadStatus": "New",
      "leadType": "Apartment",
      "leadFor": "End-user"
  },
  {
      "id": 417,
      "userName": "Hassan Lodhi",
      "userId": 177,
      "meetingDate": "2023-11-01",
      "meetingTime": "13:30",
      "meetingStatus": "Attended",
      "mLat": null,
      "mLong": null,
      "leadName": "Yashar alami",
      "leadContact": "050****",
      "project": "Beach Oasis",
      "enquiryType": "1 Bedroom",
      "leadStatus": "New",
      "leadType": "Apartment",
      "leadFor": "End-user"
  },
];

const userData = {
  "users": [
    {
      "userId":120,
      "userName":"Hala Hikal",
      "before_location":[25.22527310000002, 55.280889615218406],
      "beforeTime":"2023-03-04 15:00",
      "last_location":[25.22527310000002, 55.280889615218406],
      "lastTime":"15:30",
    },
    {
      "userId":124,
      "userName":"Ameer Ali",
      "before_location":[25.333527310000002, 55.280889615218406],
      "beforeTime":"2023-03-04 15:00",
      "last_location":[25.33327310000002, 55.280889615218406],
      "lastTime":"15:30",
    },
  ]
};

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: true,
}

export default function MapContainer() {
  const { isLoaded, loadError } = useJsApiLoader({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: "AIzaSyBtYwXsFlL25Jct9nYMl8ytW0KiZ6q19sY",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selectedMeeting, setSelectedMeeting] = React.useState(null);
  const [selectedUser, setSelectedUser] = React.useState(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading your map...</div>;

  return (
    <GoogleMap
      zoom={10}
      center={{lat: 25.22527310000002, lng: 55.280889615218406}}
      mapContainerStyle={mapContainerStyle}
      options={options}
    >
      {meetingData.map(meeting => (
        <>
          <MarkerF
            key={meeting.id} 
            position={{ lat: parseFloat(meeting.mLat), lng: parseFloat(meeting.mLong)}}
            icon={{
              url: "/meetingpin.svg",
              scaledSize: new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelectedMeeting(meeting);
            }} 
          />

          {selectedMeeting ? (
            <InfoWindow             
              position={{ lat: selectedMeeting.meetingDetails.coordinates[0], lng: selectedMeeting.meetingDetails.coordinates[1]}}
              onCloseClick={
                () => {setSelectedMeeting(null);
              }}
            >
              <div>
                <h1>{selectedMeeting.leadDetails.leadName}</h1>
                <h1 className="font-semibold">{selectedMeeting.leadDetails.project}&nbsp;{selectedMeeting.leadDetails.enquiryType}&nbsp;{selectedMeeting.leadDetails.leadType}</h1>
                <h1>{selectedMeeting.meetingDetails.meetingTime}&nbsp;{selectedMeeting.meetingDetails.meetingDate}</h1>
                <h1 className="font-semibold">{selectedMeeting.meetingDetails.meetingBy}</h1>
              </div>
            </InfoWindow>
          ) : null}
          
          
        </>
      ))}

      {userData.users.map(user => (
        <>
          <MarkerF
            key={user.userId} 
            position={{ lat: user.last_location[0], lng: user.last_location[1]}}
            icon={{
              url: "/userpin.svg",
              scaledSize: new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelectedUser(user);
            }} 
          />

          {selectedUser ? (
            <InfoWindow             
              position={{ lat: selectedUser.last_location[0], lng: selectedUser.last_location[1]}}
              onCloseClick={
                () => {setSelectedUser(null);
              }}
            >
              <div>
                <h1 className="font-semibold">{selectedUser.userName}</h1>
                <h1>Last updated: {selectedUser.lastTime}</h1>
              </div>
            </InfoWindow>
          ) : null}
          
          
        </>
      ))}

    </GoogleMap>
  );
}

