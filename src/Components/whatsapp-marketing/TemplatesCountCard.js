import {Avatar, Box} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";

const TemplatesCountCard = ({count, type, icon})=> {
    const {currentMode } = useStateContext();
    return (<>
            <Box style={{background: currentMode === "dark" ? "#111827" : "#da1f26"}} className={`relative text-white p-3 w-[32%] rounded shadow-lg border ${currentMode === "dark" ? 'border-red-600' : 'border-gray-500'} flex flex-col justify-between`}>
                <h4 className="mb-4 font-bold" style={{fontSize: 22}}>{count}</h4>
                <p>{type}</p>
                <Box sx={{position: "absolute", right: 12, top: 12}}>
                    <Avatar>{icon}</Avatar>
                </Box>
            </Box>
    </>);
}

export default TemplatesCountCard;