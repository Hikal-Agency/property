import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
  FormControl,
  MenuItem,
} from "@mui/material";
import Select from "react-select";

import {
  currencies,
  enquiry_options,
  feedback_options,
} from "../../Components/_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../../Components/_elements/SelectStyles";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CommissionReqModal = ({
  commReqModal,
  setCommReqModal,
  newFeedback,
  Feedback,
}) => {
  console.log("Commission req modal: ", commReqModal);
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

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [updatedField, setUpdatedField] = useState("");

  const searchRef = useRef();

  const [commReqData, setCommReqData] = useState({
    vendor_id: null,
    vendor_name: null,
    address: null,
    trn: null,
    unit: commReqModal?.unit || null,
    date: moment(Feedback?.creationDate).format("YYYY-MM-DD"),
    currency: commReqModal?.currency || "AED",
    comm_amount: commReqModal?.comm_amount || null,
    comm_percent: commReqModal?.comm_percent || null,
    project: commReqModal?.unit || null,
    leadName: commReqModal?.leadName || null,
    amount: commReqModal?.amount || null,
    vat: commReqModal?.vat || null,
    total: null,
    company: "HIKAL REAL STATE LLC" || null,
    company_trn: "100587185800003" || null,
    company_email: "info@hikalagency.ae" || null,
    company_tele: "+97142722249" || null,
    bank_name: "EMIRATES ISLAMIC" || null,
    bank_address: "EI SHK ZAYED RD AL WASL TOWER" || null,
    bank_acc_name: "HIKAL REAL STATE L.L.C." || null,
    bank_acc_no: "3708453323701" || null,
    bank_iban: "AE810340003708453323701" || null,
    bank_swift_code: "MEBLAEAD" || null,
  });

  console.log("comm req data:: ", commReqData);

  const fetchVendors = async () => {
    setLoading(true);
    const vendorUrl = `${BACKEND_URL}/vendors`;

    try {
      const vendorsList = await axios.get(vendorUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("vendors list:: ", vendorsList);

      setVendors(vendorsList?.data?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
      toast.error("Unable to fetch data", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const fetchUsers = async (title) => {
    try {
      let url = "";

      url = `${BACKEND_URL}/vendors?vendor_name=${title}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("vendors: ", response);

      setVendors(response?.data?.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch vendors.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleChange = (e) => {
    console.log("E::: ", e);
    const value = e.target.value;
    const id = e.target.id;

    setCommReqData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setUpdatedField(id);
  };

  useEffect(() => {
    const { amount, paid_percent, booking_amount, paid_amount } = commReqData;

    if (updatedField === "amount" || updatedField === "paid_percent") {
      autoCalculate("paid_amount", amount, paid_percent);
    }
    if (updatedField === "amount" || updatedField === "booking_amount") {
      autoCalculate("booking_percent", amount, booking_amount);
    }
    if (updatedField === "amount" || updatedField === "paid_amount") {
      autoCalculate("paid_percent", amount, paid_amount);
    }
  }, [
    commReqData.amount,
    commReqData.paid_percent,
    commReqData.booking_amount,
    commReqData.paid_amount,
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
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setCommReqModal(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const token = localStorage.getItem("auth-token");
  const AddClosedDeal = () => {
    setbtnloading(true);
    // if (!commReqData?.passport) {
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
      .post(`${BACKEND_URL}/closedDeals`, commReqData, {
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

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <Modal
      keepMounted
      open={commReqModal}
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
                    {t("generate_comm_req")}
                  </h1>
                </h1>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {/* PROJECT DETAILS  */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("project_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
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
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.project}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                      {/* ENQUIRY  */}
                      {/* <TextField
                        id="enquiryType"
                        type={"text"}
                        label={t("label_enquiry_for")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData.enquiryType}
                        onChange={(e) => handleChange(e)}
                        required
                      /> */}

                      {/* CLIENT NAME */}
                      <TextField
                        id="leadName"
                        type={"text"}
                        label={t("label_lead_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.leadName}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      {/* UNIT */}
                      <TextField
                        id="unit"
                        type={"text"}
                        label={t("unit")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.unit}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      <div className="grid grid-cols-3">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === commReqData?.currency
                          )}
                          onChange={(e) => {
                            setClosedDealsData({
                              ...commReqData,
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
                          value={commReqData?.amount}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                      </div>
                    </Box>
                  </div>
                </div>

                {/* DEVELOPER DETAILS  */}
                <div
                  className={`px-5 pt-5 \ rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("developer_detail")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                        // marginTop:"20p"
                      }}
                    >
                      {/* VENDORS LIST */}
                      <FormControl
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                        sx={{
                          minWidth: "100%",
                          // border: 1,
                          borderRadius: 1,
                          marginBottom: "10px",
                        }}
                      >
                        <TextField
                          id="vendor_id"
                          select
                          value={commReqData?.vendor_id || "selected"}
                          label={t("vendor")}
                          onChange={(e) => {
                            const singleVendor = vendors?.find(
                              (ven) => ven?.id === e.target.value
                            );
                            console.log("singlevendor: ", singleVendor);
                            setCommReqData({
                              ...commReqData,
                              vendor_id: e.target.value,
                              vendor_name: singleVendor?.vendor_name,
                              address: singleVendor?.address,
                              trn: singleVendor?.trn,
                            });
                          }}
                          size="small"
                          className="w-full border border-gray-300 rounded "
                          displayEmpty
                          required
                          sx={{
                            // border: "1px solid #000000",
                            height: "40px",

                            "& .MuiSelect-select": {
                              fontSize: 11,
                            },
                          }}
                        >
                          <MenuItem selected value="selected">
                            ---{t("select_vendor")}----
                          </MenuItem>
                          <MenuItem
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <TextField
                              placeholder={t("search_vendors")}
                              ref={searchRef}
                              sx={{
                                "& input": {
                                  border: "0",
                                },
                              }}
                              variant="standard"
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 3) {
                                  fetchUsers(value);
                                }
                              }}
                            />
                          </MenuItem>

                          {vendors?.map((vendor) => (
                            <MenuItem value={vendor?.id}>
                              {vendor?.vendor_name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </FormControl>

                      {/* VENDOR NAME */}
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
                        value={commReqData?.vendor_name}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      {/* VENDOR ADDRESS */}
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
                        value={commReqData?.address}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      {/* TRN */}
                      <TextField
                        id="trn"
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
                        value={commReqData?.trn}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* COMMISSION DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("commission_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
                      {/* BOOKING DATE  */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={commReqData?.date}
                          label={t("date")}
                          views={["day", "month", "year"]}
                          onChange={(newValue) => {
                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setClosedDealsData((prev) => ({
                              ...prev,
                              date: formattedDate,
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

                      {/* COMMISSION AMOUNT */}
                      <TextField
                        id="comm_amount"
                        type={"number"}
                        label={t("comm_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.comm_amount}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMMISSION PERCENT */}
                      <TextField
                        id="comm_percent"
                        type={"number"}
                        label={t("comm_perc")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.comm_percent}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* VAT AMOUNT*/}
                      <TextField
                        id="vat"
                        type={"number"}
                        label={t("vat")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.vat}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* TOTAL AMOUNT*/}
                      <TextField
                        id="total"
                        type={"number"}
                        label={t("total")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.total}
                        onChange={(e) =>
                          setCommReqData({
                            ...commReqData,
                            total: commReqData?.comm_amount + commReqData?.vat,
                          })
                        }
                      />
                    </Box>
                  </div>
                </div>

                {/* COMPANY DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("company_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
                      {/* COMPANY NAME  */}
                      <TextField
                        id="company"
                        type={"text"}
                        label={t("company_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.company}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMPANY TRN */}
                      <TextField
                        id="company_trn"
                        type={"number"}
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
                        value={commReqData?.company_trn}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMPANY EMAIL */}
                      <TextField
                        id="company_email"
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
                        value={commReqData?.company_email}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMPANY TELEPHONE */}
                      <TextField
                        id="company_tele"
                        type={"text"}
                        label={t("company_tele")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.company_tele}
                        onChange={(e) => handleChange(e)}
                      />
                    </Box>
                  </div>
                </div>

                {/* BANK DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("bank_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
                      {/* BANK NAME  */}
                      <TextField
                        id="bank_name"
                        type={"text"}
                        label={t("bank_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_name}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK ADDRESS */}
                      <TextField
                        id="bank_address"
                        type={"text"}
                        label={t("bank_address")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_address}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK ACC NAME */}
                      <TextField
                        id="bank_acc_name"
                        type={"text"}
                        label={t("bank_acc_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_acc_name}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK ACC NO */}
                      <TextField
                        id="bank_acc_no"
                        type={"number"}
                        label={t("bank_acc_no")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_acc_no}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK IBAN */}
                      <TextField
                        id="bank_iban"
                        type={"text"}
                        label={t("bank_iban")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_iban}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* SWIFT CODE */}
                      <TextField
                        id="bank_swift_code"
                        type={"text"}
                        label={t("bank_swift_code")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_swift_code}
                        onChange={(e) => handleChange(e)}
                      />
                    </Box>
                  </div>
                </div>
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
                <span>{t("create")}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CommissionReqModal;
