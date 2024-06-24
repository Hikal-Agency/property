import React, { useEffect } from "react";
import moment from 'moment';
import { load } from "../../Pages/App";
import { GoogleMap, MarkerF, InfoWindow } from "@react-google-maps/api";
import { useStateContext } from "../../context/ContextProvider";
import { datetimeLong } from "../_elements/formatDateTime";

import {
  BsPerson,
  BsClock,
  BsBuildings
} from "react-icons/bs";

const MapContainer = ({ location, selectedMeeting, clearSelectedMeeting }) => {
  const { currentMode, isArabic } = useStateContext();
  useEffect(() => {
    console.log("meetings and locations are", location);
  }, [location]);

  // Filter out invalid locations
  const validLocations = location?.filter((meeting) => {
    return meeting.mLat && meeting.mLong;
  });

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  };

  return (
    <>
      { !load?.isLoaded ? (
        <div>Your map is loading...</div>
      ) : (
        <GoogleMap
          zoom={selectedMeeting ? 14 : 10}
          center={{ lat: 25.22527310000002, lng: 55.280889615218406 }}
          mapContainerStyle={mapContainerStyle}
          options={options}
        >
          {validLocations?.length > 0 ? (
            validLocations?.map((meeting) => {

              const mDate = meeting?.meetingDate;
              const mTime = meeting?.meetingTime;
              
              const dateTimeString = `${mDate} ${mTime}`;
              
              const timeString = moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss');
    
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
                      <div className="w-[250px]">
                        <h1 
                        className="p-1 font-semibold capitalize text-primary"
                        style={{
                          fontFamily: isArabic(meeting?.leadName) ? "Noto Kufi Arabic" : "inherit"
                        }}>
                          {meeting?.leadName ?? "?"}
                        </h1>
                        <hr className="my-1" />
                        <div className="p-1 grid grid-cols-7">
                          <BsBuildings size={16} />
                          <div className="col-span-6">
                            {meeting?.project}
                            {" "}
                            {meeting?.enquiryType}
                            {" "}
                            {meeting?.leadType}
                          </div>
                        </div>
                        <div className="p-1 grid grid-cols-7">
                          <BsClock size={16} />
                          <div className="col-span-6">
                            {datetimeLong(timeString)}
                          </div>
                        </div>
                        <div className="p-1 grid grid-cols-7">
                          <BsPerson size={16} />
                          <div className="col-span-6">
                            {meeting?.createdBy}
                          </div>
                        </div>
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
