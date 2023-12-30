import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Backdrop,
  Button,
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
import { useCallback } from "react";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const senderAddresses = ["AD-HIKAL", "AD-HIKALCRM", "AD-MARAHEB"];
const smsService = ["ETISALAT", "TWILLIO"];
const charLimitForEnglish = 160;
const charLimitForArabic = 70;

const SendMessageModal = ({
  sendMessageModal,
  setSendMessageModal,
  selectedContacts,
}) => {
  const {
    currentMode,
    BACKEND_URL,
    setUserCredits,
    isArabic,
    isEnglish,
    formatNum,
    User,
    t,
  } = useStateContext();

  const [messageValue, setMessageValue] = useState("");
  const [btnloading, setbtnloading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedImg, setSelectedImg] = useState({
    file: null,
    binary: "",
  });
  const [smsTextValue, setsmsTextValue] = useState("");
  const [messagesSent, setMessagesSent] = useState(false);
  const [defaultMessageValue, setDefaultMessageValue] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [smsAccount, setSMSAccount] = useState("");

  var turndownService = new TurndownService();

  const imagePickerRef = useRef();

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
      setSelectedImg({ file: files[0], binary: e.target.result });
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

  async function sendWhatsappMessage() {
    try {
      setbtnloading(true);

      const waDevice = localStorage.getItem("authenticated-wa-device");
      if (waDevice) {
        socket.emit("whatsapp_check_device_exists_send_msg_modal", {
          id: waDevice,
        });
        socket.on("whatsapp_check_device_send_msg_modal", async (result) => {
          if (result) {
            turndownService.addRule("strikethrough", {
              filter: ["del", "s", "strike"],
              replacement: function (content) {
                return "~" + content + "~";
              },
            });
            const messageText = turndownService.turndown(messageValue);
            const waDevice = localStorage.getItem("authenticated-wa-device");

            const data = new FormData();

            data.append("contacts", JSON.stringify(selectedContacts));
            data.append("img", selectedImg?.file);
            data.append("id", waDevice);
            data.append("caption", messageText);

            await axios.post(
              process.env.REACT_APP_SOCKET_URL + "/whatsapp/sendBulkMessage",
              data,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            setbtnloading(false);
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

  let lang = "";
  lang = isArabic(smsTextValue?.trim())
    ? "Arabic"
    : isEnglish(smsTextValue?.trim())
    ? "English"
    : "";

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (sendMessageModal.isWhatsapp) {
      sendWhatsappMessage();
    } else {
      if (
        smsTextValue?.trim()?.length &&
        ((lang === "English" &&
          smsTextValue?.trim()?.length <= charLimitForEnglish) ||
          (lang === "Arabic" &&
            smsTextValue?.trim()?.length <= charLimitForArabic))
      ) {
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
              <p className="text-2xl mb-4">{t("messages_being_sent")}:</p>
              <ul className="ml-5">
                {selectedContacts?.map((contact) => {
                  return (
                    <li
                      style={{ listStyleType: "number" }}
                      className="font-bold text-primary mb-1"
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
                <>
                  <TextField
                    select
                    id="senderAdd"
                    type={"text"}
                    label={t("sms_service")}
                    variant="outlined"
                    size="small"
                    sx={{ marginTop: "20px", marginRight: "10px" }}
                    className="w-[150px] mr-4"
                    required
                    value={smsAccount}
                    onChange={(e) => {
                      setSMSAccount(e.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>
                      {t("select_sms_service")}
                    </MenuItem>

                    {smsService?.map((service) => {
                      return <MenuItem value={service}>{service}</MenuItem>;
                    })}
                  </TextField>
                  {smsAccount !== "" && (
                    <TextField
                      select
                      id="senderAdd"
                      type={"text"}
                      label={t("sender_address")}
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
                        {t("select_sender_address")}
                      </MenuItem>

                      {senderAddresses?.map((address) => {
                        return <MenuItem value={address}>{address}</MenuItem>;
                      })}
                    </TextField>
                  )}
                </>
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
                <Tab label={t("custom_message")} />
                <Tab label={t("templates")} />
              </Tabs>
              <form onSubmit={handleSendMessage} action="">
                {sendMessageModal.isWhatsapp && !selectedImg?.file && (
                  <Button
                    onClick={uploadImage}
                    type="button"
                    variant="contained"
                    sx={{ padding: "7px 6px", mb: 2, mr: 1 }}
                    color="error"
                    size="small"
                  >
                    {t("button_upload_image")}{" "}
                    <AiOutlineCloudUpload className="ml-2" size={20} />
                  </Button>
                )}
                {tabValue === 0 && (
                  <div style={{ height: 250, overflowY: "scroll" }}>
                    {selectedImg?.binary && (
                      <img
                        className="w-[200px] p-3 rounded"
                        alt=""
                        src={selectedImg?.binary}
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
                            {lang && (
                              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x ">
                                <div>{lang}</div>
                                {lang && (
                                  <div className="w-[2px] h-[12px] mx-3 bg-gray-400"></div>
                                )}
                                <div
                                  className={`flex flex-wrap items-center ${
                                    smsTextValue?.trim()?.length >
                                    (lang === "English"
                                      ? charLimitForEnglish
                                      : charLimitForArabic)
                                      ? "text-primary"
                                      : ""
                                  }`}
                                >
                                  {formatNum(smsTextValue?.trim()?.length)}
                                  {lang && (
                                    <div className="w-[2px] h-[12px] mx-3 bg-gray-400"></div>
                                  )}
                                  <p className="ml-2">
                                    {parseInt(
                                      (smsTextValue?.trim()?.length - 1) /
                                        (lang === "English"
                                          ? charLimitForEnglish
                                          : charLimitForArabic) +
                                        1
                                    )}{" "}
                                    message(s)
                                  </p>
                                </div>
                              </div>
                            )}
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
                              <span className="sr-only">
                                {t("full_screen")}
                              </span>
                            </button>
                          </div>
                          <div className="px-4 h-full py-2 bg-white rounded-b-lg">
                            <textarea
                              value={smsTextValue}
                              onInput={(e) =>
                                setsmsTextValue(e.target.value?.toString())
                              }
                              className="block focus:border-0 focus:outline-none w-full h-full px-0 text-gray-800 bg-white border-0 focus:ring-0 "
                              placeholder={t("type_the_message")}
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
                        {selectedImg?.file && (
                          <img
                            className="w-[200px] p-3 rounded"
                            alt=""
                            src={selectedImg?.binary}
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
                                  {smsTextValue?.trim()?.length}{" "}
                                  {t("characters")}
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
                                <span className="sr-only">
                                  {t("full_screen")}
                                </span>
                              </button>
                            </div>
                            <div className="px-4 h-full py-2 bg-white rounded-b-lg">
                              <textarea
                                value={smsTextValue}
                                onInput={(e) => setsmsTextValue(e.target.value)}
                                className="block focus:border-0 focus:outline-none w-full h-full px-0 text-gray-800 bg-white border-0 focus:ring-0 "
                                placeholder={t("type_the_message")}
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
                        <p>{t("no_templates_found")}</p>
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
                    style={{
                      color: "white",
                    }}
                    disabled={
                      sendMessageModal.isWhatsapp
                        ? false
                        : smsTextValue?.trim()?.length === 0
                        ? true
                        : false
                    }
                    sx={{ py: "6px", mr: 2 }}
                    className={`${
                      smsTextValue?.trim()?.length >
                      (lang === "English"
                        ? charLimitForEnglish
                        : charLimitForArabic)
                        ? "bg-gray"
                        : "bg-btn-primary"
                    }`}
                    size="small"
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
                          ? t("send_message")
                          : t("send_message_to", {
                              n: selectedContacts?.length,
                            })}
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
