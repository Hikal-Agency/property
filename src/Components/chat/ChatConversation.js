import {
  Button,
  TextField,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { useRef, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import CreateMessageModal from "./CreateMessageModal";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { socket } from "../../Pages/App";
import {
  BsPersonFill,
  BsImage,
  BsFillChatLeftTextFill,
  BsPhone,
} from "react-icons/bs";
import { AiOutlineInfoCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useStateContext } from "../../context/ContextProvider";
import { CgDetailsMore } from "react-icons/cg";
import ChatMessageFromMe from "./ChatMessageFromMe";
import ChatMessageFromOther from "./ChatMessageFromOther";
import ChatConversationItem from "./ChatConversationItem";

const ChatConversation = ({
  chatMessages,
  handleSendMessage,
  chatLoading,
  btnLoading,
  onlineChats,
  recentChats,
  currentMode,
  activeChat,
  setActiveChat,
  loadingConversations,
  messagesContainerRef,
}) => {
  const imagePickerRef = useRef();
  const [userDetailsSidebarOpened, setUserDetailsSidebarOpened] =
    useState(false);
  const [messageInputVal, setMessageInputVal] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [isTyping, setIsTyping] = useState(false);
  const [createMessageModal, setCreateMessageModal] = useState({
    isOpened: false,
  });
  const { User } = useStateContext();

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

  const handleMessageInputVal = (e) => {
    setMessageInputVal(e.target.value);
    setTimeout(() => {
      socket.emit("chat_user-typing", { userId: activeChat?.loginId });
    }, 100);
  };

  useEffect(() => {
    if (User) {
      socket.on("chat_user-typing", (user) => {
        let typingTimeout;
        if (user?.loginId === User?.loginId) {
          if (!isTyping) {
            setIsTyping(true);
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
              setIsTyping(false);
            }, 1400);
          } else {
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
              setIsTyping(false);
            }, 1400);
          }
        }
      });
    }
  }, [User, activeChat]);

  return (
    <>
      <div className={`mt-3 h-full overflow-y-hidden`}>
        <div className="rounded-sm flex h-full">
          <Box className="w-[30%] relative">
            <div className="flex items-center px-5 justify-between">
              <p style={{ paddingBottom: "1.2rem" }} className="text-2xl pt-5">
                <strong>Messages</strong>
              </p>
              <IconButton
                onClick={() => setCreateMessageModal({ isOpened: true })}
                sx={{ padding: "0 !important" }}
              >
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

            <div className="flex my-6 px-5 items-center">
              <Button
                onClick={() => setActiveTab("recent")}
                className={`flex-1`}
                variant="contained"
                style={{
                  boxShadow: "none",
                  background: activeTab === "recent" ? "#da1f26" : "#f7f7f7",
                  color: activeTab === "recent" ? "white" : "black",
                  padding: "10px 0",
                }}
              >
                Recent Chats
              </Button>
              <Button
                onClick={() => setActiveTab("online")}
                className={`flex-1`}
                variant="contained"
                style={{
                  background: activeTab === "online" ? "#da1f26" : "#f7f7f7",
                  boxShadow: "none",
                  color: activeTab === "online" ? "white" : "black",
                  padding: "10px 0",
                }}
              >
                Online Users
              </Button>
            </div>
            <div className="h-[70%]">
              {loadingConversations ? (
                <div className="flex h-full flex-col items-center justify-center">
                  <CircularProgress color="error" size={18} />
                  <p className="mt-3">Loading Conversations..</p>
                </div>
              ) : (
                <div className="h-full overflow-y-scroll">
                  <div
                    className={`${activeTab === "online" ? "active-tab" : ""}`}
                  >
                    {activeTab === "online" && [
                      onlineChats?.filter(
                        (chat) => chat?.loginId !== User?.loginId
                      )?.length > 0 ? (
                        [
                          onlineChats?.map((chat) => {
                            return (
                              <ChatConversationItem
                                key={chat?.id}
                                onClick={() => {
                                  setActiveChat(chat);
                                }}
                                chat={chat}
                                isActive={activeChat?.loginId === chat?.loginId}
                              />
                            );
                          }),
                        ]
                      ) : (
                        <div className="mt-4 flex justify-center items-center">
                          <p className="font-bold text-[#da1f26]">
                            Seems ilke no one is Online at this moment.
                          </p>
                        </div>
                      ),
                    ]}
                  </div>
                  <div
                    className={`${activeTab === "recent" ? "active-tab" : ""}`}
                  >
                    {activeTab === "recent" && [
                      recentChats?.length > 0 ? (
                        [
                          recentChats?.map((chat) => {
                            return (
                              <ChatConversationItem
                                key={chat?._id}
                                onClick={() =>
                                  setActiveChat({
                                    ...JSON.parse(
                                      User?.loginId === chat?.from
                                        ? chat?.toData
                                        : chat?.fromData
                                    ),
                                  })
                                }
                                chat={
                                  User?.loginId === chat?.from
                                    ? {
                                        ...JSON.parse(chat?.toData),
                                      }
                                    : {
                                        ...JSON.parse(chat?.fromData),
                                      }
                                }
                                isActive={
                                  activeChat?.loginId ===
                                  (User?.loginId === chat?.from
                                    ? chat?.to
                                    : chat?.from)
                                }
                              />
                            );
                          }),
                        ]
                      ) : (
                        <div className="mt-4 flex justify-center items-center">
                          <p className="font-bold text-[#da1f26]">
                            You dont have any recent chat with anyone!
                          </p>
                        </div>
                      ),
                    ]}
                  </div>
                </div>
              )}
            </div>
          </Box>
          <Box className="flex-1">
            {activeChat?.loginId && (
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
                      src={
                        activeChat?.profile_picture || activeChat?.displayImg
                      }
                      alt=""
                    />
                  </Avatar>
                  <Box>
                    <p className="mb-0">
                      <strong className="text-xl">
                        {activeChat?.userName}
                      </strong>
                    </p>
                    <p>
                      {isTyping ? (
                        <span>Typing..</span>
                      ) : (
                        [
                          onlineChats?.some(
                            (chat) => chat?.loginId === activeChat?.loginId
                          ) ? (
                            <span className="text-green-600">Online</span>
                          ) : (
                            <span className="text-[#838383]">Offline</span>
                          ),
                        ]
                      )}
                    </p>
                  </Box>
                </Box>
                {!userDetailsSidebarOpened && (
                  <IconButton onClick={() => setUserDetailsSidebarOpened(true)}>
                    <AiOutlineInfoCircle size={20} />
                  </IconButton>
                )}
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
                  className="bg-[#fafafa] scroll-smooth overflow-y-scroll p-3 flex-1 flex flex-col items-end"
                >
                  {chatMessages?.map((message, index) => {
                    if (message.type === "date-separator") {
                      return (
                        <div className="flex items-center w-full mt-4">
                          <div className="h-[0.2px] bg-[#d7222973] flex-1"></div>
                          <strong className="text-[#da1f26] px-2">
                            {message?.date === new Date()?.toLocaleDateString()
                              ? "TODAY"
                              : message?.date}
                          </strong>
                          <div className="h-[0.2px] bg-[#d7222973] flex-1"></div>
                        </div>
                      );
                    } else if (
                      message?.from === User?.loginId &&
                      message.to === activeChat?.loginId
                    ) {
                      return (
                        <ChatMessageFromMe
                          data={User}
                          key={index}
                          message={message}
                        />
                      );
                    } else if (
                      message.from === activeChat?.loginId &&
                      message.to === User?.loginId
                    ) {
                      return (
                        <ChatMessageFromOther
                          key={index}
                          data={activeChat}
                          message={message}
                        />
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </div>
              ) : (
                <div
                  className={`${
                    currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#fafafa]"
                  }  flex-1 flex flex-col items-center justify-center`}
                >
                  <BsFillChatLeftDotsFill
                    size={40}
                    color={currentMode === "dark" ? "#ffffff" : "#000000"}
                  />
                  <p
                    className={`mt-3 ${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    }`}
                  >
                    Start the Conversation!
                  </p>
                </div>
              )}
              {activeChat?.loginId && (
                <div className="p-5 border border-[#e8e8e8]">
                  <form
                    className="relative"
                    onSubmit={(e) => {
                      handleSendMessage({
                        e,
                        type: "text",
                        content: messageInputVal?.trim(),
                      });
                      setMessageInputVal("");
                    }}
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
                      value={messageInputVal}
                      onInput={handleMessageInputVal}
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
          <Box
            className={`${userDetailsSidebarOpened ? "w-[22%]" : "w-0"} ${
              userDetailsSidebarOpened && "px-8"
            } relative`}
            style={{
              transition: "width .4s ease-in-out",
            }}
          >
            {userDetailsSidebarOpened && (
              <div>
                {userDetailsSidebarOpened && (
                  <div className="flex mb-4 items-center justify-end">
                    <IconButton
                      onClick={() => setUserDetailsSidebarOpened(false)}
                    >
                      <AiOutlineCloseCircle />
                    </IconButton>
                  </div>
                )}
                <div className="mb-3">
                  <div className="flex mt-6 mb-1 items-center text-sm font-bold text-[#a4a6a8]">
                    <CgDetailsMore /> <p className="uppercase ml-2">Email</p>
                  </div>
                  <p>
                    {activeChat?.userEmail || activeChat?.userAltEmail || "-"}
                  </p>
                </div>
                <div className="mb-3">
                  <div className="flex mb-1 mt-6 items-center text-sm font-bold text-[#a4a6a8]">
                    <BsPhone /> <p className="uppercase ml-2">Phone Number</p>
                  </div>
                  <p>{activeChat?.userContact || "-"}</p>
                </div>
                <div className="mb-3">
                  <div className="flex mb-1 mt-6 items-center text-sm font-bold text-[#a4a6a8]">
                    <BsPersonFill /> <p className="uppercase ml-2">Position</p>
                  </div>
                  <p>{activeChat?.position}</p>
                </div>
              </div>
            )}
          </Box>
        </div>
      </div>

      {createMessageModal?.isOpened && (
        <CreateMessageModal
          setActiveChat={setActiveChat}
          recentChats={recentChats}
          createMessageModal={createMessageModal}
          handleCloseCreateMessageModal={() =>
            setCreateMessageModal({ isOpened: false })
          }
        />
      )}
    </>
  );
};

export default ChatConversation;
