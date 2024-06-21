import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import TransferTabs from "./TransferTabs";
import { Box } from "@mui/material";
import { lead_category } from "../../Components/_elements/SelectOptions";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

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

  // const leadTypes = [
  //   {
  //     name: "Fresh Leads",
  //     value: "freshleads",
  //   },
  //   {
  //     name: "Third Party",
  //     value: "thirdpartyleads",
  //   },
  //   {
  //     name: "Archived",
  //     value: "archive",
  //   },
  //   {
  //     name: "Personal",
  //     value: "personalleads",
  //   },
  //   {
  //     name: "Cold",
  //     value: "coldleads",
  //   },
  //   {
  //     name: "Secondary",
  //     value: "buyers",
  //   },
  //   {
  //     name: "Live",
  //     value: "liveleads",
  //   },
  // ];

  const [value, setValue] = useState(lead_category(t)[0]?.value);
  const handleChange = (event, newValue) => {
    console.log("New tab value:: ", newValue);
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
            className={`w-full p-5 mt-2 ${
              !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
            }`}
          >
            <HeadingTitle
              title={`${t("reshuffled")} ${t("leads")}`}
              subtitle={t(value)}
              counter={pageState?.total}
            />

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
                        ? "bg-dark-neu"
                        : "bg-light-neu"
                      : currentMode === "dark"
                      ? "blur-bg-dark"
                      : "blur-bg-light"
                  }`}
                >
                  <TransferTabs
                    leadTypes={lead_category(t)}
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
