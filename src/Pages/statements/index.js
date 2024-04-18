import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import VendorsList from "../../Components/VendorsComp/VendorsList";
import { Button } from "@mui/base";
import AddVendor from "../../Components/VendorsComp/AddVendor";
import StatmentsList from "../../Components/StatmentComp/StatmentsList";

const currentDate = dayjs();

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
                  {t("vendor")}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>
              <div>
                <Button
                  className="bg-btn-primary w-40 text-white px-7 py-2 rounded-md mr-2 "
                  onClick={HandleOpenModel}
                >
                  {t("add_vendor")}
                </Button>
              </div>
            </div>

            <div className="mt-3 pb-3">
              <StatmentsList />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Statements;
