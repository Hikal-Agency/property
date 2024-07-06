import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Document, Page, pdfjs } from "react-pdf";
import { Backdrop, Box, Modal, Pagination, Stack } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import Error from "../Error";
import { datetimeLong } from "../../Components/_elements/formatDateTime";
import AddCommissionModal from "./AddCommissionModal";

import { MdClose, MdDownload } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import OverlayFile from "../../Components/_elements/OverlayFile";
import { over } from "lodash";
import moment from "moment";
import CommissionReqModal from "./ComissionReqModal";
import ReceiptVoucher from "./ReceiptVoucher";
import CommissionReceipt from "./CommissionReceipt";
import HeadingTitle from "../../Components/_elements/HeadingTitle";
// import base64ToBlob from "../../utils/baseToBlob";

import {
  BsPen,
  BsFiletypePdf,
  BsDownload,
  BsFillPersonFill,
} from "react-icons/bs";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const CommissionModal = ({
  commissionModal,
  handleCloseCommissionModal,
  invoiceModal,
  status,
}) => {
  console.log("invoice modal: ", invoiceModal);
  console.log("comission modal: ", commissionModal);
  console.log("status: ", status);
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
  const [receiptVoucher, setReceiptVoucher] = useState(false);
  const [commissionReceipt, setCommissionReceipt] = useState(false);
  const [commReqModal, setCommReqModal] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const [showOverlayPdf, setShowOverlayPdf] = useState(false);
  const [showOverlayImage, setShowOverlayImage] = useState(false);
  const [overlayContent, setOverlayContent] = useState(null);

  const handleImageClick = (image) => {
    setOverlayContent(image);
    console.log("OVERLAY IMAGE ========= ", overlayContent);
    setShowOverlayPdf(false);
    setShowOverlayImage(true);
  };

  const base64ToBlob = (base64, mime) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  };

  const handlePdfClick = (pdf) => {
    const base64String = pdf.split(",")[1];
    const pdfBlob = base64ToBlob(base64String, "application/pdf");
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);
    setOverlayContent(pdfBlobUrl);
    console.log("OVERLAY PDF ========= ", overlayContent);
    setShowOverlayImage(false);
    setShowOverlayPdf(true);
  };

  console.log("data fetched:: ", data);

  const navigate = useNavigate();

  console.log("deal history lead data:: ", commissionModal);

  const handleOpenModal = (e, data) => {
    setOpenAddCommissionModal({
      commissionModal: commissionModal,
      data: data,
      image: data?.receipt[0]?.temp_file,
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

  const token = localStorage.getItem("auth-token");

  const fetchLeadsData = async () => {
    setLoading(true);
    let dataUrl;
    let params;
    dataUrl = `${BACKEND_URL}/invoices`;
    if (invoiceModal) {
      params = { page: page, deal_id: commissionModal?.lid };
    } else {
      if (status?.field == "comm_status") {
        params = {
          page: page,
          deal_id: commissionModal?.lid,
          category: "Commission",
          invoice_type: "Income",
        };
      } else {
        params = {
          page: page,
          deal_id: commissionModal?.lid,
          user_id:
            status?.field === "agent_comm_status"
              ? commissionModal?.salesId
              : commissionModal?.managerId,
          category: "Commission",
          invoice_type: "Expense",
        };
      }
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
      setData(leadsCycleResult?.data?.data?.data);
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

  const Additional = () => {
    return (
      <>
        {!invoiceModal && (
          <>
            <button
              onClick={(e) => setCommReqModal(commissionModal)}
              className="bg-btn-primary rounded-md py-2 px-4 mr-2 text-white uppercase"
            >
              {t("generate_tax_invoice")}
            </button>
            <button
              onClick={(e) => handleOpenModal(e)}
              className="bg-btn-primary rounded-md text-white uppercase  py-2 px-4"
            >
              {t("btn_add_commission")}
            </button>
          </>
        )}
      </>
    );
  };

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
                ? "bg-dark text-white"
                : "bg-light text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } 
             p-5 h-[100vh] w-[85vw] overflow-y-scroll border-primary
            `}
          >
            <div className={`w-full`}>
              {error404 ? (
                <Error />
              ) : (
                <div className="">
                  <HeadingTitle
                    title={
                      status?.field === "agent_comm_status"
                        ? t("agent_comm")
                        : status?.field === "manager_comm_status"
                        ? t("manager_comm")
                        : t("commission")
                    }
                    additional={<Additional />}
                  />
                  {loading ? (
                    <div className="flex items-center justify-center w-full my-5">
                      <h1 className="font-semibold text-lg">Loading..</h1>
                    </div>
                  ) : (
                    <>
                      {data && data?.length > 0 ? (
                        data?.map((data) => {
                          return (
                            <div className="my-5">
                              <div
                                className={`${
                                  currentMode === "dark"
                                    ? "bg-dark-neu"
                                    : "bg-light-neu"
                                } p-5 w-full relative`}
                              >
                                {/* AMOUNT  */}
                                <div
                                  className={`${
                                    isLangRTL(i18n.language)
                                      ? "left-5"
                                      : "right-5"
                                  } ${
                                    data?.invoice_type.toLowerCase() ===
                                    "income"
                                      ? currentMode === "dark"
                                        ? "bg-green-dark-neu"
                                        : "bg-green-light-neu"
                                      : currentMode === "dark"
                                      ? "bg-red-dark-neu"
                                      : "bg-red-light-neu"
                                  } absolute top-5 p-2 text-white font-semibold rounded-sm`}
                                >
                                  {data?.invoice_type.toLowerCase() ===
                                  "income" ? (
                                    <>
                                      {data?.currency} {data?.amount}
                                    </>
                                  ) : (
                                    <>
                                      - {data?.currency} {data?.amount}
                                    </>
                                  )}
                                </div>

                                {/* EDIT  */}
                                {!invoiceModal && (
                                  <div
                                    className={`flex flex-col space-y-3 absolute bottom-5 ${
                                      isLangRTL(i18n.language)
                                        ? "left-5"
                                        : "right-5"
                                    }`}
                                  >
                                    <button
                                      className={`${
                                        currentMode === "dark"
                                          ? "bg-primary-dark-neu"
                                          : "bg-primary-light-neu"
                                      } rounded-full p-3`}
                                      onClick={(e) => handleOpenModal(e, data)}
                                    >
                                      <BsPen size={16} color={"white"} />
                                    </button>
                                    <button
                                      className={`${
                                        currentMode === "dark"
                                          ? "bg-primary-dark-neu"
                                          : "bg-primary-light-neu"
                                      } rounded-full p-3`}
                                      onClick={() => {
                                        if (data?.invoice_type === "Income") {
                                          setReceiptVoucher(data);
                                        } else {
                                          setCommissionReceipt(data);
                                        }
                                      }}
                                    >
                                      <BsDownload size={16} color={"white"} />
                                    </button>
                                  </div>
                                )}

                                {/* GRID  */}
                                <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                  {/* COMMISSION DETAILS */}
                                  <div
                                    className={`${
                                      currentMode === "dark"
                                        ? "bg-dark-neu"
                                        : "bg-light-neu"
                                    } p-5 w-full`}
                                  >
                                    <h3 className="text-sm text-primary font-semibold uppercase mb-5 text-center">
                                      {t("commissions")}
                                    </h3>
                                    <div className="flex justify-between my-3">
                                      <p>{t("date")}:</p>
                                      <p className="font-semibold ml-2">
                                        {moment(data?.date).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </p>
                                    </div>

                                    <div className="flex justify-between my-3">
                                      <p>{t("claim")}:</p>
                                      <p className="font-semibold ml-2">
                                        {data?.claim}
                                      </p>
                                    </div>

                                    <div className="flex justify-between my-3">
                                      <p>{t("commission_perc")}:</p>
                                      <p className="font-semibold ml-2">
                                        {data?.comm_percent}
                                      </p>
                                    </div>

                                    <div className="flex justify-between my-3">
                                      <p>{t("vat_amount")}:</p>
                                      <p className="font-semibold ml-2">
                                        {data?.vat}
                                      </p>
                                    </div>

                                    <div className="flex justify-between my-3">
                                      <p>{t("status")}:</p>
                                      <p className="font-semibold ml-2">
                                        {data?.status}
                                      </p>
                                    </div>

                                    <div className="flex justify-between my-3">
                                      <p>{t("payment_source")}:</p>
                                      <p className="font-semibold ml-2">
                                        {data?.paid_by}
                                      </p>
                                    </div>
                                  </div>

                                  {/* VENDOR DETAILS */}
                                  {data?.vendor_id && (
                                    <div
                                      className={`${
                                        currentMode === "dark"
                                          ? "bg-dark-neu"
                                          : "bg-light-neu"
                                      } p-5 w-full`}
                                    >
                                      <h3 className="text-sm text-primary font-semibold uppercase mb-5 text-center">
                                        {t("vendor_details")}
                                      </h3>
                                      <div className="flex justify-between my-3">
                                        <p>{t("name")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.vendor?.vendor_name}
                                        </p>
                                      </div>
                                      <div className="flex justify-between my-3">
                                        <p>{t("label_address")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.vendor?.address}
                                        </p>
                                      </div>
                                      <div className="flex justify-between  my-3">
                                        <p>{t("po_box")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.vendor?.pobox}
                                        </p>
                                      </div>
                                      <div className="flex justify-between  my-3">
                                        <p>{t("trn")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.vendor?.trn}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {data?.user_id && (
                                    <div
                                      className={`${
                                        currentMode === "dark"
                                          ? "bg-dark-neu"
                                          : "bg-light-neu"
                                      } p-5 w-full`}
                                    >
                                      <h3 className="text-sm text-primary font-semibold uppercase mb-5 text-center">
                                        {t("user_details")}
                                      </h3>
                                      <div className="flex justify-between my-3">
                                        <p>{t("name")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.user?.userName}
                                        </p>
                                      </div>
                                      <div className="flex justify-between my-3">
                                        <p>{t("label_position")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.user?.position}
                                        </p>
                                      </div>
                                      <div className="flex justify-between my-3">
                                        <p>{t("label_contact")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.user?.userContact}
                                        </p>
                                      </div>
                                      <div className="flex justify-between my-3">
                                        <p>{t("label_email")}:</p>
                                        <p className="font-semibold ml-2">
                                          {data?.user?.userEmail}
                                        </p>
                                      </div>
                                    </div>
                                  )}

                                  {/* RECEIPTS  */}
                                  <div
                                    className={`w-full p-5 items-center justify-center ${
                                      data?.vendor_id && data?.user_id
                                        ? "lg:col-span-3"
                                        : "md:col-span-2 lg:col-span-1"
                                    }`}
                                    onContextMenu={(e) => e.preventDefault()}
                                  >
                                    {data?.receipt[0]?.temp_file && (
                                      <div className="flex items-center justify-center">
                                        {(() => {
                                          const ext = data?.receipt[0]?.image
                                            .split(".")
                                            .pop()
                                            .toLowerCase();
                                          if (ext === "pdf") {
                                            return (
                                              <div className="mb-3">
                                                <BsFiletypePdf
                                                  size={100}
                                                  color={"#AAAAAA"}
                                                  onClick={() =>
                                                    handlePdfClick(`
                                                        data:application/pdf;base64,
                                                         ${data?.receipt[0]?.temp_file}`)
                                                  }
                                                />
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <img
                                                className="mb-3"
                                                src={`data:image/${ext};base64, ${data?.receipt[0]?.temp_file}`}
                                                width="150px"
                                                height="150px"
                                                onClick={() =>
                                                  handleImageClick(
                                                    `data:image/${ext};base64, ${data?.receipt[0]?.temp_file}`
                                                  )
                                                }
                                              />
                                            );
                                          }
                                        })()}
                                      </div>
                                    )}
                                    <p className="flex items-center justify-center gap-4 w-full">
                                      <BsFillPersonFill size={14} />
                                      <div>
                                        {data?.added_by_name}
                                        {" - "}
                                        {datetimeLong(data?.created_at)}
                                      </div>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <h1 className="text-lg font-bold capitalize">
                          {t("no_data_found")}
                        </h1>
                      )}
                    </>
                  )}
                  <div>
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
                              boxShadow: "0 0 10px rgba(119,119,119,0.4)",
                              "&:hover": {
                                backgroundColor:
                                  currentMode === "dark" ? "black" : "white",
                              },
                            },
                            "& .MuiPaginationItem-root": {
                              color: currentMode === "dark" ? "white" : "black",
                            },
                          }}
                        />
                      </Stack>
                    ) : null}
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
              status={status}
            />
          )}

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

          {commReqModal && (
            <CommissionReqModal
              commReqModal={commReqModal}
              setCommReqModal={setCommReqModal}
            />
          )}
          {receiptVoucher && (
            <ReceiptVoucher
              receiptVoucher={receiptVoucher}
              setReceiptVoucher={setReceiptVoucher}
              data={commissionModal}
            />
          )}
          {commissionReceipt && (
            <CommissionReceipt
              commissionReceipt={commissionReceipt}
              setCommissionReceipt={setCommissionReceipt}
              data={commissionModal}
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default CommissionModal;
