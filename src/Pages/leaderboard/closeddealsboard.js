import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const ClosedDealsBoard = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();

  const [leaderboard, setLeaderboard] = useState();
  const [manager, setManagers] = useState();
  const [agents, setAgents] = useState();

  console.log("Leaderboard here: ", leaderboard);
  console.log("Manager here: ", manager);
  console.log("Agents here: ", agents);
  const FetchOffers = async (token) => {
    try {
      const all_leaderboard = await axios.get(`${BACKEND_URL}/leaderboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setLeaderboard(all_leaderboard?.data?.user);

      const leaderboard = all_leaderboard?.data?.user;

      const get_managers = leaderboard?.filter(
        (manager) => manager?.role === 3
      );
      setManagers(get_managers);

      const get_agents = leaderboard?.filter((manager) => manager?.role === 7);
      setAgents(get_agents);

      //   console.log("All Offers: ", get);
    } catch (error) {
      console.log("Offers not fetched. ", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchOffers(token);
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
      <Box sx={darkModeColors} className="font-semibold">
        <Tabs value={tabValue} onChange={handleChange} variant="standard">
          <Tab label="All TIME" />
          <Tab label="LAST MONTH" />
          <Tab label="THIS MONTH" />
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
        {/* ALL-TIME */}
        <TabPanel
          value={tabValue}
          index={0}
          className="h-[100px] overflow-y-scroll"
        >
          <div className="mb-10 mx-3">
            <h1 className="font-semibold text-center">
              <span className="font-bold">32</span>&nbsp;&nbsp;Closed Deals
              of&nbsp;<span className="font-bold">AED 50000000</span>
            </h1>
          </div>
          <div
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            } p-3 rounded-md`}
          >
            <div
              className={`${
                currentMode === "dark" ? "text-red-600" : "text-main-red-color"
              } text-xl font-bold`}
            >
              Sales Manager
            </div>
            <div className="h-[300px] overflow-y-scroll">
              {manager?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                  >
                    <div className="col-span-2">
                      <h4 className="font-bold my-1">{item?.userName}</h4>
                    </div>
                    <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                      {/* {item.achieved >= item.target ? (
                        <span
                          className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                        >
                          Team deals: {item.teamDeals} / Direct deals:{" "}
                          {item.directDeals}
                        </span>
                      ) : item.achieved < item.target ? (
                        <div
                          style={{
                            width: `${(item.achieved / item.target) * 100}%`,
                          }}
                          className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                        >
                          Team deals: {item.teamDeals} / Direct deals:{" "}
                          {item.directDeals}
                        </div>
                      ) : (
                        <></>
                      )} */}
                      <span
                        className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                      >
                        Total Closed Deals: {item?.total_closed_deals} / Direct
                        deals: {item?.total_sales || 0}
                      </span>
                      <img
                        src="/favicon.png"
                        height={50}
                        width={50}
                        className="rounded-full cursor-pointer"
                        alt=""
                      />
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
            <div
              className={`${
                currentMode === "dark" ? "text-red-600" : "text-main-red-color"
              } text-xl font-bold`}
            >
              Sales Agent
            </div>
            <div className="h-[300px] overflow-y-scroll">
              {agents?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-11 gap-x-5 rounded-md my-3 content-center align-center items-center"
                  >
                    <div className="col-span-2">
                      <h4 className="font-bold my-1">{item?.userName}</h4>
                    </div>
                    <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                      {/* {item.achieved >= item.target ? (
                        <span
                          className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                        >
                          Closed deals: {item.totalClosed}
                        </span>
                      ) : item.achieved < item.target ? (
                        <div
                          style={{
                            width: `${(item.achieved / item.target) * 100}%`,
                          }}
                          className={` bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5`}
                        >
                          Closed deals: {item.totalClosed}
                        </div>
                      ) : (
                        <></>
                      )} */}
                      <span
                        className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                      >
                        Closed deals: {item?.total_closed_deals || 0}
                      </span>
                      <img
                        src="/favicon.png"
                        height={50}
                        width={50}
                        className="rounded-full cursor-pointer"
                        alt=""
                      />
                    </div>
                    <div></div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={1}></TabPanel>
        <TabPanel value={tabValue} index={2}></TabPanel>
      </Box>
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default ClosedDealsBoard;
