import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import ChatConversation from "../../Components/chat/ChatConversation";
import { useProSidebar } from "react-pro-sidebar";
import { socket } from "../App";

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
          from: User,
          to: activeChat,
          content: content,
          type,
        };
        socket.emit("chat_send-message", message);

        setChatMessages((prevChatMessages) => [...prevChatMessages, message]);
      }
    }
  };

  useEffect(() => {
    socket.on("chat_message-received", (data) => {
        setChatMessages((prevChatMessages) => [...prevChatMessages, data]);
    });
  }, []);

  useEffect(() => {
    if(messagesContainerRef?.current) {
       messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // useEffect(() => {
  //   // setChatMessages([]);
  // }, [activeChat]);

  // useEffect(() => {
  //   setIsCollapsed(false);
  //   collapseSidebar();
  // }, []);

  useEffect(() => {
    if (User?.id) {
      socket.emit("chat_addUser", User);
      socket.on("chat_getOnlineUsers", (data) => {
        setOnlineChats(data);
      });
    }
  }, [User]);

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
