import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Stack,
  Pagination,
  FormControl,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Select from "react-select";
// import { Select as libSelect } from "@mui/material";
import { FaHome, FaUser } from "react-icons/fa";
import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { BsSearch } from "react-icons/bs";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useRef } from "react";
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

import {
  BsBuildings,
  BsQuestionLg,
  BsCart4,
  BsCalendarCheck,
} from "react-icons/bs";
import AddTransactionForm from "./AddTransactionForm";

const Transactions = ({ pathname }) => {
  const isUrl = pathname === "/transactions" ? true : false;
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
  const [vatData, setVAT] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [error, setError] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const searchRef = useRef("");

  console.log("vat data:", vatData);

  const token = localStorage.getItem("auth-token");
  const [vendors, setVendors] = useState([]);

  console.log("vendors array:: ", vendors);

  const imagesInputRef = useRef(null);

  const [addTransactionData, setAddTransactionData] = useState({
    user_id: "",
    invoice_type: "",
    amount: "",
    date: "",
    currency: "AED",
    comm_percent: "",
    country: "",
    status: "Paid",
    paid_by: "",
    vendor_id: "",
    category: "",
    image: null,
  });

  console.log("addtransaction:: ", addTransactionData);
  const [user, setUser] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  console.log("user array: ", user);

  const [page, setPage] = useState(1);

  console.log("page ", page);

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

  // Define an error state object
  const [fieldErrors, setFieldErrors] = useState({
    invoice_type: false,
    amount: false,
    date: false,
    currency: false,
    category: false,
  });

  console.log("field errors:: ", fieldErrors);

  const fetchVendor = async () => {
    const vendorUrl = `${BACKEND_URL}/vendors`;
    const userUrl = `${BACKEND_URL}/users`;

    try {
      const [vendorResponse, userResponse] = await Promise.all([
        axios.get(vendorUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(userUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);

      console.log("vendors list:: ", vendorResponse);
      console.log("users list:: ", userResponse);

      let usersList = userResponse?.data?.managers?.data;

      usersList?.filter((user) => user?.status === 1);

      setUser(usersList);
      setVendors(vendorResponse?.data?.data?.data);
    } catch (error) {
      setloading(false);
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

  const fetchUsers = async (title, type) => {
    try {
      let url = "";

      if (type === "user") {
        url = `${BACKEND_URL}/users?title=${title}`;
      } else {
        url = `${BACKEND_URL}/vendors?vendor_name=${title}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      if (type === "user") {
        setUser(response?.data?.managers?.data);
      } else {
        setVendors(response?.data?.data?.data);
      }

      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
      console.log(error);
      toast.error("Unable to fetch users.", {
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
          ? `&${new URLSearchParams(activeFilters).toString()}`
          : "";

      console.log("activeFilters:: ", activeFilters);
      console.log("queryParams:: ", queryParams);

      let url;
      if (isUrl) {
        url = `${BACKEND_URL}/invoices?page=${page}${queryParams}`;
      } else {
        url = `${BACKEND_URL}/invoices?page=${page}&added_by=${User?.id}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("transactions list:: ", response);

      setVAT(response?.data?.vat);
      setMaxPage(response?.data?.data?.last_page);
      setTransactionsData(response?.data?.data?.data);

      // if (vendors?.length == 0) {
      await fetchVendor();
      // }
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
  }, [filtersData, page, pathname]);

  return (
    <div
      className={` ${
        themeBgImg &&
        (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
      }`}
    >
      <div
        className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 ${
          isUrl
            ? "lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
            : "lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
        } gap-4`}
      >
        {/* NEW Transaction */}
        <AddTransactionForm
          fetchTransactions={fetchTransactions}
          pathname={pathname}
          isUrl={isUrl}
          addTransactionData={addTransactionData}
          setAddTransactionData={setAddTransactionData}
          user={user}
          vendors={vendors}
          loading={loading}
          fetchUsers={fetchUsers}
        />

        {/* transactions list */}
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
          className="p-4 h-[700px] overflow-y-scroll"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="">
              {transactionsData && transactionsData?.length > 0 ? (
                transactionsData?.map((trans) => {
                  let user;

                  if (trans?.user_id) {
                    user = true;
                  } else {
                    user = false;
                  }

                  return (
                    <>
                      <div
                        className="mb-4 cursor-pointer"
                        onClick={() => setSingleTransModal(trans)}
                      >
                        <p className="mb-3 font-semibold text-sm">
                          {moment(trans?.date).format("YYYY-MM-DD")}
                        </p>
                        <div className="flex justify-between gap-4 mb-4">
                          <div className="flex gap-4">
                            <div className="border w-fit h-fit border-[#AAAAAA] shadow-sm rounded-md p-3">
                              {trans?.category === "Commission" ? (
                                <BsBuildings size={16} color={"#AAAAAA"} />
                              ) : trans?.category === "Salary" ? (
                                <BsCalendarCheck size={16} color={"#AAAAAA"} />
                              ) : trans?.category === "Purchase" ? (
                                <BsCart4 size={16} color={"#AAAAAA"} />
                              ) : (
                                <BsQuestionLg size={16} color={"#AAAAAA"} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              {user ? (
                                <p>{trans?.user?.userName}</p>
                              ) : (
                                <p>
                                  {trans?.vendor?.type} -{" "}
                                  {trans?.vendor?.vendor_name}
                                </p>
                              )}
                              <div className="flex gap-1 text-sm">
                                <p
                                  className={
                                    trans?.status === "Paid"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {trans?.status}
                                </p>
                                <p> - {trans?.category}</p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <p
                              className={`font-semibold text-lg ${
                                trans?.invoice_type == "Income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              } `}
                            >
                              {trans?.invoice_type === "Income" ? "+" : "-"}{" "}
                              {trans?.currency} {trans?.amount}
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

              <Stack spacing={2} marginTop={2}>
                <Pagination
                  count={maxPage}
                  color={currentMode === "dark" ? "primary" : "secondary"}
                  onChange={(e, value) => {
                    console.log("page vaule", value);
                    setPage(value);
                  }}
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
                      color: currentMode === "dark" ? "white" : "black",
                    },
                  }}
                />
              </Stack>
            </div>
          )}
        </Box>

        {/* filters form */}
        {isUrl && (
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
            <h3 className="text-primary text-center font-semibold mb-5">{` ${t(
              "btn_filters"
            )}`}</h3>
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
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />
            <Select
              id="invoice_type"
              options={commission_type(t)?.map((trans) => ({
                value: trans.value,
                label: trans.value,
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
              // className={`mb-5`}
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
              // className={`mb-5`}
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
                (payment) => payment?.value === filtersData?.paid_by
              )}
              onChange={(e) => {
                setFilterData({
                  ...filtersData,
                  paid_by: e.value,
                });
              }}
              placeholder={t("payment_source")}
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
            />

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
                value={filtersData?.user_id || "selected"}
                label={t("filter_by_user")}
                onChange={(e) => {
                  setFilterData({
                    ...filtersData,
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
                value={filtersData?.vendor_id || "selected"}
                label={t("vendor")}
                onChange={(e) => {
                  setFilterData({
                    ...filtersData,
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

                {vendors?.map((vendor) => (
                  <MenuItem value={vendor?.id}>{vendor?.vendor_name}</MenuItem>
                ))}
              </TextField>
            </FormControl>

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
              // className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
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
              value={filtersData.comm_percent}
              onChange={(e) => handleChange(e, "filter")}
            />
            <TextField
              id="amount"
              type={"text"}
              label={t("amount")}
              className="w-full"
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

            <div className="grid grid-cols-2 gap-5 mb-2  p-4 h-[200px] overflow-y-auto mt-4">
              {vatData && vatData?.length > 0
                ? vatData?.map((vat) => (
                    <>
                      {/* INCOME */}
                      <div
                        className={`rounded-xl shadow-sm w-full  flex flex-col justify-center gap-4 ${
                          themeBgImg
                            ? currentMode === "dark"
                              ? "blur-bg-dark"
                              : "blur-bg-white"
                            : currentMode === "dark"
                            ? "bg-[#1C1C1C]"
                            : "bg-[#EEEEEE]"
                        }`}
                      >
                        <p className="text-center bg-primary m-0 p-3 text-white top-0">
                          {t("income_amount")} - {vat?.year}
                        </p>
                        <div className="ml-4 mb-3">
                          <p
                            className={`text-start text-xl font-semibold mb-3`}
                          >
                            {t("amount")} :
                            <span className="ml-3 font-normal">
                              {vat?.currency} {vat?.income_amount.toFixed(2)}
                            </span>
                          </p>

                          <p className={`text-start text-xl font-semibold `}>
                            {t("vat")} :
                            <span className="ml-3 font-normal">
                              {vat?.currency} {vat?.income_vat.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                      {/* EXPENSE */}
                      <div
                        className={`rounded-xl shadow-sm w-full  flex flex-col justify-center gap-4 ${
                          themeBgImg
                            ? currentMode === "dark"
                              ? "blur-bg-dark"
                              : "blur-bg-white"
                            : currentMode === "dark"
                            ? "bg-[#1C1C1C]"
                            : "bg-[#EEEEEE]"
                        }`}
                      >
                        <p className="text-center bg-primary m-0 p-3 top-0 text-white">
                          {t("expense_amount")} - {vat?.year}
                        </p>
                        <div className="ml-4 mb-3">
                          <p
                            className={`text-start text-xl font-semibold mb-3`}
                          >
                            {t("amount")} :
                            <span className="ml-3 font-normal">
                              {vat?.currency} {vat?.expense_amount.toFixed(2)}
                            </span>
                          </p>

                          <p className={`text-start text-xl font-semibold `}>
                            {t("vat")} :
                            <span className="ml-3 font-normal">
                              {vat?.currency} {vat?.expense_vat.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                    </>
                  ))
                : null}
            </div>
          </Box>
        )}
      </div>
      {singleTransModal && (
        <SingleTransactionModal
          singleTransModal={singleTransModal}
          setSingleTransModal={setSingleTransModal}
          isUrl={isUrl}
          user={user}
          vendors={vendors}
          fetchTransactions={fetchTransactions}
        />
      )}
    </div>
  );
};

export default Transactions;
