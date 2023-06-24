import moment from "moment";
import React, { useEffect, useState } from "react";
import { BsBuilding } from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";
import { useStateContext } from "../../context/ContextProvider";

const Reminder = () => {
  const { currentMode } = useStateContext();
  const [isModalOpened, setIsModalOpened] = useState(false);

  const upcoming_reminders = [
    {
      leadName: "Junaid React Dev (Sr)",
      project: "CRM",
      enquiryType: "Villa",
      LeadType: "Dev",
      leadFor: "Investment",
      meetingTime: "12:00",
      meetingDate: "24-6-23",
      meetingLocation: "ISL",
      createdBy: "Junaid",
    },
    {
      leadName: "Junaid React Dev (Sr)",
      project: "CRM",
      enquiryType: "Villa",
      LeadType: "Dev",
      leadFor: "Investment",
      meetingTime: "12:00",
      meetingDate: "24-6-23",
      meetingLocation: "ISL",
      createdBy: "Junaid",
    },
    {
      leadName: "Junaid React Dev (Sr)",
      project: "CRM",
      enquiryType: "Villa",
      LeadType: "Dev",
      leadFor: "Investment",
      meetingTime: "12:00",
      meetingDate: "24-6-23",
      meetingLocation: "ISL",
      createdBy: "Junaid",
    },
    {
      leadName: "Junaid React Dev (Sr)",
      project: "CRM",
      enquiryType: "Villa",
      LeadType: "Dev",
      leadFor: "Investment",
      meetingTime: "12:00",
      meetingDate: "24-6-23",
      meetingLocation: "ISL",
      createdBy: "Junaid",
    },
    {
      leadName: "Junaid React Dev (Sr)",
      project: "CRM",
      enquiryType: "Villa",
      LeadType: "Dev",
      leadFor: "Investment",
      meetingTime: "12:00",
      meetingDate: "24-6-23",
      meetingLocation: "ISL",
      createdBy: "Junaid",
    },
    {
      leadName: "Junaid React Dev (Sr)",
      project: "CRM",
      enquiryType: "Villa",
      LeadType: "Dev",
      leadFor: "Investment",
      meetingTime: "12:00",
      meetingDate: "24-6-23",
      meetingLocation: "ISL",
      createdBy: "Junaid",
    },
  ];

  return (
    <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
      {upcoming_reminders?.map((meeting, index) => {
        return (
          <div
            // onClick={() => handleCardClick(meeting)}
            key={index}
            className={`w-[350px] flex flex-col justify-between ${
              currentMode === "dark" ? "bg-black" : "bg-white"
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
                  <p className="text-sm mr-3">
                    {" "}
                    {meeting?.meetingLocation || "Not Updated"}
                  </p>
                </div>
              </div>
            </div>
            <span className="block text-sm bg-main-red-color text-white rounded-md text-center p-2 font-semibold">
              {meeting?.createdBy}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Reminder;
