import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, CircularProgress, Button, TextField } from "@mui/material";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import Loader from "../../Components/Loader";

const Chat = () => {
  const { socket, User, currentMode } = useStateContext();
  const [loading, setloading] = useState(true);
  const [qr, setQr] = useState("");
  const [ready, setReady] = useState(false);
  const [data, setData] = useState([]);
  const [serverDisconnected, setServerDisconnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInputVal, setChatMessageInputVal] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const messagesContainerRef = useRef();

  const socketURL = process.env.REACT_APP_SOCKET_URL;

  const fetchChatMessages = async (contact) => {
    socket.emit("get_chat", { id: User?.id, contact: contact });
    socket.on("chat", (data) => {
      setChatMessages(data);
    });
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
    socket.emit("logout", {id: User?.id});
  };

  useEffect(() => {
    if (socket && User) {
      socket.emit("create_session", { id: User?.id });
      socket.on("qr", (qr) => {
        setQr(qr);
        setloading(false);
      });

      socket.on("user_ready", (info) => {
        socket.emit("get_profile_picture", User?.id);
        socket.on("profile_picture", (url) => {
          setData({
            userInfo: info,
            userProfilePic: url,
          });
          setReady(true);
          setloading(false);
        });
      });

      socket.on("msg_received", () => {
        fetchChatMessages(searchParams.get("phoneNumber"));
      });

      socket.on("user_disconnected", () => {
        alert("Disconnected Device");
        document.location.reload();
      });

      socket.on("disconnect", () => {
        setServerDisconnected(true);
      });
    }
  }, [socket]);

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
              <div className="flex justify-center">
                <Loader />
              </div>
            ) : (
              <>
                <h1
                  className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-main-red-color font-bold border-main-red-color"
                  }`}
                >
                  Whatsapp
                </h1>

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
                    <div className="h-[60vh] flex flex-col justify-center pt-8 text-center">
                      <h1
                        style={{
                          color: currentMode === "dark" ? "white" : "black",
                          fontWeight: "bold",
                          fontSize: 26,
                          marginBottom: 25,
                        }}
                      >
                        Go to Whatsapp and Scan your device
                      </h1>
                      <QRCodeCanvas
                        style={{ width: 170, height: 170, margin: "0 auto" }}
                        value={qr}
                      />
                    </div>
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
