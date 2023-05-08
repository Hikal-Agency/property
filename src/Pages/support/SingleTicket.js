import { Box } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import Footer from "../../Components/Footer/Footer";
import CreateTicket from "../../Components/support/CreateTicket";
import AllTickets from "../../Components/support/AllTickets";
import SingleTickt from "../../Components/support/SingleTickt";

const SingleTicket = () => {
  const { currentMode, darkModeColors } = useStateContext();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

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
                    Ticket Heading
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
                    <SingleTickt />
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

export default SingleTicket;
