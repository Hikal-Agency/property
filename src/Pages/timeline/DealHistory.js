import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Error from "../Error";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import {
  Backdrop,
  TextField,
  Modal,
  Pagination,
  Stack,
  Box,
  Dialog,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { datetimeLong } from "../../Components/_elements/formatDateTime";
import { IoIosAlert, IoMdClose } from "react-icons/io";

import { BiCalendarExclamation } from "react-icons/bi";
import {
  BsBookmarkCheckFill,
  BsClockFill,
  BsFileEarmarkMedical,
  BsCheck2All,
  BsPencil,
} from "react-icons/bs";
import { FaCheck, FaPlus, FaUserCheck } from "react-icons/fa";
import { HiUser } from "react-icons/hi";
import { MdNoteAlt, MdClose } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import CommissionModal from "./CommissionModal";
import AddTransactionsModal from "../../Components/Transactions/AddTransactionsModal";
import { toast } from "react-toastify";
import SingleTransImage from "./SingleTransImage";
import usePermission from "../../utils/usePermission";
import OverlayFile from "../../Components/_elements/OverlayFile";
import { Tooltip, dialog } from "@material-tailwind/react";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const DealHistory = ({
  LeadData,
  handleCloseDealHistory,
  dealHistoryModel,
  FetchLeads,
}) => {
  const {
    currentMode,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    darkModeColors,
  } = useStateContext();
  const { hasPermission } = usePermission();
  const [leadsCycle, setLeadsCycle] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [commissionModal, setCommissionModal] = useState(false);
  const [invoiceModal, setInvoiceModal] = useState(false);
  const [imageModal, setOpenImageModal] = useState(false);
  const [addTransactionModal, setAddTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(true);
  const [maxPage, setMaxPage] = useState(0);
  const [DialogueVal, setDialogue] = useState(false);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const [showOverlayPdf, setShowOverlayPdf] = useState(false);
  const [showOverlayImage, setShowOverlayImage] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);
  const [btnloading, setBtnLoading] = useState(false);

  const [dealNote, setDealNote] = useState("");

  const handleImageClick = (image) => {
    setOverlayContent(image);
    console.log("OVERLAY IMAGE ========= ", overlayContent);
    setShowOverlayPdf(false);
    setShowOverlayImage(true);
  };

  const handlePdfClick = (pdf) => {
    setOverlayContent(pdf);
    console.log("OVERLAY PDF ========= ", overlayContent);
    setShowOverlayImage(false);
    setShowOverlayPdf(true);
  };

  console.log("lead Data:: ", LeadData);
  console.log("deal history modal: ", dealHistoryModel);

  const handleCommissionModalOpen = (invoice) => {
    console.log("open invoice", invoice);
    if (invoice) {
      setInvoiceModal(LeadData);
    }
    setCommissionModal(LeadData);
  };

  const handleTransactionModalOpen = (e, data) => {
    setAddTransactionModal({ LeadData: LeadData, data: data });
  };

  const statuses = [
    {
      field: "pdc_status",
      text: t("pdc"),
      value: statusData?.pdc_status === 1 ? true : false,
      status: statusData?.pdc_status === 1 ? t("received") : t("not_received"),
      perm: false,
      icon:
        statusData?.pdc_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
    },
    {
      field: "spa_status",
      text: t("spa"),
      value: statusData?.spa_status === 1 ? true : false,
      status: statusData?.spa_status === 1 ? t("received") : t("not_received"),
      perm: false,
      icon:
        statusData?.spa_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
    },
    // INVOICE 
    {
      field: "invoice_status",
      text: t("invoice"),
      value: statusData?.invoice_status === 1 ? true : false,
      status: statusData?.invoice_status === 1 ? t("sent") : t("hold"),
      perm: true,
      icon:
        statusData?.invoice_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
      type: "commission",
    },
    // COMMISSION 
    {
      field: "comm_status",
      text: t("commission"),
      value: statusData?.comm_status === 1 ? true : false,
      status: statusData?.comm_status === 1 ? t("received") : t("not_received"),
      perm: true,
      icon:
        statusData?.comm_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
      type: "commission",
    },
    // AGENT COMMISSION 
    {
      field: "agent_comm_status",
      text: t("agent_comm"),
      value: statusData?.agent_comm_status === 1 ? true : false,
      status: statusData?.agent_comm_status === 1 ? t("sent") : t("hold"),
      perm: true,
      icon:
        statusData?.agent_comm_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
      type: "commission",
    },
    // MANAGER COMMISSION
    {
      field: "manager_comm_status",
      text: t("manager_comm"),
      value: statusData?.manager_comm_status === 1 ? true : false,
      status: statusData?.manager_comm_status === 1 ? t("sent") : t("hold"),
      perm: true,
      icon:
        statusData?.manager_comm_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
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

  const addDealNote = async () => {
    if (dealNote === null || dealNote === "") {
      toast.error("Empty note field!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      try {
        const token = localStorage.getItem("auth-token");
        const noteData = {
          deal_id: LeadData?.lid,
          about: "Note",
          note: dealNote,
        };

        const response = await axios.post(
          `${BACKEND_URL}/deal-history`,
          noteData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          }
        );

        if (response.status === 200) {
          toast.success("Note added successfully.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setDealNote("");
          await fetchLeadsData(LeadData?.lid);
        } else {
          toast.error("Error in Adding the Note.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        console.error("Error adding note:", error);
        toast.error("Error in Adding the Note.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const updateStatus = (toUpdate) => {
    setBtnLoading(true);
    const token = localStorage.getItem("auth-token");
    const updatedData = { [toUpdate]: 1 };

    axios
      .post(`${BACKEND_URL}/editdeal/${LeadData?.lid}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Deal updated successfully.");
        console.log(result);
        if (result.status === 200) {
          setBtnLoading(false);
          setDialogue(false);
          toast.success("Status updated successfully.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // fetchLeadsData(token, LeadData?.lid);
          // FetchLeads(token);
          (async () => {
            await fetchLeadsData(LeadData?.lid);
            console.log("fetchLeadsData running");
            FetchLeads(token);
          })();
          handleClose();
        } else {
          setBtnLoading(false);
          throw new Error("Error in marking the status.");
        }
      })
      .catch((err) => {
        setBtnLoading(false);
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          toast.error("Error in Marking the status.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
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
      setStatusData(leadsCycleResult?.data?.data?.deal);

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

  // function groupHistoryByDate(history) {
  //   const groups = {};
  //   history?.forEach((lead) => {
  //     let date;
  //     if (lead.created_at) date = (lead.created_at + " ").split(" ")[0];
  //     else date = (lead.created_at + " ").split(" ")[0];

  //     if (groups[date]) {
  //       groups[date].push(lead);
  //     } else {
  //       groups[date] = [lead];
  //     }
  //   });

  //   let grouped = Object.keys(groups).map((date) => {
  //     return {
  //       date: date,
  //       history: groups[date],
  //     };
  //   });

  //   grouped = grouped.sort((a, b) => {
  //     return new Date(b.date) - new Date(a.date);
  //   });

  //   grouped = grouped.map((obj) => {
  //     const sortedHistory = obj.leads.sort((a, b) => {
  //       return new Date(b.created_at) - new Date(a.created_at);
  //     });
  //     // return the sorted leads array as part of a new object with the same date
  //     return { date: obj.date, leads: sortedHistory };
  //   });

  //   console.log("Grouped::: ", grouped);
  //   return grouped;
  // }

  function groupHistoryByDate(history) {
    const groups = {};
    history?.forEach((item) => {
      const date = item.created_at.split("T")[0];
      if (groups[date]) {
        groups[date].push(item);
      } else {
        groups[date] = [item];
      }
    });

    const grouped = Object.keys(groups).map((date) => ({
      date,
      items: groups[date],
    }));

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
          className={`${isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
            } ${isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
            } w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            // onClick={handleCloseDealHistory}
            onClick={handleClose}
            className={`${isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
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
            className={` ${currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
              } ${isLangRTL(i18n.language)
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
                        className={`text-lg font-semibold mx-2 uppercase ${currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                      >
                        {t("deal_history")}
                      </h1>
                    </div>
                    {/* <div className="px-4">
                      {hasPermission("view_invoice") && (
                        <button
                          onClick={() => handleCommissionModalOpen("invoice")}
                          className="bg-btn-primary rounded-md py-2 px-4 text-white uppercase"
                        >
                          {t("btn_view_invoice")}
                        </button>
                      )}
                    </div> */}
                  </div>
                  <div>
                    <div
                      className={`${currentMode === "dark" ? "text-white" : "text-black"
                        } p-4`}
                    >
                      <div className="grid grid-cols-12 gap-5">
                        {/* STATUS */}
                        <div className="col-span-12 lg:col-span-4 w-full mb-5">
                          {loading ? (
                            <div className="flex items-center justify-center w-full">
                              <h1 className="font-semibold text-lg">Loading</h1>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-center font-semibold uppercase mb-5">
                                {t("status")}
                              </h3>
                              <div className="w-full grid grid-cols-4 lg:grid-cols-2 gap-5 mb-4">
                                {statuses?.map((status) => {
                                  return (
                                    <div
                                      className={`${currentMode === "dark"
                                          ? "bg-[#1C1C1C]"
                                          : "bg-[#EEEEEE]"
                                        } items-center justify-center flex flex-col rounded-xl shadow-sm h-fit relative`}
                                    >
                                      <div
                                        className={`p-8 flex flex-col w-full items-center text-center justify-center ${status?.type === "commission" &&
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
                                        {/* <p className={`flex items-center mb-2`}>
                                          {status?.icon}
                                        </p> */}
                                        <p className="text-lg font-semibold mt-4">
                                          {status?.text}
                                        </p>
                                      </div>
                                      <div
                                        className={`p-2 w-full rounded-b-xl shadow-sm text-white text-center uppercase ${status?.value
                                            ? "bg-green-600"
                                            : "bg-red-600"
                                          }`}
                                      >
                                        {status?.status}
                                      </div>

                                      {status?.value === false &&
                                        (status?.perm === true ? (
                                          hasPermission("add_commission") && (
                                            <div className="p-2 rounded-full flex items-center justify-center bg-green-600 absolute top-2 right-2">
                                              <Tooltip title="Mark">
                                                <button
                                                  onClick={() =>
                                                    setDialogue(status)
                                                  }
                                                >
                                                  <BsCheck2All
                                                    size={16}
                                                    color={"white"}
                                                  />
                                                </button>
                                              </Tooltip>
                                            </div>
                                          )
                                        ) : (
                                          <div className="p-2 rounded-full flex items-center justify-center bg-green-600 absolute top-2 right-2">
                                            <Tooltip title="Mark">
                                              <button
                                                onClick={() =>
                                                  setDialogue(status)
                                                }
                                              >
                                                <BsCheck2All
                                                  size={16}
                                                  color={"white"}
                                                />
                                              </button>
                                            </Tooltip>
                                          </div>
                                        ))}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="flex items-center justify-between flex-row">
                                <h3 className="font-semibold uppercase mb-5 mt-3">
                                  {t("payments")}
                                </h3>
                                {hasPermission("add_deal_spa") && (
                                  <>
                                    <div>
                                      <button
                                        className="bg-btn-primary rounded-full p-2"
                                        onClick={handleTransactionModalOpen}
                                      >
                                        <FaPlus color="white" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                {transactions?.map((spa) => (
                                  <div
                                    className={`${currentMode === "dark"
                                        ? "bg-[#1C1C1C]"
                                        : "bg-[#EEEEEE]"
                                      } rounded-xl shadow-sm card-hover w-full relative mb-4`}
                                  >
                                    {/* EDIT BUTTON */}
                                    {hasPermission("deal_spa") && (
                                      <div className="absolute bottom-2 right-2">
                                        <button
                                          className="bg-primary text-white rounded-full p-2"
                                          onClick={(e) =>
                                            handleTransactionModalOpen(3, spa)
                                          }
                                        >
                                          <BsPencil size={14} color={"white"} />
                                        </button>
                                      </div>
                                    )}
                                    {/* BANNER  */}
                                    <div className="relative bg-primary p-2 rounded-t-xl text-center text-white font-semibold">
                                      <div>{spa?.type}</div>
                                    </div>
                                    {/* DETAILS */}
                                    <div
                                      className={`p-4 grid ${spa?.temp_file === null
                                          ? "grid-cols-1"
                                          : "grid-cols-2"
                                        } justify-between gap-4`}
                                    >
                                      {/* TEXT */}
                                      <div className="flex flex-col gap-4">
                                        {/* DATE */}
                                        <p>
                                          {t("date")}:{" "}
                                          <span className="font-semibold">
                                            {spa?.dealDate}
                                          </span>
                                        </p>
                                        {/* PERCENTAGE */}
                                        <p>
                                          {t("percentage")}:{" "}
                                          <span className="font-semibold">
                                            {spa?.percent}%
                                          </span>
                                        </p>
                                        {/* AMOUNT */}
                                        <p>
                                          {t("label_amount")}:{" "}
                                          <span className="font-semibold">
                                            {spa?.currency} {spa?.amount}
                                          </span>
                                        </p>
                                        {/* ADDED BY */}
                                        <p>
                                          {t("label_added_by")}:{" "}
                                          <span className="font-semibold">
                                            {spa?.added_by_name}
                                          </span>
                                        </p>
                                      </div>
                                      {/* FILE */}
                                      <div className="w-full flex items-center justify-center">
                                        {spa?.temp_file && (
                                          <div className="flex items-center justify-center">
                                            {(() => {
                                              const ext = spa?.image
                                                .split(".")
                                                .pop()
                                                .toLowerCase();
                                              if (ext === "pdf") {
                                                return (
                                                  <div className="mb-3">
                                                    <BsFileEarmarkMedical
                                                      size={100}
                                                      color={"#AAAAAA"}
                                                      // onClick={() => handlePdfClick(`data:application/pdf;base64,${spa?.temp_file}`)}
                                                      onClick={() =>
                                                        handlePdfClick(
                                                          spa?.temp_file
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                );
                                              } else {
                                                return (
                                                  <img
                                                    // onClick={(e) => setOpenImageModal(spa)}
                                                    className="mb-3"
                                                    src={`data:image/${ext};base64, ${spa?.temp_file}`}
                                                    width="150px"
                                                    height="150px"
                                                    onClick={() =>
                                                      handleImageClick(
                                                        `data:image/${ext};base64,${spa?.temp_file}`
                                                      )
                                                    }
                                                  />
                                                );
                                              }
                                            })()}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {/* HISTORY */}
                        <div className="col-span-12 lg:col-span-8 w-full mb-5">
                          <h3 className="text-center font-semibold uppercase mb-5">
                            {t("history")}
                          </h3>
                          {/* ADD NOTE */}
                          <div
                            className={`flex items-center justify-end gap-4`}
                          >
                            <Box sx={{ ...darkModeColors, minWidth: "300px" }}>
                              <TextField
                                id="note"
                                type={"text"}
                                label={t("label_note")}
                                className="w-full"
                                variant="outlined"
                                size="small"
                                value={dealNote}
                                onChange={(e) => setDealNote(e.target.value)}
                                required
                              />
                            </Box>
                            <button
                              className="bg-primary text-white uppercase rounded-sm px-4 py-2 shadow-sm"
                              onClick={() => addDealNote()}
                            >
                              {t("ticket_add_note_label")}
                            </button>
                          </div>
                          {/* LIST */}
                          <div className="relative space-y-6 w-full">
                            <div className="flex flex-col md:grid grid-cols-12 w-full">
                              {loading ? (
                                <div className="flex items-center justify-center w-full">
                                  <h1 className="font-semibold text-lg">
                                    Loading
                                  </h1>
                                </div>
                              ) : (
                                groupHistoryByDate(leadsCycle)?.map(
                                  (timeline, index) => (
                                    <React.Fragment key={index}>
                                      <div
                                        className={`${isLangRTL(i18n.language)
                                            ? "ml-3"
                                            : "mr-3"
                                          } col-start-1 col-end-3 md:mx-auto relative`}
                                      >
                                        <div className="h-full w-6 flex items-center justify-center">
                                          <div
                                            className={`h-full border-[${primaryColor}] border-b-2 rounded-md shadow-sm px-2 py-1 text-sm`}
                                            style={{
                                              width: "min-content",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {moment(timeline.date).format(
                                              "YYYY-MM-DD"
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      {timeline?.items.map(
                                        (item, itemIndex) => (
                                          <div
                                            key={itemIndex}
                                            className="flex md:contents"
                                          >
                                            {item.note && (
                                              <>
                                                <div
                                                  className={`${isLangRTL(i18n.language)
                                                      ? "ml-3"
                                                      : "mr-3"
                                                    } col-start-1 col-end-3 md:mx-auto relative`}
                                                >
                                                  <div className="h-full w-6 flex items-center justify-center">
                                                    <div className="h-full w-1 bg-[#AAA] pointer-events-none"></div>
                                                  </div>
                                                  <div
                                                    className={`${isLangRTL(i18n.language)
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
                                                  className={`${currentMode === "dark"
                                                      ? "bg-[#1C1C1C]"
                                                      : "bg-[#EEEEEE]"
                                                    } p-4 space-y-3 rounded-xl shadow-sm card-hover md:col-start-3 col-start-2 col-end-13 my-2 w-full`}
                                                >
                                                  {/* ADDED BY  */}
                                                  <p className="text-sm tracking-wide font-italic justify-end gap-2 flex items-center text-[#AAAAAA]">
                                                    <HiUser size={12} />
                                                    {item?.added_by_name}
                                                  </p>
                                                  {/* LEAD NOTE  */}
                                                  <p
                                                    className="tracking-wide mb-2"
                                                    style={{
                                                      fontFamily: isArabic(
                                                        item?.note
                                                      )
                                                        ? "Noto Kufi Arabic"
                                                        : "inherit",
                                                    }}
                                                  >
                                                    {item?.note}
                                                  </p>
                                                  {/* CREATION DATE  */}
                                                  <p className="text-sm tracking-wide uppercase text-[#AAAAAA]">
                                                    {datetimeLong(
                                                      item.created_at
                                                    )}
                                                  </p>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        )
                                      )}
                                    </React.Fragment>
                                  )
                                )
                              )}
                            </div>
                            <Stack spacing={2} marginTop={2}>
                              <Pagination
                                count={maxPage}
                                color={
                                  currentMode === "dark"
                                    ? "primary"
                                    : "secondary"
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
                                      currentMode === "dark"
                                        ? "white"
                                        : "black",
                                  },
                                }}
                              />
                            </Stack>
                          </div>
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
                    className={`px-10 py-5 ${currentMode === "dark"
                        ? "bg-[#1C1C1C] text-white"
                        : "bg-white text-black"
                      }`}
                  >
                    <div className="flex flex-col justify-center items-center">
                      <IoIosAlert size={50} className="text-primary text-2xl" />
                      <h1 className="font-semibold pt-3 text-lg text-center">
                        {t("do_you_really_Want")}{" "}
                        <span className="text-sm bg-gray-500 px-2 py-1 rounded-md font-bold">
                          {DialogueVal?.text}
                        </span>{" "}
                        ?
                      </h1>
                    </div>
                    <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                      <Button
                        className={` text-white rounded-md p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                        ripple={true}
                        size="lg"
                        onClick={() => updateStatus(DialogueVal?.field)}
                      >
                        {btnloading ? (
                          <CircularProgress size={16} sx={{ color: "white" }} />
                        ) : (
                          <span className="text-white">{t("confirm")}</span>
                        )}
                      </Button>

                      <Button
                        onClick={() => setDialogue(false)}
                        ripple={true}
                        variant="outlined"
                        className={`shadow-none p-3 rounded-md text-sm  ${currentMode === "dark"
                            ? "text-white border-white"
                            : "text-black border-black"
                          }`}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </div>
                </Dialog>
              </>
            )}
          </div>

          {showOverlayPdf && (
            <>
              <OverlayFile
                type={"pdf"}
                content={overlayContent}
                onClose={() => {
                  setShowOverlayPdf(false);
                  setShowOverlayImage(false);
                  setOverlayContent(null);
                }}
              />
            </>
          )}
          {showOverlayImage && (
            <>
              <OverlayFile
                type={"image"}
                content={overlayContent}
                onClose={() => {
                  setShowOverlayImage(false);
                  setShowOverlayPdf(false);
                  setOverlayContent(null);
                }}
              />
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DealHistory;
