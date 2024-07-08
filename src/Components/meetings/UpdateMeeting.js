import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  FormControl,
  IconButton,
  MenuItem,
  Box,
  InputAdornment,
} from "@mui/material";
import Select from "react-select";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStateContext } from "../../context/ContextProvider";
import LocationPicker from "./LocationPicker";
import { IoMdClose } from "react-icons/io";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { MdAccessTime } from "react-icons/md";
import moment from "moment";
import { MdClose } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { BsMic, BsMicFill } from "react-icons/bs";

const UpdateMeeting = ({
  meetingModalOpen,
  handleMeetingModalClose,
  FetchLeads,
}) => {
  const meetingData = meetingModalOpen?.data;
  const id = meetingData?.meetingId;
  console.log("Update lead: ", meetingModalOpen);
  // eslint-disable-next-line
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    formatNum,
    isArabic,
    t,
    isLangRTL,
    i18n,
    primaryColor,
  } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState(
    meetingData?.meetingStatus
  );
  const [isClosing, setIsClosing] = useState(false);

  const [meetingTime, setMeetingTime] = useState(meetingData?.meetingTime);
  const [meetingTimeValue, setMeetingTimeValue] = useState(
    dayjs("2023-01-01 " + meetingData?.meetingTime)
  );
  const [meetingDate, setMeetingDate] = useState(meetingData?.meetingDate);
  const [meetingDateValue, setMeetingDateValue] = useState(
    meetingData?.meetingDate
  );
  const [meetingNotes, setMeetingNotes] = useState(meetingData?.meetingNote);
  const [meetingLocation, setMeetingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });

  const [isVoiceSearchState, setIsVoiceSearchState] = useState(false);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition("en");
  //some comments
  useEffect(() => {
    if (isVoiceSearchState && transcript.length > 0) {
      // setSearchTerm(transcript);
      setMeetingNotes(transcript);
    }
    console.log(transcript, "transcript");
  }, [transcript, isVoiceSearchState]);

  useEffect(() => {
    if (isVoiceSearchState) {
      resetTranscript();
      clearSearchInput();
      startListening();
    } else {
      SpeechRecognition.stopListening();
      console.log(transcript, "transcript...");
      resetTranscript();
    }
  }, [isVoiceSearchState]);

  const clearSearchInput = () => {
    setMeetingNotes("");
    resetTranscript();
  };
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });
  // const style = {
  //   transform: "translate(-50%, -50%)",
  //   boxShadow: 24,
  //   height: "90%",
  //   overflowY: "scroll",
  // };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
    overflowY: "scroll",
  };

  const handleClose = () => {
    // setIsClosing(true);
    // setTimeout(() => {
    //   setIsClosing(false);
    //   handleMeetingModalClose();
    // }, 1000);
    return new Promise((resolve) => {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        handleMeetingModalClose();
        setTimeout(() => {
          resolve();
        }, 1000);
      }, 1000);
    });
  };

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();

    if (!meetingData?.mLat || !meetingData?.mLong) {
      navigator.geolocation.getCurrentPosition((position) => {
        geocoder.geocode(
          {
            location: {
              lat: Number(position.coords.latitude),
              lng: Number(position.coords.longitude),
            },
          },
          (results, status) => {
            if (status === "OK") {
              setMeetingLocation({
                lat: Number(position.coords.latitude),
                lng: Number(position.coords.longitude),
                addressText: meetingData?.meetingNote,
              });
            } else {
              console.log("Getting address failed due to: " + status);
            }
          }
        );
      });
    } else {
      geocoder.geocode(
        {
          location: {
            lat: Number(meetingData?.mLat),
            lng: Number(meetingData?.mLong),
          },
        },
        (results, status) => {
          if (status === "OK") {
            setMeetingLocation({
              lat: Number(meetingData?.mLat),
              lng: Number(meetingData?.mLong),
              addressText: results[0].formatted_address,
            });
          } else {
            console.log("Getting address failed due to: " + status);
          }
        }
      );
    }
  }, []);

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
      {
        color: currentMode === "dark" ? "white !important" : "black !important",
        fontSize: "0.9rem",
        fontWeight: "500",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor:
        currentMode === "dark" ? "white !important" : "black !important",
    },
    "& .MuiFormLabel-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
  };

  const update = async () => {
    try {
      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      // const { id } = meetingModalOpen;

      console.log("meeting date:: ", meetingDate);
      console.log("meeting time:: ", meetingTime);
      // setbtnloading(false);

      // return;

      const meetingData = new FormData();
      meetingData.append("id", id);
      meetingData.append("meetingStatus", meetingStatus);
      meetingData.append(
        "meetingTime",
        meetingTime || meetingData?.meetingTime
      );
      meetingData.append(
        "meetingDate",
        meetingDate || meetingData?.meetingDate
      );
      meetingData.append("mLat", String(meetingLocation.lat));
      meetingData.append("mLong", String(meetingLocation.lng));
      meetingData.append("meetingLocation", meetingLocation.addressText);
      meetingData.append("meetingNote", meetingNotes);

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
      console.log("Response: ", response);
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
        await handleClose();
        FetchLeads(token);
        // setTimeout(() => {
        //   handleMeetingModalClose();
        // }, 1000); // delay the modal closing by 1 second (1000 milliseconds)
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
    // setreloadDataGrid(true);
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
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && "border-r-2 border-primary"
                : currentMode === "dark" && "border-l-2 border-primary"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll
            `}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("update_meeting_details")}
              </h1>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                update();
              }}
            >
              <div className="w-full px-4 pt-4">
                <Box sx={darkModeColors}>
                  <div className="flex flex-col justify-center items-center">
                    {/* DATE  */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={meetingDateValue}
                        label={t("label_meeting_date")}
                        views={["year", "month", "day"]}
                        onChange={(newValue) => {
                          setMeetingDateValue(newValue);
                          const formattedDate = moment(newValue?.$d).format(
                            "YYYY-MM-DD"
                          );
                          setMeetingDate(formattedDate);
                        }}
                        format="yyyy-MM-dd"
                        renderInput={(params) => (
                          <TextField
                            sx={{
                              "& input": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "& .MuiSvgIcon-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              marginBottom: "20px",
                            }}
                            fullWidth
                            size="small"
                            label={t("label_meeting_date")}
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                          />
                        )}
                        minDate={dayjs().startOf("day").toDate()}
                      />
                    </LocalizationProvider>
                    {/* TIME  */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        // ampm={false}
                        format="hh:mm A"
                        value={meetingTimeValue}
                        onChange={(newValue) => {
                          setMeetingTime(
                            formatNum(newValue?.$d?.getHours()) +
                              ":" +
                              formatNum(newValue?.$d?.getMinutes())
                          );
                          setMeetingTimeValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            label={t("label_meeting_time")}
                            size="small"
                            sx={{
                              // "& .MuiFormLabel-root": {
                              //   background:
                              //     currentMode === "dark" ? "#111827" : "",
                              //   color: currentMode === "dark" ? "white" : "",
                              // },
                              "& input": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "& .MuiSvgIcon-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              // "&": {
                              //   borderRadius: "4px",
                              //   border:
                              //     currentMode === "dark" ? "1px solid white" : "",
                              // },
                              "&:focus": {
                                border: "",
                              },
                              marginBottom: "20px",
                            }}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                            InputProps={{
                              endAdornment: (
                                <IconButton>
                                  {currentMode === "dark" ? (
                                    <MdAccessTime color={"#ffffff"} />
                                  ) : (
                                    <MdAccessTime color={"#000000"} />
                                  )}
                                </IconButton>
                              ),
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    {/* STATUS  */}
                    <Select
                      id="meeting-status"
                      value={{
                        value: meetingStatus,
                        label: t(`status_${meetingStatus.toLowerCase()}`),
                      }}
                      onChange={(selectedOption) => {
                        setMeetingStatus(selectedOption.value);
                      }}
                      options={[
                        { value: "Pending", label: t("status_pending") },
                        { value: "Postponed", label: t("status_postponed") },
                        { value: "Attended", label: t("status_attended") },
                        { value: "Cancelled", label: t("status_cancelled") },
                      ]}
                      isSearchable={false}
                      className="w-full"
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                    {/* <FormControl fullWidth>
                      <TextField
                        sx={SelectStyles}
                        select
                        size="small"
                        labelId="meeting-status"
                        label={t("label_meeting_status")}
                        value={meetingStatus}
                        onChange={(e) => {
                          setMeetingStatus(e.target.value);
                        }}
                      >
                        <MenuItem value={"Pending"}>
                          {t("status_pending")}
                        </MenuItem>
                        <MenuItem value={"Postponed"}>
                          {t("status_postponed")}
                        </MenuItem>
                        <MenuItem value={"Attended"}>
                          {t("status_attended")}
                        </MenuItem>
                        <MenuItem value={"Cancelled"}>
                          {t("status_cancelled")}
                        </MenuItem>
                      </TextField>
                    </FormControl> */}

                    {/* NOTES  */}
                    <TextField
                      id="text"
                      type={"text"}
                      label={t("label_meeting_notes")}
                      size="small"
                      className="w-full"
                      variant="outlined"
                      sx={{
                        "& input": {
                          fontFamily: isArabic(meetingNotes)
                            ? "Noto Kufi Arabic"
                            : "inherit",
                        },
                        marginBottom: "20px",
                      }}
                      name="text"
                      value={meetingNotes}
                      onChange={(e) => {
                        setMeetingNotes(e.target.value);
                      }}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <div
                              // ref={searchContainer}
                              className={`${
                                isVoiceSearchState ? "listening bg-primary" : ""
                              } ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              } rounded-full cursor-pointer hover:bg-gray-500 p-1`}
                              onClick={() => {
                                setIsVoiceSearchState(!isVoiceSearchState);
                                console.log("mic is clicked...");
                              }}
                            >
                              {isVoiceSearchState ? (
                                <BsMicFill id="search_mic" size={16} />
                              ) : (
                                <BsMic id="search_mic" size={16} />
                              )}
                            </div>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {meetingLocation.lat && meetingLocation.lng && (
                      <LocationPicker
                        meetingLocation={meetingLocation}
                        setMeetingLocation={setMeetingLocation}
                      />
                    )}
                  </div>
                </Box>
              </div>

              <div className="p-4">
                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
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
                    <span> {t("btn_update_meeting")}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateMeeting;
