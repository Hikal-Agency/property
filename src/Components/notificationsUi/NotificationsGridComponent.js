import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import SwitchButtonComponent from "./SwitchButtonComponent";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BiCalendarEvent, BiMoney, BiSupport } from "react-icons/bi";
import { AiOutlineClockCircle, AiOutlineFlag } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const NotificationsGridComponent = () => {
  const { currentMode, BACKEND_URL, themeBgImg } = useStateContext();
  const [permitObj, setPermitObj] = useState(null);

  const notify_settings = [
    {
      id: 1,
      heading: "Lead Assignment Notification",
      button: <SwitchButtonComponent />,
      icon: <BsFillPersonLinesFill size={30} />,
      type: "lead_assignemt",
    },
    {
      id: 2,
      heading: "Feedback Notification",
      button: <SwitchButtonComponent />,
      icon: <FaRegCommentDots size={30} />,
      type: "feedback",
    },
    {
      id: 3,
      heading: "Priority Notification",
      button: <SwitchButtonComponent />,
      icon: <AiOutlineFlag size={30} />,
      type: "priority",
    },
    {
      id: 4,
      heading: "Reminder Notification",
      button: <SwitchButtonComponent />,
      icon: <AiOutlineClockCircle size={30} />,
      type: "reminder",
    },
    {
      id: 5,
      heading: "Meeting Notification",
      button: <SwitchButtonComponent />,
      icon: <BiCalendarEvent size={30} />,
      type: "meeting",
    },
    {
      id: 6,
      heading: "Billing Notification",
      button: <SwitchButtonComponent />,
      icon: <BiMoney size={30} />,
      type: "billing",
    },
    {
      id: 7,
      heading: "Support Notification",
      button: <SwitchButtonComponent />,
      icon: <BiSupport size={30} />,
      type: "support",
    },
  ];

  const fetchNotifPermissions = () => {
    const token = localStorage.getItem("auth-token");
    try {
      axios
        .get(`${BACKEND_URL}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log("User data is");
          console.log(result.data);

          // Create a new object with only the specific fields you want to store

          const allPermissions = JSON.parse(result.data.user[0]?.is_alert);
          setPermitObj(allPermissions);
        });
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch notification permissions.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchNotifPermissions();
  }, []);

  return (
    <>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 px-3">
        {notify_settings?.length > 0 &&
          notify_settings?.map((call, index) => {
            return (
              <div
                className={`${
                  !themeBgImg ? (currentMode === "dark"
                    ? "text-white"
                    : "text-black")
                    :(currentMode === "dark"
                    ? "blur-bg-dark text-white"
                    : "blur-bg-light text-black")
                } rounded-xl border broder-2 `}
                key={index}
              >
                <div
                  className={`rounded-t-xl mb-2 p-2 ${
                    !themeBgImg 
                    ? (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]")
                    : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h5
                      className={`font-bold text-base ${
                        currentMode === "dark" ? "text-white" : "text-dark"
                      } text-center flex-grow`}
                    >
                      {call?.heading}
                    </h5>
                    <div>{call?.icon}</div>
                  </div>
                </div>

                <div className="  p-4">
                  <div className="mb-4 flex items-center  justify-between">
                    <h1 className="text-sm">SMS Notification&nbsp;</h1>
                    <span className=" float-right">
                      <SwitchButtonComponent
                        fetchNotifPermissions={fetchNotifPermissions}
                        permitObj={permitObj}
                        call={call}
                        value={"sms"}
                      />
                    </span>
                    {/* <span className=" float-right">{call?.button}</span> */}
                  </div>
                  <div className="mb-4 flex items-center  justify-between">
                    <h1 className="text-sm">Email Notification&nbsp;</h1>
                    {/* <span className="float-right">{call?.button}</span> */}
                    <span className="float-right">
                      <SwitchButtonComponent
                        fetchNotifPermissions={fetchNotifPermissions}
                        permitObj={permitObj}
                        call={call}
                        value={"email"}
                      />
                    </span>
                  </div>
                  {/* <div className="mb-4 flex items-center  justify-between">
                    <h1 className="text-sm">Whatsapp Notification&nbsp;</h1>
                    <span className="float-right">{call?.button}</span>
                  </div> */}
                </div>
              </div>
            );
          })}

        {/* <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black"
                } p-3 rounded-md`}
              >
                <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                  <h5 className="font-bold text-main-red-color col-span-5">
                    {notify_settings.userName}
                  </h5>
                </div>
                <div className="grid gap-3">
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Outgoing
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          DIALED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.dialed}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          NOT ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.notanswered}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.answered}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Incoming
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          RECEIVED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.recieved}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          MISSED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.missed}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
      </div>
    </>
  );
};

export default NotificationsGridComponent;
