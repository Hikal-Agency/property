import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import LeadNotes from "../../Components/LeadNotes/LeadNotes";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";

const LeadNotesPage = (props) => {
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, t } = useStateContext();

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
            <div className="flex items-center">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t("lead_notes")} {" "}  
                <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                  {pageState?.total}
                </span>
              </h1>
            </div>
            <LeadNotes
              pageState={pageState}
              setpageState={setpageState}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LeadNotesPage;
