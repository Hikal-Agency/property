import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import CallLogBoard from "./calllogboard";
import ClosedDealsBoard from "./closeddealsboard";
import TargetBoard from "./targetboard";

const Leaderboard = () => {
  const { currentMode, darkModeColors } = useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);

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
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="pl-3">
            <div className="mt-5 md:mt-2">
              <h1
                className={`font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
              >
                Leaderboard
              </h1>
              {/* TABS */}
              <div className="grid grid-cols-1 pb-3">
                {/* <Task call_logs={DashboardData?.call_logs} /> */}
                <div className={`p-5 rounded-md`}>
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
                      "& .Mui-selected": {
                        color: "white !important",
                        zIndex: "1",
                      },
                    }}
                    className={`w-full rounded-md overflow-hidden ${
                      currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
                    } `}
                  >
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="standard"
                      className="w-full px-1 m-1"
                    >
                      <Tab label="Call Logs" />
                      <Tab label="Closed Deals" />
                      <Tab label="Target" />
                    </Tabs>
                  </Box>
                  <div className="mt-3 pb-3">
                    <TabPanel value={value} index={0}>
                      <CallLogBoard
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <ClosedDealsBoard
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <TargetBoard
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                  </div>
                </div>
              </div>
              {/* TABS END */}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Leaderboard;
