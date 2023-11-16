import React, { useState, useEffect } from 'react';
import {
    Box, 
    Tooltip
} from "@mui/material";
import { useStateContext } from '../../context/ContextProvider';

import { 
    BsMegaphoneFill,
    BsTwitter,
    BsYoutube,
    BsFacebook
} from "react-icons/bs";
import {
    FaSnapchatGhost,
    FaTiktok
} from "react-icons/fa";
import { 
    FcGoogle 
} from "react-icons/fc";
import {
    RiWhatsappFill,
    RiInstagramFill
} from "react-icons/ri";

const SourceAnimation = () => {
    const {
        currentMode,
        primaryColor
    } = useStateContext();

    const sourceIcons = [
        <BsFacebook size={18} color={"#0e82e1"} />,
        <FaSnapchatGhost size={18} color={"#edbd34"} />,
        <FaTiktok size={16} color={currentMode === "dark" ? "white" : "black"} />,
        <BsYoutube size={18} color={"#c4302b"} />,
        <FcGoogle size={18} />,
        <BsTwitter size={18} color={"#00acee"} />,
        <BsMegaphoneFill size={18} color={"#696969"} />,
        <RiWhatsappFill size={18} color={"#53cc60"} />,
        <RiInstagramFill size={18} color={"#be238d"} />,

        // <img src={"/facebook.png"} className="icon" style={{ width: "100px", zIndex: "9" }} />,
        // <img src={"/snapchat.png"} />,
        // <img src={"/tiktok.png"} />,
        // <img src={"/instagram.png"} />,
        // <img src={"/youtube.png"} />,
        // <img src={"/google.png"} />,
    ];

    const [currentIcon, setCurrentIcon] = useState(0);
    const [showIcons, setShowIcons] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIcon((prevIcon) => (prevIcon + 1) % sourceIcons.length);
            setShowIcons(true);
        }, 1000); // Adjust the duration of each icon animation

        return () => clearInterval(interval);
    }, [sourceIcons.length]);

    const handleAnimationEnd = () => {
        setShowIcons(false);
    };

    return (
        <div className={`relative mx-4 p-1 rounded-full hover:shadow-xl card-hover w-[40px] h-[40px] flex justify-center items-center`}>
            {/* <img src={"/social-media.png"} /> */}
            <img src={"/open-box.png"} className="p-1" style={{ zIndex: "10" }} />
            {showIcons && (
                <div className="absolute bottom-[27px] left-[11px]" onAnimationEnd={handleAnimationEnd}>
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
    );
};

export default SourceAnimation;
