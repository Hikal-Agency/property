import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import ChatConversation from "../../Components/chat/ChatConversation";

const ChatPage = () => {
  const { currentMode } = useStateContext();
  const [activeChat, setActiveChat] = useState({
    name: "",
  });
  const [loadingConversations, setLoadingConversation] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [allChats, setAllChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const messageInputRef = useRef();
  const messagesContainerRef = useRef();

  const handleSendMessage = () => {};

  useEffect(() => {
    setChatMessages([]);
  }, [activeChat]);

  return (
    <div className="mb-20">
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
