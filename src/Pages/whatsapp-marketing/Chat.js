import { useEffect, useState } from "react";
import {QRCodeCanvas} from 'qrcode.react';
import {
  Box,
  CircularProgress,
  Button,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [loading, setloading] = useState(false);
  const [ready, setReady] = useState(false);
  const [qr, setQr] = useState("");
  const [data, setData] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [contactValue, setContactValue] = useState("0");
  const [selectedContact, setSelectedContact] = useState(null);
  const [serverDisconnected, setServerDisconnected] = useState(false);

  const socketURL = "http://localhost:5000";

  const handleInput = (e) => {
    setMessageValue(e.target.value);
  };

  const handleSelectContact = (e) => {
    setContactValue(e.target.value);
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSend = async () => {
    await axios.post(`${socketURL}/send-message`, {
      to: contactValue + "@c.us",
      msg: messageValue,
    });
  };

  useEffect(() => {
    const socket = io(socketURL);

    socket.on("connect", () => {
        console.log("Client Connected")
      setServerDisconnected(false);
      setloading(true);
      socket.on("get_qr", (data) => {
        const qrCode = data;
        setQr(qrCode);

        console.log("QR REceived")
        setloading(false);
      });

      socket.on("user_disconnected", () => {
        alert("Disconnected Device");
        document.location.reload();
      });

      socket.on("user_ready", async (clientInfo) => {
        setReady(true);
        setloading(false);

        console.log("User ready")

        const contacts = await axios.get(`${socketURL}/user-contacts`);
        const profileImage = await axios.get(`${socketURL}/user-profilepic`);

        setData({
          userInfo: clientInfo, 
          userContacts: contacts.data.filter((c) => !c.isGroup && c.isMyContact), 
          userProfilePic: profileImage.data,
        });
      });
    });

      socket.on("disconnect", () => {
        setServerDisconnected(true);
      });
  }, []);

  return (
    <>
      <Box className="min-h-screen">
        {serverDisconnected ? (
          <h1 className="text-red-600 text-center mt-12" style={{ fontSize: "38px"}}>
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
                    <div style={{ marginTop: "40px" }}>
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

                    <div className="mt-4">
                      {selectedContact ? (
                        <div>{selectedContact.number}</div>
                      ) : (
                        <>
                          <h1 style={{ fontSize: "38px", fontWeight: "bold" }}>
                            Contacts
                          </h1>
                          {data?.userContacts?.map((contact, index) => {
                            return (
                              <div
                                onClick={() => selectContact(contact)}
                                className="bg-slate-700 text-white py-2 px-5 rounded mb-2 cursor-pointer"
                                key={`${index}${contact.number}`}
                              >
                                {contact.name || contact.number}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  qr && <QRCodeCanvas style={{width: 150, height: 150}} value={qr} />
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
