import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import ChatConversation from "../../Components/chat/ChatConversation";
import { useProSidebar } from "react-pro-sidebar";

const ChatPage = () => {
  const { currentMode, isCollapsed, setIsCollapsed } = useStateContext();
  const { collapseSidebar } = useProSidebar();
  const [activeChat, setActiveChat] = useState({
    name: "Muhammad Junaid",
    phoneNumber: "+923458880651"
  });
  const [loadingConversations, setLoadingConversation] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [allChats, setAllChats] = useState([
    {
    name: "Muhammad Junaid"
  },
    {
    name: "Ubaid Ur Rehman"
  },
    {
    name: "Rimsha Sehar"
  },
    {
    name: "Qasim Ali"
  },
    {
    name: "Hikal"
  },
    {
    name: "Ubaid Ur Rehman"
  },
    {
    name: "Rimsha Sehar"
  },
    {
    name: "Muskan"
  },
]);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "text", 
      body: "Hello This is a test message", 
      id: {
        fromMe: true
      },
      to: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is a test message", 
      id: {
        fromMe: true
      },
      to: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is another test message", 
      from: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is a test message", 
      id: {
        fromMe: true
      },
      to: "+923458880651"
    }, 
    {
      type: "text", 
      body: "Hello This is a test message", 
      id: {
        fromMe: true
      },
      to: "+923458880651"
    }, 
  ]);

  const messageInputRef = useRef();
  const messagesContainerRef = useRef();

  const handleSendMessage = () => {};

  useEffect(() => {
    // setChatMessages([]);
  }, [activeChat]);

  // useEffect(() => {
  //   setIsCollapsed(false);
  //   collapseSidebar();
  // }, []);

  return (
    <div style={{
      height: "calc(100vh - 45px)"
    }}>
      <ChatConversation
        currentMode={currentMode}
        setActiveChat={setActiveChat}
        allChats={allChats}
        chatMessages={chatMessages}
        loadingConversations={loadingConversations}
        handleSendMessage={handleSendMessage}
        chatLoading={chatLoading}
        btnLoading={btnLoading}
        messageInputRef={messageInputRef}
        activeChat={activeChat}
        messagesContainerRef={messagesContainerRef}
      />
    </div>
  );
};

export default ChatPage;
