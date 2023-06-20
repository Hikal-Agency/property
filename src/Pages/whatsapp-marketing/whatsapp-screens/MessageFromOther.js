import { Box, Avatar } from "@mui/material";
import { BiUser } from "react-icons/bi";

const MessageFromOther = ({ message, phoneNumber }) => {
  return (
    <>
      <div className="flex items-start self-start">
        <Avatar
          sx={{ width: 20, height: 20, background: "black" }}
          className="mr-2"
        >
          <BiUser size={15} />
        </Avatar>
        {message.type === "image" ? (
          <div className="mb-3 ml-2">
            <img
              width="100%"
              src={`data:image/png;base64,${message?._data?.body}`}
              alt=""
            />
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              backgroundImage:
                "linear-gradient(to top, dimgrey, rgb(52, 62, 73))",
            }}
            className="max-w-[600px] mb-2 rounded-md p-2"
          >
            <Box>
              {message.type === "revoked" ? (
                <i className="text-gray-200">This message was deleted</i>
              ) : (
                <span className="text-white">{message.body}</span>
              )}
            </Box>
          </div>
        )}
      </div>
    </>
  );
};

export default MessageFromOther;
