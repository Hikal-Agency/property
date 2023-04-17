import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import DashboardPanel from "../../Components/dashboard/DashboardPanel";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const {
    User,
    setUser,
    setopenBackDrop,
    currentMode,
    setDashboardData,
    BACKEND_URL,
    setIsUserSubscribed
  } = useStateContext();
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUser = (user) => {
    const expiry = new Date(user?.expiry_date).getTime();
    const now =  new Date().getTime();

    const isExpired = now > expiry;

    if(user?.role === 1) {
      return true;
    } else {
      return isExpired === false && (user?.package_name?.length > 0 && user?.package_name !== "unsubscribed");
    }
  }

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/dashboard?page=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("dashboard data is");
        console.log(result.data);
        console.log("User from dashboard: ", result.data.user);
        setUser(result.data.user);
        setIsUserSubscribed(checkUser(result.data.user));
        setDashboardData(result.data);
        setloading(false);
      })
      .catch((err) => {
        // console.log(err);
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
    } else {
      const token = localStorage.getItem("auth-token");
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
            <div className="flex" style={{ width: "100vw" }}>
              <Sidebarmui />
              <div className="w-full">
                <div className="px-5">
                  <Navbar />
                  <DashboardPanel />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
