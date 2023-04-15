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

    const developer = [
        {
            developer: "Alef Group",
            projects: []
        },
        {
            developer: "Azizi Developments",
            projects: [
                {
                    dpid: 1,
                    project: "Beach Oasis",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 0,
                    projectStatus: "Available",
                    tour360: 0,
                    tourlink: "",
                },
                {
                    dpid: 2,
                    project: "Park Avenue",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 0,
                    projectStatus: "Sold Out",
                    tour360: 0,
                    tourlink: "",
                },
                {
                    dpid: 3,
                    project: "Riviera",
                    studio: 1,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Available",
                    tour360: 1,
                    tourlink: "https://kuula.co/share/collection/792Wy?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
                },
            ]
        },
        {
            developer: "Arada Developments",
            projects: [
                {
                    dpid: 4,
                    project: "Masaar",
                    studio: 0,
                    onebed: 0,
                    twobed: 0,
                    threebed: 1,
                    fourbed: 1,
                    fivebed: 1,
                    sixbed: 1,
                    retail: 1,
                    projectStatus: "Available",
                    tour360: 1,
                    tourlink: "https://kuula.co/share/collection/7FDYx?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
                },
            ]
        },
        {
            developer: "Binghatti",
            projects: [
                {
                    dpid: 5,
                    project: "Crescent",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Sold Out",
                    tour360: 0,
                    tourlink: "",
                },
                {
                    dpid: 6,
                    project: "Onyx",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Available",
                    tour360: 0,
                    tourlink: "",
                },
                {
                    dpid: 7,
                    project: "Nova",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Sold Out",
                    tour360: 0,
                    tourlink: "",
                },
                {
                    dpid: 8,
                    project: "Canal",
                    studio: 0,
                    onebed: 1,
                    twobed: 1,
                    threebed: 1,
                    fourbed: 0,
                    fivebed: 0,
                    sixbed: 0,
                    retail: 1,
                    projectStatus: "Available",
                    tour360: 1,
                    tourlink: "https://kuula.co/share/collection/7Fmty?logo=-1&info=0&fs=1&vr=1&zoom=1&initload=0&thumbs=1",
                },
            ]
        },
    ];

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
                            <PropertyPortfolio />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default PropertyPortfolio;
