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
  const { t, themeBgImg, currentMode, Managers, BACKEND_URL } =
    useStateContext();

  return (
    <>
      
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="bg-primary h-10 w-1 rounded-full"></div>
          <h1
            className={`text-lg font-semibold mx-2 uppercase ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            {t("menu_settings")}
          </h1>
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
