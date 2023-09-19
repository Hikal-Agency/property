import { Box, Button, Card, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import NewPayment from "../../Components/whatsapp-marketing/NewPayment";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Subscriber from "../../Components/whatsapp-marketing/Subscriber";

const Payments = () => {
  const { BACKEND_URL, currentMode, darkModeColors, isUserSubscribed, User } =
    useStateContext();
  const [value, setValue] = useState(0);
  const [subscribers, setSubscribers] = useState([]);
  const [btnloading, setbtnloading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);
  console.log(User);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/subscribers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setSubscribers(response.data.subscribers.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      setbtnloading(true);
      await axios.post(
        `${BACKEND_URL}/cancel`,
        JSON.stringify({
          package_name: "unsubscribed",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setbtnloading(false);
      toast.success("User Unsubscribed Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        localStorage.removeItem("user");
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Sorry, something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (User?.role === 1) {
    return (
      <Box>
        <h1
          className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
            currentMode === "dark"
              ? "text-white border-white"
              : "text-primary font-bold border-primary"
          }`}
        >
          ● All Subscribers
        </h1>
        <Box className="mb-16 mt-4 items-start flex flex-wrap">
          {subscribers.map((sub, index) => {
            return <Subscriber key={index} data={sub} />;
          })}
        </Box>
      </Box>
    );
  }

  if (isUserSubscribed) {
    return (
      <Box className="min-h-screen">
        <h1
          className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
            currentMode === "dark"
              ? "text-white border-white"
              : "text-primary font-bold border-primary"
          }`}
        >
          ● Upgrade
        </h1>
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#1c1c1c] text-white"
              : "bg-gray-200 text-black"
          } flex min-h-screen mt-8 p-5 rounded-md mb-10`}
        >
          <Card
            className="shadow-md bg-btn-primary"

            sx={{
              p: 5,
              mr: 3,
              height: "300px",
              width: "30%",
              borderRadius: 4,
            }}
          >
            <Box className="h-[100%] flex justify-between flex-col pt-4 relative">
              <span
                style={{
                  position: "absolute",
                  top: -20,
                  left: 0,
                  background: "black",
                  color: "white",
                  borderRadius: 4,
                  width: "max-content",
                  padding: "0 5px",
                }}
              >
                Subscribed
              </span>
              <h2 className="text-white font-bold" style={{ fontSize: "18px" }}>
                {User?.package_name}
              </h2>
              <Box className="flex items-center mt-2">
                <h1 className="font-black text-white" style={{ fontSize: 40 }}>
                  US$_
                </h1>
                <Box className="text-white font-light ml-2">
                  <p>per</p>
                  <p style={{ lineHeight: 1, fontSize: 13 }}>year</p>
                </Box>
              </Box>
              <Box className="h-[45%] flex flex-col justify-end">
                <Button
                  onClick={handleUnsubscribe}
                  variant="contained"
                  style={{ backgroundColor: "white", color: "black" }}
                  fullWidth
                  sx={{ padding: "12px 0" }}
                >
                  {btnloading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <CircularProgress size={18} sx={{ color: "blue" }} />
                    </div>
                  ) : (
                    <span>Unsubscribe</span>
                  )}
                </Button>
              </Box>
            </Box>
          </Card>
          <Card
            className="shadow-md"
            sx={{
              p: 5,
              mr: 3,
              height: "300px",
              width: "30%",
              borderRadius: 4,
            }}
          >
            <Box className="h-[100%] flex justify-between flex-col pt-4 relative">
              <span
                style={{
                  position: "absolute",
                  top: -20,
                  left: 0,
                  background: "black",
                  color: "white",
                  borderRadius: 4,
                  width: "max-content",
                  padding: "0 5px",
                }}
              >
                Recommended
              </span>
              <h2
                className="text-slate-600 font-bold"
                style={{ fontSize: "18px" }}
              >
                Pro
              </h2>
              <Box className="flex items-center mt-2">
                <h1
                  className="font-black text-slate-600"
                  style={{ fontSize: 40 }}
                >
                  US$_
                </h1>
                <Box className="text-slate-600 font-light ml-2">
                  <p>per</p>
                  <p style={{ lineHeight: 1, fontSize: 13 }}>year</p>
                </Box>
              </Box>
              <Box className="h-[45%] flex flex-col justify-end">
                <Button
                className="bg-btn-primary"
                  onClick={() => {}}
                  variant="contained"
                  style={{ color: "white" }}
                  fullWidth
                  sx={{ padding: "12px 0" }}
                >
                  Upgrade
                </Button>
              </Box>
            </Box>
          </Card>
        </div>
      </Box>
    );
  } else {
    return (
      <>
        <h1
          className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
            currentMode === "dark"
              ? "text-white border-white"
              : "text-primary font-bold border-primary"
          }`}
        >
          ● Payments
        </h1>
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#1c1c1c] text-white"
              : "bg-gray-200 text-black"
          } p-5 rounded-md my-5 mb-10`}
        >
          <Box
            sx={{
              ...darkModeColors,
              "& .MuiTabs-indicator": {
                height: "100%",
                borderRadius: "5px",
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
              <Tab label="NEW PAYMENT " />
              {/* <Tab label="ALL TRANSACTIONS" /> */}
            </Tabs>
          </Box>
          <div className="mt-3 pb-3 ">
            <TabPanel value={value} index={0}>
              <NewPayment
                isLoading={loading}
                tabValue={tabValue}
                setTabValue={setTabValue}
              />
            </TabPanel>
            {/* <TabPanel value={value} index={1}>
              <Transactions
                isLoading={loading}
                tabValue={tabValue}
                setTabValue={setTabValue}
              />
            </TabPanel> */}
          </div>
        </div>
      </>
    );
    function TabPanel(props) {
      const { children, value, index } = props;
      return <div>{value === index && <div>{children}</div>}</div>;
    }
  }
};

export default Payments;
