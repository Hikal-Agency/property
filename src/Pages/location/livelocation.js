
import React, { useState } from "react";
import { useEffect } from "react";
import LocationComponent from "../../Components/location/LocationComponent";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";

const Livelocation = () => {
  const {
    currentMode,
    setopenBackDrop,

    BACKEND_URL,
  } = useStateContext();
  const [loading, setloading] = useState(false);
  const [DashboardData, setDashboardData] = useState([]);

  const FetchLocations = (token) => {
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
        setDashboardData({
          ...result.data,
          newLeads: result.data.lead_status.new,
        });
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
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
      });
  };

  useEffect(() => {
    setopenBackDrop(false);

    const token = localStorage.getItem("auth-token");
    FetchLocations(token);
  }, []);

  console.log("meetinglocations:: ", DashboardData);

  return (
    <>
      
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen">
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="p-4 ">
              <LocationComponent
                upcoming_meetings={DashboardData?.upcoming_meetings}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Livelocation;
