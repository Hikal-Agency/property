
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import { Box } from "@mui/material";

import {
  FaFacebookF,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
  FaWhatsapp
} from "react-icons/fa";
import {
  FcGoogle
} from "react-icons/fc";
import {
  MdCampaign
} from "react-icons/md";
import {
  TbWorldWww
} from "react-icons/tb";
import {
  BiMessageRoundedDots
} from "react-icons/bi";

const AllUnassignedLeads = () => {
  const {
    User,
    setUser,
    currentMode,
    setopenBackDrop,
    pageState,
    BACKEND_URL,
  } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);
  const [dataTableChanged, setDataTableChanged] = useState(false);
  const { hasPermission } = usePermission();

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
      <div className={`w-full p-4 flex min-h-screen ${
        currentMode === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
            <div className="w-full">
              <div className="w-full flex items-center py-1">
                <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark"
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {/* ●  */}
                  Unassigned Leads {" "}
                  <span className="capitalize">({lead_type})</span>{" "}
                  <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>

              <AllLeads
                BACKEND_URL={BACKEND_URL}
                lead_type={lead_type}
                lead_origin={pathname2}
                leadCategory="hot"
              />
            </div>
        )}
      </div>
    </>
  );
};

export default AllUnassignedLeads;
