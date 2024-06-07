import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";

import {
  commission_type,
  countries_list,
  currencies,
  invoice_category,
  payment_source,
  payment_status,
} from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import { MdFileUpload } from "react-icons/md";
import axios from "../../axoisConfig";
import { BsFileEarmarkMedical } from "react-icons/bs";

import { toast } from "react-toastify";

const NewTransactionForm = ({
  fetchTransactions,
  setAddTransactionData,
  addTransactionData,
  user,
  vendors,
  loading,
  fetchUsers,
  edit,
  transData,
  handleClose,
  fullRow,
  visa,
}) => {
  console.log("user list: ", user);
  console.log("visa: ", visa);
  const {
    currentMode,
    darkModeColors,
    formatNum,
    BACKEND_URL,
    User,
    t,
    primaryColor,
    themeBgImg,
    fontFam,
    isLangRTL,
    i18n,
  } = useStateContext();
  const searchRef = useRef();

  const [btnLoading, setBtnLoading] = useState(false);
  const [includeVat, setIncludeVat] = useState(false);
  const [pettyCash, setPettyCash] = useState(false);
  const [updatedField, setUpdatedField] = useState();
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const token = localStorage.getItem("auth-token");

  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setAddTransactionData({
      ...addTransactionData,
      [id]: value,
    });

    // if (id === "total_amount" && includeVat === false) {
    //   setAddTransactionData({
    //     ...addTransactionData,
    //     amount: addTransactionData?.total_amount,
    //   });
    // }
    setUpdatedField(id);
  };

  // VAT TOGGLE
  const toggleVat = (value) => {
    setIncludeVat(value);
    if (value === true) {
      autoCalculate("total_amount");
    } else {
      setAddTransactionData({
        ...addTransactionData,
        vat: 0,
        amount: addTransactionData?.total_amount,
      });
    }
  };

  useEffect(() => {
    if (includeVat) {
      autoCalculate(updatedField);
    } else {
      console.log("VAT NOT INCLUDED!");
      if (updatedField === "total_amount" && includeVat === false) {
        setAddTransactionData({
          ...addTransactionData,
          amount: addTransactionData?.total_amount,
        });
      }
    }
  }, [
    updatedField,
    addTransactionData?.amount,
    addTransactionData?.vat,
    addTransactionData?.total_amount,
  ]);

  const autoCalculate = (upField) => {
    const inclVat = includeVat;
    if (inclVat === false) {
      setAddTransactionData((prevData) => ({
        ...prevData,
        vat: 0,
        amount: addTransactionData?.total_amount,
        total_amount: addTransactionData?.total_amount,
      }));
    } else {
      if (upField === "total_amount") {
        const totalAmount = parseFloat(addTransactionData.total_amount);
        if (!isNaN(totalAmount)) {
          let vat = totalAmount * (100 / 105) * (5 / 100);
          vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
          let amount = totalAmount - parseFloat(vat);
          amount = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);

          setAddTransactionData((prevData) => ({
            ...prevData,
            vat: vat,
            amount: amount,
            total_amount: totalAmount,
          }));
        }
      }
      if (upField === "amount") {
        const amount = parseFloat(addTransactionData.amount);
        if (!isNaN(amount)) {
          let vat = amount * (5 / 100);
          vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
          let totalAmount = amount + parseFloat(vat);
          totalAmount =
            totalAmount % 1 === 0
              ? totalAmount.toFixed(0)
              : totalAmount.toFixed(2);
          setAddTransactionData((prevData) => ({
            ...prevData,
            vat: vat,
            amount: amount,
            total_amount: totalAmount,
          }));
        }
      }
      if (upField === "vat") {
        const vat = parseFloat(addTransactionData.vat);
        let totalAmount = parseFloat(addTransactionData.total_amount);
        let amount = parseFloat(addTransactionData.amount);
        if (!isNaN(vat)) {
          if (!isNaN(totalAmount)) {
            amount = parseFloat(totalAmount) - parseFloat(vat);
            amount = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
          }
          if (!isNaN(amount)) {
            totalAmount = parseFloat(amount) + parseFloat(vat);
            totalAmount =
              totalAmount % 1 === 0
                ? totalAmount.toFixed(0)
                : totalAmount.toFixed(2);
          }
          setAddTransactionData((prevData) => ({
            ...prevData,
            vat: vat,
            amount: amount,
            total_amount: totalAmount,
          }));
        }
      }
    }
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    if (file && file.type.startsWith("image/")) {
      setPdfPreview(null);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);

        const base64Image = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setPdfPreview(true);
    }

    setAddTransactionData({
      ...addTransactionData,
      image: file,
    });
  };

  // Define an error state object
  const [fieldErrors, setFieldErrors] = useState({
    invoice_type: false,
    amount: false,
    date: false,
    currency: false,
    category: false,
  });

  // Function to parse the error message and update the error state
  const handleApiErrors = (message) => {
    const requiredFields = [
      "Invoice Type",
      "Category",
      "Date",
      "Amount",
      "Currency",
    ];
    const errors = {
      invoice_type: false,
      amount: false,
      date: false,
      currency: false,
      category: false,
    };

    requiredFields.forEach((field) => {
      if (message.includes(field)) {
        const fieldKey = field.toLowerCase().replace(/ /g, "_"); // Convert field name to match state keys
        errors[fieldKey] = true;
      }
    });

    setFieldErrors(errors);
  };

  const handleTransaction = async (e) => {
    e.preventDefault();

    setFieldErrors({
      invoice_type: false,
      amount: false,
      date: false,
      currency: false,
      category: false,
    });

    if (visa && !addTransactionData?.image) {
      toast.error(`Invoice image is required`, {
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

    setBtnLoading(true);

    let url;
    if (edit) {
      url = `${BACKEND_URL}/invoices/${transData?.id}`;
    } else {
      url = `${BACKEND_URL}/invoices`;
    }

    try {
      const submitTransaction = await axios.post(url, addTransactionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      });

      console.log("transaction submited ", submitTransaction);

      if (submitTransaction?.data?.status === false) {
        toast.error(`${submitTransaction?.data?.message}`, {
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
        handleApiErrors(submitTransaction?.data?.message);

        return;
      }

      toast.success(`Transaction ${edit ? "Updated" : "Added"} `, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      if (edit) {
        handleClose();
      }

      fetchTransactions();

      if (!edit) {
        setAddTransactionData({
          user_id: "",
          invoice_type: visa ? "Expense" : "",
          amount: 0,
          total_amount: 0,
          date: "",
          currency: "AED",
          vat: 0,
          country: "",
          status: "Paid",
          paid_by: "",
          vendor_id: "",
          category: visa ? "Visa" : "",
          image: null,
        });

        setImagePreview(null);
      }

      setBtnLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setBtnLoading(false);
      toast.error("Something went wrong! Please Try Again", {
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

  // Function to merge selectStyles with error styles
  const getMergedStyles = (hasError, currentStyles) => {
    const errorStyles = {
      control: (provided) => ({
        ...provided,
        borderColor: hasError ? "red" : provided.borderColor,
        "&:hover": {
          borderColor: hasError ? "red" : provided.borderColor,
        },
        boxShadow: hasError ? "0 0 0 1px red" : provided.boxShadow,
        background: "transparent",
        color: currentMode === "dark" ? "#FFFFFF" : "#000000",
        height: "34x",
        minHeight: "34px",
        marginBottom: "20px !important",
      }),
    };

    // Merge the errorStyles with the currentStyles
    const mergedStyles = {
      ...currentStyles,
      control: (provided) => ({
        ...currentStyles.control(provided),
        ...errorStyles.control(provided),
      }),
    };

    return mergedStyles;
  };

  return (
    <>
      <Box
        sx={{
          ...darkModeColors,
          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
            {
              right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
              transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
            },
          "& legend": {
            textAlign: isLangRTL(i18n.language) ? "right" : "left",
          },
        }}
        className={`p-5 ${
          themeBgImg &&
          (currentMode === "dark" ? "blur-bg-black" : "blur-bg-white")
        } ${!themeBgImg && "py-0 rounded-xl shadow-sm"}`}
      >
        <h3 className="text-primary mb-5 text-center font-semibold">
          {visa
            ? t("visa")
            : edit
            ? t("edit_transaction_details")
            : t("new_transaction")}
        </h3>
        <div
          className={`grid grid-cols-1 ${
            fullRow &&
            (edit
              ? "md:grid-cols-2 lg:grid-cols-2 gap-5"
              : "md:grid-cols-2 lg:grid-cols-3 gap-5")
          }`}
        >
          {/* INVOICE DETAILS */}
          <div className="flex flex-col">
            {visa ? null : (
              <>
                {/* CATEGORY */}
                <Select
                  id="category"
                  options={invoice_category(t)
                    ?.filter((trans) => trans.value !== "Commission")
                    .map((trans) => ({
                      value: trans.value,
                      label: trans.label,
                    }))}
                  value={invoice_category(t)?.filter(
                    (trans) => trans?.value === addTransactionData?.category
                  )}
                  onChange={(e) => {
                    setAddTransactionData({
                      ...addTransactionData,
                      category: e.value,
                    });
                  }}
                  placeholder={t("label_category")}
                  // className={`mb-4`}
                  menuPortalTarget={document.body}
                  // styles={selectStyles(currentMode, primaryColor)}
                  styles={getMergedStyles(
                    fieldErrors.category,
                    selectStyles(currentMode, primaryColor)
                  )}
                  required={true}
                />
                {/* INVOICE TYPE */}
                <Select
                  id="invoice_type"
                  options={commission_type(t, false)?.map((trans) => ({
                    value: trans.value,
                    label: trans.value,
                  }))}
                  value={commission_type(t, false)?.filter(
                    (comm) => comm?.value === addTransactionData?.invoice_type
                  )}
                  onChange={(e) => {
                    console.log("commission type e: ", e);
                    setAddTransactionData({
                      ...addTransactionData,
                      invoice_type: e.value,
                    });
                  }}
                  placeholder={t("type")}
                  // className={`mb-5`}
                  menuPortalTarget={document.body}
                  // styles={selectStyles(currentMode, primaryColor)}
                  styles={getMergedStyles(
                    fieldErrors.invoice_type,
                    selectStyles(currentMode, primaryColor)
                  )}
                />
              </>
            )}
            {/* COUNTRY */}
            <Select
              id="country"
              options={countries_list(t)?.map((country) => ({
                value: country.value,
                label: country.label,
              }))}
              value={countries_list(t)?.filter(
                (country) => country?.value === addTransactionData?.country
              )}
              onChange={(e) => {
                setAddTransactionData({
                  ...addTransactionData,
                  country: e.value,
                });
              }}
              placeholder={t("label_country")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            {/* USER */}
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
                id="user_id"
                select
                value={addTransactionData?.user_id || "selected"}
                label={t("select_user")}
                onChange={(e) => {
                  setAddTransactionData({
                    ...addTransactionData,
                    user_id: e.target.value,
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
                  ---{t("select_user")}----
                </MenuItem>
                <MenuItem
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    // e.preventDefault();
                  }}
                >
                  <TextField
                    placeholder={t("search_users")}
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
                        fetchUsers(value, "user");
                      }
                    }}
                  />
                </MenuItem>

                {user?.map((user) => (
                  <MenuItem value={user?.id}>{user?.userName}</MenuItem>
                ))}
              </TextField>
            </FormControl>
            {/* VENDOR */}
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
                value={addTransactionData?.vendor_id || "selected"}
                label={t("vendor")}
                onChange={(e) => {
                  setAddTransactionData({
                    ...addTransactionData,
                    vendor_id: e.target.value,
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

                {vendors?.map((user) => (
                  <MenuItem value={user?.id}>{user?.vendor_name}</MenuItem>
                ))}
              </TextField>
            </FormControl>
          </div>
          {/* PAYMENT DETAILS */}
          <div className="flex flex-col">
            {/* INVOICE DATE */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={addTransactionData?.date}
                label={t("date")}
                views={["day", "month", "year"]}
                onChange={(newValue) => {
                  const formattedDate = moment(newValue?.$d).format(
                    "YYYY-MM-DD"
                  );

                  setAddTransactionData((prev) => ({
                    ...prev,
                    date: formattedDate,
                  }));
                }}
                format="DD-MM-YYYY"
                renderInput={(params) => (
                  <TextField
                    sx={{
                      "& input": {
                        color: currentMode === "dark" ? "white" : "black",
                      },
                      "& .MuiSvgIcon-root": {
                        color: currentMode === "dark" ? "white" : "black",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          fieldErrors?.date === true && "#DA1F26 !important",
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
              />
            </LocalizationProvider>
            {/* PAYMENT STATUS */}
            <Select
              id="status"
              options={payment_status(t)?.map((pay_status) => ({
                value: pay_status?.value,
                label: pay_status?.label,
              }))}
              value={payment_status(t)?.filter(
                (pay_status) => pay_status?.value === addTransactionData?.status
              )}
              onChange={(e) => {
                setAddTransactionData({
                  ...addTransactionData,
                  status: e.value,
                });
              }}
              placeholder={t("status")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            {/* PAYMENT SOURCE */}
            <Select
              id="paid_by"
              options={payment_source(t)?.map((payment) => ({
                value: payment.value,
                label: payment.label,
              }))}
              value={payment_source(t)?.filter(
                (payment) => payment?.value === addTransactionData?.paid_by
              )}
              onChange={(e) => {
                setAddTransactionData({
                  ...addTransactionData,
                  paid_by: e.value,
                });
              }}
              placeholder={t("payment_source")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            {/* TOTAL AMOUNT */}
            <div className="grid grid-cols-3">
              <Select
                id="currency"
                options={currencies(t)?.map((curr) => ({
                  value: curr.value,
                  label: curr.label,
                }))}
                value={currencies(t)?.filter(
                  (curr) => curr?.value === addTransactionData?.currency
                )}
                onChange={(e) => {
                  setAddTransactionData({
                    ...addTransactionData,
                    currency: e.value,
                  });
                }}
                placeholder={t("label_currency")}
                menuPortalTarget={document.body}
                styles={getMergedStyles(
                  fieldErrors.currency,
                  selectStyles(currentMode, primaryColor)
                )}
              />
              <TextField
                id="total_amount"
                type={"text"}
                label={t("total_amount")}
                className={`w-full col-span-2`}
                sx={{
                  marginBottom: "20px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      fieldErrors?.amount === true && "#DA1F26 !important",
                  },
                }}
                variant="outlined"
                name="total_amount"
                size="small"
                value={addTransactionData.total_amount}
                onChange={handleChange}
                error={fieldErrors.total_amount}
              />
            </div>
            {/* VAT TOGGLE */}
            <FormControlLabel
              control={
                <Checkbox
                  color="success"
                  checked={includeVat}
                  onChange={() => toggleVat(!includeVat)}
                />
              }
              label={t("including_vat")}
              className="mb-5"
            />
            {includeVat && (
              <>
                {/* VAT AMOUNT */}
                <div className="grid grid-cols-3">
                  <Select
                    id="currency"
                    options={currencies(t)?.map((curr) => ({
                      value: curr.value,
                      label: curr.label,
                    }))}
                    value={currencies(t)?.filter(
                      (curr) => curr?.value === addTransactionData?.currency
                    )}
                    onChange={(e) => {
                      setAddTransactionData({
                        ...addTransactionData,
                        currency: e.value,
                      });
                    }}
                    placeholder={t("label_currency")}
                    menuPortalTarget={document.body}
                    styles={getMergedStyles(
                      fieldErrors.currency,
                      selectStyles(currentMode, primaryColor)
                    )}
                  />
                  <TextField
                    id="vat"
                    type={"text"}
                    label={t("vat")}
                    className="w-full col-span-2"
                    style={{
                      marginBottom: "20px",
                    }}
                    variant="outlined"
                    name="vat"
                    size="small"
                    value={addTransactionData.vat}
                    onChange={handleChange}
                  />
                </div>
                {/* AMOUNT WITHOUT VAT */}
                <div className="grid grid-cols-3">
                  <Select
                    id="currency"
                    options={currencies(t)?.map((curr) => ({
                      value: curr.value,
                      label: curr.label,
                    }))}
                    value={currencies(t)?.filter(
                      (curr) => curr?.value === addTransactionData?.currency
                    )}
                    onChange={(e) => {
                      setAddTransactionData({
                        ...addTransactionData,
                        currency: e.value,
                      });
                    }}
                    placeholder={t("label_currency")}
                    menuPortalTarget={document.body}
                    styles={getMergedStyles(
                      fieldErrors.currency,
                      selectStyles(currentMode, primaryColor)
                    )}
                  />
                  <TextField
                    id="amount"
                    type={"text"}
                    label={t("amount")}
                    className={`w-full col-span-2`}
                    sx={{
                      marginBottom: "20px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          fieldErrors?.amount === true && "#DA1F26 !important",
                      },
                    }}
                    variant="outlined"
                    name="amount"
                    size="small"
                    value={addTransactionData.amount}
                    onChange={handleChange}
                    error={fieldErrors.amount}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col h-full justify-center items-center gap-5">
            {!edit && (
              <>
                {imagePreview && (
                  <div className="  mb-5 flex items-center justify-center ">
                    <div className=" rounded-lg border">
                      <img src={imagePreview} width="100px" height="100px" />
                    </div>
                  </div>
                )}
                {pdfPreview && (
                  <div className="flex flex-col justify-center items-center w-full gap-4">
                    <BsFileEarmarkMedical size={100} color={"#AAAAAA"} />
                    <div className="">
                      <p>File Selected </p>
                    </div>
                  </div>
                )}
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
                    className="bg-btn-primary w-max text-white rounded-lg py-3 font-semibold my-3 w-full"
                    style={{
                      color: "#ffffff",
                      border: "1px solid white",
                      fontFamily: fontFam,
                      marginBottom: "20px",
                      width: "100%",
                    }}
                    component="span" // Required so the button doesn't automatically submit form
                    disabled={loading ? true : false}
                    startIcon={<MdFileUpload className="mx-2" size={16} />}
                  >
                    <span>{t("upload_invoice")}</span>
                  </Button>
                </label>
              </>
            )}
          </div>
        </div>
        <Button
          variant="contained"
          size="lg"
          className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
          style={{
            color: "#ffffff",
          }}
          onClick={handleTransaction}
        >
          {btnLoading ? (
            <CircularProgress />
          ) : (
            <span>
              {edit ? t("btn_edit_transaction") : t("btn_new_transaction")}
            </span>
          )}
        </Button>
      </Box>
    </>
  );
};

export default NewTransactionForm;
