import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import MapContainer from "./MapComponent";

import { 
  BsBuildings,
  BsClock,
  BsPinMap,
  BsFillBookmarkFill 
} from "react-icons/bs";

const LocationComponent = ({ upcoming_meetings }) => {
  const { currentMode, t, themeBgImg } = useStateContext();
  const [selectedMeeting, setSelectedMeeting] = React.useState(null);

  const handleMeetingClick = (meeting) => {
    console.log("Clicked on meeting:", meeting);
    setSelectedMeeting(meeting);
  }

  useEffect(() => {
    console.log("upcoming meetings are");
    console.log(upcoming_meetings);
  }, []);

  useEffect(() => {
    console.log("Selected Meeting:", selectedMeeting);
  }, [selectedMeeting]);

  return (
    <>
      <div className="w-full flex items-center pb-3">
        <div className="bg-primary h-10 w-1 rounded-full"></div>
        <h1
          className={`text-lg font-semibold mx-2 uppercase ${
            currentMode === "dark" ? "text-white" : "text-black"
          }`}
        >
          {t("upcoming_meeting_locations")}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 h-screen">
        <div
          className={`${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]"
          } w-full h-screen col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-3`}
        >
          {/* MAP */}
          <MapContainer 
            location={upcoming_meetings} 
            selectedMeeting={selectedMeeting}
            clearSelectedMeeting={() => setSelectedMeeting(null)}
          />
          {/* )} */}
        </div>
        <div className="col-span-1 md:col-span-1 h-full w-full overflow-y-scroll hide-scrollbar" >
          <div className="grid grid-cols-1 gap-3">
            {/* LIST OF UPCOMING MEETINGS */}
            {upcoming_meetings?.map((meeting, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleMeetingClick(meeting)} 
                  className={`card-hover flex flex-col justify-between ${
                    !themeBgImg ? (currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-[#EEEEEE] text-black")
                      : (currentMode === "dark"
                      ? "blur-bg-dark text-white"
                      : "blur-bg-white text-black")
                  } rounded-xl shadow-sm`}
                >
                  <div className="p-5 space-y-2">
                    <div className="grid grid-cols-9 mb-3 flex justify-between w-[100%]">
                      <h4 className="col-span-8 font-bold capitalize">
                        {meeting?.leadName}
                      </h4>
                      <div className="flex justify-end">
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
                  <span className="block text-sm bg-primary text-white rounded-b-xl text-center p-2 font-semibold">
                    {meeting?.createdBy}
                  </span>
                </div>
              );
            })}
            <span className="text-center text-primary">- - -</span>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default LocationComponent;
