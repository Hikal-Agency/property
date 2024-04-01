import moment from "moment";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import Error from "../Error";

import axios from "../../axoisConfig";
import { useNavigate } from "react-router-dom";
import { Backdrop, Box, Modal } from "@mui/material";
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
import { IoMdPerson } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import AddCommissionModal from "./AddCommissionModal";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const CommissionModal = ({
  commissionModal,
  handleCloseCommissionModal,
  invoiceModal,
}) => {
  console.log("invoice modal: ", invoiceModal);
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
  const [leadDetails, setLeadDetails] = useState(null);
  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addCommissionModal, setOpenAddCommissionModal] = useState(false);
  const navigate = useNavigate();

  console.log("deal history lead data:: ", commissionModal);

  const handleOpenModal = () => {
    setOpenAddCommissionModal(true);
  };

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseCommissionModal();
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

  const fetchLeadsData = async (token, LeadID) => {
    const urlLeadsCycle = `${BACKEND_URL}/leadscycle/${LeadID}}`;
    const urlLeadDetails = `${BACKEND_URL}/leads/${LeadID}`;
    try {
      const [leadsCycleResult, leadDetailsResult] = await Promise.all([
        axios.get(urlLeadsCycle, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(urlLeadDetails, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);
      setLeadsCycle(leadsCycleResult.data.history);
      setLeadDetails(leadDetailsResult.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError404(true);
    }
  };

  useEffect(() => {
    const LeadID = commissionModal?.leadId;
    const token = localStorage.getItem("auth-token");
    if (!LeadID) {
      navigate(`/closedeals`);
      return;
    }
    fetchLeadsData(token, LeadID);
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
        open={commissionModal}
        // onClose={handleCloseCommissionModal}
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
            // onClick={handleCloseCommissionModal}
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
                        {invoiceModal ? t("invoice") : t("commission")}
                      </h1>
                    </div>
                    <div>
                      {!invoiceModal && (
                        <>
                          <button
                            onClick={handleOpenModal}
                            className="bg-btn-primary rounded-md py-2 px-4"
                          >
                            {t("btn_add_commission")}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <div
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } p-4 `}
                    >
                      <div className="col-span-12 md:col-span-4 w-full">
                        {loading ? (
                          <div className="flex items-center justify-center w-full">
                            <h1 className="font-semibold text-lg">Loading</h1>
                          </div>
                        ) : (
                          <>
                            <div
                              className={`${
                                currentMode === "dark"
                                  ? "bg-[#1C1C1C]"
                                  : "bg-[#EEEEEE]"
                              } p-4 space-y-3 rounded-xl shadow-sm card-hover  my-2 w-full relative`}
                            >
                              <p className="text-red-600 text-right font-semibold">
                                - AED 2323
                              </p>
                              <div className="flex items-center justify-between mt-5">
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#000000]"
                                      : "bg-[#ffffff]"
                                  } rounded-md p-5 w-[400px] h-[250px]`}
                                >
                                  <h3 className="text-sm  font-semibold uppercase mb-6 mt-3 text-center">
                                    {t("commissions")}
                                  </h3>
                                  <div className="flex justify-between  my-3">
                                    <p>{t("date")}:</p>
                                    <p className="font-semibold ml-2">Date</p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("claim")}:</p>
                                    <p className="font-semibold ml-2">Claim</p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("commission_perc")}:</p>
                                    <p className="font-semibold ml-2">
                                      Commission Percentage
                                    </p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("vat_amount")}:</p>
                                    <p className="font-semibold ml-2">VAT</p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("status")}:</p>
                                    <p className="font-semibold ml-2">Status</p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("payment_source")}:</p>
                                    <p className="font-semibold ml-2">
                                      Payment Source
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`${
                                    currentMode === "dark"
                                      ? "bg-[#000000]"
                                      : "bg-[#ffffff]"
                                  } rounded-md p-5 w-[400px] h-[250px]`}
                                >
                                  <h3 className="text-sm  font-semibold uppercase mb-6 mt-3 text-center">
                                    {t("user_details")}
                                  </h3>
                                  <div className="flex justify-between  my-3">
                                    <p>{t("name")}:</p>
                                    <p className="font-semibold ml-2">Name</p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("label_position")}:</p>
                                    <p className="font-semibold ml-2">
                                      Position
                                    </p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("label_contact")}:</p>
                                    <p className="font-semibold ml-2">
                                      Contact
                                    </p>
                                  </div>

                                  <div className="flex justify-between  my-3">
                                    <p>{t("label_email")}:</p>
                                    <p className="font-semibold ml-2">Email</p>
                                  </div>
                                </div>
                                <div className=" flex flex-col items-center justify-center mr-5 w-40">
                                  <img src="#" width="300px" height="300px" />
                                  <p className="flex">
                                    <span className="mr-3">
                                      <IoMdPerson />
                                    </span>
                                    Added by name
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <button className="bg-btn-primary rounded-full p-3 bottom-0 ">
                                  <FaPencilAlt />
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {addCommissionModal && (
            <AddCommissionModal
              addCommissionModal={addCommissionModal}
              handleCloseAddCommission={() => setOpenAddCommissionModal(false)}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default CommissionModal;
