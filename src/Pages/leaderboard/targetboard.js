import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

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
      <Box
        className="mt-1 p-5"
        sx={
          isLoading && {
            opacity: 0.3,
          }
        }
      >
        {/* THIS_MONTH */}
        <TabPanel value={tabValue} index={0}>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12">
            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                MANAGER
              </div>
              <div>
                {Manager?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* AGENT  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                AGENT
              </div>
              <div>
                {Agent.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabPanel>

        {/* LAST_MONTH */}
        <TabPanel value={tabValue} index={1}>
          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-12">
            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* MANAGER  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                MANAGER
              </div>
              <div>
                {Manager.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } p-3 rounded-md`}
            >
              {/* AGENT  */}
              <div
                className={`${
                  currentMode === "dark"
                    ? "text-red-600"
                    : "text-main-red-color"
                } text-xl font-bold`}
              >
                AGENT
              </div>
              <div>
                {Agent.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-x-5 gap-y-2 rounded-md my-3 content-center align-center items-center"
                    >
                      <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3 xl:col-span-2 2xl:col-span-1 flex items-center">
                        <img
                          src="/favicon.png"
                          height={"100%"}
                          width={"100%"}
                          className="rounded-full cursor-pointer"
                          alt=""
                        />
                      </div>
                      <div className="col-span-10 sm:col-span-10 md:col-span-10 lg:col-span-9 xl:col-span-10 2xl:col-span-11 flex gap-x-3 align-center content-center items-center">
                        {item.achieved >= item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <span
                              className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </span>
                          </div>
                        ) : item.achieved < item.target ? (
                          <div className="w-full">
                            <h4 className="font-bold my-1 mx-2">{item.name}</h4>
                            <div
                              style={{
                                width: `${
                                  (item.achieved / item.target) * 100
                                }%`,
                              }}
                              className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                            >
                              {((item.achieved / item.target) * 100).toFixed(2)}
                              %
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </TabPanel>
      </Box>
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default TargetBoard;
