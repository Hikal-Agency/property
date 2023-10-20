import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import {IoMdAdd} from "react-icons/io";
import { Button } from "@mui/material";
import AddLeadModal from "../../Components/whatsapp-marketing/AddLeadModal";


const Buyers = () => {
  const { 
    currentMode, 
    setopenBackDrop, 
    pageState, 
    BACKEND_URL, 
    t,
    themeBgImg 
  } = useStateContext();
  const location = useLocation();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [createLeadModalOpen, setCreateLeadModalOpen] = useState(false);
  const [loading, setloading] = useState(true);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);

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
            {/* <div className="grid-cols-1 md:grid-cols-1 lg:grid-cols-2 w-full lg:flex lg:items-center lg:justify-between"> */}
              <div className="flex justify-between items-center">
                <div className="flex items-center pb-3">
                  <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                  <h1
                    className={`text-lg font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                   {t("secondary_leads")} <span className="capitalize">({lead_type})</span>{" "}
                    <span className="bg-primary text-white px-3 py-1 ml-2 rounded-sm my-auto">
                      {pageState?.total}
                    </span>
                  </h1>
                </div>
                <Button
                  variant="contained"
                  className="bg-btn-primary flex items-center gap-x-3 px-2"
                  size="small"
                  onClick={() => setCreateLeadModalOpen(true)}
                >
                  <IoMdAdd size={16} />
                  {t("button_add_new_lead")}
                </Button>
              </div>
            {/* </div> */}
            
            <AllLeads
            key={key}
              BACKEND_URL={BACKEND_URL}
              lead_type={lead_type}
              lead_origin={pathname2}
              leadCategory="hot"
            />
          </div>
        )}
      </div>

      
      {createLeadModalOpen && (
        <AddLeadModal
        noSourceDropdown={true}
        FetchLeads={() => setKey((key) => key + 1)}
          addLeadModalOpen={createLeadModalOpen}
          handleCloseAddLeadModal={() => setCreateLeadModalOpen(false)}
        />
      )}
    </>
  );
};

export default Buyers;
