import { Avatar, Box } from "@mui/material";
import { useState, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import moment from "moment";

const ConversationItem = ({ phNo, name, setActiveChat, isActive, lastMsg }) => {
  const [lastMessageText, setLastMessageText] = useState("");
  const [lastMessageTime, setLastMessageTime] = useState("");

  useEffect(() => {
    if (lastMsg) {
      if (lastMsg.id.fromMe && lastMsg.to === phNo + "@c.us") {
        if (lastMsg.type === "chat") {
          const lastMsgFormattedBody =
            lastMsg.body.length > 10
              ? lastMsg.body.slice(0, 10) + "..."
              : lastMsg.body;
          setLastMessageText(`You: ${lastMsgFormattedBody}`);
        } else if (lastMsg.type === "image") {
          setLastMessageText(`You: 📷 Image`);
        }
      } else {
        if (lastMsg.type === "chat") {
          const lastMsgFormattedBody =
            lastMsg.body.length > 15
              ? lastMsg.body.slice(0, 15) + "..."
              : lastMsg.body;
          setLastMessageText(`${lastMsgFormattedBody}`);
        } else if (lastMsg.type === "image") {
          setLastMessageText(`📷 Image`);
        }
      }

      const today = moment();
      const msgTime = moment(lastMsg.timestamp * 1000);
      const duration = moment.duration(today.diff(msgTime));
      const seconds = Math.floor(duration.asSeconds());
      const minutes = Math.floor(duration.asMinutes());
      const hours = Math.floor(duration.asHours());
      const days = Math.floor(duration.asDays());
      const weeks = Math.floor(duration.asWeeks());
      const months = Math.floor(duration.asMonths());
      if (lastMsg.type !== "e2e_notification") {
        if (months > 0) {
          setLastMessageTime(
            new Date(lastMsg.timestamp * 1000).toLocaleDateString()
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
  }, [lastMsg]);
  return (
    <Box
      onClick={() => setActiveChat({ phoneNumber: phNo, name: name })}
      className={`w-full cursor-pointer ${
        isActive ? "bg-white" : "bg-[#e9e9e9]"
      } border-b border-[#bfbfbf] px-4 py-3 flex items-center`}
    >
      <Box className="flex items-center w-full">
        <Avatar
          sx={{ width: 36, height: 36, background: "#da1f26", fontSize: 15 }}
          className="mr-3"
        >
          {name[0] !== "+" ? (
            <strong>{name[0].toUpperCase()}</strong>
          ) : (
            <BiUser size={18} />
          )}
        </Avatar>
        <Box className="w-full">
          <p style={{ marginBottom: "0" }} className="mb-0">
            <strong>{name || "+" + phNo}</strong>
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
