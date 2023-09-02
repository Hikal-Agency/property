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
  const { darkModeColors, SalesPerson, currentMode, Managers, BACKEND_URL } =
    useStateContext();

 

  return (
    <>
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="w-full pl-3">
            <div className={`w-full `}>
              <div className="pl-3">
                <h1
                  className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-main-red-color font-bold border-main-red-color"
                  }`}
                >
                  ● Integrations
                </h1>
              </div>
            </div>
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
