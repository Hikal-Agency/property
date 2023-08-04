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

  const handleSendMessage = () => {};

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
        chatMessages={chatMessages}
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
