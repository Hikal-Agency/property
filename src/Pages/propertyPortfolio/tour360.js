import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";

import { useLocation, useNavigate } from "react-router-dom";

<<<<<<< Updated upstream:src/Pages/propertyPortfolio/tour360.js
const Tour360 = (props) => {
=======
const Tour360 = () => {
>>>>>>> Stashed changes:src/Pages/360tours/index.js
    const { 
        currentMode,
        ProjectData,
        setProjectData,
<<<<<<< Updated upstream:src/Pages/propertyPortfolio/tour360.js
        setopenBackDrop,
=======
>>>>>>> Stashed changes:src/Pages/360tours/index.js
        BACKEND_URL
    } = useStateContext();

    const [loading, setloading] = useState(true);
    const navigate = useNavigate(); 
    const location = useLocation();
<<<<<<< Updated upstream:src/Pages/propertyPortfolio/tour360.js
    const devproid = location.pathname.split("/")[3];
=======
    const devproid = location.pathname.split("/")[2];
>>>>>>> Stashed changes:src/Pages/360tours/index.js

    const FetchProject = async (token) => {
        await axios
            .get(`${BACKEND_URL}/projects/${devproid}`, {
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                },
            })
            .then((result) => {
<<<<<<< Updated upstream:src/Pages/propertyPortfolio/tour360.js
                console.log("project data is");
=======
>>>>>>> Stashed changes:src/Pages/360tours/index.js
                console.log(result.data);
                setProjectData(result.data);
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
    
        if (token) {
          FetchProject(token);
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
                        <div className="px-5">
                            <Navbar />
                            
                            <div className="mt-5 md:mt-2">
<<<<<<< Updated upstream:src/Pages/propertyPortfolio/tour360.js
                                <h1
                                className={`font-semibold ${
                                    currentMode === "dark" ? "text-white" : "text-red-600"
                                } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                                >
                                    {ProjectData?.data?.projectName}
                                </h1>

                                <div className="w-full h-[80vh]">
                                    <iframe width="100%" height="100%" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src={ProjectData?.data?.tourlink}></iframe>
                                </div>
                                    
=======
                                {ProjectData?.map((project) => (
                                    <>
                                    <h1
                                    className={`font-semibold ${
                                        currentMode === "dark" ? "text-white" : "text-red-600"
                                    } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                                    >
                                        {project?.projectName}
                                    </h1>

                                    <div className="w-full h-[80vh]">
                                        <iframe width="100%" height="100%" frameborder="0" allow="xr-spatial-tracking; gyroscope; accelerometer" allowfullscreen scrolling="no" src={project?.tourlink}></iframe>
                                    </div>
                                    </>
                                ))}
>>>>>>> Stashed changes:src/Pages/360tours/index.js
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



