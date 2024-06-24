import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

import axios from "../../axoisConfig";
import Loader from "../Loader";
import { Pagination, Stack } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";
import { BsShuffle } from "react-icons/bs";

import "../../styles/animation.css";

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

const NotificationsListComponent = ({
  displayMarkBtn,
  setdisplayMarkBtn,
  fetch,
  setFetch,
  filter,
  filter_notifyAbout,
  filter_notifyDate,
  selectedUser,
}) => {
  console.log("filter: ", filter);
  console.log("filter_about: ", filter_notifyAbout);
  console.log("filter_date: ", filter_notifyDate);
  console.log("selectedUser: ", selectedUser);
  const {
    currentMode,
    BACKEND_URL,
    pageState,
    setpageState,
    primaryColor,
    unreadNotifsCount,
    themeBgImg,
    User
  } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [notification_list, setNotification_list] = useState([]);
  const token = localStorage.getItem("auth-token");

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const readColor = {
    bgColorRead: !themeBgImg ? (currentMode === "dark" ? "#222222" : "#DDDDDD") : (currentMode === "dark" ? "rgba(34,34,34,0.5)" : "rgba(221,221,221,0.5)"),
    bgColor: !themeBgImg ? (currentMode === "dark" ? "#0C0C0C" : "#F4F4F4") : (currentMode === "dark" ? "rgba(12,12,12,0.7)" : "rgba(244,244,244,0.7)"),
  };

  const iconBGColor = {
    "closed deal": "#da1f26",
    subscribe: "#18aae7",
    meeting: "#4aba57",
    reminder: "#edbf40",
    priority: "#868BD9",
    feedback: "#ff7936",
    lead: "#5E89F8",
    support: "#f895d1",
    reshuffle: "#87CEFA",
  };

  const notificationIcons = {
    "closed deal": <MdOutlineHandshake size={20} color={"#ffffff"} />,
    subscribe: <MdOutlineWorkspacePremium size={20} color={"#ffffff"} />,
    meeting: <MdOutlineCalendarMonth size={20} color={"#ffffff"} />,
    reminder: <MdOutlineAlarm size={20} color={"#ffffff"} />,
    priority: <MdOutlineFlag size={20} color={"#ffffff"} />,
    feedback: <MdOutlineBookmarkAdded size={20} color={"#ffffff"} />,
    lead: <MdOutlinePerson size={20} color={"#ffffff"} />,
    support: <MdOutlineHeadsetMic size={20} color={"#ffffff"} />,
    reshuffle: <BsShuffle size={20} color={"#ffffff"} />,
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/allnotifications?page=${pageState.page}`;

      if (filter === "1" || filter === "0" || filter === null) {
        url += `&isRead=${filter}`;
      }
      if (filter_notifyAbout) {
        url += `&type=${filter_notifyAbout}`;
      }
      if (filter_notifyDate) {
        const startDate = moment(filter_notifyDate)
          .subtract(1, "days")
          .format("YYYY-MM-DD");
        const endDate = moment(filter_notifyDate)
          .add(1, "days")
          .format("YYYY-MM-DD");
        const dateRange = [startDate, endDate].join(",");

        console.log("dateRange: ", dateRange);
        url += `&date_range=${dateRange}`;
      }
      if (selectedUser) {
        url += `&user_id=${selectedUser}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      unreadNotifsCount > 0
        ? setdisplayMarkBtn(true)
        : setdisplayMarkBtn(false);

      console.log("notification list: ", response);
      setNotification_list(response.data.notification.data);
      setMaxPage(response.data.notification.last_page);
      setCurrentPage(response.data.notification.current_page);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Unable to fetch notifications.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    setFetch(false);
  }, [pageState.page, fetch, filter_notifyDate]);

  const isNotifRead = (notification) => {
    let readStatus = null;
    if(User?.role === 1) {
      readStatus = notification?.is_admin_read;  
    } else if(User?.role === 3) {
      readStatus = notification?.is_manager_read;
    } else {
      readStatus = notification?.isRead;
    }

    return readStatus === 1;
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full my-2 px-3">
          {notification_list.length > 0 ? (
            notification_list?.map((notification, index) => (
              <div
                key={index}
                className={`card-hover shadow-sm flex items-center space-x-8 py-3 px-3 my-2 rounded-xl`}
                // onClick={(e) => UpdateReadStatus(e, notification?.id)}
                style={{
                  background:
                    User?.role === 1 ? (notification?.is_admin_read === 0 || notification?.is_admin_read === null
                      ? readColor?.bgColorRead
                      : readColor?.bgColor)
                    : User?.role === 3 ? (notification?.is_manager_read === 0 || notification?.is_manager_read === null
                      ? readColor?.bgColorRead
                      : readColor?.bgColor)
                    : (
                      notification?.isRead === 0 || notification?.isRead === null
                      ? readColor?.bgColorRead
                      : readColor?.bgColor
                    )
                }}
              >
                <div
                  style={{
                    background: iconBGColor[notification?.type?.toLowerCase()],
                  }}
                  className={`rounded-full p-4`}
                >
                  {notificationIcons[notification?.type?.toLowerCase()]}
                </div>
                <div>
                  <p
                    className={` ${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    } ${
                     !isNotifRead(notification) 
                        ? "font-semibold"
                        : ""
                    }`}
                  >
                    {notification?.title}
                  </p>
                  <p style={{ color: !themeBgImg ? "#AAAAAA" : (currentMode === "dark" ? "#CCCCCC" : "#333333") }} className="mt-2 text-sm">
                    {notification?.type}{" "}
                    <span className="rounded-full mx-1">●</span>{" "}
                    {notification?.created_at}{" "}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                height: "400px",
              }}
              className="flex flex-col justify-center items-center"
            >
              <div class="relative">
                <div class="h-24 w-24 rounded-full bg-primary my-6"></div>
                <div class="absolute top-0 right-0">
                  <span class="text-yellow-500 text-2xl">&#9733;</span>
                </div>
                <div class="absolute bottom-0 left-0">
                  <span class="text-yellow-500 text-2xl">&#9733;</span>
                </div>
              </div>

              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl mb-5 `}
              >
                You're all caught up!
              </h2>
            </div>
          )}

          {maxPage > 1 ? (
            <Stack spacing={2} marginTop={2}>
              <Pagination
                count={maxPage}
                onChange={handlePageChange}
                style={{ margin: "auto" }}
                page={currentPage}
                sx={{
                  "& .Mui-selected": {
                    color: "white !important",
                    backgroundColor: `${primaryColor} !important`,
                    "&:hover": {
                      backgroundColor:
                        currentMode === "dark" ? "black" : "white",
                    },
                  },
                  "& .MuiPaginationItem-root": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                }}
              />
            </Stack>
          ) : null}
        </div>
      )}
    </>
  );
};

export default NotificationsListComponent;
