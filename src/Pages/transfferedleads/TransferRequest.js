import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import { Box, Tab, Tabs } from "@mui/material";

const TransferRequest = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    pageState,
    setopenBackDrop,
    BACKEND_URL,
    t,
    darkModeColors,
    themeBgImg,
  } = useStateContext();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [tabValue, setTabValue] = useState(0);

  //   const lead_type2 = location.pathname.split("/")[2];
  //   var lead_type = lead_type2.replace(/%20/g, " ");
  var lead_type = "new";

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {`${t("menu_reshuffled_request")} `}{" "}
                <span className="capitalize">
                  (
                  {t(
                    "feedback_" + lead_type?.toLowerCase()?.replaceAll(" ", "_")
                  )}
                  )
                </span>{" "}
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>

            {/* TABS */}
            <div className="grid grid-cols-1">
              <div className={``}>
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
                  className={`w-full rounded-md overflow-hidden ${
                    !themeBgImg
                      ? currentMode === "dark"
                        ? "bg-[#1C1C1C]"
                        : "bg-[#EEEEEE]"
                      : currentMode === "dark"
                      ? "blur-bg-dark"
                      : "blur-bg-light"
                  }`}
                >
                  <div className="flex justify-between">
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      variant="standard"
                      className="w-full px-1 m-1"
                    >
                      <Tab label={t("fresh")} />
                      <Tab label={t("menu_thirdparty")} />
                      <Tab label={t("menu_archived")} />
                      <Tab label={t("menu_secondary")} />
                      <Tab label={t("menu_cold")} />
                      <Tab label={t("menu_personal")} />
                      <Tab label={t("menu_location_live")} />
                    </Tabs>
                  </div>
                </Box>
                <div className="pb-5">
                  <TabPanel value={value} index={0}>
                    {/* <CallLogBoard
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                    /> */}
                    {/* <AllLeads
                      BACKEND_URL={BACKEND_URL}
                      lead_origin="transfferedleads"
                      lead_type={lead_type}
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                    /> */}
                  </TabPanel>
                </div>
              </div>
            </div>
            {/* TABS END */}

            <AllLeads
              BACKEND_URL={BACKEND_URL}
              lead_origin="transfferedleads"
              lead_type={lead_type}
            />
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

export default TransferRequest;
