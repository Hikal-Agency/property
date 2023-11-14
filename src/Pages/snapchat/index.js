import React from "react";
import { useStateContext } from "../../context/ContextProvider";


const Snapchat = () => {
  const { t, themeBgImg, currentMode } =
    useStateContext();

  return (
    <>
      
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="bg-primary h-10 w-1 rounded-full"></div>
          <h1
            className={`text-lg font-semibold mx-2 uppercase ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            Snapchat
          </h1>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Snapchat;
