import moment from "moment";
import React from "react";
import { BsBuilding } from "react-icons/bs";

import { ImLocation, ImClock } from "react-icons/im";
import { useStateContext } from "../../context/ContextProvider";

const UpcomingMeetingAgent = () => {
  const { currentMode, DashboardData } = useStateContext();
  return (
    // <div className="overflow-x-scroll snap-x auto-cols-min">
    <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
      {DashboardData?.upcoming_meetings.length >= 1 ? (
        DashboardData?.upcoming_meetings.map((meeting, index) => {
          return (
            <div
              key={index}
              className={`${
                currentMode === "dark"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              } rounded-md mb-3`}
            >
              <div className="px-5 py-5 space-y-3">
                <h2 className="text-main-red-color text-md font-bold">
                  {meeting?.leadName}
                </h2>
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <BsBuilding
                      className={`mr-2 ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    />
                    <p className="text-sm mr-3">
                      {meeting?.project} {meeting?.enquiryType}{" "}
                      {meeting?.leadType} {meeting?.leadFor}
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <ImClock
                      className={`mr-2 ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    />
                    <p className="text-sm mr-3">
                      {meeting?.meetingTime === ""
                        ? ""
                        : `${meeting?.meetingTime}, `}{" "}
                      {moment(meeting?.meetingDate).format("MMMM D, Y")}
                    </p>
                  </div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <ImLocation
                      className={`mr-2 ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    />
                    <p className="text-sm mr-3">{meeting?.meetingLocation || "Not Updated"}</p>
                  </div>
                </div>
              </div>
              {DashboardData?.designation === "Head" ? (
                <span className="block text-sm bg-main-red-color text-white rounded-md text-center p-2 font-semibold">
                  Agent Name
                </span>
              ) : (
                <></>
              )}
            </div>
          );
        })
      ) : (
        <h1 className="italic text-main-red-color">No meetings to show</h1>
      )}
    </div>
  );
};

export default UpcomingMeetingAgent;
