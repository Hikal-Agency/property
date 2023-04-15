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
import { useNavigate, useLocation } from "react-router-dom";
import UserLocationComponent from "../../Components/location/UserLocationComponent";

const Userlocation = () => {
  const { 
    LocationData,
    currentMode, 
    setopenBackDrop,
    setLocationData,
    BACKEND_URL
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation();

  const FetchLocation = async (token) => {
    await axios
      .get(`${BACKEND_URL}/locations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("user location data is");
        console.log(result.data);
        setLocationData(result?.data);
        setloading(false);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

      setopenBackDrop(false);

    if (token) {
      FetchLocation(token);
    } else {
      navigate("/", {
        state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
      });
    }
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
              {/* <UserLocationComponent user_location={LocationData} /> */}
              {/* UserLocationComponent  */}
              <h4 className="text-red-600 font-bold text-xl mb-2 text-center">User Locations</h4>
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 pb-3">
                  <div className={`${currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"} w-full h-[85vh]`}>
                      {/* MAP */}
                      <UserMapContainer user_location = {user_location} />
                  </div>
                  <div className="h-full w-full mt-5">
                      <h4 className="text-red-600 font-bold text-xl mb-2">Users</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                          {Location?.map((location, index) => {
                              return (
                                  <>
                                      {location?.id}
                                  </>
                              )
                          })}
                      </div>
                  </div>
              </div>  



            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Userlocation;
