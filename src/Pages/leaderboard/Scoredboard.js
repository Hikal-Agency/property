import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../../Components/Loader";
import CombinationChart from "../../Components/charts/CombinationChart";
import CallsGraph from "../../Components/charts/CallsGraph";

const Scoreboard = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log("log:::: ", callLogs);

  const Manager = [
    {
      name: "Belal Hikal",
      target: "5000000",
      achieved: "5000000",
      teamDeals: "3",
      directDeals: "2",
    },
    {
      name: "Hossam Hassan",
      target: "5000000",
      achieved: "3000000",
      teamDeals: "0",
      directDeals: "1",
    },
    {
      name: "Nada Amin",
      target: "5000000",
      achieved: "2900000",
      teamDeals: "1",
      directDeals: "2",
    },
  ];

  const Agent = [
    {
      name: "Hassan Lodhi",
      target: "3000000",
      achieved: "3000000",
      totalClosed: "2",
    },
    {
      name: "Abdulrhman Makkawi",
      target: "3000000",
      achieved: "2567000",
      totalClosed: "5",
    },
    {
      name: "Ameer Ali",
      target: "3000000",
      achieved: "2500000",
      totalClosed: "2",
    },
    {
      name: "Hala Hikal",
      target: "3000000",
      achieved: "2000000",
      totalClosed: "2",
    },
    {
      name: "Zainab Ezzaldien",
      target: "3000000",
      achieved: "1900000",
      totalClosed: "1",
    },
  ];

  const FetchCallLogs = async (token, periods) => {
    setLoading(true);
    const callLogsData = {};

    try {
      const callLogsPromises = periods.map(async (period) => {
        const apiUrl = "callLogs?period=" + period;
        const call_logs = await axios.get(`${BACKEND_URL}/${apiUrl}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        return call_logs?.data?.call_logs;
      });

      const callLogsResults = await Promise.all(callLogsPromises);

      periods.forEach((period, index) => {
        callLogsData[period] = callLogsResults[index];
      });

      setCallLogs(callLogsData);

      console.log("Call logs: ", callLogsData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Call logs not fetched. ", error);
      toast.error("Unable to fetch call logs data.", {
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

    return callLogsData;
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchCallLogs(token, ["daily", "yearly"])
      .then((callLogsData) => {
        console.log(callLogsData.daily); // Call logs data for daily period
        console.log(callLogsData.yearly); // Call logs data for yearly period
      })
      .catch((error) => {
        console.log("Error in fetching call logs data: ", error);
      });
  }, []);

  return (
    <div>
      <ToastContainer />
      {loading ? (
        <Loader />
      ) : (
        <Box
          className="mt-1 p-5"
          sx={
            isLoading && {
              opacity: 0.3,
            }
          }
        >
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12">
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-black"
              } p-3 rounded-md`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold my-2 text-center`}
              >
                Daily Calls
              </div>
              <div className="grid  gap-4">
                <div className="rounded-md px-2 mb-2 w-full">
                  <div className="grid grid-cols-5 gap-3">
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.daily?.recieved}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Recieved&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.daily?.notanswered}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Not answered&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.daily?.missed}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Missed&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.daily?.dialed}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Dialed&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.daily?.answered}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Answered&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-black"
              } p-3 rounded-md`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold my-2 text-center`}
              >
                Total Calls
              </div>
              <div className="grid  gap-4">
                <div className="rounded-md px-2 mb-2 w-full">
                  <div className="grid grid-cols-5 gap-3">
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.yearly?.recieved}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Recieved&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.yearly?.notanswered}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Not answered&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.yearly?.missed}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Missed&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.yearly?.dialed}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Dialed&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } rounded-md p-2 w-full`}
                    >
                      <h6 className="text-center font-semibold">
                        {callLogs?.yearly?.answered}
                      </h6>

                      <div className="block gap-3 mt-2">
                        <div>
                          <h1 className="text-sm text-center">
                            Answered&nbsp;
                            {/* <span className="font-semibold text-main-red-color">
                    0
                  </span> */}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="justify-between items-center w-full">
              <h6 className="font-semibold">Performance</h6>
              <CallsGraph outgoing={callLogs?.yearly?.dialed} />
            </div>
          </div>
        </Box>
      )}
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Scoreboard;
