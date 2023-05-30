// import Image from "next/image";
import React from "react";
import { useEffect } from "react";

import { useStateContext } from "../../../context/ContextProvider";
import OfficeSettings from "../../../Components/attendance/OfficeSettings";

const Settings = () => {
  const {
    currentMode,
    setopenBackDrop,
    setLocationData,
    BACKEND_URL,
    setUser,
    User,
  } = useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="px-5 ">
            <OfficeSettings />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Settings;
