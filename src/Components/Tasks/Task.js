import { Box, Tab, Tabs } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Calls from "./Calls";
// eslint-disable-next-line
const data = [
  {
    label: "Calls",
    value: "calls",
    desc: <Calls />,
  },
  {
    label: "Activity",
    value: "activity",
    desc: `Activity Tab`,
  },

  {
    label: "Tasks",
    value: "tasks",
    desc: `Tasks Tab`,
  },

  {
    label: "Calender",
    value: "calender",
    desc: `Calender Tab`,
  },

  {
    label: "My Business",
    value: "mybusiness",
    desc: `My business Tab`,
  },
];

const Task = () => {
  const { currentMode, darkModeColors, BACKEND_URL } =
    useStateContext();
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
      setCallLogsData({...call_logs});
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
            ? // ? "bg-gray-800 text-white border-t-4 border-red-600"
              // : "bg-gray-200 text-black border-t-4 border-red-600"
              "bg-gray-900 text-white"
            : "bg-gray-200 text-black"
        } p-5 rounded-md`}
      >
        <h4 className="font-semibold pb-5">Summary</h4>
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
              callLogsData={callLogsData}
              tabValue={tabValue}
              setTabValue={setTabValue}
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
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Task;
