import { Container } from "@mui/system";

// import axios from "axios";
import axios from "../../axoisConfig";
import { useEffect, useState } from "react";
import { MdSupportAgent } from "react-icons/md";
import { toast } from "react-toastify";
import { BsBookmark, BsFillPersonLinesFill, BsFlag } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import {
  FaCalendar,
  FaClock,
  FaHandshake,
  FaMoneyBillWave,
} from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import NotificationItem from "./NotificationItem";

const NotificationsMenuUpdated = ({ setAnchorEl, setOpen }) => {
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
  };

  const notificationIcons = {
    "closed deal": <FaHandshake size={16} color={"#ffffff"} />,
    subscribe: <FaMoneyBillWave size={16} color={"#ffffff"} />,
    meeting: <FaCalendar size={16} color={"#ffffff"} />,
    reminder: <FaClock size={16} color={"#ffffff"} />,
    priority: <BsFlag size={16} color={"#ffffff"} />,
    feedback: <BsBookmark size={16} color={"#ffffff"} />,
    lead: <BsFillPersonLinesFill size={16} color={"#ffffff"} />,
    support: <MdSupportAgent size={16} color={"#ffffff"} />,
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const url = `${BACKEND_URL}/allnotifications?user_id=${User?.id}`;

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
          toast.error("Sorry, something went wrong!", {
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

      setOpen(false);
      setAnchorEl(null);
    }
  };

  return (
    <Container
      onClick={handleAvoidClose}
      sx={{ maxHeight: 500, width: 400, position: "relative" }}
    >
      <div
        onClick={() => {
          navigate("/notificationsList");
          setAnchorEl(null);
          setOpen(false);
        }}
        style={{
          textDecoration: "none",
          color: "#1877f2",
          fontWeight: "bold",
          marginBottom: "15px",
          marginTop: "10px",
          cursor: "pointer",
        }}
      >
        See All
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress size={30} />
        </div>
      )}
      {!loading &&
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
        })}
    </Container>
  );
};
export default NotificationsMenuUpdated;
