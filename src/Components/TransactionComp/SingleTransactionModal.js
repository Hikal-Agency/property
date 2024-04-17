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

import axios from "../../axoisConfig";
import Error404 from "../../Pages/Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../../Pages/App";

import { MdClose } from "react-icons/md";
import {
  BsFileEarmarkText,
  BsTrash,
  BsPencil,
  BsPinMap,
  BsPerson,
  BsTelephone,
  BsEnvelopeAt,
} from "react-icons/bs";

import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
  FaLinkedin,
} from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

import usePermission from "../../utils/usePermission";
import { FaMoneyBillWave } from "react-icons/fa";

const SingleTransactionModal = ({
  setSingleTransModal,
  singleTransModal,
  fetchCrmClients,
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
  } = useStateContext();

  console.log("single trans data ::: ", singleTransModal);
  const [singleTrans, setSingleClient] = useState(singleTransModal);

  let user = singleTrans?.user ? singleTrans?.user : false;

  console.log("user: ", user);

  const [loading, setloading] = useState(false);

  // const [loading, setloading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listData, setListingData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const { hasPermission } = usePermission();
  const [singleImageModal, setSingleImageModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });

  const [allDocs, setAllDocs] = useState([]);
  const [allImages, setAllImages] = useState([]);

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

  return (
    <>
      {/* <div
        className={`flex min-h-screen w-full p-4 ${
          !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
        } ${currentMode === "dark" ? "text-white" : "text-black"}`}
      > */}
      <Modal
        keepMounted
        open={singleTransModal}
        // onClose={handleCloseTimelineModel}
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
            // onClick={handleCloseTimelineModel}
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
                ? "bg-[#1C1C1C] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
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
                  <div className="w-full">
                    <div className="w-full flex justify-between items-center pb-3">
                      <div className="flex items-center gap-3">
                        <h1
                          className={`font-semibold text-white bg-primary py-2 px-3 rounded-md`}
                        >
                          {singleTrans?.invoice?.id || "-"}
                        </h1>
                        <h1 className={`text-lg font-semibold capitalize`}>
                          {singleTrans?.invoice?.country || "-"}
                        </h1>
                      </div>
                      {/* <button
                        onClick={() => setOpenEdit(true)}
                        className="bg-primary rounded-full p-2"
                      >
                        <BsPencil size={16} color={"#FFF"} />
                      </button> */}
                    </div>

                    <div className="grid grid-cols-2 space-x-4">
                      {/* Transaction details */}
                      <div
                        className={`rounded-xl w-full my-3  shadow-sm ${
                          currentMode === "dark" ? "bg-black" : "bg-[#EEEEEE]"
                        }`}
                      >
                        <div
                          className={`rounded-t-xl  gap-3 bg-primary p-2 px-4`}
                        >
                          <div className="flex items-center justify-center font-semibold">
                            {t("transaction_details")}
                          </div>
                        </div>

                        <div className=" p-4">
                          <div className="flex flex-col gap-3">
                            {/* Date  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("date")}:
                              </p>
                              <h6>{singleTrans?.invoice?.date} </h6>
                            </div>
                            {/* invoice type  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("invoice_type")}:
                              </p>
                              <h6>{singleTrans?.invoice?.invoice_type} </h6>
                            </div>
                            {/* category  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("label_category")}:
                              </p>
                              <h6>{singleTrans?.invoice?.category}</h6>
                            </div>
                            {/* amount  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("label_amount")}:
                              </p>
                              <h6>
                                {singleTrans?.invoice?.currency}{" "}
                                {singleTrans?.invoice?.amount}
                              </h6>
                            </div>
                            {/* commission percent  */}
                            {singleTrans?.invoice?.category?.toLowerCase() ===
                            "commission" ? (
                              <div className="flex gap-3">
                                <p className="font-bold capitalize">
                                  {t("commission")}:
                                </p>
                                <h6>{singleTrans?.invoice?.comm_percent}</h6>
                              </div>
                            ) : null}
                            {/* claim  */}
                            {singleTrans?.invoice?.category?.toLowerCase() ===
                              "commission" &&
                            singleTrans?.invoice?.invioce_type?.toLowerCase() ===
                              "income" ? (
                              <div className="flex gap-3">
                                <p className="font-bold capitalize">
                                  {t("claim")}:
                                </p>
                                <h6>{singleTrans?.invoice?.amount}</h6>
                              </div>
                            ) : null}
                            {/* payment source  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("payment_source")}:
                              </p>
                              <h6>{singleTrans?.invoice?.paid_by}</h6>
                            </div>
                            {/* payment status  */}
                            <div className="flex gap-3">
                              <p className="font-bold capitalize">
                                {t("status")}:
                              </p>
                              <h6>{singleTrans?.invoice?.status}</h6>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User or vendor details */}

                      <div
                        className={`rounded-xl w-full my-3  shadow-sm ${
                          currentMode === "dark" ? "bg-black" : "bg-[#EEEEEE]"
                        }`}
                      >
                        <div
                          className={`rounded-t-xl  gap-3 bg-primary p-2 px-4`}
                        >
                          <div className="flex items-center justify-center font-semibold">
                            {user ? t("user_details") : t("vendor_details")}
                          </div>
                        </div>

                        <div className=" p-4">
                          <div className="flex flex-col gap-3">
                            {user ? (
                              <>
                                {/* username  */}
                                <div className="flex gap-3">
                                  <p className="font-bold capitalize">
                                    {t("username")}:
                                  </p>
                                  <h6>{user?.userName} </h6>
                                </div>
                                {/* contact */}
                                <div className="flex gap-3">
                                  <p className="font-bold capitalize">
                                    {t("label_contact")}:
                                  </p>
                                  <h6>{user?.userContact} </h6>
                                </div>
                                {/* email  */}
                                <div className="flex gap-3">
                                  <p className="font-bold capitalize">
                                    {t("label_email")}:
                                  </p>
                                  <h6>{user?.userEmail}</h6>
                                </div>
                              </>
                            ) : (
                              <>
                                {/* vendor name  */}
                                <div className="flex gap-3">
                                  <p className="font-bold capitalize">
                                    {t("form_vendor_name")}:
                                  </p>
                                  <h6>{singleTrans?.vendor?.vendor_name} </h6>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* invoice receipt */}
                    <div
                      className={`rounded-xl w-full my-3 ${
                        currentMode === "dark"
                          ? "bg-black text-white"
                          : "bg-[#EEEEEE] text-black"
                      }`}
                    >
                      <div
                        className={`w-full flex rounded-t-xl bg-primary text-white p-2 px-4`}
                      >
                        <div className="flex items-center justify-center font-semibold">
                          {t("invoice_receipt")}
                        </div>
                      </div>

                      <div className="flex pt-5 w-full">
                        {singleTrans?.receipt?.length > 0 &&
                          singleTrans?.receipt?.map((l) => {
                            return (
                              <>
                                <div key={l?.id} className="relative  mx-3">
                                  <div className="p-2 flex items-center justify-center hover:cursor-pointer space-x-5 ">
                                    <div className="w-[100px] h-[100px] flex justify-center">
                                      <img
                                        src={l?.image}
                                        alt="Invoice Receipt"
                                        className="object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
                {/* <Footer /> */}
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default SingleTransactionModal;
