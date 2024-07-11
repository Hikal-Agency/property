import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import VendorsList from "../../Components/VendorsComp/VendorsList";
import { Button } from "@mui/base";
import AddVendor from "../../Components/VendorsComp/AddVendor";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const currentDate = dayjs();

const Vendors = ({ isLoading }) => {
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

  const Additional = () => {
    return (
      <button
        className={`${themeBgImg ? "bg-primary shadow-md"
          : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
         } p-2 px-5 text-white rounded-md uppercase`}
        onClick={HandleOpenModel}
      >
        {t("add_vendor")}
      </button>
    );
  }

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-5 mt-2 ${!themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
              }
                ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <HeadingTitle
              title={t("vendor")}
              counter={pageState?.total}
              additional={<Additional />}
            />

            <div className="mt-1 pb-5">
              <VendorsList />
            </div>
          </div>
        )}

        {openVendorModal && (
          <AddVendor
            openVendorModal={openVendorModal}
            setOpenVendorModal={setOpenVendorModal}
          />
        )}
      </div>
    </>
  );
};

export default Vendors;
