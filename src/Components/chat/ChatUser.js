import { Avatar, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import moment from "moment";

const ChatUser = ({ chat, setActiveChat, isActive }) => {
  return (
    <Box
      className={`w-full cursor-pointer ${
        isActive ? "bg-[#e9e9e9]" : "bg-white"
      } border-b border-[#f3f4f6] px-4 py-4 flex items-center`}
    >
      <Box className="flex items-center w-full">
        <Avatar
          sx={{ width: 40, height: 40, background: "#da1f26", fontSize: 15 }}
          className="mr-3"
        >
        <img className="object-cover w-full h-full" src={chat?.profile_picture} alt=""/>
        </Avatar>
        <Box className="w-full">
          <p style={{ marginBottom: "0" }} className="mb-0 text-lg">
            <strong>{chat?.userName || chat?.name}</strong>
          </p>
          <Box className="flex items-center justify-between">
            <p className="text-[#c6c6c6]" style={{ lineHeight: 1 }}>
              <p>@junaid.hikal</p>
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatUser;
