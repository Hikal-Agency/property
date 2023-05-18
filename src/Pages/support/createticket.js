import Image from "next/image";
import React from "react";import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import CreateTicket from "../../Components/support/CreateTicket";
import Head from "next/head";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";

const CreateTickets = () => {
  const { currentMode } = useStateContext();

  return (
    <>
      <Head>
        <title>HIKAL CRM - Location</title>
        <meta name="description" content="Location - HIKAL CRM" />
      </Head>
      <div className="min-h-screen">
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5 ">
              
              <CreateTicket />
            </div>
            <Footer />
          </div>
      </div>
    </>
    
  );
};

export default CreateTickets;
