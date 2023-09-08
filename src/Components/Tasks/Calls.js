import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import { FiPhoneMissed, FiPhoneCall, FiPhoneIncoming, FiPhoneOutgoing } from "react-icons/fi";
import { useStateContext } from "../../context/ContextProvider";

const Calls = ({
  tabValue,
  setTabValue,
  setCallLogs,
  callLogsData,
  isLoading,
}) => {
  const { darkModeColors, currentMode, primaryColor } = useStateContext();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setCallLogs(newValue);
  };

  return (
    <div
      className={`${
        currentMode === "dark" ? "bg-black" : "bg-white"
      } py-3 w-full rounded-md`}
    >
      <div>
        <Box sx={darkModeColors} className="font-semibold">
          <Tabs value={tabValue} onChange={handleChange} variant="standard">
            <Tab label="TODAY" />
            <Tab label="YESTERDAY" />
            <Tab label="THIS MONTH" />
          </Tabs>
        </Box>
        <Box
          sx={
            isLoading
              ? {
                  opacity: 0.3,
                }
              : {}
          }
        >
          <TabPanel value={tabValue} index={0}>
            <div className={` w-full  p-1 mb-5`}>
              <h1 className="text-center font-bold mb-6">
                {callLogsData?.all_calls < 2 ? (
                  <>
                    <span>{callLogsData?.all_calls}</span> CALL TODAY
                  </>
                ) : (
                  <>
                    <span>{callLogsData?.all_calls}</span> CALLS TODAY
                  </>
                )}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5 px-5 mx-5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                    style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall                     style={{color: primaryColor}} size={20} className=" mr-3" />
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                     style={{color: primaryColor}} className=" mr-3" />
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                                      style={{color: primaryColor}}
                    size={20}
                    className=" mr-3"
                  />
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.missed}</span>
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <div className={` w-full  p-1 mb-5`}>
              <h1 className="text-center  font-bold mb-6">
                {callLogsData?.all_calls < 2 ? (
                  <>
                    <span>{callLogsData?.all_calls}</span> CALL YESTERDAY
                  </>
                ) : (
                  <>
                    <span>{callLogsData?.all_calls}</span> CALLS YESTERDAY
                  </>
                )}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5 px-5 mx-5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                     style={{color: primaryColor}} className=" mr-3" />
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                     style={{color: primaryColor}} className=" mr-3" />
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.missed}</span>
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <div className={` w-full  p-1 mb-5`}>
              <h1 className="text-center  font-bold mb-6">
                {callLogsData?.all_calls < 2 ? (
                  <>
                    <span>{callLogsData?.all_calls}</span> CALL THIS MONTH
                  </>
                ) : (
                  <>
                    <span>{callLogsData?.all_calls}</span> CALLS THIS MONTH
                  </>
                )}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5 px-5 mx-5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                     style={{color: primaryColor}} className=" mr-3" />
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                    style={{color: primaryColor}} className=" mr-3" />
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.missed}</span>
                </p>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={3}>
            <div className="mb-10 mx-3">
              <h1 className="font-semibold text-center">
                All-time total calls: <span>{callLogsData?.all_calls}</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Outgoing calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                     style={{color: primaryColor}} className=" mr-3" />
                  <h2>Answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Not answered:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                                      style={{color: primaryColor}}
                    size={20}
                    className=" mr-3"
                  />
                  <h2>Incoming calls:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall size={20}                     style={{color: primaryColor}} className=" mr-3" />
                  <h2>Recieved:</h2>
                </div>
                <p className="font-bold">
                  {/* {call_logs?.recieved - call_logs?.missed} */}
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                                        style={{color: primaryColor}}
                    className=" mr-3"
                  />
                  <h2>Missed:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.missed}</span>
                </p>
              </div>
            </div>
          </TabPanel>
        </Box>
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
      {/* }  */}
    </div>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Calls;
