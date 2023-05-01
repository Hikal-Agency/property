import { Box } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";
import CreateTicket from "../../Components/support/CreateTicket";
import AllTickets from "../../Components/support/AllTickets";
import ADDQA from "../../Components/addQA/ADDQA";

const QAForm = () => {
  const { currentMode, darkModeColors } = useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="flex">
            <Sidebarmui />
            <div className={`w-full `}>
              <div className="px-5">
                <Navbar />
                <h4 className="font-semibold p-7 text-center text-2xl">
                  Add Questions And Relative Answers For Customer Support.
                </h4>
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-black"
                  } p-5 rounded-md my-5 mb-10`}
                >
                  <Box
                    sx={{
                      ...darkModeColors,
                      "& .MuiTabs-indicator": {
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
                      <Tab label="Add QA" />
                      {/* <Tab label="ALL TICKETS" /> */}
                      {/* <Tab label="UPGRADE" />
                      <Tab label="RENEWAL" />
                      <Tab label="CANCELLATION" /> */}
                    </Tabs>
                  </Box>
                  <div className="mt-3 pb-3">
                    <TabPanel value={value} index={0}>
                      <ADDQA
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                    {/* <TabPanel value={value} index={1}>
                      <AllTickets
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default QAForm;
