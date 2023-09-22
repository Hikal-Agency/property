import moment from "moment";
import React, { useEffect, useState } from "react";
import ShowLocation from "./ShowLocation";
import { useStateContext } from "../../context/ContextProvider";
import { 
  BsBuildings,
  BsClock,
  BsPinMap 
} from "react-icons/bs";
import "../../styles/animation.css";
import { Tooltip } from "@mui/material";
import {AiOutlineHistory} from "react-icons/ai";
import Timeline from "../../Pages/timeline";

const UpcomingMeeting = ({ upcoming_meetings }) => {
  const { currentMode, primaryColor } = useStateContext();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [meetingNote, setMeetingNote] = useState(null);
  const [meetingLocation, setMeetingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });
  const [timelinePopup, setTimelinePopup] = useState({
    isOpen: false, 
    leadId: null
  });

  useEffect(() => {
    console.log("upcoming meetings are");
    console.log(upcoming_meetings);
  }, []);

  const handleCardClick = (meeting) => {
    console.log("Meeting loc data: ", meeting);
    setIsModalOpened(true);
    setMeetingNote(meeting.meetingNote);
    setMeetingLocation({
      lat: Number(meeting.mLat),
      lng: Number(meeting.mLong),
      addressText: meeting.meetingLocation,
    });
  };

  const handleModalClose = () => {
    setIsModalOpened(false);
  };
  return (
    // <div className="overflow-x-scroll snap-x auto-cols-min">
    <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
      {upcoming_meetings?.map((meeting, index) => {
        return (
          <div
            onClick={(e) => {
                if(!e.target.closest(".timelineBtn")) {
              handleCardClick(meeting);
                }
              
              }}
            key={index}
            className={`card-hover backdrop-blur w-[350px] flex flex-col justify-between ${
              currentMode === "dark" ? "bg-[#1c1c1c] text-white" : "bg-[#d8d8d845] text-black" // ${ currentMode === "dark" ? "bg- text-white " : "bg-" } 
            } rounded-xl my-2 `}
          >
            <div className="px-5 py-5 space-y-3">
            
            <div className="flex items-center justify-between">
            <h2 style={{
                color: primaryColor
              }} className="text-md font-semibold">
                {meeting?.leadName}
              </h2>
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-primary rounded-full shadow-none p-1.5 mr-1 flex items-center timelineBtn`}
            >
              <Tooltip title="View Timeline" arrow>
                <button onClick={() => setTimelinePopup({isOpen: true, leadId: meeting?.leadId})}>
                  <AiOutlineHistory size={16} />
                </button>
              </Tooltip>
            </p>

              
            </div>
              <div className="grid grid-cols-11">
                <BsBuildings
                  size={16}
                  className={`mr-3 ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <p className="text-sm mr-3 col-span-10">
                  {meeting?.project === "null" ? "-" : meeting?.project}
                  {" "}
                  {meeting?.enquiryType === "null" ? "-" : meeting?.enquiryType}
                  {" "}
                  {meeting?.leadType === "null" ? "-" : meeting?.leadType}
                  {" "}
                  {meeting?.leadFor === "null" ? "-" : meeting?.leadFor}
                </p>
              </div>

              <div className="grid grid-cols-11">
                <BsClock
                  size={16}
                  className={`mr-3 ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <p className="text-sm mr-3 col-span-10">
                  {meeting?.meetingTime === ""
                    ? ""
                    : `${meeting?.meetingTime}, `}{" "}
                  {moment(meeting?.meetingDate).format("MMMM D, Y")}
                </p>
              </div>

              <div className="grid grid-cols-11">
                <BsPinMap
                  size={16}
                  className={`mr-3 ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                />
                <p className="text-sm mr-3 col-span-10">
                    {meeting?.meetingLocation || "Not Updated"}
                </p>
              </div>
            </div>
            <span style={{
              background: primaryColor
            }} className="block text-sm text-white rounded-b-xl text-center p-2 font-semibold">
              {meeting?.createdBy}
            </span>
          </div>
        );
      })}
      {meetingLocation.lat && meetingLocation.lng && isModalOpened ? (
        <ShowLocation
          isModalOpened={isModalOpened}
          meetingLocation={meetingLocation}
          meetingNote={meetingNote}
          handleModalClose={handleModalClose}
        />
      ) : (
        <></>
      )}

      {timelinePopup?.isOpen && (
            <Timeline
              timelineModelOpen={timelinePopup?.isOpen}
              handleCloseTimelineModel={() => setTimelinePopup({isOpen: false})}
              LeadData={{...timelinePopup}}
            />
          )}
    </div>
  );
};

export default UpcomingMeeting;
