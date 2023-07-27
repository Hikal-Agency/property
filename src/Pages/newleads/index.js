import Head from "next/head";
import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import Newleads from "../../Components/Leads/NewlLeads";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";

export async function getServerSideProps(context) {
  const BACKEND_URL_2 = process.env.REACT_APP_BACKEND_URL_2;

  return {
    props: { BACKEND_URL_2 },
  };
}

const NewLeads = (props) => {
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop } = useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
  });

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Head>
        <title>HIKAL CRM - New Leads</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head>

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
              <div className="pl-3">
                <div className="mt-3">
                  <h1
                    className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                   ● New leads{" "}
                    <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span>
                  </h1>
                  <Newleads
                    BACKEND_URL={props.BACKEND_URL_2}
                    pageState={pageState}
                    setpageState={setpageState}
                  />
                </div>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default NewLeads;
