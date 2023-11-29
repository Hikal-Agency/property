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
import { socket } from "../../App";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import ConversationItem from "./ConversationItem";
import MessageFromMe from "./MessageFromMe";
import { BiLogOut, BiUser } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import MessageFromOther from "./MessageFromOther";
import { IoMdSend } from "react-icons/io";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { toast } from "react-toastify";

const Conversation = ({
  data,
  handleLogout,
  chatMessages,
  handleSendMessage,
  chatLoading,
  btnLoading,
  allChats,
  currentMode,
  messageInputRef,
  activeChat,
  logout,
  setActiveChat,
  loadingConversations,
  messagesContainerRef,
}) => {
  const imagePickerRef = useRef();


  async function sendWhatsappImage(contact, imgBinary) {
    try {

      const waDevice = localStorage.getItem("authenticated-wa-device");
      if (waDevice) {
        socket.emit("whatsapp_check_device_exists_send_msg_modal", {
          id: waDevice,
        });
        socket.on("whatsapp_check_device_send_msg_modal", (result) => {
          if (result) {
            socket.emit("whatsapp_send-bulk-image", {
              contacts: [contact],
              img: imgBinary,
              id: waDevice,
              caption: "",
            });
          }
        });
      } else {
        toast.error("Connect your device first! ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      // const responses = await Promise.all(
      //   contactList.map((contact) => {
      //     var urlencoded = new URLSearchParams();
      //     urlencoded.append("token", ULTRA_MSG_TOKEN);
      //     urlencoded.append("to", "+" + contact);

      //     const modifiedMessageText = messageText
      //       .toString()
      //       .replaceAll("**", "*");
      //     urlencoded.append("body", modifiedMessageText);

      //     var myHeaders = new Headers();
      //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      //     return fetch(`${ULTRA_MSG_API}/instance24405/messages/chat`, {
      //       headers: myHeaders,
      //       method: "POST",
      //       body: urlencoded,
      //     }).then((response) => response.json());
      //   })
      // );
      // const allSentMessages = [];
      // responses.forEach((response, index) => {
      //   if (!response?.error) {
      //     const messageInfo = {
      //       msg_to: contactList[index],
      //       msg_from: whatsappSenderNo,
      //       message: messageText,
      //       type: "sent",
      //       userID: User?.id,
      //       source: "whatsapp",
      //       status: 1,
      //     };
      //     allSentMessages.push(messageInfo);
      //   }
      // });

      // saveMessages(allSentMessages);
    } catch (error) {
      console.log(error);
      toast.error("There is some issue!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

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
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      const imgBinary = e.target.result;
      sendWhatsappImage(activeChat?.phoneNumber, imgBinary);
    };
  };
  return (
    <>
      <div className="flex justify-end items-center pr-5">
        <Button
          onClick={() => logout(false)}
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
      <div className={`mt-3 h-[530px] section-container-${currentMode}`}>
        <div className="border border-[#bfbfbf] rounded-sm flex h-full">
          <Box className="w-[45%] border-[#bfbfbf] border-r relative">
            <p
              style={{ paddingBottom: "1.2rem" }}
              className="border-b border-[#bfbfbf] pl-4 pt-4"
            >
              <strong>Conversations</strong>
            </p>

            <div className="h-[79%] overflow-y-scroll">
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
                        key={chat?.id?.user}
                        setActiveChat={setActiveChat}
                        chat={chat}
                        isActive={activeChat?.phoneNumber === chat?.id?.user}
                      />
                    );
                  }),
                ]
              )}
            </div>

            <Box className="absolute bg-[#c6c6c6] flex items-center justify-between bottom-0 left-0 right-0 w-full px-4 py-2">
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
                      fontSize: 15,
                    }}
                    className="mr-4 bg-btn-primary"
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
                <div className="bg-gray-100 flex-1 flex flex-col items-center justify-center">
                  <CircularProgress color="error" size={18} />
                  <p className="mt-3">Loading the chat..</p>
                  </div>
              ) : chatMessages.length > 0 ? (
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
              ) : (
                <div className="bg-gray-100 flex-1 flex flex-col items-center justify-center">
                  <BsFillChatLeftDotsFill size={40} />
                  <p className="mt-3">Start the Conversation!</p>
                  </div>
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
                    ref={messageInputRef}
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
