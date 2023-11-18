
import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import {
  Box,
  Tooltip,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import {
  BiImport,
  BiArchive,
  BiMessageRoundedDots
} from "react-icons/bi";
import {
  BsSnow2,
  BsPersonCircle
} from "react-icons/bs";
import {
  FaFacebookF,
  FaSnapchatGhost,
  FaTiktok,
  FaYoutube,
  FaTwitter,
  FaWhatsapp,
  FaRegComments
} from "react-icons/fa";
import {
  FcGoogle
} from "react-icons/fc";
import {
  GiMagnifyingGlass
} from "react-icons/gi";
import {
  MdImportantDevices,
  MdCampaign
} from "react-icons/md";
import {
  TbWorldWww
} from "react-icons/tb";

const AllUnassignedLeads = () => {
  const {
    currentMode,
    setopenBackDrop,
    pageState,
    BACKEND_URL,
    t,
    themeBgImg,
    primaryColor,
    Counters,
    User
  } = useStateContext();
  
  const location = useLocation();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);

  const { hasPermission } = usePermission();

  const sourceCounters = {
    "Campaign Facebook": <FaFacebookF size={14} color={"#0e82e1"} />,
    "Campaign Snapchat": <FaSnapchatGhost size={16} color={"#f6d80a"} />,
    "Campaign TikTok": <FaTiktok size={14} color={currentMode === "dark" ? "white" : "black"} />,
    "Campaign YouTube": <FaYoutube size={18} color={"#c4302b"} />,
    "Campaign GoogleAds": <FcGoogle size={18} />,
    "Campaign Twitter": <FaTwitter size={16} color={"#00acee"} />,
    "Campaign": <MdCampaign size={16} color={"#696969"} />,
    "WhatsApp": <FaWhatsapp size={16} color={"#53cc60"} />,
    "Message": <BiMessageRoundedDots size={16} color={"#6A5ACD"} />,
    "Comment": <FaRegComments size={16} color={"#a9b3c6"} />,
    "Website": <TbWorldWww size={16} color={"#AED6F1"} />,
    "Property Finder": <GiMagnifyingGlass size={16} color={"#ef5e4e"} />,
    "Bulk Import": <BiImport size={16} color={primaryColor} />,
    "Warm": <BiArchive size={16} color={"#AEC6CF"} />,
    "Cold": <BsSnow2 size={16} color={"#0ec7ff"} />,
    "Personal": <BsPersonCircle size={16} color={"#6C7A89"} />,
  };

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
    <div>
      <div className={`w-full p-4 flex min-h-screen ${
        !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full">
            <div className="w-full">
              <div className="w-full flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {`${t("unassigned")} ${t("leads")}`} {" "}
                  <span className="capitalize">({t("type_" + lead_type?.toLowerCase()?.replaceAll(" ", "_"))})</span>{" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>
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
    </div>
  );
};

export default AllUnassignedLeads;
