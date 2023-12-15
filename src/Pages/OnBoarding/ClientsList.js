import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import OnBoardingForm from "../../Components/OnBoardingComp/OnBoardingForm";
import ClientsListComp from "../../Components/OnBoardingComp/ClientsListComp";

const ClientsList = () => {
  const {
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg,
    t,
  } = useStateContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
            }
            ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("menu_clientsList")}
              </h1>
            </div>

            <div className="mt-3 pb-3">
              <ClientsListComp isLoading={loading} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ClientsList;
