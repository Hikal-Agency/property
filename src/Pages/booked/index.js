import React, { useEffect, useState } from "react";
import BookedDeals from "../../Components/Leads/BookedDeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const Booked = () => {

  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, BACKEND_URL, pageState, t } =
    useStateContext();

  console.log("Booked State: ", pageState);

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {`${t("booked")} ${t("deals")}`} {" "}
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>

            <BookedDeals
              BACKEND_URL={BACKEND_URL}
              lead_type={"booked"}
            />
            
          </div>
        )}
      </div>
    </>
  );
};

export default Booked;
