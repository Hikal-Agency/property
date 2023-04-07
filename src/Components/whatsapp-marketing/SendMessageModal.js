import { useState, useEffect } from "react";
import Base64 from "Base64";
import {
  Modal,
  Backdrop,
  Button,
  TextareaAutosize,
  CircularProgress,
  Tabs,
  Tab,
  IconButton
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { MdSend } from "react-icons/md";
import { Box } from "@mui/system";
import {IoMdClose} from "react-icons/io";
import {toast} from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SendMessageModal = ({
  sendMessageModal,
  setSendMessageModal,
  selectedContacts,
}) => {
  const { currentMode } = useStateContext();
  const [messageValue, setMessageValue] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(false);

  async function sendMessage(messageText, contactList, isWhatsapp = false) {
    try {
      const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
      const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
      setbtnloading(true);
      const responses = await Promise.all(
        contactList.map((contact) => {
          return fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Base64.btoa(
                  `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
                )}`,
              },
              body: new URLSearchParams({
                Body: messageText,
                From: `${isWhatsapp ? "whatsapp:" : ""}+15855013080`,
                To:  `${isWhatsapp ? "whatsapp:" : ""}+${contact}`,
              }).toString(),
            }
          ).then((data) => data.json());
        })
      );

      console.log(responses);
      toast.success("Messages Added to the Queue", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSendMessage = (event) => {
    // sendMessage("+923055497517", message);
    event.preventDefault();
    sendMessage(messageValue, selectedContacts);
  };

  const handleChange = (event, newValue) => {
    if (tabValue === 1 && newValue === 0) {
      setMessageValue("");
      setSelectedTemplate(false);
    }
    setTabValue(newValue);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(true);
    if (template === "Thanks") {
      setMessageValue(
        `Hey [First name], \nThanks for taking the time to connect this morning. \nI think you'd be a great fit for [plan type or option] and we're excited to get you on board.`
      );
    }
  };

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
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setSendMessageModal(false)}
          >
            <IoMdClose size={18} />
          </IconButton>
          <Tabs
            value={tabValue}
            sx={{ mb: 2 }}
            onChange={handleChange}
            variant="standard"
          >
            <Tab label="Custom Message" />
            <Tab label="Templates" />
          </Tabs>
          <form onSubmit={handleSendMessage} action="">
            {tabValue === 0 && (
              <TextareaAutosize
                id="message"
                placeholder="Type here"
                type={"text"}
                required
                minRows={8}
                label="Message"
                className="w-full"
                style={{
                  border: "1px solid",
                  padding: 10,
                  borderRadius: "4px",
                  marginTop: "10px",
                }}
                variant="outlined"
                size="medium"
                value={messageValue}
                onInput={(e) => setMessageValue(e.target.value)}
              />
            )}

            {tabValue === 1 && [
              selectedTemplate ? (
                <TextareaAutosize
                  id="template-message"
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
                  required
                  size="medium"
                  value={messageValue}
                  onInput={(e) => setMessageValue(e.target.value)}
                />
              ) : (
                <Box className="border rounded p-4 min-h-[250px]">
                  {["Thanks"].map((template, index) => {
                    return (
                      <Box
                        key={index}
                        onClick={() => handleSelectTemplate(template)}
                        className="bg-slate-600 text-white w-max cursor-pointer text-center p-4 rounded"
                      >
                        <h3>{template}</h3>
                      </Box>
                    );
                  })}
                </Box>
              ),
            ]}
            <Button
              ripple="true"
              variant="contained"
              color="success"
              sx={{ p: "12px", mt: 2 }}
              type="submit"
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <>
                  <MdSend style={{ marginRight: 8 }} size={24} color="white" />{" "}
                  Send Message to {selectedContacts.length} contacts
                </>
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SendMessageModal;
