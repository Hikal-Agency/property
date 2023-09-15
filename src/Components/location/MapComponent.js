import React, { useEffect, useState } from "react";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";
import { useStateContext } from "../../context/ContextProvider";

const MapContainer = ({ location, selectedMeeting, clearSelectedMeeting }) => {
  const { currentMode } = useStateContext();
  useEffect(() => {
    console.log("meetings and locations are", location);
  }, [location]);

  // Filter out invalid locations
  const validLocations = location?.filter((meeting) => {
    return meeting.mLat && meeting.mLong;
  });
  console.log("valid locations: ", validLocations);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  };

  // const [selectedMeeting, setSelectedMeeting] = useState(null);

  return (
    <>
      {typeof window.google !== "object" ? (
        <div>Your map is loading...</div>
      ) : (
        <GoogleMap
          zoom={5}
          center={{ lat: 25.22527310000002, lng: 55.280889615218406 }}
          mapContainerStyle={mapContainerStyle}
          options={options}
        >
          {validLocations?.length > 0 ? (
            validLocations?.map((meeting) => {
              console.log("locations on map: ", validLocations);
              return (
                <MarkerF
                  key={meeting.id}
                  position={{
                    lat: Number(meeting.mLat),
                    lng: Number(meeting.mLong),
                  }}
                  icon={{
                    url: "/meetingpinattended.svg",
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                  // onClick={() => {
                  //   setSelectedMeeting(meeting);
                  // }}
                >
                  {selectedMeeting && selectedMeeting.id === meeting.id && (
                    <InfoWindow
                      position={{
                        lat: Number(meeting?.mLat),
                        lng: Number(meeting?.mLong),
                      }}
                      onCloseClick={() => {
                        // setSelectedMeeting(null);
                        console.log("Close clicked!");
                        clearSelectedMeeting();
                      }}
                    >
                      <div>
                        <h1>{meeting?.leadName}</h1>
                        <h1 className="font-semibold">
                          {meeting?.project}&nbsp;
                          {meeting?.enquiryType}&nbsp;
                          {meeting?.leadType}
                        </h1>
                        <h1>
                          {meeting?.meetingTime}&nbsp;
                          {meeting?.meetingDate}
                        </h1>
                        <h1> {meeting?.createdBy}</h1>
                      </div>
                    </InfoWindow>
                  )}
                </MarkerF>
              );
            })
          ) : (
            <h2 className={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}>
              No locations to show.
            </h2>
          )}
        </GoogleMap>
      )}
    </>
  );
};

export default MapContainer;
