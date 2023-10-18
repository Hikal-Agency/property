import { Avatar } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const ChatMessageFromMe = ({ message, data }) => {
  const { formatTime, t } = useStateContext();

  return (
    <div className="flex items-start mt-4">
      {message.type === "image" ? (
        <div>
          <p className="text-gray-400 text-sm pr-3 mb-1 text-right">
            {formatTime(message?.createdAt)}
          </p>
          <div className="mr-2">
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
        </div>
      ) : (
        <div>
          <p className="text-gray-400 text-sm pr-3 mb-1 text-right">
            {formatTime(message?.createdAt)}
          </p>
          <div
            style={{
              position: "relative",
            }}
            className="max-w-[600px] bg-primary rounded-lg rounded-tr-none mr-2 p-4"
          >
            {message.type === "revoked" ? (
              <i className="text-gray-200">{t("message_was_deleted")}</i>
            ) : (
              <span className="text-white">{message.content}</span>
            )}
          </div>
        </div>
      )}
      <Avatar
        sx={{ width: 20, height: 20 }}
        className="mr-2 bg-btn-primary"
      >
        <img
          className="object-cover w-full h-full"
          src={data?.profile_picture || data?.displayImg}
          alt=""
        />
      </Avatar>
    </div>
  );
};

export default ChatMessageFromMe;
