import React, { useEffect, useState } from "react";
import BookedDeals from "../../Components/Leads/BookedDeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const Booked = () => {
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    pageState,
    t,
    themeBgImg,
  } = useStateContext();

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
            className={`w-full p-5 mt-2 ${
              !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
            }`}
          >
            <HeadingTitle
              title={`${t("booked")} ${t("deals")}`}
              counter={pageState?.total}
            />

            <BookedDeals BACKEND_URL={BACKEND_URL} lead_type={"booked"} />
          </div>
        )}
      </div>
    </>
  );
};

export default Booked;
