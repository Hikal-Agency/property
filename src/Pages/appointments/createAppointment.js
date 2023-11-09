import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import {
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
} from "@mui/material";
import { BsSearch } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import NewMeetingModal from "./NewMeetingModa";

const CreateAppointment = () => {
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    setopenBackDrop,
    User,
    t,
    darkModeColors,
    primaryColor,
    BACKEND_URL,
    themeBgImg,
    blurDarkColor,
    blurLightColor,
  } = useStateContext();
  const [meetingsCount, setMeetingCount] = useState({
    pendingMeeting: null,
    completedMeetings: null,
  });
  const [newMeetingModal, setNewMeetingModal] = useState({
    isOpen: false
  })
  const [btnLoading, setBtnLoading] = useState(false);

  console.log("meetings count:: ", meetingsCount);
  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  const handleCreateMeeting = async () => {
    try {

      setBtnLoading(true);
      const createMeeting = await axios.get(
        `${BACKEND_URL}/create?name=${User?.userName}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
        }
      );

      const meetingID = createMeeting?.data?.data?.meetingID;
      const joinAsModerator = await axios.post(
        `${BACKEND_URL}/join`,
        JSON.stringify({
          meetingID: meetingID,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
        }
      );
      const urlForModerator = joinAsModerator?.data?.url;
      setNewMeetingModal({isOpen: true, urlForModerator, urlForAttendee: `${BACKEND_URL?.slice(0, BACKEND_URL?.length - 4)}/invite/${meetingID}`});
    } catch (error) {
      console.log(error);
      toast.error("Unable to create meeting at the moment.", {
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
    setBtnLoading(false);
  };

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="mt-3">
              <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-5 flex justify-between">
                <Box
                  sx={{
                    borderRadius: "7px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    background: !themeBgImg
                      ? currentMode === "dark"
                        ? "#333333"
                        : "#EEEEEE"
                      : currentMode === "dark"
                      ? blurDarkColor
                      : blurLightColor,
                    color: currentMode === "dark" ? "white" : "black",
                    boxShadow:
                      currentMode === "dark"
                        ? "3px 3px 3px rgba(255, 255, 255, 0.35)"
                        : "3px 3px 3px rgba(0, 0, 0, 0.25)",
                    height: "165px",
                    // minWidth: "300px !important",
                  }}
                  className="my-5 p-5 lg:col-span-3"
                >
                  <div>
                    <h1 className="font-bold text-4xl ">
                      Hello {User?.userName}!
                    </h1>
                    <p className="mt-2 font-light">
                      It's good to see you again.
                    </p>
                  </div>
                  <span>
                    <img
                      src={
                        User?.gender?.toLowerCase() === "female"
                          ? "./assets/female_character.png"
                          : "./assets/Characters1.png"
                      }
                      alt="character image"
                      className="w-60 h-72"
                      style={{ marginTop: "-30px" }}
                    />
                  </span>
                </Box>

                <div className="mt-5 w-full lg:col-span-2 flex flex-col gap-5">
                  {/* <Box sx={darkModeColors}>
                    <TextField
                      className="w-full"
                      placeholder="search.."
                      size="small"
                      // label="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BsSearch
                              color={
                                currentMode == "dark" ? "#AAAAAA" : "#AAAAAA"
                              }
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box> */}

                  <div className="grid grid-cols-2 gap-4">
                    <Box
                      className="shadow-md rounded-xl p-5"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        background: !themeBgImg
                          ? currentMode === "dark"
                            ? "#1C1C1C"
                            : "#EEEEEE"
                          : currentMode === "dark"
                          ? blurDarkColor
                          : blurLightColor,
                        color: currentMode === "dark" ? "white" : "black",
                      }}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <h1 className="font-bold text-3xl text-primary mr-3">
                          {meetingsCount?.pendingMeeting}
                        </h1>
                        <div>Meetings Pending</div>
                      </div>
                    </Box>
                    <Box
                      className="shadow-md rounded-xl p-5"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        background: !themeBgImg
                          ? currentMode === "dark"
                            ? "#1C1C1C"
                            : "#EEEEEE"
                          : currentMode === "dark"
                          ? blurDarkColor
                          : blurLightColor,
                        color: currentMode === "dark" ? "white" : "black",
                      }}
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <h1 className="font-bold text-3xl text-primary mr-3">
                          {meetingsCount?.completedMeetings}
                        </h1>
                        <div>Meetings Completed</div>
                      </div>
                    </Box>
                  </div>
                  <Button
                    onClick={handleCreateMeeting}
                    className={`mb-5 text-white w-full rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                    ripple={true}
                    style={{
                      background: `${primaryColor}`,
                      color: "white",
                    }}
                    size="lg"
                    type="submit"
                    disabled={btnLoading ? true : false}
                  >
                    {btnLoading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white" }}
                        className="text-white"
                      />
                    ) : (
                      <span>{t("create_meeting")}</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {newMeetingModal?.isOpen && <NewMeetingModal handleClose={() => setNewMeetingModal({isOpen: false})} newMeetingModal={newMeetingModal}/>}
    </>
  );
};

export default CreateAppointment;
