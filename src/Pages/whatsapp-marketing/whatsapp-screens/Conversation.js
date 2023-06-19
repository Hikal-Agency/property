import { Button, TextField, CircularProgress, Box } from "@mui/material";
import { BsFillChatLeftDotsFill } from "react-icons/bs";
import ConversationItem from "./ConversationItem";

const Conversation = ({
  data,
  handleLogout,
  chatMessages,
  handleSendMessage,
  chatLoading,
  setChatMessageInputVal,
  btnLoading,
  chatMessageInputVal,
  phoneNumber,
  messagesContainerRef,
}) => {
  return (
    <>
      <div className="mt-5 bg-[#F6F6F6] w-[98%] rounded-lg p-4">
        {/* <h1 style={{ fontSize: "38px", fontWeight: "bold" }}>Connected</h1>
        <img
          src={data?.userProfilePic}
          width={60}
          height={60}
          className="rounded"
          alt=""
        />
        <strong>{data?.userInfo?.pushname}</strong>
        <p>{data?.userInfo?.me?.user}</p>
        <Button onClick={handleLogout} variant="contained" color="error">
          Logout
        </Button> */}

        <div className="border rounded-sm flex h-full">

          <Box className="w-[30%] border">
            <p className="mb-4 pl-4 pt-4"><strong>Conversations</strong></p>
            <ConversationItem/>
          </Box>
          <Box>
            <Box className="p-4">

            </Box>
          </Box>

          {/* Chat Section */}
          {/* <div className="chat-container flex">
            <div
              style={{ background: "#000000c2" }}
              className="px-1 w-[250px] pt-4"
            >
              <div className="bg-white py-3 rounded cursor-pointer mx-2 pl-3">
                <strong>{phoneNumber}</strong>
              </div>
            </div>
            <div className="flex-1">
              {chatMessages.length > 0 ? (
                <div
                  ref={messagesContainerRef}
                  className="h-[400px] overflow-y-scroll bg-gray-100 p-3 flex flex-col items-end"
                >
                  {chatMessages?.map((message, index) => {
                    if (
                      message.id.fromMe &&
                      message.to === phoneNumber + "@c.us"
                    ) {
                      return (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            backgroundColor: "#075e54",
                          }}
                          className="max-w-[600px] mb-2 rounded p-2"
                        >
                          {message.type === "revoked" ? (
                            <i className="text-gray-200">
                              This message was deleted
                            </i>
                          ) : (
                            <span className="text-white">{message.body}</span>
                          )}

                          <div
                            style={{
                              position: "absolute",
                              top: -5,
                              right: 0,
                              borderStyle: "solid",
                              borderWidth: "0 0 10px 10px",
                              borderColor:
                                "transparent transparent #075e54 transparent",
                            }}
                          ></div>
                        </div>
                      );
                    } else {
                      if (message.from === phoneNumber + "@c.us") {
                        return (
                          <div
                            key={index}
                            style={{
                              position: "relative",
                              backgroundColor: "#075e54",
                              alignSelf: "flex-start",
                            }}
                            className="max-w-[600px] mb-2 rounded p-2"
                          >
                            {message.type === "revoked" ? (
                              <i className="text-gray-200">
                                This message was deleted
                              </i>
                            ) : (
                              <span className="text-white">{message.body}</span>
                            )}
                          </div>
                        );
                      }
                    }
                  })}
                </div>
              ) : (
                <div className="bg-gray-100 h-[400px] flex flex-col items-center justify-center">
                  {chatLoading ? (
                    <>
                      <CircularProgress color="error" size={18} />
                      <p className="mt-3">Loading the chat..</p>
                    </>
                  ) : (
                    <>
                      <BsFillChatLeftDotsFill size={40} />
                      <p className="mt-3">Start the Conversation!</p>
                    </>
                  )}
                </div>
              )}
              <form
                className="flex border border-gray-400 p-2"
                onSubmit={handleSendMessage}
              >
                <TextField
                  autoComplete="off"
                  onInput={(e) => setChatMessageInputVal(e.target.value)}
                  value={chatMessageInputVal}
                  type="text"
                  fullWidth
                  placeholder="Type your message.."
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ ml: 2, px: 5 }}
                  color="info"
                >
                  {btnLoading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    <span>Send</span>
                  )}
                </Button>
              </form>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Conversation;
