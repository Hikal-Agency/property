import React, { useState } from "react";
import { FiPhoneMissed, FiPhoneCall } from "react-icons/fi";

import { VscCallOutgoing, VscCallIncoming } from "react-icons/vsc";
import { useStateContext } from "../../context/ContextProvider";

const Calls = ({ call_logs }) => {
  const { currentMode } = useStateContext();
  // eslint-disable-next-line
  const [value, setValue] = useState(0);
  // eslint-disable-next-line
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div
      className={`${
        currentMode === "dark" ? "bg-black" : "bg-white"
      }  px-5 py-3 w-full rounded-md`}
    >
      <div className="mb-10 mt-3 mx-3">
        <h1 className="font-semibold text-center">
          All-time total calls: {call_logs?.all_calls}
        </h1>
      </div>
      <div className="grid grid-cols-3 gap-y-5 gap-x-5">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <VscCallOutgoing size={20} className="text-main-red-color mr-3" />
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
            <VscCallIncoming size={20} className="text-main-red-color mr-3" />
            <h2>Incoming calls:</h2>
          </div>
          <p className="font-bold">{call_logs?.recieved}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <FiPhoneCall size={20} className="text-main-red-color mr-3" />
            <h2>Recieved:</h2>
          </div>
          <p className="font-bold">{call_logs?.recieved - call_logs?.missed}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <FiPhoneMissed size={20} className="text-main-red-color mr-3" />
            <h2>Missed:</h2>
          </div>
          <p className="font-bold">{call_logs?.missed}</p>
        </div>
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
  );
  // eslint-disable-next-line
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Calls;
