import { Box, InputLabel, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";

import ADDQA from "../../Components/addQA/ADDQA";
import ListQa from "../../Components/addQA/ListQa";
import FilterQA from "../../Components/addQA/FilterQA";
import { Select, MenuItem } from "@mui/material";
import axios from "../../axoisConfig";
import { ToastContainer, toast } from "react-toastify";
import IntegrationComponent from "../../Components/integrationComponent/IntegrationComponent";

const Integrations = () => {
  const { 
    darkModeColors, 
    SalesPerson, 
    currentMode, 
    Managers, 
    BACKEND_URL,
    themeBgImg
  } =
    useStateContext();

 

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
            <h1
              className={`text-lg font-semibold ${
                currentMode === "dark"
                  ? "text-white"
                  : "text-black"
              }`}
            >
              Integrations
            </h1>
          </div>
          <IntegrationComponent />
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Integrations;
