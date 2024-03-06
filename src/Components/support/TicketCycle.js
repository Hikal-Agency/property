import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Error from "../../Pages/Error";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import { Backdrop, Modal } from "@mui/material";
import { datetimeLong } from "../../Components/_elements/formatDateTime";

import { BiBed, BiCalendarExclamation } from "react-icons/bi";
import {
  BsTelephone,
  BsBuildings,
  BsBookmarkCheckFill,
  BsClockFill,
  BsFlagFill,
} from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { HiUser } from "react-icons/hi";
import { MdNoteAlt, MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const TicketCycle = ({ ticketCycle, setTicketCycle }) => {
  const {
    currentMode,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [leadsCycle, setLeadsCycle] = useState(null);
  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ticketCycleData, setTicketCycleData] = useState(true);
  const navigate = useNavigate();

  const [isClosing, setIsClosing] = useState(false);

  console.log("ticket cycle::: ", ticketCycle);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setTicketCycle(false);
    }, 1000);
  };

  const fetchLeadsData = async (token, ticketID) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/ticketcycles/${ticketID}`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = response?.data?.ticketcycle;

      console.log("ticketcycle response:: ", data);
      setTicketCycleData(data);
      setLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Unable to fetch ticketcycle.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      setError404(true);
    }
  };

  useEffect(() => {
    const ticketID = ticketCycle?.id;
    const token = localStorage.getItem("auth-token");
    if (!ticketID) {
      navigate(`/support`);
      return;
    }
    fetchLeadsData(token, ticketID);
    //eslint-disable-next-line
  }, []);

  function groupLeadsByDate(leads) {
    const groups = {};
    leads.forEach((lead) => {
      let date;
      if (lead.CreationDate) date = (lead.CreationDate + " ").split(" ")[0];
      else date = (lead.creationDate + " ").split(" ")[0];

      if (groups[date]) {
        groups[date].push(lead);
      } else {
        groups[date] = [lead];
      }
    });

    let grouped = Object.keys(groups).map((date) => {
      return {
        date: date,
        leads: groups[date],
      };
    });

    grouped = grouped.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    grouped = grouped.map((obj) => {
      const sortedLeads = obj.leads.sort((a, b) => {
        return new Date(b.CreationDate) - new Date(a.CreationDate);
      });
      // return the sorted leads array as part of a new object with the same date
      return { date: obj.date, leads: sortedLeads };
    });

    console.log(grouped);
    return grouped;
  }

  return (
    <>
      <Modal
        keepMounted
        open={ticketCycle}
        onClose={handleClose}
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
        w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
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
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } 
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
          >
            <div className={`w-full`}>
              {error404 ? (
                <Error />
              ) : (
                <div className="">
                  <div className="w-full flex items-center pb-3 ">
                    <div className="bg-primary h-10 w-1 rounded-full"></div>
                    <h1
                      className={`text-lg font-semibold mx-2 uppercase ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {t("ticket_history")}
                    </h1>
                  </div>

                  <div>
                    <div
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } p-4 `}
                    >
                      <div className="grid sm:grid-cols-12 gap-1">
                        <div className="relative col-span-12 space-y-6 md:col-span-8 w-full">
                          <div className="flex flex-col md:grid grid-cols-12 w-full">
                            {loading ? (
                              <div className="flex items-center justify-center w-full">
                                <h1 className="font-semibold text-lg">
                                  Loading
                                </h1>
                              </div>
                            ) : (
                              <>
                                <div
                                  className={`${
                                    isLangRTL(i18n.language) ? "ml-3" : "mr-3"
                                  } col-start-1 col-end-3 md:mx-auto relative`}
                                >
                                  {/* <div className="h-full w-6 flex items-center justify-center">
                                          <div
                                            className={`h-full border-b-[${primaryColor}] rounded-xl shadow-sm px-2 py-1 text-sm`}
                                            style={{
                                              width: "min-content",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {timeline.date}
                                          </div>
                                        </div> */}
                                </div>
                                {ticketCycleData?.map((timeline, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="flex md:contents"
                                    >
                                      {/* TICKET NOTE  */}
                                      {timeline?.note == 1 ? (
                                        <>
                                          <div
                                            className={`${
                                              isLangRTL(i18n.language)
                                                ? "ml-3"
                                                : "mr-3"
                                            } col-start-1 col-end-3 md:mx-auto relative`}
                                          >
                                            <div className="h-full w-6 flex items-center justify-center">
                                              <div className="h-full w-1 bg-[#AAA] pointer-events-none"></div>
                                            </div>
                                            <div
                                              className={`${
                                                isLangRTL(i18n.language)
                                                  ? "-mr-2"
                                                  : "-ml-2"
                                              } absolute top-1/2 -mt-5 text-center bg-primary rounded-full p-2`}
                                            >
                                              <MdNoteAlt
                                                className="text-white"
                                                size={16}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={`${
                                              currentMode === "dark"
                                                ? "bg-[#1C1C1C]"
                                                : "bg-[#EEEEEE]"
                                            } p-4 space-y-3 rounded-xl shadow-sm card-hover md:col-start-3 col-start-2 col-end-13 my-2 w-full`}
                                          >
                                            {/* ADDED BY  */}
                                            <p className="text-sm tracking-wide font-italic justify-end gap-2 flex items-center text-[#AAAAAA]">
                                              <HiUser size={12} />
                                              {timeline?.added_by_name}
                                            </p>
                                            {/* TICKET NOTE  */}
                                            <p
                                              className="font-semibold tracking-wide mb-2"
                                              style={{
                                                fontFamily: isArabic(
                                                  timeline.leadNote
                                                )
                                                  ? "Noto Kufi Arabic"
                                                  : "inherit",
                                              }}
                                            >
                                              {timeline?.description}
                                            </p>
                                            {/* FEEDBACK 
                                                  {timeline?.feedback &&
                                                  timeline.feedback !== "0" && (
                                                    <p className="font-semibold tracking-wide">
                                                      Feedback updated to{" "}
                                                      <span className="font-bold text-primary">
                                                        {timeline.feedback}
                                                      </span>.
                                                    </p>
                                                  )} */}
                                            {/* CREATION DATE  */}
                                            <p className="text-sm tracking-wide uppercase text-[#AAAAAA]">
                                              {datetimeLong(
                                                timeline?.created_at
                                              )}
                                            </p>
                                          </div>
                                        </>
                                      ) : // STATUS
                                      timeline?.status != null ? (
                                        <>
                                          <div
                                            className={`${
                                              isLangRTL(i18n.language)
                                                ? "ml-3"
                                                : "mr-3"
                                            } col-start-1 col-end-3 md:mx-auto relative`}
                                          >
                                            <div className="h-full w-6 flex items-center justify-center">
                                              <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                            </div>
                                            <div
                                              className={`${
                                                isLangRTL(i18n.language)
                                                  ? "-mr-2"
                                                  : "-ml-2"
                                              } absolute top-1/2 -mt-5 text-center bg-primary rounded-full p-2`}
                                            >
                                              <FaUserCheck
                                                className="text-white"
                                                size={16}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={`${
                                              currentMode === "dark"
                                                ? "bg-[#1C1C1C]"
                                                : "bg-[#EEEEEE]"
                                            } p-4 space-y-3 rounded-xl shadow-sm card-hover md:col-start-3 col-start-2 col-end-13 my-2 w-full`}
                                            // style={{
                                            //   transform:
                                            //     "translateX(-30px)",
                                            // }}
                                          >
                                            {/* ADDED BY */}
                                            <p className="text-sm tracking-wide text-[#AAAAAA] font-italic justify-end flex items-center gap-2">
                                              <HiUser size={12} />
                                              {timeline?.added_by_name}
                                            </p>
                                            {/* STATUS  */}
                                            <p className="font-semibold tracking-wide">
                                              {t("ticketCycle_ticket_status")}{" "}
                                              <span className="font-bold text-primary">
                                                {timeline?.status}
                                              </span>
                                              .
                                            </p>
                                            {/* CREATION DATE  */}
                                            <p className="text-sm tracking-wide uppercase text-[#AAAAAA]">
                                              {datetimeLong(
                                                timeline.created_at
                                              )}
                                            </p>
                                          </div>
                                        </>
                                      ) : // SUPPORT PERSON
                                      timeline?.user_id != null ? (
                                        <>
                                          <div
                                            className={`${
                                              isLangRTL(i18n.language)
                                                ? "ml-2"
                                                : "mr-2"
                                            } col-start-1 col-end-3 md:mx-auto relative`}
                                          >
                                            <div className="h-full w-6 flex items-center justify-center">
                                              <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                            </div>
                                            <div
                                              className={`${
                                                isLangRTL(i18n.language)
                                                  ? "-mr-2"
                                                  : "-ml-2"
                                              } absolute top-1/2 -mt-5 text-center bg-primary rounded-full p-2`}
                                            >
                                              <FaUserCheck
                                                className="text-white"
                                                size={16}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={`${
                                              currentMode === "dark"
                                                ? "bg-[#1C1C1C]"
                                                : "bg-[#EEEEEE]"
                                            } p-4 space-y-3 rounded-xl shadow-sm card-hover md:col-start-3 col-start-2 col-end-13 my-2 w-full`}
                                            // style={{
                                            //   transform:
                                            //     "translateX(-30px)",
                                            // }}
                                          >
                                            {/* ADDED BY  */}
                                            <p className="text-sm tracking-wide font-italic gap-2 text-[#AAAAAA] justify-end flex items-center">
                                              <HiUser size={12} />
                                              {timeline?.added_by_name}
                                            </p>
                                            {/* SUPPORT PERSON  */}
                                            <p className="font-semibold tracking-wide">
                                              {timeline?.description} .
                                            </p>
                                            {/* CREATION DATE  */}
                                            <p className="text-sm tracking-wide uppercase text-[#AAAAAA]">
                                              {datetimeLong(
                                                timeline.created_at
                                              )}
                                            </p>
                                          </div>
                                        </>
                                      ) : // FEEDBACK
                                      timeline?.user_id == null &&
                                        timeline?.status == null &&
                                        timeline?.note == null ? (
                                        <>
                                          <div
                                            className={`${
                                              isLangRTL(i18n.language)
                                                ? "ml-3"
                                                : "mr-3"
                                            } col-start-1 col-end-3 md:mx-auto relative`}
                                          >
                                            <div className="h-full w-6 flex items-center justify-center">
                                              <div className="h-full w-1 bg-[#AAAAAA] pointer-events-none"></div>
                                            </div>
                                            <div
                                              className={`${
                                                isLangRTL(i18n.language)
                                                  ? "-mr-2"
                                                  : "-ml-2"
                                              } absolute top-1/2 -mt-5 text-center bg-primary rounded-full p-2`}
                                            >
                                              <BsBookmarkCheckFill
                                                className="text-white"
                                                size={16}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={`${
                                              currentMode === "dark"
                                                ? "bg-[#1C1C1C]"
                                                : "bg-[#EEEEEE]"
                                            } p-4 space-y-3 rounded-xl shadow-sm card-hover md:col-start-3 col-start-2 col-end-13 my-2 w-full`}
                                            // style={{
                                            //   transform:
                                            //     "translateX(-30px)",
                                            // }}
                                          >
                                            {/* ADDED BY  */}
                                            <p className="text-sm tracking-wide gap-2 text-[#AAAAAA] font-italic justify-end flex items-center">
                                              <HiUser size={12} />
                                              {timeline?.added_by_name}
                                            </p>
                                            {/* NEW TICKET  */}
                                            <p className="font-semibold tracking-wide">
                                              {ticketCycle?.description}.
                                            </p>
                                            {/* CREATION DATE  */}
                                            <p className="text-sm tracking-wide uppercase text-[#AAAAAA]">
                                              {datetimeLong(
                                                timeline.created_at
                                              )}
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default TicketCycle;
