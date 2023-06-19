import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import Loader from "../../Components/Loader";

const CallLogBoard = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();
  const [callLogs, setCallLogs] = useState();
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const FetchCallLogs = async (token) => {
    setLoading(true);
    let period;
    switch (tabValue) {
      case 0:
        period = "daily";
        break;
      case 1:
        period = "monthly";
        break;
      case 2:
        period = "yearly";
        break;
      default:
        period = "daily";
        break;
    }

    const apiUrl = "all-user-calls?period=" + period;

    try {
      const call_logs = await axios.get(`${BACKEND_URL}/${apiUrl}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setCallLogs(call_logs?.data?.call_logs);

      if (call_logs?.data?.call_logs.length === 0) {
        setNoData(true);
        setLoading(false);
        return;
      }

      console.log("Call logs: ", call_logs);
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
  };

  const calldata = [
    {
      userImage: "",
      userName: "Hala Hikal",
      outgoing_calls: 303,
      out_answered_calls: 209,
      out_notanswered_calls: 89,
      out_rejected_calls: 5,
      incoming_calls: 35,
      in_answered_calls: 35,
      in_missed_calls: 0,
    },
    {
      userImage: "",
      userName: "Ameer Ali",
      outgoing_calls: 203,
      out_answered_calls: 109,
      out_notanswered_calls: 89,
      out_rejected_calls: 5,
      incoming_calls: 35,
      in_answered_calls: 30,
      in_missed_calls: 5,
    },
    {
      userImage: "",
      userName: "Hassan Lodhi",
      outgoing_calls: 303,
      out_answered_calls: 209,
      out_notanswered_calls: 89,
      out_rejected_calls: 5,
      incoming_calls: 35,
      in_answered_calls: 35,
      in_missed_calls: 0,
    },
    {
      userImage: "",
      userName: "Rahul TR",
      outgoing_calls: 203,
      out_answered_calls: 109,
      out_notanswered_calls: 89,
      out_rejected_calls: 5,
      incoming_calls: 35,
      in_answered_calls: 30,
      in_missed_calls: 5,
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchCallLogs(token);
  }, []);

  return (
    <div>
      <ToastContainer />
      <Box sx={darkModeColors} className="font-semibold">
        <Tabs value={tabValue} onChange={handleChange} variant="standard">
          <Tab label="DAILY" />
          <Tab label="MONTYLY" />
          <Tab label="YEARLY" />
          {/* <Tab label="LAST MONTH" /> */}
        </Tabs>
      </Box>
      <Box
        className="mt-1 p-5"
        sx={
          isLoading && {
            opacity: 0.3,
          }
        }
      >
        {/* TODAY */}
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-3 ">
                {!noData &&
                  callLogs?.length > 0 &&
                  callLogs?.map((call, index) => {
                    return (
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md`}
                      >
                        <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                          <h5 className="font-bold text-main-red-color col-span-5">
                            {call?.userName}
                          </h5>
                        </div>
                        <div className="grid gap-3">
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2`}
                          >
                            <h6 className="text-center text-xs font-semibold">
                              Outgoing
                            </h6>
                            <hr></hr>
                            <div className="block gap-3 mt-2">
                              <div>
                                <h1 className="text-sm">
                                  All Calls&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.all_calls || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  ANSWERED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.answered || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  NOT ANSWERED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.notanswered || 0}
                                  </span>
                                </h1>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2`}
                          >
                            <h6 className="text-center text-xs font-semibold">
                              Incoming
                            </h6>
                            <hr></hr>
                            <div className="block gap-3 mt-2">
                              <div>
                                <h1 className="text-sm">
                                  RECEIVED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call.received || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  MISSED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call.missed || 0}
                                  </span>
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {/* <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black"
                } p-3 rounded-md`}
              >
                <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                  <h5 className="font-bold text-main-red-color col-span-5">
                    {calldata.userName}
                  </h5>
                </div>
                <div className="grid gap-3">
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Outgoing
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          DIALED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.dialed}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          NOT ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.notanswered}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.answered}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Incoming
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          RECEIVED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.recieved}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          MISSED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.missed}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              </div>
              {noData && (
                <div className="flex flex-col items-center justify-center h-screen ">
                  <h1
                    className={
                      currentMode === "dark" ? "text-white" : "text-black"
                    }
                  >
                    No data available.
                  </h1>
                  <img
                    src="./no_data.png"
                    alt="No data Illustration"
                    className="w-[600px] h-[600px] object-cover"
                  />
                </div>
              )}
            </>
          )}
        </TabPanel>

        {/* YESTERDAY  */}
        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-3">
                {!noData &&
                  callLogs?.length > 0 &&
                  callLogs?.map((call, index) => {
                    return (
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md`}
                      >
                        <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                          <h5 className="font-bold text-main-red-color col-span-5">
                            {call?.userName}
                          </h5>
                        </div>
                        <div className="grid gap-3">
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2`}
                          >
                            <h6 className="text-center text-xs font-semibold">
                              Outgoing
                            </h6>
                            <hr></hr>
                            <div className="block gap-3 mt-2">
                              <div>
                                <h1 className="text-sm">
                                  All Calls&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.all_calls || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  ANSWERED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.answered || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  NOT ANSWERED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.notanswered || 0}
                                  </span>
                                </h1>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2`}
                          >
                            <h6 className="text-center text-xs font-semibold">
                              Incoming
                            </h6>
                            <hr></hr>
                            <div className="block gap-3 mt-2">
                              <div>
                                <h1 className="text-sm">
                                  RECEIVED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call.received || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  MISSED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call.missed || 0}
                                  </span>
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {/* <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black"
                } p-3 rounded-md`}
              >
                <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                  <h5 className="font-bold text-main-red-color col-span-5">
                    {calldata.userName}
                  </h5>
                </div>
                <div className="grid gap-3">
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Outgoing
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          DIALED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.dialed}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          NOT ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.notanswered}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.answered}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Incoming
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          RECEIVED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.recieved}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          MISSED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.missed}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              </div>
              {noData && (
                <div className="flex flex-col items-center justify-center h-screen ">
                  <h1
                    className={
                      currentMode === "dark" ? "text-white" : "text-black"
                    }
                  >
                    No data available.
                  </h1>
                  <img
                    src="./no_data.png"
                    alt="No data Illustration"
                    className="w-[600px] h-[600px] object-cover"
                  />
                </div>
              )}
            </>
          )}
        </TabPanel>

        {/* THIS MONTH  */}
        <TabPanel value={tabValue} index={2}>
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-3">
                {!noData &&
                  callLogs?.length > 0 &&
                  callLogs?.map((call, index) => {
                    return (
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "bg-gray-900 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-md`}
                      >
                        <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                          <h5 className="font-bold text-main-red-color col-span-5">
                            {call?.userName}
                          </h5>
                        </div>
                        <div className="grid gap-3">
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2`}
                          >
                            <h6 className="text-center text-xs font-semibold">
                              Outgoing
                            </h6>
                            <hr></hr>
                            <div className="block gap-3 mt-2">
                              <div>
                                <h1 className="text-sm">
                                  All Calls&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.all_calls || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  ANSWERED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.answered || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  NOT ANSWERED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call?.notanswered || 0}
                                  </span>
                                </h1>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2`}
                          >
                            <h6 className="text-center text-xs font-semibold">
                              Incoming
                            </h6>
                            <hr></hr>
                            <div className="block gap-3 mt-2">
                              <div>
                                <h1 className="text-sm">
                                  RECEIVED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call.received || 0}
                                  </span>
                                </h1>
                              </div>
                              <div>
                                <h1 className="text-sm">
                                  MISSED&nbsp;
                                  <span className="font-semibold text-main-red-color float-right">
                                    {call.missed || 0}
                                  </span>
                                </h1>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {/* <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black"
                } p-3 rounded-md`}
              >
                <div className="grid grid-cols-6 gap-3 rounded-md px-2 mb-2">
                  <h5 className="font-bold text-main-red-color col-span-5">
                    {calldata.userName}
                  </h5>
                </div>
                <div className="grid gap-3">
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Outgoing
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          DIALED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.dialed}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          NOT ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.notanswered}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          ANSWERED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.answered}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    } rounded-md p-2`}
                  >
                    <h6 className="text-center text-xs font-semibold">
                      Incoming
                    </h6>
                    <hr></hr>
                    <div className="block gap-3 mt-2">
                      <div>
                        <h1 className="text-sm">
                          RECEIVED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.recieved}
                          </span>
                        </h1>
                      </div>
                      <div>
                        <h1 className="text-sm">
                          MISSED&nbsp;
                          <span className="font-semibold text-main-red-color float-right">
                            {callLogs?.missed}
                          </span>
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              </div>
              {noData && (
                <div className="flex flex-col items-center justify-center h-screen ">
                  <h1
                    className={
                      currentMode === "dark" ? "text-white" : "text-black"
                    }
                  >
                    No data available.
                  </h1>
                  <img
                    src="./no_data.png"
                    alt="No data Illustration"
                    className="w-[600px] h-[600px] object-cover"
                  />
                </div>
              )}
            </>
          )}
        </TabPanel>
      </Box>
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default CallLogBoard;
