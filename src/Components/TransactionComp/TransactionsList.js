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
  Menu,
} from "@mui/material";
import { BsFilterCircle, BsX } from "react-icons/bs";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";

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
} from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import SingleTransactionModal from "./SingleTransactionModal";

import {
  BsBuildings,
  BsQuestionLg,
  BsCart4,
  BsCalendarCheck,
  BsTools,
  BsCash,
  BsMegaphone,
} from "react-icons/bs";
import { RiVisaLine } from "react-icons/ri";
import AddTransactionForm from "./AddTransactionForm";
import { DatePicker } from "@mui/x-date-pickers";
import NewTransactionForm from "./NewTransactionForm";
import { formatNoIntl } from "../_elements/FormatNoIntl";

const TransactionsList = ({ filtersData, visa, callApi }) => {
  console.log("filters:: ", filtersData);
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
    deviceType,
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const [transactionsData, setTransactionsData] = useState([]);
  const [vatData, setVAT] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [maxPage, setMaxPage] = useState(0);

  console.log("trans data:: ", transactionsData);

  // console.log("vat data:", vatData);

  const token = localStorage.getItem("auth-token");
  const [vendors, setVendors] = useState([]);

  const [user, setUser] = useState([]);
  const [userLoading, setUserLoading] = useState(false);

  const [page, setPage] = useState(1);

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

      // console.log("vendors list:: ", vendorResponse);
      // console.log("users list:: ", userResponse);

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
      // console.log("Users: ", response);

      if (type === "user") {
        setUser(response?.data?.managers?.data);
      } else {
        setVendors(response?.data?.data?.data);
      }

      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
      // console.log(error);
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

      // console.log("activeFilters:: ", activeFilters);
      // console.log("queryParams:: ", queryParams);

      let url;
      if (visa) {
        url = `${BACKEND_URL}/invoices?page=${page}&category=Visa`;
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
      } else {
        url = `${BACKEND_URL}/invoices?page=${page}${queryParams}`;
        const response = await axios.get(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        // console.log("transactions list:: ", response);

        setVAT(response?.data?.vat);
        setMaxPage(response?.data?.data?.last_page);
        setTransactionsData(response?.data?.data?.data);
      }

      // if (filtersData && !visa) {
      //   console.log("I am filter data");
      //   setVAT(filtersData?.data?.vat);
      //   setMaxPage(filtersData?.data?.data?.last_page);
      //   setTransactionsData(filtersData?.data?.data?.data);
      // }

      await fetchVendor();
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

  const groupTransactionsByDate = (transactions) => {
    return transactions?.reduce((acc, transaction) => {
      const date = moment(transaction.date).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
  };
  const groupedTransactions = groupTransactionsByDate(transactionsData);

  console.log("grouped trans:: ", groupedTransactions);

  const sortedDates = Object.keys(groupedTransactions)?.sort((a, b) =>
    moment(b).diff(moment(a))
  );

  // console.log("sorted DAtes: ", sortedDates);

  useEffect(() => {
    fetchTransactions();
  }, [filtersData, page, "/transactions", callApi]);

  return (
    <div>
      {/* TRANSACTIONS LIST */}
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
          themeBgImg
            ? currentMode === "dark"
              ? "blur-bg-black"
              : "blur-bg-white"
            : currentMode === "dark"
            ? "bg-dark-neu"
            : "bg-light-neu"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="">
            <h3 className="text-primary mb-5 text-center font-semibold">
              {t("transactions")}
            </h3>

            {transactionsData && transactionsData.length > 0 ? (
              sortedDates?.map((date) => (
                <div key={date}>
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                      <div
                        className="h-full w-1 bg-primary absolute top-0"
                        style={{ transform: "translateX(-50%)" }}
                      ></div>
                      <p
                        className={`${
                          themeBgImg
                            ? "bg-primary"
                            : currentMode === "dark"
                            ? "bg-primary-dark-neu"
                            : "bg-primary-light-neu"
                        } mb-4 font-semibold text-sm px-2 py-1 text-white rounded-md w-fit`}
                        style={{ zIndex: 1 }}
                      >
                        {date}
                      </p>
                    </div>
                    <div className="col-span-9 md:col-span-10"></div>
                  </div>
                  {groupedTransactions[date]?.map((trans) => (
                    <div
                      key={trans?.id}
                      className="cursor-pointer"
                      onClick={() => setSingleTransModal(trans)}
                    >
                      <div
                        className={`${
                          isLangRTL(i18n.language) ? "pl-5" : "pr-5"
                        } grid grid-cols-12 gap-5`}
                      >
                        {/* DATE */}
                        <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                          <div
                            className="h-full w-1 bg-primary absolute top-0"
                            style={{ transform: "translateX(-50%)" }}
                          ></div>
                          <div
                            className={`${
                              themeBgImg
                                ? currentMode === "dark"
                                  ? "blur-bg-black border border-[#AAAAAA]"
                                  : "blur-bg-white border border-[#AAAAAA]"
                                : currentMode === "dark"
                                ? "bg-dark-neu"
                                : "bg-light-neu"
                            } w-fit h-fit p-3`}
                            style={{ zIndex: 1 }}
                          >
                            {trans?.category.toLowerCase() === "commission" ? (
                              <BsBuildings size={16} color={"#AAAAAA"} />
                            ) : trans?.category.toLowerCase() === "salary" ? (
                              <BsCalendarCheck size={16} color={"#AAAAAA"} />
                            ) : trans?.category.toLowerCase() === "purchase" ? (
                              <BsCart4 size={16} color={"#AAAAAA"} />
                            ) : trans?.category.toLowerCase() === "visa" ? (
                              <RiVisaLine size={16} color={"#AAAAAA"} />
                            ) : trans?.category.toLowerCase() ===
                              "maintenance" ? (
                              <BsTools size={16} color={"#AAAAAA"} />
                            ) : trans?.category.toLowerCase() === "borrow" ? (
                              <BsCash size={16} color={"#AAAAAA"} />
                            ) : trans?.category.toLowerCase() ===
                              "campaigns" ? (
                              <BsMegaphone size={16} color={"#AAAAAA"} />
                            ) : (
                              <BsQuestionLg size={16} color={"#AAAAAA"} />
                            )}
                          </div>
                        </div>
                        {/* DETAILS */}
                        <div className="col-span-9 md:col-span-8 pb-6 flex flex-col gap-2">
                          {trans?.vendor_id && (
                            <div className="flex">
                              {trans?.vendor?.type} -{" "}
                              {trans?.vendor?.vendor_name}
                            </div>
                          )}
                          {trans.user_id && (
                            <div className="flex">{trans.user.userName}</div>
                          )}
                          <div className="flex items-center justify-between gap-5">
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
                            {/* AMOUNT FOR MOBILE */}
                            {deviceType === "mobile" && (
                              <div className="flex flex-col items-end">
                                <p
                                  className={`font-semibold ${
                                    trans?.invoice_type == "Income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  } `}
                                >
                                  {trans?.invoice_type === "Income" ? "+" : "-"}{" "}
                                  {trans?.currency}{" "}
                                  {formatNoIntl(trans?.total_amount)}
                                </p>
                                {(trans?.vat !== 0 || trans?.vat !== null) && (
                                  <p className="text-sm">
                                    {t("vat")}: {trans?.currency} {trans?.vat}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* AMOUNT */}
                        {deviceType !== "mobile" && (
                          <div className="col-span-3 md:col-span-2 pb-5 flex flex-col items-end gap-2">
                            <p
                              className={`font-semibold ${
                                trans?.invoice_type == "Income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              } `}
                            >
                              {trans?.invoice_type === "Income" ? "+" : "-"}{" "}
                              {trans?.currency}{" "}
                              {formatNoIntl(trans?.total_amount)}
                            </p>
                            {trans?.vat !== 0 &&
                              trans?.vat !== null &&
                              trans?.vat !== "0" && (
                                <p className="text-sm">
                                  {t("vat")}: {trans?.currency} {trans?.vat}
                                </p>
                              )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))
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
                  // console.log("page vaule", value);
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

      {singleTransModal && (
        <SingleTransactionModal
          singleTransModal={singleTransModal}
          setSingleTransModal={setSingleTransModal}
          user={user}
          vendors={vendors}
          fetchUsers={fetchUsers}
          fetchTransactions={fetchTransactions}
        />
      )}
    </div>
  );
};

export default TransactionsList;
