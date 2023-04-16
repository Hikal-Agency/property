// import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import LocationComponent from "../../Components/location/LocationComponent";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";

const Userlocation = () => {
  const { 
    currentMode, 
    setopenBackDrop,
    DashboardData,
    setLocationData,
    BACKEND_URL
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation();

  const FetchLocation = async (token) => {
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
        setUser(result.data.user);
        setDashboardData(result.data);
        setloading(false);
      })
      .catch((err) => {
        // console.log(err);
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
        });
      });
  };

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div className="flex">
          <Sidebarmui />
          <div
            className={`w-full  ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="px-5 ">
              <Navbar />
              <LocationComponent upcoming_meetings={DashboardData?.upcoming_meetings} />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Userlocation;
