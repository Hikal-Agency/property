// import Image from "next/image";
import React from "react";
import { useEffect } from "react";

import { useStateContext } from "../../../context/ContextProvider";
import OfficeSettings from "../../../Components/attendance/OfficeSettings";

const Settings = () => {
  const {
    currentMode,
    setopenBackDrop,
    themeBgImg
  } = useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full p-4  ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <OfficeSettings />
        </div>
      </div>
    </>
  );
};

export default Settings;
