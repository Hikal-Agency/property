import React, { Component, useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindow } from '@react-google-maps/api';
import { ImLocation } from "react-icons/im";

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
      onClick={(event) => {
        setMarkers((current) => [
          ...current,
          {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }
        ])
      }}
    >
      {/* {meetingData.map((marker, index) => ( 
        <MarkerF 
          key={index} 
          position={{ lat: marker.lat, lng: marker.lng}} />
      ))} */}

      {meetingData.features.map(meeting => (
        <MarkerF
          key={meeting.properties.mId} 
          position={{ lat: meeting.geometrics.coordinates[0], lng: meeting.geometrics.coordinates[1]}}
          // onClick={() => {
          //   setSelectedPin();
          // }} 
          // icon={{
          //   // MeetingIcon,
          //   url: "../../../public/favicon.png",
          //   scaledSize: new window.google.maps.Size(25, 25)
          // }}
        />
      ))}

    </GoogleMap>
  );
}

function mmm() {
  const MeetingIcon = <ImLocation />;

  
}

