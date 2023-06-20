import { Avatar } from "@mui/material";

const MessageFromMe = ({ message, data }) => {
  return (
    <div className="flex items-start">
      <div
        style={{
          position: "relative",
          background: "#da1f26",
        }}
        className="max-w-[600px] mb-3 rounded-md mr-2 p-2"
      >
        {message.type === "revoked" ? (
          <i className="text-gray-200">This message was deleted</i>
        ) : (
          <span className="text-white">{message.body}</span>
        )}
      </div>
      <Avatar
        sx={{ width: 20, height: 20, background: "#da1f26" }}
        className="mr-2"
      >
        <p style={{ fontSize: 11 }}>
          {data?.userInfo?.pushname[0]?.toUpperCase()}
        </p>
      </Avatar>
    </div>
  );
};

export default MessageFromMe;
