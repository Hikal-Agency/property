import { Avatar, Box } from "@mui/material";
import {BiUser} from "react-icons/bi";

const ConversationItem = ({ phoneNumber, lastMessageTime, lastMessageText }) => {
  return (
    <Box className="w-full bg-[#e9e9e9] px-4 py-3 flex items-center">
      <Box className="flex items-center w-full">
        <Avatar sx={{ width: 36, height: 36, background: "#da1f26", fontSize: 15 }} className="mr-3">
            <BiUser size={18}/>
        </Avatar>
        <Box className="w-full">
          <p style={{ marginBottom: "0" }} className="mb-0">
            <strong>+{phoneNumber}</strong>
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
