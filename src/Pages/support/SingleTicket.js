import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";
import CreateTicket from "../../Components/support/CreateTicket";
import AllTickets from "../../Components/support/AllTickets";
import SingleTickt from "../../Components/support/SingleTickt";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SingleTicket = () => {
  const location = useLocation();

  const id = location.pathname.split("/")[2].replace(/%20/g, " ");

  console.log("Ticket Id: ", id);

  const { currentMode, darkModeColors, BACKEND_URL } = useStateContext();

  const [tickeData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Ticket DAta: ", tickeData);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/tickets/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Single Ticket: ", response);
      setTicketData(response?.data?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
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
                <h4
                  className={`font-semibold p-7 text-center text-2xl ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  <span className="text-main-red-color font-bold">
                    {tickeData?.issue}
                  </span>
                </h4>
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-black"
                  } p-5 rounded-md my-5 mb-10 min-h-screen`}
                >
                  <div className="mt-3 pb-3 min-h-screen">
                    <SingleTickt ticketData={tickeData} />
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
};

export default SingleTicket;
