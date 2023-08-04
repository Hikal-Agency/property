import { Avatar } from "@mui/material";

const ChatMessageFromMe = ({ message, data }) => {
  return (
    <div className="flex items-start">
      {message.type === "image" ? (
        <div className="mb-3 mr-2">
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
            background: "#da1f26",
          }}
          className="max-w-[600px] mb-3 rounded-lg rounded-tr-none mr-2 p-4"
        >
          {message.type === "revoked" ? (
            <i className="text-gray-200">This message was deleted</i>
          ) : (
            <span className="text-white">{message.body}</span>
          )}
        </div>
      )}
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

export default ChatMessageFromMe;
