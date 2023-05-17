import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import DashboardPanel from "../../Components/dashboard/DashboardPanel";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const {
    User,
    setUser,
    setopenBackDrop,
    currentMode,
    setDashboardData,
    BACKEND_URL,
    setIsUserSubscribed,
  } = useStateContext();
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUser = (user) => {
    const expiry = new Date(user?.expiry_date).getTime();
    const now = new Date().getTime();

    const isExpired = now > expiry;

    if (user?.role === 1) {
      return true;
    } else {
      return (
        isExpired === false &&
        user?.package_name?.length > 0 &&
        user?.package_name !== "unsubscribed"
      );
    }
  };

  const FetchProfile = (token) => {
    setloading(true);
    axios
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

      axios
        .get(`${BACKEND_URL}/newLeads`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((data) => {
        setDashboardData({...result.data, newLeads: data.data.leads.total});
        setTimeout(() => {
          setloading(false);
        }, 300);
        })
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // navigate("/", {
        //   state: {
        //     error: "Something Went Wrong! Please Try Again",
        //     continueURL: location.pathname,
        //   },
        // });
      });
  };

  useEffect(() => {
    setopenBackDrop(false);
    const token = localStorage.getItem("auth-token");
    FetchProfile(token);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="flex min-h-screen w-[100%]">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
              <div className="w-full overflow-x-hidden">
                <div className="px-5">
                  
                  <DashboardPanel />
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
