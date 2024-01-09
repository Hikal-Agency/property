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

const SourceByProject = ({
    list
}) => {
    const {
        currentMode,
        primaryColor,
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

    const sourceCounters = [
        {
            "Facebook": {
                icon: <BsFacebook size={18} color={"white"} />,
                bg: "#0E82E1",
            }
        },
        {
            "Instagram": {
                icon: <BsInstagram size={18} color={"white"} />,
                bg: "#BE238D",
            }
        },
        {
            "Snapchat": {
                icon: <BsSnapchat size={16} color={"white"} />,
                bg: "#EDBD34", //"#F6D80A",
            }
        },
        {
            "TikTok": {
                icon: <BsTiktok size={16} color={"white"} />,
                bg: "#000000",
            }
        },
        {
            "YouTube": {
                icon: <BsYoutube size={18} color={"white"} />,
                bg: "#C4302B",
            }
        },
        {
            "GoogleAds": {
                icon: <FcGoogle size={18} />,
                bg: currentMode === "dark" ? "#000000" : "#FFFFFF",
            }
        },
        {
            "Twitter": {
                icon: <BsTwitter size={18} color={"white"} />,
                bg: "#00ACEE",
            }
        },
        {
            "Campaign": {
                icon: <BsMegaphone size={18} color={"white"} />,
                bg: "#696969",
            }
        },
        {
            "WhatsApp": {
                icon: <BsWhatsapp size={18} color={"white"} />,
                bg: "#53CC60",
            }
        },
        {
            "Message": {
                icon: <BsChatDots size={18} color={"white"} />,
                bg: "#6A5ACD",
            }
        },
        {
            "Comment": {
                icon: <BsChatLeftText size={18} color={"white"} />,
                bg: "#A9B3C6",
            }
        },
        {
            "Website": {
                icon: <BsGlobe2 size={18} color={"white"} />,
                bg: "#AED6F1",
            }
        },
        {
            "Property Finder": {
                icon: <BsLink45Deg size={18} color={"white"} />,
                bg: "#EF5E4E",
            }
        },
        {
            "Bulk Import": {
                icon: <BsDownload size={18} color={"white"} />,
                bg: primaryColor,
            }
        },
        {
            "Warm": {
                icon: <BsArchive size={18} color={"white"} />,
                bg: "#AEC6CF",
            }
        },
        {
            "Cold": {
                icon: <BsSnow2 size={18} color={"white"} />,
                bg: "#0EC7FF",
            }
        },
        {
            "Personal": {
                icon: <BsPersonRolodex size={18} color={"white"} />,
                bg: "#6C7A89",
            }
        },
    ];

    return (
        <>
            {list && list.length > 0 && (
                list.map((source) => {
                    const matchingSource = sourceCounters.find((counterObject) => {
                        const counterObjectLeadSource = Object.keys(counterObject)[0]?.toLowerCase().trim();
                        const sourceCounterLeadSource = source.leadSource?.toLowerCase().trim();
                        // console.log("NEW SOURCE COUNTER ============ ", sourceCounterLeadSource);
                        // console.log("NEW COUNTER OBJECT ============ ", counterObjectLeadSource);
                        return (
                            counterObjectLeadSource && 
                            sourceCounterLeadSource && 
                            sourceCounterLeadSource.includes(counterObjectLeadSource)
                        );
                    });

                    if (!matchingSource) return null;

                    const leadSource = Object.keys(matchingSource)[0];
                    const { icon, bg } = matchingSource[leadSource];

                    return (
                        <Tooltip title={source?.leadSource} key={source?.leadSource} arrow>
                            <div
                            className="shadow-sm card-hover flex items-center justify-between h-full"
                            style={{
                                border: `1px solid #AAAAAA`,
                                backgroundColor: bg,
                            }}
                            >
                                <div
                                    className="p-2 h-full flex items-center justify-center"
                                >
                                    {icon}
                                </div>
                                <div className={`p-2 px-3 ${ currentMode === "dark" ? "bg-black" : "bg-white"}`}>
                                    {source.count}
                                </div>
                            </div>
                        </Tooltip>
                    );
                })
            )}
        </>
    );
};
export default SourceByProject;
