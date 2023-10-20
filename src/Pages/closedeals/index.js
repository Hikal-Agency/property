
import React, { useEffect, useState } from "react";
import Closedeals from "../../Components/Closedeals";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

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
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
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
                {`${t("closed")} ${t("deals")}`} {" "}
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>

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
