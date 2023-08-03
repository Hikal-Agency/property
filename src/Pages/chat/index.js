import Conversation from "../whatsapp-marketing/whatsapp-screens/Conversation";
import { useStateContext } from "../../context/ContextProvider";
import ChatConversation from "../../Components/chat/ChatConversation";

const ChatPage = () => {
    const {currentMode} = useStateContext();
    return (
        <ChatConversation
                      currentMode={currentMode}
                      setActiveChat={setActiveChat}
                      allChats={allChats}
                      logout={logout}
                      handleLogout={handleLogout}
                      chatMessages={chatMessages}
                      loadingConversations={loadingConversations}
                      handleSendMessage={handleSendMessage}
                      chatLoading={chatLoading}
                      btnLoading={btnLoading}
                      messageInputRef={messageInputRef}
                      activeChat={activeChat}
                      messagesContainerRef={messagesContainerRef}
        />
    );
}

export default ChatPage;