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
  MenuItem,
  TextField,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { RiSendPlane2Fill } from "react-icons/ri";
import { Box } from "@mui/system";
import { AiOutlineCloudUpload } from "react-icons/ai";

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

const senderAddresses = ["AD-HIKAL", "AD-HIKALCRM"];
const charLimit = 70;

const SendMessageModal = ({
  sendMessageModal,
  setSendMessageModal,
  selectedContacts,
  whatsappSenderNo,
}) => {
  const {
    currentMode,
    BACKEND_URL,
    User,
    setUserCredits,
    isArabic,
    isEnglish,
    formatNum,
  } = useStateContext();

  const [messageValue, setMessageValue] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [imgBinary, setImgBinary] = useState("");
  const [smsTextValue, setsmsTextValue] = useState("");
  const [messagesSent, setMessagesSent] = useState(false);
  const [defaultMessageValue, setDefaultMessageValue] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  var turndownService = new TurndownService();

  const imagePickerRef = useRef();
  const noOfMessages = Math.ceil(
    Number(smsTextValue?.trim()?.length) / charLimit
  );

  const uploadImage = () => {
    const waDevice = localStorage.getItem("authenticated-wa-device");
    if (waDevice) {
      socket.emit("whatsapp_check_device_exists", { id: waDevice });
      socket.on("whatsapp_check_device", (result) => {
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
    if (messageText && senderAddress) {
      try {
        const token = localStorage.getItem("auth-token");
        setbtnloading(true);

        await axios.post(
          `${BACKEND_URL}/sendsms`,
          JSON.stringify({
            msgCategory: "4.6",
            contentType: "3.1",
            senderAddr: senderAddress,
            dndCategory: "campaign",
            priority: 1,
            clientTxnId: "",
            desc: "Hikal CRM Single Message to Multiple Recipients",
            campaignName: "test",
            recipients: contactList,
            msg: { en: messageText },
            defLang: "en",
            dr: "1",
            wapUrl: "",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        setSendMessageModal({ open: false });

        setUserCredits((credits) => credits - contactList?.lengt);
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
        toast.error(error?.response?.data?.error, {
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
        socket.emit("whatsapp_check_device_exists_send_msg_modal", {
          id: waDevice,
        });
        socket.on("whatsapp_check_device_send_msg_modal", (result) => {
          if (result) {
            socket.emit("whatsapp_send-bulk-image", {
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
      if (smsTextValue?.trim()?.length) {
        sendSMS(smsTextValue?.trim(), selectedContacts);
      }
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
    if (sendMessageModal?.isWhatsapp) {
      setDefaultMessageValue(templates.find((tmp) => tmp === template).body);
    } else {
      setsmsTextValue(templates.find((tmp) => tmp === template).body);
    }
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

  let lang = "";
  lang = isArabic(smsTextValue?.trim())
    ? "Arabic"
    : isEnglish(smsTextValue?.trim())
    ? "English"
    : "";

  return (
    <>
      <Modal
        keepMounted
        open={sendMessageModal.open}
        onClose={() => setSendMessageModal({ open: false })}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[70%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md overflow-y-scroll`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 7,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setSendMessageModal({ open: false })}
          >
            <IoMdClose size={18} />
          </IconButton>
          {messagesSent ? (
            <div>
              <p className="text-2xl mb-4">
                Messages are being sent to these contacts:
              </p>
              <ul className="ml-5">
                {selectedContacts?.map((contact) => {
                  return (
                    <li
                      style={{ listStyleType: "number" }}
                      className="font-bold text-red-600 mb-1"
                    >
                      +{contact}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              {!sendMessageModal.isWhatsapp && (
                <TextField
                  select
                  id="senderAdd"
                  type={"text"}
                  label="Sender Address"
                  variant="outlined"
                  size="small"
                  sx={{ marginTop: "20px" }}
                  className="w-[150px]"
                  required
                  value={senderAddress}
                  onChange={(e) => {
                    setSenderAddress(e.target.value);
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Sender Address
                  </MenuItem>

                  {senderAddresses?.map((address) => {
                    return <MenuItem value={address}>{address}</MenuItem>;
                  })}
                </TextField>
              )}

              <Tabs
                value={tabValue}
                sx={{
                  mb: 2,
                  "&": {
                    marginTop: sendMessageModal.isWhatsapp ? "14px" : "2px",
                  },
                }}
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
                    Upload Image{" "}
                    <AiOutlineCloudUpload className="ml-2" size={20} />
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

                    {sendMessageModal?.isWhatsapp ? (
                      <RichEditor
                        messageValue={defaultMessageValue}
                        setMessageValue={setMessageValue}
                      />
                    ) : (
                      <>
                        <div className="w-full h-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
                          <div className="flex items-center justify-between px-3 py-2 border-b">
                            <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x ">
                              <div>{lang}</div>
                              {lang && (
                                <div className="w-[2px] h-[12px] mx-3 bg-gray-400"></div>
                              )}
                              <div
                                className={`flex flex-wrap items-center ${
                                  smsTextValue?.trim()?.length > charLimit
                                    ? "text-red-600"
                                    : ""
                                }`}
                              >
                                {formatNum(smsTextValue?.trim()?.length)}/
                                {charLimit}
                              </div>
                              {smsTextValue?.trim()?.length ? (
                                <div className="w-[2px] h-[12px] mx-3 bg-gray-400"></div>
                              ) : (
                                <></>
                              )}
                              {smsTextValue?.trim()?.length ? (
                                <div>{noOfMessages} messages</div>
                              ) : (
                                <></>
                              )}
                            </div>
                            <button
                              type="button"
                              className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100"
                            >
                              <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 19 19"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                                />
                              </svg>
                              <span className="sr-only">Full screen</span>
                            </button>
                          </div>
                          <div className="px-4 h-full py-2 bg-white rounded-b-lg">
                            <textarea
                              value={smsTextValue}
                              onInput={(e) =>
                                setsmsTextValue(e.target.value?.toString())
                              }
                              className="block focus:border-0 focus:outline-none w-full h-full px-0 text-gray-800 bg-white border-0 focus:ring-0 "
                              placeholder="Type the message..."
                              required
                            ></textarea>
                          </div>
                        </div>
                      </>
                    )}
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

                        {sendMessageModal?.isWhatsapp ? (
                          <RichEditor
                            messageValue={defaultMessageValue}
                            setMessageValue={setMessageValue}
                          />
                        ) : (
                          <div className="w-full h-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
                            <div className="flex items-center justify-between px-3 py-2 border-b">
                              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x ">
                                <div className="flex flex-wrap items-center">
                                  {smsTextValue?.trim()?.length} characters
                                </div>
                              </div>
                              <button
                                type="button"
                                className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100"
                              >
                                <svg
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 19 19"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                                  />
                                </svg>
                                <span className="sr-only">Full screen</span>
                              </button>
                            </div>
                            <div className="px-4 h-full py-2 bg-white rounded-b-lg">
                              <textarea
                                value={smsTextValue}
                                onInput={(e) => setsmsTextValue(e.target.value)}
                                className="block focus:border-0 focus:outline-none w-full h-full px-0 text-gray-800 bg-white border-0 focus:ring-0 "
                                placeholder="Type the message..."
                                required
                              ></textarea>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <Box className="flex items-start flex-wrap border rounded p-4 min-h-[250px]">
                      {templates?.length ? (
                        templates.map((template, index) => {
                          return (
                            <Box
                              key={index}
                              onClick={() => handleSelectTemplate(template)}
                              className=" bg-slate-600 mr-2 text-white w-max cursor-pointer text-center p-4 mb-1 rounded"
                            >
                              <h3>{template.name}</h3>
                            </Box>
                          );
                        })
                      ) : (
                        <p>No templates found!</p>
                      )}
                    </Box>
                  ),
                ]}
                <input
                  onInput={handleInputChange}
                  type="file"
                  ref={imagePickerRef}
                  hidden
                />
                <hr className="mt-[6px] border-t border-[lightgrey]" />
                <div className="flex items-center mt-2">
                  <Button
                    ripple="true"
                    variant="contained"
                    sx={{ py: "6px", mr: 2 }}
                    size="small"
                    style={{ backgroundColor: "#da1f26" }}
                    type="submit"
                  >
                    {btnloading ? (
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                      <>
                        <RiSendPlane2Fill
                          style={{ marginRight: 8 }}
                          size={20}
                          color="white"
                        />{" "}
                        {selectedContacts?.length === 1
                          ? "Send Message"
                          : `Send Message to ${selectedContacts.length} contacts`}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SendMessageModal;
