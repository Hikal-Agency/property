import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import Loader from "../../Components/Loader";
import AllMeetings from "../../Components/meetings/AllMeetings";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

const Meetings = () => {
  const [loading, setloading] = useState(true);
  const { User, setUser, currentMode, setopenBackDrop, BACKEND_URL } =
    useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });
  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUser(result.data.user[0]);
        setloading(false);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again " },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM -Meetings</title>
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
            <div className={`w-full`}>
              <div className="pl-3">
                <div className="mt-3">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    Meetings{" "}
                    <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span>
                  </h1>
                  <AllMeetings
                    BACKEND_URL={BACKEND_URL}
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

export default Meetings;
