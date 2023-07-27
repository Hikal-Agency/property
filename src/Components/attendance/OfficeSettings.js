// import Image from "next/image";
import React from "react";
import { useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import { Button } from "@mui/material";
import MyCalendar from "./MyCalendar";
import { Box } from "@mui/system";

const OfficeSettings = () => {
  const { currentMode, formatNum } = useStateContext();

  const [isEditing, setIsEditing] = useState(false);
  const handleEventClick = (eventClickInfo) => {
    console.log("Event clicked:", eventClickInfo.event);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = () => {
    // Perform update logic here
    setIsEditing(false);
  };

  return (
    <>
      <h4 className="text-red-600 font-bold text-xl mb-2 text-center">
        Office Time Settings
      </h4>
      <Box className="h-[60vh] flex items-center justify-center">
        <img src="/coming-soon.png" width={"200px"} alt="" />
      </Box>
      
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-5 pb-3">
        <div
          className={`${
            currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
          } w-full col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 p-5`}
          //   style={{ height: "700px" }}
        >
          <div>
            <MyCalendar />
          </div>
        </div>
        <div className="h-full w-full">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col">
              <div
                className={`${
                  currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
                } p-4 shadow-md rounded-md`}
              >
                <div className="flex justify-between mb-3">
                  <p
                    className={`${
                      currentMode === "dark"
                        ? "text-white-600"
                        : "text-black-600"
                    }`}
                  >
                    Start Time
                  </p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      defaultValue="09:30"
                    />
                  ) : (
                    <p>9:30AM</p>
                  )}
                </div>
                <div className="flex justify-between mb-3">
                  <p>End Time</p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      defaultValue="06:30"
                    />
                  ) : (
                    <p>6:30PM</p>
                  )}
                </div>
                <div className="flex justify-between mb-3">
                  <p>Off Day</p>
                  {isEditing ? (
                    <input
                      type="text"
                      style={{ padding: "0 6px" }}
                      defaultValue="Sunday"
                    />
                  ) : (
                    <p>Sunday</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div
                className={`${
                  currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
                } p-4 shadow-md rounded-md`}
              >
                <div className="flex justify-between mb-3">
                  <p>Maximum Late Time</p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      defaultValue="10:45"
                    />
                  ) : (
                    <p>10:45AM</p>
                  )}
                </div>
                <div className="flex justify-between mb-3">
                  <p>Overtime After</p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      defaultValue="08:00"
                    />
                  ) : (
                    <p>08:00AM</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {!isEditing ? (
                <Button
                  type="submit"
                  size="medium"
                  className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
                  style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
                  onClick={handleEditClick}
                >
                  Modify Settings
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="medium"
                  className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
                  style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
                  onClick={handleUpdateClick}
                >
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfficeSettings;
