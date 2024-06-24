import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import LeadNotes from "../../Components/LeadNotes/LeadNotes";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const LeadNotesPage = (props) => {
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, t, themeBgImg } = useStateContext();

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
            className={`w-full p-5 mt-2 ${!themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
              }`}
          >
            <HeadingTitle
              title={t("lead_notes")}
              counter={pageState?.total}
            />

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
