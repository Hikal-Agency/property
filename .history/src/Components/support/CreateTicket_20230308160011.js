
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

const CreateTicket = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={`${currentMode === "dark" ? "bg-gray-900 text-white" : "bg-gray-200 text-black"} w-full h-full rounded-md`}>
      {/* <img
        height={1000}
        width={1000}
        src="/WhatsApp Image 2023-02-04 at 6.59.11 PM (1).jpeg"
        className="h-full w-full object-cover"
        alt=""
      /> */}
      <Form>

      </Form>
    </div>
  );
};

export default CreateTicket;
