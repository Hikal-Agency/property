// import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { Box } from "@mui/material";
import { MdCampaign } from "react-icons/md";
import { FaGlobe, FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsSnow2 } from "react-icons/bs";
import { FaTiktok } from "react-icons/fa";
import { RiMessage2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import usePermission from "../../utils/usePermission";

const AllHotLeads = () => {
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
  const {hasPermission} = usePermission();
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
      {/* <Head>
        <title>HIKAL CRM - Hot Leads: All</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head> */}

      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="w-full pl-3">
              <div className="w-full">
                <div className=" w-full flex my-4 items-center justify-between">
                  <h1
                    className={`text-lg ml-1 pl-1 border-l-[4px] font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold"
                    }`}
                  >
                    ● Fresh Leads{" "}
                    <span className="capitalize">({lead_type})</span>{" "}
                    <span className="bg-main-red-color text-white px-3 py-1 ml-2 rounded-sm my-auto">
                      {pageState?.total}
                    </span>
                  </h1>
                  {hasPermission("leadSource_counts") && (
                    <div className="justify-self-end">
                      <div className=" px-4">
                        <div className="grid grid-cols-1 md:grid-cols-9 lg:grid-cols-9 gap-4">
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              height: "30px",
                              width: "70px",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <FaFacebook
                                size={22}
                                color={"#0e82e1"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.fbCounts}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",

                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              height: "30px",
                              width: "70px",
                              justifySelf: "end",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <FaSnapchat
                                size={22}
                                color={"#f6d80a"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.spCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              height: "30px",
                              width: "70px",
                              justifySelf: "end",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <FaGlobe
                                size={22}
                                color={"#14539A"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.webCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              height: "30px",
                              width: "70px",
                              justifySelf: "end",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <FaTiktok
                                size={22}
                                color={"#000000"}
                                style={{ padding: "3px" }}
                              />

                              {/* <img
                              src={"/assets/tiktok-app.svg"}
                              alt=""
                              height={22}
                              width={22}
                              className="object-cover"
                            /> */}
                            </span>
                            <span>{pageState?.ttCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              height: "30px",
                              width: "70px",
                              justifySelf: "end",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <FcGoogle
                                size={22}
                                color={"#0e82e1"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.gCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              height: "30px",
                              width: "70px",
                              justifySelf: "end",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <MdCampaign
                                size={22}
                                color={"#0e82e1"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.cCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              justifySelf: "end",
                              height: "30px",
                              width: "70px",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <BsSnow2
                                size={22}
                                color={"#0e82e1"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.coCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              justifySelf: "end",
                              height: "30px",
                              width: "70px",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <RiMessage2Line
                                size={22}
                                color={"#0e82e1"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.mCount}</span>
                          </Box>
                          <Box
                            sx={{
                              padding: "6px",
                              borderRadius: "7px",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontWeight: "bold",
                              background:
                                currentMode === "dark" ? "#3b3d44" : "white",
                              color: currentMode === "dark" ? "white" : "black",
                              boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                              justifySelf: "end",
                              height: "30px",
                              width: "70px",
                            }}
                          >
                            <span
                              style={{
                                background: "white",
                                borderRadius: "50%",
                              }}
                            >
                              <FaWhatsapp
                                size={22}
                                color={"#29EC62"}
                                style={{ padding: "3px" }}
                              />
                            </span>
                            <span>{pageState?.wCount}</span>
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
            </div>

            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default AllHotLeads;
