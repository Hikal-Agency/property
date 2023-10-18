import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { Box } from "@mui/material";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { BiMessageRoundedDots } from "react-icons/bi";
import {
  FaSnapchatGhost,
  FaYoutube,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { MdCampaign } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import { toast } from "react-toastify";
import moment from "moment";
import { GiMagnifyingGlass } from "react-icons/gi";

const AllHotLeads = () => {
  const { currentMode, setopenBackDrop, pageState, BACKEND_URL, t, themeBgImg } =
    useStateContext();
  const location = useLocation();
  const { hasPermission } = usePermission();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);
  const token = localStorage.getItem("auth-token");
  const [counters, setCounter] = useState([]);

  const sourceCounters = {
    "Campaign Facebook": <FaFacebookF size={14} color={"#0e82e1"} />,
    "Campaign Snapchat": <FaSnapchatGhost size={16} color={"#f6d80a"} />,
    "Campaign TikTok": (
      <FaTiktok size={16} color={currentMode === "dark" ? "white" : "black"} />
    ),
    "Campaign YouTube": <FaYoutube size={18} color={"#c4302b"} />,
    "Campaign GoogleAds": <FcGoogle size={18} />,
    "Property Finder": <GiMagnifyingGlass size={16} color={"#ef5e4e"} />,
  };

  const fetchCounter = async () => {
    const currentDate = moment().format("YYYY-MM-DD");
    // const currentDate = "2023-01-01";
    try {
      const callCounter = await axios.get(
        `${BACKEND_URL}/totalSource?date=${currentDate}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("counter===> :", callCounter);

      setCounter(callCounter?.data?.data?.query_result);
    } catch (error) {
      console.log("Error::: ", error);
      toast.error("Unable to fetch count.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    fetchCounter();
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
            <div className="grid-cols-1 md:grid-cols-1 lg:grid-cols-2 w-full lg:flex lg:items-center lg:justify-between">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {`${t("fresh")} ${t("leads")}`}{" "}
                  <span className="capitalize">
                    (
                    {t(
                      "feedback_" +
                        lead_type?.toLowerCase()?.replaceAll(" ", "_")
                    )}
                    )
                  </span>{" "}
                  <span className="bg-primary text-white px-3 py-1 ml-2 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>

              {hasPermission("leadSource_counts") && (
                <div className="justify-self-end">
                  <div className="px-4">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
                      {counters && counters?.length > 0
                        ? counters?.map((counter) => (
                            <Box
                              sx={{
                                padding: "5px 7px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background:
                                  currentMode === "dark"
                                    ? "#000000"
                                    : "#FFFFFF",
                                color:
                                  currentMode === "dark" ? "white" : "black",
                                boxShadow:
                                  currentMode === "dark"
                                    ? "0px 1px 1px rgba(66, 66, 66, 1)"
                                    : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                                height: "30px",
                                minWidth: "60px",
                                maxWidth: "100px",
                              }}
                            >
                              {sourceCounters[counter?.leadSource]}
                              <span className="px-2">{counter?.count}</span>
                            </Box>
                          ))
                        : ""}
                    </div>
                  </div>
                </div>
              )}
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

export default AllHotLeads;
