import { Avatar } from "@mui/material";

const MessageFromMe = ({ message, data }) => {
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
          }}
          className="max-w-[600px] mb-3 rounded-md mr-2 p-2 bg-primary"
        >
          {message.type === "revoked" ? (
            <i className="text-gray-200">This message was deleted</i>
          ) : (
            <span className="text-white">{message.body}</span>
          )}
        </div>
      )}
      <Avatar
        sx={{ width: 20, height: 20 }}
        className="mr-2 bg-btn-primary"
      >
        <p style={{ fontSize: 11 }}>
          {data?.userInfo?.pushname[0]?.toUpperCase()}
        </p>
      </Avatar>
    </div>
  );
};

export default MessageFromMe;
