import React, { useEffect, useState } from "react";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";

import Loader from "../../Components/Loader";
import StatmentsList from "../../Components/StatmentComp/StatmentsList";
import Commission_VAT_List from "../../Components/Commission_VAT_Comp/Commission_VAT_List";
import Petty_Cash_Comp from "../../Components/Petty_Cash_Comp/Petty_Cash_Comp";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const Petty_Cash = ({ isLoading }) => {
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
            className={`w-full p-5 ${
              !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
            } ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <HeadingTitle title={t("menu_petty_cash")} />

            {/* <div className="mt-3 pb-3"> */}
              <Petty_Cash_Comp />
            {/* </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default Petty_Cash;
