import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../axoisConfig";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../../Components/Loader";

import CallsGraph from "../../Components/charts/CallsGraph";

const ClosedealsboardUpdated = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState();
  const [noData, setNoData] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
      {
        color: currentMode === "dark" ? "white !important" : "black !important",
        fontSize: "0.9rem",
        fontWeight: "500",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor:
        currentMode === "dark" ? "white !important" : "black !important",
    },
    "& .MuiFormLabel-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
  };

  console.log("log:::: ", callLogs);

  const [leaderboard, setLeaderboard] = useState();
  const [manager, setManagers] = useState();
  const [agents, setAgents] = useState();
  const [filteredAgent, setFilterAgent] = useState();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState();
  const [period, setPeriod] = useState();

  console.log("Leaderboard here: ", leaderboard);
  console.log("Manager here: ", manager);
  console.log("Agents here: ", agents);

  const handlePeriod = (e) => {
    console.log(e.target.value);
    setPeriod(e.target.value);
    // FetchLeaderboard();
  };
  // const FetchLeaderboard = async (token) => {
  //   setLoading(true);
  //   let apiUrl = period ? `leaderboard?${period}` : "leaderboard";

  //   try {
  //     const all_leaderboard = await axios.get(`${BACKEND_URL}/${apiUrl}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     });

  //     const leaderboard = all_leaderboard?.data?.user;

  //     const sortedLeaderboard = leaderboard.sort((a, b) => {
  //       return b.total_sales - a.total_sales;
  //     });

  //     setLeaderboard(sortedLeaderboard);

  //     const leadCount = sortedLeaderboard.reduce(
  //       (acc, cur) => {
  //         if (cur.total_sales) {
  //           acc.total_sales += Number(cur.total_sales);
  //         }
  //         if (cur.total_closed_deals) {
  //           acc.total_closed_deals += cur.total_closed_deals;
  //         }
  //         return acc;
  //       },
  //       { total_sales: 0, total_closed_deals: 0 }
  //     );

  //     setCount(leadCount);

  //     const { agents = [], managers = [] } = sortedLeaderboard.reduce(
  //       (acc, cur) => ({
  //         agents: [...acc.agents, ...(cur.role === 7 ? [cur] : [])],
  //         managers: [...acc.managers, ...(cur.role === 3 ? [cur] : [])],
  //       }),
  //       { agents: [], managers: [] }
  //     );

  //     setAgents(agents);
  //     setManagers(managers);

  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log("Leaderboard not fetched. ", error);
  //     toast.error("Unable to fetch leaderboard data.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };

  const FetchLeaderboard = async (token) => {
    setLoading(true);
    let apiUrl = period ? `leaderboard?${period}` : "leaderboard";

    try {
      let apiUrl =
        tabValue === 0
          ? "leaderboard"
          : tabValue === 1
          ? "leaderboard?period=last_month"
          : "leaderboard?period=current_month";
      const all_leaderboard = await axios.get(`${BACKEND_URL}/${apiUrl}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const leaderboard = all_leaderboard?.data?.user;

      const sortedLeaderboard = leaderboard.sort((a, b) => {
        return b.total_sales - a.total_sales;
      });

      setLeaderboard(sortedLeaderboard);

      const leadCount = sortedLeaderboard.reduce(
        (acc, cur) => {
          if (cur.total_sales) {
            acc.total_sales += Number(cur.total_sales);
          }
          if (cur.total_closed_deals) {
            acc.total_closed_deals += cur.total_closed_deals;
          }
          return acc;
        },
        { total_sales: 0, total_closed_deals: 0 }
      );

      setCount(leadCount);

      const { agents = [], managers = [] } = sortedLeaderboard.reduce(
        (acc, cur) => ({
          agents: [...acc.agents, ...(cur.role === 7 ? [cur] : [])],
          managers: [...acc.managers, ...(cur.role === 3 ? [cur] : [])],
        }),
        { agents: [], managers: [] }
      );

      const filteredAgents = agents.filter(
        (agent) => agent.total_sales > 0 && agent.total_closed_deals > 0
      );
      const filteredManagers = managers.filter(
        (manager) => manager.total_sales > 0 && manager.total_closed_deals > 0
      );

      setAgents(filteredAgents);
      setManagers(filteredManagers);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Leaderboard not fetched. ", error);
      toast.error("Unable to fetch leaderboard data.", {
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

  console.log("acitve: ", active);

  const handleClick = async (id, e) => {
    e.preventDefault();
    setActive((prevActive) => (prevActive === id ? false : id));

    console.log("managerid: ", id);

    const filteredAgents = agents?.filter((agent) => agent.isParent === id);

    console.log("filteredagent: ", filteredAgents);

    setFilterAgent(filteredAgents);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeaderboard(token);
  }, [period]);

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
          <div className="mb-3">
            <Box sx={darkModeColors} className="font-semibold">
              <Tabs value={tabValue} onChange={handleChange} variant="standard">
                <Tab label="All TIME" />
                <Tab label="LAST MONTH" />
                <Tab label="THIS MONTH" />
              </Tabs>
            </Box>
            {/* <Box sx={SelectStyles}>
              <FormControl fullWidth>
                <TextField
                  id="demo-simple-select"
                  value={period}
                  label="Select a time period"
                  onChange={handlePeriod}
                  displayEmtpy
                  select
                  variant="standard"
                >
                  <MenuItem value="last_month">Last Month</MenuItem>
                  <MenuItem value="current_month">Current Month</MenuItem>
                  <MenuItem value="">All time</MenuItem>
                </TextField>
              </FormControl>
            </Box> */}
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3 ">
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-black"
              } p-3 rounded-md h-[450px] overflow-auto`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold my-2 text-center`}
              >
                Manager
              </div>
              <div className="grid  gap-4">
                <div className="rounded-md px-2 mb-2 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
                    {manager?.length > 0 ? (
                      manager?.map((item, index) => (
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } ${
                            active === item?.id ? "border border-red-500" : ""
                          } rounded-md p-2 w-full`}
                          onClick={(e) => handleClick(item?.id, e)}
                          key={index}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center">
                            {/* User Image */}
                            {item?.profile_picture ? (
                              <img
                                src={item?.profile_picture}
                                alt="User Image"
                                className="w-16 h-16 rounded-full mr-4"
                              />
                            ) : (
                              <img
                                src="/favicon.png"
                                alt="User Image"
                                className="w-16 h-16 rounded-full mr-4"
                              />
                            )}

                            {/* User Details */}
                            <div>
                              <h2 className="text-xl font-bold">
                                {item?.userName}
                              </h2>
                              {item?.total_closed_deals > 0 && (
                                <p className="text-gray-500">
                                  Deals Closed:{" "}
                                  <span className="text-red-600">
                                    {item?.total_closed_deals}
                                  </span>
                                </p>
                              )}
                              {item?.total_closed_deals > 0 &&
                                item?.total_closed_deals !== null && (
                                  <p className="text-gray-500">
                                    Total Sales:{" "}
                                    <span className="text-red-600">
                                      {item?.total_sales}
                                    </span>
                                  </p>
                                )}
                              {/* Additional user details */}
                              {/* ... */}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <h2
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-red"
                          } text-center`}
                        >
                          No data found
                        </h2>
                        <img src="./no_data.png" alt="No data Illustration" />
                      </>
                    )}
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
              } p-3 rounded-md h-[450px] overflow-auto`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold my-2 text-center`}
              >
                Agent
              </div>
              <div className="grid  gap-4">
                <div className="rounded-md px-2 mb-2 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-4">
                    {active === false ? (
                      agents?.length > 0 ? (
                        agents?.map((item, index) => (
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            } rounded-md p-2 w-full`}
                            key={index}
                          >
                            <div className="flex items-start">
                              {/* User Image */}
                              {item?.img ? (
                                <img
                                  src={item?.img}
                                  alt="User Image"
                                  className="w-16 h-16 rounded-full mr-4"
                                />
                              ) : (
                                <img
                                  src="/favicon.png"
                                  alt="User Image"
                                  className="w-16 h-16 rounded-full mr-4"
                                />
                              )}

                              {/* User Details */}

                              <div>
                                <h2 className="text-xl font-bold">
                                  {item?.userName}
                                </h2>
                                <p className="text-gray-500">
                                  Deals Closed:{" "}
                                  <span className="text-red-600">
                                    {item?.total_closed_deals}
                                  </span>
                                </p>
                                <p className="text-gray-500">
                                  Total Sales:{" "}
                                  <span className="text-red-600">
                                    {item?.total_sales || 0} AED
                                  </span>
                                </p>
                                {/* Additional user details */}
                                {/* ... */}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <h2
                          className={`${
                            currentMode === "dark" ? "text-white" : "text-red"
                          } text-center`}
                        >
                          No data found
                        </h2>
                      )
                    ) : (
                      filteredAgent?.map((item, index) => (
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } rounded-md p-2 w-full`}
                          key={index}
                        >
                          <div className="flex items-start">
                            {/* User Image */}
                            {item?.img ? (
                              <img
                                src={item?.img}
                                alt="User Image"
                                className="w-16 h-16 rounded-full mr-4"
                              />
                            ) : (
                              <img
                                src="/favicon.png"
                                alt="User Image"
                                className="w-16 h-16 rounded-full mr-4"
                              />
                            )}

                            {/* User Details */}
                            <div>
                              <h2 className="text-xl font-bold">
                                {item?.userName}
                              </h2>
                              <p className="text-gray-500">
                                Deals Closed:{" "}
                                <span className="text-red-600">
                                  {item?.total_closed_deals}
                                </span>
                              </p>
                              <p className="text-gray-500">
                                Total Sales:{" "}
                                <span className="text-red-600">
                                  {item?.total_sales || 0} AED
                                </span>
                              </p>
                              {/* Additional user details */}
                              {/* ... */}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      )}
    </div>
  );
};

export default ClosedealsboardUpdated;
