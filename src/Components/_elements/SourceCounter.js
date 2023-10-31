import React, { useState, useRef } from 'react';
import {
    Box, 
    Tooltip
} from "@mui/material";
import { useStateContext } from '../../context/ContextProvider';

import { 
    BsSnow2,
    BsPersonRolodex,
    BsMegaphone,
    BsChatDots,
    BsWhatsapp,
    BsGlobe2,
    BsChatLeftText,
    BsLink45Deg,
    BsArchive,
    BsDownload,
    BsTwitter,
    BsYoutube,
    BsTiktok,
    BsSnapchat,
    BsFacebook
} from "react-icons/bs";
import { 
    FcGoogle 
} from "react-icons/fc";
import { 
    MdClose,
    MdImportantDevices 
} from "react-icons/md";

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

    const [expanded, setExpanded] = useState(false);
    const handleClick = () => {
        setExpanded(prevExpanded => !prevExpanded);
    };

    const contentRef = useRef(null);
    const handleTransitionEnd = () => {
        if (expanded) {
            contentRef.current.style.maxHeight = '100%';
        } else {
            contentRef.current.style.maxHeight = '30px';
        }
    };
    const handleClose = () => {
        contentRef.current.style.maxHeight = '30px';
        handleClick();
    }

    const sourceCounters = [
        {
            "Campaign Facebook": {
                icon: <BsFacebook size={16} color={"white"} />,
                bg: "#0e82e1",
            }
        },
        {
            "Campaign Snapchat": {
                icon: <BsSnapchat size={14} color={"white"} />,
                bg: "#edbd34", //"#f6d80a",
            }
        },
        {
            "Campaign TikTok": {
                icon: <BsTiktok size={14} color={"white"} />,
                bg: "#000000",
            }
        },
        {
            "Campaign YouTube": {
                icon: <BsYoutube size={16} color={"white"} />,
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
                icon: <BsTwitter size={16} color={"white"} />,
                bg: "#00acee",
            }
        },
        {
            "Campaign": {
                icon: <BsMegaphone size={16} color={"white"} />,
                bg: "#696969",
            }
        },
        {
            "WhatsApp": {
                icon: <BsWhatsapp size={16} color={"white"} />,
                bg: "#53cc60",
            }
        },
        {
            "Message": {
                icon: <BsChatDots size={16} color={"white"} />,
                bg: "#6A5ACD",
            }
        },
        {
            "Comment": {
                icon: <BsChatLeftText size={16} color={"white"} />,
                bg: "#a9b3c6",
            }
        },
        {
            "Website": {
                icon: <BsGlobe2 size={16} color={"white"} />,
                bg: "#AED6F1",
            }
        },
        {
            "Property Finder": {
                icon: <BsLink45Deg size={18} color={"white"} />,
                bg: "#ef5e4e",
            }
        },
        {
            "Bulk Import": {
                icon: <BsDownload size={16} color={"white"} />,
                bg: primaryColor,
            }
        },
        {
            "Warm": {
                icon: <BsArchive size={16} color={"white"} />,
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
                icon: <BsPersonRolodex size={16} color={"white"} />,
                bg: "#6C7A89",
            }
        },
    ];

    return (
        <div className='flex justify-end'>
            <div className={`bg-transparent w-fit flex items-center justify-end text-white rounded-xl px-2`}>
                {!expanded ? (
                    <Tooltip title="Lead Source" arrow>
                        <button className={`bg-primary p-2 cursor-pointer rounded-full`} onClick={handleClick}>
                            <MdImportantDevices size={20} color={"#FFFFFF"} />
                        </button>
                    </Tooltip>
                ) : (
                    <Tooltip title="Close" arrow>
                        <button className={`${"bg-primary"} p-2 mx-2 cursor-pointer rounded-full`} onClick={handleClose}>
                            <MdClose size={20} color={"#FFFFFF"} />
                        </button>
                    </Tooltip>
                )}
                <div 
                    ref={contentRef}
                    className=""
                    style={{
                        maxHeight: "30px",
                        // display: expanded ? "block" : "none",
                        // maxHeight: expanded ? "100%" : '30px',
                        maxWidth: expanded ? "100%" : "0",
                        overflow: 'hidden',
                        transition: 'max-width 1s ease',
                    }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    <div className="flex flex-wrap gap-2 items-center justify-end"
                    style={{
                        maxHeight: "100%",
                    }}>
                        {Counters.counters && Counters.counters.length > 0 ? (
                            sourceCounters.map((counterObject, index) => {
                                const leadSource = Object.keys(counterObject)[0];
                                const { icon, bg } = counterObject[leadSource];

                                const counterData = Counters.counters.find(
                                    (counter) => counter.leadSource === leadSource
                                );

                                if (!counterData) return null;

                                return (
                                    <Tooltip title={leadSource} arrow>
                                        <div className="grid grid-cols-2 flex items-center font-semibold border border-[#AAAAAA]"
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
                                    </Tooltip>
                                );
                            })
                        ) : (
                            <div className="text-sm bg-primary flex items-center">
                                {t("no_results_found")}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SourceCounter;
