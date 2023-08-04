import {
  Button,
  TextField,
  CircularProgress,
  Avatar,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import CreateMessageModal from "./CreateMessageModal";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
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
import { stubFalse } from "lodash";

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
  const [userDetailsSidebarOpened, setUserDetailsSidebarOpened] =
    useState(false);
    const [createMessageModal, setCreateMessageModal] = useState({
      isOpened: false
    })
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
              <IconButton onClick={() => setCreateMessageModal({isOpened: true})} sx={{ padding: "0 !important" }}>
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
            <div className="h-[75%]">
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
          <Box className="flex-1">
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
                <div className="bg-[#fafafa] justify-end flex-1 flex flex-col items-center justify-center">
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
                  <div className="flex mt-6 items-center text-sm font-bold text-[#a4a6a8]">
                    <CgDetailsMore /> <p className="uppercase ml-2">Email</p>
                  </div>
                  <p>mjunaid.swe@gmail.com</p>
                </div>
                <div className="mb-3">
                  <div className="flex mt-6 items-center text-sm font-bold text-[#a4a6a8]">
                    <BsPhone /> <p className="uppercase ml-2">Phone Number</p>
                  </div>
                  <p>+923458880651</p>
                </div>
                <div className="mb-3">
                  <div className="flex mt-6 items-center text-sm font-bold text-[#a4a6a8]">
                    <BsPersonFill /> <p className="uppercase ml-2">Position</p>
                  </div>
                  <p>Manager</p>
                </div>
              </div>
            )}
          </Box>
        </div>
      </div>

      {createMessageModal?.isOpened && <CreateMessageModal allChats={allChats} createMessageModal={createMessageModal} handleCloseCreateMessageModal={() => setCreateMessageModal({isOpened: false})}/>}
    </>
  );
};

export default ChatConversation;
