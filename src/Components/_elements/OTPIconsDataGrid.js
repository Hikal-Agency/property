import React from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import {
    BsCheck2,
    BsX,
    BsQuestion
} from "react-icons/bs";

export const renderOTPIcons = (cellValues, currentMode) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            {cellValues.row.otp?.toLowerCase() === "verified" ? (
                // <img
                //     src={"/verified.png"} 
                //     style={{
                //         height: "25px",
                //     }}
                // />
                <p className="bg-green-600 rounded-full shadow-none p-1 flex items-center">
                    <BsCheck2 size={12} color="white" />
                </p>
            ) : cellValues.row.otp?.toLowerCase() === "not verified" ? (
                // <img
                //     src={"/notverified.png"} 
                //     style={{
                //         height: "25px",
                //     }}
                // />
                <p className="bg-red-600 rounded-full shadow-none p-1 flex items-center">
                    <BsX size={12} color="#ffffff" />
                </p>
            ) : (
                // <img
                //     src={"/notused.png"} 
                //     style={{
                //         height: "20px",
                //     }}
                // />

                <p className="bg-[#777777] rounded-full shadow-none p-1 flex items-center">
                    <BsQuestion size={12} color="white" />
                </p>
            )}
        </div>
    )
};