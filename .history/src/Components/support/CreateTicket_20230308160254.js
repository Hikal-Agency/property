
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

const CreateTicket = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} w-full h-full rounded-md p-3`}>
      {/* <img
        height={1000}
        width={1000}
        src="/WhatsApp Image 2023-02-04 at 6.59.11 PM (1).jpeg"
        className="h-full w-full object-cover"
        alt=""
      /> */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
        <div className="space-3">
          djj
        </div>
        <div className="space-3">
          dnjimage 
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;
