import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useStateContext } from "../../context/ContextProvider";
import { useSearchParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import {BsFillChatLeftDotsFill} from "react-icons/bs";

const WhatsappChat = () => {
  const ULTRA_MSG_INSTANCE = process.env.REACT_APP_ULTRA_MSG_INSTANCE;
  const ULTRA_MSG_TOKEN = process.env.REACT_APP_ULTRA_MSG_TOKEN;

  const { currentMode } = useStateContext();
  const [QRImage, setQRImage] = useState(null);
  const [userProfile, setUserProfile] = useState("");
  const [chatsList, setChatsList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState("");
  const [contactName, setContactName] = useState("");

  const messagesContainerRef = useRef(null);

  const getMessages = async () => {
    try {
      const phNo = searchParams.get("phNo").toString().trim() + "@c.us";
      const messages = await axios.get(
        `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE}/messages?status=sent&sort=asc&limit=1000&token=${ULTRA_MSG_TOKEN}`
      );
      setMessages(
        messages.data.messages.filter((message) => {
          return message.to === phNo;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const setContact = async () => {
    try {
      const contact = await axios.get(`https://api.ultramsg.com/${ULTRA_MSG_INSTANCE}/contacts/contact?chatId=${searchParams.get("phNo")}@c.us&token=${ULTRA_MSG_TOKEN}`);
      if(contact?.data?.name) {
        setContactName(contact.data.name);
      } else {
        setContactName("+" + searchParams.get("phNo"));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchQRImage = async () => {
    try {
      const response = await axios.get(
        `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE}/instance/qr?token=${ULTRA_MSG_TOKEN}`, {
          responseType: "blob",
        }
      );
      console.log(response);
      if (response.data.error) {
        setQRImage(null);
        const urls = [
          `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE}/instance/me?token=${ULTRA_MSG_TOKEN}`,
          `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE}/chats?token=${ULTRA_MSG_TOKEN}`,
        ];
        const results = await Promise.all(urls.map((url) => axios.get(url)));
        setUserProfile(results[0].data);
        setChatsList(results[1].data);
        getMessages();
        setContact();
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(response.data);
        reader.onloadend = () => {
          const base64data = reader.result;
          setQRImage(base64data);
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendMessage = async (e) => {
    try {
      e.preventDefault();
      if (inputValue) {
        await axios.post(
          `https://api.ultramsg.com/${ULTRA_MSG_INSTANCE}/messages/chat`,
          {
            token: ULTRA_MSG_TOKEN,
            to: searchParams.get("phNo"),
            body: inputValue,
          }
        );
        setMessages((messages) => {
          return [
            ...messages,
            {
              to: searchParams.get("phNo"),
              body: inputValue,
            },
          ];
        });
        setInputValue("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    fetchQRImage();
  }, []);
  return (
    <>
      <div
        className={`w-full min-h-screen  ${
          currentMode === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <h1
          className={`font-semibold ${
            currentMode === "dark" ? "text-white" : "text-red-600"
          } text-xl`}
        >
          Whatsapp Chat
        </h1>
        {QRImage && <img src={QRImage} style={{margin: "0 auto", display: "block"}} alt="" />}
        {userProfile && !QRImage && (
          <>
            <div className="flex justify-end">
              <div
                className="items-center rounded mb-4 p-2 bg-slate-300 pr-8"
                style={{ display: "inline-flex" }}
              >
                <img
                  className="rounded mr-3"
                  width="60px"
                  src={userProfile.profile_picture}
                  alt=""
                />
                <div>
                  <h3>
                    <b>{userProfile.name}</b>
                  </h3>
                  <h1>+{userProfile.id.slice(0, userProfile.id.indexOf("@"))}</h1>
                </div>
              </div>
            </div>

            <div className="chat-container flex">
              <div style={{background: "#000000c2"}} className="px-1 w-[250px] pt-4">
                <div className="bg-white py-3 rounded cursor-pointer mx-2 px-2">
                  <strong>{contactName}</strong>
                </div>
              </div>
              <div className="flex-1">
              {messages.length > 0 ?
                <div
                  ref={messagesContainerRef}
                  className="h-[400px] overflow-y-scroll bg-gray-100 p-3 flex flex-col items-end"
                >
                  {messages.map((message, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                          backgroundColor: "#075e54",
                        }}
                        className="w-max mb-2 rounded p-2 text-white"
                      >
                        {message.body}

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
                  })}
                </div>
                  : 
                 <div className="bg-gray-100 h-[400px] flex flex-col items-center justify-center">
                   <BsFillChatLeftDotsFill size={40}/>
                   <p className="mt-3">Start the Conversation!</p>
                 </div> 
              }
                <form
                  className="flex border border-gray-400 p-2"
                  onSubmit={handleSendMessage}
                >
                  <TextField
                    autoComplete="off"
                    onInput={(e) => setInputValue(e.target.value)}
                    value={inputValue}
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
        )}
      </div>
    </>
  );
};

export default WhatsappChat;
