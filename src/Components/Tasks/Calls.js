import { Box, Tab, Tabs } from "@mui/material";
import React from "react";
import {
  FiPhoneMissed,
  FiPhoneCall,
  FiPhoneIncoming,
  FiPhoneOutgoing,
} from "react-icons/fi";
import { useStateContext } from "../../context/ContextProvider";

const Calls = ({
  tabValue,
  setTabValue,
  setCallLogs,
  callLogsData,
  isLoading,
}) => {
  const { darkModeColors, currentMode, primaryColor, themeBgImg, t } = useStateContext();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    setCallLogs(newValue);
  };

  return (
    <div
      className={`${
        !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
      } py-3 w-full rounded-md`}
    >
      <div>
        <Box sx={darkModeColors} className="font-semibold">
          <Tabs value={tabValue} onChange={handleChange} variant="standard">
            <Tab label={t("today")} />
            <Tab label={t("yesterday")}/>
            <Tab label={t("this_month")} />
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
                    <span>{callLogsData?.all_calls}</span> {t("call_today")?.toUpperCase()}
                  </>
                ) : (
                  <>
                    <span>{callLogsData?.all_calls}</span> {t("call_today")?.toUpperCase()}
                  </>
                )}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5 px-5 mx-5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("outgoing_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    style={{ color: primaryColor }}
                    size={20}
                    className=" mr-3"
                  />
                  <h2>{t("answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("not_answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("incoming_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("received")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    style={{ color: primaryColor }}
                    size={20}
                    className=" mr-3"
                  />
                  <h2>{t("missed")}:</h2>
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
                    <span>{callLogsData?.all_calls}</span> {t("call_yesterday")?.toUpperCase()}
                  </>
                ) : (
                  <>
                    <span>{callLogsData?.all_calls}</span> {t("call_yesterday")?.toUpperCase()}
                  </>
                )}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5 px-5 mx-5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("outgoing_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("not_answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("incoming_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("received")}:</h2>
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
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("missed")}:</h2>
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
                    <span>{callLogsData?.all_calls}</span> {t("call_this_month")?.toUpperCase()}
                  </>
                ) : (
                  <>
                    <span>{callLogsData?.all_calls}</span> {t("call_this_month")?.toUpperCase()}
                  </>
                )}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5 px-5 mx-5 mb-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("outgoing_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("not_answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("incoming_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("received")}:</h2>
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
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("missed")}:</h2>
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
                {t("all_time_total_calls")}: <span>{callLogsData?.all_calls}</span>
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-5">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneOutgoing
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("outgoing_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.dialed}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.answered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneMissed
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("not_answered")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.notanswered}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneIncoming
                    style={{ color: primaryColor }}
                    size={20}
                    className=" mr-3"
                  />
                  <h2>{t("incoming_calls")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.recieved}</span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <FiPhoneCall
                    size={20}
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("received")}:</h2>
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
                    style={{ color: primaryColor }}
                    className=" mr-3"
                  />
                  <h2>{t("missed")}:</h2>
                </div>
                <p className="font-bold">
                  <span>{callLogsData?.missed}</span>
                </p>
              </div>
            </div>
          </TabPanel>
        </Box>
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
