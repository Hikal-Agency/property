import React, { useState } from 'react';
import {
    Box, 
    Tooltip
} from "@mui/material";
import { useStateContext } from '../../context/ContextProvider';

import { 
    BiImport,
    BiArchive,
    BiMessageRoundedDots 
} from "react-icons/bi";
import { 
    BsSnow2,
    BsPersonCircle 
} from "react-icons/bs";
import { 
    FaFacebookF,
    FaSnapchatGhost,
    FaTiktok,
    FaYoutube,
    FaTwitter,
    FaWhatsapp,
    FaRegComments
} from "react-icons/fa";
import { 
    FcGoogle 
} from "react-icons/fc";
import { 
    GiMagnifyingGlass 
} from "react-icons/gi";
import { 
    MdCampaign,
    MdClose,
    MdImportantDevices 
} from "react-icons/md";
import { 
    TbWorldWww 
} from "react-icons/tb";

const SourceCounter = () => {
    const {
        currentMode,
        primaryColor,
        themeBgImg,
        blurLightColor,
        blurDarkColor,
        Counters,
        t
    } = useStateContext();

    console.log("COUNTERS ============== ", Counters.counters);

    const [expanded, setExpanded] = useState(false);
    const handleClick = () => {
        setExpanded(prevExpanded => !prevExpanded);
    };

    const sourceCounters = [
        {
            "Campaign Facebook": {
                icon: <FaFacebookF size={14} color={"white"} />,
                bg: "#0e82e1",
            }
        },
        {
            "Campaign Snapchat": {
                icon: <FaSnapchatGhost size={14} color={"white"} />,
                bg: "#edbd34", //"#f6d80a",
            }
        },
        {
            "Campaign TikTok": {
                icon: <FaTiktok size={14} color={"white"} />,
                bg: "#000000",
            }
        },
        {
            "Campaign YouTube": {
                icon: <FaYoutube size={16} color={"white"} />,
                bg: "#c4302b",
            }
        },
        {
            "Campaign GoogleAds": {
                icon: <FcGoogle size={16} color={"white"} />,
                bg: currentMode === "dark" ? "#000000" : "#FFFFFF",
            }
        },
        {
            "Campaign Twitter": {
                icon: <FaTwitter size={16} color={"white"} />,
                bg: "#00acee",
            }
        },
        {
            "Campaign": {
                icon: <MdCampaign size={16} color={"white"} />,
                bg: "#696969",
            }
        },
        {
            "WhatsApp": {
                icon: <FaWhatsapp size={16} color={"white"} />,
                bg: "#53cc60",
            }
        },
        {
            "Message": {
                icon: <BiMessageRoundedDots size={16} color={"white"} />,
                bg: "#6A5ACD",
            }
        },
        {
            "Comment": {
                icon: <FaRegComments size={16} color={"white"} />,
                bg: "#a9b3c6",
            }
        },
        {
            "Website": {
                icon: <TbWorldWww size={16} color={"white"} />,
                bg: "#AED6F1",
            }
        },
        {
            "Property Finder": {
                icon: <GiMagnifyingGlass size={16} color={"white"} />,
                bg: "#ef5e4e",
            }
        },
        {
            "Bulk Import": {
                icon: <BiImport size={16} color={"white"} />,
                bg: primaryColor,
            }
        },
        {
            "Warm": {
                icon: <BiArchive size={16} color={"white"} />,
                bg: "#AEC6CF",
            }
        },
        {
            "Cold": {
                icon: <BsSnow2 size={16} color={"white"} />,
                bg: "#0ec7ff",
            }
        },
        {
            "Personal": {
                icon: <BsPersonCircle size={16} color={"white"} />,
                bg: "#6C7A89",
            }
        },
    ];

    return (
        <div className='w-full flex justify-end mb-5'>
            <div className={`${expanded 
                ? (themeBgImg && (currentMode === "dark" ? "bg-[#1C1C1C] shadow-sm" : "bg-[#EEEEEE] shadow-sm")) 
                : "bg-transparent"} 
                w-fit flex items-center justify-end text-white rounded-xl p-2 gap-2 mb-4`}>
                {!expanded ? (
                    <Tooltip title="Lead Source" arrow>
                        <button className={`bg-primary p-2 cursor-pointer rounded-full`} onClick={handleClick}>
                            <MdImportantDevices size={20} color={"#FFFFFF"} />
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip title="Close" arrow>
                        <button className={`${!themeBgImg && "bg-primary"} p-2 mr-3 cursor-pointer rounded-full`} onClick={handleClick}>
                            <MdClose size={20} color={"#FFFFFF"} />
                        </button>
                    </Tooltip>
                )}
                <div 
                    className=""
                    style={{
                        display: expanded ? "block" : "none",
                    }}
                >
                    <div className="flex flex-wrap gap-5 items-center justify-end">
                        {sourceCounters.map((counterObject, index) => {
                            const leadSource = Object.keys(counterObject)[0];
                            const { icon, bg } = counterObject[leadSource];

                            const counterData = Counters.counters.find(
                                (counter) => counter.leadSource === leadSource
                            );

                            if (!counterData) return null;

                            return (
                                <div className="grid grid-cols-2 flex items-center font-semibold"
                                    style={{
                                        color: currentMode === "dark" ? "white" : "black",
                                        background: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
                                        boxShadow: currentMode === "dark"
                                        ? "2px 2px 5px rgba(66, 66, 66, 1)"
                                        : "2px 2px 5px rgba(0, 0, 0, 0.25)",
                                    }}
                                >
                                    <div className="p-2 h-full w-full flex items-center justify-center"
                                        style={{
                                            background: bg,
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <div className="p-2 flex items-center justify-center h-full">
                                        {counterData.count}
                                    </div> 
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceCounter;
