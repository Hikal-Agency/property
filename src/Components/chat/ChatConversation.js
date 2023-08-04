import {
  Button,
  TextField,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { useRef } from "react";
import { BiSearch } from "react-icons/bi";
import { BsFillChatLeftDotsFill, BsThreeDots } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { BsImage, BsFillChatLeftTextFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { useStateContext } from "../../context/ContextProvider";
import ChatMessageFromMe from "./ChatMessageFromMe";
import ChatMessageFromOther from "./ChatMessageFromOther";
import ChatConversationItem from "./ChatConversationItem";

const ChatConversation = ({
  chatMessages,
  handleSendMessage,
  chatLoading,
  btnLoading,
  allChats,
  currentMode,
  messageInputRef,
  activeChat,
  setActiveChat,
  loadingConversations,
  messagesContainerRef,
}) => {
  const imagePickerRef = useRef();
  const { User } = useStateContext();

  console.log("Chat", chatMessages);

  const handleChangeImage = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    console.log(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = () => {
      console.log("Result::", reader.result);
      const src = reader.result.slice(reader.result.indexOf("64,") + 3);
      handleSendMessage(null, "img", src);
    };
    reader.readAsDataURL(files[0]);
  };
  return (
    <>
      <div className={`mt-3 h-full overflow-y-hidden`}>
        <div className="rounded-sm flex h-full">
          <Box className="w-[30%] relative">
            <div className="flex items-center px-5 justify-between">
              <p style={{ paddingBottom: "1.2rem" }} className="text-2xl pt-5">
                <strong>Messages</strong>
              </p>
              <IconButton sx={{ padding: "0 !important" }}>
                <HiOutlinePencilAlt style={{ color: "#da1f26" }} size={22} />
              </IconButton>
            </div>

            <div className="w-full px-5">
              <TextField
                fullWidth
                variant="standard"
                size="small"
                className="px-3 rounded-lg"
                sx={{
                  background: "#f5f5f5",
                  "& input": {
                    padding: "12px 6px 12px 0",
                  },
                }}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment className="pl-3" position="start">
                      <BiSearch size={17} />
                    </InputAdornment>
                  ),
                }}
                placeholder="Search.."
              />
            </div>

            <div className="flex mb-3 mt-6 px-5 items-center text-sm font-bold text-[#a4a6a8]">
              <BsFillChatLeftTextFill />{" "}
              <p className="uppercase ml-2">All Chats</p>
            </div>
            <div className="h-[72%]">
              {loadingConversations ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <CircularProgress color="error" size={18} />
                  <p className="mt-3">Loading Conversations..</p>
                </div>
              ) : (
                <div className="h-full overflow-y-scroll">
                  {allChats?.map((chat) => {
                    return (
                      <ChatConversationItem
                        key={chat?.id?.user}
                        setActiveChat={setActiveChat}
                        chat={chat}
                        isActive={activeChat?.phoneNumber === chat?.id?.user}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </Box>
          <Box className="w-full">
            {activeChat.phoneNumber && (
              <Box className="px-12 flex justify-between items-center shadow py-3 w-full">
                <Box className="flex items-center w-full">
                  <Avatar
                    sx={{
                      width: 45,
                      height: 45,
                      background: "#da1f26",
                      fontSize: 15,
                    }}
                    className="mr-4"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src="https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg?w=2000"
                      alt=""
                    />
                  </Avatar>
                  <Box>
                    <p className="mb-0">
                      <strong className="text-xl">
                        {activeChat.name || activeChat.phoneNumber}
                      </strong>
                    </p>
                    <p className="text-[#c6c6c6]">@junaid.hikal</p>
                  </Box>
                </Box>
                <IconButton>
                  <BsThreeDots size={20} />
                </IconButton>
              </Box>
            )}
            <div className="flex-1 flex flex-col h-[88%]">
              {chatLoading ? (
                <div className="bg-gray-100 flex-1 flex flex-col items-center justify-center">
                  <CircularProgress color="error" size={18} />
                  <p className="mt-3">Loading the chat..</p>
                </div>
              ) : chatMessages.length > 0 ? (
                <div
                  ref={messagesContainerRef}
                  className="bg-[#fafafa] overflow-y-scroll p-3 flex-1 flex flex-col items-end"
                >
                  {chatMessages?.map((message, index) => {
                    if (
                      message?.id?.fromMe &&
                      message?.to === activeChat.phoneNumber
                    ) {
                      return (
                        <ChatMessageFromMe
                          data={User}
                          key={index}
                          message={message}
                        />
                      );
                    } else if (message.from === activeChat.phoneNumber) {
                      return (
                        <ChatMessageFromOther key={index} message={message} />
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="bg-[#fafafa] flex-1 flex flex-col items-center justify-center">
                  <BsFillChatLeftDotsFill size={40} />
                  <p className="mt-3">Start the Conversation!</p>
                </div>
              )}
              {activeChat.phoneNumber && (
                <div className="p-5 border border-[#e8e8e8]">
                  <form
                    className="relative"
                    onSubmit={(e) => handleSendMessage(e, "text")}
                  >
                    <TextField
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "0 !important",
                        },
                        background: "#f5f5f5",
                        "& input": {
                          padding: "16px 6px 16px 0",
                        },
                      }}
                      autoComplete="off"
                      ref={messageInputRef}
                      type="text"
                      fullWidth
                      variant="standard"
                      className="rounded-xl"
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment className="pl-3" position="start">
                                 <IconButton
                        onClick={() => imagePickerRef.current.click()}
                      >
                        <BsImage size={18} />
                      </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Type something.."
                    />
                    <input
                      onInput={handleChangeImage}
                      ref={imagePickerRef}
                      type="file"
                      accept="image/*"
                      id="select-img"
                      hidden
                    />
                  </form>
                </div>
              )}
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default ChatConversation;
