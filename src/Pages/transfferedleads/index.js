import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

const TransferredLeads = (props) => {
  const navigate = useNavigate(); const location = useLocation();
  const [loading, setloading] = useState(true);
  const {
    User,
    setUser,
    currentMode,
    pageState,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUser(result.data.user[0]);
        setloading(false);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again ", continueURL: location.pathname },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
    } else {
      const token = localStorage.getItem("auth-token");
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
        });
      }
    }
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
            <div className="flex">
              <Sidebarmui />
              <div className={`w-full`}>
                <div className="px-5">
                  <Navbar />
                  <div className="mt-3">
                    <h1
                      className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-main-red-color font-bold border-main-red-color"
                      }`}
                    >
                      Transffered Leads{" "}
                      <span className="bg-main-red-color text-white px-3 py-1 rounded-sm text-sm my-auto">
                        Total: <span>({pageState?.total})</span>
                      </span>
                    </h1>
                    <AllLeads
                      BACKEND_URL={BACKEND_URL}
                      lead_origin="transfferedleads"
                    />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default TransferredLeads;
