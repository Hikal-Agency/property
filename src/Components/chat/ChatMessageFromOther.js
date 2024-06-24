import { Box, Avatar } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const ChatMessageFromOther = ({ message, data }) => {
  const { formatTime, t } = useStateContext();
  return (
    <>
      <div className="flex items-start self-start mt-4">
        <Avatar
          sx={{ width: 20, height: 20, background: "black" }}
          className="mr-2"
        >
          <img
            className="object-cover w-full h-full"
            src={data?.profile_picture}
            alt=""
          />
        </Avatar>
        {message.type === "image" ? (
          <div>
            <p className="text-gray-400 text-sm mb-1 pr-3 text-left">
              {formatTime(message?.createdAt)}
            </p>
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
          </div>
        ) : (
          <div>
            <p className="text-gray-400 text-sm pr-3 mb-1 text-left">
              {formatTime(message?.createdAt)}
            </p>
            <div
              style={{
                position: "relative",
                background: "#f0f0f0",
              }}
              className="max-w-[600px] mb-2 rounded-lg rounded-tl-none p-4"
            >
              <Box>
                {message.type === "revoked" ? (
                  <i className="text-black">{t("message_was_deleted")}</i>
                ) : (
                  <span className="text-black">{message.content}</span>
                )}
              </Box>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatMessageFromOther;
