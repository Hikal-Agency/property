import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import CreateTicket from "../../Components/support/CreateTicket";
import AllTickets from "../../Components/support/AllTickets";
import Loader from "../../Components/Loader";

import axios from "../../axoisConfig";
import { useSearchParams } from "react-router-dom";
import AllCategories from "../../Components/support/AllCategories";

const Tickets = () => {
  const {
    currentMode,
    darkModeColors,
    BACKEND_URL,
    t,
    themeBgImg,
    value,
    setValue,
  } = useStateContext();
  // const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/categories`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = response.data.cagtegories;
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchParams.get("default")) {
      if (searchParams.get("default") === "all") {
        setValue(1);
      }
    }
  }, [searchParams]);

  return (
    <>
      {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <h4
              className={`font-semibold p-5 text-center text-2xl ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              {t("welcome_to")}{" "}
              <span
                className={`${
                  !themeBgImg
                    ? "text-primary"
                    : currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                } font-bold`}
              >
                HIKAL CRM
              </span>
              ! {t("here_to_assist")}.
            </h4>
            <div
              className={`${
                !themeBgImg
                  ? currentMode === "dark"
                    ? "bg-[#1c1c1c] text-white"
                    : "bg-gray-200 text-black"
                  : currentMode === "dark"
                  ? "blur-bg-dark text-white"
                  : "blur-bg-light text-black"
              } p-4 rounded-xl shadow-sm my-5 mb-10`}
            >
              <Box
                sx={{
                  ...darkModeColors,
                  "& .MuiTabs-indicator": {
                    height: "100%",
                    borderRadius: "5px",
                  },
                  "& .Mui-selected": {
                    color: "white !important",
                    zIndex: "1",
                  },
                }}
                className={`w-full rounded-md overflow-hidden`}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  variant="standard"
                  // centered
                  className="w-full px-1 m-1"
                >
                  <Tab label={t("create_new_ticket")} />
                  <Tab label={t("all_tickets")} />
                  <Tab label={t("ticket_tab_category")} />
                </Tabs>
              </Box>
              <div className="mt-3 pb-3">
                <TabPanel value={value} index={0}>
                  <CreateTicket
                    categories={categories}
                    setCategories={setCategories}
                    fetchCategories={fetchCategories}
                    loading={loading}
                  />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <AllTickets categories={categories} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <AllCategories
                    categories={categories}
                    setCategories={setCategories}
                    fetchCategories={fetchCategories}
                  />
                </TabPanel>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Tickets;
