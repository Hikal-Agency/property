import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, CircularProgress, Button, TextField } from "@mui/material";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";

const Chat = () => {
  const { socket, User } = useStateContext();
  const [loading, setloading] = useState(true);
  const [qr, setQr] = useState("");
  const [ready, setReady] = useState(false);
  const [data, setData] = useState([]);
  const [serverDisconnected, setServerDisconnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInputVal, setChatMessageInputVal] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const messagesContainerRef = useRef();

  const socketURL = "http://localhost:5000";

  const fetchChatMessages = async (contact) => {
    const messages = await axios.get(
      `${socketURL}/user-chat-messages/${contact}/${User?.id}`
    );
    console.log("Messages Data: ", messages.data);
    setChatMessages(messages.data);
  };

  const handleSendMessage = async (e) => {
    try {
      e.preventDefault();
      if (chatMessageInputVal) {
        await axios.post(`${socketURL}/send-message/${User?.id}`, {
          to: searchParams.get("phoneNumber") + "@c.us",
          msg: chatMessageInputVal,
        });

        fetchChatMessages(searchParams.get("phoneNumber"));
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
    if (socket && User) {
      socket.on("connect", () => {
        console.log("Client Connected");
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

        socket.on("message_received", () => {
          fetchChatMessages(searchParams.get("phoneNumber"));
        });
        console.log(searchParams.get("phoneNumber"));

        socket.on("user_ready", async (clientInfo) => {
          console.log("User ready");

          setloading(true);
          const profileImage = await axios.get(
            `${socketURL}/user-profilepic/${User?.id}`
          );
          setData({
            userInfo: clientInfo,
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

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (User && ready) {
      fetchChatMessages(searchParams.get("phoneNumber"));
    }
  }, [User, ready]);

  useEffect(() => {
    const cb = () => {
      if (User && ready) {
        fetchChatMessages(searchParams.get("phoneNumber"));
      }
    };
    const interval = setInterval(cb, 6000);

    return () => {
      clearInterval(interval, cb);
    };
  }, [User, ready]);

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

                    <div className="mt-4">
                      {/* Chat Section */}
                      <div className="chat-container flex">
                        <div
                          style={{ background: "#000000c2" }}
                          className="px-1 w-[250px] pt-4"
                        >
                          <div className="bg-white py-3 rounded cursor-pointer mx-2 pl-3">
                            <strong>{searchParams.get("phoneNumber")}</strong>
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
                                    searchParams.get("phoneNumber") + "@c.us"
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
                                    searchParams.get("phoneNumber") + "@c.us"
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
                              <p className="mt-3">Start the Conversation!</p>
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
