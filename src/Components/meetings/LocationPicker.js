import { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import AutoComplete from "./AutoComplete";

const LocationPicker = ({
  meetingLocation,
  setMeetingLocation,
  showOnly = false,
}) => {
  const geocoder = new window.google.maps.Geocoder();

  const [map, setMap] = useState({
    panTo() {},
  });

  const onSelect = ({ latLng }) => {
    geocoder.geocode(
      { location: { lat: Number(latLng.lat()), lng: Number(latLng.lng()) } },
      (results, status) => {
        if (status === "OK") {
          setMeetingLocation({
            lat: Number(latLng.lat()),
            lng: Number(latLng.lng()),
            addressText: results[0].formatted_address,
          });
          console.log(results[0]);
        } else {
          alert("Google maps couldn't load");
        }
      }
    );
  };
  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    streetViewControl: false,
  };

  useEffect(() => {
    map.panTo({ lat: meetingLocation.lat, lng: meetingLocation.lng });
  }, [meetingLocation.lat, meetingLocation.lng, map]);
  return (
    <>
      {typeof window.google === "object" ? (
        <div style={{ width: "100%" }}>
          <AutoComplete
            setLocation={setMeetingLocation}
            defaultLocation={meetingLocation.addressText}
            setMeetingLocation={setMeetingLocation}
            isDisabled={showOnly}
          />
          <div style={{ marginTop: 30 }}></div>
          <GoogleMap
            onLoad={(map) => setMap(map)}
            mapContainerStyle={mapContainerStyle}
            center={meetingLocation}
            zoom={15}
            onClick={showOnly ? () => {} : onSelect}
            options={options}
          >
            <Marker position={meetingLocation} />
          </GoogleMap>
        </div>
      ) : (
        <div>Your map is loading...</div>
      )}
    </>
  );
};

export default LocationPicker;
