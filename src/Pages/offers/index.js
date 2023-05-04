import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";
import AllOffers from "../../Components/offers/all_offers";
import CreateOffer from "../../Components/offers/createoffer";
import { useNavigate, useLocation } from "react-router-dom";
import ManagerOffers from "../../Components/offers/manager_offers";
import SalesPersonOffers from "../../Components/offers/salePerson_offers";
import {io} from "socket.io-client";

const Offers = () => {
  const {
    currentMode,
    darkModeColors,
    User,
    setopenBackDrop,
    BACKEND_URL,
    setUser,
  } = useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUser(result.data.user[0]);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again " },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);

    if (!(User?.uid && User?.loginId)) {
      const token = localStorage.getItem("auth-token");
      if (token) {
        // FetchProfile(token);
        const user = localStorage.getItem("user");
        console.log("User in add lead: ", user);
        setUser(JSON.parse(user));
        // setloading(false);
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }
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
          <div className="flex">
            <Sidebarmui />
            <div className={`w-full `}>
              <div className="px-5">
                <Navbar />
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
                      <Tab label="CREATE NEW OFFER" />
                      <Tab label="ALL" />
                      <Tab label="FOR MANAGERS" />
                      <Tab label="FOR AGENTS" />
                    </Tabs>
                  </Box>
                  <div className="mt-3 pb-3">
                    <TabPanel value={value} index={0}>
                      <CreateOffer
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <AllOffers
                        isLoading={loading}
                        tabValue={tabValue}
                        setTabValue={setTabValue}
                      />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <ManagerOffers
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      />
                      {/* <div>
                        <h1>Hello world 3 </h1>
                      </div> */}
                    </TabPanel>
                    <TabPanel value={value} index={3}>
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

export default Offers;
