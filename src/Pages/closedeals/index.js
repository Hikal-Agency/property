
import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Closedeals from "../../Components/Closedeals";
import Footer from "../../Components/Footer/Footer";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";

const ClosedealsPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setloading] = useState(true);
  const { User, setUser, currentMode, setopenBackDrop, BACKEND_URL } =
    useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 25,
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
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Closed Deals</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head> */}

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
                Closed Deals {" "}
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
