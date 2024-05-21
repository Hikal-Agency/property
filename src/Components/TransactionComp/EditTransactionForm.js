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
import { BsFileEarmarkMedical } from "react-icons/bs";

import usePermission from "../../utils/usePermission";
import AddTransactionForm from "./AddTransactionForm";

const EditTransactionForm = ({
  openEditModal,
  setOpenEditModal,
  fetchTransactions,
  user,
  vendors,
  loading,
  fetchUsers,
  transData,
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
  const [leadNotFound, setLeadNotFound] = useState(false);

  console.log("edit data: ", transData);

  const [addTransactionData, setAddTransactionData] = useState({
    user_id: transData?.user_id || null,
    invoice_type: transData?.invoice_type || null,
    amount: transData?.amount || null,
    date: transData?.date || null,
    currency: transData?.user_id || "AED",
    comm_percent: transData?.comm_percent || null,
    country: transData?.country || null,
    status: transData?.user_id || "Paid",
    paid_by: transData?.paid_by || null,
    vendor_id: transData?.vendor_id || null,
    category: transData?.category || null,
    image: null,
  });

  //   const UploadImage = (e) => {
  //     setBtnLoading(true);
  //     const token = localStorage.getItem("auth-token");

  //     const invoiceReceipt = {
  //       invoice_id: transData?.id,
  //       file: image,
  //     };

  //     axios
  //       .post(`${BACKEND_URL}/invoice-receipts`, invoiceReceipt, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((result) => {
  //         console.log("Result: ");
  //         console.log("Result: ", result);

  //         if (result?.data?.status === false) {
  //           toast.error(result?.data?.message, {
  //             position: "top-right",
  //             autoClose: 3000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "light",
  //           });
  //           setBtnLoading(false);
  //           return;
  //         }

  //         toast.success(`Invoice receipt uploaded successfully.`, {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //         setBtnLoading(false);
  //         handleClose();
  //         fetchTransactions();
  //       })
  //       .catch((err) => {
  //         setBtnLoading(false);

  //         console.log(err);
  //         toast.error("Error in uploading image.", {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //       });
  //   };

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenEditModal(false);
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

  //   useEffect(() => {
  //     if (image != null) {
  //       UploadImage();
  //     }
  //   }, [image]);

  return (
    <>
      <Modal
        keepMounted
        open={openEditModal}
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
                    <AddTransactionForm
                      user={user}
                      vendors={vendors}
                      loading={loading}
                      fetchUsers={fetchUsers}
                      fetchTransactions={fetchTransactions}
                      addTransactionData={addTransactionData}
                      setAddTransactionData={setAddTransactionData}
                      edit={true}
                      transData={transData}
                      handleClose={handleClose}
                    />
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

export default EditTransactionForm;
