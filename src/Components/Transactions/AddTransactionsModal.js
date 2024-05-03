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
import { currencies, transaction_type } from "../_elements/SelectOptions";

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

const AddTransactionsModal = ({
  addTransactionModal,
  setAddTransactionModal,
  fetchLeadsData,
}) => {
  console.log("parent transaction data: ", addTransactionModal);
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

  const transData = addTransactionModal?.data;

  console.log("trans data:: ", transData);

  const [transactionData, setTransactionData] = useState({
    deal_id: addTransactionModal?.LeadData?.lid,
    type: transData?.type || null,
    amount: transData?.amount || null,
    dealDate: transData?.dealDate || null,
    currency: transData?.currency || null,
    percent: transData?.percent || null,
    image: transData?.image || null,
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
      setAddTransactionModal();
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

    let url;
    if (transData) {
      url = `${BACKEND_URL}/deal-spa/${transData?.id}`;
    } else {
      url = `${BACKEND_URL}/deal-spa`;
    }

    axios.post(url, transactionData, {
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
        toast.success(
          `Transaction ${transData ? "Updated" : "Added"} successfully.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );

        if (transactionData.type === "PDC" || transactionData.type === "SPA") {
          // let updatedData;

          const updatedData = {
            [transactionData.type.toLowerCase() + "_status"]: 1,
          };

          // if (transactionData.type === "PDC") {
          //   updatedData = { pdc_status: 1 };
          // }
          // else {
          //   updatedData = { spa_status: 1 };
          // }
          // console.log("updated data ====== ", updatedData);

          // const token = localStorage.getItem("auth-token");
          axios.post(`${BACKEND_URL}/editdeal/${transactionData.deal_id}`,
            updatedData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + token,
            },
          })
            .then((result) => {
              console.log("Deal updated successfully.");
              console.log(result);
            })
            .catch((err) => {
              console.error(err);
            });
          // }
        }
        setBtnLoading(false);
        handleClose();
        fetchLeadsData();
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Something Went Wrong! Please Try Again", {
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
      open={addTransactionModal}
      // onClose={setAddTransactionModal}
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
        className={`${isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${isClosing
            ? isLangRTL(i18n.language)
              ? "modal-close-left"
              : "modal-close-right"
            : ""
          }
      w-[100vw] h-[100vh] flex items-start justify-end`}
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
            className="hover:border hover:border-white hover:rounded-full"
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
                    className={`${isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                      } bg-primary h-10 w-1 rounded-full my-1`}
                  ></div>
                  <h1
                    className={`text-lg font-semibold ${currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                  >
                    {transData
                      ? t("edit_transaction_details")
                      : t("transactions_details")}
                  </h1>
                </div>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-5 p-10">
                {/* Transaction DETAILS  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                    }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("transactions_details")?.toUpperCase()}
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
                        options={transaction_type(t)?.map((trans) => ({
                          value: trans.value,
                          label: trans.label,
                        }))}
                        value={transaction_type(t)?.find(
                          (trans) => trans.value === transactionData?.type
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={transactionData?.dealDate}
                          label={t("date")}
                          views={["day", "month", "year"]}
                          onChange={(newValue) => {
                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setTransactionData((prev) => ({
                              ...prev,
                              dealDate: formattedDate,
                            }));
                          }}
                          format="DD-MM-YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                "& input": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                marginBottom: "15px",
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                          maxDate={dayjs().startOf("day").toDate()}
                        />
                      </LocalizationProvider>
                      <TextField
                        id="percent"
                        type={"text"}
                        label={t("percentage")}
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
                        options={currencies(t)}
                        value={currencies(t)?.find(
                          (curr) => curr.value === transactionData?.currency
                        )}
                        onChange={(e) => {
                          setTransactionData({
                            ...transactionData,
                            currency: e.value,
                          });
                        }}
                        placeholder={t("label_select_currency")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      <TextField
                        id="amount"
                        type={"text"}
                        label={t("label_amount")}
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
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* receipt  */}
                <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                    }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("receipt")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box sx={darkModeColors} className="p-2">
                      <div className="  mb-5 flex items-center justify-center ">
                        <div className=" rounded-lg border">
                          <img
                            src={imagePreview}
                            width="100px"
                            height="100px"
                          />
                        </div>
                      </div>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                        onChange={handleImgUpload}
                      />
                      <label htmlFor="contained-button-file">
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
                          disabled={btnloading ? true : false}
                          startIcon={
                            <MdFileUpload className="mx-2" size={16} />
                          }
                        >
                          <span>{t("button_upload_image")}</span>
                        </Button>
                      </label>
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
              <span>{t("create")}</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddTransactionsModal;
