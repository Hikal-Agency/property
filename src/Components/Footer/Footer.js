import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

const Footer = () => {
  const { currentMode } = useStateContext();
  return (
    <div
      className={`mt-5 border-t-2 border-main-red-color flex justify-between items-center px-5 py-4 ${
        currentMode === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h1
        className={`font-bold ${
          currentMode === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Copyright © 2023{" "}
        <Link
          to={"https://hikalagency.com/"}
          target="_blank"
          className="text-main-red-color"
        >
          HIKAL
        </Link>
      </h1>
      <h1
        className={`${currentMode === "dark" ? "text-white" : "text-gray-900"}`}
      >
        <span className="font-bold">Version</span> 1.8.0
      </h1>
    </div>
  );
};

export default Footer;
