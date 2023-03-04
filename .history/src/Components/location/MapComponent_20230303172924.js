import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow, Marker } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

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
  const { isLoaded, loadError } = useLoadScript({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: "AIzaSyBtYwXsFlL25Jct9nYMl8ytW0KiZ6q19sY",
    libraries,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading your map...</div>;

  return (
    <GoogleMap
      zoom={12}
      center={{lat: 25.2255834, lng: 55.2843141}}
      mapContainerStyle={mapContainerStyle}
      options={options}
      onClick={(event) => {
        setMarkers((current) => [
          ...current,
          {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          }
        ])
      }}
    >
      <MarkerF key={1} position={{ lat: 22.876545, lng: 55.345678}} />
    </GoogleMap>
  );
}

function mmm() {
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
}

