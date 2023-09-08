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
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full`}>
              <div className="pl-3">
                <div className="mt-10">
                  <div className="flex justify-between mb-4">
                    <div>
                      <Box
                        sx={{
                          padding: "30px",
                          borderRadius: "7px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background:
                            currentMode === "dark" ? "#3b3d44" : "#E5E7EB",
                          color: currentMode === "dark" ? "white" : "black",
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                          height: "160px",
                          width: "700px",
                        }}
                        className="my-5 mx-5"
                      >
                        <div>
                          <h1 className="font-bold text-4xl ">
                            Hello {User?.userName}!
                          </h1>
                          <p className="mt-2 ml-1 font-light">
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
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-end me-5">
                        {/* <CustomTextField
                          label="Search"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BsSearch />
                              </InputAdornment>
                            ),
                          }}
                        /> */}
                        <Box sx={darkModeColors}>
                          {" "}
                          <TextField
                            className="w-[380px]"
                            label="Search"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <BsSearch
                                    color={
                                      currentMode == "dark"
                                        ? "#ffffff"
                                        : "#000000"
                                    }
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </div>

                      <div className="flex flex-end">
                        <Box
                          sx={{
                            // padding: "6px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background:
                              currentMode === "dark" ? "#3b3d44" : "#E5E7EB",
                            color: currentMode === "dark" ? "white" : "black",
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "180px",
                            marginRight: "10px",
                          }}
                          className="my-5 mx-5  px-10"
                        >
                          <h1 className="font-bold text-5xl mr-3">
                            {meetingsCount?.pendingMeeting}
                          </h1>
                          <span>Meetings Pending</span>
                        </Box>
                        <Box
                          sx={{
                            // padding: "10px",
                            borderRadius: "7px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontWeight: "bold",
                            background:
                              currentMode === "dark" ? "#3b3d44" : "#E5E7EB",
                            color: currentMode === "dark" ? "white" : "black",
                            boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                            height: "70px",
                            width: "180px",
                          }}
                          className="my-5 mx-5 px-10"
                        >
                          <h1 className="font-bold text-5xl mr-3">
                            {meetingsCount?.completedMeetings}
                          </h1>
                          <span>Meetings Completed</span>
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
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default CreateAppointment;
