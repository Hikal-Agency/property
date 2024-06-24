import React from "react";
import { Box } from "@mui/system";
import { BsInstagram, BsFacebook, BsTiktok, BsArchive, BsYoutube, BsTwitter } from "react-icons/bs";
import { FaSnapchatGhost, FaUser, FaWhatsapp, FaRegComments } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BiImport, BiMessageRoundedDots } from "react-icons/bi";
import { GiMagnifyingGlass, GiQueenCrown } from "react-icons/gi";
import { TbWorldWww } from "react-icons/tb";
import { MdCampaign } from "react-icons/md";
import { Tooltip } from "@mui/material";

export const renderSourceIcons = (cellValues, currentMode) => {
  const sourceIcons = {
    // "bulk import": () => (
    //   <BiImport size={16} className="text-primary p-1" />
    // ),
    // "property finder": () => (
    //   <GiMagnifyingGlass size={16} color={"#ef5e4e"} className="p-1" />
    // ),
    // "vip": () => (
    //     <GiQueenCrown size={16} className="p-1 gold-grad" />
    // ),
    // campaign: () => (
    //   <MdCampaign size={16} color={"#696969"} className="p-0.5" />
    // ),
    // cold: () => (
    //   <BsArchive size={16} color={"#0ec7ff"} className="p-1" />
    // ),
    // personal: () => (
    //   <BsArchive size={16} color={"#6C7A89"} className="p-1" />
    // ),
    // whatsapp: () => (
    //   <FaWhatsapp size={16} color={"#53cc60"} className="p-1" />
    // ),
    // message: () => (
    //   <BiMessageRoundedDots size={16} color={"#6A5ACD"} className="p-0.5" />
    // ),
    // comment: () => (
    //   <FaRegComments size={16} color={"#a9b3c6"} className="p-0.5" />
    // ),
    // website: () => (
    //   <TbWorldWww size={16} color={"#AED6F1"} className="p-0.5" />
    // ),
  };

    return (
        <div className="flex items-center justify-center w-full h-full">
            {cellValues.row.leadSource?.toLowerCase().includes("instagram") ? (
                // INSTAGRAM 
                // <BsInstagram
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={"#B134AF"}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/instagram.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("facebook") ? (
                // FACEBOOK 
                // <BsFacebook
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={"#0e82e1"}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/facebook.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("tiktok") ? (
                // TIKTOK 
                // <BsTiktok
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={currentMode === "dark" ? "#FFFFFF" : "#000000"}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/tiktok.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("snapchat") ? (
                // SNAPCHAT 
                // <FaSnapchatGhost
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={"#f6d80a"}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/snapchat.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("googleads") ? (
                // GOOGLEADS 
                // <FcGoogle
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/google.png"} 
                    style={{
                        height: "20px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("youtube") ? (
                // YOUTUBE 
                // <BsYoutube
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={"#FF0000"}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/youtube.png"} 
                    style={{
                        height: "20px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("twitter") ? (
                // TWITTER 
                // <BsTwitter
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={"#00acee"}
                //     className="p-1"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/twitter.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().startsWith("warm") ? (
                // WARM 
                // <BsArchive
                //     style={{
                //         width: "50%",
                //         height: "50%",
                //         margin: "0 auto",
                //     }}
                //     size={16}
                //     color={"#AEC6CF"}
                //     className="p-0.5"
                // />
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/archive.png"} 
                    style={{
                        height: "20px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("website") ? (
                // WEBSITE 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/globe.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("whatsapp") ? (
                // WHATSAPP 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/whatsapp.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("personal") ? (
                // PERSONAL 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/person.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase() === "vip" ? (
                // VIP 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/vip.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase() === "campaign" ? (
                // CAMPAIGN 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/campaign.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("message") ? (
                // MESSAGE 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/message.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("comment") ? (
                // COMMENT 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/comment.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("secondary") ? (
                // COMMENT 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/secondary.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase() === "property finder" ? (
                // THIRD PARTY 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/thirdparty.png"} 
                    style={{
                        height: "20px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("cold") ? (
                // COLD 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/cold.png"} 
                    style={{
                        height: "20px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase() === "bulk import" ? (
                // BULK IMPORT 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/import.png"} 
                    style={{
                        height: "20px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("telegram") ? (
                // TELEGRAM 
                <Tooltip title={cellValues.row.leadSource} arrow>
                <img
                    src={"/telegram.png"} 
                    style={{
                        height: "25px",
                    }}
                />
                </Tooltip>
            ) : cellValues.row.leadSource?.toLowerCase().includes("wechat") ? (
                // WECHAT 
                <Tooltip title={cellValues.row.leadSource} arrow>
                    <img
                        src={"/wechat.png"} 
                        style={{
                            height: "25px",
                        }}
                    />
                </Tooltip>
            )
            : (
                <Box
                    sx={{
                        "& svg": {
                            width: "50%",
                            height: "50%",
                            margin: "0 auto",
                        },
                    }}
                >
                    {cellValues.row.leadSource}
                    {/* {sourceIcons[cellValues.row.leadSource?.toLowerCase()]
                        ? sourceIcons[cellValues.row.leadSource?.toLowerCase()]()
                        : "-"
                    } */}
                </Box>
            )}
        </div>
    )
};