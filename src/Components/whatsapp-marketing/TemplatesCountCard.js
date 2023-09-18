import { Avatar, Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";

const TemplatesCountCard = ({ count, type, icon }) => {
  const { currentMode } = useStateContext();
  return (
    <>
      <Box
        
        className={`relative text-white bg-primary p-3 w-[24%] rounded shadow-lg border flex flex-col justify-between`}
      >
        <h4 className="mb-4 font-bold" style={{ fontSize: 22 }}>
          {count}
        </h4>
        <p>{type}</p>
        <Box sx={{ position: "absolute", right: 12, top: 12 }}>
          <Avatar sx={{background: "black", width: "32px", height: '32px'}}>{icon}</Avatar>
        </Box>
      </Box>
    </>
  );
};

export default TemplatesCountCard;
