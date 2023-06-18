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
  const { User, currentMode, darkModeColors } = useStateContext();
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

  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState(
    searchParams.get("phoneNumber")
  );

  const messagesContainerRef = useRef();

  const waDevice = localStorage.getItem("authenticated-wa-device");

  const fetchChatMessages = async (contact) => {
    socket.emit("get_chat", { id: waDevice, contact: contact });
    socket.on("chat", (data) => {
      if (data?.length > 0) {
        console.log(data);
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
  };

    useEffect(() => {
    if(!serverDisconnected) {
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
  }
  }, [User, socket, serverDisconnected]);

  useEffect(() => {
    if (socket && User) {
        socket.on("connect", () => {
          if(socket.id){
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
              fetchChatMessages(phoneNumber);
            });
    
            socket.on("user_disconnected", () => {
              handleLogout();
            });
    
            socket.on("logged-out", (data) => {
              if (data) {
                handleLogout();
              }
            });
          } else {
            setServerDisconnected(true);
          }
        });
        socket.on("disconnect", () => {
          setServerDisconnected(true);
        });
    }
  }, [socket]);



  useEffect(() => {
    if (User && ready) {
      fetchChatMessages(phoneNumber);
    }
  }, [User, ready]);

  useEffect(() => {
    const cb = () => {
      if (User && ready) {
        fetchChatMessages(phoneNumber);
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
                  <Devices />
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
