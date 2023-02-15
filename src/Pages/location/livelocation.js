import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import LocationComponent from "../../Components/location/LocationComponent";
import Head from "next/head";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";

const Livelocation = () => {
  const { currentMode, setopenBackDrop } = useStateContext();
  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Head>
        <title>HIKAL CRM - Location</title>
        <meta name="description" content="Location - HIKAL CRM" />
      </Head>
      <div className="min-h-screen">
        <div className="flex">
          <Sidebarmui />
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5 ">
              <Navbar />
              {/* <LocationComponent /> */}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Livelocation;
