import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const TransferredLeads = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const {
    User,
    setUser,
    currentMode,
    pageState,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM -Transffered Leads</title>
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
            <div className={`w-full`}>
              <div className="pl-3">
                <div className=" w-full flex items-center justify-between">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 my-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    ● Reshuffle Leads{" "}
                    <span className="capitalize">({lead_type})</span>{" "}
                    <span className="bg-main-red-color text-white px-3 py-3 rounded-sm my-auto">
                      {pageState?.total}
                    </span>
                  </h1>
                  {/* <div className="justify-self-end">
                    <div className=" px-4 py-8">
                      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-4">
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: `${
                              currentMode === "dark" ? "#202020" : "#fafafa"
                            }`,
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "70px",
                          }}
                        >
                          <span>
                            <FaFacebook size={22} color={"#0e82e1"} />
                          </span>
                          <span>{pageState?.fbCounts}</span>
                        </Box>
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: `${
                              currentMode === "dark" ? "#202020" : "#fafafa"
                            }`,
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span>
                            <FaSnapchat size={22} color={"#f6d80a"} />
                          </span>
                          <span>{pageState?.spCount}</span>
                        </Box>
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: `${
                              currentMode === "dark" ? "#202020" : "#fafafa"
                            }`,
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span>
                            <img
                              src={"/assets/tiktok-app.svg"}
                              alt=""
                              height={22}
                              width={22}
                              className="object-cover"
                            />
                          </span>
                          <span>{pageState?.ttCount}</span>
                        </Box>
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: `${
                              currentMode === "dark" ? "#202020" : "#fafafa"
                            }`,
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span>
                            <FcGoogle size={22} />
                          </span>
                          <span>{pageState?.gCount}</span>
                        </Box>
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: `${
                              currentMode === "dark" ? "#202020" : "#fafafa"
                            }`,
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "70px",
                            justifySelf: "end",
                          }}
                        >
                          <span>
                            <MdCampaign
                              size={22}
                              color={`${
                                currentMode === "dark" ? "#ffffff" : "#000000"
                              }`}
                            />
                          </span>
                          <span>{pageState?.cCount}</span>
                        </Box>
                        <Box
                          sx={{
                            padding: "10px",
                            borderRadius: "10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background: `${
                              currentMode === "dark" ? "#202020" : "#fafafa"
                            }`,
                            color: `${
                              currentMode === "dark" ? "#ffffff" : "#000000"
                            }`,
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            justifySelf: "end",
                            height: "70px",
                            width: "70px",
                          }}
                        >
                          <span>
                            <BsSnow2 size={22} color={"#0ec7ff"} />
                          </span>
                          <span>{pageState?.coCount}</span>
                        </Box>
                      </div>
                    </div>
                  </div> */}
                </div>
                <AllLeads
                  BACKEND_URL={BACKEND_URL}
                  lead_origin="transfferedleads"
                  lead_type={lead_type}
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

export default TransferredLeads;
