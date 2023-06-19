import { Avatar } from "@mui/material";

const MessageFromMe = ({ message, data}) => {

  return (
    <div className="flex items-center">
      <div
        style={{
          position: "relative",
          backgroundColor: "#343e49",
        }}
        className="max-w-[600px] mb-2 rounded-md mr-2 p-2"
      >
        {message.type === "revoked" ? (
          <i className="text-gray-200">This message was deleted</i>
        ) : (
          <span className="text-white">{message.body}</span>
        )}

        {/* <div
          style={{
            position: "absolute",
            top: -5,
            right: 0,
            borderStyle: "solid",
            borderWidth: "0 0 10px 10px",
            borderColor: "transparent transparent #075e54 transparent",
          }}
        ></div> */}
      </div>
      <Avatar sx={{ width: 28, height: 28 }} className="mr-3">
          <p style={{fontSize: 14}}>{data?.userInfo?.pushname[0]?.toUpperCase()}</p>
        </Avatar>
    </div>
  );
};

export default MessageFromMe;
