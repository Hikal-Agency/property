import React from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";

const SingleIntegration = () => {
  const service = useParams();
  console.log("services::: ", service);
  const { t, currentMode } = useStateContext();

  return (
    <div>
      <div className="w-full flex items-center pb-3 mt-3 ml-3">
        <div className="bg-primary h-10 w-1 rounded-full"></div>
        <h1
          className={`text-lg font-semibold mx-2 uppercase ${
            currentMode === "dark" ? "text-white" : "text-black"
          }`}
        >
          {t("menu_integration")}
        </h1>
      </div>
    </div>
  );
};

export default SingleIntegration;
