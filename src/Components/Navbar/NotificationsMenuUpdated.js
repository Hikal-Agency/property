import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/system";
import { CircularProgress } from "@mui/material";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import NotificationItem from "./NotificationItem";
import { BsShuffle } from "react-icons/bs";

import {
  MdOutlineWorkspacePremium,
  MdOutlineAlarm,
  MdOutlineFlag,
  MdOutlineBookmarkAdded,
  MdOutlinePerson,
  MdOutlineHeadsetMic,
  MdOutlineHandshake,
  MdOutlineCalendarMonth,
} from "react-icons/md";

const NotificationsMenuUpdated = ({ setCurrNavBtn, handleClose }) => {
  const token = localStorage.getItem("auth-token");
  const { BACKEND_URL, User, getNotifCounts } = useStateContext();
  const [notifications, setNotifications] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const { currentMode, BACKEND_URL } = useStateContext();

  const handleAvoidClose = (event) => {
    event.stopPropagation();
  };

  const iconBGColor = {
    "closed deal": "#da1f26",
    subscribe: "#18aae7",
    meeting: "#4aba57",
    reminder: "#edbf40",
    priority: "#868BD9",
    feedback: "#ff7936",
    lead: "#5e89f8",
    support: "#f895d1",
    reshuffle: "#87CEFA",
  };

  const notificationIcons = {
    "closed deal": <MdOutlineHandshake size={16} color={"#ffffff"} />,
    subscribe: <MdOutlineWorkspacePremium size={16} color={"#ffffff"} />,
    meeting: <MdOutlineCalendarMonth size={16} color={"#ffffff"} />,
    reminder: <MdOutlineAlarm size={16} color={"#ffffff"} />,
    priority: <MdOutlineFlag size={16} color={"#ffffff"} />,
    feedback: <MdOutlineBookmarkAdded size={16} color={"#ffffff"} />,
    lead: <MdOutlinePerson size={16} color={"#ffffff"} />,
    support: <MdOutlineHeadsetMic size={16} color={"#ffffff"} />,
    reshuffle: <BsShuffle size={16} olor={"#ffffff"} />,
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const url = `${BACKEND_URL}/allnotifications`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      console.log(response);

      const filteredNotifications = response?.data?.notification?.data?.filter(
        (notification) => notification.isRead !== 1
      );

      setNotifications(filteredNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [BACKEND_URL, token]);

  const openNotification = (e, activity) => {
    if (!e.target.closest(".close-icon")) {
      if (
        activity?.type === "Lead" ||
        activity?.type === "Feedback" ||
        activity?.type === "Priority"
      ) {
        if (activity?.lead_id) {
          navigate(`/lead/${activity.lead_id}`);
        } else {
          e.preventDefault();
        }
      } else if (activity?.type === "Meeting") {
        navigate(`/meetings`);
      } else if (activity?.type === "subscribe") {
        navigate("/marketing/payments");
      } else if (activity?.type === "Support") {
        navigate("/support?default=all");
      } else if (activity?.type === "Reminder") {
        navigate("/dashboard#reminders");
      }

      const notifId = activity?.id;
      axios
        .post(
          `${BACKEND_URL}/allnotifications/${User?.id}`,
          JSON.stringify({
            notification_id: notifId,
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
          // toast.error("Sorry, something went wrong!", {
          //   position: "top-right",
          //   autoClose: 3000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: true,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "light",
          // });
        });

      setCurrNavBtn(null);
    }
  };

  return (
    <Container
      onClick={handleAvoidClose}
      onMouseLeave={handleClose}
      sx={{ maxHeight: 500, p:1, width: 350, position: "relative" }}
      className="pb-5"
    >
      <div
        onClick={() => {
          navigate("/notificationsList");
          setCurrNavBtn(null);
        }}
        className="flex -mt-2 mb-3 justify-center text-[#AAAAAA] hover:text-primary text-sm w-full"
        style={{
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        See All Notifications
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <CircularProgress size={30} />
        </div>
      )}
      {/* {!loading &&
        notifications?.map((activity, index) => {
          return (
            <NotificationItem
              setNotifications={setNotifications}
              iconBGColor={iconBGColor}
              notificationIcons={notificationIcons}
              openNotification={openNotification}
              key={index}
              activity={activity}
            />
          );
        })} */}
      {!loading &&
        (notifications?.length > 0 ? (
          notifications?.map((activity, index) => {
            return (
              <NotificationItem
                setNotifications={setNotifications}
                iconBGColor={iconBGColor}
                notificationIcons={notificationIcons}
                openNotification={openNotification}
                key={index}
                activity={activity}
              />
            );
          })
        ) : (
          <h1 className="text-center">No Unread Notifications</h1>
        ))}
    </Container>
  );
};
export default NotificationsMenuUpdated;
