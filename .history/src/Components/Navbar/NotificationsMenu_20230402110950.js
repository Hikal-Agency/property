import { CircularProgress, Tab, Tabs, Typography } from "@mui/material";
import { Container } from "@mui/system";

import axios from "axios";
import { useEffect, useState } from "react";
import { FiUserCheck } from "react-icons/fi";
import { MdFeedback } from "react-icons/md";
import { MdOutlineFeedback, MdCalendarMonth } from "react-icons/md";
import { BsCalendar2EventFill, BsFillBuildingFill } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { HiUser } from "react-icons/hi";
import { useStateContext } from "../../context/ContextProvider";

const NotificationsMenu = () => {
  const token = localStorage.getItem("auth-token");
  const { BACKEND_URL, currentMode } = useStateContext();
  const [notifications, setNotifications] = useState();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState("unread");


const NotificationsMenu = () => {
    const { currentMode, BACKEND_URL } = useStateContext();

    const activity = [
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "Meeting",
            note: "Feedback updated to Meeting.",
            meetingDate: "2023-03-30",
            meetingTime: "12:30",
            leadId: "#123",
            leadName: "Lead Name",
            project: "Riviera Project",
            enquiryType: "1 Bedroom",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "Follow Up",
            note: "Feedback updated to Follow Up.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#123",
            leadName: "Lead Name",
            project: "Riviera Project",
            enquiryType: "1 Bedroom",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "Follow Up",
            note: "Feedback updated to Follow Up.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#321",
            leadName: "Lead Name 2",
            project: "Emmar Project",
            enquiryType: "3 Bedrooms",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "No Answer",
            note: "Feedback updated to No Answer.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#231",
            leadName: "Lead Name 3",
            project: "Onyx Project",
            enquiryType: "3 Bedrooms",
        },
        {
            creationDate: "2023-03-03 12:00:00",
            addedBy: "Hala Hikal",
            feedback: "",
            note: "Lead assigned to Abdulrhman Makawi.",
            meetingDate: "",
            meetingTime: "",
            leadId: "#231",
            leadName: "Lead Name 3",
            project: "Onyx Project",
            enquiryType: "3 Bedrooms",
        },
    ];

    return (
        <>
            <Container sx={{ maxHeight: 500, width: 400}}>
                {activity.map((activity, index) => {
                return (
                    <div
                        key={index}
                        className="pb-1"
                    >
                        {activity.feedback !== "" ? (
                            activity.feedback !== "Meeting" ? (
                                <div
                                    className={`${
                                    currentMode === "dark"
                                        ? "bg-gray-900"
                                        : "bg-gray-200"
                                    } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                                >
                                    <div class="grid grid-cols-7 gap-2 w-full">
                                        <div className="col-span-1 flex items-center justify-center">
                                            <MdOutlineFeedback size={"25px"} />
                                        </div>
                                        <div className="col-span-6 flex h-full w-full items-center">
                                            <div className="h-full w-5 flex items-center">
                                                <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                            </div>
                                            <div className="space-y-1 w-full">
                                                <p className="font-semibold text-sm tracking-wide">
                                                    {activity.note}
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project}&nbsp;{activity.enquiryType}</span>
                                                </p>
                                                <p className="text-xs mt-2 dark:text-gray-300 italic text-right w-full">
                                                    {activity.creationDate ||
                                                    activity.creationDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={`${
                                    currentMode === "dark"
                                        ? "bg-gray-900"
                                        : "bg-gray-200"
                                    } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                                >
                                    <div class="grid grid-cols-7 gap-2 w-full">
                                        <div className="col-span-1 flex items-center justify-center">
                                            <MdCalendarMonth size={"25px"} />
                                        </div>
                                        <div className="col-span-6 flex h-full w-full items-center">
                                            <div className="h-full w-5 flex items-center">
                                                <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                            </div>
                                            <div className="space-y-1 w-full">
                                                <p className="font-semibold text-sm tracking-wide">
                                                    {activity.note} Meeting Scheduled for <span class="text-main-red-color">{activity.meetingDate} {activity.meetingTime}.</span>
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                                </p>
                                                <p className="text-xs tracking-wide flex items-center">
                                                    <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project} {activity.enquiryType}</span>
                                                </p>
                                                <p className="text-xs mt-2 dark:text-gray-300 italic text-right w-full">
                                                    {activity.creationDate ||
                                                    activity.creationDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div
                                className={`${
                                currentMode === "dark"
                                    ? "bg-gray-900"
                                    : "bg-gray-200"
                                } p-2 pb-3 space-y-3 rounded-md shadow-md my-2 w-full`}
                            >
                                <div class="grid grid-cols-7 gap-2 w-full">
                                    <div className="col-span-1 flex items-center justify-center">
                                        <FiUserCheck size={"25px"} />
                                    </div>
                                    <div className="col-span-6 flex h-full w-full items-center">
                                        <div className="h-full w-5 flex items-center">
                                            <div className="h-full w-0.5 bg-main-red-color pointer-events-none"></div>
                                        </div>
                                        <div className="space-y-1 w-full">
                                            <p className="font-semibold text-sm tracking-wide">
                                                {activity.note}
                                            </p>
                                            <p className="text-xs tracking-wide flex items-center">
                                                <HiUser className="mr-2 text-main-red-color" /><span>{activity.leadName}</span>
                                            </p>
                                            <p className="text-xs tracking-wide flex items-center">
                                                <BsFillBuildingFill className="mr-2 text-main-red-color" /><span>{activity.project}&nbsp;{activity.enquiryType}</span>
                                            </p>
                                            <p className="text-xs mt-2 dark:text-gray-300 italic text-right w-full">
                                                {activity.creationDate ||
                                                activity.creationDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                })}
            </Container>
    </>);
}
>>>>>>> Stashed changes

  const handleAvoidClose = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    setLoading(true);
    const fetchNotifications = async () => {
      try {
        const url = `${BACKEND_URL}/notifications`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLoading(false);
        console.log(response);

        // Add a "read" property to each notification object and set it to false initially
        const notificationsWithReadProperty =
          response?.data?.notifications?.data?.map((notification) => ({
            ...notification,
            read: false,
          }));

        setNotifications(notificationsWithReadProperty);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, [BACKEND_URL, token]);

  console.log("notifications", notifications);

  // Filter the notifications array based on the current tab value
  const filteredNotifications =
    tabValue === "unread"
      ? notifications?.filter((notification) => !notification.read)
      : notifications?.filter((notification) => notification.read);

  // Update the "read" property of a notification object when it is clicked
  const handleNotificationClick = (notificationId, e) => {
    e.preventDefault();
    const updatedNotifications = notifications?.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
  };

  return (
    <>
      <Container
        onClick={handleAvoidClose}
        maxWidth={false}
        sx={{ height: 300, width: 400 }}
      >
        <Typography variant="h5">Notifications</Typography>
        {loading && <CircularProgress />}
        <Tabs
          value={tabValue}
          onChange={(e, value) => setTabValue(value)}
          className="mt-6"
          sx={{
            "& .MuiTabs-indicator": {
              backgroundColor: currentMode === "dark" ? "#fff" : "#000", // change indicator color
            },
            "& .MuiTab-root": {
              color: currentMode === "dark" ? "#fff" : "#000", // change tab text color
            },
            "& .Mui-selected": {
              color: currentMode === "dark" ? "#fff" : "#000", // change selected tab text color
            },
            "& .MuiTab-textColorInherit.Mui-selected": {
              color: currentMode === "dark" ? "#fff" : "#000", // change selected tab text color when using textColorInherit prop
            },
          }}
        >
          <Tab label="Read" value="read" />
          <Tab label="Unread" value="unread" />
        </Tabs>
        {filteredNotifications?.length > 0 ? (
          <div className="mt-4 flex flex-col space-y-2 ">
            <div className="notification-container space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={` h-300 w-400 overflow-auto flex items-center p-4 rounded-lg ${
                    currentMode === "dark"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={(e) => handleNotificationClick(notification.id, e)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="notification-icon">
                    <i className="fa fa-bell"></i>
                  </div>
                  <div className="notification-text">
                    <Typography
                      className={`notification-note ${
                        notification.read ? "text-gray-500" : ""
                      }`}
                    >
                      {notification?.note}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          !loading && <Typography>No notifications</Typography>
        )}
      </Container>
    </>
  );
};

export default NotificationsMenu;
