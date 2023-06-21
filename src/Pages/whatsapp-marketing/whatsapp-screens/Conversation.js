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
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import ConversationItem from "./ConversationItem";
import MessageFromMe from "./MessageFromMe";
import { BiLogOut, BiUser } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import MessageFromOther from "./MessageFromOther";
import { IoMdSend } from "react-icons/io";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import moment from "moment";

const Conversation = ({
  data,
  handleLogout,
  chatMessages,
  handleSendMessage,
  chatLoading,
  setChatMessageInputVal,
  btnLoading,
  allChats,
  chatMessageInputVal,
  activeChat,
  logout,
  setActiveChat,
  loadingConversations,
  messagesContainerRef,
}) => {
  const imagePickerRef = useRef();

  const handleChangeImage = (e) => {
    let files = e.target.files;
    let reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        console.log(reader.result);
        handleSendMessage(null, "img", reader.result);
      },
      false
    );

    if (files[0]) {
      reader.readAsDataURL(files[0]);
    }
  };
  return (
    <>
      <div className="flex justify-end items-center pr-5">
        <Button
          onClick={logout}
          type="button"
          variant="contained"
          sx={{ padding: "7px 6px", mb: 1 }}
          color="error"
          size="small"
        >
          <HiOutlineSwitchHorizontal style={{ marginRight: 8 }} size={20} />
          Switch Device
        </Button>
      </div>
      <div className="mt-3 h-[530px] bg-[#F6F6F6] w-[98%] rounded-lg mb-8">
        <div className="border border-[#bfbfbf] rounded-sm flex h-full">
          <Box className="w-[45%] border-[#bfbfbf] border-r relative">
            <p
              style={{ paddingBottom: "1.2rem" }}
              className="border-b border-[#bfbfbf] pl-4 pt-4"
            >
              <strong>Conversations</strong>
            </p>

            <div className="h-[88%] overflow-y-scroll">
              {loadingConversations ? (
                <div className="flex h-[80%] flex-col items-center justify-center">
                  <CircularProgress color="error" size={18} />
                  <p className="mt-3">Loading Conversations..</p>
                </div>
              ) : (
                [
                  allChats?.map((chat) => {
                    return (
                      <ConversationItem
                        key={chat.id.user}
                        setActiveChat={setActiveChat}
                        lastMsg={chat.lastMessage}
                        phNo={chat.id.user}
                        isActive={activeChat.phoneNumber === chat.id.user}
                        name={chat.name}
                      />
                    );
                  }),
                ]
              )}
            </div>

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
            {activeChat.phoneNumber && (
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
                      <strong>
                        {activeChat.name || activeChat.phoneNumber}
                      </strong>
                    </p>
                  </Box>
                </Box>
              </Box>
            )}
            <div className="flex-1 flex flex-col h-[88%]">
              {chatLoading ? (
                <>
                  <CircularProgress color="error" size={18} />
                  <p className="mt-3">Loading the chat..</p>
                </>
              ) : chatLoading ? (
                <div className="bg-gray-100 flex-1 flex flex-col items-center justify-center">
                  <div
                    ref={messagesContainerRef}
                    style={{
                      backgroundImage:
                        "url(https://i.pinimg.com/600x315/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg)",
                      backgroundPosition: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      backgroundBlendMode: "overlay",
                    }}
                    className="overflow-y-scroll p-3 flex-1 flex flex-col items-end"
                  >
                    {chatMessages?.map((message, index) => {
                      if (
                        message.id.fromMe &&
                        message.to === activeChat.phoneNumber + "@c.us"
                      ) {
                        return (
                          <MessageFromMe
                            data={data}
                            key={index}
                            message={message}
                          />
                        );
                      } else if (
                        message.from ===
                        activeChat.phoneNumber + "@c.us"
                      ) {
                        return (
                          <MessageFromOther key={index} message={message} />
                        );
                      }
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <BsFillChatLeftDotsFill size={40} />
                  <p className="mt-3">Start the Conversation!</p>
                </>
              )}
              {activeChat.phoneNumber && (
                <form
                  className="relative"
                  onSubmit={(e) => handleSendMessage(e, "text")}
                >
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "0 !important",
                        borderTop: "2px solid grey !important",
                      },
                      "& input": {
                        paddingLeft: "75px",
                        paddingRight: "75px",
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
                  <Box
                    sx={{ transform: "translateY(-50%)" }}
                    className="absolute top-[50%] left-5"
                  >
                    <IconButton onClick={() => imagePickerRef.current.click()}>
                      <BsImage size={18} />
                    </IconButton>
                  </Box>
                  <input
                    onInput={handleChangeImage}
                    ref={imagePickerRef}
                    type="file"
                    accept="image/*"
                    id="select-img"
                    hidden
                  />
                </form>
              )}
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Conversation;
