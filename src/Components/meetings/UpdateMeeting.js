import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Modal,
  TextField,
} from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";

const UpdateMeeting = ({
  meetingModalOpen,
  handleMeetingModalClose,
  FetchLeads,
}) => {
  // eslint-disable-next-line
  const { darkModeColors, currentMode, User, BACKEND_URL, setreloadDataGrid } =
    useStateContext();
  const [btnloading, setbtnloading] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  useEffect(() => {
    const getMeeting = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        const { id } = meetingModalOpen;

        const meetingData = new FormData();
        meetingData.append("id", id);
        const response = await axios.post(
          `${BACKEND_URL}/updateMeeting`,
          meetingData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.meeting) {
          console.log("Hello")
          toast.error("Error in Fetching the Meeting", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          const {meetingStatus, meetingDate, meetingTime} = response.data.meeting;
          setMeetingStatus(meetingStatus);
          setMeetingDate(meetingDate);
          setMeetingTime(meetingTime);
        }
      } catch (error) {
        console.log("Error in fetching single meeting: ", error);
          toast.error("Error in Fetching the Meeting", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
      }
          setLoading(false)
    };

    getMeeting();
  }, []);

  const update = async () => {
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      const { id } = meetingModalOpen;

      const meetingData = new FormData();
      meetingData.append("id", id);
      meetingData.append("meetingStatus", meetingStatus);
      meetingData.append("meetingTime", meetingTime);
      meetingData.append("meetingDate", meetingDate);

      const response = await axios.post(
        `${BACKEND_URL}/updateMeeting`,
        meetingData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (!response.data.meeting) {
        toast.error("Error in Updating the Meeting", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.success("Meeting Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleMeetingModalClose();
      }
    } catch (error) {
      console.log("error in updating meeting: ", error);
      toast.error("Error in Updating the Meeting", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    setreloadDataGrid(true);
    setbtnloading(false);
  };
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={meetingModalOpen.open}
        onClose={handleMeetingModalClose}
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
          className={`w-[calc(100%-20px)] md:w-[40%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center space-x-1">
              <CircularProgress size={20} />
              <span className="font-semibold text-lg">
                {" "}
                Fetching The Meeting
              </span>
            </div>
          ) : (
            <>
              <ToastContainer />
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl pb-10`}
              >
                Update Meeting details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  update();
                }}
              >
                <div className="grid sm:grid-cols-1 gap-5">
                  <div>
                    <Box sx={darkModeColors} width="100%">
                      <TextField
                        id="status"
                        type={"text"}
                        label="Meeting Status"
                        className="w-full mb-5"
                        style={{ marginBottom: "20px", width: "100%" }}
                        variant="outlined"
                        size="medium"
                        required
                        value={meetingStatus}
                        onChange={(e) => setMeetingStatus(e.target.value)}
                      />
                      <TextField
                        id="time"
                        type={"text"}
                        label="Meeting Time"
                        className="w-full mb-5"
                        style={{ marginBottom: "20px" }}
                        variant="outlined"
                        size="medium"
                        value={meetingTime}
                        required
                        onChange={(e) => setMeetingTime(e.target.value)}
                      />
                      <TextField
                        id="date"
                        type={"text"}
                        label="Meeting Date"
                        className="w-full mb-5"
                        style={{ marginBottom: "20px" }}
                        variant="outlined"
                        size="medium"
                        required
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                      />
                    </Box>
                  </div>
                </div>

                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
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
                    <span> Update Meeting</span>
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

export default UpdateMeeting;
