import { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  Tabs,
  Tab,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  CircularProgress,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";
import { BiRefresh } from "react-icons/bi";

import axios from "../../axoisConfig";
import MessageLogsList from "./MessageLogsList";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const MessageLogs = ({
  messageLogsModal,
  setMessageLogsModal,
  whatsappSenderNo,
}) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
  const [tabValue, setTabValue] = useState(0);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [received, setReceived] = useState([]);
  const [alignment, setAlignment] = useState("whatsapp");
  const [allMessages, setAllMessages] = useState([]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchMessageLogs = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const allMessagesList = response.data?.messages?.data;
      setAllMessages(allMessagesList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeToggle = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    fetchMessageLogs();
  }, []);

  useEffect(() => {
    const leadContact = messageLogsModal.data.row.leadContact?.replaceAll(" ", "");
    const sentMessages = allMessages.filter((message) => {
      return (
        message.source === alignment &&
        message.msg_to === leadContact &&
        message.userID === String(User?.id)
      );
    });
    setSent(sentMessages);
    const receivedMessages = allMessages.filter((message) => {
      return message.msg_from === leadContact && message.source === alignment;
    });
    setReceived(receivedMessages);
  }, [alignment, allMessages]);
  return (
    <>
      <Modal
        keepMounted
        open={messageLogsModal.isOpen}
        onClose={() => setMessageLogsModal({ isOpen: false, data: {} })}
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
          className={`w-[calc(100%-20px)] h-[400px] overflow-y-scroll md:w-[50%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setMessageLogsModal({ isOpen: false, data: {} })}
          >
            <IoMdClose size={18} />
          </IconButton>
          <Box className="flex" style={{ marginBottom: 15 }}>
            <h2 style={{ marginRight: 8 }}>
              {messageLogsModal.data?.row?.leadName}
            </h2>
            <strong style={{ color: "grey" }}>
              +{messageLogsModal.data?.row?.leadContact?.replaceAll(" ", "")}
            </strong>
          </Box>
          <ToggleButtonGroup
            style={{ marginBottom: 15 }}
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChangeToggle}
            aria-label="Source"
          >
            <ToggleButton value="whatsapp">Whatsapp</ToggleButton>
            <ToggleButton value="sms">SMS</ToggleButton>
          </ToggleButtonGroup>
          <Box className="flex justify-between">
            <Tabs
              value={tabValue}
              sx={{ mb: 2 }}
              onChange={handleChange}
              variant="standard"
            >
              <Tab label="Sent" />
              <Tab label="Received" />
            </Tabs>
            <IconButton onClick={() => fetchMessageLogs(alignment)}>
              <BiRefresh />
            </IconButton>
          </Box>
          {loading ? (
            <Box className="flex h-[150px] justify-center items-center">
              <CircularProgress />
            </Box>
          ) : (
            <MessageLogsList
              messagesType={tabValue === 0 ? "sent" : "received"}
              messages={tabValue === 0 ? sent : received}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default MessageLogs;
