import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import AllLeads from "../../Components/Leads/AllLeads";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";

const ColdLeads = () => {
  const location = useLocation();
  const lead_type2 = location.pathname.split("/")[2];
  var lead_type = lead_type2.replace(/%20/g, " ");
  const pathname2 = location.pathname.split("/")[1];
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    pageState,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
  }, []);

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM -All Cold Leads</title>
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
                  <Navbar />
                  <div className="mt-3">
                    <h1
                      className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-main-red-color font-bold border-main-red-color"
                      }`}
                    >
                      Cold Leads -{" "}
                      <span className="uppercase">{lead_type}</span>{" "}
                      <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                        {pageState?.total}
                      </span>
                    </h1>
                    <AllLeads
                      BACKEND_URL={BACKEND_URL}
                      lead_type={lead_type}
                      lead_origin={pathname2}
                      leadCategory="cold"
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

export default ColdLeads;
