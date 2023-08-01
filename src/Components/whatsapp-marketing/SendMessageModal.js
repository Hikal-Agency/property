//import { useState } from "react";
import { useState, useEffect, useRef } from "react";
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
import { AiOutlineCloudUpload } from "react-icons/ai";
// import axios from "axios";
import { socket } from "../../Pages/App";
import axios from "../../axoisConfig";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import RichEditor from "./richEditorComp/RichEditor";
import TurndownService from "turndown";

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
  const { currentMode, BACKEND_URL, User } = useStateContext();

  const [messageValue, setMessageValue] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [imgBinary, setImgBinary] = useState("");
  const [messagesSent, setMessagesSent] = useState(false);
  const [defaultMessageValue, setDefaultMessageValue] = useState("");

  var turndownService = new TurndownService();

  const imagePickerRef = useRef();

  const uploadImage = () => {
    const waDevice = localStorage.getItem("authenticated-wa-device");
    if (waDevice) {
      socket.emit("check_device_exists", { id: waDevice });
      socket.on("check_device", (result) => {
        if (result) {
          // Success
          if (imagePickerRef.current?.click) {
            imagePickerRef.current.click();
          }
        } else {
          toast.error("Please connect your device first!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
    } else {
      toast.error("Please connect your device first!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleInputChange = (event) => {
    let files = event.target.files;
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      setImgBinary(e.target.result);
    };
  };

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
              from: "+15855013080",
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          );
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

  const saveMessages = async (allSentMessages) => {
    try {
      const token = localStorage.getItem("auth-token");
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

  async function sendWhatsappMessage(messageText, contactList) {
    try {
      setbtnloading(true);

      const waDevice = localStorage.getItem("authenticated-wa-device");
      if (waDevice) {
        socket.emit("check_device_exists_send_msg_modal", { id: waDevice });
        socket.on("check_device_send_msg_modal", (result) => {
          if (result) {
            socket.emit("send-bulk-image", {
              contacts: contactList,
              img: imgBinary,
              id: waDevice,
              caption: messageText,
            });

            setbtnloading(false);
            // setSendMessageModal({ open: false });
            setMessagesSent(true);
            toast.success("Messages are being sent. ", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        });
      } else {
        toast.error("Connect your device first! ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }

      // const responses = await Promise.all(
      //   contactList.map((contact) => {
      //     var urlencoded = new URLSearchParams();
      //     urlencoded.append("token", ULTRA_MSG_TOKEN);
      //     urlencoded.append("to", "+" + contact);

      //     const modifiedMessageText = messageText
      //       .toString()
      //       .replaceAll("**", "*");
      //     urlencoded.append("body", modifiedMessageText);

      //     var myHeaders = new Headers();
      //     myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      //     return fetch(`${ULTRA_MSG_API}/instance24405/messages/chat`, {
      //       headers: myHeaders,
      //       method: "POST",
      //       body: urlencoded,
      //     }).then((response) => response.json());
      //   })
      // );
      // const allSentMessages = [];
      // responses.forEach((response, index) => {
      //   if (!response?.error) {
      //     const messageInfo = {
      //       msg_to: contactList[index],
      //       msg_from: whatsappSenderNo,
      //       message: messageText,
      //       type: "sent",
      //       userID: User?.id,
      //       source: "whatsapp",
      //       status: 1,
      //     };
      //     allSentMessages.push(messageInfo);
      //   }
      // });

      // saveMessages(allSentMessages);
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

  const handleSendMessage = (event) => {
    event.preventDefault();
    turndownService.addRule("strikethrough", {
      filter: ["del", "s", "strike"],
      replacement: function (content) {
        return "~" + content + "~";
      },
    });
    const messageText = turndownService.turndown(messageValue);
    if (sendMessageModal.isWhatsapp) {
      sendWhatsappMessage(messageText, selectedContacts);
    } else {
      sendSMS(messageText, selectedContacts);
    }
  };

  const handleChange = (event, newValue) => {
    if (tabValue === 1 && newValue === 0) {
      setDefaultMessageValue("");
      setSelectedTemplate(false);
    }
    setTabValue(newValue);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(true);
    setDefaultMessageValue(templates.find((tmp) => tmp === template).body);
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/templates`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setTemplates(response.data.templates.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={sendMessageModal.open}
        onClose={() => setSendMessageModal({ open: false })}
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
          className={`w-[calc(100%-20px)] md:w-[70%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md h-[80%] overflow-y-scroll`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setSendMessageModal({ open: false })}
          >
            <IoMdClose size={18} />
          </IconButton>
          {messagesSent ? <div>
            <p className="text-2xl mb-4">Messages are being sent to these contacts:</p>
            <ul className="ml-5">
            {selectedContacts?.map((contact) => {
              return <li style={{listStyleType: "number"}} className="font-bold text-red-600 mb-1">+{contact}</li>;
            })}
            </ul>
          </div> :
          <>
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
            {sendMessageModal.isWhatsapp && !imgBinary && (
              <Button
                onClick={uploadImage}
                type="button"
                variant="contained"
                sx={{ padding: "7px 6px", mb: 2, mr: 1 }}
                color="error"
                size="small"
              >
                Upload Image <AiOutlineCloudUpload className="ml-2" size={20} />
              </Button>
            )}
            {tabValue === 0 && (
              <div style={{ height: 250, overflowY: "scroll" }}>
                {imgBinary && (
                  <img
                    className="w-[200px] p-3 rounded"
                    alt=""
                    src={imgBinary}
                  />
                )}
                <RichEditor
                  messageValue={defaultMessageValue}
                  setMessageValue={setMessageValue}
                />
              </div>
            )}

            {tabValue === 1 && [
              selectedTemplate ? (
                <>
                  <div style={{ height: 250, overflowY: "scroll" }}>
                    {imgBinary && (
                      <img
                        className="w-[200px] p-3 rounded"
                        alt=""
                        src={imgBinary}
                      />
                    )}
                    <RichEditor
                      messageValue={defaultMessageValue}
                      setMessageValue={setMessageValue}
                    />
                  </div>
                </>
              ) : (
                <Box className="flex items-start flex-wrap border rounded p-4 min-h-[250px]">
                  {templates.map((template, index) => {
                    return (
                      <Box
                        key={index}
                        onClick={() => handleSelectTemplate(template)}
                        className=" bg-slate-600 mr-2 text-white w-max cursor-pointer text-center p-4 mb-1 rounded"
                      >
                        <h3>{template.name}</h3>
                      </Box>
                    );
                  })}
                </Box>
              ),
            ]}
            <input
              onInput={handleInputChange}
              type="file"
              ref={imagePickerRef}
              hidden
            />
            <Button
              ripple="true"
              variant="contained"
              sx={{ p: "12px", mt: 2 }}
              style={{ backgroundColor: "#da1f26" }}
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
          </>
          }
        </div>
      </Modal>
    </>
  );
};

export default SendMessageModal;
