import { CircularProgress } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Closedeals from "../../Components/Closedeals";
import Footer from "../../Components/Footer/Footer";
import AllLeads from "../../Components/Leads/AllLeads";
import Bookeddeals from "../../Components/Leads/BookedDeals";
import Newleads from "../../Components/Leads/NewlLeads";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

export async function getServerSideProps(context) {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const BACKEND_URL_2 = process.env.REACT_APP_BACKEND_URL_2;

  return {
    props: { BACKEND_URL_2 },
  };
}

const NewLeads = (props) => {
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const { User, setUser, currentMode, setopenBackDrop } = useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
  });
  const FetchProfile = async (token) => {
    await axios
      .get(`${props.BACKEND_URL_2}/profile`, {
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
        router.push({
          pathname: "/",
          query: { error: "Something Went Wrong! Please Try Again " },
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
        router.push({
          pathname: "/",
          query: { error: "Something Went Wrong! Please Try Again" },
        });
      }
    }
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
            <div className="flex">
              <Sidebarmui />
              <div className={`w-full `}>
                <div className="px-5">
                  <Navbar />
                  <div className="mt-3">
                    <h1
                      className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      New leads{" "}
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
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default NewLeads;
