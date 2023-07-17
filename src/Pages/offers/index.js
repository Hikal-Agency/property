import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import CreateOffer from "../../Components/offers/createoffer";
import ManagerOffers from "../../Components/offers/manager_offers";
import SalesPersonOffers from "../../Components/offers/salePerson_offers";
import InfiniteScroll from 'react-infinite-scroll-component';

const Offers = () => {
  const { currentMode, darkModeColors, setopenBackDrop, User } =
    useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    console.log("newvalue: ", newValue);
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-200 text-black"
                } p-5 rounded-md my-5 mb-10`}
              >
                <h4 className="font-semibold pb-5">Offers</h4>
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
                    {User?.role !== 7 ? <Tab label="CREATE NEW OFFER" /> : ""}
                    {(User?.role === 1 || User?.role === 2) && (
                      <Tab label="FOR MANAGERS" />
                    )}
                    <Tab label="FOR AGENTS" />
                  </Tabs>
                </Box>
                <div className="mt-3 pb-3">
                  {User?.role !== 7 ? (
                    <TabPanel value={value} index={0}>
                      <CreateOffer
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                  ) : (
                    ""
                  )}
                  {User?.role === 1 || User?.role === 2 ? (
                    <TabPanel value={value} index={1}>
                      <ManagerOffers
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                  ) : (
                    ""
                  )}
                  <TabPanel
                    value={value}
                    index={
                      User?.role === 1 || User?.role === 2
                        ? 2
                        : User?.role === 3
                        ? 1
                        : 0
                    }
                  >
                    <SalesPersonOffers
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                    />
                  </TabPanel>
                </div>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Offers;
