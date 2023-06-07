import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../../Components/Loader";

import CallsGraph from "../../Components/charts/CallsGraph";

const ClosedealsboardUpdated = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [callLogs, setCallLogs] = useState();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  console.log("log:::: ", callLogs);

  const [leaderboard, setLeaderboard] = useState();
  const [manager, setManagers] = useState();
  const [agents, setAgents] = useState();
  const [filteredAgent, setFilterAgent] = useState();
  const [active, setActive] = useState(false);
  const [count, setCount] = useState();

  console.log("Leaderboard here: ", leaderboard);
  console.log("Manager here: ", manager);
  console.log("Agents here: ", agents);
  const FetchLeaderboard = async (token) => {
    setLoading(true);
    let apiUrl =
      tabValue === 0
        ? "leaderboard"
        : tabValue === 1
        ? "leaderboard?last_month"
        : "leaderboard?current_month";
    try {
      const all_leaderboard = await axios.get(`${BACKEND_URL}/${apiUrl}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setLeaderboard(all_leaderboard?.data?.user);

      const leaderboard = all_leaderboard?.data?.user;

      //   const get_managers = leaderboard?.filter(
      //     (manager) => manager?.role === 3
      //   );
      //   setManagers(get_managers);

      //   const get_agents = leaderboard?.filter((agent) => agent?.role === 7);
      //   setAgents(get_agents);

      const leadCount = leaderboard.reduce(
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

      const { agents = [], managers = [] } = leaderboard.reduce(
        (acc, cur) => ({
          agents: [...acc.agents, ...(cur.role === 7 ? [cur] : [])],
          managers: [...acc.managers, ...(cur.role === 3 ? [cur] : [])],
        }),
        { agents: [], managers: [] }
      );

      setAgents(agents);
      setManagers(managers);

      setLoading(false);

      //   console.log("total deals & sales: ", { total_sales, total_closed_deals });
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
                    {manager?.map((item, index) => (
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
                      >
                        <div className="flex items-center">
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
                    ))}
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
                    {active === false
                      ? agents?.map((item, index) => (
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
                      : filteredAgent?.map((item, index) => (
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
                              <img
                                src=""
                                alt="User Image"
                                className="w-16 h-16 rounded-full mr-4"
                              />

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
                        ))}
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
