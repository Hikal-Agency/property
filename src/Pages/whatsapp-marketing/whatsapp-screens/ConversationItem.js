import { Avatar, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import moment from "moment";

const ConversationItem = ({ chat, setActiveChat, isActive }) => {
  const [lastMessageText, setLastMessageText] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState("");

  useEffect(() => {
    if (chat?.lastMessage) {
      if (chat?.lastMessage.id.fromMe && chat?.lastMessage.to === chat?.id?.user + "@c.us") {
        if (chat?.lastMessage.type === "chat") {
          const lastMsgFormattedBody =
            chat?.lastMessage.body.length > 10
              ? chat?.lastMessage.body.slice(0, 10) + "..."
              : chat?.lastMessage.body;
          setLastMessageText(`You: ${lastMsgFormattedBody}`);
        } else if (chat?.lastMessage.type === "image") {
          setLastMessageText(`You: 📷 Image`);
        }
      } else {
        if (chat?.lastMessage.type === "chat") {
          const lastMsgFormattedBody =
            chat?.lastMessage.body.length > 15
              ? chat?.lastMessage.body.slice(0, 15) + "..."
              : chat?.lastMessage.body;
          setLastMessageText(`${lastMsgFormattedBody}`);
        } else if (chat?.lastMessage.type === "image") {
          setLastMessageText(`📷 Image`);
        }
      }

      const today = moment();
      const msgTime = moment(chat?.lastMessage.timestamp * 1000);
      const duration = moment.duration(today.diff(msgTime));
      const seconds = Math.floor(duration.asSeconds());
      const minutes = Math.floor(duration.asMinutes());
      const hours = Math.floor(duration.asHours());
      const days = Math.floor(duration.asDays());
      const weeks = Math.floor(duration.asWeeks());
      const months = Math.floor(duration.asMonths());
      if (chat?.lastMessage.type !== "e2e_notification") {
        if (months > 0) {
          setLastMessageTime(
            new Date(chat?.lastMessage.timestamp * 1000).toLocaleDateString()
          );
        } else if (weeks > 0) {
          setLastMessageTime(`${weeks} w, ${days - weeks * 7} days ago`);
        } else if (days > 0) {
          setLastMessageTime(`${days} days, ${hours - days * 24} hrs ago`);
        } else if (hours > 0) {
          setLastMessageTime(`${hours} hrs, ${minutes - hours * 60} mins ago`);
        } else if (minutes > 0) {
          setLastMessageTime(`${minutes} minutes ago`);
        } else if (seconds > 0) {
          setLastMessageTime("a few seconds ago");
        }
      }
    }
  }, [chat?.lastMessage]);
  return (
    <Box
      onClick={() => setActiveChat({ phoneNumber: chat?.id?.user, name: chat?.name })}
      className={`w-full cursor-pointer ${
        isActive ? "bg-white" : "bg-[#e9e9e9]"
      } border-b border-[#bfbfbf] px-4 py-3 flex items-center`}
    >
      <Box className="flex items-center w-full">
        <Avatar
          sx={{ width: 36, height: 36, fontSize: 15 }}
          className="mr-3 bg-btn-primary"
        >
          {chat?.name[0] !== "+" ? (
            <strong>{chat?.name[0].toUpperCase()}</strong>
          ) : (
            <BiUser size={18} />
          )}
        </Avatar>
        <Box className="w-full">
          <p style={{ marginBottom: "0" }} className="mb-0">
            <strong>{chat?.name || "+" + chat?.id?.user}</strong>
          </p>
          <Box className="flex items-center justify-between">
            <p className="text-[#00000091]" style={{ lineHeight: 1 }}>
              <small>{lastMessageText}</small>
            </p>
            <p className="text-[#00000091]">
              <small>{lastMessageTime}</small>
            </p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConversationItem;
