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
  const { currentMode, setopenBackDrop } = useStateContext();

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Lead Notes</title>
        <meta name="description" content="Meetings - HIKAL CRM" />
      </Head> */}
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full `}>
              <div className="pl-3">
                <div className="mt-3">
                  <h1
                    className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                    style={{ textTransform: "capitalize" }}
                  >
                    ● Lead notes{" "}
                    <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span>
                  </h1>
                  <LeadNotes
                    pageState={pageState}
                    setpageState={setpageState}
                  />
                </div>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default LeadNotesPage;
