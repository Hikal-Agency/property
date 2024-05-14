import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
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

import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AddTransactionForm = ({
  fetchTransactions,
  pathname,
  isUrl,
  setAddTransactionData,
  addTransactionData,
  user,
  vendors,
  loading,
}) => {
  console.log("user list: ", user);
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

  const [btnLoading, setBtnLoading] = useState(false);
  const token = localStorage.getItem("auth-token");

  console.log("addtransaction:: ", addTransactionData);
  const handleChange = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setAddTransactionData({
      ...addTransactionData,
      [id]: value,
    });
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    const reader = new FileReader();
    reader.onload = () => {
      // setImagePreview(reader.result);

      const base64Image = reader.result;
      setAddTransactionData({
        ...addTransactionData,
        image: file,
      });
    };
    reader.readAsDataURL(file);
  };

  // Define an error state object
  const [fieldErrors, setFieldErrors] = useState({
    invoice_type: false,
    amount: false,
    date: false,
    currency: false,
    category: false,
  });

  console.log("field errors:: ", fieldErrors);

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

    setBtnLoading(true);

    try {
      const submitTransaction = await axios.post(
        `${BACKEND_URL}/invoices`,
        addTransactionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

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

      toast.success("Transaction Added.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      fetchTransactions();

      setAddTransactionData({
        user_id: "",
        invoice_type: "",
        amount: "",
        date: "",
        currency: "",
        comm_percent: "",
        country: "",
        status: "",
        paid_by: "",
        vendor_id: "",
        category: "",
        image: "",
      });

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
        className={`p-4 rounded-xl shadow-sm ${
          !themeBgImg &&
          (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
        }`}
      >
        <h3 className="text-primary mb-5 text-center font-semibold">{` ${t(
          "new_transaction"
        )}`}</h3>
        <Select
          id="category"
          options={invoice_category(t)?.map((trans) => ({
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
        <Select
          id="invoice_type"
          options={commission_type(t)?.map((trans) => ({
            value: trans.value,
            label: trans.value,
          }))}
          value={
            commission_type(t)?.filter(
              (comm) => comm?.value === addTransactionData?.invoice_type
            )?.value
          }
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={addTransactionData?.date}
            label={t("date")}
            views={["day", "month", "year"]}
            onChange={(newValue) => {
              const formattedDate = moment(newValue?.$d).format("YYYY-MM-DD");

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
            maxDate={dayjs().startOf("day").toDate()}
          />
        </LocalizationProvider>
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

        {isUrl ? (
          addTransactionData?.category.toLowerCase() === "salary" ? (
            <Select
              id="user_id"
              options={
                vendors &&
                vendors?.map((ven) => ({
                  value: ven.id,
                  label: ven.userName,
                }))
              }
              // value={addTransactionData?.user_id}
              value={
                vendors?.filter(
                  (ven) => ven?.id === addTransactionData?.user_id
                )?.userName
              }
              onChange={(e) => {
                console.log("e value: ", e);
                setAddTransactionData({
                  ...addTransactionData,
                  vendor_id: null,
                  user_id: e.value,
                });
              }}
              isLoading={loading}
              placeholder={t("user")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
          ) : (
            <Select
              id="vendor_id"
              options={
                vendors &&
                vendors?.map((ven) => ({
                  value: ven.id,
                  label: ven.vendor_name,
                }))
              }
              value={
                vendors?.filter(
                  (ven) => ven?.id === addTransactionData?.vendor_id
                )?.vendor_name
              }
              onChange={(e) => {
                setAddTransactionData({
                  ...addTransactionData,
                  vendor_id: e.value,
                  user_id: null,
                });
              }}
              isLoading={loading}
              placeholder={t("vendor")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
          )
        ) : (
          <>
            <Select
              id="user_id"
              options={
                user &&
                user?.map((user) => ({
                  value: user.id,
                  label: user.userName,
                }))
              }
              // value={addTransactionData?.user_id}
              value={
                user?.filter((user) => user?.id === addTransactionData?.user_id)
                  ?.userName
              }
              onChange={(e) => {
                console.log("e value: ", e);
                setAddTransactionData({
                  ...addTransactionData,
                  user_id: e.value,
                });
              }}
              isLoading={loading}
              placeholder={t("user")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />

            <Select
              id="vendor_id"
              options={
                vendors &&
                vendors?.map((ven) => ({
                  value: ven.id,
                  label: ven.vendor_name,
                }))
              }
              value={
                vendors?.filter(
                  (ven) => ven?.id === addTransactionData?.vendor_id
                )?.vendor_name
              }
              onChange={(e) => {
                setAddTransactionData({
                  ...addTransactionData,
                  vendor_id: e.value,
                });
              }}
              isLoading={loading}
              placeholder={t("vendor")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
          </>
        )}

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
          // className={`mb-5`}
          menuPortalTarget={document.body}
          // styles={selectStyles(currentMode, primaryColor)}
          styles={getMergedStyles(
            fieldErrors.currency,
            selectStyles(currentMode, primaryColor)
          )}
        />
        <TextField
          id="comm_percent"
          type={"text"}
          label={t("percent")}
          className="w-full"
          style={{
            marginBottom: "20px",
          }}
          variant="outlined"
          name="bussiness_name"
          size="small"
          value={addTransactionData.comm_percent}
          onChange={handleChange}
        />
        <TextField
          id="amount"
          type={"text"}
          label={t("amount")}
          className={`w-full `}
          sx={{
            marginBottom: "20px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: fieldErrors?.amount === true && "#DA1F26 !important",
            },
          }}
          variant="outlined"
          name="bussiness_name"
          size="small"
          value={addTransactionData.amount}
          onChange={handleChange}
          error={fieldErrors.amount}
        />

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

        <Button
          variant="contained"
          size="lg"
          className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
          style={{
            // backgroundColor: "#111827",
            color: "#ffffff",
            // border: "1px solid #DA1F26",
          }}
          // component="span"
          // disabled={setBtnLoading ? true : false}
          onClick={handleTransaction}
        >
          {btnLoading ? (
            <CircularProgress />
          ) : (
            <span>{t("btn_new_transaction")}</span>
          )}
        </Button>
      </Box>
    </>
  );
};

export default AddTransactionForm;
