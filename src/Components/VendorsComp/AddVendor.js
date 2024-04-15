import React, { useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
} from "@mui/material";
import Select from "react-select";
import {
  commission_type,
  countries_list,
  currencies,
  transaction_type,
} from "../_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import moment from "moment";

const AddVendor = ({
  openVendorModal,
  setOpenVendorModal,
  newFeedback,
  Feedback,
  fetchLeadsData,
}) => {
  console.log("Booked Form: ", openVendorModal);
  console.log("Booked Data: ", Feedback);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    fontFam,
    t,
    isLangRTL,
    i18n,
    primaryColor,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [transactionData, setTransactionData] = useState({
    deal_id: openVendorModal?.lid,
    type: null,
    amount: null,
    dealDate: null,
    currency: null,
    percent: null,
    image: null,
  });

  console.log("transaction data:: ", transactionData);

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setTransactionData({
      ...transactionData,
      [id]: value,
    });
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);

      const base64Image = reader.result;
      setTransactionData({
        ...transactionData,
        image: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenVendorModal();
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const AddTransaction = () => {
    setBtnLoading(true);
    const token = localStorage.getItem("auth-token");

    if (!transactionData?.image) {
      toast.error("Image required.", {
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

    axios
      .post(`${BACKEND_URL}/deal-spa`, transactionData, {
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
        toast.success("Transaction Added successfully.", {
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
        fetchLeadsData();
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
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

  return (
    <Modal
      keepMounted
      open={openVendorModal}
      // onClose={setOpenVendorModal}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      openAfterTransition
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 1000,
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
      w-[100vw] h-[100vh] flex items-start justify-end`}
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
            className="hover:border hover:border-white hover:rounded-full"
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
            p-4 h-[100vh] w-[80vw] overflow-y-scroll 
          `}
        >
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="w-full flex items-center pb-3 ">
                  <div
                    className={`${
                      isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                    } bg-primary h-10 w-1 rounded-full my-1`}
                  ></div>
                  <h1
                    className={`text-lg font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {t("add_vendor")}
                  </h1>
                </div>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-5 p-10">
                {/* Vendor DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("vendor_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                        // marginTop:"20p"
                      }}
                    >
                      <Select
                        id="type"
                        options={commission_type(t)?.map((comm) => ({
                          value: comm.value,
                          label: comm.label,
                        }))}
                        value={commission_type(t)?.find(
                          (comm) => comm.value === transactionData?.type
                        )}
                        onChange={(e) => {
                          setTransactionData({
                            ...transactionData,
                            type: e.value,
                          });
                        }}
                        placeholder={t("type")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      <TextField
                        id="vendor_name"
                        type={"text"}
                        label={t("form_vendor_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.percent}
                        onChange={handleChange}
                        required
                      />

                      <TextField
                        id="address"
                        type={"text"}
                        label={t("label_address")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.percent}
                        onChange={handleChange}
                        required
                      />

                      <Select
                        id="currency"
                        options={countries_list(t)}
                        value={countries_list(t)?.find(
                          (curr) => curr.value === transactionData?.currency
                        )}
                        onChange={(e) => {
                          setTransactionData({
                            ...transactionData,
                            currency: e.value,
                          });
                        }}
                        placeholder={t("label_country")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      <TextField
                        id="amount"
                        type={"text"}
                        label={t("po_box")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.amount}
                        onChange={handleChange}
                      />

                      <TextField
                        id="amount"
                        type={"text"}
                        label={t("trn")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.amount}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>
                </div>

                {/* Person to contact  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("person_to_contact")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box sx={darkModeColors} className="p-2">
                      <TextField
                        id="address"
                        type={"text"}
                        label={t("name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.percent}
                        onChange={handleChange}
                      />

                      <TextField
                        id="address"
                        type={"text"}
                        label={t("label_contact_number")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.percent}
                        onChange={handleChange}
                      />

                      <TextField
                        id="address"
                        type={"text"}
                        label={t("label_email")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.percent}
                        onChange={handleChange}
                      />

                      <TextField
                        id="address"
                        type={"text"}
                        label={t("form_vendor_link")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={transactionData?.percent}
                        onChange={handleChange}
                      />
                    </Box>
                  </div>
                </div>
              </div>
            </>
          )}
          <Button
            type="submit"
            size="medium"
            style={{
              color: "white",
              fontFamily: fontFam,
            }}
            className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
            onClick={AddTransaction}
            disabled={btnloading ? true : false}
          >
            {btnloading ? (
              <CircularProgress
                size={23}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <span>{t("btn_add")}</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddVendor;
