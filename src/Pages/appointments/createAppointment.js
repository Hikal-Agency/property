import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import GoogleCalendarAppointment from "../../Components/appointments/GoogleCalendarAppointment";
import { Box, InputAdornment, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { BsSearch } from "react-icons/bs";

const CreateAppointment = () => {
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, User, darkModeColors } =
    useStateContext();
  const [meetingsCount, setMeetingCount] = useState({
    pendingMeeting: null,
    completedMeetings: null,
  });

  console.log("meetings count:: ", meetingsCount);
  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="mt-3">
              <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-5 flex justify-between">
                <Box
                  sx={{
                    borderRadius: "7px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "bold",
                    background:
                      currentMode === "dark" ? "#333333" : "#EEEEEE",
                    color: currentMode === "dark" ? "white" : "black",
                    boxShadow: currentMode === "dark" ? "3px 3px 3px rgba(255, 255, 255, 0.35)" : "3px 3px 3px rgba(0, 0, 0, 0.25)",
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

                <div className="p-5 mt-2 w-full lg:col-span-2">
                  <Box 
                    sx={darkModeColors}
                  >
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
                                currentMode == "dark"
                                  ? "#AAAAAA"
                                  : "#AAAAAA"
                              }
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <div className="grid grid-cols-2 gap-5 py-4">
                    <Box
                      sx={{
                        // padding: "6px",
                        borderRadius: "7px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        background:
                          currentMode === "dark" ? "#333333" : "#EEEEEE",
                        color: currentMode === "dark" ? "white" : "black",
                        boxShadow: currentMode === "dark" ? "3px 3px 3px rgba(255, 255, 255, 0.35)" : "3px 3px 3px rgba(0, 0, 0, 0.25)",
                      }}
                      className="p-5"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <h1 className="font-bold text-3xl text-primary mr-3">
                          {meetingsCount?.pendingMeeting}
                        </h1>
                        <div>Meetings Pending</div>
                      </div>
                    </Box>
                    <Box
                      sx={{
                        // padding: "10px",
                        borderRadius: "7px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold",
                        background:
                          currentMode === "dark" ? "#333333" : "#EEEEEE",
                        color: currentMode === "dark" ? "white" : "black",
                        boxShadow: currentMode === "dark" ? "3px 3px 3px rgba(255, 255, 255, 0.35)" : "3px 3px 3px rgba(0, 0, 0, 0.25)",
                      }}
                      className="p-5"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <h1 className="font-bold text-3xl text-primary mr-3">
                          {meetingsCount?.completedMeetings}
                        </h1>
                        <div>Meetings Completed</div>
                      </div>
                    </Box>
                  </div>
                </div>
              </div>

              {/* <h1
                className={`text-lg border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-red-600 font-bold border-red-600"
                }`}
              >
                ● Create Appointment
              </h1> */}
              {/* <GoogleCalendarAppointment
                meetingsCount={meetingsCount}
                setMeetingCount={setMeetingCount}
              /> */}
              <Box className="h-[60vh] flex items-center justify-center">
                <img src="/coming-soon.png" width={"200px"} alt="" />
              </Box>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAppointment;
