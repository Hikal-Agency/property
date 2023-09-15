import moment from "moment";
import React , { useState } from "react";
import { Tooltip } from "@mui/material";
import { useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import MapContainer from "./MapComponent";

import { 
  BsBuildings,
  BsClock,
  BsPinMap,
  BsFillBookmarkFill 
} from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "./App.css";

const LocationComponent = ({ upcoming_meetings }) => {
  const { currentMode } = useStateContext();
  const [selectedMeeting, setSelectedMeeting] = React.useState(null);

  const handleMeetingClick = (meeting) => {
    console.log("Clicked on meeting:", meeting);
    setSelectedMeeting(meeting);
  }

  console.log("upcommings meetins locations : ", upcoming_meetings);

  //   const position = [51.505, -0.09];

  useEffect(() => {
    console.log("upcoming meetings are");
    console.log(upcoming_meetings);
  }, []);

  useEffect(() => {
    console.log("Selected Meeting:", selectedMeeting);
  }, [selectedMeeting]);

  return (
    <>
      <div className="w-full flex items-center py-1">
        <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
        <h1
          className={`text-lg font-semibold ${
            currentMode === "dark"
              ? "text-white"
              : "text-black"
          }`}
        >
          Meeting Locations
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-3">
        
      <div
          className={`${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]"
          } w-full h-[100vh] col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
        >
          {/* MAP */}
          {/* {upcoming_meetings?.length > 0 && ( */}
          <MapContainer 
            location={upcoming_meetings} 
            selectedMeeting={selectedMeeting}
            clearSelectedMeeting={() => setSelectedMeeting(null)}
          />
          {/* )} */}
        </div>
        
        <div className="col-span-1 h-full w-full sm:mt-5 md:mt-5 lg:mt-0">
          <h4 className="text-red-600 font-semibold text-center text-lg mb-2">Meetings</h4>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* LIST OF UPCOMING MEETINGS */}
            {upcoming_meetings?.map((meeting, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleMeetingClick(meeting)} 
                  className={`flex flex-col justify-between ${
                    currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-[#EEEEEE] text-black"
                  } rounded-md`}
                >
                  <div className="px-5 py-5 space-y-3">
                    <div className="grid grid-cols-8 gap-5">
                      <h2 className="col-span-7 text-main-red-color text-md font-semibold">
                        {meeting?.leadName}
                      </h2>
                      {meeting?.meetingStatus === "Attended" ? (
                        <BsFillBookmarkFill size={16} color="#279244" />
                      ) : meeting?.meetingStatus === "Pending" ? (
                        <BsFillBookmarkFill size={16} color="#eebe3c" />
                      ) : meeting?.meetingStatus === "Postponed" ? (
                        <BsFillBookmarkFill size={16} color="#ec6525" />
                      ) : meeting?.meetingStatus === "Cancelled" ? (
                        <BsFillBookmarkFill size={16} color="#DA1F26" />
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="grid grid-cols-9">
                      <BsBuildings
                        size={16}
                        className={`mr-3 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3 col-span-8">
                        {meeting?.project === "null" ? "-" : meeting?.project}
                        {" "}
                        {meeting?.enquiryType === "null" ? "-" : meeting?.enquiryType}
                        {" "}
                        {meeting?.leadType === "null" ? "-" : meeting?.leadType}
                        {" "}
                        {meeting?.leadFor === "null" ? "-" : meeting?.leadFor}
                      </p>
                    </div>

                    <div className="grid grid-cols-9">
                      <BsClock
                        size={16}
                        className={`mr-3 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3 col-span-8">
                        {meeting?.meetingTime === ""
                          ? ""
                          : `${meeting?.meetingTime}, `}{" "}
                        {moment(meeting?.meetingDate).format("MMMM D, Y")}
                      </p>
                    </div>

                    <div className="grid grid-cols-9">
                      <BsPinMap
                        size={16}
                        className={`mr-3 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3 col-span-8">
                          {meeting?.meetingLocation || "Not Updated"}
                      </p>
                    </div>
                  </div>
                  <span className="block text-sm bg-main-red-color text-white rounded-md text-center p-2 font-semibold">
                    {meeting?.createdBy}
                  </span>
                </div>
              );
            })}
            <span className="text-center text-main-red-color">- - -</span>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default LocationComponent;
