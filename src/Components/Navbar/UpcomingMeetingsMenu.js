import { useState, useEffect } from "react";
import moment from "moment";
import { Container, CircularProgress, Button } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { 
  BsBuilding, 
  BsClock,
  BsPin 
} from "react-icons/bs";
import { ImLocation, ImClock } from "react-icons/im";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UpcomingMeetingsMenu = () => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const FetchUpcomingMeetings = async (token) => {
    setLoading(true);
    await axios
      .get(`${BACKEND_URL}/dashboard?page=1`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })

      .then((result) => {
        setLoading(false);
        setUpcomingMeetings(result.data.upcoming_meetings);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchUpcomingMeetings(token);
  }, []);
  return (
    <>
      <Container 
        sx={{ maxHeight: 500, width: 350, position: "relative" }}
        >
        <div
          onClick={() => {
            navigate("/meetings");
          }}
          className="flex -mt-2 mb-3 justify-center text-[#AAAAAA] hover:text-[#DA1F26] text-sm w-full"
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          View All Meetings
        </div>

        {/* <Button
          style={{
            background: "transparent",
            color: "#AAAAAA",
          }}
          component={Link}
          to="/meetings"
          // className="w-full"
        >
          View all meetings
        </Button> */}

        {loading && (
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
        {!loading &&
          (upcomingMeetings?.length > 0 ? (
            upcomingMeetings?.map((meeting, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } m-1 mb-2 space-y-3 rounded-xl shadow-sm hover:shadow-md hover:-mt-1 hover:mb-3 w-full ${
                    index === upcomingMeetings.length - 1 && "mb-5"
                  }`}
                >
                  <div className="p-4 pb-1 space-y-3">
                    <h2 className="text-main-red-color font-semibold">
                      {meeting?.leadName}
                    </h2>

                    <div className="grid grid-cols-11 flex items-center">
                      <BsBuilding
                        size={16}
                        className={`m-1 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3 col-span-10" style={{ lineHeight: "1.7rem" }}>
                        {meeting?.project === "null" ? "-" : meeting?.project} {meeting?.enquiryType === "null" ? "-" : meeting?.enquiryType}{" "}
                        {meeting?.leadType === "null" ? "-" : meeting?.leadType} {meeting?.leadFor === "null" ? "-" : meeting?.leadFor}
                      </p>
                    </div>

                    <div className="grid grid-cols-11 flex items-center">
                      <BsClock
                        size={16}
                        className={`m-1 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                     <p className="text-sm mr-3 col-span-10">
                        {meeting?.meetingTime === ""
                          ? ""
                          : `${meeting?.meetingTime}, `}{" "}
                        {moment(meeting?.meetingDate).format("MMMM D, Y")}
                      </p>
                    </div>

                    <div className="grid grid-cols-11 flex items-center">
                      <BsPin
                        size={16}
                        className={`m-1 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p className="text-sm mr-3 col-span-10" style={{ lineHeight: "1.7rem" }}>
                        {" "}
                        {meeting?.meetingLocation || "Not Updated"}
                      </p>
                    </div>
                    
                  </div>
                  <span className={`${currentMode === "dark" ? "bg-[#333333]" : "bg-main-red-color"} block text-sm text-white rounded-b-xl text-center p-2 font-semibold`}>
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
              <h2>No meetings</h2>
            </div>
          ))}
      </Container>
    </>
  );
};

export default UpcomingMeetingsMenu;
