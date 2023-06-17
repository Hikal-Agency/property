import { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Box, CircularProgress, Button, TextField } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { socket } from "../App";
import Loader from "../../Components/Loader";

const Chat = () => {
  const { User, currentMode, darkModeColors, } = useStateContext();
  const [loading, setloading] = useState(true);
  const [qr, setQr] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [data, setData] = useState([]);
  const [serverDisconnected, setServerDisconnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInputVal, setChatMessageInputVal] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();

  const messagesContainerRef = useRef();

  const waDevice = localStorage.getItem("authenticated-wa-device");

  const fetchChatMessages = async (contact) => {
    socket.emit("get_chat", { id: waDevice, contact: contact });
    socket.on("chat", (data) => {
      if(data?.length > 0) {
        setChatMessages(() => {
          return [...data];
        });
      }
      setChatLoading(false);
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (chatMessageInputVal) {
      socket.emit("send-message", {
        id: waDevice,
        to: searchParams.get("phoneNumber") + "@c.us",
        msg: chatMessageInputVal,
      });

      socket.on("sent", () => {
        fetchChatMessages(searchParams.get("phoneNumber"));
        setChatMessageInputVal("");
        setBtnLoading(false);
      });

      socket.on("failed", () => {
        toast.error("Message Couldn't be sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    }
  };

  const handleLogout = () => {
    socket.emit("logout-user", { id: waDevice });
  };

  const logout = () => {
          localStorage.removeItem("authenticated-wa-device");
          localStorage.removeItem("authenticated-wa-account");
          toast.success("You are logged out successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setReady(false);
          setDeviceName("");
          setloading(false);
          setQr(null);
  }

  useEffect(() => {
    const waAccount = JSON.parse(
      localStorage.getItem("authenticated-wa-account")
    );
    if (User && socket) {
      if (waDevice) {
        setDeviceName(waDevice);
        setData({
          userInfo: waAccount?.info,
          userProfilePic: waAccount?.profile_pic_url,
        });
        setChatLoading(true);
        setReady(true);
        setloading(false);
      } else {
        setQr(null);
        setReady(false);
      }
    }
  }, [User, socket]);

  useEffect(() => {
    if (socket && User) {
      socket.on("connect", () => {
        setServerDisconnected(false);
        setloading(false);
      socket.on("qr", (qr) => {
        setQr(qr);
        setloading(false);
      });

      socket.on("user_ready", (info) => {
        setDeviceName(info.sessionId);
        setChatLoading(true);
        socket.emit("get_profile_picture", { id: info.sessionId });
        socket.on("profile_picture", (url) => {
          localStorage.setItem("authenticated-wa-device", info.sessionId);
          console.log("url: ", url);
          if (url !== null) {
            setData({
              userInfo: info,
              userProfilePic: url,
            });
            localStorage.setItem(
              "authenticated-wa-account",
              JSON.stringify({
                info: info,
                profile_pic_url: url,
              })
            );
            setReady(true);
            setloading(false);
          }
        });
      });

      socket.on("new_message", () => {
        fetchChatMessages(searchParams.get("phoneNumber"));
      });

      socket.on("user_disconnected", () => {
        handleLogout();
      });

      socket.on("logged-out", (data) => {
        if (data) {
          handleLogout();
        }
      });

    })

      socket.on("disconnect", () => {
        setServerDisconnected(true);
        logout(); 
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

  const handleAddDevice = () => {
    if (deviceName) {
      setloading(true);
      const sessionId = `${User?.id}-${deviceName
        .toLowerCase()
        .replaceAll(" ", "-")}`;
      socket.emit("create_session", { id: sessionId });
    }
  };

  return (
    <>
      <Box className="min-h-screen" sx={darkModeColors}>
        {serverDisconnected ? (
          <h1
            className="text-red-600 text-center mt-12"
            style={{ fontSize: "38px" }}
          >
            Something went wrong!
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

                <div
                  style={{ display: qr || ready ? "none" : "flex" }}
                  className="flex flex-col w-[230px]"
                >
                  <TextField
                    value={deviceName}
                    onInput={(e) => setDeviceName(e.target.value)}
                    sx={{ mb: 1 }}
                    type="text"
                    label="Device Name"
                  ></TextField>
                  <Button
                    onClick={handleAddDevice}
                    variant="contained"
                    color="error"
                  >
                    Add Device
                  </Button>
                </div>

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
                              {chatLoading ? (
                                <>
                                  <CircularProgress color="error" size={18} />
                                  <p className="mt-3">Loading the chat..</p>
                                </>
                              ) : (
                                <>
                                  <BsFillChatLeftDotsFill size={40} />
                                  <p className="mt-3">
                                    Start the Conversation!
                                  </p>
                                </>
                              )}
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
                              {btnLoading ? (
                                <CircularProgress
                                  size={18}
                                  sx={{ color: "white" }}
                                />
                              ) : (
                                <span>Send</span>
                              )}
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
                        Go to Whatsapp and Scan this QR
                      </h1>
                      <Box className="p-1 bg-white rounded">
                        <QRCodeCanvas
                          style={{ width: 170, height: 170, margin: "0 auto" }}
                          value={qr}
                        />
                      </Box>
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
