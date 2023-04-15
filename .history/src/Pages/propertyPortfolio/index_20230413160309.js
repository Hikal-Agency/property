import moment from "moment";
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import Footer from "../../Components/Footer/Footer";
import axios from "axios";
import { Button } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Md360 } from "react-icons/md";
import { BiCheckboxChecked, BiCheckboxMinus } from "react-icons/bi";

const PropertyPortfolio = () => {
    const { 
        currentMode,
        DevProData,
        setDevProData,
        BACKEND_URL
    } = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();

    const FetchProperty = async (token) => {
        await axios
          .get(`${BACKEND_URL}/dev-projects`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          })
          .then((result) => {
            setDevProData(result.data);
          })
          .catch((err) => {
            // console.log(err);
            navigate("/", {
              state: { error: "Something Went Wrong! Please Try Again", continueURL: location.pathname },
            });
          });
      };

    const handle360Click = (event, param) => {
        console.log(event);
        console.log(param);
    };

    useEffect(() => {
        const token = localStorage.getItem("auth-token");
    
        if (token) {
            FetchProperty(token);
            console.log(DevProData);
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
                            <h1
                            className={`font-semibold ${
                                currentMode === "dark" ? "text-white" : "text-red-600"
                            } text-xl ml-2 mb-3 auto-cols-max gap-x-3`}
                            >
                                Property Portfolio
                            </h1>

                            <div className="space-y-3">
                                {/* {DevProData.length > 0 ? ( */}
                                    {DevProData?..map((developer) => {
                                        return (
                                            <>
                                                <div className={`${currentMode === "dark" ? "text-white" : "text-black"} w-full p-3 rounded-md space-y-3`}>
                                                    <div className="font-semibold text-md">
                                                        <p className="text-lg">{developer.developer}</p>
                                                    </div>
                                                    
                                                </div>
                                                <hr></hr>
                                            </>
                                        )
                                                    }
                                    // })
                                // ) : (
                                //     <p className="italic text-sm">Nothing to show</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default PropertyPortfolio;
