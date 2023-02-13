import Image from "next/image";
import React from "react";import { useEffect, useState } from "react";
import UserImage from "../../public/favicon.png";
import { useStateContext } from "../../context/ContextProvider";

const CreateTicket = () => {
  const { currentMode } = useStateContext();

  return (
    <div className="h-screen overflow-none">
      <Image
        height={1000}
        width={1000}
        src="/WhatsApp Image 2023-02-04 at 6.59.11 PM (1).jpeg"
        className="h-full w-full object-cover"
        alt=""
      />
    </div>
  );
};

export default CreateTicket;
