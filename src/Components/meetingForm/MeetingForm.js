import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";

import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";

const MeetingForm = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  BACKEND_URL,
}) => {
  const { darkModeColors, currentMode, User } = useStateContext();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    // console.log("User is");
    // console.log(User);

    axios.get(`${BACKEND_URL}/teamMembers/${User.id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    // GETTING LEAD DETAILS
    axios.get(`${BACKEND_URL}/leads/${LeadData.lid}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={LeadModelOpen}
        onClose={handleLeadModelClose}
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
          className={`w-[calc(100%-20px)] md:w-[85%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center space-x-1">
              <CircularProgress size={20} />
              <span className="font-semibold text-lg"> Fetching Your Lead</span>
            </div>
          ) : (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 10,
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={handleLeadModelClose}
              >
                <IoMdClose size={18} />
              </IconButton>
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl pb-10`}
              >
                Enter meeting details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // UpdateLeadFunc();
                }}
              >
                <div className="space-y-5">
                  <Box sx={darkModeColors}>
                    <TextField
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ borderBottom: "1px solid #DA1F26" }}
                      id="meetingDate"
                      type={"date"}
                      label="Meeting date"
                      className="w-full mb-5 py-2"
                      variant="standard"
                      size="small"
                    />
                    <TextField
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ borderBottom: "1px solid #DA1F26" }}
                      id="meetingTime"
                      type={"time"}
                      label="Meeting time"
                      className="w-full mb-5 py-2"
                      variant="standard"
                      size="small"
                    />
                    <TextField
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ borderBottom: "1px solid #DA1F26" }}
                      id="meetingLocation"
                      type={"text"}
                      label="Meeting location"
                      className="w-full mb-5 py-2"
                      variant="standard"
                      size="small"
                    />
                    <TextField
                      InputProps={{
                        disableUnderline: true,
                      }}
                      sx={{ borderBottom: "1px solid #DA1F26" }}
                      id="meetingNote"
                      type={"text"}
                      label="Meeting Note"
                      className="w-full mb-5 py-2"
                      variant="standard"
                      size="small"
                    />
                  </Box>
                </div>

                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 mt-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color`}
                  ripple={true}
                  size="lg"
                  type="submit"
                  disabled={btnloading ? true : false}
                >
                  {btnloading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    </div>
                  ) : (
                    <span>Schedule meeting</span>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default MeetingForm;
