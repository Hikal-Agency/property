import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { ImUserCheck } from "react-icons/im";
import { MdFeedback } from "react-icons/md";
import { MdStickyNote2 } from "react-icons/md";
import { BsCalendar2EventFill } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";

import { useLocation, useNavigate } from "react-router-dom";

const Tour360 = (props) => {
    const { 
        currentMode,
        ProjectData,
        setProjectData,
    } = useStateContext();

    const [loading, setloading] = useState(true);
    const navigate = useNavigate(); 
    const location = useLocation();
    const devproid = location.pathname.split("/")[2];

    const FetchProject = async (token) => {
        await axios
          .get(`${BACKEND_URL}/dev-projects?proID=${devproid}`, {
          // .get(`${BACKEND_URL}/locations?userID=${userid}&date_range=2023-04-12,2023-04-14`, {
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
                        <div className="px-5">
                            <Navbar />
                            
                            <div className="mt-5 md:mt-2">
                                <h1
                                className={`font-semibold ${
                                    currentMode === "dark" ? "text-white" : "text-red-600"
                                } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                                >
                                    Arada - Masaar
                                </h1>

                                <div className="w-full h-[80vh]">
                                    <iframe width="100%" height="100%" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src={tour[4-1].tourlink}></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Tour360;



