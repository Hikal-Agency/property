import React, {useEffect} from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import DeviceComponent from "../../Components/whatsapp-marketing/DeviceComponent";
import MessagesComponent from "./messages";
import PaymentsComponent from "./payments";
import TransactionsComponent from "./transactions";
import DashboardComponent from "./Dashboard";
import axios from "axios";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import {useLocation, useNavigate} from "react-router-dom";

const pagesComponents = {
  dashboard: <DashboardComponent/>,
  messages: <MessagesComponent/>,
  device: <DeviceComponent/>,
  payments: <PaymentsComponent/>,
  transactions: <TransactionsComponent/>,
};

const WhatsappMarketing = () => {
  const { currentMode, User, setUser, BACKEND_URL, setopenBackDrop } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();

  const page = location.pathname.split("/")[2].replace(/%20/g, " ");

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
      
    if(!(User?.uid && User?.loginId)){
      const token = localStorage.getItem("auth-token");
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
        });
      }
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="min-h-screen">
        <div className="flex">
          <Sidebarmui />
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <Navbar />
              {pagesComponents[page]}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsappMarketing;
