import React, { useState } from "react";
import OrderHistory from "../../Components/OfficeBoy_Comp/OrderHistory";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const Orders = () => {
  const { currentMode, t, primaryColor, themeBgImg } = useStateContext();
  const [loading, setLoading] = useState(false);
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
            <div className="w-full flex justify-between items-center pb-3">
              <div className="flex items-center">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("order_history")}
                </h1>
              </div>
            </div>

            <OrderHistory />
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
