import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import SwitchButtonComponent from "./SwitchButtonComponent";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BiCalendarEvent, BiMoney, BiSupport } from "react-icons/bi";
import { AiOutlineClockCircle, AiOutlineFlag } from "react-icons/ai";
import {
  FaCalendar,
  FaClock,
  FaHandshake,
  FaMoneyBillWave,
  FaRegCommentDots,
} from "react-icons/fa";
import { BsFlag } from "react-icons/bs";
import { MdSupportAgent } from "react-icons/md";
import axios from "../../axoisConfig";
import usePermission from "../../utils/usePermission";
import Loader from "../Loader";
import { BsBookmark } from "react-icons/bs";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";

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
    User,
    unreadNotifsCount,
  } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [date_range, setDate_range] = useState(0);
  const [notification_list, setNotification_list] = useState([]);
  const token = localStorage.getItem("auth-token");
  const { hasPermission } = usePermission();

  const handlePageChange = (event, value) => {
    setpageState({ ...pageState, page: value });
  };

  const readColor = {
    bgColorRead: currentMode === "dark" ? "#1c1c1c" : "#DDDDDD",
    bgColor: currentMode === "dark" ? "#333333" : "#EEEEEE",
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
    setLoading(true);
    try {
      let url = `${BACKEND_URL}/allnotifications?page=${pageState.page}`;

      // if (filter !== "all" || filter !== undefined || filter !== null) {
      //   url += `&isRead=${filter}`;
      // }
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

      // const isUnreadNotificationExists = response.data.notification.data.some(
      //   (notification) =>
      //     notification.isRead === 0 || notification.isRead === null
      // );

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mt-5 px-3 pl-4">
          {notification_list.length > 0 ? (
            notification_list?.map((notification, index) => (
              <div
                key={index}
                className={`flex items-center space-x-8  py-3 px-4 mb-2 `}
                // onClick={(e) => UpdateReadStatus(e, notification?.id)}
                style={{
                  background:
                    notification?.isRead === 0 || notification?.isRead === null
                      ? readColor?.bgColorRead
                      : readColor?.bgColor,
                }}
              >
                <div
                  style={{
                    background: iconBGColor[notification?.type?.toLowerCase()],
                  }}
                  className={` p-5`}
                >
                  {notificationIcons[notification?.type?.toLowerCase()]}
                </div>
                <div>
                  <h5
                    className={`font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    }`}
                  >
                    {notification?.title}

                    {/* <span
                          className={`font-bold ${
                            currentMode === "dark" ? "text-white" : "text-dark"
                          }`}
                        >
                          {notification?.leadName}
                        </span>{" "}
                        has been assigned to Sales Manager{" "}
                        <span className="font-bold">
                          {notification?.manager_name}
                        </span>{" "}
                        by{" "}
                        <span className="font-bold mt-2">
                          {notification?.username}
                        </span> */}
                  </h5>
                  <p
                    style={{ color: currentMode === "dark" && "#777777" }}
                    className="mt-2"
                  >
                    {notification?.type}. {notification?.created_at}{" "}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h2
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } text-center font-bold text-xl`}
            >
              No Notifications
            </h2>
          )}

          <Stack spacing={2} marginTop={2}>
            <Pagination
              count={maxPage}
              color={currentMode === "dark" ? "primary" : "secondary"}
              onChange={handlePageChange}
              style={{ margin: "auto" }}
              // page={pageState.page}
              page={currentPage}
              sx={{
                "& .Mui-selected": {
                  color: "white !important",
                  backgroundColor: "#DA1F26 !important",
                  "&:hover": {
                    backgroundColor: currentMode === "dark" ? "black" : "white",
                  },
                },
                "& .MuiPaginationItem-root": {
                  color: currentMode === "dark" ? "white" : "black",
                },
              }}
            />
          </Stack>
        </div>
      )}
    </>
  );
};

export default NotificationsListComponent;
