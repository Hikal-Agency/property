import { useEffect } from "react";
import { useState } from "react";
import { Box, CircularProgress , Button, Select, MenuItem, TextField} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = () => {
  const [loading, setloading] = useState(false);
  const [ready, setReady] = useState(false);
  const [qr, setQr] = useState("");
  const [data, setData] = useState([]);
  const [messageValue, setMessageValue] = useState("");
  const [contactValue, setContactValue] = useState("");

const socketURL = "http://localhost:5000";
    const socket = io(socketURL);

  const handleInput = (e) => {
    setMessageValue(e.target.value);
  };

  const handleSelectContact = (e) => {
    setContactValue(e.target.value);
  };

  const handleSend = async () => {
    await axios.post(`${socketURL}/send-message`, {
        to: contactValue + "@c.us",
        msg: messageValue,
    });
  }

  useEffect(() => {

    setloading(true);
    socket.on("get_qr", (data) => {
      const qrCode = data;
      setQr(qrCode);
      setloading(false);
    });

    socket.on("user_disconnected", () => {
        alert("Disconnected Device")
        document.location.reload();
    })

    socket.on("user_ready", (data) => {
      setReady(true);
      setData(data);
      setloading(false);
    });
  }, []);

  return (
    <>
      <Box className="min-h-screen">
        {loading ? (
          <div className="flex justify-center mt-16">
            <CircularProgress size={40} />
          </div>
        ) : (
          <>
            <h1>Whatsapp</h1>
            {ready ? (
              <div className="mt-5">
                <h1 style={{ fontSize: "38px" }}>Connected</h1>
                <img src={data?.userProfilePic} width={60} height={60} className="rounded" alt=""/>
                <strong>{data?.userInfo?.pushname}</strong>
                <p>{data?.userInfo?.me?.user}</p>
                <div style={{ marginTop: "40px" }}>
                  <TextField
                    type="text"
                    placeholder="Type here.."
                    value={messageValue}
                    onInput={handleInput}
                  />
                  <Select onChange={handleSelectContact} value={contactValue}>
                    {data?.userContacts?.map((contact, index) => {
                      return (
                        <MenuItem key={`${index}${contact.number}`} value={contact.number}>
                          {contact.name || contact.number}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <div className="mt-2"><Button variant="contained" onClick={handleSend}>Send</Button></div>
                </div>
              </div>
            ) : (
              <img src={qr} alt="" />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default Chat;
