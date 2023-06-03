import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BookedDeals from "../../Components/Leads/BookedDeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { MdCampaign } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsSnow2 } from "react-icons/bs";
import { Box } from "@mui/material";
import { FaTiktok } from "react-icons/fa";
import { RiMessage2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";

const Booked = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, BACKEND_URL, pageState } =
    useStateContext();

  console.log("Booked State: ", pageState);

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Booked Deals</title>
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
                <div className=" w-full flex items-center justify-between">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1  font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    Booked Deals -{" "}
                    {/* <span className="capitalize">{lead_type}</span>{" "} */}
                    <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                      {pageState?.total}
                    </span>
                  </h1>
                  <div className="justify-self-end">
                    <div className=" px-4 py-8">
                      <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-8 gap-4">
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: " #da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "40px",
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "40px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "40px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
                          >
                            <FaTiktok
                              size={22}
                              color={"#f6d80a"}
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "40px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "40px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            justifySelf: "end",
                            height: "40px",
                            width: "70px",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            justifySelf: "end",
                            height: "40px",
                            width: "70px",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
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
                            padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: "#da1f26",
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            justifySelf: "end",
                            height: "40px",
                            width: "70px",
                          }}
                        >
                          <span
                            style={{ background: "white", borderRadius: "50%" }}
                          >
                            <FaWhatsapp
                              size={22}
                              color={"#0e82e1"}
                              style={{ padding: "3px" }}
                            />
                          </span>
                          <span>{pageState?.wCount}</span>
                        </Box>
                      </div>
                    </div>
                  </div>
                </div>
                <BookedDeals
                  BACKEND_URL={BACKEND_URL}
                  // lead_type={lead_type}
                  // lead_origin={pathname2}
                  // leadCategory="hot"
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

export default Booked;
