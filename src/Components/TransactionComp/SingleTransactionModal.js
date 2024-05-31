import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  Modal,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { FaPencilAlt } from "react-icons/fa";

import axios from "../../axoisConfig";
import Error404 from "../../Pages/Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../../Pages/App";

import { MdClose, MdFileUpload } from "react-icons/md";
import { BsFileEarmarkMedical, BsPen } from "react-icons/bs";

import usePermission from "../../utils/usePermission";
import EditTransactionForm from "./EditTransactionForm";

const SingleTransactionModal = ({
  setSingleTransModal,
  singleTransModal,
  fetchTransactions,
  user,
  vendors,
  fetchUsers,
}) => {
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    t,
    fontFam,
  } = useStateContext();
  const hikalrewhite = "fullLogoREWhite.png";

  console.log("single trans data ::: ", singleTransModal);

  const [singleTrans, setSingleTransactions] = useState();
  const transData = singleTransModal?.invoice || singleTransModal;

  const [openEditModal, setOpenEditModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
    setShowOverlay(true);
  };

  let userData = singleTrans?.user ? singleTrans?.user : false;

  console.log("user: ", userData);

  const [loading, setloading] = useState(false);

  const [btnLoading, setBtnLoading] = useState(false);
  const [image, setImage] = useState(null);

  const [leadNotFound, setLeadNotFound] = useState(false);
  const { hasPermission } = usePermission();
  const [singleImageModal, setSingleImageModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });

  const handlePdfClick = (pdfUrl) => {
    setPdfUrl(pdfUrl);
  };

  const FetchSingleTransaction = (e) => {
    setloading(true);
    const token = localStorage.getItem("auth-token");

    axios
      .get(`${BACKEND_URL}/invoices/${transData?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);

        if (result?.data?.status === false) {
          toast.error(result?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setloading(false);
          return;
        }

        setSingleTransactions(result?.data?.data);
        setloading(false);
      })
      .catch((err) => {
        setloading(false);

        console.log(err);
        toast.error("Error in fetching single transaction.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const UploadImage = (e) => {
    setBtnLoading(true);
    const token = localStorage.getItem("auth-token");

    const invoiceReceipt = {
      invoice_id: transData?.id,
      file: image,
    };

    axios
      .post(`${BACKEND_URL}/invoice-receipts`, invoiceReceipt, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);

        if (result?.data?.status === false) {
          toast.error(result?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setBtnLoading(false);
          return;
        }

        toast.success(`Invoice receipt uploaded successfully.`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setBtnLoading(false);
        handleClose();
        fetchTransactions();
      })
      .catch((err) => {
        setBtnLoading(false);

        console.log(err);
        toast.error("Error in uploading image.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSingleTransModal(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const handleImgUpload = (e) => {
    console.log("EE:", e);
    setImage(e.target.files[0]);
  };

  console.log("image : ", image);

  useEffect(() => {
    if (image != null) {
      UploadImage();
    }
  }, [image]);

  useEffect(() => {
    FetchSingleTransaction();
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={singleTransModal}
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
            }
          w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
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
              ? "bg-[#1C1C1C] text-white"
              : "bg-[#FFFFFF] text-black"
              } ${isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
              } p-4 h-[100vh] w-[80vw] overflow-y-scroll `}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                {leadNotFound ? (
                  <Error404 />
                ) : (
                  <div className="w-full flex flex-col gap-5">
                    <div className="w-full flex justify-between items-center pb-3">
                      <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <h1
                            className={`font-semibold text-white bg-primary py-2 px-3 rounded-md`}
                          >
                            {singleTrans?.id}
                          </h1>
                          <h1 className={`text-lg font-semibold capitalize`}>
                            {singleTrans?.country || "---"}
                          </h1>
                        </div>

                        <div className="flex items-center gap-3">
                          {hasPermission("upload_receipt") && (
                            <div>
                              <input
                                accept="image/jpeg, image/png, image/jpg, image/gif, application/pdf"
                                style={{ display: "none" }}
                                id="invoice-file"
                                type="file"
                                onChange={handleImgUpload}
                              />
                              <label htmlFor="invoice-file">
                                <Button
                                  variant="contained"
                                  size="medium"
                                  className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold my-3"
                                  style={{
                                    color: "#ffffff",
                                    border: "1px solid white",
                                    fontFamily: fontFam,
                                  }}
                                  component="span" // Required so the button doesn't automatically submit form
                                  disabled={btnLoading}
                                  startIcon={
                                    btnLoading ? null : (
                                      <MdFileUpload
                                        className="mx-2"
                                        size={16}
                                      />
                                    )
                                  }
                                >
                                  <span>{t("upload_invoice")}</span>
                                </Button>
                              </label>
                            </div>
                          )}
                          {hasPermission("edit_transaction") && (
                            <button
                              className="bg-primary  rounded-full p-4"
                              onClick={() => setOpenEditModal(true)}
                            >
                              <BsPen size={18} color={"white"} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {/* TRANSACTION DETAILS */}
                      <div className="col-span-1 md:col-span-2 gap-5">
                        <div className={`text-primary text-center py-2 border-b-2 border-primary uppercase`}>
                          {t("transaction_details")}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* INVOICE DETAILS */}
                          <div className="flex flex-col gap-4 p-5">
                            {/* INVOICE TYPE */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("invoice_type")}:
                              </p>
                              <p>{singleTrans?.invoice_type} </p>
                            </div>
                            {/* CATEGORY */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("label_category")}:
                              </p>
                              <p>{singleTrans?.category}</p>
                            </div>
                            {/* CLAIM */}
                            {singleTrans?.category?.toLowerCase() ===
                              "commission" &&
                              singleTrans?.invoice_type?.toLowerCase() ===
                              "income" ? (
                              <div className="flex gap-3">
                                <p className="font-bold capitalize">
                                  {t("claim")}:
                                </p>
                                <p>{singleTrans?.claim}</p>
                              </div>
                            ) : null}
                            {/* PERCENTAGE */}
                            {singleTrans?.category?.toLowerCase() ===
                              "commission" ? (
                              <div className="flex gap-3">
                                <p className="font-bold capitalize">
                                  {t("percentage")}:
                                </p>
                                <p>
                                  {singleTrans?.comm_percent}
                                  {"%"}
                                </p>
                              </div>
                            ) : null}
                            {/* DATE OF INVOICE */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("date")}:
                              </p>
                              <p>{moment(singleTrans?.date).format("YYYY-MM-DD")}</p>
                            </div>
                          </div>
                          {/* PAYENT DETAILS */}
                          <div className="flex flex-col gap-4 p-5">
                            {/* PAYMENT STATUS */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("status")}:
                              </p>
                              <p>{singleTrans?.status}</p>
                            </div>
                            {/* PAYMENT SOURCE */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("payment_source")}:
                              </p>
                              <p>{singleTrans?.paid_by}</p>
                            </div>
                            {/* AMOUNT */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("amount")}:
                              </p>
                              <p>{singleTrans?.currency} {singleTrans?.amount}</p>
                            </div>
                            {/* VAT */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("vat_amount")}:
                              </p>
                              <p>{singleTrans?.currency} {singleTrans?.vat}</p>
                            </div>
                            {/* TOTAL AMOUNT */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("total_amount")}:
                              </p>
                              <p>{singleTrans?.currency} {singleTrans?.total_amount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* USER DETAILS */}
                      {singleTrans?.user_id && (
                        <div className="col-span-1 gap-5">
                          <div className={`text-primary text-center py-2 border-b-2 border-primary uppercase`}>
                            {t("user_details")}
                          </div>
                          <div className="flex flex-col gap-4 p-5">
                            {/* USER NAME */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("username")}:
                              </p>
                              <p>{userData?.userName} </p>
                            </div>
                            {/* CONTACT */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("label_contact")}:
                              </p>
                              <p>{userData?.userContact} </p>
                            </div>
                            {/* EMAIL  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("label_email")}:
                              </p>
                              <p>{userData?.userEmail}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* VENDOR DETAILS */}
                      {singleTrans?.vendor_id && (
                        <div className="col-span-1 gap-5">
                          <div className={`text-primary text-center py-2 border-b-2 border-primary uppercase`}>
                            {t("vendor_details")}
                          </div>
                          <div className="flex flex-col gap-4 p-5">
                            {/* VENDOR NAME */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("form_vendor_name")}:
                              </p>
                              <p>{singleTrans?.vendor?.vendor_name} </p>
                            </div>
                            {/* ADDRESS */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("label_address")}:
                              </p>
                              <p>{singleTrans?.vendor?.address} </p>
                            </div>
                            {/* PO BOX */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("po_box")}:
                              </p>
                              <p>{singleTrans?.vendor?.pobox} </p>
                            </div>
                            {/* TRN */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("trn")}:
                              </p>
                              <p>{singleTrans?.vendor?.trn} </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* INVOICE RECEIPTS */}
                      <div className={`col-span-1 md:col-span-3 gap-5 ${(singleTrans?.vendor_id && singleTrans?.user_id) ? "lg:col-span-2" : "lg:col-span-3"}`}>
                        <div className={`text-primary text-center py-2 border-b-2 border-primary uppercase`}>
                          {t("invoice_receipt")}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-4 w-full">
                          {singleTrans?.receipt?.length > 0 &&
                            singleTrans?.receipt?.map((l) => {
                              return (
                                <>
                                  {l.temp_file && (
                                    <div
                                      key={l?.id}
                                      className={`${currentMode === "dark"
                                        ? "bg-black"
                                        : "bg-[#EEEEEE]"
                                        } p-4 rounded-xl shadow-sm card-hover`}
                                    >
                                      <div className="p-2 flex items-center justify-center hover:cursor-pointer space-x-5 ">
                                        {(() => {
                                          const ext = l?.image
                                            .split(".")
                                            .pop()
                                            .toLowerCase();
                                          if (ext === "pdf") {
                                            return (
                                              <div className="flex flex-col items-center justify-content-center">
                                                <div className="mb-3">
                                                  <BsFileEarmarkMedical
                                                    size={100}
                                                    color={"#AAAAAA"}
                                                    onClick={() =>
                                                      handlePdfClick(
                                                        `data:application/pdf;base64, ${l?.temp_file}`
                                                      )
                                                    }
                                                  />
                                                </div>
                                                <p class="text-sm break-all">
                                                  {l.image}
                                                </p>
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <div className="flex flex-col items-center justify-content-center">
                                                <img
                                                  className="mb-3"
                                                  src={`data:image/${ext};base64, ${l?.temp_file}`}
                                                  width="150px"
                                                  height="150px"
                                                  onClick={() =>
                                                    handleImageClick(
                                                      `data:image/${ext};base64, ${l?.temp_file}`
                                                    )
                                                  }
                                                />
                                                <p class="text-sm break-all">
                                                  {l.image}
                                                </p>
                                              </div>
                                            );
                                          }
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    {openEditModal && (
                      <EditTransactionForm
                        openEditModal={openEditModal}
                        setOpenEditModal={setOpenEditModal}
                        transData={singleTrans}
                        fetchTransactions={fetchTransactions}
                        user={user}
                        fetchUsers={fetchUsers}
                        vendors={vendors}
                        
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {showOverlay && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-75"></div>
              <div className="relative z-10 bg-white">
                <img src={activeImage} alt="overlay" className="h-[90vh]" />
                <button
                  onClick={handleCloseOverlay}
                  className="absolute top-4 right-4 text-2xl text-white bg-primary p-2 rounded-full m-0"
                >
                  <MdClose />
                </button>
                <img
                  src={hikalrewhite}
                  alt="hikal real estate"
                  className="absolute right-4 bottom-4 w-[100px] p-2 bg-[#000000] bg-opacity-70"
                />
              </div>
            </div>
          )}

          {pdfUrl && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-75"></div>
              <div className="relative z-10 bg-white">
                <iframe
                  title="PDF Viewer"
                  src={pdfUrl}
                  style={{ width: "70vw", height: "90vh", border: "none" }}
                />{" "}
                <button
                  onClick={() => setPdfUrl(null)}
                  className="absolute -top-3 right-0 text-2xl text-white bg-primary p-2 rounded-full m-0"
                >
                  <MdClose />
                </button>
                <img
                  src={hikalrewhite}
                  alt="hikal real estate"
                  className="absolute right-4 bottom-4 w-[100px] p-2 bg-[#000000] bg-opacity-70"
                />
              </div>
            </div>
          )}
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default SingleTransactionModal;
