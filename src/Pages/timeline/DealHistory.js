import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Error from "../Error";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import { Backdrop, Box, Modal, Pagination, Stack } from "@mui/material";
import { datetimeLong } from "../../Components/_elements/formatDateTime";

import { BiBed, BiCalendarExclamation } from "react-icons/bi";
import {
  BsTelephone,
  BsBuildings,
  BsBookmarkCheckFill,
  BsClockFill,
  BsFlagFill,
} from "react-icons/bs";
import { FaCheck, FaPlus, FaUserCheck } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import { HiUser } from "react-icons/hi";
import { MdNoteAlt, MdClose } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import CommissionModal from "./CommissionModal";
import AddTransactionsModal from "../../Components/Transactions/AddTransactionsModal";
import { toast } from "react-toastify";
import SingleTransImage from "./SingleTransImage";
import usePermission from "../../utils/usePermission";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const DealHistory = ({
  LeadData,
  handleCloseDealHistory,
  dealHistoryModel,
}) => {
  const {
    currentMode,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
  } = useStateContext();
  const { hasPermission } = usePermission();
  const [leadsCycle, setLeadsCycle] = useState(null);
  const [commissionModal, setCommissionModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [imageModal, setOpenImageModal] = useState(false);
  const [addTransactionModal, setAddTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  console.log("lead Data:: ", LeadData);
  console.log("deal history modal: ", dealHistoryModel);

  const handleCommissionModalOpen = (invoice) => {
    console.log("open invoice", invoice);
    if (invoice) {
      setInvoiceModal(LeadData);
    }
    setCommissionModal(LeadData);
  };

  const handleTransactionModalOpen = () => {
    setAddTransactionModal(LeadData);
  };

  const statuses = [
    {
      text: t("pdc"),
      icon:
        LeadData?.pdc_status === 1 ? (
          <FaCheck size={16} color="white" />
        ) : (
          <RxCross2 size={16} color="white" />
        ),
      bgColor: LeadData?.pdc_status === 1 ? "green" : "#FF0000",
    },
    {
      text: t("spa"),
      icon:
        LeadData?.spa_status === 1 ? (
          <FaCheck size={16} color="white" />
        ) : (
          <RxCross2 size={16} color="white" />
        ),
      bgColor: LeadData?.spa_status === 1 ? "green" : "#FF0000",
    },
    {
      text: t("commission"),
      icon:
        LeadData?.comm_status === 1 ? (
          <FaCheck size={16} color="white" />
        ) : (
          <RxCross2 size={16} color="white" />
        ),
      bgColor: LeadData?.comm_status === 1 ? "green" : "#FF0000",
      type: "commission",
    },
  ];

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseDealHistory();
    }, 1000);
  };

  const ribbonStyles = {
    width: "100px",
    height: "30px",
    filter: "grayscale(0) !important",
    lineHeight: "52px",
    position: "absolute",
    top: "20px",
    right: "-30px",
    color: "white",
    zIndex: 2,
    overflow: "hidden",
    transform: "rotate(45deg)",
    boxShadow: `0 0 0 3px ${primaryColor}, 0px 21px 5px -18px rgba(0,0,0,0.6)`,
    background: primaryColor,
    textAlign: "center",

    "& .wrap": {
      width: "100%",
      height: "188px",
      position: "absolute",
      top: "-8px",
      left: "8px",
      overflow: "hidden",
    },
    "& .wrap:before, .wrap:after": {
      content: "''",
      position: "absolute",
    },
    "& .wrap:before": {
      width: "40px",
      height: "8px",
      right: "100px",
      background: "#4D6530",
      borderRadius: "8px 8px 0px 0px",
    },
    "& .wrap:after": {
      width: "8px",
      height: "40px",
      right: "0px",
      top: "100px",
      background: "#4D6530",
      borderRadius: "0px 8px 8px 0px",
    },
  };

  const token = localStorage.getItem("auth-token");

  const fetchLeadsData = async (LeadID) => {
    const urlLeadsCycle = `${BACKEND_URL}/deal-history`;
    try {
      const leadsCycleResult = await axios.get(urlLeadsCycle, {
        params: { deal_id: LeadData?.lid },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("deal history::: ", leadsCycleResult);
      setLeadsCycle(leadsCycleResult?.data?.data?.history?.data);
      setMaxPage(leadsCycleResult?.data?.data?.history?.last_page);
      setTransactions(leadsCycleResult?.data?.data?.spa);
      setLoading(false);
    } catch (error) {
      console.log(error);

      toast.error("Unable to fetch the deal history", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setError404(true);
    }
  };

  useEffect(() => {
    const LeadID = LeadData?.leadId;
    const token = localStorage.getItem("auth-token");
    if (!LeadID) {
      navigate(`/closedeals`);
      return;
    }
    fetchLeadsData(token, LeadID);
    //eslint-disable-next-line
  }, []);

  function groupLeadsByDate(leads) {
    console.log("leads in groupbydate: ", leads);
    const groups = {};
    leads?.forEach((lead) => {
      let date;
      if (lead.created_at) date = (lead.created_at + " ").split(" ")[0];
      else date = (lead.created_at + " ").split(" ")[0];

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
        return new Date(b.created_at) - new Date(a.created_at);
      });
      // return the sorted leads array as part of a new object with the same date
      return { date: obj.date, leads: sortedLeads };
    });

    console.log("Grouped::: ", grouped);
    return grouped;
  }

  return (
    <>
      <Modal
        keepMounted
        open={dealHistoryModel}
        // onClose={handleCloseDealHistory}
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
            // onClick={handleCloseDealHistory}
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
                  <div className="w-full flex items-center justify-between pb-3 ">
                    <div className="flex items-center ">
                      <div className="bg-primary h-10 w-1 rounded-full"></div>
                      <h1
                        className={`text-lg font-semibold mx-2 uppercase ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {t("deal_history")}
                      </h1>
                    </div>
                    <div>
                      {hasPermission("view_invoice") && (
                        <button
                          onClick={() => handleCommissionModalOpen("invoice")}
                          className="bg-btn-primary rounded-md py-2 px-4 text-white"
                        >
                          {t("btn_view_invoice")}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } p-4 `}
                    >
                      <div className="grid sm:grid-cols-12 gap-1">
                        <div className="col-span-12 md:col-span-4 w-full">
                          {loading ? (
                            <div className="flex items-center justify-center w-full">
                              <h1 className="font-semibold text-lg">Loading</h1>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-sm text-center font-semibold uppercase mb-5">
                                {t("status")}
                              </h3>
                              <div className="w-full flex items-center justify-center  space-x-2 mb-4">
                                {statuses?.map((status) => {
                                  return (
                                    <div
                                      className={`${
                                        currentMode === "dark"
                                          ? "bg-[#1C1C1C]"
                                          : "bg-[#EEEEEE]"
                                      } py-4 px-9 rounded-md ${
                                        status?.type === "commission" &&
                                        hasPermission("add_commission")
                                          ? "cursor-pointer"
                                          : null
                                      } `}
                                      onClick={
                                        status?.type === "commission" &&
                                        hasPermission("add_commission")
                                          ? () => handleCommissionModalOpen()
                                          : undefined
                                      }
                                    >
                                      <p
                                        className={`
                    bg-[${status?.bgColor}]
                rounded-full shadow-none p-1.5 mr-1 flex items-center mb-3`}
                                      >
                                        {status?.icon}
                                      </p>
                                      <p>{status?.text}</p>
                                    </div>
                                  );
                                })}
                              </div>

                              {hasPermission("add_deal_spa") && (
                                <>
                                  <div className="flex items-center justify-between  flex-row">
                                    <h3 className="text-sm  font-semibold uppercase mb-5 mt-3">
                                      {t("transactions")}
                                    </h3>

                                    <div>
                                      <button
                                        className="bg-btn-primary rounded-full p-2"
                                        onClick={handleTransactionModalOpen}
                                      >
                                        <FaPlus color="white" />
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}

                              {hasPermission("deal_spa") && (
                                <>
                                  {transactions?.map((spa) => (
                                    <div
                                      className={`${
                                        currentMode === "dark"
                                          ? "bg-[#1C1C1C]"
                                          : "bg-[#EEEEEE]"
                                      } p-4 space-y-3 rounded-xl shadow-sm card-hover md:col-start-3 col-start-2 col-end-13 my-2 w-full relative`}
                                    >
                                      <>
                                        <Box sx={{ ...ribbonStyles }}>
                                          <div className="wrap">
                                            <span>{spa?.type}</span>
                                          </div>
                                        </Box>
                                        <div className="flex items-center justify-between mt-5">
                                          <div>
                                            <div className="flex gap-2 my-3">
                                              <p>{t("percentage")}:</p>
                                              <div>
                                                <p className="font-semibold ml-2">
                                                  {spa?.percent}%
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex gap-2 my-3">
                                              <p>{t("label_amount")}:</p>
                                              <div>
                                                <p className="font-semibold ml-2">
                                                  {spa?.currency} {spa?.amount}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex gap-2 my-3">
                                              <p>{t("date")}:</p>
                                              <div>
                                                <p className="font-semibold ml-2">
                                                  {spa?.dealDate}
                                                </p>
                                              </div>
                                            </div>

                                            <div className="flex gap-2 my-3">
                                              <p>{t("label_added_by")}:</p>
                                              <div>
                                                <p className="font-semibold ml-2">
                                                  {spa?.added_by_name}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                          {spa?.image && (
                                            <div
                                              className="rounded-md border cursor-pointer"
                                              onClick={(e) =>
                                                setOpenImageModal(spa)
                                              }
                                            >
                                              <img
                                                src={spa?.image}
                                                width="100px"
                                                height="100px"
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    </div>
                                  ))}
                                </>
                              )}
                            </>
                          )}
                        </div>

                        <div className="relative col-span-12 space-y-6 md:col-span-8 w-full">
                          <div className="flex flex-col md:grid grid-cols-12 w-full">
                            {loading ? (
                              <div className="flex items-center justify-center w-full">
                                <h1 className="font-semibold text-lg">
                                  Loading
                                </h1>
                              </div>
                            ) : (
                              groupLeadsByDate(leadsCycle)?.map(
                                (timeline, index) => {
                                  console.log("timeline:: ", timeline);
                                  return (
                                    <>
                                      <div
                                        className={`${
                                          isLangRTL(i18n.language)
                                            ? "ml-3"
                                            : "mr-3"
                                        } col-start-1 col-end-3 md:mx-auto relative`}
                                      >
                                        <div className="h-full w-6 flex items-center justify-center">
                                          <div
                                            className={`h-full border-b-[${primaryColor}] rounded-xl shadow-sm px-2 py-1 text-sm`}
                                            style={{
                                              width: "min-content",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {/* {timeline.date} */}
                                          </div>
                                        </div>
                                      </div>
                                      {timeline?.leads.map(
                                        (timeline, index) => {
                                          return (
                                            <div
                                              key={index}
                                              className="flex md:contents"
                                            >
                                              {/* LEAD NOTE  */}
                                              {timeline.note ? (
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
                                                    {/* LEAD NOTE  */}
                                                    <p
                                                      className="font-semibold tracking-wide mb-2"
                                                      style={{
                                                        fontFamily: isArabic(
                                                          timeline?.note
                                                        )
                                                          ? "Noto Kufi Arabic"
                                                          : "inherit",
                                                      }}
                                                    >
                                                      {timeline?.note}
                                                    </p>

                                                    {/* CREATION DATE  */}
                                                    <p className="text-sm tracking-wide uppercase text-[#AAAAAA]">
                                                      {datetimeLong(
                                                        timeline.created_at
                                                      )}
                                                    </p>
                                                  </div>
                                                </>
                                              ) : // MANAGER
                                              timeline.manager &&
                                                timeline.manager !== "0" ? (
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
                                                    {/* ADDED BY  */}
                                                    <p className="text-sm tracking-wide text-[#AAAAAA] font-italic justify-end flex items-center gap-2">
                                                      <HiUser size={12} />
                                                      {timeline.addedBy}
                                                    </p>
                                                    {/* AGENT  */}
                                                    <p className="font-semibold tracking-wide">
                                                      {t(
                                                        "salesmanager_updated_to"
                                                      )}{" "}
                                                      <span className="font-bold text-primary">
                                                        {timeline.manager}
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
                                              ) : // SALESPERSON
                                              timeline.agent &&
                                                timeline.agent !== "0" ? (
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
                                                      {timeline.addedBy}
                                                    </p>
                                                    {/* AGENT  */}
                                                    <p className="font-semibold tracking-wide">
                                                      {t(
                                                        "salesagent_updated_to"
                                                      )}{" "}
                                                      <span className="font-bold text-primary">
                                                        {timeline.agent}
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
                                              ) : // FEEDBACK
                                              timeline.feedback &&
                                                timeline.feedback !== "0" ? (
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
                                                      {timeline.addedBy}
                                                    </p>
                                                    {/* FEEDBACK  */}
                                                    <p className="font-semibold tracking-wide">
                                                      {t("feedback_updated_to")}{" "}
                                                      <span className="font-bold text-primary">
                                                        {timeline.feedback}
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
                                              ) : // MEETING STATUS
                                              timeline.meetingStatus &&
                                                timeline.meetingStatus !==
                                                  "0" ? (
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
                                                      <BiCalendarExclamation
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
                                                      {timeline.addedBy}
                                                    </p>
                                                    {/* FEEDBACK  */}
                                                    <p className="font-semibold tracking-wide">
                                                      {t(
                                                        "meeting_status_updated_to"
                                                      )}{" "}
                                                      <span className="font-bold text-primary">
                                                        {timeline.meetingStatus}
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
                                              ) : // MEETING DATE TIME
                                              timeline.meetingDate &&
                                                timeline.meetingDate !== "0" ? (
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
                                                      <BsClockFill
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
                                                      {timeline.addedBy}
                                                    </p>
                                                    {/* FEEDBACK  */}
                                                    <p className="font-semibold tracking-wide">
                                                      {t("meeting_set_to")}{" "}
                                                      <span className="font-bold text-primary">
                                                        {!timeline.meetingTime ||
                                                        timeline.meetingTime ===
                                                          ""
                                                          ? ""
                                                          : `${timeline.meetingTime}, `}{" "}
                                                        {(timeline.meetingDate ||
                                                          timeline.meetingDate !==
                                                            "") &&
                                                          moment(
                                                            timeline.meetingDate
                                                          ).format("MMMM D, Y")}
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
                                              ) : (
                                                <></>
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </>
                                  );
                                }
                              )
                            )}
                          </div>
                          <Stack spacing={2} marginTop={2}>
                            <Pagination
                              count={maxPage}
                              color={
                                currentMode === "dark" ? "primary" : "secondary"
                              }
                              onChange={(value) => setPage(value)}
                              style={{ margin: "auto" }}
                              page={page}
                              sx={{
                                "& .Mui-selected": {
                                  color: "white !important",
                                  backgroundColor: `${primaryColor} !important`,
                                  "&:hover": {
                                    backgroundColor:
                                      currentMode === "dark"
                                        ? "black"
                                        : "white",
                                  },
                                },
                                "& .MuiPaginationItem-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                              }}
                            />
                          </Stack>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {commissionModal && (
              <CommissionModal
                commissionModal={commissionModal}
                setCommissionModal={setCommissionModal}
                handleCloseCommissionModal={() => {
                  setCommissionModal(false);
                  setInvoiceModal(false);
                }}
                invoiceModal={invoiceModal}
              />
            )}
            {addTransactionModal && (
              <AddTransactionsModal
                addTransactionModal={addTransactionModal}
                setAddTransactionModal={setAddTransactionModal}
                handleCloseTransactionModal={() =>
                  setAddTransactionModal(false)
                }
                fetchLeadsData={fetchLeadsData}
              />
            )}
            {imageModal && (
              <SingleTransImage
                imageModal={imageModal}
                setOpenImageModal={setOpenImageModal}
                handleCloseTransactionModal={() => setOpenImageModal(false)}
              />
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DealHistory;
