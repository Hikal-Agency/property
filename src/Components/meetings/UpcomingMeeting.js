import moment from "moment";
import React, { useEffect, useState } from "react";
import { 
  BsBuildings,
  BsClock,
  BsPinMap 
} from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";
import { useStateContext } from "../../context/ContextProvider";
import ShowLocation from "./ShowLocation";

const UpcomingMeeting = ({ upcoming_meetings }) => {
  const { currentMode } = useStateContext();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [meetingNote, setMeetingNote] = useState(null);
  const [meetingLocation, setMeetingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
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
            onClick={() => handleCardClick(meeting)}
            key={index}
            className={`w-[350px] flex flex-col justify-between ${
              currentMode === "dark" ? "bg-[#1c1c1c] text-white" : "bg-[#EEEEEE] text-black" // ${ currentMode === "dark" ? "bg- text-white " : "bg-" } 
            } rounded-xl hover:mt-1 hover:mb-3 my-2 hover:shadow-lg`}
          >
            <div className="px-5 py-5 space-y-3">
              <h2 className="text-main-red-color text-md font-semibold">
                {meeting?.leadName}
              </h2>
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
            <span className="block text-sm bg-main-red-color text-white rounded-b-xl text-center p-2 font-semibold">
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
    </div>
  );
};

export default UpcomingMeeting;
