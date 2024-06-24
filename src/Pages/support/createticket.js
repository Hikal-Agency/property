import React from "react";
import CreateTicket from "../../Components/support/CreateTicket";
import Head from "next/head";
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
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default CreateTickets;
