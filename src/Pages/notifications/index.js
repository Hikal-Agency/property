// import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

import NotificationsGridComponent from "../../Components/notificationsUi/NotificationsGridComponent";

const Notifications = () => {
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, BACKEND_URL, User, darkModeColors } =
    useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    const token = localStorage.getItem("auth-token");
    // eslint-disable-next-line
  }, [pageState.page]);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="w-full flex items-center py-1">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Notification Settings
              </h1>
            </div>
            <NotificationsGridComponent />
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
