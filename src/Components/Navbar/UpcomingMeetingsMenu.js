import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { AiOutlineHistory } from "react-icons/ai";
import { Container, CircularProgress, Tooltip } from "@mui/material";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import { BsBuilding, BsClock, BsPin } from "react-icons/bs";
import "../../styles/animation.css";
import Timeline from "../../Pages/timeline";

const UpcomingMeetingsMenu = ({ handleClose }) => {
  const { currentMode, BACKEND_URL, t } = useStateContext();
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timelinePopup, setTimelinePopup] = useState({ isOpen: false });
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
      <div
        onMouseLeave={handleClose}
        sx={{
          maxHeight: 500,
          width: 350,
        }}
        className="p-3"
      >
        <div
          onClick={() => {
            navigate("/meetings");
          }}
          className="flex -mt-2 mb-3 justify-center text-[#AAAAAA] hover:text-primary text-sm w-full"
          style={{
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {t("view_all_meetings")}
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
              width: "100%",
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
                  className={`card-hover ${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } mt-3 space-y-3 rounded-xl shadow-sm w-full ${
                    index === upcomingMeetings.length - 1 && ""
                  }`}
                >
                  <div className="p-4 pb-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-primary font-semibold">
                        {meeting?.leadName}
                      </h2>

                      <p
                        style={{ cursor: "pointer" }}
                        className={`${
                          currentMode === "dark"
                            ? "text-[#FFFFFF] bg-[#262626]"
                            : "text-[#1C1C1C] bg-[#EEEEEE]"
                        } hover:bg-primary rounded-full shadow-none p-1.5 mr-1 flex items-center timelineBtn`}
                      >
                        <Tooltip title="View Timeline" arrow>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimelinePopup({
                                isOpen: true,
                                leadId: meeting?.leadId,
                              });
                            }}
                          >
                            <AiOutlineHistory size={16} />
                          </button>
                        </Tooltip>
                      </p>
                    </div>

                    <div className="grid grid-cols-11 items-center">
                      <BsBuilding
                        size={16}
                        className={`m-1 ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      />
                      <p
                        className="text-sm mr-3 col-span-10"
                        style={{ lineHeight: "1.7rem" }}
                      >
                        {meeting?.project === "null" ? "-" : meeting?.project}{" "}
                        {meeting?.enquiryType === "null"
                          ? "-"
                          : meeting?.enquiryType}{" "}
                        {meeting?.leadType === "null" ? "-" : meeting?.leadType}{" "}
                        {meeting?.leadFor === "null" ? "-" : meeting?.leadFor}
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
                      <p
                        className="text-sm mr-3 col-span-10"
                        style={{ lineHeight: "1.7rem" }}
                      >
                        {" "}
                        {meeting?.meetingLocation || "Not Updated"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`${
                      currentMode === "dark" ? "bg-primary" : "bg-primary"
                    } block text-sm text-white rounded-b-xl text-center p-2 font-semibold`}
                  >
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
      </div>

      {timelinePopup?.isOpen && (
        <Timeline
          timelineModelOpen={timelinePopup?.isOpen}
          handleCloseTimelineModel={() => setTimelinePopup({ isOpen: false })}
          LeadData={{ ...timelinePopup }}
        />
      )}
    </>
  );
};

export default UpcomingMeetingsMenu;
