import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Box,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { BsFillChatLeftDotsFill } from "react-icons/bs";

const Chat = () => {
  const { socket, User } = useStateContext();
  const [loading, setloading] = useState(false);
  const [ready, setReady] = useState(false);
  const [qr, setQr] = useState("");
  const [data, setData] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [contactValue, setContactValue] = useState("0");
  const [selectedChat, setSelectedChat] = useState(null);
  const [serverDisconnected, setServerDisconnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInputVal, setChatMessageInputVal] = useState("");

  const selectedChatRef = useRef();

  const messagesContainerRef = useRef();

  const socketURL = "http://localhost:5000";

  const fetchChatMessages = async (contact) => {
    const messages = await axios.get(
      `${socketURL}/user-chat-messages/${contact}/${User?.id}`
    );
    if(selectedChatRef.current) {
      setChatMessages(messages.data);
    }
  };

  const handleSendMessage = async (e) => {
    try {
      e.preventDefault();
      if (chatMessageInputVal) {
        await axios.post(`${socketURL}/send-message/${User?.id}`, {
          to: selectedChat.id.user + "@c.us",
          msg: chatMessageInputVal,
        });

        fetchChatMessages(selectedChatRef.current.id?.user);
        setChatMessageInputVal("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Message Couldn't be sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleInput = (e) => {
    setMessageValue(e.target.value);
  };

  const handleSelectContact = (e) => {
    setContactValue(e.target.value);
  };

  const selectChat = (contact) => {
    setSelectedChat(contact);
    selectedChatRef.current = contact;
  };

  const handleSend = async () => {
    await axios.post(`${socketURL}/send-message/${User?.id}`, {
      to: contactValue + "@c.us",
      msg: messageValue,
    });
        toast.success("Message Sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
  };

  const handleLogout = async () => {
    // await axios.post(`${socketURL}/logout/${User?.id}`);
    //     toast.success("Logged out", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
  };

  useEffect(() => {
    setloading(true);
    if (socket && User) {
      socket.on("connect", () => {
        console.log("Client Connected");
        socket.emit("connectClient", User?.id);
        setServerDisconnected(false);
        socket.on("get_qr", (data) => {
          const qrCode = data;
          setQr(qrCode);

          console.log("QR REceived");
          setloading(false);
        });

        socket.on("user_disconnected", () => {
          alert("Disconnected Device");
          document.location.reload();
        });

        socket.on("message_received", (msg) => {
            fetchChatMessages(selectedChatRef.current?.id?.user);
        });

        socket.on("user_ready", async (clientInfo) => {
          console.log("User ready");

          setloading(true);
          const chats = await axios.get(`${socketURL}/user-chats/${User?.id}`);
          console.log(chats)
          const profileImage = await axios.get(`${socketURL}/user-profilepic/${User?.id}`);
          const contacts = await axios.get(`${socketURL}/user-contacts/${User?.id}`);
          setData({
            userInfo: clientInfo,
            userContacts: contacts?.data?.filter(
              (c) => !c.isGroup && c.isMyContact
            ),
            userChats: chats.data.filter((c) => !c.isGroup),
            userProfilePic: profileImage.data,
          });
          setReady(true);
          setloading(false);
        });
      });

      socket.on("disconnect", () => {
        setServerDisconnected(true);
      });
    }
  }, [socket, User]);

  useEffect(() => {
    if (selectedChat && User) {
      fetchChatMessages(selectedChatRef.current?.id?.user);
    }
  }, [selectedChat, User]);

  useEffect(() => {

    const cb = () => {
      if(User && selectedChat) {
        fetchChatMessages(selectedChatRef?.current?.id?.user);
      }
    }
    const interval = setInterval(cb, 8000);

    return () => {
      clearInterval(interval, cb);
    }
  }, [User]);

  return (
    <>
      <Box className="min-h-screen">
        {serverDisconnected ? (
          <h1
            className="text-red-600 text-center mt-12"
            style={{ fontSize: "38px" }}
          >
            Server Disconnected!
          </h1>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center mt-16">
                <CircularProgress size={40} />
              </div>
            ) : (
              <>
                <h1>Whatsapp</h1>
                {ready ? (
                  <div className="mt-5">
                    <h1 style={{ fontSize: "38px", fontWeight: "bold" }}>
                      Connected
                    </h1>
                    <img
                      src={data?.userProfilePic}
                      width={60}
                      height={60}
                      className="rounded"
                      alt=""
                    />
                    <strong>{data?.userInfo?.pushname}</strong>
                    <p>{data?.userInfo?.me?.user}</p>
                    <Button
                      onClick={handleLogout}
                      variant="contained"
                      color="error"
                    >
                      Logout
                    </Button>
                    <div style={{ marginTop: "40px" }}>
                      {/* Send message form */}
                      <TextField
                        type="text"
                        placeholder="Type here.."
                        value={messageValue}
                        onInput={handleInput}
                      />
                      <Select
                        onChange={handleSelectContact}
                        value={contactValue}
                      >
                        <MenuItem value="0" disabled selected>
                          Select Contact
                        </MenuItem>
                        {data?.userContacts?.map((contact, index) => {
                          return (
                            <MenuItem
                              key={`${index}${contact.number}`}
                              value={contact.number}
                            >
                              {contact.name || contact.number}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <div className="mt-2">
                        <Button variant="contained" onClick={handleSend}>
                          Send
                        </Button>
                      </div>
                    </div>
                    {selectedChat && (
                      <div className="flex justify-end items-center">
                        <Button onClick={() => {
                            setSelectedChat(null);
                            selectedChatRef.current = null;
                          }}>
                          Goto Contacts
                        </Button>
                      </div>
                    )}

                    <div className="mt-4">
                      {selectedChat ? (
                        <>
                          {/* Chat Section */}
                          <div className="chat-container flex">
                            <div
                              style={{ background: "#000000c2" }}
                              className="px-1 w-[250px] pt-4"
                            >
                              <div className="bg-white py-3 rounded cursor-pointer mx-2 px-2">
                                <strong>
                                  {selectedChat?.name ||
                                    selectedChat?.number}
                                </strong>
                              </div>
                            </div>
                            <div className="flex-1">
                              {chatMessages.length > 0 ? (
                                <div
                                  ref={messagesContainerRef}
                                  className="h-[400px] overflow-y-scroll bg-gray-100 p-3 flex flex-col items-end"
                                >
                                  {chatMessages?.map((message, index) => {
                                    if (
                                      message.id.fromMe &&
                                      message.to ===
                                        selectedChat?.id?._serialized
                                    ) {
                                      return (
                                        <div
                                          key={index}
                                          style={{
                                            position: "relative",
                                            backgroundColor: "#075e54",
                                          }}
                                          className="max-w-[600px] mb-2 rounded p-2"
                                        >
                                          {message.type === "revoked" ? (
                                            <i className="text-gray-200">
                                              This message was deleted
                                            </i>
                                          ) : (
                                            <span className="text-white">
                                              {message.body}
                                            </span>
                                          )}

                                          <div
                                            style={{
                                              position: "absolute",
                                              top: -5,
                                              right: 0,
                                              borderStyle: "solid",
                                              borderWidth: "0 0 10px 10px",
                                              borderColor:
                                                "transparent transparent #075e54 transparent",
                                            }}
                                          ></div>
                                        </div>
                                      );
                                    } else {
                                      if (
                                        message.from ===
                                        selectedChat?.id?._serialized
                                      ) {
                                        return (
                                          <div
                                            key={index}
                                            style={{
                                              position: "relative",
                                              backgroundColor: "#075e54",
                                              alignSelf: "flex-start",
                                            }}
                                            className="max-w-[600px] mb-2 rounded p-2"
                                          >
                                            {message.type === "revoked" ? (
                                              <i className="text-gray-200">
                                                This message was deleted
                                              </i>
                                            ) : (
                                              <span className="text-white">
                                                {message.body}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      }
                                    }
                                  })}
                                </div>
                              ) : (
                                <div className="bg-gray-100 h-[400px] flex flex-col items-center justify-center">
                                  <BsFillChatLeftDotsFill size={40} />
                                  <p className="mt-3">
                                    Start the Conversation!
                                  </p>
                                </div>
                              )}
                              <form
                                className="flex border border-gray-400 p-2"
                                onSubmit={handleSendMessage}
                              >
                                <TextField
                                  autoComplete="off"
                                  onInput={(e) =>
                                    setChatMessageInputVal(e.target.value)
                                  }
                                  value={chatMessageInputVal}
                                  type="text"
                                  fullWidth
                                  placeholder="Type your message.."
                                />
                                <Button
                                  type="submit"
                                  variant="contained"
                                  sx={{ ml: 2, px: 5 }}
                                  color="info"
                                >
                                  Send
                                </Button>
                              </form>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* All contacts list */}
                          <h1 style={{ fontSize: "38px", fontWeight: "bold" }}>
                            Chats
                          </h1>
                          {data?.userChats?.map((chat, index) => {
                            return (
                              <div
                                onClick={() => selectChat(chat)}
                                className="bg-slate-700 text-white py-2 px-5 rounded mb-2 cursor-pointer"
                                key={`${index}${chat.id.user}`}
                              >
                                {chat.name || chat.id.user}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  qr && (
                    <QRCodeCanvas
                      style={{ width: 150, height: 150 }}
                      value={qr}
                    />
                  )
                )}
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Chat;
