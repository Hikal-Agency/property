import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

const meetingData = {
  "meeting": [
    {
      "meetingDetails": {
        "mId":1,
        "leadId":28,
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
        "meetingDate":"2023-03-03",
        "meetingTime":"15:00",
        "meetingLocation":"API World Tower, 2704, Sheikh Zayed Road",
        "coordinates": [25.364647, 55.674632]
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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading your map...</div>;

  return (
    <GoogleMap
      zoom={12}
      center={{lat: 25.2255834, lng: 55.2843141}}
      mapContainerStyle={mapContainerStyle}
      options={options}
    >
      {/* {meetingData.map((marker, index) => ( 
        <MarkerF 
          key={index} 
          position={{ lat: marker.lat, lng: marker.lng}} />
      ))} */}
      {/* {markers.map(marker)}
      <MarkerF key={pin.mId} position={{lat: 25.0009, lng: 55.2345}} /> */}

      {meetingData.meeting.map(meeting => (
        <>
          <MarkerF
            key={meeting.meetingDetails.mId} 
            position={{ lat: meeting.meetingDetails.coordinates[0], lng: meeting.meetingDetails.coordinates[1]}}
            // onClick={() => {
            //   setSelectedPin();
            // }} 
            // icon={{
            //   url: "../../../public/favicon.png",
            //   scaledSize: new window.google.maps.Size(25, 25)
            // }}
          />
          <InfoWindow
            position={{ lat: meeting.meetingDetails.coordinates[0], lng: meeting.meetingDetails.coordinates[1]}}
          >
            <p>My Info</p>
          </InfoWindow>
        </>
      ))}

    </GoogleMap>
  );
}

function mmm() {
  const MeetingIcon = <ImLocation />;

  
}

