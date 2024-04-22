import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Pagination,
} from "@mui/material";
import Select from "react-select";
// import { Select as libSelect } from "@mui/material";
import { FaHome, FaUser } from "react-icons/fa";

import { FaLinkedin } from "react-icons/fa";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { ImFacebook2 } from "react-icons/im";
import { FaInstagramSquare, FaTiktok, FaSnapchat } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { CountryDropdown } from "react-country-region-selector";
import { FaStripe, FaPaypal, FaUniversity, FaCreditCard } from "react-icons/fa";
import { useRef } from "react";
import { FaWallet } from "react-icons/fa";
import {
  commission_type,
  countries_list,
  currencies,
  invoice_category,
  payment_source,
  payment_status,
  transaction_type,
} from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import { MdFileUpload } from "react-icons/md";
import SingleTransactionModal from "./SingleTransactionModal";

const Transactions = () => {
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

  const [loading, setloading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("auth-token");
  const [vendors, setVendors] = useState([]);

  console.log("vendors array:: ", vendors);

  const imagesInputRef = useRef(null);

  const [addTransactionData, setAddTransactionData] = useState({
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

  console.log("addtransaction:: ", addTransactionData);

  console.log(
    "find find vendor: ",
    vendors?.filter((ven) => ven?.id === addTransactionData?.user_id)
  );

  const [filtersData, setFilterData] = useState({
    user_id: "",
    invoice_type: "",
    amount: "",
    currency: "",
    comm_percent: "",
    country: "",
    status: "",
    paid_by: "",
    vendor_id: "",
    category: "",
  });

  console.log("filter data:: ", addTransactionData);

  const handleChange = (e, filter) => {
    console.log("filter: ", filter);
    const id = e.target.id;
    const value = e.target.value;

    if (filter) {
      setFilterData({
        ...filtersData,
        [id]: value,
      });

      return;
    }

    setAddTransactionData({
      ...addTransactionData,
      [id]: value,
    });
  };

  const clearFilter = () => {
    setFilterData({
      user_id: "",
      invoice_type: "",
      amount: "",
      currency: "",
      comm_percent: "",
      country: "",
      status: "",
      paid_by: "",
      vendor_id: "",
      category: "",
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

  const handleTransaction = async (e) => {
    e.preventDefault();

    setBtnLoading(true);
    // Check if any mandatory field is empty
    // for (const key of Object.keys(addTransactionData)) {
    //   if (
    //     [
    //       "invoice_type",
    //       "category",
    //       "country",
    //       "date",
    //       "status",
    //       "paid_by",
    //       "currency",
    //       "amount",
    //     ].includes(key) &&
    //     !addTransactionData[key]
    //   ) {
    //     toast.error(`${key} is required.`, {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //     setBtnLoading(false);

    //     return;
    //   }
    // }

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

  const fetchVendor = async () => {
    let url;

    if (
      addTransactionData?.category.toLowerCase() === "salary" ||
      filtersData?.category.toLowerCase() === "salary"
    ) {
      url = `${BACKEND_URL}/users`;
    } else {
      url = `${BACKEND_URL}/vendors`;
    }
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("vendors list:: ", response);

      if (
        addTransactionData?.category.toLowerCase() === "salary" ||
        filtersData?.category.toLowerCase() === "salary"
      ) {
        setVendors(response?.data?.managers?.data);
      } else {
        setVendors(response?.data?.data?.data);
      }
    } catch (error) {
      setloading(false);
      console.error("Error fetching transactions:", error);
      toast.error("Unable to fetch vendors", {
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

  const fetchTransactions = async () => {
    setloading(true);
    try {
      // Filter out empty values and construct query parameters
      const activeFilters = Object.entries(filtersData).reduce(
        (acc, [key, value]) => {
          if (value !== "") acc[key] = value;
          return acc;
        },
        {}
      );
      const queryParams =
        Object.keys(activeFilters).length > 0
          ? `?${new URLSearchParams(activeFilters).toString()}`
          : "";

      console.log("activeFilters:: ", activeFilters);
      console.log("queryParams:: ", queryParams);

      const response = await axios.get(
        `${BACKEND_URL}/invoices${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("transactions list:: ", response);
      setTransactionsData(response?.data?.data);

      if (vendors?.length == 0) {
        await fetchVendor();
      }
    } catch (error) {
      setloading(false);
      console.error("Error fetching transactions:", error);
      toast.error("Unable to fetch the Transactions", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    console.log("hhhhhiiiiiiiiihhhhhhhhhi");
    fetchTransactions();
  }, [filtersData]);

  useEffect(() => {
    console.log("hhhhhiiiiiiiiihhhhhhhhhi");
    fetchVendor();
  }, [addTransactionData?.category, filtersData?.category]);

  return (
    <div
      className={`p-3 rounded-lg ${
        themeBgImg &&
        (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5 py-5">
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
          className={`p-4 ${
            !themeBgImg &&
            (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
          }`}
        >
          <h3 className="text-primary text-center font-semibold text-lg">{` ${t(
            "new_transaction"
          )}`}</h3>
          <br></br>
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
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
            required={true}
          />
          <Select
            id="invoice_type"
            options={commission_type(t)?.map((trans) => ({
              value: trans.value,
              label: trans.label,
            }))}
            value={commission_type(t)?.filter(
              (comm) => comm?.value === addTransactionData?.invoice_type
            )}
            onChange={(e) => {
              setAddTransactionData({
                ...addTransactionData,
                invoice_type: e.value,
              });
            }}
            placeholder={t("type")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
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
            className={`mb-5`}
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
            className={`mb-5`}
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
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          {/* <Select
            // id="vendor_id"
            options={
              vendors &&
              vendors?.map((ven) => ({
                value: ven.id,
                label:
                  addTransactionData?.category.toLowerCase() === "salary"
                    ? ven?.userName
                    : ven.vendor_name,
              }))
            }
            // value={
            //   vendors?.find((ven) =>
            //     addTransactionData?.category.toLowerCase() === "salary"
            //       ? ven?.id === addTransactionData?.user_id
            //       : ven?.id === addTransactionData?.vendor_id
            //   )?.vendor_name
            // }
            value={
              vendors?.find((ven) =>
                addTransactionData?.category.toLowerCase() === "salary"
                  ? ven?.id === addTransactionData?.user_id
                  : ven?.id === addTransactionData?.vendor_id
              ) && {
                value:
                  addTransactionData?.category.toLowerCase() === "salary"
                    ? addTransactionData?.user_id
                    : addTransactionData?.vendor_id,
                label: vendors?.find((ven) =>
                  addTransactionData?.category.toLowerCase() === "salary"
                    ? ven?.id === addTransactionData?.user_id
                    : ven?.id === addTransactionData?.vendor_id
                )?.vendor_name, // This should be the property that matches the label structure
              }
            }
            onChange={(e) => {
              console.log("e vendor:: ", e);
              console.log(
                "find vendor :: ",
                vendors?.find((ven) => ven?.id === e.value)?.vendor_name
              );

              setAddTransactionData({
                ...addTransactionData,

                vendor_id:
                  addTransactionData?.category.toLowerCase() === "salary"
                    ? null
                    : e.value,
                user_id:
                  addTransactionData?.category.toLowerCase() === "salary"
                    ? e.value
                    : null,
              });
            }}
            isLoading={loading}
            placeholder={
              addTransactionData?.category.toLowerCase() === "salary"
                ? t("user")
                : t("vendor")
            }
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          /> */}
          {addTransactionData?.category.toLowerCase() === "salary" ? (
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
              className={`mb-5`}
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
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
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
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <TextField
            id="comm_percent"
            type={"text"}
            label={t("percent")}
            className="w-full mt-3"
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
            className="w-full mt-3"
            style={{
              marginBottom: "20px",
            }}
            variant="outlined"
            name="bussiness_name"
            size="small"
            value={addTransactionData.amount}
            onChange={handleChange}
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
              className="bg-btn-primary w-max text-white rounded-lg py-3 font-semibold my-3"
              style={{
                color: "#ffffff",
                border: "1px solid white",
                fontFamily: fontFam,
                marginBottom: "3px",
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
        {/* transactions list */}
        <div>
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
            className="p-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : (
              <div className="h-[600px] overflow-y-scroll ">
                {transactionsData && transactionsData?.length > 0 ? (
                  transactionsData?.map((trans) => {
                    let user;
                    if (trans?.invoice?.category?.toLowerCase() === "salary") {
                      user = true;
                    } else {
                      user = false;
                    }

                    return (
                      <>
                        <div
                          className="mb-9 mx-3 cursor-pointer"
                          onClick={() => setSingleTransModal(trans)}
                        >
                          <p>{trans?.invoice?.date}</p>
                          <div className="flex items-center justify-between my-3">
                            <div>
                              <div className="flex flex-col">
                                <div className="flex items-center mb-1">
                                  <span className="border rounded-md p-3 mr-3">
                                    {user ? <FaUser /> : <FaHome size={20} />}
                                  </span>
                                  <p>
                                    {user
                                      ? trans?.user?.userName
                                      : trans?.vendor?.vendor_name}
                                  </p>
                                </div>
                                <p className="text-sm self-start pl-[calc(20px+2rem)]">
                                  {trans?.invoice?.category}
                                </p>
                              </div>
                            </div>
                            <div>
                              <p
                                className={`font-semibold ${
                                  trans?.invoice?.invoice_type == "Income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                } `}
                              >
                                {trans?.invoice?.invoice_type === "Income"
                                  ? "+"
                                  : "-"}{" "}
                                {trans?.invoice?.currency}{" "}
                                {trans?.invoice?.amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div>
                    <h1>{t("no_data_found")}</h1>
                  </div>
                )}
              </div>
            )}
          </Box>
        </div>

        {/* filters form */}
        <div
          className={`${
            !themeBgImg &&
            (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
          }
              } rounded-lg p-5`}
        >
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
            className={`p-4 ${
              !themeBgImg &&
              (currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#EEEEEE]")
            }`}
          >
            <h3 className="text-primary text-center font-semibold text-lg">{` ${t(
              "btn_filters"
            )}`}</h3>
            <br></br>
            <Select
              id="category"
              options={invoice_category(t)?.map((trans) => ({
                value: trans.value,
                label: trans.label,
              }))}
              value={invoice_category(t)?.filter(
                (trans) => trans?.value === filtersData?.category
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  category: e.value,
                });
              }}
              placeholder={t("label_category")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <Select
              id="invoice_type"
              options={commission_type(t)?.map((trans) => ({
                value: trans.value,
                label: trans.label,
              }))}
              value={commission_type(t)?.filter(
                (comm) => comm?.value === filtersData?.invoice_type
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  invoice_type: e.value,
                });
              }}
              placeholder={t("type")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />

            <Select
              id="country"
              options={countries_list(t)?.map((country) => ({
                value: country.value,
                label: country.label,
              }))}
              value={countries_list(t)?.filter(
                (country) => country?.value === filtersData?.country
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  country: e.value,
                });
              }}
              placeholder={t("label_country")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />

            <Select
              id="status"
              options={payment_status(t)?.map((pay_status) => ({
                value: pay_status?.value,
                label: pay_status?.label,
              }))}
              value={payment_status(t)?.filter(
                (pay_status) => pay_status?.value === filtersData?.status
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  status: e.value,
                });
              }}
              placeholder={t("status")}
              className={`mb-5`}
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
                (payment) => payment?.value === filtersData?.paid_by
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  paid_by: e.value,
                });
              }}
              placeholder={t("payment_source")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            {/* <Select
              id="vendor_id"
              options={
                vendors &&
                vendors?.map((ven) => ({
                  value: ven.id,
                  label:
                    filtersData?.category.toLowerCase() === "salary"
                      ? ven?.userName
                      : ven.vendor_name,
                }))
              }
              value={
                vendors?.find((ven) =>
                  filtersData?.category.toLowerCase() === "salary"
                    ? ven?.id === filtersData?.user_id
                    : ven?.id === filtersData?.vendor_id
                )?.vendor_name
              }
              onChange={(e) => {
                setFilterData({
                  ...filtersData,

                  vendor_id:
                    filtersData?.category.toLowerCase() === "salary"
                      ? null
                      : e.value,
                  user_id:
                    filtersData?.category.toLowerCase() === "salary"
                      ? e.value
                      : null,
                });
              }}
              isLoading={loading}
              placeholder={
                filtersData?.category.toLowerCase() === "salary"
                  ? t("user")
                  : t("vendor")
              }
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            /> */}
            {filtersData?.category.toLowerCase() === "salary" ? (
              <Select
                id="user_id"
                options={
                  vendors &&
                  vendors?.map((ven) => ({
                    value: ven.id,
                    label: ven.userName,
                  }))
                }
                value={
                  vendors?.filter((ven) => ven?.id === filtersData?.user_id)
                    ?.userName
                }
                onChange={(e) => {
                  setFilterData({
                    ...filtersData,
                    vendor_id: null,
                    user_id: e.value,
                  });
                }}
                isLoading={loading}
                placeholder={t("user")}
                className={`mb-5`}
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
                  vendors?.filter((ven) => ven?.id === filtersData?.vendor_id)
                    ?.vendor_name
                }
                onChange={(e) => {
                  setFilterData({
                    ...filtersData,
                    vendor_id: e.value,
                    user_id: null,
                  });
                }}
                isLoading={loading}
                placeholder={t("vendor")}
                className={`mb-5`}
                menuPortalTarget={document.body}
                styles={selectStyles(currentMode, primaryColor)}
              />
            )}

            <Select
              id="currency"
              options={currencies(t)?.map((curr) => ({
                value: curr.value,
                label: curr.label,
              }))}
              value={currencies(t)?.filter(
                (curr) => curr?.value === filtersData?.currency
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  currency: e.value,
                });
              }}
              placeholder={t("label_currency")}
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <TextField
              id="comm_percent"
              type={"text"}
              label={t("percent")}
              className="w-full mt-3"
              style={{
                marginBottom: "20px",
              }}
              variant="outlined"
              name="bussiness_name"
              size="small"
              value={filtersData.comm_percent}
              onChange={(e) => handleChange(e, "filter")}
            />
            <TextField
              id="amount"
              type={"text"}
              label={t("amount")}
              className="w-full mt-3"
              style={{
                marginBottom: "20px",
              }}
              variant="outlined"
              name="bussiness_name"
              size="small"
              value={filtersData.amount}
              onChange={(e) => handleChange(e, "filter")}
            />

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
              onClick={clearFilter}
            >
              <span>{t("clear_all")}</span>
            </Button>
          </Box>
        </div>
      </div>
      {singleTransModal && (
        <SingleTransactionModal
          singleTransModal={singleTransModal}
          setSingleTransModal={setSingleTransModal}
        />
      )}
    </div>
  );
};

export default Transactions;
