// import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

import NotificationsGridComponent from "../../Components/notificationsUi/NotificationsGridComponent";
// import NotificationsManagementComponent from "../../Components/notificationsUi/NotificationsMangementComponent";
import NotificationsManagementComponent from "../../Components/notificationsUi/NotificationsManagementComponent";

const Notifications = () => {
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, t, themeBgImg } = useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
    currentTab: "notification_permissions",
  });

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, [pageState.page]);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("notification_settings")}
              </h1>
            </div>
            <ul className="ml-3 flex gap-3 p-2 text-[14px] font-semibold">
              <li
                onClick={() =>
                  setpageState((pre) => ({
                    ...pre,
                    currentTab: "notification_permissions",
                  }))
                }
                className={`border-b-[2px] cursor-pointer ${
                  pageState?.currentTab == "notification_permissions"
                    ? "border-b-primary"
                    : "border-b-transparent"
                }`}
              >
                Notification Permissions
              </li>
              <li
                onClick={() =>
                  setpageState((pre) => ({
                    ...pre,
                    currentTab: "notification_management",
                  }))
                }
                className={`border-b-[2px] cursor-pointer ${
                  pageState?.currentTab == "notification_management"
                    ? "border-b-primary"
                    : "border-b-transparent"
                }`}
              >
                Notification Management
              </li>
            </ul>
            {pageState?.currentTab == "notification_permissions" && (
              <NotificationsGridComponent />
            )}
            {pageState?.currentTab == "notification_management" && (
              <NotificationsManagementComponent />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
