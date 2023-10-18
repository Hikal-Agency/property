import React, { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";
import ProgressBar from "../../Components/_elements/Progressbar";

const TargetBoard = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL, primaryColor, themeBgImg, t} = useStateContext();

  const [noData, setNoData] = useState(false);

  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState();
  const [manager, setManagers] = useState();
  const [agents, setAgents] = useState();

  console.log("Leaderboard here: ", leaderboard);
  console.log("Manager here: ", manager);
  console.log("Agents here: ", agents);
  const FetchLeaderboard = async (token) => {
    setLoading(true);
    let apiUrl =
      tabValue === 0
        ? "leaderboard?current_month"
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

      if (all_leaderboard?.data?.user.length == 0) {
        setNoData(true);
        setLoading(false);
        return;
      }

      const leaderboard = all_leaderboard?.data?.user;

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
    console.log("tabvaleu: ", tabValue);
  }, []);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Box sx={darkModeColors} className="font-semibold">
        <Tabs value={tabValue} onChange={handleChange} variant="standard">
          <Tab label={t("this_month")} />
          <Tab label={t("last_month")} />
        </Tabs>
      </Box>
      {loading ? (
        <Loader />
      ) : (
        <Box 
          className="mb-3 font-semibold"
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
            className=""
          >
            <div className={` ${currentMode === "dark" ? "text-white" : "text-black"}
              grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3`} >
              <div className={`p-1 rounded-md h-fit overflow-auto hide-scrollbar`}
              >
                {/* MANAGER  */}
                <div
                  className={`text-lg font-bold text-center uppercase`}
                >
                  {t("label_sales_manager")}
                </div>
                {/*  */}
                <div className="grid gap-4 p-3">
                  {!noData && manager?.length > 0
                    ? manager?.map((item, index) => {
                        let totalSales = item.total_sales
                          ? parseInt(item.total_sales)
                          : 0;
                        let target = item.target ? parseInt(item.target) : 0;
                        let percentageSales = (totalSales / target) * 100;
                        percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100

                        return (
                          <div
                            key={index}
                            className={` ${
                              !themeBgImg 
                              ? (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]") 
                              : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                            }
                            rounded-lg shadow-sm card-hover p-4 `}
                          >
                            <div className="flex items-center gap-3 h-full w-full ">
                              {item?.profile_picture ? (
                                <img
                                  src={item?.profile_picture}
                                  height={50}
                                  width={50}
                                  className="rounded-lg cursor-pointer"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src="./favicon.png"
                                  height={50}
                                  width={50}
                                  className="rounded-lg cursor-pointer"
                                  alt=""
                                />
                              )}
                              <div className="flex flex-col h-full w-full justify-between">
                                <h4 className="font-semibold uppercase my-1">{item?.userName}</h4>
                                <ProgressBar
                                  bgcolor={primaryColor}
                                  height="20px"
                                  progress={(
                                    (totalSales / target) *
                                    100
                                  ).toFixed(1)}
                                  progresswidth={
                                    totalSales >= target
                                      ? 100.0
                                      : (totalSales / target) *
                                        100
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                  {noData && (
                    <div className="flex justify-center">
                      <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-1 rounded-md h-fit overflow-auto hide-scrollbar`} >
                {/* AGENT  */}
                <div className={`text-lg font-bold text-center uppercase`} >
                  {t("label_sales_agent")}
                </div>
                <div className="grid gap-4 p-3">
                  {!noData && agents?.length > 0
                    ? agents?.map((item, index) => {
                      let totalSales = item.total_sales
                        ? parseInt(item.total_sales)
                        : 0;
                      let target = item.target ? parseInt(item.target) : 0;
                      let percentageSales = (totalSales / target) * 100;
                      percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100

                      return (
                        <div
                          key={index}
                          className={` ${
                            !themeBgImg 
                              ? (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]") 
                              : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                          }
                          rounded-lg shadow-sm card-hover p-4 `}
                        >
                          <div className="flex items-center gap-3 h-full w-full ">
                            {item?.profile_picture ? (
                              <img
                                src={item?.profile_picture}
                                height={50}
                                width={50}
                                className="rounded-lg cursor-pointer"
                                alt=""
                              />
                            ) : (
                              <img
                                src="./favicon.png"
                                height={50}
                                width={50}
                                className="rounded-lg cursor-pointer"
                                alt=""
                              />
                            )}
                            <div className="flex flex-col h-full w-full justify-between">
                              <h4 className="font-semibold uppercase my-1">{item?.userName}</h4>
                              <ProgressBar
                                bgcolor={primaryColor}
                                height="20px"
                                progress={(
                                  (totalSales / target) *
                                  100
                                ).toFixed(1)}
                                progresswidth={
                                  totalSales >= target
                                    ? 100.0
                                    : (totalSales / target) *
                                      100
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="flex justify-center">
                        <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </TabPanel>

          {/* LAST_MONTH */}
          <TabPanel
            value={tabValue}
            index={1}
            className=""
          >
            <div className={` ${currentMode === "dark" ? "text-white" : "text-black"}
              grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3`} >
              <div className={`p-1 rounded-md h-fit overflow-auto hide-scrollbar`}
              >
                {/* MANAGER  */}
                <div
                  className={`text-lg font-bold text-center uppercase`}
                >
      {t("label_sales_manager")}
                </div>
                {/*  */}
                <div className="grid gap-4 p-3">
                  {!noData && manager?.length > 0
                    ? manager?.map((item, index) => {
                        let totalSales = item.total_sales
                          ? parseInt(item.total_sales)
                          : 0;
                        let target = item.target ? parseInt(item.target) : 0;
                        let percentageSales = (totalSales / target) * 100;
                        percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100

                        return (
                          <div
                            key={index}
                            className={` ${
                              !themeBgImg 
                              ? (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]") 
                              : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                            }
                            rounded-lg shadow-sm card-hover p-4 `}
                          >
                            <div className="flex items-center gap-3 h-full w-full ">
                              {item?.profile_picture ? (
                                <img
                                  src={item?.profile_picture}
                                  height={50}
                                  width={50}
                                  className="rounded-lg cursor-pointer"
                                  alt=""
                                />
                              ) : (
                                <img
                                  src="./favicon.png"
                                  height={50}
                                  width={50}
                                  className="rounded-lg cursor-pointer"
                                  alt=""
                                />
                              )}
                              <div className="flex flex-col h-full w-full justify-between">
                                <h4 className="font-semibold uppercase my-1">{item?.userName}</h4>
                                <ProgressBar
                                  bgcolor={primaryColor}
                                  height="20px"
                                  progress={(
                                    (totalSales / target) *
                                    100
                                  ).toFixed(1)}
                                  progresswidth={
                                    totalSales >= target
                                      ? 100.0
                                      : (totalSales / target) *
                                        100
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : ""}
                  {noData && (
                    <div className="flex justify-center">
                      <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                    </div>
                  )}
                </div>
              </div>

              <div className={`p-1 rounded-md h-fit overflow-auto hide-scrollbar`} >
                {/* AGENT  */}
                <div className={`text-lg font-bold text-center uppercase`} >
                  {t("label_sales_agent")}
                </div>
                <div className="grid gap-4 p-3">
                  {!noData && agents?.length > 0
                    ? agents?.map((item, index) => {
                      let totalSales = item.total_sales
                        ? parseInt(item.total_sales)
                        : 0;
                      let target = item.target ? parseInt(item.target) : 0;
                      let percentageSales = (totalSales / target) * 100;
                      percentageSales = Math.min(percentageSales, 100); // Ensure percentage is not more than 100

                      return (
                        <div
                          key={index}
                          className={` ${
                            !themeBgImg 
                              ? (currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]") 
                              : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                          }
                          rounded-lg shadow-sm card-hover p-4 `}
                        >
                          <div className="flex items-center gap-3 h-full w-full ">
                            {item?.profile_picture ? (
                              <img
                                src={item?.profile_picture}
                                height={50}
                                width={50}
                                className="rounded-lg cursor-pointer"
                                alt=""
                              />
                            ) : (
                              <img
                                src="./favicon.png"
                                height={50}
                                width={50}
                                className="rounded-lg cursor-pointer"
                                alt=""
                              />
                            )}
                            <div className="flex flex-col h-full w-full justify-between">
                              <h4 className="font-semibold uppercase my-1">{item?.userName}</h4>
                              <ProgressBar
                                bgcolor={primaryColor}
                                height="20px"
                                progress={(
                                  (totalSales / target) *
                                  100
                                ).toFixed(1)}
                                progresswidth={
                                  totalSales >= target
                                    ? 100.0
                                    : (totalSales / target) *
                                      100
                                }
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="flex justify-center">
                        <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                      </div>
                    )
                  }
                </div>
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
