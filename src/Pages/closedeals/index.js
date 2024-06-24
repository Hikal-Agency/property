
import React, { useEffect, useState } from "react";
import Closedeals from "../../Components/Closedeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import HeadingTitle from "../../Components/_elements/HeadingTitle.js";

const ClosedealsPage = (props) => {
  const [loading, setloading] = useState(true);
  const { t, currentMode, setopenBackDrop, BACKEND_URL, themeBgImg } =
    useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
  });

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
  }, []);
  return (
    <>

      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 mt-2 ${
              !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
            }`}
          >
            <HeadingTitle title={`${t("closed")} ${t("deals")}`} counter={pageState?.total} />

            <Closedeals
              BACKEND_URL={BACKEND_URL}
              pageState={pageState}
              setpageState={setpageState}
            />
            
          </div>
        )}
      </div>
    </>
  );
};

export default ClosedealsPage;
