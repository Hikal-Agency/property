import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Integration = () => {
  const { currentMode, t } = useStateContext();
  const integrations = [
    {
      heading: t("integrate_twillio"),
      logo: "../assets/sms-services-logo/twillio.png",
      button_text: t("twillio_add"),
      link: "/integrations/twillio",
    },
    {
      heading: t("integrate_etisalat"),
      logo: "../assets/sms-services-logo/etisalat.png",
      button_text: t("etisalat_add"),
      link: "/integrations/etisalat",
    },
  ];
  return (
    <>
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

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 ml-3 mt-3">
        {integrations &&
          integrations?.map((integrate) => (
            <div className=" pb-4 text-center mr-3">
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-[#1c1c1c] text-white"
                    : "bg-[#EEEEEE] text-black"
                } p-5 rounded-md h-fit`}
              >
                <h1
                  className="bg-primary text-white font-semibold rounded-md p-2 mb-6"
                  style={{ textTransform: "capitalize" }}
                >
                  {integrate?.heading}
                </h1>
                <h6 className="mb-6 p-2">
                  <label htmlFor="pick-image">
                    <div
                      className={`relative flex items-center justify-center mx-auto w-28 h-28  rounded-full bg-[#fff]`}
                    >
                      <img src={integrate?.logo} />
                    </div>
                  </label>
                </h6>
                <hr className="mb-3"></hr>

                <Link to={integrate?.link}>
                  <div
                    className={`bg-primary text-white px-4 text-center sm:px-6 mb-3 py-2`}
                  >
                    <h1 className="text-white font-bold">
                      {integrate?.button_text}
                    </h1>
                  </div>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Integration;
