import { useState } from "react";
import { toast } from "react-toastify";
import { IconButton, Tooltip } from "@mui/material";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";

import { BiRectangle } from "react-icons/bi";
import { GiCheckMark } from "react-icons/gi";
import "../../styles/animation.css";

const NotificationItem = ({
  activity,
  setNotifications,
  openNotification,
  iconBGColor,
  notificationIcons,
}) => {
  const { currentMode, BACKEND_URL, User, getNotifCounts } = useStateContext();
  const [fadeOutAnimating, setFadeOutAnimating] = useState(false);
  return (
    <>
      <div className={` ${fadeOutAnimating ? "notif-fade-out" : ""}`}>
        <div className="w-full h-fit">
          <div
            onClick={(e) => openNotification(e, activity)}
            className={`cursor-pointer card-hover ${
              currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"
            } mt-3 p-2 pb-3 space-y-3 rounded-xl shadow-sm w-full`}
          >
            <div className="grid grid-cols-6">
              <div className="flex justify-center items-center w-full h-full">
                <div
                  className="flex justify-center items-center h-[35px] w-[35px] rounded-full m-2"
                  style={{
                    background:
                      iconBGColor[activity?.type?.toLowerCase()] || "#da1f26",
                  }}
                >
                  {notificationIcons[activity?.type?.toLowerCase()] || (
                    <BiRectangle size={16} color={"#ffffff"} />
                  )}
                </div>
              </div>
              <div className="col-span-4">
                <div className="space-y-2 h-full m-1">
                  <p className="text-sm tracking-wide">
                    {activity?.title}
                  </p>
                  <p
                    className={`text-xs text-left w-full text-[#AAAAAA]`}
                  >
                    {activity?.created_at}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end items-center w-full h-full">
                <div className="close-icon m-1">
                  <Tooltip title="Mark as Read" arrow>
                    <IconButton
                      onClick={() => {
                        setFadeOutAnimating(true);
                        setTimeout(() => {
                          setFadeOutAnimating(false);

                          const token = localStorage.getItem("auth-token");

                          // Update the notification
                          axios
                            .post(
                              `${BACKEND_URL}/allnotifications/${User?.id}`,
                              JSON.stringify({
                                notification_id: activity?.id,
                                isRead: 1,
                              }),
                              {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: "Bearer " + token,
                                },
                              }
                            )
                            .then(() => {
                              getNotifCounts();
                            })
                            .catch((error) => {
                              console.log(error);

                              toast.error("Sorry, something went wrong.", {
                                position: "top-right",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "light",
                              });
                            });
                          // Fetch the notifications again
                          setNotifications((notifications) => {
                            return notifications?.filter(
                              (notif) => notif?.id !== activity?.id
                            );
                          });
                        }, 400);
                      }}
                    >
                      <GiCheckMark size={16} color={"#AAAAAA"} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>

            </div>

            {/* OLD UI  */}
            {/* <div class="grid grid-cols-7 gap-2 w-full">
              <div
                className="col-span-1 flex items-center justify-center h-[35px] w-[35px] rounded-full"
                style={{
                  background:
                    iconBGColor[activity?.type?.toLowerCase()] || "#da1f26",
                }}
              >
                {notificationIcons[activity?.type?.toLowerCase()] || (
                  <BiRectangle size={16} color={"#ffffff"} />
                )}
              </div>
              <div className="col-span-5 flex h-full w-full items-center">
                <div className="space-y-1 w-full">
                  <p className="text-sm tracking-wide">
                    {activity?.title}
                  </p>

                  <p
                    className={`text-xs mt-2 italic text-left w-full ${
                      currentMode === "dark" ? "text-gray-300" : ""
                    }`}
                  >
                    {activity?.created_at}
                  </p>
                </div>
              </div>
              <div className="close-icon flex items-center justify-center">
                <IconButton
                  sx={{
                    "& svg": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                  }}
                  onClick={() => {
                    setFadeOutAnimating(true);
                    setTimeout(() => {
                      setFadeOutAnimating(false);

                      const token = localStorage.getItem("auth-token");

                      // Update the notification
                      axios
                        .post(
                          `${BACKEND_URL}/allnotifications/${User?.id}`,
                          JSON.stringify({
                            notification_id: activity?.id,
                            isRead: 1,
                          }),
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: "Bearer " + token,
                            },
                          }
                        )
                        .then(() => {
                          getNotifCounts();
                        })
                        .catch((error) => {
                          console.log(error);

                          toast.error("Sorry, something went wrong.", {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                        });
                      // Fetch the notifications again
                      setNotifications((notifications) => {
                        return notifications?.filter(
                          (notif) => notif?.id !== activity?.id
                        );
                      });
                    }, 400);
                  }}
                >
                  <GrFormClose size={20} />
                </IconButton>
              </div>
            </div> */}

          </div>
          
        </div>
      </div>
    </>
  );
};

export default NotificationItem;
