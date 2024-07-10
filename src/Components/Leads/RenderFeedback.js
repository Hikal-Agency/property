import { Button } from "@material-tailwind/react";
import {
  CircularProgress,
  Dialog,
  FormControl,
  InputLabel,
  IconButton,
  MenuItem,
  // Select,
  InputAdornment,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { Box } from "@mui/system";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { MdAccessTime } from "react-icons/md";
import { socket } from "../../Pages/App.js";

import axios from "../../axoisConfig";
import React, { useState, useEffect } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import LocationPicker from "../meetings/LocationPicker";
import dayjs from "dayjs";
import moment from "moment";
import {
  renderStyles,
  renderStyles2,
  selectStyles,
} from "../_elements/SelectStyles.jsx";
import { currencies, feedback_options } from "../_elements/SelectOptions.js";

import { BsBookmarkCheck } from "react-icons/bs";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { BsMic, BsMicFill } from "react-icons/bs";

const RenderFeedback = ({ cellValues }) => {
  const {
    currentMode,
    setreloadDataGrid,
    reloadDataGrid,
    fetchSidebarData,
    BACKEND_URL,
    User,
    t,
    primaryColor,
    darkModeColors,
    feedbackTheme,
    i18n,
  } = useStateContext();

  console.log("DT FEEDBACK THEME =========== ", feedbackTheme);

  console.log("cellVAlues:::::::::::::::::::: ", cellValues);

  // const dynamicStyleFn = new Function('currentMode', 'primaryColor', `return ${feedbackTheme};`);

  // const dynamicStyle = dynamicStyleFn(currentMode, primaryColor);
  const currentDate = moment().format("yyyy-MM-dd");

  const [btnloading, setbtnloading] = useState(false);
  const [Feedback, setFeedback] = useState(cellValues?.row?.feedback);
  const [newFeedback, setnewFeedback] = useState("");
  const [DialogueVal, setDialogue] = useState(false);
  const [booked_amount, setBookedAmount] = useState();
  const [booked_date, setBookedDate] = useState(null);
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetingData, setMeetingData] = useState({
    meetingDate: null,
    meetingTime: null,
    meetingNotes: null,
  });

  const [meetingLocation, setMeetingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });
  const [otherBookedData, setOtherBookedData] = useState({
    unit: "",
    amount: "",
    currency: "AED",
  });
  const ChangeFeedback = (e) => {
    // setnewFeedback(e.target.value);
    setnewFeedback(e.value);
    setDialogue(true);
  };

  const [isVoiceSearchState, setIsVoiceSearchState] = useState(false);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition();

  useEffect(() => {
    if (isVoiceSearchState && transcript.length > 0) {
      setMeetingData({
        ...meetingData,
        notes: transcript,
      });
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
    setMeetingData({
      ...meetingData,
      notes: "",
    });
    setMeetingNotes("");
    resetTranscript();
  };
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () =>
    SpeechRecognition.startListening({
      continuous: true,
      language:
        i18n?.language == "pk"
          ? "ur"
          : i18n?.language == "cn"
          ? "zh"
          : i18n?.language == "in"
          ? "hi"
          : i18n?.language,
    });

  console.log("Render Feedback===> ", cellValues?.row?.feedback);

  // console.log("meeting address text: ", meetingLocation);

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        fontSize: "12px",
        fontWeight: "400",
        border: "none",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  };

  // console.log("Feedback: ", Feedback);
  const UpdateFeedback = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("lid", cellValues?.row?.leadId);
    UpdateLeadData.append("id", cellValues?.row?.leadId);
    UpdateLeadData.append("feedback", newFeedback);
    if (newFeedback === "Meeting") {
      if (!meetingData.meetingDate || !meetingData.meetingTime) {
        toast.error("Meeting time and date required.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        return;
      }
      // UpdateLeadData.append(
      //   "meetingDate",
      //   meetingData.meetingDate.toISOString().split("T")[0]
      // );
      UpdateLeadData.append("meetingDate", meetingData.meetingDate);
      UpdateLeadData.append(
        "meetingTime",
        new Date(meetingData.meetingTime).toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      UpdateLeadData.append("meetingStatus", "Pending");
      UpdateLeadData.append("mLat", String(meetingLocation.lat));
      UpdateLeadData.append("mLong", String(meetingLocation.lng));
      UpdateLeadData.append("meetingLocation", meetingLocation.addressText);
      UpdateLeadData.append("meetingNote", meetingData.notes || "");
    }

    if (newFeedback === "Booked") {
      if (!booked_amount && !booked_date) {
        toast.error("Booked amount and date required.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        return;
      }

      UpdateLeadData.append("booked_amount", booked_amount);
      UpdateLeadData.append("booked_date", booked_date || currentDate);
      UpdateLeadData.append("project", cellValues?.row?.project);
      UpdateLeadData.append("enquiryType", cellValues?.row?.enquiryType);
      UpdateLeadData.append("leadFor", cellValues?.row?.leadFor);
      UpdateLeadData.append("leadType", cellValues?.row?.leadType);
      UpdateLeadData.append("unit", otherBookedData?.unit);
      UpdateLeadData.append("amount", otherBookedData?.amount);
      UpdateLeadData.append("currency", otherBookedData?.currency);
    }

    await axios
      .post(`${BACKEND_URL}/leads/${cellValues?.row?.leadId}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        fetchSidebarData();
        console.log("Feedback Updated successfull");
        console.log(result);

        toast.success("Feedback Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (newFeedback === "Meeting") {
          socket.emit("notification_meeting_schedule", {
            from: { id: User?.id },
            leadName: cellValues?.row?.leadName,
            // meetingDate: meetingData.meetingDate.toISOString().split("T")[0],
            meetingDate: meetingData.meetingDate,
            meetingTime: new Date(meetingData.meetingTime).toLocaleTimeString(
              "en-US",
              {
                hour12: false,
                timeZone: "Asia/Dubai",
                hour: "2-digit",
                minute: "2-digit",
              }
            ),
            participants: [User?.isParent],
          });

          axios
            .get(`${BACKEND_URL}/meetings/future`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
            .then((result) => {
              console.log("future meetings are ", result);
              socket.emit("get_all_meetings", result?.data);
            })
            .catch((error) => {
              console.log("error ", error);
            });
        } else {
          socket.emit("notification_feedback_update", {
            from: { id: User?.id, userName: User?.userName },
            leadName: cellValues?.row?.leadName,
            newFeedback: newFeedback,
            participants: [
              cellValues?.row?.assignedToManager || 0,
              cellValues?.row?.assignedToSales || 0,
            ],
          });
        }
        setbtnloading(false);
        setFeedback(newFeedback);
        setreloadDataGrid(!reloadDataGrid);
        setDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Feedback", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };

  useEffect(() => {
    setFeedback(cellValues?.row?.feedback);
  }, [cellValues]);

  // useEffect(() => {
  //   const geocoder = new window.google.maps.Geocoder();
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     geocoder.geocode(
  //       {
  //         location: {
  //           lat: Number(position.coords.latitude),
  //           lng: Number(position.coords.longitude),
  //         },
  //       },
  //       (results, status) => {
  //         if (status === "OK") {
  //           setMeetingLocation({
  //             lat: Number(position.coords.latitude),
  //             lng: Number(position.coords.longitude),
  //             addressText: results[0].formatted_address,
  //           });
  //         } else {
  //           console.log("Getting address failed due to: " + status);
  //         }
  //       }
  //     );
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Box
      className={`renderDD w-full h-full flex items-center justify-center `}
      sx={SelectStyles}
    >
      {feedbackTheme === "renderStyles" ? (
        <Select
          aria-label="select feedback"
          id="feedback"
          options={feedback_options(t)}
          value={
            feedback_options(t).find((option) => option.value === Feedback) || {
              value: Feedback,
              label: Feedback,
            }
          }
          onChange={ChangeFeedback}
          placeholder={t("label_feedback")}
          className={`w-full`}
          menuPortalTarget={document.body}
          styles={renderStyles(currentMode, primaryColor)}
        />
      ) : (
        <Select
          aria-label="select feedback"
          id="feedback"
          options={feedback_options(t)}
          value={
            feedback_options(t).find((option) => option.value === Feedback) || {
              value: Feedback,
              label: Feedback,
            }
          }
          onChange={ChangeFeedback}
          placeholder={t("label_feedback")}
          className={`w-full`}
          menuPortalTarget={document.body}
          styles={renderStyles2(currentMode, primaryColor)}
        />
      )}

      {/* <FormControl
        className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
        sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}
      >
        <Select
          id="feedback"
          value={Feedback ?? "selected"}
          label={t("label_feedback")}
          onChange={ChangeFeedback}
          size="medium"
          // className="w-[100%] h-[75%] border-none render"
          className="w-full border border-gray-300 rounded "
          displayEmpty
          required
          sx={{
            border: "1px solid #000000",
            // color:
            //   currentMode === "dark"
            //     ? "#ffffff !important"
            //     : "#000000 !important",
            // "& .MuiSelect-icon": {
            //   color:
            //     currentMode === "dark"
            //       ? "#ffffff !important"
            //       : "#000000 !important",
            // },
            "& .MuiSelect-select": {
              fontSize: 11,
            },
          }}
        >
          {!Feedback ? (
            <MenuItem value={"selected"} selected>
              ---{t("label_feedback")}---
            </MenuItem>
          ) : null}

          <MenuItem value={"New"}>{t("feedback_new")}</MenuItem>
          <MenuItem value={"Follow Up"}>{t("feedback_follow_up")}</MenuItem>
          <MenuItem value={"Meeting"}>{t("feedback_meeting")}</MenuItem>
          <MenuItem value={"Booked"}>{t("feedback_booked")}</MenuItem>
          <MenuItem value={"Low Budget"}>{t("feedback_low_budget")}</MenuItem>
          <MenuItem value={"Not Interested"}>
            {t("feedback_not_interested")}
          </MenuItem>
          <MenuItem value={"No Answer"}>{t("feedback_no_answer")}</MenuItem>
          <MenuItem value={"Unreachable"}>{t("feedback_unreachable")}</MenuItem>
          <MenuItem value={"Duplicate"}>{t("feedback_duplicate")}</MenuItem>
          <MenuItem value={"Dead"}>{t("feedback_dead")}</MenuItem>
          <MenuItem value={"Wrong Number"}>
            {t("feedback_wrong_number")}
          </MenuItem>
        </Select>
      </FormControl> */}

      {DialogueVal && (
        <>
          <Dialog
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "none !important",
              },
              "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                {
                  // backgroundColor: "rgba(0, 0, 0, 0.6) !important",
                },
            }}
            open={DialogueVal}
            onClose={(e) => setDialogue(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="relative"
          >
            <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setDialogue(false)}
            >
              <IoMdClose size={18} />
            </IconButton>
            <div
              className={`px-10 py-5 ${
                currentMode === "dark"
                  ? "bg-[#1C1C1C] text-white"
                  : "bg-white text-black"
              }`}
            >
              {/* FEEDBACK  */}
              <div className="flex flex-col justify-center items-center">
                <BsBookmarkCheck size={50} className="text-primary text-2xl" />
                <h1 className="font-semibold pt-3 mb-3 text-lg text-center">
                  {t("want_to_change_feedback")} {t("from")}{" "}
                  <span className="text-sm bg-gray-600 text-white px-2 py-1 rounded-md font-bold">
                    {Feedback
                      ? t(
                          "feedback_" +
                            Feedback?.toLowerCase()?.replaceAll(" ", "_")
                        )
                      : t("no_feedback")}
                  </span>{" "}
                  {t("to")}{" "}
                  <span className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold">
                    {newFeedback
                      ? t(
                          "feedback_" +
                            newFeedback?.toLowerCase()?.replaceAll(" ", "_")
                        )
                      : t("no_feedback")}
                  </span>{" "}
                  ?
                </h1>
              </div>

              {/* MEETING  */}
              {newFeedback === "Meeting" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateFeedback(cellValues);
                  }}
                >
                  <div className="flex flex-col justify-center items-center gap-4 mt-4">
                    <Box sx={darkModeColors}>
                      {/* DATE  */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={t("label_meeting_date")}
                          value={meetingData.meetingDate}
                          views={["year", "month", "day"]}
                          onChange={(newValue) => {
                            console.log("meeting date: ", newValue);

                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setMeetingData({
                              ...meetingData,
                              meetingDate: formattedDate,
                            });
                          }}
                          format="yyyy-MM-dd"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                              fullWidth
                              size="small"
                              style={{ marginBottom: "20px" }}
                            />
                          )}
                          minDate={dayjs().startOf("day").toDate()}
                          InputProps={{ required: true }}
                        />
                      </LocalizationProvider>
                      {/* TIME  */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                          // ampm={false}
                          label={t("label_meeting_time")}
                          format="hh:mm A"
                          value={meetingData.meetingTime}
                          onChange={(newValue) => {
                            setMeetingData({
                              ...meetingData,
                              meetingTime: newValue,
                            });
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              size="small"
                              style={{ marginBottom: "20px" }}
                              InputProps={{
                                endAdornment: (
                                  <IconButton>
                                    <MdAccessTime color={"#AAAAAA"} />
                                  </IconButton>
                                ),
                              }}
                            />
                          )}
                          InputProps={{ required: true }}
                        />
                      </LocalizationProvider>
                      {/* NOTE  */}
                      <TextField
                        id="text"
                        type={"text"}
                        multiline
                        minRows={1}
                        maxRows={5}
                        sx={{
                          "& input": {
                            fontFamily: "Noto Kufi Arabic",
                          },
                        }}
                        label={t("label_meeting_notes")}
                        className="w-full"
                        style={{ marginBottom: "20px" }}
                        variant="outlined"
                        name="text"
                        size="small"
                        value={meetingNotes}
                        onChange={(e) => {
                          setMeetingData({
                            ...meetingData,
                            notes: e.target.value,
                          });
                          setMeetingNotes(e?.target?.value);
                        }}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <div
                                // ref={searchContainer}
                                className={`${
                                  isVoiceSearchState
                                    ? "listening bg-primary"
                                    : ""
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
                      {/* LOCATION  */}
                      <LocationPicker
                        meetingLocation={meetingLocation}
                        currLocByDefault={true}
                        setMeetingLocation={setMeetingLocation}
                      />
                    </Box>
                  </div>
                  <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                    <Button
                      className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                      ripple={true}
                      size="lg"
                      type="submit"
                    >
                      {btnloading ? (
                        <CircularProgress size={16} sx={{ color: "white" }} />
                      ) : (
                        <span>{t("confirm")}</span>
                      )}
                    </Button>

                    <Button
                      onClick={() => setDialogue(false)}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none px-2 rounded-md text-sm  ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-primary border-primary"
                      }`}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : // BOKKED
              newFeedback === "Booked" ? (
                <>
                  <Box sx={darkModeColors} className="my-5">
                    {/* DATE  */}
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={t("booking_date")}
                        value={booked_date}
                        views={["year", "month", "day"]}
                        onChange={(selectedDate) => {
                          console.log("selected Date: ", selectedDate);
                          const formattedDate = moment(selectedDate?.$d).format(
                            "YYYY-MM-DD"
                          );
                          setBookedDate(formattedDate);
                        }}
                        format="YYYY-MM-DD"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            // onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                            fullWidth
                            size="small"
                            style={{
                              marginBottom: "10px",
                            }}
                          />
                        )}
                        maxDate={dayjs().startOf("day").toDate()}
                        InputProps={{ required: true }}
                      />
                    </LocalizationProvider>
                    {/* BOOKED AMOUNT  */}
                    <TextField
                      id="booked_amount"
                      type={"number"}
                      sx={{
                        "& input": {
                          fontFamily: "Noto Kufi Arabic",
                        },
                      }}
                      label="Booked Amount "
                      className="w-full"
                      style={{
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                      variant="outlined"
                      name="booked_amount"
                      size="small"
                      value={booked_amount}
                      onChange={(e) => {
                        setBookedAmount(e.target.value);
                      }}
                      required
                    />
                    {/* UNIT  */}
                    <TextField
                      id="unit"
                      type={"text"}
                      sx={{
                        "& input": {
                          fontFamily: "Noto Kufi Arabic",
                        },
                      }}
                      label="Unit "
                      className="w-full"
                      style={{
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                      variant="outlined"
                      name="unit"
                      size="small"
                      value={otherBookedData?.unit}
                      onChange={(e) => {
                        setOtherBookedData({
                          ...otherBookedData,
                          unit: e.target.value,
                        });
                      }}
                      required
                    />
                    {/* AMOUNT  */}
                    <TextField
                      id="amount"
                      type={"number"}
                      sx={{
                        "& input": {
                          fontFamily: "Noto Kufi Arabic",
                        },
                      }}
                      label="Selling Amount "
                      className="w-full"
                      style={{
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                      variant="outlined"
                      name="amount"
                      size="small"
                      value={otherBookedData?.amount}
                      onChange={(e) => {
                        setOtherBookedData({
                          ...otherBookedData,
                          amount: e.target.value,
                        });
                      }}
                      required
                    />
                    {/* CURRENCY  */}
                    <Select
                      aria-label="select currency"
                      id="currency"
                      options={currencies(t)}
                      value={currencies(t).find(
                        (option) => option.value === otherBookedData?.currency
                      )}
                      onChange={(e) => {
                        setOtherBookedData({
                          ...otherBookedData,
                          currency: e.value,
                        });
                      }}
                      placeholder={t("label_currency")}
                      className={`w-full`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                  </Box>
                  <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                    <Button
                      className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                      ripple={true}
                      size="lg"
                      onClick={() => UpdateFeedback(cellValues)}
                    >
                      {btnloading ? (
                        <CircularProgress size={16} sx={{ color: "white" }} />
                      ) : (
                        <span>Confirm</span>
                      )}
                    </Button>

                    <Button
                      onClick={() => setDialogue(false)}
                      ripple={true}
                      variant="outlined"
                      className={`shadow-none p-3 rounded-md text-sm text-[#da1f26]  border-[#da1f26]   py-3                       
                      `}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                  <Button
                    className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                    ripple={true}
                    size="lg"
                    onClick={() => UpdateFeedback(cellValues)}
                  >
                    {btnloading ? (
                      <CircularProgress size={16} sx={{ color: "white" }} />
                    ) : (
                      <span>Confirm</span>
                    )}
                  </Button>

                  <Button
                    onClick={() => setDialogue(false)}
                    ripple={true}
                    variant="outlined"
                    className={`shadow-none p-3 rounded-md text-sm  ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-primary border-primary"
                    }`}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RenderFeedback;
