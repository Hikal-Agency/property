import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { socket } from "../App";
import Loader from "../../Components/Loader";
import QRCode from "./whatsapp-screens/QRCode";
import Conversation from "./whatsapp-screens/Conversation";
import Devices from "./whatsapp-screens/Devices";

const Chat = () => {
  const {
    User,
    currentMode,
    darkModeColors,
    selectedDevice,
    setSelectedDevice,
  } = useStateContext();
  const [loading, setloading] = useState(true);
  const [qr, setQr] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState([]);
  const [WALoadingScreen, setWALoadingScreen] = useState(false);
  const [serverDisconnected, setServerDisconnected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatMessageInputVal, setChatMessageInputVal] = useState("");

  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState(
    searchParams.get("phoneNumber")
  );

  const messagesContainerRef = useRef();


  const fetchChatMessages = async (contact) => {
  const waDevice = localStorage.getItem("authenticated-wa-device");
    socket.emit("get_chat", { id: waDevice, contact: contact });
    socket.on("chat", (data) => {
      if (data?.length > 0) {
        setChatMessages(() => {
          return [...data];
        });
        setChatLoading(false);
      }
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (chatMessageInputVal) {
      const waDevice = localStorage.getItem("authenticated-wa-device");
      socket.emit("send-message", {
        id: waDevice,
        to: phoneNumber + "@c.us",
        msg: chatMessageInputVal,
      });

      socket.on("sent", () => {
        fetchChatMessages(phoneNumber);
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
  const waDevice = localStorage.getItem("authenticated-wa-device");
    socket.emit("logout-user", { id: waDevice });
  };

  const logout = () => {
    const waAccount = JSON.parse(
      localStorage.getItem("authenticated-wa-account")
    );
    if (waAccount) {
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
      setloading(false);
      setQr(null);
    }
  };

  useEffect(() => {
    const waDevice = localStorage.getItem("authenticated-wa-device");
    if (!serverDisconnected) {
      const waAccount = JSON.parse(
        localStorage.getItem("authenticated-wa-account")
      );
      if (User && socket) {
        if (waDevice) {
          setloading(true);
          console.log("SocketId:", socket.id);
          socket.emit("check_device_exists", { id: waDevice });
          socket.on("check_device", (result) => {
            console.log("Result:", result);
            if (result) {
              setData({
                userInfo: waAccount?.info,
                userProfilePic: waAccount?.profile_pic_url,
              });
              setChatLoading(true);
              setReady(true);
              setloading(false);
            } else {
              socket.emit("destroy_client", waDevice);
              setSelectedDevice(null);
              setQr(null);
              setReady(false);
              logout();
            }
          });
        } else {
          setloading(false);
          if (selectedDevice && !ready) {
            socket.emit("destroy_client", selectedDevice);
            setSelectedDevice(null);
            setQr(null);
            setReady(false);
          }
        }
      }
    }
  }, [User, socket, serverDisconnected]);

  useEffect(() => {
    if (socket && User) {
      console.log("Socket connectd");

      socket.on("qr", (qr) => {
        console.log("QR Received:", qr);
        setQr(qr);
        setloading(false);
      });

      socket.on("user_ready", (info) => {
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
            setQr(null);
            setSelectedDevice("");
            setloading(false);
            setWALoadingScreen(false);
            setReady(true);
          }
        });
      });

      socket.on("new_message", () => {
        fetchChatMessages(phoneNumber);
      });

      socket.on("user_disconnected", () => {
        handleLogout();
      });

      socket.on("authenticating", (data) => {
        if (data === 0) {
          setWALoadingScreen(true);
        }
      });

      socket.on("logged-out", (data) => {
        if (data) {
          logout();
        }
      });
      socket.on("disconnect", () => {
        setServerDisconnected(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (User) {
      fetchChatMessages(phoneNumber);
    }
  }, [User, ready]);

  useEffect(() => {
    const cb = () => {
      if (User) {
        fetchChatMessages(phoneNumber);
      }
    };
    const interval = setInterval(cb, 6000);

    return () => {
      clearInterval(interval, cb);
    };
  }, [User, ready]);

  const handleCreateSession = (deviceName) => {
    if (deviceName) {
      setloading(true);
      const sessionId = `${User?.id}-${deviceName
        .toLowerCase()
        .replaceAll(" ", "-")}`;
      setSelectedDevice(sessionId);
      socket.emit("create_session", { id: sessionId });
    }
  };

  return (
    <>
      <Box className="min-h-screen mb-3" sx={darkModeColors}>
        {serverDisconnected ? (
          <h1
            className="text-red-600 text-center mt-20"
            style={{ fontSize: "38px" }}
          >
            Something went wrong <br /> Try reloading page!
          </h1>
        ) : (
          <>
            {loading || WALoadingScreen ? (
              <div className="flex h-[80vh] items-center justify-center">
                {loading ? (
                  <Loader />
                ) : (
                  <Box className="mt-10 flex flex-col items-center">
                    <img
                      className="whatsapp-logo-animation"
                      width={80}
                      height={80}
                      src="/assets/loading/whatsapp-logo.png"
                      alt=""
                    />
                    <p className="mt-3">
                      <strong>Syncing.. Keep app open!</strong>
                    </p>
                  </Box>
                )}
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
                  <Conversation
                    data={data}
                    handleLogout={handleLogout}
                    chatMessages={chatMessages}
                    handleSendMessage={handleSendMessage}
                    chatLoading={chatLoading}
                    setChatMessageInputVal={setChatMessageInputVal}
                    btnLoading={btnLoading}
                    chatMessageInputVal={chatMessageInputVal}
                    phoneNumber={phoneNumber}
                    messagesContainerRef={messagesContainerRef}
                  />
                ) : qr ? (
                  <QRCode qr={qr} />
                ) : (
                  <Devices handleCreateSession={handleCreateSession} />
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
