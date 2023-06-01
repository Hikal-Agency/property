import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import DashboardPanel from "../../Components/dashboard/DashboardPanel";
import { ToastContainer, toast } from "react-toastify";

const Dashboard = () => {
  const { setopenBackDrop, currentMode, setDashboardData, BACKEND_URL } =
    useStateContext();
  const [loading, setloading] = useState(true);

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
        setDashboardData({
          ...result.data,
          newLeads: result.data.lead_status.new,
        });
        setTimeout(() => {
          setloading(false);
        }, 300);
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
            className={`w-full ${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
            <div className="w-full overflow-x-hidden">
              <div className="pl-3">
                <DashboardPanel />
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
