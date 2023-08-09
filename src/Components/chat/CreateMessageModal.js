import { useState, useEffect } from "react";
import {
  Modal,
  Backdrop,
  IconButton,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import ChatConversationItem from "./ChatConversationItem";
import axios from "../../axoisConfig";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateMessageModal = ({
  recentChats,
  createMessageModal,
  setActiveChat,
  handleCloseCreateMessageModal,
}) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [userSearchVal, setUserSearchVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const fetchUsers = async (keyword = "") => {
    try {
      let url = "";
      if (keyword) {
        url = `${BACKEND_URL}/users?title=${keyword}`;
      }
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      let rowsDataArray = "";
      if (response?.data?.managers?.current_page > 1) {
        const theme_values = Object.values(response?.data?.managers?.data);
        rowsDataArray = theme_values;
      } else {
        rowsDataArray = response?.data?.managers?.data;
      }

      let rowsdata = rowsDataArray?.map((row, index) => ({
        id: row?.id,
        userName: row?.userName || "No Name",
        position: row?.position || "No Position",
        userContact: row?.userContact || "No Contact",
        userEmail: row?.userEmail || "No Email",
        status: row?.status,
        is_trainer: row?.is_trainer,
        loginId: row?.loginId,
        role: row?.role,
        salary: row?.salary,
        currency: row?.currency,
        profile_picture: row?.profile_picture,
        edit: "edit",
      }));

      console.log("Rows Data: ", rowsdata);

      setSearchedUsers(rowsdata);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchUsers = (e) => {
    setUserSearchVal(e.target.value);
    setLoading(true);
    if (e.target.value === "") {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (userSearchVal.trim() !== "") {
        fetchUsers(userSearchVal);
      }
    }, 600);

    return () => clearTimeout(debounceTimeout);
  }, [userSearchVal]);

  return (
    <Modal
      keepMounted
      open={createMessageModal?.isOpened}
      onClose={() => handleCloseCreateMessageModal()}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[55%] h-[70%] flex flex-col ${
          currentMode === "dark" ? "bg-gray-900" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => handleCloseCreateMessageModal()}
        >
          <IoMdClose size={18} />
        </IconButton>

        <h1 className="font-bold text-xl mb-5">Create Message</h1>
        <TextField
          fullWidth
          variant="standard"
          value={userSearchVal}
          onInput={handleSearchUsers}
          size="small"
          className="px-3 rounded-lg"
          sx={{
            background: "#f5f5f5",
            "& input": {
              padding: "12px 6px 12px 0",
            },
          }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment className="pl-3" position="start">
                <BiSearch size={17} />
              </InputAdornment>
            ),
          }}
          placeholder="Search users.."
        />

        <div className="flex-1 overflow-y-scroll mt-3">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            [
              userSearchVal ? (
                <div>
                  <div className="flex mb-3 mt-6 px-5 items-center text-sm font-bold text-[#a4a6a8]">
                    <BsFillChatLeftTextFill />{" "}
                    <p className="uppercase ml-2">Search Results</p>
                  </div>
                  {searchedUsers?.length > 0 ? (
                    [
                      searchedUsers?.map((chat) => {
                        return (
                          <ChatConversationItem
                            onClick={() => {
                              setActiveChat(chat);
                              handleCloseCreateMessageModal();
                            }}
                            key={chat?.id}
                            chat={chat}
                          />
                        );
                      }),
                    ]
                  ) : (
                    <p className="px-5 text-[#da1f26]">No results found</p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex mb-3 mt-6 px-5 items-center text-sm font-bold text-[#a4a6a8]">
                    <BsFillChatLeftTextFill />{" "}
                    <p className="uppercase ml-2">Recent Chats</p>
                  </div>
                  {recentChats?.length > 0 ? (
                    [
                      recentChats?.map((chat) => {
                        return (
                          <ChatConversationItem
                            onClick={() => {
                              setActiveChat({...JSON.parse(chat.toData)})
                              handleCloseCreateMessageModal();
                            }}
                            key={chat?.id}
                                chat={{
                                  ...JSON.parse(chat.toData),
                                }}
                          />
                        );
                      }),
                    ]
                  ) : (
                    <p className="px-5 text-[#da1f26]">
                      You dont have any recent chat with anyone!
                    </p>
                  )}
                </div>
              ),
            ]
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateMessageModal;
