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

const Settings = () => {
  const { darkModeColors, SalesPerson, currentMode, Managers, BACKEND_URL } =
    useStateContext();

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <h4
                className={`font-semibold p-7 text-center text-2xl ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Add Questions And Relative Answers For Customer Support.
              </h4>
             
            </div>
          </div>
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

export default Settings;
