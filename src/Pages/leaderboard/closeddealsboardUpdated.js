import React from "react";
import {
  Box, Tab,
  Tabs
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import { useState } from "react";
import { useEffect } from "react";
import Loader from "../../Components/Loader";

import {
  FaRegHandshake,
  FaRegMoneyBillAlt
} from "react-icons/fa";


const ClosedealsboardUpdated = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL, themeBgImg , t} = useStateContext();
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };



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




  const FetchLeaderboard = async (token) => {
    setLoading(true);

    try {
      let apiUrl =
        tabValue === 0
          ? "leaderboard"
          : tabValue === 1
          ? "leaderboard?last_month"
          : "leaderboard?current_month";
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
      
      {loading ? (
        <Loader />
      ) : (
        <Box
          sx={
            isLoading && {
              opacity: 0.3,
            }
          }
        >
          <div className="mb-3">
            <Box sx={darkModeColors} className="font-semibold">
              <Tabs value={tabValue} onChange={handleChange} variant="standard">
                <Tab label={t("all_time")} />
                <Tab label={t("last_month")} />
                <Tab label={t("this_month")} />
              </Tabs>
            </Box>
          </div>
          <div className={` ${currentMode === "dark" ? "text-white" : "text-black"}
            grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3`} >
            <div className={`p-1 rounded-md h-fit overflow-auto hide-scrollbar`}
            >
              {/* MANAGER  */}
              <div
                className={`text-lg font-bold text-center uppercase`}
              >
                {t("label_manager")}
              </div>
              <div className="grid gap-4 p-3">
                {manager?.length > 0 ? (
                  manager?.map((item, index) => (
                    <div
                      className={`${
                        !themeBgImg 
                        ? (currentMode === "dark"
                        ? "bg-[#1C1C1C]"
                        : "bg-[#EEEEEE]") 
                        : (currentMode === "dark"
                          ? "blur-bg-dark"
                          : "blur-bg-light")
                      } 
                      ${active === item?.id ? "border-2 border-primary" : ""} 
                      card-hover shadow-sm rounded-lg p-3 w-full`}
                      onClick={(e) => handleClick(item?.id, e)}
                      key={index}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="grid grid-cols-8 flex items-center gap-4">
                        <div className="w-full px-1">
                          {/* User Image */}
                          {item?.profile_picture ? (
                            <img
                              src={item?.profile_picture}
                              alt=""
                              className="w-full rounded-lg"
                            />
                          ) : (
                            <img
                              src="/favicon.png"
                              alt=""
                              className="w-full rounded-lg"
                            />
                          )}
                        </div>
                        <div className="col-span-4 px-1">
                          <h2 className="text-lg font-bold">
                            {item?.userName}
                          </h2>
                        </div>
                        <div className="col-span-1 px-1 w-full h-full flex justify-center items-center">
                          <div class="flex flex-col items-center">
                            <FaRegHandshake size={20} className="text-primary" />
                            <div className="font-bold">
                              {item?.total_closed_deals}
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 px-1 w-full h-full flex justify-center items-center">
                          <div class="flex flex-col items-center">
                            <FaRegMoneyBillAlt size={20} className="text-primary" />
                            <div className="font-bold">
                              AED{" "}{item?.total_sales}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center">
                    <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                  </div>
                )}
              </div>
            </div>

            <div className={`p-1 rounded-md h-fit overflow-auto hide-scrollbar`} >
              {/* AGENT  */}
              <div className={`text-lg font-bold text-center uppercase`} >
                {t("label_agent")}
              </div>
              <div className="grid gap-4 p-3">
                {active === false ? (
                  agents?.length > 0 ? (
                    agents?.map((item, index) => (
                      <div
                        className={`${
                          !themeBgImg 
                          ? (currentMode === "dark"
                          ? "bg-[#1C1C1C]"
                          : "bg-[#EEEEEE]") 
                          : (currentMode === "dark"
                          ? "blur-bg-dark"
                          : "blur-bg-light")
                        } 
                        ${active === item?.id ? "border-2 border-primary" : ""} 
                        card-hover shadow-sm rounded-lg p-3 w-full`}
                        onClick={(e) => handleClick(item?.id, e)}
                        key={index}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="grid grid-cols-8 flex items-center gap-4">
                          <div className="w-full px-1">
                            {/* User Image */}
                            {item?.profile_picture ? (
                              <img
                                src={item?.profile_picture}
                                alt=""
                                className="w-full rounded-lg"
                              />
                            ) : (
                              <img
                                src="/favicon.png"
                                alt=""
                                className="w-full rounded-lg"
                              />
                            )}
                          </div>
                          <div className="col-span-4 px-1">
                            <h2 className="text-lg font-bold">
                              {item?.userName}
                            </h2>
                          </div>
                          <div className="col-span-1 px-1 w-full h-full flex justify-center items-center">
                            <div class="flex flex-col items-center">
                              <FaRegHandshake size={20} className="text-primary" />
                              <div className="font-bold">
                                {item?.total_closed_deals}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 px-1 w-full h-full flex justify-center items-center">
                            <div class="flex flex-col items-center">
                              <FaRegMoneyBillAlt size={20} className="text-primary" />
                              <div className="font-bold">
                                AED{" "}{item?.total_sales}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center">
                      <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                    </div>
                  )
                ) : (
                  filteredAgent?.length > 0 ? (
                    filteredAgent?.map((item, index) => (
                      <div
                        className={`${
                          !themeBgImg 
                          ? (currentMode === "dark"
                          ? "bg-[#1C1C1C]"
                          : "bg-[#EEEEEE]") 
                          : (currentMode === "dark"
                          ? "blur-bg-dark"
                          : "blur-bg-light")
                        }  card-hover shadow-sm rounded-lg p-3 w-full`}
                        key={index}
                      >
                        <div className="grid grid-cols-8 flex items-center gap-4">
                          <div className="w-full px-1">
                            {/* User Image */}
                            {item?.profile_picture ? (
                              <img
                                src={item?.profile_picture}
                                alt=""
                                className="w-full rounded-lg"
                              />
                            ) : (
                              <img
                                src="/favicon.png"
                                alt=""
                                className="w-full rounded-lg"
                              />
                            )}
                          </div>
                          <div className="col-span-4 px-1">
                            <h2 className="text-lg font-bold">
                              {item?.userName}
                            </h2>
                          </div>
                          <div className="col-span-1 px-1 w-full h-full flex justify-center items-center">
                            <div class="flex flex-col items-center">
                              <FaRegHandshake size={20} className="text-primary" />
                              <div className="font-bold">
                                {item?.total_closed_deals}
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 px-1 w-full h-full flex justify-center items-center">
                            <div class="flex flex-col items-center">
                              <FaRegMoneyBillAlt size={20} className="text-primary" />
                              <div className="font-bold">
                                AED{" "}{item?.total_sales}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center">
                      <img src="./no_data.png" alt="" className="w-[300px] h-[300px]"   />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Box>
      )}
    </div>
  );
};

export default ClosedealsboardUpdated;
