import { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { socket } from "../App";
import { BsArrowsFullscreen } from "react-icons/bs";
import Loader from "../../Components/Loader";
import { IconButton } from "@mui/material";
import ProgressBar from "../../Components/_elements/Progressbar";

import {
  BsArrowLeftCircleFill,
  BsArrowRightCircleFill,
  BsFillBookmarkStarFill,
  BsFillLockFill
} from "react-icons/bs";
import {
  HiOutlineLockClosed
} from "react-icons/hi";


const TodayCallLogs = () => {
  const [noData, setNoData] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentMode, User } = useStateContext();

  const [slide, setSlide] = useState(0);
  const [autoplay, setAutoplay] = useState(null);

  useEffect(()=>{
    setTimeout(() => {
      setSlide(slide === 0 ? slides.length - 1 : slide - 1);
    }, 60 * 60 * 3600);
  });

  const nextSlide = () => {
    setSlide(slide === slides.length - 1 ? 0 : slide + 1);
  }

  const prevSlide = () => {
    setSlide(slide === 0 ? slides.length - 1 : slide - 1);
  }

  const slides = [
    {
      "heading": "CALL LOGS",
    },
    {
      "heading": "TARGET",
    },
  ];

  const target = [
    {
      userName: "Hala Hikal",
      profile_picture: "",
      target: 3000000,
      total_closed: 7,
      month_closed: 2,
      booked: 2,
      total_closed_amount: 4000000,
      month_closed_amount: 2000000,
    },
    {
      userName: "Mohamed Hany Mohamed Ezzat",
      profile_picture: "",
      target: 3000000,
      total_closed: 7,
      month_closed: 2,
      booked: 2,
      total_closed_amount: 4000000,
      month_closed_amount: 2000000,
    },
    {
      userName: "Hanan Nassouh Alzaeem",
      profile_picture: "",
      target: 3000000,
      total_closed: 7,
      month_closed: 2,
      booked: 2,
      total_closed_amount: 4000000,
      month_closed_amount: 2000000,
    },
    {
      userName: "Hassan Adel Sobhy Mahmoud",
      profile_picture: "",
      target: 3000000,
      total_closed: 7,
      month_closed: 2,
      booked: 2,
      total_closed_amount: 4000000,
      month_closed_amount: 2000000,
    },
  ];

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date();

  useEffect(() => {
    if (User && socket) {
      socket.emit("get-call-logs");
      socket.on("call-logs", (data) => {
        if (data) {
          console.log(data);
          if (data.length > 0) {
            setNoData(false);
            setLoading(false);
            setCallLogs(data);
          } else {
            setNoData(true);
          }
        }
        setLoading(false);
      });
    }
  }, [User, socket]);
  function requestFullScreen(element) {
    var requestMethod =
      element.requestFullScreen ||
      element.webkitRequestFullScreen ||
      element.mozRequestFullScreen ||
      element.msRequestFullScreen;
    if (requestMethod) {
      // Native full screen.
      requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") {
      // Older IE.
      var wscript = new window.ActiveXObject("WScript.Shell");
      if (wscript !== null) {
        wscript.SendKeys("{F11}");
      }
    }
  }
  return (
    <div className={`text-xl ${
      currentMode === "dark"
        ? "text-white"
        : "text-black"
      }`} 
      style={{ minHeight: "95vh", maxHeight: "100vh", width: "100%", backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE" }}>
      <div>
        <div
          className="flex justify-between items-center px-3 py-1 relative w-full"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: "20",
            height: "7vh",
            backgroundColor: currentMode === "dark" ? "black" : "white",
            boxShadow:
              currentMode === "dark" ? "0 2px 4px rgba(255, 255, 255, 0.2)" : "0 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          <div className="flex items-center">
            <div className="flex items-center px-2 cursor-pointer">
              {/* <a href="/dashboard"> */}
                <img className="h-[6vh]" src={`${currentMode === "dark" ? "/assets/whiteLogo.png" : "/assets/blackLogo.png"}`} alt="" />
              {/* </a> */}
            </div> 
          </div>
          <h1
            // style={{ fontSize: 20 }}
            className={`${
              currentMode === "dark" ? "text-white" : "text-[#da1f26]"
            } font-bold text-2xl px-2`}
          >
            LEADERBOARD
          </h1>
          
          <IconButton onClick={() => requestFullScreen(document.body)}>
            <BsArrowsFullscreen size={16} color={"#AAAAAA"} className="m-2" />
          </IconButton>
        </div>
      </div>          
      
      <div className="carousel px-5 pb-5 mt-[7vh] ">  {/* overflow-hidden */}
        <BsArrowLeftCircleFill className="arrow arrow-left" onClick={prevSlide} />

        {slides.map((item, idx) => {
          return (
            <div key={idx} className={`${slide === idx ? "slide" : "slide slide-hidden"} w-full h-full`} 
              style={{
              minHeight: "90vh",
              }}
            >
              <>
                <div className="w-full flex items-center py-2">
                  <div className="bg-[#DA1F26] h-10 w-2 rounded-full mr-2 my-1"></div>
                  <h1
                    className={`text-xl font-semibold ${
                      currentMode === "dark"
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {item.heading}
                  </h1>
                </div>

                {/* CALL LOGS  */}
                {item.heading === "CALL LOGS" ? (
                  <>
                    {loading ? (
                      <Loader />
                    ) : (
                      <>
                        <div
                          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-3 "
                        >
                          {noData === false &&
                            callLogs?.length > 0 &&
                            callLogs?.map((call, index) => {
                              return (
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#000000]"
                                      : "bg-[#FFFFFF]"
                                  } p-3 rounded-lg shadow-md space-y-2`}
                                >
                                  <div className="px-1 mb-2 font-bold text-xl text-center text-main-red-color">
                                    {call?.userName}
                                  </div>
                                  
                                  <div
                                    className={`
                                    ${
                                      currentMode === "dark"
                                        ? "bg-[#1C1C1C]"
                                        : "bg-[#f6f6f6]"
                                    } 
                                    border-[#AAAAAA] border
                                    rounded-md shadow-sm p-2`}
                                  >
                                    <h6 className="mb-1 text-center text-lg font-semibold">
                                      Outgoing
                                    </h6>
                                    <hr></hr>
                                    <div className="block gap-3 mt-2">
                                      <div>
                                        <h1 className="text-lg">
                                          DIALED&nbsp;
                                          <span
                                            className="font-bold float-right"
                                            style={{ color: "#000000" }}
                                          >
                                            {call?.dialed || 0} 
                                          </span>
                                        </h1>
                                      </div>
                                      <div>
                                        <h1 className="text-lg">
                                          ANSWERED&nbsp;
                                          <span
                                            className="font-bold float-right"
                                            style={{ color: "#00A67D" }}
                                          >
                                            {call?.answered || 0}
                                          </span>
                                        </h1>
                                      </div>
                                      <div>
                                        <h1 className="text-lg">
                                          NOT ANSWERED&nbsp;
                                          <span
                                            className="font-bold float-right"
                                            style={{ color: "#DF2938" }}
                                          >
                                            {call?.notanswered || 0}
                                          </span>
                                        </h1>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={`
                                    ${
                                      currentMode === "dark"
                                        ? "bg-[#1C1C1C]"
                                        : "bg-[#f6f6f6]"
                                    } 
                                    border-[#AAAAAA] border
                                    rounded-md shadow-sm p-2`}
                                  >
                                    <h6 className="mb-1 text-center text-lg font-semibold">
                                      Incoming
                                    </h6>
                                    <hr></hr>
                                    <div className="block gap-3 mt-2">
                                      <div>
                                        <h1 className="text-lg">
                                          RECEIVED&nbsp;
                                          <span
                                            className="font-bold float-right"
                                            style={{ color: "#00A67D" }}
                                          >
                                            {call.received || 0}
                                          </span>
                                        </h1>
                                      </div>
                                      <div>
                                        <h1 className="text-lg">
                                          MISSED&nbsp;
                                          <span
                                            className="font-bold float-right"
                                            style={{ color: "#DF2938" }}
                                          >
                                            {call.missed || 0}
                                          </span>
                                        </h1>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                        {noData === true && (
                          <div className="flex flex-col items-center justify-center h-[80vh] ">
                            <img
                              src="./no_data.png"
                              alt="No data Illustration"
                              className="w-[500px] h-[500px] object-cover"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : item.heading === "TARGET" ? (
                  <>
                    {/* {loading ? (
                      <Loader />
                    ) : (
                      <> */}
                        <div
                          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-3 pb-3 "
                        >
                          {target.map(index => {
                            return (
                              <div
                                className={`${
                                  currentMode === "dark"
                                    ? "bg-[#000000]"
                                    : "bg-[#FFFFFF]"
                                } p-3 rounded-lg shadow-md space-y-2`}
                              >
                                <div className="mb-2 flex">
                                  <div>
                                    <img
                                      src={
                                        // User?.displayImg
                                        //   ? User?.displayImg
                                          // : 
                                          "/assets/user.png"
                                      }
                                      height={80}
                                      width={80}
                                      className={`rounded-lg object-cover relative mr-3`}
                                      alt=""
                                    />
                                  </div>
                                  <div className="space-y-2 p-1">
                                    <div className="font-semibold text-main-red-color">{index.userName}</div>
                                    <div className="grid grid-cols-8 flex items-center">
                                      <div className="flex items-center justify-center bg-[#EEEEEE] rounded-full w-8 h-8 mr-2">
                                        <BsFillBookmarkStarFill size={20} color={"#777777"} className="p-1" />
                                      </div>
                                      <div className="col-span-7">
                                        <span className="font-bold">{index.booked}</span>{" "}booked
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-8 flex items-center">
                                      <div className="flex items-center justify-center bg-[#EEEEEE] rounded-full w-8 h-8 mr-2">
                                        <BsFillLockFill size={20} color={"#777777"} className="p-1" />
                                      </div>
                                      <div className="col-span-7">
                                        <span className="font-bold">{index.month_closed}</span>{" "}deals in {monthNames[d.getMonth()]}{" "}
                                        /{" "}
                                        <span className="font-bold">{index.total_closed}</span>{" "}deals{" "}
                                      </div>
                                    </div>
                                    <div></div>
                                  </div>
                                </div>
                                <ProgressBar bgcolor="#DA1F26" progress={(index.month_closed_amount / index.target * 100).toFixed(1)} height="30" />
                              </div>
                            )
                          })}
                        </div>
                        {noData === true && (
                          <div className="flex flex-col items-center justify-center h-[80vh] ">
                            <img
                              src="./no_data.png"
                              alt="No data Illustration"
                              className="w-[500px] h-[500px] object-cover"
                            />
                          </div>
                        )}
                      {/* </>
                    )} */}
                  </>
                ) : (
                  <></>
                )}
              </>
          </div>
          )
        })}
        <BsArrowRightCircleFill className="arrow arrow-right" onClick={nextSlide} />
      </div>


    </div>
  );
};
export default TodayCallLogs;
