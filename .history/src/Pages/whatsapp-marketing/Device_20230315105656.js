import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import DeviceComponent from "../../Components/whatsapp-marketing/DeviceComponent";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";

const Device = () => {
  const { currentMode } = useStateContext();

  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Device</title>
        <meta name="description" content="Device - HIKAL CRM" />
      </Head> */}
      <div className="min-h-screen">
        <div className="flex">
          <Sidebarmui />
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5">
              <Navbar />
              <DeviceComponent />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Device;
