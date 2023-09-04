import { useState } from "react";
import { IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { GrFormClose } from "react-icons/gr";
import { BiRectangle } from "react-icons/bi";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

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
      <div className={`pb-1 ${fadeOutAnimating ? "notif-fade-out" : ""}`}>
        <div
          onClick={(e) => openNotification(e, activity)}
          className={`cursor-pointer ${
            currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
          } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
        >
          <div class="grid grid-cols-7 gap-2 w-full">
            <div
              className="col-span-1 flex items-center justify-center h-[40px]"
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
                <p className="font-semibold text-sm tracking-wide">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationItem;
