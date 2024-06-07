import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import StatmentsList from "../../Components/StatmentComp/StatmentsList";

const Statements = ({ isLoading }) => {
  const {
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg,
    pageState,
    t,
  } = useStateContext();

  const [loading, setLoading] = useState(false);
  const [openVendorModal, setOpenVendorModal] = useState(false);

  const HandleOpenModel = () => {
    setOpenVendorModal(true);
  };

  useEffect(() => {
    setopenBackDrop(false);
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
            <div className="w-full flex justify-between items-center">
              <div className="w-full flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("menu_statements")}
                </h1>
              </div>
            </div>

            <div className="pb-3">
              <StatmentsList />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Statements;
