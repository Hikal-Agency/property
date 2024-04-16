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
import { IoMdPerson } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import AddCommissionModal from "./AddCommissionModal";
import { toast } from "react-toastify";

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
  console.log("comission modal: ", commissionModal);
  const {
    currentMode,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
  } = useStateContext();

  const [error404, setError404] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addCommissionModal, setOpenAddCommissionModal] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  console.log("data fetched:: ", data);

  const navigate = useNavigate();

  console.log("deal history lead data:: ", commissionModal);

  const handleOpenModal = (e, data) => {
    setOpenAddCommissionModal({
      commissionModal: commissionModal,
      data: data,
      image: data?.receipt[0]?.image,
    });
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
  const token = localStorage.getItem("auth-token");

  const fetchLeadsData = async () => {
    setLoading(true);
    let dataUrl;
    let params;
    dataUrl = `${BACKEND_URL}/invoices`;
    if (invoiceModal) {
      params = { page: page, deal_id: commissionModal?.lid };
    } else {
      params = {
        page: page,
        deal_id: commissionModal?.lid,
        category: "Commission",
      };
    }
    try {
      const leadsCycleResult = await axios.get(dataUrl, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("invoice history::: ", leadsCycleResult);
      setMaxPage(leadsCycleResult?.data?.data?.last_page);
      setData(leadsCycleResult?.data?.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

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
    const LeadID = commissionModal?.leadId;
    const token = localStorage.getItem("auth-token");
    if (!LeadID) {
      navigate(`/closedeals`);
      return;
    }
    fetchLeadsData(token, LeadID);
    //eslint-disable-next-line
  }, [page]);

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
                            onClick={(e) => handleOpenModal(e)}
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
                            {data && data?.length > 0 ? (
                              data?.map((data) => {
                                let user;
                                if (
                                  (data?.invoice?.invoice_type ===
                                    data?.invoice?.invoice_type.toLowerCase()) ===
                                  "expense"
                                ) {
                                  user = true;
                                } else {
                                  user = false;
                                }

                                console.log("user true or false: ", data?.user);
                                return (
                                  <div
                                    className={`${
                                      currentMode === "dark"
                                        ? "bg-[#1C1C1C]"
                                        : "bg-[#EEEEEE]"
                                    } p-4 space-y-3 rounded-xl shadow-sm card-hover  my-2 w-full relative`}
                                  >
                                    {data?.invoice?.invoice_type.toLowerCase() ===
                                    "expense" ? (
                                      <p className="text-red-600 text-right font-semibold">
                                        - {data?.invoice?.currency}{" "}
                                        {data?.invoice?.amount}
                                      </p>
                                    ) : (
                                      <p className="text-green-600 text-right font-semibold">
                                        + {data?.invoice?.currency}{" "}
                                        {data?.invoice?.amount}
                                      </p>
                                    )}
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
                                          <p className="font-semibold ml-2">
                                            {data?.invoice?.date}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("claim")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.invoice?.claim}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("commission_perc")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.invoice?.comm_percent}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("vat_amount")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.invoice?.vat}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("status")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.invoice?.status}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("payment_source")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.invoice?.paid_by}
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
                                          {data?.invoice?.invoice_type.toLowerCase() ===
                                          "expense"
                                            ? t("user_details")
                                            : t("vendor_details")}
                                        </h3>
                                        <div className="flex justify-between  my-3">
                                          <p>{t("name")}:</p>
                                          <p className="font-semibold ml-2">
                                            {user
                                              ? data?.user?.userName
                                              : data?.vendor?.vendor_name}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>
                                            {user
                                              ? t("label_position")
                                              : t("label_address")}
                                            :
                                          </p>
                                          <p className="font-semibold ml-2">
                                            {user
                                              ? data?.user?.position
                                              : data?.vendor?.address}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>
                                            {user
                                              ? t("label_contact")
                                              : t("po_box")}
                                            :
                                          </p>
                                          <p className="font-semibold ml-2">
                                            {user
                                              ? data?.user?.userContact
                                              : data?.vendor?.pobox}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>
                                            {user ? t("label_email") : t("trn")}
                                            :
                                          </p>
                                          <p className="font-semibold ml-2">
                                            {user
                                              ? data?.user?.userEmail
                                              : data?.vendor?.trn}
                                          </p>
                                        </div>
                                      </div>
                                      <div className=" flex flex-col items-center justify-center mr-5 w-40 mb-3">
                                        {data?.receipt[0]?.image && (
                                          <img
                                            src={data?.receipt[0]?.image}
                                            width="300px"
                                            height="300px"
                                          />
                                        )}
                                        <p className="flex">
                                          <span className="mr-3">
                                            <IoMdPerson />
                                          </span>
                                          {data?.invoice?.added_by_name}
                                          {"-"}
                                          {data?.invoice?.date}
                                        </p>
                                      </div>
                                    </div>
                                    {!invoiceModal && (
                                      <div className="flex justify-end">
                                        <button
                                          className="bg-btn-primary rounded-full p-3 bottom-0 "
                                          onClick={(e) =>
                                            handleOpenModal(e, data)
                                          }
                                        >
                                          <FaPencilAlt />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="h-[300px] w-full flex items-center justify-center">
                                <h1 className="text-lg font-bold capitalize">
                                  {t("no_data_found")}
                                </h1>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      {data && data?.length > 0 ? (
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
                                    currentMode === "dark" ? "black" : "white",
                                },
                              },
                              "& .MuiPaginationItem-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                            }}
                          />
                        </Stack>
                      ) : null}
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
              fetchLeadsData={fetchLeadsData}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default CommissionModal;
