import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Components/Loader";

const TargetBoard = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState();
  const [manager, setManagers] = useState();
  const [agents, setAgents] = useState();
  const [count, setCount] = useState();

  console.log("Leaderboard here: ", leaderboard);
  console.log("Manager here: ", manager);
  console.log("Agents here: ", agents);
  const FetchLeaderboard = async (token) => {
    setLoading(true);
    let apiUrl =
      tabValue === 0
        ? "leaderboard?period=last_month"
        : tabValue === 1
        ? "leaderboard?period=last_month"
        : "leaderboard?period=current_month";
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

      // const leadCount = leaderboard.reduce(
      //   (acc, cur) => {
      //     if (cur.total_sales) {
      //       acc.total_sales += Number(cur.total_sales);
      //     }
      //     if (cur.total_closed_deals) {
      //       acc.total_closed_deals += cur.total_closed_deals;
      //     }
      //     return acc;
      //   },
      //   { total_sales: 0, total_closed_deals: 0 }
      // );

      // setCount(leadCount);

      const { agents = [], managers = [] } = leaderboard.reduce(
        (acc, cur) => ({
          agents: [...acc.agents, ...(cur.role === 7 ? [cur] : [])],
          managers: [...acc.managers, ...(cur.role === 3 ? [cur] : [])],
        }),
        { agents: [], managers: [] }
      );

      const filteredAgents = agents.filter(
        (agent) => agent.total_sales > 0 && agent.target > 0
      );
      const filteredManagers = managers.filter(
        (manager) => manager.total_sales > 0 && manager.target > 0
      );

      setAgents(filteredAgents);
      setManagers(filteredManagers);

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

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeaderboard(token);
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  return (
    <div>
      <ToastContainer />
      <Box sx={darkModeColors} className="font-semibold">
        <Tabs value={tabValue} onChange={handleChange} variant="standard">
          <Tab label="THIS MONTH" />
          <Tab label="LAST MONTH" />
        </Tabs>
      </Box>
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
          {/* THIS_MONTH */}
          <TabPanel
            value={tabValue}
            index={0}
            className="h-[100px] overflow-y-scroll"
          >
            <div className="mb-10 mx-3">
              {/* <h1
            className={`${
              currentMode === "dark" ? "text-white" : "text-dark"
            }  font-semibold text-center`}
          >
            <span className="font-bold">{count?.total_closed_deals}</span>
            &nbsp;&nbsp;Closed Deals of&nbsp;
            <span className="font-bold">AED {count?.total_sales}</span>
          </h1> */}
            </div>
            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              <div
                className={`${
                  currentMode === "dark" ? "text-red-600" : "text-red-500"
                } text-xl font-bold`}
              >
                Sales Manager
              </div>
              <div className="h-[300px] overflow-y-scroll">
                {manager?.length > 0 ? (
                  manager?.map((item, index) => {
                    let totalSales = item.total_sales
                      ? parseInt(item.total_sales)
                      : 0;
                    let target = item.target ? parseInt(item.target) : 0;
                    let percentageSales = (totalSales / target) * 100;
                    percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100
                    const barWidth = `${percentageSales}%`;
                    const barColor =
                      percentageSales >= 50 ? "bg-red-500" : "bg-gray-800";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                      >
                        <div className="col-span-2">
                          <h4 className="font-bold my-1">{item?.userName}</h4>
                        </div>
                        <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                          <div className="relative flex-1">
                            <div
                              className={`absolute left-0 top-0 h-5 ${barColor}`}
                              style={{ width: barWidth }}
                            ></div>
                            <div
                              className={`p-x-2 h-5 font-semibold text-xs flex justify-center items-center px-5 relative z-10 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-dark-600"
                              }`}
                            >
                              {/* Total Closed Deals: {item?.total_closed_deals} /
                          Direct deals:{" "}
                          <span
                            className={
                              currentMode === "dark"
                                ? "text-white"
                                : "text-dark-600"
                            }
                          >
                            {item?.total_sales || 0}
                          </span> */}
                              {percentageSales?.toFixed(2)}% of target achieved
                            </div>
                          </div>
                          {item?.profile_picture ? (
                            <img
                              src={item?.profile_picture}
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          ) : (
                            <img
                              src="./favicon.png"
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          )}
                        </div>
                        <div></div>
                      </div>
                    );
                  })
                ) : (
                  <h2>No data for this month.</h2>
                )}
              </div>
            </div>

            <hr
              className="mb-3"
              style={{
                color: currentMode === "dark" ? "#ffffff" : "#000000",
                height: "5px !important",
              }}
            />

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                Sales Agent
              </div>
              <div className="h-[300px] overflow-y-scroll">
                {agents?.length > 0 ? (
                  agents?.map((item, index) => {
                    let totalSales = item.total_sales
                      ? parseInt(item.total_sales)
                      : 0;
                    let target = item.target ? parseInt(item.target) : 0;
                    let percentageSales = (totalSales / target) * 100;
                    percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100
                    const barWidth = `${percentageSales}%`;
                    const barColor =
                      percentageSales >= 50 ? "bg-red-500" : "bg-gray-800";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                      >
                        <div className="col-span-2">
                          <h4 className="font-bold my-1">{item?.userName}</h4>
                        </div>
                        <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                          <div className="relative flex-1">
                            <div
                              className={`absolute left-0 top-0 h-5 ${barColor}`}
                              style={{ width: barWidth }}
                            ></div>
                            <div
                              className={`p-x-2 h-5 font-semibold text-xs flex justify-center items-center px-5 relative z-10 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-dark-600"
                              }`}
                            >
                              {/* Total Closed Deals: {item?.total_closed_deals} /
                          Direct deals:{" "}
                          <span
                            className={
                              currentMode === "dark"
                                ? "text-white"
                                : "text-dark-600"
                            }
                          >
                            {item?.total_sales || 0}
                          </span> */}
                              {percentageSales?.toFixed(2)}% of target achieved
                            </div>
                          </div>
                          {item?.profile_picture ? (
                            <img
                              src={item?.profile_picture}
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          ) : (
                            <img
                              src="./favicon.png"
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          )}
                        </div>
                        <div></div>
                      </div>
                    );
                  })
                ) : (
                  <h2>No data for this month.</h2>
                )}
              </div>
            </div>
          </TabPanel>

          {/* LAST_MONTH */}
          <TabPanel
            value={tabValue}
            index={1}
            className="h-[100px] overflow-y-scroll"
          >
            <div className="mb-10 mx-3">
              {/* <h1
            className={`${
              currentMode === "dark" ? "text-white" : "text-dark"
            }  font-semibold text-center`}
          >
            <span className="font-bold">{count?.total_closed_deals}</span>
            &nbsp;&nbsp;Closed Deals of&nbsp;
            <span className="font-bold">AED {count?.total_sales}</span>
          </h1> */}
            </div>
            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              <div
                className={`${
                  currentMode === "dark" ? "text-red-600" : "text-red-500"
                } text-xl font-bold`}
              >
                Sales Manager
              </div>
              <div className="h-[300px] overflow-y-scroll">
                {manager?.length > 0 ? (
                  manager?.map((item, index) => {
                    let totalSales = item.total_sales
                      ? parseInt(item.total_sales)
                      : 0;
                    let target = item.target ? parseInt(item.target) : 0;
                    let percentageSales = (totalSales / target) * 100;
                    percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100
                    const barWidth = `${percentageSales}%`;
                    const barColor =
                      percentageSales >= 50 ? "bg-red-500" : "bg-gray-800";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                      >
                        <div className="col-span-2">
                          <h4 className="font-bold my-1">{item?.userName}</h4>
                        </div>
                        <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                          <div className="relative flex-1">
                            <div
                              className={`absolute left-0 top-0 h-5 ${barColor}`}
                              style={{ width: barWidth }}
                            ></div>
                            <div
                              className={`p-x-2 h-5 font-semibold text-xs flex justify-center items-center px-5 relative z-10 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-dark-600"
                              }`}
                            >
                              {/* Total Closed Deals: {item?.total_closed_deals} /
                          Direct deals:{" "}
                          <span
                            className={
                              currentMode === "dark"
                                ? "text-white"
                                : "text-dark-600"
                            }
                          >
                            {item?.total_sales || 0}
                          </span> */}
                              {percentageSales?.toFixed(2)}% of target achieved
                            </div>
                          </div>
                          {item?.profile_picture ? (
                            <img
                              src={item?.profile_picture}
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          ) : (
                            <img
                              src="./favicon.png"
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          )}
                        </div>
                        <div></div>
                      </div>
                    );
                  })
                ) : (
                  <h2>No data for this month.</h2>
                )}
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                Sales Agent
              </div>
              <div className="h-[300px] overflow-y-scroll">
                {agents?.length > 0 ? (
                  agents?.map((item, index) => {
                    let totalSales = item.total_sales
                      ? parseInt(item.total_sales)
                      : 0;
                    let target = item.target ? parseInt(item.target) : 0;
                    let percentageSales = (totalSales / target) * 100;
                    percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100
                    const barWidth = `${percentageSales}%`;
                    const barColor =
                      percentageSales >= 50 ? "bg-red-500" : "bg-gray-800";

                    return (
                      <div
                        key={index}
                        className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                      >
                        <div className="col-span-2">
                          <h4 className="font-bold my-1">{item?.userName}</h4>
                        </div>
                        <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                          <div className="relative flex-1">
                            <div
                              className={`absolute left-0 top-0 h-5 ${barColor}`}
                              style={{ width: barWidth }}
                            ></div>
                            <div
                              className={`p-x-2 h-5 font-semibold text-xs flex justify-center items-center px-5 relative z-10 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-dark-600"
                              }`}
                            >
                              {/* Total Closed Deals: {item?.total_closed_deals} /
                          Direct deals:{" "}
                          <span
                            className={
                              currentMode === "dark"
                                ? "text-white"
                                : "text-dark-600"
                            }
                          >
                            {item?.total_sales || 0}
                          </span> */}
                              {percentageSales?.toFixed(2)}% of target achieved
                            </div>
                          </div>
                          {item?.profile_picture ? (
                            <img
                              src={item?.profile_picture}
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          ) : (
                            <img
                              src="./favicon.png"
                              height={50}
                              width={50}
                              className="rounded-full cursor-pointer"
                              alt=""
                            />
                          )}
                        </div>
                        <div></div>
                      </div>
                    );
                  })
                ) : (
                  <h2>No data for this month.</h2>
                )}
              </div>
            </div>
          </TabPanel>
        </Box>
      )}
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default TargetBoard;
