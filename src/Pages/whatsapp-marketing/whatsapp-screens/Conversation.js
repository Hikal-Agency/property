import {
  Button,
  TextField,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import ConversationItem from "./ConversationItem";
import MessageFromMe from "./MessageFromMe";
import { BiLogOut, BiUser } from "react-icons/bi";
import MessageFromOther from "./MessageFromOther";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const Conversation = ({
  data,
  handleLogout,
  chatMessages,
  handleSendMessage,
  chatLoading,
  setChatMessageInputVal,
  btnLoading,
  chatMessageInputVal,
  phoneNumber,
  messagesContainerRef,
}) => {
  let lastMessageText = "";
  let lastMessageTime = "";
  if (chatMessages.length > 0) {
    const lastMsg = chatMessages[chatMessages.length - 1];
    const lastMsgFormattedBody =
      lastMsg.body.length > 15
        ? lastMsg.body.slice(0, 15) + "..."
        : lastMsg.body;
    if (lastMsg.id.fromMe && lastMsg.to === phoneNumber + "@c.us") {
      lastMessageText = `You: ${lastMsgFormattedBody}`;
    } else {
      lastMessageText = `${lastMsgFormattedBody}`;
    }

    const today = moment();
    const msgTime = moment(lastMsg.timestamp * 1000);
    const duration = moment.duration(today.diff(msgTime));
    const seconds = Math.floor(duration.asSeconds());
    const minutes = Math.floor(duration.asMinutes());
    const hours = Math.floor(duration.asHours());
    const days = Math.floor(duration.asDays());
    const weeks = Math.floor(duration.asWeeks());

    if (weeks > 0) {
      if (days > 0) {
        lastMessageTime = `${weeks} weeks, ${days - weeks * 7} days ago`;
      } else {
        lastMessageTime = `${weeks} weeks ago`;
      }
    } else if (days > 0) {
      if (hours > 0) {
        lastMessageTime = `${days} days, ${hours - days * 24} hours ago`;
      } else {
        lastMessageTime = `${days} days ago`;
      }
    } else if (hours > 0) {
      if (minutes > 0) {
        lastMessageTime = `${hours} hours, ${minutes - hours * 60} minutes ago`;
      } else {
        lastMessageTime = `${hours} hours ago`;
      }
    } else if (minutes > 0) {
      lastMessageTime = `${minutes} minutes ago`;
    } else if (seconds > 0) {
      lastMessageTime = "a few seconds ago";
    }
  }

  console.log(chatMessages);
  return (
    <>
      <div className="mt-5 bg-[#F6F6F6] w-[98%] rounded-lg mb-8">
        <div className="border border-[#bfbfbf] rounded-sm flex h-full">
          <Box className="w-[45%] border-[#bfbfbf] border-r relative">
            <p
              style={{ paddingBottom: "1.2rem" }}
              className="border-b border-[#bfbfbf] pl-4 pt-4"
            >
              <strong>Conversations</strong>
            </p>
            <ConversationItem
              lastMessageTime={lastMessageTime}
              lastMessageText={lastMessageText}
              phoneNumber={phoneNumber}
            />

            <Box className="absolute bg-[#e5e7eb] flex items-center justify-between bottom-0 left-0 right-0 w-full px-4 py-2">
              <Box className="flex items-center">
                <img
                  className="mr-3 rounded-full"
                  width={40}
                  height={40}
                  src={data?.userProfilePic}
                  alt=""
                />
                <p className="mb-0">
                  {data?.userInfo?.pushname || data?.userInfo?.me?.user}
                </p>
              </Box>
              <IconButton onClick={handleLogout}>
                <BiLogOut />
              </IconButton>
            </Box>
          </Box>
          <Box className="w-full">
            <Box className="pl-6 py-3 border-[rgb(246,246,246)] border-b w-full">
              <Box className="flex items-center w-full">
                <Avatar
                  sx={{
                    width: 35,
                    height: 35,
                    background: "#da1f26",
                    fontSize: 15,
                  }}
                  className="mr-4"
                >
                  <BiUser size={18} />
                </Avatar>
                <Box>
                  <p className="mb-0">
                    <strong>+{phoneNumber}</strong>
                  </p>
                </Box>
              </Box>
            </Box>
            <div className="flex-1">
              {chatMessages.length > 0 ? (
                <div
                  ref={messagesContainerRef}
                  style={{
                    backgroundImage:
                      "url(https://i.pinimg.com/600x315/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg)",
                    backgroundPosition: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    backgroundBlendMode: "overlay",
                  }}
                  className="h-[530px] overflow-y-scroll p-3 flex flex-col items-end"
                >
                  {chatMessages?.map((message, index) => {
                    if (
                      message.id.fromMe &&
                      message.to === phoneNumber + "@c.us"
                    ) {
                      return (
                        <MessageFromMe
                          data={data}
                          key={index}
                          message={message}
                        />
                      );
                    } else if (message.from === phoneNumber + "@c.us") {
                      return <MessageFromOther key={index} message={message} />;
                    }
                  })}
                </div>
              ) : (
                <div className="bg-gray-100 h-[530px] flex flex-col items-center justify-center">
                  {chatLoading ? (
                    <>
                      <CircularProgress color="error" size={18} />
                      <p className="mt-3">Loading the chat..</p>
                    </>
                  ) : (
                    <>
                      <BsFillChatLeftDotsFill size={40} />
                      <p className="mt-3">Start the Conversation!</p>
                    </>
                  )}
                </div>
              )}
              <form className="relative" onSubmit={handleSendMessage}>
                <TextField
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "0 !important",
                      borderTop: "2px solid grey !important",
                    },
                  }}
                  autoComplete="off"
                  onInput={(e) => setChatMessageInputVal(e.target.value)}
                  value={chatMessageInputVal}
                  type="text"
                  fullWidth
                  placeholder="Type something.."
                />
                <Box
                  sx={{ transform: "translateY(-50%)" }}
                  className="absolute top-[50%] right-5"
                >
                  <IconButton type="submit">
                    {btnLoading ? (
                      <CircularProgress size={18} sx={{ color: "black" }} />
                    ) : (
                      <IoMdSend style={{ color: "black" }} />
                    )}
                  </IconButton>
                </Box>
              </form>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Conversation;
