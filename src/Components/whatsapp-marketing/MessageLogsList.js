import MessageLog from "./MessageLog";
const MessageLogsList = ({messages, messagesType}) => {
    return (
        <>
            {messages.map((message, index) => {
                return <MessageLog color={messagesType === "sent" ? "red" : "green"} key={index} content={message}/>;
            })}
        </>
    );
}

export default MessageLogsList;