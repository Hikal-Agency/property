import { Box, Tab, Tabs, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { FiPhoneMissed, FiPhoneCall } from "react-icons/fi";
import { VscCallOutgoing, VscCallIncoming } from "react-icons/vsc";
import { useStateContext } from "../../context/ContextProvider";
import GroupChart from "../charts/GroupChart";

const Calls = ({ call_logs, tabValue, setTabValue, setCallLogs, isLoading }) => {
  const { darkModeColors, currentMode} = useStateContext();
  // const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setCallLogs(newValue);
  };

  return (
    <div
      className={`${
        currentMode === "dark" ? "bg-black" : "bg-white"
      }  px-5 py-3 w-full rounded-md`}
    >
      {/* <<<<<<< HEAD
      <div className="mb-10 mt-3 mx-3">
        <h1 className="font-semibold text-center">
          All-time total calls: {call_logs?.all_calls}
        </h1>
        <GroupChart />
      </div>
      <div className="grid grid-cols-3 gap-y-5 gap-x-5">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <VscCallOutgoing size={20} className="text-main-red-color mr-3" />
            <h2>Outgoing calls:</h2>
======= */}
  {isLoading ? 
            <div className="w-full flex items-center justify-center space-x-1">
              <CircularProgress size={20} />
              <span className="font-semibold text-lg">
                {" "}
                Loading
              </span>
            </div>
    :
    <div>
      <Box sx={darkModeColors} className="font-semibold">
        <Tabs value={tabValue} onChange={handleChange} variant="standard">
          <Tab label="TODAY" />
          <Tab label="THIS MONTH" />
          <Tab label="ALL TIME" />
        </Tabs>
      </Box>
      <div className="mt-1 p-5">
        <TabPanel value={tabValue} index={0}>
          <div className="mb-10 mx-3">
            <h1 className="font-semibold text-center">
              Today total calls: {call_logs?.all_calls}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-y-5 gap-x-5">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <VscCallOutgoing
                  size={20}
                  className="text-main-red-color mr-3"
                />
                <h2>Outgoing calls:</h2>
              </div>
              <p className="font-bold">{call_logs?.dialed}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneCall size={20} className="text-main-red-color mr-3" />
                <h2>Answered:</h2>
              </div>
              <p className="font-bold">{call_logs?.answered}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
                <h2>Not answered:</h2>
              </div>
              <p className="font-bold">{call_logs?.notanswered}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <VscCallIncoming
                  size={20}
                  className="text-main-red-color mr-3"
                />
                <h2>Incoming calls:</h2>
              </div>
              <p className="font-bold">{call_logs?.recieved}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneCall size={20} className="text-main-red-color mr-3" />
                <h2>Recieved:</h2>
              </div>
              <p className="font-bold">
                {/* {call_logs?.recieved - call_logs?.missed} */}
                {call_logs?.recieved}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
                <h2>Missed:</h2>
              </div>
              <p className="font-bold">{call_logs?.missed}</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <div className="mb-10 mx-3">
            <h1 className="font-semibold text-center">
              This month total calls: {call_logs?.all_calls}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-y-5 gap-x-5">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <VscCallOutgoing
                  size={20}
                  className="text-main-red-color mr-3"
                />
                <h2>Outgoing calls:</h2>
              </div>
              <p className="font-bold">{call_logs?.dialed}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneCall size={20} className="text-main-red-color mr-3" />
                <h2>Answered:</h2>
              </div>
              <p className="font-bold">{call_logs?.answered}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
                <h2>Not answered:</h2>
              </div>
              <p className="font-bold">{call_logs?.notanswered}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <VscCallIncoming
                  size={20}
                  className="text-main-red-color mr-3"
                />
                <h2>Incoming calls:</h2>
              </div>
              <p className="font-bold">{call_logs?.recieved}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneCall size={20} className="text-main-red-color mr-3" />
                <h2>Recieved:</h2>
              </div>
              <p className="font-bold">
                {/* {call_logs?.recieved - call_logs?.missed} */}
                {call_logs?.recieved}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
                <h2>Missed:</h2>
              </div>
              <p className="font-bold">{call_logs?.missed}</p>
            </div>
          </div>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <div className="mb-10 mx-3">
            <h1 className="font-semibold text-center">
              All-time total calls: {call_logs?.all_calls}
            </h1>
          </div>
          <div className="grid grid-cols-3 gap-y-5 gap-x-5">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <VscCallOutgoing
                  size={20}
                  className="text-main-red-color mr-3"
                />
                <h2>Outgoing calls:</h2>
              </div>
              <p className="font-bold">{call_logs?.dialed}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneCall size={20} className="text-main-red-color mr-3" />
                <h2>Answered:</h2>
              </div>
              <p className="font-bold">{call_logs?.answered}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
                <h2>Not answered:</h2>
              </div>
              <p className="font-bold">{call_logs?.notanswered}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <VscCallIncoming
                  size={20}
                  className="text-main-red-color mr-3"
                />
                <h2>Incoming calls:</h2>
              </div>
              <p className="font-bold">{call_logs?.recieved}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneCall size={20} className="text-main-red-color mr-3" />
                <h2>Recieved:</h2>
              </div>
              <p className="font-bold">
                {/* {call_logs?.recieved - call_logs?.missed} */}
                {call_logs?.recieved}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
                <h2>Missed:</h2>
              </div>
              <p className="font-bold">{call_logs?.missed}</p>
            </div>
          </div>
        </TabPanel>
      </div>
      {/* <Box sx={darkModeColors} className="font-semibold">
        <Tabs value={value} onChange={handleChange} variant="standard">
          <Tab label="ANSWERED CALLS " />
          <Tab label="MISSED CALLS" />
          <Tab label="RECIEVED CALLS" />
        </Tabs>
      </Box>
      <div className="mt-1 p-5">
        <TabPanel value={value} index={0}>
          tab panel 1
        </TabPanel>
        <TabPanel vaslue={value} index={1}>
          tab panel 2
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div>
            <h1>Hello world 3 </h1>
          </div>
        </TabPanel>
      </div> */}
    </div>
      } 
    </div>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Calls;
