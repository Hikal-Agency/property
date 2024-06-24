import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { socket } from "../../Pages/App";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Select from "react-select";
import {
  currencies,
  enquiry_options,
  feedback_options,
} from "../_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { BsPercent } from "react-icons/bs";

const BookedDealsForm = ({
  BookedForm,
  handleBookedFormClose,
  newFeedback,
  Feedback,
  FetchLeads,
}) => {
  console.log("Booked Form: ", BookedForm);
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
  const [btnloading, setbtnloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [updatedField, setUpdatedField] = useState("");
  const [withDiscount, setWithDiscount] = useState(false);
  const [withCashback, setWithCashback] = useState(false);

  const [closedDealData, setClosedDealsData] = useState({
    leadId: Feedback?.leadId,
    unit: null,
    dealDate: moment(Feedback?.creationDate).format("YYYY-MM-DD"),
    currency: "AED",
    booking_percent: 0,
    booking_amount: Feedback?.booked_amount || 0,
    booking_date: Feedback?.booked_date,
    passport: null,
    leadName: Feedback?.leadName,
    project: Feedback?.project,
    enquiryType: Feedback?.enquiryType,
    amount: 0,
    paid_amount: 0,
    paid_percent: 0,
    cashback_percent: 0,
    cashback_amount: 0,
    discount_percent: 0,
    discount_amount: 0,
  });

  console.log("closed deal data:: ", closedDealData);

  const [imagePreview, setImagePreview] = useState(null);

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);

      const base64Image = reader.result;
      setClosedDealsData({
        ...closedDealData,
        passport: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    console.log("E::: ", e);
    const value = e.target.value;
    const id = e.target.id;

    setClosedDealsData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setUpdatedField(id);
  };

  // DISCOUNT
  const toggleDiscount = (value) => {
    setWithDiscount(value);
    if (value === true) {
      console.log("WITH DISCOUNT");
    } else {
      setClosedDealsData({
        ...closedDealData,
        discount_amount: 0,
        discount_percent: 0,
      });
    }
  };
  // CASHBACK
  const toggleCashback = (value) => {
    setWithCashback(value);
    if (value === true) {
      console.log("WITH CASHBACK");
    } else {
      setClosedDealsData({
        ...closedDealData,
        cashback_amount: 0,
        cashback_percent: 0,
      });
    }
  };

  useEffect(() => {
    const {
      amount,
      paid_percent,
      booking_amount,
      paid_amount,
      discount_amount,
      discount_percent,
      cashback_amount,
      cashback_percent,
    } = closedDealData;

    if (updatedField === "amount" || updatedField === "paid_percent") {
      autoCalculate("paid_amount", amount, paid_percent);
    }
    if (updatedField === "amount" || updatedField === "booking_amount") {
      autoCalculate("booking_percent", amount, booking_amount);
    }
    if (updatedField === "amount" || updatedField === "paid_amount") {
      autoCalculate("paid_percent", amount, paid_amount);
    }
    if (updatedField === "amount" || updatedField === "discount_amount") {
      autoCalculate("discount_percent", amount, discount_amount);
    }
    if (updatedField === "amount" || updatedField === "discount_percent") {
      autoCalculate("discount_amount", amount, discount_percent);
    }
    if (updatedField === "amount" || updatedField === "cashback_amount") {
      autoCalculate("cashback_percent", amount, cashback_amount);
    }
    if (updatedField === "amount" || updatedField === "cashback_percent") {
      autoCalculate("cashback_amount", amount, cashback_percent);
    }
  }, [
    closedDealData.amount,
    closedDealData.paid_percent,
    closedDealData.booking_amount,
    closedDealData.paid_amount,
    closedDealData.discount_amount,
    closedDealData.discount_percent,
    closedDealData.cashback_amount,
    closedDealData.cashback_percent,
    updatedField,
  ]);

  const autoCalculate = (value, amount, percentOrAmount) => {
    const sellingAmount = parseFloat(amount);
    console.log("SELLING AMOUNT = ", sellingAmount);

    if (value === "paid_amount") {
      const paidPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(paidPercent)) {
        let paidAmount = (sellingAmount * paidPercent) / 100;
        paidAmount =
          paidAmount % 1 === 0 ? paidAmount.toFixed(0) : paidAmount.toFixed(2);

        console.log("PAID PERCENT = ", paidPercent);
        console.log("PAID AMOUNT = ", paidAmount);

        setClosedDealsData((prevData) => ({
          ...prevData,
          paid_amount: paidAmount,
        }));
      }
    }
    if (value === "paid_percent") {
      const paidAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(paidAmount)) {
        let paidPercent = (paidAmount / sellingAmount) * 100 || 0;
        paidPercent =
          paidPercent % 1 === 0
            ? paidPercent.toFixed(0)
            : paidPercent.toFixed(2);

        console.log("PAID AMOUNT = ", paidAmount);
        console.log("PAID PERCENT = ", paidPercent);

        setClosedDealsData((prevData) => ({
          ...prevData,
          paid_percent: paidPercent,
        }));
      }
    }
    if (value === "booking_percent") {
      const bookingAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(bookingAmount)) {
        let bookingPercent = (bookingAmount / sellingAmount) * 100 || 0;
        bookingPercent =
          bookingPercent % 1 === 0
            ? bookingPercent.toFixed(0)
            : bookingPercent.toFixed(2);

        console.log("BOOKING AMOUNT = ", bookingAmount);
        console.log("BOOKING PERCENT = ", bookingPercent);

        setClosedDealsData((prevData) => ({
          ...prevData,
          booking_percent: bookingPercent,
        }));
      }
    }
    if (value === "discount_amount") {
      const discountPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(discountPercent)) {
        let discountAmount = (sellingAmount * discountPercent) / 100;
        discountAmount =
          discountAmount % 1 === 0
            ? discountAmount.toFixed(0)
            : discountAmount.toFixed(2);

        console.log("DISCOUNT PERCENT = ", discountPercent);
        console.log("DISCOUNT AMOUNT = ", discountAmount);

        setClosedDealsData((prevData) => ({
          ...prevData,
          discount_amount: discountAmount,
        }));
      }
    }
    if (value === "discount_percent") {
      const discountAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(discountAmount)) {
        let discountPercent = (discountAmount / sellingAmount) * 100 || 0;
        discountPercent =
          discountPercent % 1 === 0
            ? discountPercent.toFixed(0)
            : discountPercent.toFixed(2);

        console.log("DISCOUNT AMOUNT = ", discountAmount);
        console.log("DISCOUNT PERCENT = ", discountPercent);

        setClosedDealsData((prevData) => ({
          ...prevData,
          discount_percent: discountPercent,
        }));
      }
    }
    if (value === "cashback_amount") {
      const cashbackPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(cashbackPercent)) {
        let cashbackAmount = (sellingAmount * cashbackPercent) / 100;
        cashbackAmount =
          cashbackAmount % 1 === 0
            ? cashbackAmount.toFixed(0)
            : cashbackAmount.toFixed(2);

        console.log("CASHBACK PERCENT = ", cashbackPercent);
        console.log("CASHBACK AMOUNT = ", cashbackAmount);

        setClosedDealsData((prevData) => ({
          ...prevData,
          cashback_amount: cashbackAmount,
        }));
      }
    }
    if (value === "cashback_percent") {
      const cashbackAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(cashbackAmount)) {
        let cashbackPercent = (cashbackAmount / sellingAmount) * 100 || 0;
        cashbackPercent =
          cashbackPercent % 1 === 0
            ? cashbackPercent.toFixed(0)
            : cashbackPercent.toFixed(2);

        console.log("CASHBACK AMOUNT = ", cashbackAmount);
        console.log("CASHBACK PERCENT = ", cashbackPercent);

        setClosedDealsData((prevData) => ({
          ...prevData,
          cashback_percent: cashbackPercent,
        }));
      }
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleBookedFormClose();
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const token = localStorage.getItem("auth-token");
  const AddClosedDeal = () => {
    setbtnloading(true);
    // if (!closedDealData?.passport) {
    //   toast.error("Passport image is required", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    //   setbtnloading(false);

    //   return;
    // }

    axios
      .post(`${BACKEND_URL}/closedDeals`, closedDealData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setbtnloading(false);
        if (result?.data?.status === false || result?.status === false) {
          toast.error(result?.data?.message || result?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }
        socket.emit("notification_deal_close", {
          from: { id: User?.id },
          closedByName: User?.userName,
          project: Feedback.project,
          amount: closedDealData?.amount,
          participants: [
            Feedback?.assignedToSales,
            User?.isParent,
            Feedback?.assignedToManager,
          ],
        });
        handleClose();
        toast.success("Closed deal added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        FetchLeads(token);
      })
      .catch((err) => {
        setbtnloading(false);
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
      open={BookedForm}
      // onClose={handleBookedFormClose}
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
        } w-[100vw] h-[100vh] flex items-start justify-end`}
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
              <div className="w-full flex items-center pb-5">
                <div
                  className={`${
                    isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                  } bg-primary h-10 w-1 rounded-full my-1`}
                ></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                  style={{
                    fontFamily: isArabic(Feedback?.feedback)
                      ? "Noto Kufi Arabic"
                      : "inherit",
                  }}
                >
                  <h1 className="font-semibold pt-3 text-lg text-center">
                    {t("want_to_change_feedback")} {t("from")}{" "}
                    <span className="text-sm bg-gray-500 text-white px-2 py-1 rounded-md font-bold">
                      {t(
                        "feedback_" +
                          Feedback?.feedback
                            ?.toLowerCase()
                            ?.replaceAll(" ", "_")
                      )}
                    </span>{" "}
                    {t("to")}{" "}
                    <span className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold">
                      {t(
                        "feedback_" +
                          newFeedback?.toLowerCase()?.replaceAll(" ", "_")
                      )}
                    </span>{" "}
                    ?
                  </h1>
                </h1>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-5 p-5">
                {/* LEAD DETAILS */}
                <div className="px-2">
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("lead_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5">
                    <Box
                      sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                          {
                            right: isLangRTL(i18n.language)
                              ? "2.5rem"
                              : "inherit",
                            transformOrigin: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language)
                            ? "right"
                            : "left",
                        },
                      }}
                    >
                      {/* LEAD NAME */}
                      <TextField
                        id="leadName"
                        type={"text"}
                        label={t("label_lead_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "20px !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={closedDealData?.leadName}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                      {/* PASSPORT */}
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
                          component="span"
                          disabled={loading ? true : false}
                          startIcon={
                            loading ? null : (
                              <MdFileUpload className="mx-2" size={16} />
                            )
                          }
                        >
                          <span>{t("label_passport_image")}</span>
                        </Button>
                      </label>
                    </Box>
                  </div>
                </div>
                {/* PROJECT DETAILS  */}
                <div className="px-2">
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("project_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5">
                    <Box
                      sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                          {
                            right: isLangRTL(i18n.language)
                              ? "2.5rem"
                              : "inherit",
                            transformOrigin: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language)
                            ? "right"
                            : "left",
                        },
                      }}
                    >
                      {/* PROJECT */}
                      <TextField
                        id="project"
                        type={"text"}
                        label={t("label_project_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "20px !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={closedDealData?.project}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                      {/* ENQUIRY  */}
                      <Select
                        id="enquiryType"
                        options={enquiry_options(t)}
                        // value={closedDealData.enquiryType}
                        value={enquiry_options(t)?.find(
                          (fb) => fb.value === closedDealData?.enquiryType
                        )}
                        onChange={(e) => {
                          setClosedDealsData({
                            ...closedDealData,
                            enquiryType: e.value,
                          });
                        }}
                        placeholder={t("label_enquiry_for")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      {/* UNIT */}
                      <TextField
                        id="unit"
                        type={"text"}
                        label={t("unit")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "20px !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={closedDealData?.unit}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                      <div className="grid grid-cols-3">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === closedDealData?.currency
                          )}
                          onChange={(e) => {
                            setClosedDealsData({
                              ...closedDealData,
                              currency: e.value,
                            });
                          }}
                          placeholder={t("label_select_currency")}
                          className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* SELLING AMOUNT */}
                        <TextField
                          id="amount"
                          type={"number"}
                          label={t("selling_amount")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={closedDealData?.amount}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                    </Box>
                  </div>
                </div>

                {/* PAYMENT DETAILS  */}
                <div className="px-2">
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("payment_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5">
                    <Box
                      sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                          {
                            right: isLangRTL(i18n.language)
                              ? "2.5rem"
                              : "inherit",
                            transformOrigin: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language)
                            ? "right"
                            : "left",
                        },
                      }}
                      className="flex flex-col"
                    >
                      {/* DEAL DATE */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={closedDealData?.dealDate}
                          label={t("label_deal_date")}
                          views={["day", "month", "year"]}
                          onChange={(newValue) => {
                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setClosedDealsData((prev) => ({
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
                                marginBottom: "20px",
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                          minDate={closedDealData?.booking_date}
                          // maxDate={dayjs().startOf("day").toDate()}
                        />
                      </LocalizationProvider>

                      {/* PAID */}
                      <div className="grid grid-cols-4">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === closedDealData?.currency
                          )}
                          onChange={(e) => {
                            setClosedDealsData({
                              ...closedDealData,
                              currency: e.value,
                            });
                          }}
                          placeholder={t("label_select_currency")}
                          // className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* PAID AMOUNT */}
                        <TextField
                          id="paid_amount"
                          type={"number"}
                          label={t("paid_amount")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              // marginBottom: "20px !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={closedDealData?.paid_amount}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                        {/* PAID PERCENTAGE */}
                        <TextField
                          id="paid_percent"
                          type={"number"}
                          // label={t("paid_percent")}
                          className="w-full"
                          sx={{
                            "&": {
                              // marginBottom: "20px !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={closedDealData?.paid_percent}
                          onChange={(e) => handleChange(e)}
                          required
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <BsPercent size={18} color={"#777777"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </Box>
                  </div>
                </div>

                {/* BOOKING DETAILS */}
                <div className="px-2">
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("booking_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5">
                    <Box
                      sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                          {
                            right: isLangRTL(i18n.language)
                              ? "2.5rem"
                              : "inherit",
                            transformOrigin: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language)
                            ? "right"
                            : "left",
                        },
                      }}
                    >
                      {/* BOOKING DATE  */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={closedDealData?.booking_date}
                          label={t("booking_date")}
                          views={["day", "month", "year"]}
                          onChange={(newValue) => {
                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setClosedDealsData((prev) => ({
                              ...prev,
                              booking_date: formattedDate,
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
                                marginBottom: "20px",
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
                      {/* BOOKING */}
                      <div className="grid grid-cols-4">
                        {/* CURRENCY  */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === closedDealData?.currency
                          )}
                          onChange={(e) => {
                            setClosedDealsData({
                              ...closedDealData,
                              currency: e.value,
                            });
                          }}
                          placeholder={t("label_select_currency")}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* BOOKING AMOUNT  */}
                        <TextField
                          id="booking_amount"
                          type={"number"}
                          label={t("booking_amount")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={closedDealData?.booking_amount}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                        {/* BOOKING PERCENT */}
                        <TextField
                          id="booking_percent"
                          type={"number"}
                          // label={t("booked_perc")}
                          className="w-full"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={closedDealData?.booking_percent}
                          onChange={(e) => handleChange(e)}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <BsPercent size={18} color={"#777777"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    </Box>
                  </div>
                </div>

                {/* DISCOUNT */}
                <div className="px-2">
                  <h1
                    className={`text-center text-primary py-2 mb-5 uppercase font-semibold ${
                      withDiscount && "border-b-2 border-primary"
                    }`}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          checked={withDiscount}
                          onChange={() => toggleDiscount(!withDiscount)}
                        />
                      }
                      label={t("discount")}
                      className="font-semibold"
                    />
                  </h1>
                  {withDiscount && (
                    <div className="w-full pt-5">
                      <Box
                        sx={{
                          ...darkModeColors,
                          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                            {
                              right: isLangRTL(i18n.language)
                                ? "2.5rem"
                                : "inherit",
                              transformOrigin: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          "& legend": {
                            textAlign: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        }}
                      >
                        <div className="grid grid-cols-4">
                          {/* CURRENCY */}
                          <Select
                            id="currency"
                            options={currencies(t)}
                            value={currencies(t)?.find(
                              (curr) => curr.value === closedDealData?.currency
                            )}
                            onChange={(e) => {
                              setClosedDealsData({
                                ...closedDealData,
                                currency: e.value,
                              });
                            }}
                            placeholder={t("label_select_currency")}
                            // className={`mb-5`}
                            menuPortalTarget={document.body}
                            styles={selectStyles(currentMode, primaryColor)}
                          />
                          {/* DISCOUNT AMOUNT */}
                          <TextField
                            id="discount_amount"
                            type={"number"}
                            label={t("discount")}
                            className="w-full col-span-2"
                            sx={{
                              "&": {
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={closedDealData?.discount_amount}
                            onChange={(e) => handleChange(e)}
                          />
                          {/* DISCOUNT PERCENTAGE */}
                          <TextField
                            id="discount_percent"
                            type={"number"}
                            // label={t("paid_percent")}
                            className="w-full"
                            sx={{
                              "&": {
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={closedDealData?.discount_percent}
                            onChange={(e) => handleChange(e)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <BsPercent size={18} color={"#777777"} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </Box>
                    </div>
                  )}
                </div>

                {/* CASHBACK */}
                <div className="px-2">
                  <h1
                    className={`text-center text-primary py-2 mb-5 uppercase font-semibold ${
                      withCashback && "border-b-2 border-primary"
                    }`}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          checked={withCashback}
                          onChange={() => toggleCashback(!withCashback)}
                        />
                      }
                      label={t("cashback")}
                      className="font-semibold"
                    />
                  </h1>
                  {withCashback && (
                    <div className="w-full pt-5">
                      <Box
                        sx={{
                          ...darkModeColors,
                          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                            {
                              right: isLangRTL(i18n.language)
                                ? "2.5rem"
                                : "inherit",
                              transformOrigin: isLangRTL(i18n.language)
                                ? "right"
                                : "left",
                            },
                          "& legend": {
                            textAlign: isLangRTL(i18n.language)
                              ? "right"
                              : "left",
                          },
                        }}
                      >
                        <div className="grid grid-cols-4">
                          {/* CURRENCY */}
                          <Select
                            id="currency"
                            options={currencies(t)}
                            value={currencies(t)?.find(
                              (curr) => curr.value === closedDealData?.currency
                            )}
                            onChange={(e) => {
                              setClosedDealsData({
                                ...closedDealData,
                                currency: e.value,
                              });
                            }}
                            placeholder={t("label_select_currency")}
                            // className={`mb-5`}
                            menuPortalTarget={document.body}
                            styles={selectStyles(currentMode, primaryColor)}
                          />
                          {/* CASHBACK AMOUNT */}
                          <TextField
                            id="cashback_amount"
                            type={"number"}
                            label={t("cashback")}
                            className="w-full col-span-2"
                            sx={{
                              "&": {
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={closedDealData?.cashback_amount}
                            onChange={(e) => handleChange(e)}
                          />
                          {/* CASHBACK PERCENTAGE */}
                          <TextField
                            id="cashback_percent"
                            type={"number"}
                            // label={t("paid_percent")}
                            className="w-full"
                            sx={{
                              "&": {
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={closedDealData?.cashback_percent}
                            onChange={(e) => handleChange(e)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <BsPercent size={18} color={"#777777"} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      </Box>
                    </div>
                  )}
                </div>

                {/* CLIENT  DETAILS  */}
                {/* <div
                  className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("client_details")?.toUpperCase()}
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
                          disabled={loading ? true : false}
                          startIcon={
                            loading ? null : (
                              <MdFileUpload className="mx-2" size={16} />
                            )
                          }
                        >
                          <span>{t("label_passport_image")}</span>
                        </Button>
                      </label>
                    </Box>
                  </div>
                </div> */}
              </div>
            </>
          )}
          <div className="px-4">
            <Button
              type="submit"
              size="medium"
              style={{
                color: "white",
                fontFamily: fontFam,
              }}
              className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
              onClick={AddClosedDeal}
              disabled={btnloading ? true : false}
            >
              {btnloading ? (
                <CircularProgress
                  size={23}
                  sx={{ color: "white" }}
                  className="text-white"
                />
              ) : (
                <span>{t("close_deal")}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BookedDealsForm;
