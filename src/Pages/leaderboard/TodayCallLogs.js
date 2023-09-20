import { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { socket } from "../App";
import { BsArrowsFullscreen } from "react-icons/bs";
import Loader from "../../Components/Loader";
import { IconButton } from "@mui/material";
const TodayCallLogs = () => {
  const [noData, setNoData] = useState(false);
  const [callLogs, setCallLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentMode, User } = useStateContext();
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
    <div style={{ height: "96vh" }}>
      <div>
        <div
          className="flex justify-between items-center p-2 relative w-full"
          style={{
            position: "fixed",
            top: 0,
            // left: 0,
            right: 0,
            zIndex: "20",
            backgroundColor:
              currentMode === "dark" ? "black" : "rgb(229 231 235)",
            boxShadow:
              currentMode !== "dark" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          <div className="flex items-center">
            <div className="flex items-center rounded-lg pl-1 cursor-pointer">
              <a href="/dashboard">
                <img className="w-[70px]" src="/assets/blackLogo.png" alt="" />
              </a>
            </div>
          </div>
          <div>
            <h1
              style={{ fontSize: 24 }}
              className={`${
                currentMode === "dark" ? "text-white" : "text-primary"
              } font-bold`}
            >
              Calls Count Today
            </h1>
          </div>
          <IconButton onClick={() => requestFullScreen(document.body)}>
            <BsArrowsFullscreen size={18} />
          </IconButton>
        </div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{ display: "block" }}
          className="pt-24 px-5 overflow-hidden"
        >
          {/* <div className="flex mb-5 justify-center px-3 rounded h-[125px] items-center bg-[#e5e7eb]">
            <h1
              style={{ fontSize: 32 }}
              className={`${
                currentMode === "dark" ? "text-white" : "text-[#da1f26]"
              } font-bold`}
            >
              Today Call logs
            </h1>
          </div> */}
          <>
            <div
              style={{ fontSize: "110%" }}
              className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-3 "
            >
              {noData === false &&
                callLogs?.length > 0 &&
                callLogs?.map((call, index) => {
                  return (
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-[#1c1c1c] text-white"
                          : "bg-gray-200 text-black"
                      } p-3 rounded-md`}
                    >
                      <div className="grid gap-3 rounded-md px-2 mb-2">
                        <h5 className="font-bold text-lg text-primary col-span-5">
                          {call?.userName}
                        </h5>
                      </div>
                      <div className="grid gap-3">
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } rounded-md p-2`}
                        >
                          <h6 className="mb-1 text-center text-md font-semibold">
                            Outgoing
                          </h6>
                          <hr></hr>
                          <div className="block gap-3 mt-2">
                            <div>
                              <h1 className="text-lg">
                                DIALED&nbsp;
                                <span
                                  className="font-semibold float-right"
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
                                  className="font-semibold float-right"
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
                                  className="font-semibold float-right"
                                  style={{ color: "#DF2938" }}
                                >
                                  {call?.notanswered || 0}
                                </span>
                              </h1>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-black text-white"
                              : "bg-white text-black"
                          } rounded-md p-2`}
                        >
                          <h6 className="mb-1 text-center text-md font-semibold">
                            Incoming
                          </h6>
                          <hr></hr>
                          <div className="block gap-3 mt-2">
                            <div>
                              <h1 className="text-lg">
                                RECEIVED&nbsp;
                                <span
                                  className="font-semibold float-right"
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
                                  className="font-semibold float-right"
                                  style={{ color: "#DF2938" }}
                                >
                                  {call.missed || 0}
                                </span>
                              </h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {noData === true && (
              <div className="flex flex-col items-center justify-center h-[80vh] ">
                <img
                  src="./no_data.png"
                  alt="No data Illustration"
                  className="w-[600px] h-[600px] object-cover"
                />
              </div>
            )}
          </>
        </div>
      )}
      ;
    </div>
  );
};
export default TodayCallLogs;
