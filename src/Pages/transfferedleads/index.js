import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import TransferTabs from "./TransferTabs";
import { Box } from "@mui/material";

const TransferredLeads = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    pageState,
    setopenBackDrop,
    BACKEND_URL,
    t,
    themeBgImg,
    darkModeColors,
  } = useStateContext();

  const leadTypes = [
    {
      name: "Fresh Leads",
      value: "freshleads",
    },
    {
      name: "Third Party",
      value: "thirdpartyleads",
    },
    {
      name: "Archived",
      value: "archive",
    },
    {
      name: "Personal",
      value: "personalleads",
    },
    {
      name: "Cold",
      value: "coldleads",
    },
    {
      name: "Secondary",
      value: "buyers",
    },
    {
      name: "Live",
      value: "liveleads",
    },
  ];

  const [value, setValue] = useState(leadTypes[0]?.value);
  const handleChange = (event, newValue) => {
    console.log("NEw tab value:: ", newValue);
    setValue(newValue);
  };

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
                {`${t("reshuffled")} ${t("leads")}`}{" "}
                <span className="capitalize">({t(value)})</span>{" "}
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
                  className={`w-full mb-4 rounded-md overflow-hidden ${
                    !themeBgImg
                      ? currentMode === "dark"
                        ? "bg-[#1C1C1C]"
                        : "bg-[#EEEEEE]"
                      : currentMode === "dark"
                      ? "blur-bg-dark"
                      : "blur-bg-light"
                  }`}
                >
                  <TransferTabs
                    leadTypes={leadTypes}
                    value={value}
                    setValue={setValue}
                    handleChange={handleChange}
                  />
                </Box>
              </div>
            </div>
            {/* TABS END */}
            <AllLeads
              BACKEND_URL={BACKEND_URL}
              lead_origin={value}
              lead_type={value}
              transferRequest="transferleads"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TransferredLeads;
