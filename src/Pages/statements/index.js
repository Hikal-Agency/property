import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import StatmentsList from "../../Components/StatmentComp/StatmentsList";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

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
            className={`w-full p-5 mt-2 ${
              !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
            }
                ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <HeadingTitle 
            title={t("menu_statements")}
            />

            <div className="pb-5">
              <StatmentsList />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Statements;
