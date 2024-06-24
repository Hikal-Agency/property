import React, { useEffect, useState } from "react";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";

import { useLocation, useNavigate } from "react-router-dom";

const Tour360 = (props) => {
  const { currentMode, ProjectData, setProjectData, BACKEND_URL } =
    useStateContext();

  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const devproid = location.pathname.split("/")[3];

  const FetchProject = async (token) => {
    await axios
      .get(`${BACKEND_URL}/projects/${devproid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result.data);
        setProjectData(result.data);
        setloading(false);
      })
      .catch((err) => {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchProject(token);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full p-4  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="w-full h-full">
            <div class="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {ProjectData?.data?.projectName}
              </h1>
            </div>

            <div className="w-full h-[80vh]">
              <iframe
                width="100%"
                height="100%"
                frameborder="0"
                allow="xr-spatial-tracking; gyroscope; accelerometer"
                allowfullscreen
                scrolling="no"
                src={ProjectData?.data?.tourlink}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tour360;
