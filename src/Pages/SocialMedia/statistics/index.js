import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { useEffect } from "react";
import Loader from "../../../Components/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import AllStatistics from "../../../Components/campaigns/AllStatistics";

const Statistics = () => {
  const { User, setUser, currentMode, setopenBackDrop, } =
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
      <div className="flex min-h-screen p-3 mb-4">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full `}>
                <AllStatistics
                  pageState={pageState}
                  setpageState={setpageState}
                />
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default Statistics;
