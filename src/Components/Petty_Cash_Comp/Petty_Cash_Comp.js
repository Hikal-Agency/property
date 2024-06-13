import React, { useEffect, useState } from "react";
import { Box, TextField, CircularProgress } from "@mui/material";

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
} from "react-icons/bs";
import Petty_Cash_Form from "./Petty_Cash_Form";

const Petty_Cash_Comp = () => {
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
  const [pettyCashData, setPettyCashData] = useState([]);
  const [transactionsData, setTransData] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);

  console.log("transactions data:", transactionsData);

  const token = localStorage.getItem("auth-token");

  const [filters, setFilters] = useState({
    currency: "",
    country: "",
    month: moment().format("MM"),
    year: moment().format("YYYY"),
  });

  const clearFilters = () => {
    setFilters({
      currency: "",
      country: "",
      month: moment().format("MM"),
      year: moment().format("YYYY"),
    });
  };

  console.log("filter data:: ", filters);

  const fetchPettyCash = async () => {
    setloading(true);

    const paramsPettyCash = { type: "Fund" };
    const paramsInvoices = { is_petty_cash: 1 };
    try {
      const [pettyCashResponse, invoicesResponse] = await Promise.all([
        axios.get(`${BACKEND_URL}/pettycash`, {
          params: paramsPettyCash,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${BACKEND_URL}/invoices`, {
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
      setTransData(invoicesResponse?.data?.data?.data);
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
  }, [filters]);

  return (
    <div className={`pb-4 px-4`}>
      <div
        className={`w-full ${
          currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#eeeeee]"
        } mb-6 rounded-xl p-4`}
      >
        <Petty_Cash_Form />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
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
          className={`p-2 ${
            currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#eeeeee]"
          }`}
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
              {pettyCashData && pettyCashData?.length > 0 ? (
                pettyCashData?.map((petty) => {
                  return (
                    <>
                      <div
                        className={` rounded-xl p-4 ${
                          themeBgImg && currentMode === "dark"
                            ? "blur-bg-dark"
                            : "blur-bg-light"
                        }`}
                        // onClick={() => setSingleTransModal(petty)}
                      >
                        <p className="mb-3 font-semibold text-sm">
                          {moment(petty?.date).format("YYYY-MM-DD")}
                        </p>
                        <div className="flex justify-between gap-4">
                          <div className="flex gap-4">
                            <div className="border w-fit h-fit border-[#AAAAAA] shadow-sm rounded-md p-3">
                              <BsCash size={16} color={"#AAAAAA"} />
                            </div>
                            <div className="flex flex-col">
                              <p>{petty?.fund_by_name}</p>
                              <div className="flex gap-1 text-sm">
                                <p className={`text-green-600`}>
                                  {petty?.currency} {petty?.petty_cash_amount}
                                </p>
                                {/* <p> - {petty?.invoice?.category}</p> */}
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className={`font-semibold text-lg `}>
                              Balance: {petty?.currency} {petty?.fund_amount}
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
            className="p-2"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <CircularProgress />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h3 className="text-primary mb-5 text-center font-semibold">
                  {t("expense_amount")}
                </h3>
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
                          className={`cursor-pointer rounded-xl p-4 ${
                            themeBgImg && currentMode === "dark"
                              ? "blur-bg-dark"
                              : "blur-bg-light"
                          }`}
                          onClick={() => setSingleTransModal(trans)}
                        >
                          <p className="mb-3 font-semibold text-sm">
                            {moment(trans?.date).format("YYYY-MM-DD")}
                          </p>
                          <div className="flex justify-between gap-4">
                            <div className="flex gap-4">
                              <div className="border w-fit h-fit border-[#AAAAAA] shadow-sm rounded-md p-3">
                                {trans?.category?.toLowerCase() ===
                                "commission" ? (
                                  <BsBuildings size={16} color={"#AAAAAA"} />
                                ) : trans?.category?.toLowerCase() ===
                                  "salary" ? (
                                  <BsCalendarCheck
                                    size={16}
                                    color={"#AAAAAA"}
                                  />
                                ) : trans?.category?.toLowerCase() ===
                                  "purchase" ? (
                                  <BsCart4 size={16} color={"#AAAAAA"} />
                                ) : (
                                  <BsQuestionLg size={16} color={"#AAAAAA"} />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <p>
                                  {user
                                    ? trans?.user?.userName
                                    : trans?.vendor?.vendor_name}
                                </p>
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
              </div>
            )}
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

export default Petty_Cash_Comp;
