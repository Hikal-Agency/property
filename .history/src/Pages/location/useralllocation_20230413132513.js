// import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import UserLocationComponent from "../../Components/location/UserLocationComponent";

const UserAllLocation = (props) => {
  const { 
    UserLocationData,
    setUserLocationData,
    currentMode, 
    setopenBackDrop,
    BACKEND_URL
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate(); 
  const location = useLocation();
  const userid = location.pathname.split("/")[3];
  console.log("userid");
  console.log(userid);

  const FetchUserLocation = async (token) => {
    await axios
      .get(`${BACKEND_URL}/locations?userID=${userid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("user all location data is");
        console.log(result.data);
        setUserLocationData(result.data);
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
      FetchUserLocation(token);
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
              hiiiii {userid}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAllLocation;
