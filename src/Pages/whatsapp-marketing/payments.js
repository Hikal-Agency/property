import { Box } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";
import NewPayment from "../../Components/whatsapp-marketing/NewPayment";
import Transactions from "../../Components/whatsapp-marketing/Transactions";

const Payments = () => {
  const {
    currentMode,
    darkModeColors,
  } = useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);

  return (
    <>
                <h4 className="font-semibold p-3 text-center">Payments</h4>
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
                      <Tab label="NEW PAYMENT" />
                      <Tab label="ALL TRANSACTIONS" />
                    </Tabs>
                  </Box>
                  <div className="mt-3 pb-3">
                    <TabPanel value={value} index={0}>
                      <NewPayment
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <Transactions
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
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

export default Payments;
