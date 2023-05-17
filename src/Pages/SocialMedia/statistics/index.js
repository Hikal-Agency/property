import React, { useState } from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import Sidebarmui from "../../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../../context/ContextProvider";
import Footer from "../../../Components/Footer/Footer";
import { useEffect } from "react";
import Loader from "../../../Components/Loader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AllStatistics from "../../../Components/campaigns/AllStatistics";

const Statistics = () => {
  const { User, setUser, currentMode, setopenBackDrop, BACKEND_URL } =
    useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
    } else {
      const token = localStorage.getItem("auth-token");
      if (token) {
        // FetchProfile(token);
        const user = localStorage.getItem("user");
        console.log("User in add lead: ", user);
        setUser(JSON.parse(user));
        setloading(false);
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Lead Notes</title>
        <meta name="description" content="Meetings - HIKAL CRM" />
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
              <div className={`w-full `}>
                <div className="px-5">
                  <Navbar />
                  {/* <div className="mt-3">
                    <h1
                      className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      Statistics{" "}
                      <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                        <span>{pageState?.total}</span>
                      </span>
                    </h1>
                    <AllNewsletters
                      pageState={pageState}
                      setpageState={setpageState}
                    />
                  </div> */}
                  <div className="mt-3 flex justify-between items-center">
                    <h1
                      className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      Statistics
                      {/* <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                        <span>{pageState?.total}</span>
                      </span> */}
                    </h1>
                  </div>
                  <AllStatistics
                    pageState={pageState}
                    setpageState={setpageState}
                  />
                </div>
              </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default Statistics;
