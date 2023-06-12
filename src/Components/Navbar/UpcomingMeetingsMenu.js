import { useState, useEffect } from "react";
import moment from "moment";
import { Container, CircularProgress, Button } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { BsBuilding } from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";
// import axios from "axios";
import axios from "../../axoisConfig";
import { Link } from "react-router-dom";

const UpcomingMeetingsMenu = () => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  const FetchUpcomingMeetings = async (token) => {
    await axios
      .get(`${BACKEND_URL}/dashboard?page=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUpcomingMeetings(result.data.upcoming_meetings);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchUpcomingMeetings(token);
  }, []);
  return (
    <>
      <Container sx={{ maxHeight: 500, width: 400 }}>
        {upcomingMeetings.length > 0 ? (
          upcomingMeetings.map((meeting, index) => {
            return (
              <div
                key={index}
                className={`${
                  currentMode === "dark" ? "bg-black" : "bg-white"
                } rounded-md mb-3 ${
                  index === upcomingMeetings.length - 1 && "pb-2"
                }`}
              >
                <div className="px-5 py-5 space-y-3">
                  {/* <div className="w-full flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <GrStatusGoodSmall className={`mr-2 ${meeting?.meetingStatus === "Pending" ? "text-[#e4b115]" : meeting?.meetingStatus === "Postponed" ? "text-[#e4b115]" : meeting?.meetingStatus === "Attended" ? "text-[#0f9d58]" : meeting?.meetingStatus === "Cancelled" ? "text-[#ff0000]" : "text-[#eeeeee]"}`} size={18} />
                <p className="text-sm font-bold mr-3">{meeting?.meetingStatus}</p>
                </div>
              </div> */}
                  <h2 className="text-main-red-color text-md font-bold">
                    {meeting?.leadName}
                  </h2>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <BsBuilding
                        size={"20px"}
                        className={`mr-2 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3">
                        {meeting?.project} {meeting?.enquiryType}{" "}
                        {meeting?.leadType} {meeting?.leadFor}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <ImClock
                        size={"18px"}
                        className={`mr-2 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3">
                        {meeting?.meetingTime === ""
                          ? ""
                          : `${meeting?.meetingTime}, `}{" "}
                        {moment(meeting?.meetingDate).format("MMMM D, Y")}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <ImLocation
                        size={"18px"}
                        className={`mr-2 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3">
                        {" "}
                        {meeting?.meetingLocation || "Not Updated"}
                      </p>
                    </div>
                  </div>
                </div>
                <span className="block text-sm bg-main-red-color text-white rounded-md text-center p-2 font-semibold">
                  {meeting?.createdBy}
                </span>
              </div>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress size={30} />
          </div>
        )}

        <div
          style={{
            position: "sticky",
            bottom: 0,
            // width: "100%",
            textAlign: "center",
            zIndex: "9999",
          }}
        >
          <Button
            variant="contained"
            style={{ background: "#FF0000", color: "white" }}
            component={Link}
            to="/appointments/meetings"
            // className="w-full"
          >
            View all meetings
          </Button>
        </div>
      </Container>
    </>
  );
};

export default UpcomingMeetingsMenu;
