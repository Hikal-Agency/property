import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { useEffect } from "react";
import Loader from "../../../Components/Loader";
import AllCampaigns from "../../../Components/campaigns/AllCampaigns";

const Campaigns = () => {
  const { 
    currentMode, 
    setopenBackDrop, 
    t,
    themeBgImg 
  } = useStateContext();
  const [loading, setloading] = useState(true);

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

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
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            {/* <div className="mt-3">
                <h1
                  className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-red-600 font-bold border-red-600"
                  }`}
                >
                  Campaigns{" "}
                  <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                    <span>{pageState?.total}</span>
                  </span>
                </h1>
                <AllNewsletters
                  pageState={pageState}
                  setpageState={setpageState}
                />
              </div> */}
              <div className="w-full flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("campaigns")}
                </h1>
              </div>

              <AllCampaigns
                pageState={pageState}
                setpageState={setpageState}
              />
          </div>
        )}
      </div>
    </>
  );
};

export default Campaigns;
