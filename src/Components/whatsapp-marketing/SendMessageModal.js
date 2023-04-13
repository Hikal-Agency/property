<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
//import { useState } from "react";
import { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Button,
  TextareaAutosize,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { MdSend } from "react-icons/md";
import Base64 from "Base64";
import { Box } from "@mui/system";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
<<<<<<< Updated upstream
=======
import { messageTemplates } from "./messageTemplates";
>>>>>>> Stashed changes

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SendMessageModal = ({
  sendMessageModal,
  setSendMessageModal,
  selectedContacts,
  whatsappSenderNo,
}) => {
<<<<<<< Updated upstream
  const { currentMode, BACKEND_URL } = useStateContext();
=======
  const { currentMode, BACKEND_URL, User } = useStateContext();
>>>>>>> Stashed changes

  const [messageValue, setMessageValue] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(false);
<<<<<<< Updated upstream
=======
  const [ultraMsgInstance, setUltraMsgInstance] = useState({});

  const ULTRA_MSG_API = process.env.REACT_APP_ULTRAMSG_API_URL;
  const ULTRA_MSG_TOKEN = process.env.REACT_APP_ULTRAMSG_API_TOKEN;

>>>>>>> Stashed changes
  async function sendSMS(messageText, contactList) {
    try {
      const token = localStorage.getItem("auth-token");
      setbtnloading(true);
      console.log(contactList);
      const responses = await Promise.all(
        contactList.map((contact) => {
          return axios.post(
            `${BACKEND_URL}/send-tw-message`,
            {
              to: `+${contact}`,
              message: messageText,
<<<<<<< Updated upstream
=======
              from: "+15855013080",
>>>>>>> Stashed changes
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
<<<<<<< Updated upstream
  // async function sendMessage(messageText, contactList, isWhatsapp = false) {
  //   try {
  //     const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
  //     const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
  //     setbtnloading(true);
  //     const responses = await Promise.all(
  //       contactList.map((contact) => {
  //         return fetch(
  //           `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
  //           {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/x-www-form-urlencoded",
  //               Authorization: `Basic ${Base64.btoa(
  //                 `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
  //               )}`,
  //             },
  //             body: new URLSearchParams({
  //               Body: messageText,
  //               From: `${isWhatsapp ? "whatsapp:" : ""}+15855013080`,
  //               To:  `${isWhatsapp ? "whatsapp:" : ""}+${contact}`,
  //             }).toString(),
  //           }
  //         ).then((data) => data.json());
        })
      );

      console.log(responses);
      toast.success("Messages Sent", {

=======
        })
      );

      const allSentMessages = [];
      responses.forEach((response, index) => {
        if (!response?.error) {
          const messageInfo = {
            msg_to: contactList[index],
            msg_from: "+15855013080",
            message: messageText,
            type: "sent",
            userID: User?.id,
            source: "sms",
            status: 1,
          };
          allSentMessages.push(messageInfo);
        }
      });

      saveMessages(allSentMessages);

      setSendMessageModal({ open: false });
      toast.success("Messages Sent", {
>>>>>>> Stashed changes
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
      toast.error("Messages Couldn't be sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setbtnloading(false);
    }
  }

  async function sendWhatsappTwilioMsg(messageText, contactList) {
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      const responses = await Promise.all(
        contactList.map((contact) => {
          return fetch(`${BACKEND_URL}/send-tw-whatsapp-message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Bearer " + token,
            },
            body: new URLSearchParams({
              message: messageText,
              to: "+" + contact,
            }).toString(),
          }).then((response) => response.json());
        })
      );

      const allSentMessages = [];
      responses.forEach((response, index) => {
        if (!response?.error) {
          const messageInfo = {
            msg_to: contactList[index],
            // msg_from: whatsappSenderNo,
            message: messageText,
            type: "sent",
            userID: User?.id,
            source: "whatsapp",
            status: 1,
          };
          allSentMessages.push(messageInfo);
        }
      });

      const responses2 = await Promise.all(
        allSentMessages.map((msg) => {
          return axios.post(`${BACKEND_URL}/messages`, JSON.stringify(msg), {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
        })
      );

      setSendMessageModal({ open: false });
      setbtnloading(false);

      console.log(responses);
      // toast.success("Messages Sent", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
    } catch (error) {
      console.log(error);
    }
  }

  const saveMessages = async (allSentMessages) => {
    try {
      const token = localStorage.getItem('auth-token'); 
      await Promise.all(
        allSentMessages.map((msg) => {
          return axios.post(`${BACKEND_URL}/messages`, JSON.stringify(msg), {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          });
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  async function sendWhatsappUltraMsg(messageText, contactList) {
    try {
      setbtnloading(true);
      const responses = await Promise.all(
        contactList.map((contact) => {
          var urlencoded = new URLSearchParams();
          urlencoded.append("token", ULTRA_MSG_TOKEN);
          urlencoded.append("to", "+" + contact);
          urlencoded.append("body", messageText);

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
          return fetch(`${ULTRA_MSG_API}/messages/chat`, {
            headers: myHeaders,
            method: "POST",
            body: urlencoded,
          }).then((response) => response.json());
        })
      );
        console.log(responses)
      const allSentMessages = [];
      responses.forEach((response, index) => {
        if (!response?.error) {
          const messageInfo = {
            msg_to: contactList[index],
            msg_from: whatsappSenderNo,
            message: messageText,
            type: "sent",
            userID: User?.id,
            source: "whatsapp",
            status: 1,
          };
          allSentMessages.push(messageInfo);
        }
      });

      saveMessages(allSentMessages);

      setbtnloading(true);
      setSendMessageModal({ open: false });
      toast.success("Messages Sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error("Messages Couldn't be sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
    }
  }
  async function sendWhatsappTwilioMsg(messageText, contactList) {
    try {
      const TWILIO_ACCOUNT_SID = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
      const TWILIO_AUTH_TOKEN = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
      
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
            From: "whatsapp:+15855013080",
            To: "whatsapp:+" + contact,
          }).toString(),
        }
      ).then((response) => response.json());
        })
      );

      console.log(responses);
      // toast.success("Messages Sent", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: "light",
      // });
    } catch(error){
      console.log(error);
    }
  }

  async function sendWhatsappUltraMsg(messageText, contactList) {
    try {
      const ULTRA_MSG_API = process.env.REACT_APP_ULTRAMSG_API_URL;
      const ULTRA_MSG_TOKEN = process.env.REACT_APP_ULTRAMSG_API_TOKEN;

      const responses = await Promise.all(
        contactList.map((contact) => {
          var urlencoded = new URLSearchParams();
          urlencoded.append("token", ULTRA_MSG_TOKEN);
          urlencoded.append("to", "+" + contact);
          urlencoded.append("body", messageText);

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
          return fetch(
        `${ULTRA_MSG_API}/messages/chat`,
        {
          headers: myHeaders,
          method: "POST",
          body: urlencoded,
        }
      ).then((response) => response.json());
        })
      );

      console.log(responses);
      toast.success("Messages Sent", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch(error){
      console.log(error);
    }
  }

  const handleSendMessage = (event) => {
    event.preventDefault();
    // sendWhatsappMessages(messageValue, selectedContacts)

<<<<<<< Updated upstream
    if(sendMessageModal.isWhatsapp) {
=======
    if (sendMessageModal.isWhatsapp) {
>>>>>>> Stashed changes
      sendWhatsappUltraMsg(messageValue, selectedContacts);
    } else {
      sendSMS(messageValue, selectedContacts);
    }
<<<<<<< Updated upstream

    setSendMessageModal({open: false});
  // const handleSendMessage = (event) => {
  //   // sendMessage("+923055497517", message);
  //   event.preventDefault();
  //   sendMessage(messageValue, selectedContacts);
=======
>>>>>>> Stashed changes
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
    setMessageValue(messageTemplates[template]);
  };

  return (
    <>
      <Modal
        keepMounted
        open={sendMessageModal.open}
<<<<<<< Updated upstream
        onClose={() => setSendMessageModal({open: false})}
=======
        onClose={() => setSendMessageModal({ open: false })}
>>>>>>> Stashed changes
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
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
<<<<<<< Updated upstream
            onClick={() => setSendMessageModal({open: false})}

=======
            onClick={() => setSendMessageModal({ open: false })}
>>>>>>> Stashed changes
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
                <Box className="flex items-start flex-wrap border rounded p-4 min-h-[250px]">
                  {Object.keys(messageTemplates).map((template) => {
                    return (
                      <Box
                        key={template}
                        onClick={() => handleSelectTemplate(template)}
                        className=" bg-slate-600 mr-2 text-white w-max cursor-pointer text-center p-4 rounded"
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
