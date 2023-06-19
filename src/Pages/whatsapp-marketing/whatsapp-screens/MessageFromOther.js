const MessageFromOther = ({ message }) => {
  return (
    <>
      <div
        style={{
          position: "relative",
          backgroundColor: "#075e54",
          alignSelf: "flex-start",
        }}
        className="max-w-[600px] mb-2 rounded p-2"
      >
        {message.type === "revoked" ? (
          <i className="text-gray-200">This message was deleted</i>
        ) : (
          <span className="text-white">{message.body}</span>
        )}
      </div>
    </>
  );
};

export default MessageFromOther;
