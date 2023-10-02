import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { Box } from "@mui/material";

import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import usePermission from "../../utils/usePermission";

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

const Buyers = () => {
  const { currentMode, setopenBackDrop, pageState, BACKEND_URL } =
    useStateContext();
  const location = useLocation();
  const { hasPermission } = usePermission();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);

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
              currentMode === "dark" ? "bg-black" : "bg-white"
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
                  Fresh Leads <span className="capitalize">({lead_type})</span>{" "}
                  <span className="bg-primary text-white px-3 py-1 ml-2 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>

              {hasPermission("leadSource_counts") && (
                <div className="justify-self-end">
                  <div className="px-4">
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
                      {/* FACEBOOK  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                        // md:flex md:justify-between
                      >
                        <FaFacebookF size={16} color={"#0e82e1"} />
                        <span className="px-2">{pageState?.fbCounts}</span>
                      </Box>

                      {/* SNAPCHAT */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <FaSnapchatGhost size={16} color={"#f6d80a"} />
                        <span className="px-2">{pageState?.spCount}</span>
                      </Box>

                      {/* TIKTOK  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <FaTiktok
                          size={16}
                          color={currentMode === "dark" ? "white" : "black"}
                        />
                        <span className="px-2">{pageState?.ttCount}</span>
                      </Box>

                      {/* YOUTUBE  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <FaYoutube size={18} color={"#c4302b"} />
                        <span className="px-2">{pageState?.yCount}</span>
                      </Box>

                      {/* GOOGLE ADS  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <FcGoogle size={18} />
                        <span className="px-2">{pageState?.gCount}</span>
                      </Box>
                      {/* CAMPAIGNS  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <MdCampaign size={20} color={"#696969"} />
                        <span className="px-2">{pageState?.cCount}</span>
                      </Box>
                      {/* WEBSITE  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <TbWorldWww size={18} color={"#AED6F1"} />
                        <span className="px-2">{pageState?.webCount}</span>
                      </Box>
                      {/* WHATSAPP  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <FaWhatsapp size={18} color={"#46c254"} />
                        <span className="px-2">{pageState?.wCount}</span>
                      </Box>
                      {/* MESSAGE  */}
                      <Box
                        sx={{
                          padding: "5px 7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          background:
                            currentMode === "dark" ? "#000000" : "#FFFFFF",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow:
                            currentMode === "dark"
                              ? "0px 1px 1px rgba(66, 66, 66, 1)"
                              : "0px 1px 1px rgba(0, 0, 0, 0.25)",
                          height: "30px",
                          minWidth: "60px",
                          maxWidth: "100px",
                        }}
                      >
                        <BiMessageRoundedDots size={18} color={"#6A5ACD"} />
                        <span className="px-2">{pageState?.mCount}</span>
                      </Box>
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

export default Buyers;
