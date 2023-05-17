import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import BookedDeals from "../../Components/Leads/BookedDeals";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

const Booked = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    pageState,
  } = useStateContext();

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
              <div className={`w-full `}>
                <div className="px-5">
                  
                  <div className="mt-3">
                    <h1
                      className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      Booked deals{" "}
                      <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                        <span>{pageState?.total}</span>
                      </span>
                    </h1>
                    <BookedDeals
                      BACKEND_URL={BACKEND_URL}
                      // pageState={pageState}
                      // setpageState={setpageState}
                    />
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

export default Booked;
