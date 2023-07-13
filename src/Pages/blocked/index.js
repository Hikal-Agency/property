import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { ToastContainer } from "react-toastify";

const BlockedIps = () => {
  const { currentMode, BACKEND_URL, Managers, SalesPerson } = useStateContext();
  const [IPs, setIPs] = useState([]);
  return (
    <>
      <ToastContainer />
      <div
        className={`w-full  ${
          currentMode === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div className="pl-3">
          <div className="mt-5 md:mt-2">
            <h1
              className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-main-red-color font-bold border-main-red-color"
              }`}
            >
              Blocked IPs
            </h1>

            {IPs?.length === 0 ? (
              <p style={{ color: "red" }}>Nothing to show!</p>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockedIps;
