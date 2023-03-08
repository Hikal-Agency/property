import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useLayoutEffect, useState, useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";

const Leaderboard = () => {

  const { currentMode, darkModeColors, BACKEND_URL, setDashboardData } =
    useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  //   const ref = useRef(null);
  //   const [width, setWidth] = useState(0);
  //   const [height, setHeight] = useState(0);

  //   useLayoutEffect(() => {
  //     setWidth(ref.current.offsetWidth);
  //     setHeight(ref.current.offsetHeight);
  //   }, []);

  //   const progress = (150000 / 3000000) * 100;
  //   const absoluteprogress = progress.toFixed(0);

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
    <>
      <div className="min-h-screen">
        <div className="flex">
          <Sidebarmui />
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <Navbar />

              <div className="mt-5 md:mt-2">
                {/* 5TH ROW [TODO + SHORTCUTS] */}
                <div className="grid grid-cols-1 pb-3">
                  {/* <Task call_logs={DashboardData?.call_logs} /> */}
                  <div
                    className={`${
                      currentMode === "dark"
                        ? // ? "bg-gray-800 text-white border-t-4 border-red-600"
                          // : "bg-gray-200 text-black border-t-4 border-red-600"
                          "bg-gray-900 text-white"
                        : "bg-gray-200 text-black"
                    } p-5 rounded-md`}
                  >
                    <h4 className="font-semibold pb-5">Leaderboard</h4>
                    {/* <hr className="w-[calc(100%+40px)] -ml-[20px] mt-2 mb-5" /> */}
                    <Box
                      sx={{
                        ...darkModeColors,
                        "& .MuiTabs-indicator": {
                          // bottom: "7px",
                          height: "100%",
                          borderRadius: "5px",
                          backgroundColor: "#da1f26",
                        },
                        "& .Mui-selected": { color: "white !important", zIndex: "1" },
                      }}
                      className={`w-full rounded-md overflow-hidden ${
                        currentMode === "dark" ? "bg-black" : "bg-white"
                      } `}
                    >
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="standard"
                        // centered
                        className="w-full px-1 m-1"
                      >
                        <Tab label="Calls" />
                        {/* <Tab label="Activity " />
                        <Tab label="Tasks" />
                        <Tab label="Calender" />
                        <Tab label="Busines" /> */}
                      </Tabs>
                    </Box>
                    <div className="mt-3 pb-3">
                      <TabPanel value={value} index={0}>
                        <Calls
                          isLoading={loading}
                          setCallLogs={setCallLogs}
                          tabValue={tabValue}
                          setTabValue={setTabValue}
                          call_logs={call_logs}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        tab panel 2
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <div>
                          <h1>Hello world 3 </h1>
                        </div>
                      </TabPanel>
                    </div>
                    {/* <Tabs value="html">
                      <TabsHeader>
                        {data.map(({ label, value }) => (
                          <Tab key={value} value={value}>
                            {label}
                          </Tab>
                        ))}
                      </TabsHeader>
                      <TabsBody>
                        {data.map(({ value, desc }) => (
                          <TabPanel key={value} value={value} className="pt-4 px-0">
                            {desc}
                          </TabPanel>
                        ))}
                      </TabsBody>
                    </Tabs> */}
                  </div>
                </div>
                {/* 5TH ROW END [TODO + SHORTCUTS] */}
                
                <h1
                  className={`font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                >
                  Leaderboard
                  {/* <span className="px-5 py-3 rounded-md">Leaderboard</span> */}
                  {/* <span className="px-5 py-3 rounded-md">Call Log Board</span> */}
                </h1>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-5 gap-y-5 pb-3"> */}
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
                    Sales Manager
                  </div>
                  <div>
                    {Manager.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-x-5 rounded-md my-3 content-center align-center items-center"
                        >
                          <div className="col-span-2">
                            <h4 className="font-semibold my-1">{item.name}</h4>
                          </div>
                          <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                            {item.achieved >= item.target ? (
                              <span
                                className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                              >
                                Team deals: {item.teamDeals} / Direct deals:{" "}
                                {item.directDeals}
                              </span>
                            ) : item.achieved < item.target ? (
                              <div
                                className={`w-[${
                                  (item.achieved / item.target) * 100
                                }%] bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 `}
                              >
                                Team deals: {item.teamDeals} / Direct deals:{" "}
                                {item.directDeals}
                              </div>
                            ) : (
                              <></>
                            )}
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
                      currentMode === "dark"
                        ? "text-red-600"
                        : "text-main-red-color"
                    } text-xl font-bold`}
                  >
                    Sales Agent
                  </div>
                  <div>
                    {Agent.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 gap-x-5 rounded-md my-3 content-center align-center items-center"
                        >
                          <div className="col-span-2">
                            <h4 className="font-semibold my-1">{item.name}</h4>
                          </div>
                          <div className="col-span-9 flex gap-x-3 align-center content-center items-center">
                            {item.achieved >= item.target ? (
                              <span
                                className={`bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5 w-full`}
                              >
                                Closed deals: {item.totalClosed}
                              </span>
                            ) : item.achieved < item.target ? (
                              <div
                                className={`w-[${
                                  (item.achieved / item.target) * 100
                                }%] bg-main-red-color p-x-2 h-5 text-white font-semibold text-xs flex justify-center items-center px-5`}
                              >
                                Closed deals: {item.totalClosed}
                              </div>
                            ) : (
                              <></>
                            )}
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
                {/* </div> */}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
