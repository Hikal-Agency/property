import React, { useEffect } from "react";
import { useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import { Button, CircularProgress } from "@mui/material";
import MyCalendar from "./MyCalendar";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import moment from "moment";

const OfficeSettings = () => {
  const { 
    currentMode, 
    BACKEND_URL, 
    t,
    themeBgImg
  } = useStateContext();
  const token = localStorage.getItem("auth-token");

  const [settings, setSettings] = useState({
    in_time: null,
    out_time: null,
    in_late_time: null,
    out_late_time: null,
    off_day: null,
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  console.log("settings: ", settings);


  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    setBtnLoading(true);

    if (!settings) {
      toast.error("kindly enter data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    const formData = new FormData();
    formData.append(
      "in_time",
      settings?.in_time
        ? moment(settings.in_time, "HH:mm").format("hh:mm A")
        : ""
    );

    formData.append(
      "out_time",
      settings?.out_time
        ? moment(settings.out_time, "HH:mm").format("hh:mm A")
        : ""
    );

    formData.append(
      "out_late_time",
      settings?.out_late_time
        ? moment(settings.out_late_time, "HH:mm").format("hh:mm A")
        : ""
    );

    formData.append(
      "in_late_time",
      settings?.in_late_time
        ? moment(settings.in_late_time, "HH:mm").format("hh:mm A")
        : ""
    );

    formData.append("off_day", settings?.off_day);
    try {
      const update_timings = await axios.post(
        `${BACKEND_URL}/agencies/1`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setBtnLoading(false);

      toast.success("Time updated successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      fetchSettings();

      console.log("Response: ", update_timings);
    } catch (error) {
      setBtnLoading(false);
      toast.error("Unable to update time.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setIsEditing(false);
  };

  const fetchSettings = async () => {
    try {
      const get_settings = await axios.get(
        `${BACKEND_URL}/agencies/1`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("settings:  ", get_settings);

      setSettings(get_settings?.data?.data);

      console.log("Response: ", get_settings);

      // OFF DAYS
      const offDaysFromApi = get_settings?.data?.data?.off_day || "";
      const offDaysArray = offDaysFromApi.split(", ").filter(Boolean); // Split and remove empty entries
      setOffDays(offDaysArray);

      console.log("offDayArray=====================> ", offDaysArray);
    } catch (error) {
      toast.error("Unable to fetch settings.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }

    setIsEditing(false);
  };

  // OFF DAYS
  const [offDays, setOffDays] = useState([]);
  // const isOffDay = (offDay) => {
  //   return offDays.includes(offDay);
  // };
  const isOffDay = (offDay) => {
    const formattedOffDay = moment(offDay).format("dddd"); // Convert date to day name (e.g., "Sunday")
    return offDays.includes(formattedOffDay);
  };

  useEffect(() => {
    fetchSettings();
    // fetchOffDays();
  }, []);

  return (
    <>
      <div className="w-full flex items-center pb-3">
        <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
        <h1
          className={`text-lg font-semibold ${
            currentMode === "dark"
              ? "text-white"
              : "text-black"
          }`}
        >
          {t("office_time_settings")}
        </h1>
      </div>
  

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-5 pb-3">
        <div
          className={`${
            !themeBgImg ? (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
            : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
          } w-full col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2 p-5 rounded-xl shadow-sm`}
        >
          <div
            className={`${currentMode === "dark" ? "text-white" : "text-dark"}`}
          >
            <MyCalendar isOffDay={isOffDay} />
          </div>
        </div>
        <div className="h-full w-full">
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col">
              <div
                className={`${
                  !themeBgImg ? (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
                  : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                } p-4 shadow-sm rounded-xl`}
              >
                <div className="flex justify-between mb-3">
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-center"
                    }`}
                  >
                    {t("start_time")}
                  </p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      value={settings?.in_time || ""}
                      onChange={(e) => {
                        console.log("clicked");
                        setSettings({
                          ...settings,
                          in_time: e.target.value,
                        });
                      }}
                    />
                  ) : (
                    <p
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-center"
                      }`}
                    >
                      {settings?.in_time}
                    </p>
                  )}
                </div>
                <div className="flex justify-between mb-3">
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-center"
                    }`}
                  >
                    {t("end_time")}
                  </p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      value={settings?.out_time}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          out_time: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-center"
                      }`}
                    >
                      {settings?.out_time}
                    </p>
                  )}
                </div>
                <div className="flex justify-between mb-3">
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-center"
                    }`}
                  >
                   {t("off_day")}
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      style={{ padding: "0 6px" }}
                      value={settings?.off_day}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          off_day: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-center"
                      }`}
                    >
                      {settings?.off_day}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div
                className={`${
                  !themeBgImg ? (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
                  : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                } p-4 shadow-sm rounded-xl`}
              >
                <div className="flex justify-between mb-3">
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-center"
                    }`}
                  >
                   {t("maximum_late_time")}
                  </p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      value={settings?.in_late_time}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          in_late_time: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-center"
                      }`}
                    >
                      {settings?.in_late_time}
                    </p>
                  )}
                </div>
                <div className="flex justify-between mb-3">
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-center"
                    }`}
                  >
                   {t("overtime_after")}
                  </p>
                  {isEditing ? (
                    <input
                      type="time"
                      style={{ padding: "0 6px" }}
                      value={settings?.out_late_time}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          out_late_time: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-center"
                      }`}
                    >
                      {settings?.out_late_time}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              {!isEditing ? (
                <Button
                  type="submit"
                  size="medium"
                  className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold mb-3"
                  style={{color: "#ffffff" }}
                  onClick={handleEditClick}
                >
                  {t("button_modify_settings")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="medium"
                  className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold mb-3"
                  style={{color: "#ffffff" }}
                  onClick={handleUpdateClick}
                >
                  {btnLoading ? (
                    <CircularProgress
                      size={23}
                      sx={{ color: "white" }}
                      className="text-white"
                    />
                  ) : (
                    <span>{t("btn_update_settings")}</span>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OfficeSettings;
