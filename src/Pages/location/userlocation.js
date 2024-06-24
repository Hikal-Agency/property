// import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import UserLocationComponent from "../../Components/location/UserLocationComponent";
import { toast, ToastContainer } from "react-toastify";

const Userlocation = () => {
  const {
    currentMode,
    setopenBackDrop,
    setLocationData,
    BACKEND_URL,
    setUser,
    User,
    themeBgImg
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    // FetchLocation(token);
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="h-screen">
        <div
          className={`w-full  ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="p-4 pb-0">
            <UserLocationComponent />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Userlocation;
