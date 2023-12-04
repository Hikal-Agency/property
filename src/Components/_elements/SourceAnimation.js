import React, { useState, useEffect, useRef } from 'react';
import {
    Box, 
    Tooltip
} from "@mui/material";
import { useStateContext } from '../../context/ContextProvider';

import { 
    BsMegaphoneFill,
    BsTwitter,
    BsYoutube,
    BsFacebook,
    BsInstagram,
    BsSnapchat,
    BsTiktok,
    BsMegaphone,
    BsWhatsapp,
    BsChatDots,
    BsChatLeftText,
    BsGlobe2,
    BsLink45Deg,
    BsDownload,
    BsArchive,
    BsSnow2,
    BsPersonRolodex
} from "react-icons/bs";
import {
    FaSnapchatGhost,
    FaTiktok,
    FaQuestion
} from "react-icons/fa";
import { 
    FcGoogle 
} from "react-icons/fc";
import {
    MdClose
} from "react-icons/md";
import {
    RiWhatsappFill,
    RiInstagramFill
} from "react-icons/ri";

const SourceAnimation = () => {
    const {
        currentMode,
        primaryColor,
        Counters,
        SourceCounters,
        t,
        isLangRTL,
        i18n
    } = useStateContext();

    // useEffect(() => {
    //     const token = localStorage.getItem("auth-token");
    //     if (token) {
    //         SourceCounters(token);
    //     }
    // }, []);

    const sourceIcons = [
        <BsFacebook size={18} color={"#0E82E1"} />,
        <FaSnapchatGhost size={18} color={"#EDBD34"} />,
        <FaTiktok size={16} color={currentMode === "dark" ? "white" : "black"} />,
        <BsYoutube size={18} color={"#C4302B"} />,
        <FcGoogle size={18} />,
        <BsTwitter size={18} color={"#00ACEE"} />,
        <BsMegaphoneFill size={18} color={"#696969"} />,
        <RiWhatsappFill size={18} color={"#53CC60"} />,
        <RiInstagramFill size={20} color={"#BE238D"} />,
        // <img src={"/facebook.png"} className="icon" style={{ width: "100px", zIndex: "9" }} />,
        // <img src={"/snapchat.png"} />,
        // <img src={"/tiktok.png"} />,
        // <img src={"/instagram.png"} />,
        // <img src={"/youtube.png"} />,
        // <img src={"/google.png"} />,
    ];
    const sourceCounters = [
        {
            "Facebook": {
                icon: <BsFacebook size={20} color={"white"} />,
                bg: "#0E82E1",
            }
        },
        {
            "Instagram": {
                icon: <BsInstagram size={20} color={"white"} />,
                bg: "#BE238D",
            }
        },
        {
            "Snapchat": {
                icon: <BsSnapchat size={18} color={"white"} />,
                bg: "#EDBD34", //"#F6D80A",
            }
        },
        {
            "TikTok": {
                icon: <BsTiktok size={18} color={"white"} />,
                bg: "#000000",
            }
        },
        {
            "YouTube": {
                icon: <BsYoutube size={20} color={"white"} />,
                bg: "#C4302B",
            }
        },
        {
            "GoogleAds": {
                icon: <FcGoogle size={20} />,
                bg: currentMode === "dark" ? "#000000" : "#FFFFFF",
            }
        },
        {
            "Twitter": {
                icon: <BsTwitter size={20} color={"white"} />,
                bg: "#00ACEE",
            }
        },
        {
            "Campaign": {
                icon: <BsMegaphone size={20} color={"white"} />,
                bg: "#696969",
            }
        },
        {
            "WhatsApp": {
                icon: <BsWhatsapp size={20} color={"white"} />,
                bg: "#53CC60",
            }
        },
        {
            "Message": {
                icon: <BsChatDots size={20} color={"white"} />,
                bg: "#6A5ACD",
            }
        },
        {
            "Comment": {
                icon: <BsChatLeftText size={20} color={"white"} />,
                bg: "#A9B3C6",
            }
        },
        {
            "Website": {
                icon: <BsGlobe2 size={20} color={"white"} />,
                bg: "#AED6F1",
            }
        },
        {
            "Property Finder": {
                icon: <BsLink45Deg size={22} color={"white"} />,
                bg: "#EF5E4E",
            }
        },
        {
            "Bulk Import": {
                icon: <BsDownload size={20} color={"white"} />,
                bg: primaryColor,
            }
        },
        {
            "Warm": {
                icon: <BsArchive size={20} color={"white"} />,
                bg: "#AEC6CF",
            }
        },
        {
            "Cold": {
                icon: <BsSnow2 size={20} color={"white"} />,
                bg: "#0EC7FF",
            }
        },
        {
            "Personal": {
                icon: <BsPersonRolodex size={20} color={"white"} />,
                bg: "#6C7A89",
            }
        },
    ];
    const popupRef = useRef(null);
    const [currentIcon, setCurrentIcon] = useState(0);
    const [showIcons, setShowIcons] = useState(false);
    const [animationInterval, setAnimationInterval] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [SourceCounterOpen, setSourceCounterOpen] = useState(false);
    const handleSourceCounterOpen = () => {
        setSourceCounterOpen(true);
    }
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setSourceCounterOpen(false);
            const interval = setInterval(() => {
                setCurrentIcon((prevIcon) => (prevIcon + 1) % sourceIcons.length);
                setShowIcons(true);
            }, 1000);
            setAnimationInterval(interval);
        }, 1000);
    }
    const handleClickOutside = (event) => {
        if (popupRef.current && !popupRef.current.contains(event.target)) {
            handleClose();
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIcon((prevIcon) => (prevIcon + 1) % sourceIcons.length);
            setShowIcons(true);
        }, 1000);
        setAnimationInterval(interval);
        return () => clearInterval(interval);
    }, [sourceIcons.length]);
    const handleAnimationEnd = () => {
        setShowIcons(false);
    };
    const handleClick = (event) => {
        event.stopPropagation();
        clearInterval(animationInterval);
        setShowIcons(false);
        const token = localStorage.getItem("auth-token");
        if (token) {
            SourceCounters(token);
        }
        handleSourceCounterOpen();
    };
    return (
        <div>
            <div
                onClick={handleClick}
                className={`relative mx-4 p-1 mt-5 rounded-full hover:shadow-xl card-hover w-[40px] h-[40px] flex justify-center items-center`}
            >
                <img src={"/open-box.png"} className="p-1" style={{ zIndex: "10" }} />
                {showIcons && (
                    <div
                        className={`absolute bottom-[27px] ${isLangRTL(i18n.language) ? "right-[11px]" : "left-[11px]"}`}
                        onAnimationEnd={handleAnimationEnd}
                    >
                        {sourceIcons.map((icon, index) => (
                            <div
                                key={index}
                                className={`icon absolute ${currentIcon === index ? 'animate' : ''}`}
                                style={{ zIndex: "9" }}
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {SourceCounterOpen && (
                // <SourceCounters
                //     SourceCounterOpen={SourceCounterOpen}
                //     handleSourceCounterClose={handleSourceCounterClose}
                // />
                <div
                    ref={popupRef}
                    className={`source-counters-open fixed top-0 ${
                        isLangRTL(i18n.language) ? "left-10" : "right-10"
                    } ${
                        isClosing && "source-counters-close"
                    } w-auto h-auto flex flex-col items-center justify-center`}
                    style={{
                        zIndex: "100"
                    }}
                >
                    <div
                        className="relative w-auto h-auto rounded-b-full flex flex-col gap-1 justify-center p-2"
                        style={{
                            background: currentMode === "dark" ? "black" : "white",
                            color: currentMode === "dark" ? "white" : "black",
                            boxShadow: currentMode === "dark" ? "0 5px 30px rgba(255, 255, 255, 0.5)" : "0 5px 30px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {Counters.counters && Counters.counters.length > 0 ? (
                            Counters.counters.map((source) => {
                                const matchingSource = sourceCounters.find((counterObject, index) => {
                                    const counterObjectLeadSource = Object.keys(counterObject)[0]?.toLowerCase().trim();
                                    const sourceCounterLeadSource = source.leadSource?.toLowerCase().trim();
                                    return counterObjectLeadSource && sourceCounterLeadSource && counterObjectLeadSource?.includes(sourceCounterLeadSource);
                                });

                                if (!matchingSource) return null;

                                const leadSource = Object.keys(matchingSource)[0];
                                const { icon, bg } = matchingSource[leadSource];

                                return (
                                    <Tooltip title={leadSource} key={leadSource} arrow>
                                        <div className="p-2">
                                            <div
                                            className="shadow-sm card-hover flex items-center justify-between"
                                            style={{
                                                border: `1px solid #AAAAAA`,
                                            }}
                                            >
                                                <div
                                                    className="p-2 h-full flex items-center justify-center"
                                                    style={{
                                                    backgroundColor: bg,
                                                    }}
                                                >
                                                    {icon}
                                                </div>
                                                <div className="p-2 px-3">{source.count}</div>
                                            </div>
                                        </div>
                                    </Tooltip>
                                );
                            })
                        ) : (
                            <div
                                className={`text-sm flex flex-col justify-center items-center gap-5 p-4`}
                                style={{ zIndex: "1" }}
                            >
                                {/* <img src={"/social-media.png"} width="300" /> */}
                                <FaQuestion size={40} />
                                {t("no_results_found")}
                            </div>
                        )}
                        <div className="w-full h-full flex items-center justify-center">
                            <button
                                onClick={handleClose}
                                className={`card-hover rounded-full bg-primary w-fit h-fit p-3 my-4 z-10`}
                            >
                                <MdClose
                                size={18}
                                color={"white"}
                                className="hover:border hover:border-white hover:rounded-full"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default SourceAnimation;
