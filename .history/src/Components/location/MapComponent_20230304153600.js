import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

const MapContainer = () => {
  useEffect(() => {
    console.log("meetings and locations are");
    console.log();
  }, []);

  const meetingData = [
    {
      "id": 737,
      "userName": "Zainab Ezzaldien",
      "userId": 122,
      "meetingDate": "2024-01-01",
      "meetingTime": "",
      "meetingStatus": "Attended",
      "mLat": "25.364647",
      "mLong": "55.674632",
      "leadName": "وليد بشار ",
      "leadContact": "050****",
      "project": "Crescent",
      "enquiryType": "1 Bedroom",
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
      "mLat": "25.2333647",
      "mLong": "55.674632",
      "leadName": "مامون سلامه",
      "leadContact": "050****",
      "project": "Riviera",
      "enquiryType": "2 Bedrooms",
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
      "mLat": "25.44447",
      "mLong": "55.5555",
      "leadName": "Najwa",
      "leadContact": "050****",
      "project": "Crescent",
      "enquiryType": "2 Bedrooms",
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
      "mLat": "25.11111",
      "mLong": "55.22222",
      "leadName": "Yashar alami",
      "leadContact": "050****",
      "project": "Beach Oasis",
      "enquiryType": "1 Bedroom",
      "leadType": "Apartment",
      "leadFor": "End-user"
    },
  ];

  const userData = {
    "users": [
      {
        "userId":120,
        "userName":"Hala Hikal",
        "before_location_lat":"25.22527310000002",
        "before_location_long": "55.280889615218406",
        "beforeTime":"2023-03-04 15:00",
        "last_location_lat":"25.22527310000002", 
        "last_location_long":"55.280889615218406",
        "lastTime":"15:30",
      },
      {
        "userId":124,
        "userName":"Ameer Ali",
        "before_location_lat":"25.11310000002",
        "before_location_long":"55.280889615218406",
        "beforeTime":"2023-03-04 15:00",
        "last_location_lat":"25.11111110002",
        "last_location_long":"55.280889615218406",
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
            {meeting.meetingStatus === "Attended" ? (
              <MarkerF
              key={meeting.id} 
              position={{ lat: parseFloat(meeting.mLat), lng: parseFloat(meeting.mLong)}}
              icon={{
                url: "/meetingpinattended.svg",
                scaledSize: new window.google.maps.Size(40,40),
              }}
              onClick={() => {
                setSelectedMeeting(meeting);
              }} 
            />
            ) : (
              <MarkerF
              key={meeting.id} 
              position={{ lat: parseFloat(meeting.mLat), lng: parseFloat(meeting.mLong)}}
              icon={{
                url: "/meetingpin.svg",
                scaledSize: new window.google.maps.Size(40,40),
              }}
              onClick={() => {
                setSelectedMeeting(meeting);
              }} 
            />
            )}

            {selectedMeeting ? (
              <InfoWindow             
                position={{ lat: parseFloat(selectedMeeting.mLat), lng: parseFloat(selectedMeeting.mLong)}}
                onCloseClick={
                  () => {setSelectedMeeting(null);
                }}
              >
                <div>
                  <h1>{selectedMeeting.leadName}</h1>
                  <h1 className="font-semibold">{selectedMeeting.project}&nbsp;{selectedMeeting.enquiryType}&nbsp;{selectedMeeting.leadType}</h1>
                  <h1>{selectedMeeting.meetingTime}&nbsp;{selectedMeeting.meetingDate}</h1>
                  <h1 className="font-semibold">{selectedMeeting.userName}</h1>
                </div>
              </InfoWindow>
            ) : null}
            
            
          </>
        ))}

        {userData.users.map(user => (
          <>
            <MarkerF
              key={user.userId} 
              position={{ lat: parseFloat(user.last_location_lat), lng: parseFloat(user.last_location_long)}}
              icon={{
                url: "/userpin.svg",
                scaledSize: new window.google.maps.Size(40,40),
              }}
              onClick={() => {
                setSelectedUser(user);
              }} 
            />

            {selectedUser ? (
              <InfoWindow             
                position={{ lat: parseFloat(selectedUser.last_location_lat), lng: parseFloat(selectedUser.last_location_long)}}
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
}

export default MapContainer();



