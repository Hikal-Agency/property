import { useState, useEffect } from "react";

import axios from "../../axoisConfig";
import {
  ToggleButtonGroup,
  IconButton,
  ToggleButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { BiRefresh } from "react-icons/bi";
import AllMessagesItem from "../../Components/whatsapp-marketing/AllMessagesItem";

const AllMessages = () => {
  const { BACKEND_URL } = useStateContext();
  const [allMessages, setAllMessages] = useState([]);
  const [alignment, setAlignment] = useState("whatsapp");
  const [loading, setLoading] = useState(false);

  const handleChangeToggle = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const fetchMessageLogs = async (msgSource) => {
    try {
      const token = localStorage.getItem("auth-token");
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/messages`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const allMessages = response.data?.messages?.data;
      setAllMessages(allMessages.filter((msg) => msg.source === alignment));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessageLogs(alignment);
  }, [alignment]);

  return (
    <>
      <div className="pb-10">
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
        <IconButton
          style={{ marginLeft: 10 }}
          onClick={() => fetchMessageLogs(alignment)}
        >
          <BiRefresh />
        </IconButton>

        {loading ? (
          <Box className="mt-[100px] flex justify-center">
            <CircularProgress />
          </Box>
        ) : (
          [
            allMessages.map((message) => {
              return <AllMessagesItem content={message} />;
            }),
          ]
        )}
      </div>
    </>
  );
};

export default AllMessages;
