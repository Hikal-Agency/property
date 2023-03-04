import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow, Marker } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

const libraries = ["places"];

export default function MapContainer() {
  const { isLoaded, loadError } = useLoadScript({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: "AIzaSyBtYwXsFlL25Jct9nYMl8ytW0KiZ6q19sY",
    libraries,
  });

  if (!isLoaded)
  return <div>Loading your map...</div>;

  return <Map />;
}

function Map() {
  const MeetingIcon = <ImLocation />;

  const meetingData = {
    "type": "MeetingLocationCollection",
    "crs": {
      "type": "name",
      "properties": {
          "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
      }
    },
    "features": [
      {
        "type": "Meetings",
        "properties": {
            "mId":1,
            "leadId":28,
            "meetingDate":"2023-03-03",
            "meetingTime":"15:00"

        },
        "geometrics": {
            "type": "Point",
            "coordinates": [25.364647, 55.674632]
        }
      },
      {
        "type": "Meetings",
        "properties": {
            "mId":2,
            "leadId":222,
            "meetingDate":"2023-03-03",
            "meetingTime":"15:00"

        },
        "geometrics": {
            "type": "Point",
            "coordinates": [20.364647, 50.674632]
        }
      }
    ]
  };

  // return (
  //   <GoogleMap
  //     defaultZoom={14}
  //     defaultCenter={{ lat: 25.2255834, lng: 55.2843141}}
  //   >

  //     {meetingData.features.map(meeting => (
  //       <MarkerF
  //         key={meeting.properties.mId} 
  //         position={{ lat: meeting.geometrics.coordinates[0], lng: meeting.geometrics.coordinates[1]}}
  //         onClick={() => {
  //           setSelectedPin();
  //         }} 
  //         icon={{
  //           // MeetingIcon,
  //           url: "../../../public/favicon.png",
  //           scaledSize: new window.google.maps.Size(25, 25)
  //         }}
  //       />
  //     ))}

  //     {selectedPin && (
  //       <InfoWindow
  //         position={{ lat: selectedPin.geometrics.coordinates[0], lng: selectedPin.geometrics.coordinates[1]}} //selectedPin.lat&lng
  //         onCloseClick={() => {
  //           setSelectedPin(null);
  //         }}
  //       >
  //         <div>
  //           <h2>{selectedPin.properties.leadId}</h2>
  //         </div>
  //       </InfoWindow>
  //     )}
  //   </GoogleMap>
  // )

  return (
    <GoogleMap
      zoom={12}
      center={{lat: 25.2255834, lng: 55.2843141}}
    >
      <Marker
        position={{ lat: "20.456738", lng: "50.73468" }}
      />
    </GoogleMap>
  )
}

