import { Box, Tab, Tabs } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Calls from "./Calls";
// eslint-disable-next-line

const Task = () => {
  const { currentMode, darkModeColors, BACKEND_URL, fontFam, primaryColor, themeBgImg, t } = useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [callLogsData, setCallLogsData] = useState({});

  const setCallLogs = async (tabId) => {
    try {
      setLoading(true);
      let url = "";

      if (Number(tabId) === 0) {
        url = `${BACKEND_URL}/callLogs/?%2F=&period=daily`;
      } else if (Number(tabId) === 1) {
        url = `${BACKEND_URL}/callLogs/?%2F=&period=yesterday`;
      } else if (Number(tabId) === 2) {
        url = `${BACKEND_URL}/callLogs/?%2F=&period=monthly`;
      } else {
        url = `${BACKEND_URL}/callLogs`;
      }

      const token = localStorage.getItem("auth-token");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { call_logs } = await response.json();
      console.log(call_logs);
      setCallLogsData({ ...call_logs });
      setLoading(false);
    } catch (error) {
      console.log("Error in Setting call logs ", error);
    }
  };

  useEffect(() => {
    setCallLogs("0");
    setTabValue(0);
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        className={`${
          currentMode === "dark"
            ? "text-white"
            : "text-black"
        }`}
      >
        {/* <h4 className="font-semibold p-5">SUMMARY</h4> */}
        <Box
          sx={{
            ...darkModeColors,
            "& .MuiTabs-indicator": {
              height: "100%",
              borderRadius: "5px",
              backgroundColor: primaryColor,
            },
            "& .Mui-selected": { 
              color: "white !important", 
              zIndex: "1" 
            },
          }}
          className={`w-full overflow-hidden `}
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold p-5">{t("summary")}</h4>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="standard"
              // centered
              className="w-full m-1 px-1"              
            >
              <Tab 
                label={t("calls_count")} 
                style={{
                  fontFamily: fontFam
                }}
              />
            </Tabs>
          </div>
        </Box>
        {/* !themeBgImg ? (currentMode === "dark"
                      ? "bg-black text-white "
                      : "bg-white text-main-dark-bg")
                      : (currentMode === "dark"
                        ? "blur-bg-dark text-white "
                        : "blur-bg-light text-main-dark-bg") */}
        <div>
          <TabPanel value={value} index={0} >
            <Calls
              isLoading={loading}
              setCallLogs={setCallLogs}
              callLogsData={callLogsData}
              tabValue={tabValue}
              setTabValue={setTabValue}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {t("coming_soon")?.toUpperCase()}
          </TabPanel>
        </div>
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Task;
