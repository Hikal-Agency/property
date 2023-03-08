import React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";

const ClosedDealsBoard = ({
  tabValue,
  setTabValue,
  isLoading,
}) => {
  const { currentMode, darkModeColors } = useStateContext();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
          <TabPanel value={tabValue} index={0}>
            <div className="mb-10 mx-3">
              <h1 className="font-semibold text-center">
                <span className="font-bold">32</span>&nbsp;&nbsp;Closed Deals of&nbsp;<span className="font-bold">AED 50000000</span>
              </h1>
            </div>



            
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>567</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>5678</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>678</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>567</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>678</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>5678</span>
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <div className="mb-10 mx-3">
              <h1 className="font-semibold text-center">
                This month total calls: <span>567</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>567</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>5678</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>4567</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>567</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>4567</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>3456</span>
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <div className="mb-10 mx-3">
              <h1 className="font-semibold text-center">
                All-time total calls: <span>456</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>345</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>3456</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>3456</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>345</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>354</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>343</span>
                </p>
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

export default ClosedDealsBoard;
