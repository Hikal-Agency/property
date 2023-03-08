import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useLayoutEffect, useState, useRef } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import CallLogBoard from "./calllogboard";
import ClosedDealsBoard from "./closeddealsboard";

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
                {/* TABS */}
                <div className="grid grid-cols-1 pb-3">
                  {/* <Task call_logs={DashboardData?.call_logs} /> */}
                  <div
                    className={`p-5 rounded-md`}
                  >
                    <h4 className={`text-main-red-color font-bold pb-5`}>Leaderboard</h4>
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
                        currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
                      } `}
                    >
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="standard"
                        // centered
                        className="w-full px-1 m-1"
                      >
                        <Tab label="Closed Deals" />
                        <Tab label="Call Logs" />
                        <Tab label="Performance" />
                        <Tab label="Target" />
                      </Tabs>
                    </Box>
                    <div className="mt-3 pb-3">
                      <TabPanel value={value} index={0}>
                        <ClosedDealsBoard
                          isLoading={loading}
                          tabValue={tabValue}
                          setTabValue={setTabValue}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={1}>
                        <CallLogBoard
                          isLoading={loading}
                          tabValue={tabValue}
                          setTabValue={setTabValue}
                        />
                      </TabPanel>
                      <TabPanel value={value} index={2}>
                        <div>
                          <h1>performance </h1>
                        </div>
                      </TabPanel>
                      <TabPanel value={value} index={3}>
                        <div>
                          <h1>target </h1>
                        </div>
                      </TabPanel>
                    </div>
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
                
                {/* </div> */}
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
  
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Leaderboard;
