import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import StatmentsList from "../../Components/StatmentComp/StatmentsList";
import Commission_VAT_List from "../../Components/Commission_VAT_Comp/Commission_VAT_List";

const Commission_VAT = ({ isLoading }) => {
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
            <div className="w-full flex justify-between items-center">
              <div className="w-full flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("title_commission_vat")}
                </h1>
              </div>
            </div>

            <div className="mt-3 pb-3">
              <Commission_VAT_List />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Commission_VAT;
