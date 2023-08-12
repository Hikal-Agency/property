import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import ChatConversation from "../../Components/chat/ChatConversation";
import { useProSidebar } from "react-pro-sidebar";
import { socket } from "../App";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const ChatPage = () => {
  const { currentMode, isCollapsed, setIsCollapsed, User } = useStateContext();
  const { collapseSidebar } = useProSidebar();
  const [activeChat, setActiveChat] = useState(null);
  const [loadingConversations, setLoadingConversation] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [recentChats, setRecentChats] = useState([]);
  const [onlineChats, setOnlineChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const messagesContainerRef = useRef();

  const handleSendMessage = ({ e, type, content }) => {
    e.preventDefault();
    if (content) {
      if (type === "text") {
        const message = {
          from: User?.loginId, 
          to: activeChat?.loginId,
          toProfilePic: activeChat?.profile_picture,
          content: content,
          type,
        };
        socket.emit("chat_send-message", message);
        console.log("chat message sent ", message);

        setChatMessages((prevChatMessages) => [...prevChatMessages, message]);
      }
    }
  };

  useEffect(() => {
    socket.on("chat_message-received", (data) => {
      console.log("chat message received::", data);
      setChatMessages((prevChatMessages) => [...prevChatMessages, data]);
    });
  }, []);

  useEffect(() => {
    if (messagesContainerRef?.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchRecentChats = async (loginId) => {
    socket.emit("chat_get-recent-chats", loginId);
    socket.on("chat_recent-chats", (data) => {
      setRecentChats(data);
    })
  };

  useEffect(() => {
    if (User?.id) {
      socket.emit("chat_addUser", User);
      console.log("User added in chat::");

      // fetchRecentChats(User?.loginId);

      socket.on("chat_getOnlineUsers", (data) => {
        console.log("online users::", data);
        setOnlineChats(
          data?.filter(
            (chat) => chat?.loginId && chat?.loginId !== User?.loginId
          )
        );
      });
      // socket.on("chat_recent-chats", (data) => {
      //   setRecentChats(data);
      // })
    }
  }, [User]);

  const fetchChatMessages = async () => {
    socket.emit("chat_get-user-messages", User?.loginId);
    setChatLoading(true);
    socket.on("chat_user-messages", (data) => {
      setChatMessages(data);
      setChatLoading(false);
    })
  }

  useEffect(() => {
    if(activeChat) {
      console.log("active:", activeChat);
      fetchChatMessages();
    }
  }, [activeChat]);
  return (
    <div
      style={{
        height: "calc(100vh - 60px)",
      }}
    >
      <ChatConversation
        currentMode={currentMode}
        setActiveChat={setActiveChat}
        recentChats={recentChats}
        onlineChats={onlineChats}
        chatMessages={activeChat?.loginId ? chatMessages : []}
        loadingConversations={loadingConversations}
        handleSendMessage={handleSendMessage}
        chatLoading={chatLoading}
        btnLoading={btnLoading}
        activeChat={activeChat}
        messagesContainerRef={messagesContainerRef}
      />
    </div>
  );
};

export default ChatPage;
