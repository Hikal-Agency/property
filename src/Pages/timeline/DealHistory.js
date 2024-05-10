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
  Box
} from "@mui/material";
import { datetimeLong } from "../../Components/_elements/formatDateTime";

import { BiCalendarExclamation } from "react-icons/bi";
import {
  BsBookmarkCheckFill,
  BsClockFill,
  BsFileEarmarkMedical,
  BsCheck2All,
  BsPencil
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
import { Tooltip } from "@material-tailwind/react";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const DealHistory = ({
  LeadData,
  handleCloseDealHistory,
  dealHistoryModel,
  FetchLeads
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

  const [showOverlayPdf, setShowOverlayPdf] = useState(false);
  const [showOverlayImage, setShowOverlayImage] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);

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
      value: LeadData?.pdc_status === 1 ? true : false,
      perm: false,
      icon:
        LeadData?.pdc_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
    },
    {
      field: "spa_status",
      text: t("spa"),
      value: LeadData?.spa_status === 1 ? true : false,
      perm: false,
      icon:
        LeadData?.spa_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
    },
    {
      field: "comm_status",
      text: t("commission"),
      value: LeadData?.comm_status === 1 ? true : false,
      perm: true,
      icon:
        LeadData?.comm_status === 1 ? (
          <FaCheck size={20} color="#1b8755" />
        ) : (
          <RxCross2 size={20} color="#DA1F26" />
        ),
      type: "commission",
    },
    {
      field: "agent_comm_status",
      text: t("agent_comm"),
      value: LeadData?.agent_comm_status === 1 ? true : false,
      perm: true,
      icon:
        LeadData?.agent_comm_status === 1 ? (
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
          note: dealNote
        };

        const response = await axios.post(`${BACKEND_URL}/deal-history`, noteData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        });

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
          throw new Error("Error in marking the status.");
        }
      })
      .catch((err) => {
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
      })
  };

  // const ribbonStyles = {
  //   width: "100px",
  //   height: "30px",
  //   filter: "grayscale(0) !important",
  //   lineHeight: "52px",
  //   position: "absolute",
  //   top: "20px",
  //   right: "-30px",
  //   color: "white",
  //   zIndex: 2,
  //   overflow: "hidden",
  //   transform: "rotate(45deg)",
  //   boxShadow: `0 0 0 3px ${primaryColor}, 0px 21px 5px -18px rgba(0,0,0,0.6)`,
  //   background: primaryColor,
  //   textAlign: "center",

  //   "& .wrap": {
  //     width: "100%",
  //     height: "188px",
  //     position: "absolute",
  //     top: "-8px",
  //     left: "8px",
  //     overflow: "hidden",
  //   },
  //   "& .wrap:before, .wrap:after": {
  //     content: "''",
  //     position: "absolute",
  //   },
  //   "& .wrap:before": {
  //     width: "40px",
  //     height: "8px",
  //     right: "100px",
  //     background: "#4D6530",
  //     borderRadius: "8px 8px 0px 0px",
  //   },
  //   "& .wrap:after": {
  //     width: "8px",
  //     height: "40px",
  //     right: "0px",
  //     top: "100px",
  //     background: "#4D6530",
  //     borderRadius: "0px 8px 8px 0px",
  //   },
  // };

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
                    <div className="px-4">
                      {hasPermission("view_invoice") && (
                        <button
                          onClick={() => handleCommissionModalOpen("invoice")}
                          className="bg-btn-primary rounded-md py-2 px-4 text-white uppercase"
                        >
                          {t("btn_view_invoice")}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={`${currentMode === "dark" ? "text-white" : "text-black"} p-4`}>
                      <div className="grid sm:grid-cols-12 gap-5">
                        {/* STATUS */}
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
                              {/* <div className="w-full flex items-center justify-center  space-x-2 mb-4"> */}
                              <div className="w-full grid grid-cols-2 gap-5 mb-4">
                                {statuses?.map((status) => {
                                  return (
                                    <div
                                      className={`${currentMode === "dark"
                                        ? "bg-[#1C1C1C]"
                                        : "bg-[#EEEEEE]"
                                        } items-center justify-center flex flex-col rounded-xl shadow-sm`}
                                    >
                                      <div className={`p-5 flex flex-col w-full items-center justify-center ${status?.type === "commission" &&
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
                                        <p className={`flex items-center mb-2`} >
                                          {status?.icon}
                                        </p>
                                        <p>
                                          {status?.text}
                                        </p>
                                      </div>
                                      {status?.value === false && (
                                        (status?.perm === true ? (
                                          (hasPermission("add_commission")) && (
                                            <Tooltip title="Mark">
                                              <button
                                                className={`p-2 w-full rounded-b-xl flex items-center justify-center bg-green-600`}
                                                onClick={() => updateStatus(status?.field)}
                                              >
                                                <BsCheck2All size={16} color={"white"} />
                                              </button>
                                            </Tooltip>
                                          )
                                        ) : (
                                          <Tooltip title="Mark">
                                            <button
                                              className={`p-2 w-full rounded-b-xl flex items-center justify-center bg-green-600`}
                                              onClick={() => updateStatus(status?.field)}
                                            >
                                              <BsCheck2All size={16} color={"white"} />
                                            </button>
                                          </Tooltip>
                                        ))
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              <div className="flex items-center justify-between  flex-row">
                                <h3 className="text-sm  font-semibold uppercase mb-5 mt-3">
                                  {t("transactions")}
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

                              {/* {hasPermission("deal_spa") && ( */}
                              <>
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
                                    <div className="p-4 grid grid-cols-2 justify-between gap-4">
                                      {/* TEXT */}
                                      <div className="flex flex-col gap-4">
                                        <div className="flex gap-2">
                                          <p>{t("percentage")}:</p>
                                          <div>
                                            <p className="font-semibold">
                                              {spa?.percent}%
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex gap-2">
                                          <p>{t("label_amount")}:</p>
                                          <div>
                                            <p className="font-semibold">
                                              {spa?.currency} {spa?.amount}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex gap-2">
                                          <p>{t("date")}:</p>
                                          <div>
                                            <p className="font-semibold">
                                              {spa?.dealDate}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex gap-2">
                                          <p>{t("label_added_by")}:</p>
                                          <div>
                                            <p className="font-semibold">
                                              {spa?.added_by_name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      {/* FILE */}
                                      <div className="w-full flex items-center justify-center">
                                        {/* {spa?.temp_file && (
                                          <div
                                            className="rounded-md border cursor-pointer mb-8 "
                                            onClick={(e) =>
                                              setOpenImageModal(spa)
                                            }
                                          >
                                            <img
                                              src={spa?.temp_file}
                                              width="100px"
                                              height="100px"
                                              className="object-fill"
                                            />
                                          </div>
                                        )} */}
                                        {spa?.temp_file && (
                                          <div className="flex items-center justify-center">
                                            {(() => {
                                              const ext = spa?.image.split('.').pop().toLowerCase();
                                              if (ext === 'pdf') {
                                                return (
                                                  <div className="mb-3">
                                                    <BsFileEarmarkMedical
                                                      size={100}
                                                      color={"#AAAAAA"}
                                                      // onClick={() => handlePdfClick(`data:application/pdf;base64,${spa?.temp_file}`)}
                                                      onClick={() => handlePdfClick(spa?.temp_file)}
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
                                                    onClick={() => handleImageClick(`data:image/${ext};base64,${spa?.temp_file}`)}
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
                              </>
                              {/* )} */}
                            </>
                          )}
                        </div>

                        {/* HISTORY */}
                        <div className="col-span-12 md:col-span-8 w-full">
                          {/* ADD NOTE */}
                          <div className={`flex items-center justify-end gap-4`}>
                            <Box sx={{ minWidth: "300px" }}>
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
                                groupLeadsByDate(leadsCycle)?.map(
                                  (timeline, index) => {
                                    console.log("timeline:: ", timeline);
                                    return (
                                      <>
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
                                              {/* {timeline.date} */}
                                              {moment(timeline.date).format("YYYY-MM-DD")}
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
                                                        {timeline?.added_by_name}
                                                      </p>
                                                      {/* LEAD NOTE  */}
                                                      <p
                                                        className="tracking-wide mb-2"
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
            {/* {imageModal && (
              <SingleTransImage
                imageModal={imageModal}
                setOpenImageModal={setOpenImageModal}
                handleCloseTransactionModal={() => setOpenImageModal(false)}
              />
            )} */}
          </div>

          {showOverlayPdf && (
            <>
              <OverlayFile
                type={"pdf"}
                content={overlayContent}
                onClose={() => {
                  setShowOverlayPdf(false);
                  setShowOverlayImage(false);
                  setOverlayContent(null)
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
                  setOverlayContent(null)
                }}
              />
            </>
          )}
        </div >

      </Modal >
    </>
  );
};

export default DealHistory;
