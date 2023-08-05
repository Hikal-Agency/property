import { Box, Avatar } from "@mui/material";
import { BiUser } from "react-icons/bi";

const ChatMessageFromOther = ({ message }) => {
  return (
    <>
      <div className="flex items-start self-start">
        <Avatar
          sx={{ width: 20, height: 20, background: "black" }}
          className="mr-2"
        >
          
          <img
            className="object-cover w-full h-full"
            src={message?.from?.profile_picture || message?.from?.displayImg}
            alt=""
          />
        </Avatar>
        {message.type === "image" ? (
          <div className="mb-3">
            {message?._data?.body ? (
              <img
                width="100%"
                src={`data:image/png;base64,${message?._data?.body}`}
                alt=""
              />
            ) : (
              <div className="p-4 w-[130px] rounded bg-green-500 text-white flex justify-center items-center">
                <h1>Image</h1>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              position: "relative",
             background: "#f0f0f0"
            }}
            className="max-w-[600px] mb-2 rounded-lg rounded-tl-none p-4"
          >
            <Box>
              {message.type === "revoked" ? (
                <i className="text-black">This message was deleted</i>
              ) : (
                <span className="text-black">{message.content}</span>
              )}
            </Box>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessageFromOther;
