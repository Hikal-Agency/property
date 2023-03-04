import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

const meetingData = {
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

const userData = {
  "users": [
    {
      "userId":120,
      "userName":"Hala Hikal",
      "before_location":[25.22527310000002, 55.280889615218406],
      "beforeTime":"2023-03-04 15:00",
      "last_location":[25.22527310000002, 55.280889615218406],
      "lastTime":"15:30",
      "meetingTime":"2023:03:04 15:00"
    },
    {
      "userId":124,
      "userName":"Ameer Ali",
      "before_location":[25.333527310000002, 55.280889615218406],
      "beforeTime":"2023-03-04 15:00",
      "last_location":[25.33327310000002, 55.280889615218406],
      "lastTime":"15:30",
      "meetingTime":"2023:03:04 15:00"
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
  const [selected, setSelected] = React.useState(null);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading your map...</div>;

  return (
    <GoogleMap
      zoom={10}
      center={{lat: 25.22527310000002, lng: 55.280889615218406}}
      mapContainerStyle={mapContainerStyle}
      options={options}
    >
      {meetingData.meeting.map(meeting => (
        <>
          <MarkerF
            key={meeting.meetingDetails.mId} 
            position={{ lat: meeting.meetingDetails.coordinates[0], lng: meeting.meetingDetails.coordinates[1]}}
            icon={{
              url: "/meetingpin.svg",
              scaledSize: new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelected(meeting);
            }} 
          />

          {selected ? (
            <InfoWindow             
              position={{ lat: selected.meetingDetails.coordinates[0], lng: selected.meetingDetails.coordinates[1]}}
              onCloseClick={
                () => {setSelected(null);
              }}
            >
              <div>
                <h1>{selected.leadDetails.leadName}</h1>
                <h1 className="font-semibold">{selected.leadDetails.project}&nbsp;{selected.leadDetails.enquiryType}&nbsp;{selected.leadDetails.leadType}</h1>
                <h1>{selected.meetingDetails.meetingTime}&nbsp;{selected.meetingDetails.meetingDate}</h1>
                <h1 className="font-semibold">{selected.meetingDetails.meetingBy}</h1>
              </div>
            </InfoWindow>
          ) : null}
          
          
        </>
      ))}

      {userData.map(user => (
        <>
          <MarkerF
            key={user.userId} 
            position={{ lat: user.last_location[0], lng: user.last_location[1]}}
            icon={{
              url: "/meetingpin.svg",
              scaledSize: new window.google.maps.Size(30,30),
              origin: new window.google.maps.Point(0,0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelected(meeting);
            }} 
          />

          {selected ? (
            <InfoWindow             
              position={{ lat: selected.meetingDetails.coordinates[0], lng: selected.meetingDetails.coordinates[1]}}
              onCloseClick={
                () => {setSelected(null);
              }}
            >
              <div>
                <h1>{selected.leadDetails.leadName}</h1>
                <h1 className="font-semibold">{selected.leadDetails.project}&nbsp;{selected.leadDetails.enquiryType}&nbsp;{selected.leadDetails.leadType}</h1>
                <h1>{selected.meetingDetails.meetingTime}&nbsp;{selected.meetingDetails.meetingDate}</h1>
                <h1 className="font-semibold">{selected.meetingDetails.meetingBy}</h1>
              </div>
            </InfoWindow>
          ) : null}
          
          
        </>
      ))}

    </GoogleMap>
  );
}

