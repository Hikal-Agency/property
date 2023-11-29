import React from "react";

export const renderOTPIcons = (cellValues, currentMode) => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            {cellValues.row.otp?.toLowerCase() === "verified" ? (
                <img
                    src={"/verified.png"} 
                    style={{
                        height: "25px",
                    }}
                />
            ) : cellValues.row.otp?.toLowerCase() === "not verified" ? (
                <img
                    src={"/notverified.png"} 
                    style={{
                        height: "25px",
                    }}
                />
            ) : (
                <img
                    src={"/notused.png"} 
                    style={{
                        height: "20px",
                    }}
                />
            )}
        </div>
    )
};