import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  CircularProgress,
  Stack,
  Pagination,
} from "@mui/material";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import SingleTransactionModal from "../TransactionComp/SingleTransactionModal";
import Select from "react-select";
import { BsCash } from "react-icons/bs";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { BsDownload } from "react-icons/bs";
import { countries_list, currencies } from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import TransactionsListModal from "../TransactionComp/TransactionsListModal";

import {
  BsBuildings,
  BsCalendarCheck,
  BsCart4,
  BsQuestionLg,
  BsTools,
  BsMegaphone
} from "react-icons/bs";
import { RiVisaLine } from "react-icons/ri";
import Petty_Cash_Form from "./Petty_Cash_Form";
import TransactionFilters from "./TransactionFilters";
import Coin from "../_elements/Coin";
import TransactionsList from "../TransactionComp/TransactionsList";
import { formatNoIntl } from "../_elements/FormatNoIntl";

const Petty_Cash_Comp = () => {
  const {
    currentMode,
    darkModeColors,
    formatNum,
    BACKEND_URL,
    deviceType,
    t,
    primaryColor,
    themeBgImg,
    fontFam,
    isLangRTL,
    i18n,
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const [pettyCashData, setPettyCashData] = useState([]);
  const [maxPettyData, setMaxPetty] = useState(0);
  const [pettyPage, setPettyPage] = useState(1);
  const [availableData, setAvailableData] = useState([]);
  const [transactionsData, setTransData] = useState([]);
  const [maxTransData, setMaxTrans] = useState(0);
  const [transPage, setTransPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  console.log("transpage:", transPage);
  console.log("petty Page:", pettyPage);

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
    date_range: "",
  });

  const handleClick = (event) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const [singleTransModal, setSingleTransModal] = useState(null);

  console.log("availble data::: ", availableData);

  console.log("transactions data:", transactionsData);

  const token = localStorage.getItem("auth-token");

  const fetchPettyCash = async () => {
    setloading(true);

    const paramsPettyCash = { type: "Fund" };
    const paramsInvoices = { is_petty_cash: 1 };

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
    try {
      const [pettyCashResponse, invoicesResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/pettycash?page=${pettyPage}`, {
          params: paramsPettyCash,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${BACKEND_URL}/invoices?page=${transPage}${queryParams}`, {
          params: paramsInvoices,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      console.log("Petty Cash list:: ", pettyCashResponse);
      console.log("Invoices list:: ", invoicesResponse);

      setPettyCashData(pettyCashResponse?.data?.data?.data);
      setMaxPetty(pettyCashResponse?.data?.data?.last_page);

      const availData = Object.entries(pettyCashResponse?.data?.available);
      setAvailableData(availData);
      setTransData(invoicesResponse?.data?.data?.data);
      setMaxTrans(invoicesResponse?.data?.data?.last_page);
    } catch (error) {
      setloading(false);
      console.error("Error fetching statements:", error);
      toast.error("Unable to fetch the Commission VAT.", {
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
    fetchPettyCash();
  }, [filtersData, transPage, pettyPage]);

  const groupTransactionsByDate = (transactionsData) => {
    return transactionsData.reduce((acc, transaction) => {
      const date = moment(transaction.date).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
  };
  const groupedTransactions = groupTransactionsByDate(transactionsData);
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) =>
    moment(b).diff(moment(a))
  );

  const groupPettyCashByDate = (pettyCashData) => {
    return pettyCashData.reduce((acc, pettycash) => {
      const date = moment(pettycash.date).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(pettycash);
      return acc;
    }, {});
  };
  const groupedFunds = groupPettyCashByDate(pettyCashData);
  const sortedFundDates = Object.keys(groupedFunds).sort((a, b) =>
    moment(b).diff(moment(a))
  );


  return (
    <div className={`pb-4 px-4`}>
      <TransactionFilters
        open={open}
        setOpen={setOpen}
        filtersData={filtersData}
        setFilterData={setFilterData}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        handleClick={handleClick}
        handleClose={handleClose}
      />
      {availableData?.length > 0 && (
        <div
          className={`w-full flex items-center gap-4 p-4 overflow-x-auto mb-4`}
        >
          <Coin />
          {availableData?.map(([country, currencies]) => (
            <div key={country} className="w-full flex items-center space-x-3">
              {Object.entries(currencies)?.map(([currency, amount]) => (
                <div key={currency}>
                  <p className="font-semibold">
                    {country}:
                    <span className="ml-2 font-normal">
                      {currency}{" "}{amount.toFixed(2)}{" "}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div
        className={`w-full ${themeBgImg
          ? currentMode === "dark"
            ? "blur-bg-black"
            : "blur-bg-white"
          : currentMode === "dark"
            ? "bg-dark-neu"
            : "bg-light-neu"
          } my-5 p-5`}
      >
        <Petty_Cash_Form fetchPettyCash={fetchPettyCash} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-5">
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
          className={`${themeBgImg ?
            currentMode === "dark" ? "blur-bg-black" : "blur-bg-light"
            : currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
            } p-4`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-primary mb-5 text-center font-semibold">
                {t("funds")}
              </h3>
              {pettyCashData && pettyCashData?.length > 0 ? (
                sortedFundDates?.map((date) => (
                  <div key={date}>
                    <div className="grid grid-cols-12 gap-5">
                      <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                        <div
                          className="h-full w-1 bg-primary absolute top-0"
                          style={{ transform: "translateX(-50%)" }}
                        ></div>
                        <p
                          className={`${themeBgImg ? "bg-primary"
                            : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                            } mb-4 font-semibold text-sm px-2 py-1 text-white rounded-md w-fit`}
                          style={{ zIndex: 1 }}
                        >
                          {date}
                        </p>
                      </div>
                      <div className="col-span-9 md:col-span-10"></div>
                    </div>
                    {groupedFunds[date]?.map((petty) => (
                      <div
                        key={petty?.id}
                        className="cursor-pointer"
                      >
                        <div
                          className={`${isLangRTL(i18n.language) ? "pl-5" : "pr-5"
                            } grid grid-cols-12 gap-5`}
                        >
                          <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                            <div
                              className="h-full w-1 bg-primary absolute top-0"
                              style={{ transform: "translateX(-50%)" }}
                            ></div>
                            <div
                              className={`${themeBgImg
                                ? currentMode === "dark" ? "blur-bg-black border border-[#AAAAAA]" : "blur-bg-white border border-[#AAAAAA]"
                                : currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
                                } w-fit h-fit p-3`}
                              style={{ zIndex: 1 }}
                            >
                              <BsCash size={16} color={"#AAAAAA"} />
                            </div>
                          </div>
                          {/* DETAILS */}
                          <div className={`col-span-9 md:col-span-8 pb-6 flex gap-3 py-4`}>
                            {deviceType === "mobile" && (
                              <p className={`font-semibold text-green-600`}>
                                {petty?.currency} {petty?.fund_amount}
                              </p>
                            )}
                            <p>{petty?.fund_by_name}</p>
                          </div>
                          {/* AMOUNT */}
                          {deviceType !== "mobile" && (
                            <div className="col-span-3 md:col-span-2 pb-5 flex flex-col items-end gap-2 py-4">
                              <p className={`font-semibold text-green-600`}>
                                {petty?.currency} {petty?.fund_amount}
                              </p>
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
              {pettyCashData && pettyCashData?.length > 0 ? (
                <Stack spacing={2} marginTop={2}>
                  <Pagination
                    count={maxPettyData}
                    color={currentMode === "dark" ? "primary" : "secondary"}
                    onChange={(e, value) => setPettyPage(value)}
                    style={{ margin: "auto" }}
                    page={pettyPage}
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
              ) : null}
            </div>
          )}
        </Box>
        {/* expenses list */}
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
            className={`${themeBgImg ?
              currentMode === "dark" ? "blur-bg-black" : "blur-bg-light"
              : currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
              } p-4`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="text-primary mb-5 text-center font-semibold">
                  {t("transactions")}
                </h3>
                {transactionsData && transactionsData.length > 0 ? (
                  sortedDates.map((date) => (
                    <div key={date}>
                      <div className="grid grid-cols-12 gap-5">
                        <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                          <div
                            className="h-full w-1 bg-primary absolute top-0"
                            style={{ transform: "translateX(-50%)" }}
                          ></div>
                          <p
                            className={`${themeBgImg ? "bg-primary"
                              : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
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
                            className={`${isLangRTL(i18n.language) ? "pl-5" : "pr-5"
                              } grid grid-cols-12 gap-5`}
                          >
                            <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                              <div
                                className="h-full w-1 bg-primary absolute top-0"
                                style={{ transform: "translateX(-50%)" }}
                              ></div>
                              <div
                                className={`${themeBgImg
                                  ? currentMode === "dark" ? "blur-bg-black border border-[#AAAAAA]" : "blur-bg-white border border-[#AAAAAA]"
                                  : currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
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
                                  <RiVisaLine size={20} color={"#AAAAAA"} />
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
                              </div>
                              {/* AMOUNT FOR MOBILE */}
                              {deviceType === "mobile" && (
                                <div className="flex gap-3">
                                  <p
                                    className={`font-semibold ${trans?.invoice_type == "Income"
                                      ? "text-green-600"
                                      : "text-red-600"
                                      } `}
                                  >
                                    {trans?.invoice_type === "Income" ? "+" : "-"}{" "}
                                    {trans?.currency}{" "}
                                    {formatNoIntl(trans?.total_amount)}
                                  </p>
                                  {(trans?.vat !== 0 && trans?.vat !== null) && (
                                    <p className="text-sm">
                                      {t("vat")}: {trans?.currency} {trans?.vat}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            {/* AMOUNT */}
                            {deviceType !== "mobile" && (
                              <div className="col-span-3 md:col-span-2 pb-5 flex flex-col items-end gap-2">
                                <p
                                  className={`font-semibold ${trans?.invoice_type == "Income"
                                    ? "text-green-600"
                                    : "text-red-600"
                                    } text-end `}
                                >
                                  {trans?.invoice_type === "Income" ? "+" : "-"}{" "}
                                  {trans?.currency}{" "}
                                  {formatNoIntl(trans?.total_amount)}
                                </p>
                                {(trans?.vat !== 0 && trans?.vat !== null && trans?.vat !== "0") && (
                                  <p className="text-sm text-end">
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
                {transactionsData && transactionsData?.length > 0 ? (
                  <Stack spacing={2} marginTop={2}>
                    <Pagination
                      count={maxTransData}
                      color={currentMode === "dark" ? "primary" : "secondary"}
                      onChange={(e, value) => setTransPage(value)}
                      style={{ margin: "auto" }}
                      page={transPage}
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
                ) : null}
              </div>
            )}
          </Box>
        </div>
      </div >
      {singleTransModal && (
        <SingleTransactionModal
          singleTransModal={singleTransModal}
          setSingleTransModal={setSingleTransModal}
        />
      )}
    </div >
  );
};

export default Petty_Cash_Comp;
