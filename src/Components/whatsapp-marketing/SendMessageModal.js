import { useState } from "react";
import Base64 from "Base64";
import {
  Modal,
  Backdrop,
  Button,
  TextareaAutosize,
  CircularProgress
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { MdSend } from "react-icons/md";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SendMessageModal = ({ sendMessageModal, setSendMessageModal }) => {
  const { currentMode } = useStateContext();
  const [message, setMessage] = useState("");
  const [btnloading, setbtnloading] = useState(false);

   async function sendMessage(phoneNo, messageText) {
    try {
    const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    setbtnloading(true);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Base64.btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
      },
      body: new URLSearchParams({
        Body: messageText,
        From: "+14346615660",
        To: phoneNo,
      }).toString(),
    });
    const data = await response.json();
    alert("Message Sent");
    setbtnloading(true);
  } catch (error) {
    console.error(error);
  }
}

const handleSendMessage = () => {
    sendMessage("+923055497517", message);
}

  return (
    <>
      <Modal
        keepMounted
        open={sendMessageModal}
        onClose={() => setSendMessageModal(false)}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <label htmlFor="message">Message Text</label>
          <TextareaAutosize
            id="message"
            placeholder="Type here"
            type={"text"}
            minRows={8}
            label="Message"
            className="w-full mb-5"
            style={{
              marginBottom: "20px",
              border: "1px solid",
              padding: 10,
              borderRadius: "4px",
              marginTop: "10px",
            }}
            variant="outlined"
            size="medium"
            value={message}
            onInput={(e) => setMessage(e.target.value)}
          />

          <Button ripple="true" onClick={handleSendMessage} variant="contained" color="success">
                  {btnloading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    <MdSend size={24} color="white"/>
                  )}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default SendMessageModal;
