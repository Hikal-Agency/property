import { Box, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import NewPayment from "../../Components/whatsapp-marketing/NewPayment";
import axios from "axios";
import Transactions from "../../Components/whatsapp-marketing/Transactions";
import {toast} from "react-toastify";

const Payments = () => {
  const { BACKEND_URL, currentMode, darkModeColors, isUserSubscribed, User } = useStateContext();
  const [value, setValue] = useState(0);
  const [btnloading, setbtnloading] = useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading] = useState(false);
  console.log(User)

  const handleUnsubscribe = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      setbtnloading(true);
      const result = await axios.post(`${BACKEND_URL}/cancel`, JSON.stringify({
        package_name: "unsubscribed"
      }), {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
      setbtnloading(false);
        toast.success("Lead Added Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      window.location.href = "/dashboard";
    } catch (error) {
      console.log(error);
    }
  }

  if(isUserSubscribed){
    return <Box className="min-h-screen flex flex-col justify-center items-center">
      <h1>You are Subscribed to <span style={{color: "red"}}>{User?.package_name}</span></h1>
      <Button onClick={handleUnsubscribe} variant="contained" style={{background: "red", marginTop: 12}}>
            {btnloading ? (
              <div className="flex items-center justify-center space-x-1">
                <CircularProgress size={18} sx={{ color: "blue" }} />
              </div>
            ) : (
              <span>Unsubscribe</span>
            )}
      </Button>
    </Box>;
  } else {
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
}

export default Payments;
