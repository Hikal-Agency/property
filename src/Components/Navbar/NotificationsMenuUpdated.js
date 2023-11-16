import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/system";
import { Button, CircularProgress } from "@mui/material";

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
  const { BACKEND_URL, User, getNotifCounts, t } = useStateContext();
  const [notifications, setNotifications] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastPage, setLastPage] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const navigate = useNavigate();

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

  const param = role => {
    if(role === 1) {
      return "is_admin_read";
    } else if(role === 3) {
      return "is_manager_read";
    } else {
      return "isRead";
    }
  }

  const fetchNotifications = async (page) => {
    try {
      setLoading(true);
      
      const url = `${BACKEND_URL}/allnotifications?page=${page}&${param(User?.role)}=0`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);

      const filteredNotifications = response?.data?.notification?.data;
      const lastPage = response?.data?.notification?.last_page;
      setLastPage(lastPage);

      setNotifications([...notifications, ...filteredNotifications]);

      console.log([...notifications, ...filteredNotifications]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications(currPage);
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
        });

      setCurrNavBtn(null);
    }
  };

  const loadMore = async () => {
    try {
      setBtnLoading(true);
      const url = `${BACKEND_URL}/allnotifications?page=${currPage+1}&isRead=0`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCurrPage((page) =>page + 1);
      setBtnLoading(false);

      const filteredNotifications = response?.data?.notification?.data;
      const lastPage = response?.data?.notification?.last_page;
      setLastPage(lastPage);

      setNotifications([...notifications, ...filteredNotifications]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      onClick={handleAvoidClose}
      // onMouseLeave={handleClose}
      sx={{ 
        maxHeight: 500,
        width: 350, 
        // position: "relative" 
      }}
      className="p-3"
    >
      <div
        onClick={() => {
          navigate("/notificationsList");
          setCurrNavBtn(null);
          handleClose();
        }}
        className="flex -mt-2 mb-3 justify-center hover:text-[#AAAAAA] text-sm w-full"
        style={{
          textDecoration: "none",
          cursor: "pointer",
        }}
      >
        {t("see_all_notifications")}
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
      {!loading &&
        (notifications?.length > 0 ? (
          <>
            {notifications?.map((activity, index) => {
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
            })}

            <di v className="pt-3 flex justify-center">
              <button onClick={loadMore} disabled={currPage >= lastPage} className="text-primary bg-transparent hover:bg-[#AAAAAA] hover:text-white font-semibold rounded-xl shadow-sm p-2">
                {btnLoading ? <CircularProgress size={18} style={{color: "black"}}/> : <span>Load more</span>}
              </button>
            </di>
            
          </>     
        ) : (
          <h1 className="text-center">No Unread Notifications</h1>
        ))}     
    </div>
  );
};
export default NotificationsMenuUpdated;
