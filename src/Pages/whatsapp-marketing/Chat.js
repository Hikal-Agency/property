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
import axios from "../../axoisConfig";

const Chat = () => {
  const {
    User,
    currentMode,
    darkModeColors,
    selectedDevice,
    setSelectedDevice,
    BACKEND_URL,
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
  const [devicesList, setDevicesList] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [allChats, setAllChats] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const messageInputRef = useRef("");
  const [activeChat, setActiveChat] = useState({
    phoneNumber: null,
    name: "",
  });

  const messagesContainerRef = useRef();
  
  const fetchChatMessages = async (contact, callback) => {
    const waDevice = localStorage.getItem("authenticated-wa-device");
    if (waDevice) {
      socket.emit("whatsapp_get_chat", { id: waDevice, contact: contact });
      socket.on("whatsapp_chat", (data) => {
        if (data?.length > 0) {
            setChatMessages([...data]);
          if (callback) callback();
          setChatLoading(false);
        }
      });
    }
  };

  const handleSendMessage = (e = null, type, base64 = null) => {
    e?.preventDefault();
    const waDevice = localStorage.getItem("authenticated-wa-device");
    setBtnLoading(true);
    if (type === "text") {
      if (messageInputRef.current?.querySelector("input").value && socket?.id) {
        socket.emit("whatsapp_send-message", {
          id: waDevice,
          to: activeChat.phoneNumber + "@c.us",
          msg: messageInputRef?.current?.querySelector("input").value,
          type: "text",
        });

        socket.on("whatsapp_sent", () => {
          fetchChatMessages(activeChat.phoneNumber, () => {
            setBtnLoading(false);
          });
          if(messageInputRef.current) {
            messageInputRef.current.querySelector("input").value = "";
          }
        });

        socket.on("whatsapp_failed", () => {
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
      } else {
        toast.error("Server is disconnected!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else if (type === "img") {
      setBtnLoading(true);
      socket.emit("whatsapp_send-message", {
        to: activeChat.phoneNumber + "@c.us",
        id: waDevice,
        type: "img",
        base64: base64,
      });

      socket.on("whatsapp_sent", () => {
        fetchChatMessages(activeChat.phoneNumber, () => {
          setBtnLoading(false);
        });
          if(messageInputRef.current) {
        messageInputRef.current.querySelector("input").value = "";
          }
      });

      socket.on("whatsapp_failed", () => {
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
    if (socket?.id) {
      setloading(true);
      socket.emit("whatsapp_logout-user", { id: waDevice });
    } else {
      toast.error("Server is disconnected!", {
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

  const logout = (showNotif = true) => {
    const waAccount = JSON.parse(
      localStorage.getItem("authenticated-wa-account")
    );
    if (waAccount) {
      localStorage.removeItem("authenticated-wa-device");
      localStorage.removeItem("authenticated-wa-account");
      if (showNotif) {
        toast.success("You are logged out successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      fetchDevices();
      setActiveChat({
        phoneNumber: null,
        name: "",
      });
      setChatMessages([]);

      setSelectedDevice(null);
      setReady(false);
      setChatLoading(false);
      setServerDisconnected(false);
      setQr(null);
      setloading(false);
    }
  };

  const fetchDevices = async () => {
    setloading(true);
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/instances`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setDevicesList(response.data.instances.data?.filter((device) => device?.user_id === User?.id));
      setloading(false);
  };

  const connectDevice = async (deviceName, phoneNo) => {
    const token = localStorage.getItem("auth-token");
    const devices = await axios.get(`${BACKEND_URL}/instances`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const findDevice = devices.data.instances.data.find(
      (device) => `${device.user_id}-${device.instance_name}` === deviceName && device.user_id === User?.id
    );

    if (findDevice) {
      const deviceId = findDevice?.id;
      const DeviceData = new FormData();
      DeviceData.append("status", "connected");
      DeviceData.append("phone_number", phoneNo);
      await axios.post(`${BACKEND_URL}/instances/${deviceId}`, DeviceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
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
          socket.emit("whatsapp_check_device_exists", { id: waDevice });
          socket.on("whatsapp_check_device", (result) => {
            console.log("Result:", result);
            if (result) {
              setData({
                userInfo: waAccount?.info,
                userProfilePic: waAccount?.profile_pic_url,
              });
              setReady(true);
              setloading(false);
            } else {
              disconnectDevice(waDevice);
              socket.emit("whatsapp_destroy_client", waDevice);
              setSelectedDevice(null);
              setQr(null);
              setReady(false);
              fetchDevices();
              logout();
            }
          });
        } else {
          if (selectedDevice?.sessionId && !ready) {
            socket.emit("whatsapp_destroy_client", selectedDevice?.sessionId);
            setSelectedDevice(null);
            setQr(null);
            setReady(false);
          }
          fetchDevices();
        }
      }
    }
  }, [User, socket, serverDisconnected]);

  const disconnectDevice = async (deviceName) => {
    const token = localStorage.getItem("auth-token");
    const devices = await axios.get(`${BACKEND_URL}/instances`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const findDevice = devices.data.instances.data.find(
      (device) =>
        device.instance_name === deviceName.slice(deviceName.indexOf("-") + 1)
    );
    if (findDevice) {
      const deviceId = findDevice?.id;
      const DeviceData = new FormData();
      DeviceData.append("status", "disconnected");
      DeviceData.append("phone_number", "");
      await axios.post(`${BACKEND_URL}/instances/${deviceId}`, DeviceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      
      document.location.reload();
    }
  };

  useEffect(() => {
    if (socket && User) {
      console.log("Socket connectd");

      socket.on("whatsapp_qr", (qr) => {
        console.log("QR Received:", qr);
        setQr(qr);
        setloading(false);
      });

      socket.on("whatsapp_user_ready", (info) => {
        console.log("Ready");
        socket.emit("whatsapp_get_profile_picture", { id: info.sessionId });
        socket.on("whatsapp_profile_picture", (url) => {
          localStorage.setItem("authenticated-wa-device", info.sessionId);
          console.log("url: ", url);
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
            connectDevice(info.sessionId, info?.me?.user);
            setQr(null);
            setloading(false);
            setWALoadingScreen(false);
            setReady(true);
            // setSelectedDevice(null);
        });
      });

      socket.on("whatsapp_new_message", () => {
        fetchChatMessages(activeChat.phoneNumber);
      });

      socket.on("whatsapp_user_disconnected", (id) => {
        disconnectDevice(id);
        handleLogout();
      });

      socket.on("whatsapp_authenticating", (data) => {
        if (data === 0) {
          setWALoadingScreen(true);
        }
      });

      socket.on("whatsapp_logged-out", (data) => {
        console.log("Logged")
        if (data.status) {
          disconnectDevice(data.id);
          setloading(false);
          logout();
        }
      });
      // socket.on("whatsapp_disconnect", () => {
      //   const waDevice = localStorage.getItem("authenticated-wa-device");
      //   if (waDevice) {
      //     disconnectDevice(waDevice);
      //     setServerDisconnected(true);
      //   }
      // });
    }
  }, [socket]);

  useEffect(() => {
    if (User && ready && activeChat.phoneNumber) {
      setChatLoading(true);
      fetchChatMessages(activeChat.phoneNumber);
    }

    const waDevice = localStorage.getItem("authenticated-wa-device");
    if (waDevice) {
      socket.emit("whatsapp_get-all-chats", { id: waDevice });
      socket.on("whatsapp_all-chats", (data) => {
        console.log("All Chats:", data);
        if (data.length > 0) {
          setLoadingConversations(false);
          const phNo = searchParams.get("phoneNumber");
          if (phNo) {
            const findChat = data.find((chat) => chat.id.user === phNo);
            if (findChat) {
              setAllChats([findChat]);
            } else {
              setAllChats({
                id: {
                  user: phNo,
                },
                name: "",
                lastMessage: "",
              });
            }
            setActiveChat({
              phoneNumber: null,
              name: "",
            });
          } else {
            setAllChats(() => {
              return data.filter((chat) => {
                return !chat.isGroup;
              });
            });
          }
        }
      });
    }
  }, [User, ready, activeChat.phoneNumber, searchParams]);


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

  useEffect(() => {
    const cb = () => {
      if (User && ready && activeChat.phoneNumber) {
        fetchChatMessages(activeChat.phoneNumber);
      }
    };
    const interval = setInterval(cb, 4000);

    return () => {
      clearInterval(interval, cb);
    };
  }, [User, ready, activeChat.phoneNumber]);

  console.log("Selec::", selectedDevice);

  const handleCreateSession = (deviceName, deviceId) => {
    if (deviceName) {
      setloading(true);
      const sessionId = `${User?.id}-${deviceName
        .toLowerCase()
        .replaceAll(" ", "-")}`;
      if (socket?.id) {
        setSelectedDevice({ sessionId, deviceId });
        socket.emit("whatsapp_create_session", { id: sessionId, deviceId });
      } else {
        toast.error("Server is disconnected!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setloading(false);
      }
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
                      : "text-primary font-bold border-primary"
                  }`}
                >
                  ● Whatsapp
                </h1>
                <div className={`section-container-${currentMode}`}>
                  {ready ? (
                    <Conversation
                      currentMode={currentMode}
                      data={data}
                      setActiveChat={setActiveChat}
                      allChats={allChats}
                      logout={logout}
                      handleLogout={handleLogout}
                      chatMessages={chatMessages}
                      loadingConversations={loadingConversations}
                      handleSendMessage={handleSendMessage}
                      chatLoading={chatLoading}
                      btnLoading={btnLoading}
                      messageInputRef={messageInputRef}
                      activeChat={activeChat}
                      messagesContainerRef={messagesContainerRef}
                    />
                  ) : qr ? (
                    <QRCode qr={qr} />
                  ) : (
                    <Devices
                      fetchDevices={fetchDevices}
                      devices={devicesList}
                      handleCreateSession={handleCreateSession}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Chat;
