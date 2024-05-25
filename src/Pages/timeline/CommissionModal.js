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

import { BsCheck2All, BsFileEarmarkMedical } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { FaPencilAlt } from "react-icons/fa";
import OverlayFile from "../../Components/_elements/OverlayFile";
import { over } from "lodash";
import moment from "moment";
import CommissionReqModal from "./ComissionReqModal";

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

  const handlePdfClick = (pdf) => {
    setOverlayContent(pdf);
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
                          {/* <button
                            onClick={(e) => setCommReqModal(invoiceModal)}
                            className="bg-btn-primary rounded-md py-2 px-4 mr-2"
                          >
                            {t("btn_commission_request")}
                          </button> */}
                          <button
                            onClick={(e) => handleOpenModal(e)}
                            className="bg-btn-primary rounded-md text-white font-semibold py-2 px-4"
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
                                  (data?.invoice_type ===
                                    data?.invoice_type.toLowerCase()) ===
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
                                    } p-4 rounded-xl shadow-sm card-hover mb-5 w-full relative`}
                                  >
                                    {/* AMOUNT  */}
                                    <div
                                      className={`absolute top-4 p-2 text-white font-semibold rounded-sm ${
                                        isLangRTL(i18n.language)
                                          ? "left-4"
                                          : "right-4"
                                      } ${
                                        data?.invoice_type.toLowerCase() ===
                                        "income"
                                          ? "bg-green-600"
                                          : "bg-red-600"
                                      }
                                    `}
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
                                        className={`absolute bottom-4 ${
                                          isLangRTL(i18n.language)
                                            ? "left-4"
                                            : "right-4"
                                        }`}
                                      >
                                        <button
                                          className="bg-btn-primary rounded-full p-3 bottom-0 "
                                          onClick={(e) =>
                                            handleOpenModal(e, data)
                                          }
                                        >
                                          <FaPencilAlt
                                            size={16}
                                            color={"white"}
                                          />
                                        </button>
                                      </div>
                                    )}

                                    {/* GRID  */}
                                    <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                      {/* COMMISSION DETAILS */}
                                      <div
                                        className={`${
                                          currentMode === "dark"
                                            ? "bg-[#000000]"
                                            : "bg-[#ffffff]"
                                        } rounded-md p-5 w-full`}
                                      >
                                        <h3 className="text-sm  font-semibold uppercase mb-6 mt-3 text-center">
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

                                        <div className="flex justify-between  my-3">
                                          <p>{t("claim")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.claim}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("commission_perc")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.comm_percent}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("vat_amount")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.vat}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("status")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.status}
                                          </p>
                                        </div>

                                        <div className="flex justify-between  my-3">
                                          <p>{t("payment_source")}:</p>
                                          <p className="font-semibold ml-2">
                                            {data?.paid_by}
                                          </p>
                                        </div>
                                      </div>

                                      {/* VENDOR/USER DETAILS */}
                                      <div
                                        className={`${
                                          currentMode === "dark"
                                            ? "bg-[#000000]"
                                            : "bg-[#ffffff]"
                                        } rounded-md p-5 w-full`}
                                      >
                                        <h3 className="text-sm font-semibold uppercase mb-6 mt-3 text-center">
                                          {data?.invoice_type.toLowerCase() ===
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

                                      {/* RECEIPTS  */}
                                      <div
                                        className="w-full p-4 items-center justify-center sm:col-span-2 md:col-span-2 lg:col-span-1 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1"
                                        onContextMenu={(e) =>
                                          e.preventDefault()
                                        }
                                      >
                                        {data?.receipt[0]?.temp_file && (
                                          <div className="flex items-center justify-center">
                                            {(() => {
                                              const ext =
                                                data?.receipt[0]?.image
                                                  .split(".")
                                                  .pop()
                                                  .toLowerCase();
                                              if (ext === "pdf") {
                                                return (
                                                  <div className="mb-3">
                                                    <BsFileEarmarkMedical
                                                      size={100}
                                                      color={"#AAAAAA"}
                                                      // onClick={() => handlePdfClick(`data:application/pdf;base64, ${data?.receipt[0]?.temp_file}`)}
                                                      onClick={() =>
                                                        handlePdfClick(
                                                          data?.receipt[0]
                                                            ?.temp_file
                                                        )
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
                                          <IoMdPerson size={14} />
                                          <div>
                                            {data?.added_by_name}
                                            {"-"}
                                            {datetimeLong(data?.created_at)}
                                          </div>
                                        </p>
                                      </div>
                                    </div>
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
        </div>
      </Modal>
    </>
  );
};

export default CommissionModal;
