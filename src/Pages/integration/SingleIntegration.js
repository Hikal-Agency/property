import React from "react";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import Twillio from "../twillio";
import Etisalat from "../etisalat";

const SingleIntegration = () => {
  const param = useParams();
  console.log("services::: ", param);
  const service = param?.service;
  const { t, currentMode } = useStateContext();

  const heading = {
    twillio: t("integrate_twillio"),
    etisalat: t("integrate_etisalat"),
  };

  return (
    <div>
      <div className="w-full flex items-center pb-3 mt-3 ml-3">
        <div className="bg-primary h-10 w-1 rounded-full"></div>
        <h1
          className={`text-lg font-semibold mx-2 uppercase ${
            currentMode === "dark" ? "text-white" : "text-black"
          }`}
        >
          {heading[service] || t("menu_integration")}
        </h1>
      </div>

      {service === "twillio" && <Twillio />}
      {service === "etisalat" && <Etisalat />}
    </div>
  );
};

export default SingleIntegration;
