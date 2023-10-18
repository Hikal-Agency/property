import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

const Footer = () => {
  const { currentMode, themeBgImg } = useStateContext();
  return (
    <div
      className={`border-t border-t-1 text-sm border-primary flex justify-between items-center px-5 py-3 ${
        !themeBgImg ? (currentMode === "dark" ? "bg-black" : "bg-white")
        : (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
      }`}
      style={{
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: "0px",
        zIndex: "9999",
      }}
    >
      <h1
        className={`font-semibold ${
          currentMode === "dark" ? "text-[#CCCCCC]" : "text-[#1c1c1c]"
        }`}
      >
        Copyright © {new Date().getFullYear()}{" "}
        <Link
          to={"https://hikalagency.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold"
        >
          HIKAL
        </Link>
      </h1>
      <h1
        className={`${currentMode === "dark" ? "text-white" : "text-[#1c1c1c]"}`}
      >
        <span className="font-bold">Version</span> 1.8.0
      </h1>
    </div>
  );
};

export default Footer;
