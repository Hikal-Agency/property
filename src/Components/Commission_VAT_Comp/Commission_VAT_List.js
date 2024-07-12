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

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { BsDownload } from "react-icons/bs";
import { countries_list, currencies } from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import Comm_VAT_PDF from "./Comm_VAT_PDF";

import {
  BsBuildings,
  BsCalendarCheck,
  BsCart4,
  BsQuestionLg,
  BsTools,
  BsCash,
  BsMegaphone
} from "react-icons/bs";
import {
  RiVisaLine
} from "react-icons/ri";
import { formatNoIntl } from "../_elements/FormatNoIntl";


const Commission_VAT_List = () => {
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
    deviceType
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const [comm_vat_data, setCommVATData] = useState([]);
  const [transactionsData, setTransData] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [pdfModal, setPDFModal] = useState(false);

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

  const fetchStatements = async () => {
    setloading(true);

    if (!filters?.year) {
      toast.error("Year is required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setloading(false);
      return;
    }
    try {
      const params = {
        year: filters?.year,
      };

      // Conditionally add country and currency if they have values
      if (filters?.country) {
        params.country = filters.country;
      }
      if (filters?.currency) {
        params.currency = filters.currency;
      }
      const response = await axios.get(`${BACKEND_URL}/commission-vat`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("commission vat list:: ", response);
      setCommVATData(response?.data?.data);
      setTransData(response?.data?.data?.[0]?.invoices);

      console.log("TRANS === ", response?.data?.data?.[0]?.invoices);
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
    fetchStatements();
  }, [filters]);

  return (
    <div className={`pb-5`}>
      <div className="flex items-center justify-end">
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
          className="flex gap-3"
        >
          <div className="mb-5">
            <button
              className={`${themeBgImg ? "bg-primary shadow-md"
                : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                } p-3 mb-5 rounded-md min-w-[80px] text-white uppercase`}
              onClick={clearFilters}
            >
              {t("clear_all")}
            </button>
          </div>
          <Select
            className="min-w-[100px]"
            options={currencies(t)?.map((curr) => ({
              value: curr?.value,
              label: curr?.label,
            }))}
            value={currencies(t)?.filter(
              (curr) => curr?.value === filters?.currency
            )}
            onChange={(e) => {
              setFilters({
                ...filters,
                currency: e.value,
              });
            }}
            placeholder={t("label_currency")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
            required
          />
          <Select
            className="min-w-[100px]"
            options={countries_list(t)?.map((country) => ({
              value: country?.value,
              label: country?.label,
            }))}
            value={countries_list(t)?.filter(
              (country) => country?.value === filters?.country
            )}
            onChange={(e) => {
              setFilters({
                ...filters,
                country: e.value,
              });
            }}
            placeholder={t("label_country")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
            required
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={dayjs(`${filters?.year}-${filters?.month}-01`)}
              label={t("select_year")}
              views={["year"]}
              onChange={(newValue) => {
                const year = newValue ? newValue.$d.getFullYear() : "";

                setFilters((prev) => ({
                  ...prev,
                  year: year.toString(),
                }));
              }}
              format="YYYY"
              renderInput={(params) => (
                <TextField
                  sx={{
                    "& input": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                    "& .MuiSvgIcon-root": {
                      color: currentMode === "dark" ? "white" : "black",
                    },
                    // marginBottom: "20px",
                  }}
                  className="min-w-[100px]"
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
          <div className="mb-5 ">
            <button
              className={`${themeBgImg ? "bg-primary shadow-md"
                : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                } p-3 mb-5 rounded-full`}
              onClick={() => setPDFModal(true)}
            >
              <BsDownload size={16} color={"#FFFFFF"} />
            </button>
          </div>
        </Box>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col">
            {comm_vat_data && comm_vat_data?.length > 0 ? (
              comm_vat_data?.map((comm_vat) => {
                return (
                  <div className={`${themeBgImg ?
                    currentMode === "dark" ? "blur-bg-black" : "blur-bg-white"
                    : currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
                    } ${themeBgImg && "rounded-xl shadow-md"
                    } p-5 mb-5`}>
                    <h1
                      className={`text-2xl font-bold mx-2 uppercase text-center mb-4`}
                    >
                      {comm_vat?.year}
                    </h1>
                    <div className="flex flex-col gap-4">
                      {comm_vat?.vat && comm_vat?.vat?.length > 0 ? (
                        comm_vat?.vat?.map((vat) => (
                          <div
                            className={`${themeBgImg ?
                              currentMode === "dark"
                                ? "blur-bg-black text-white"
                                : "blur-bg-white text-black"
                              : currentMode === "dark"
                                ? "bg-dark-neu text-white"
                                : "bg-light-neu text-black"
                              } p-5 rounded-xl flex flex-col items-center justify-center gap-4`}
                          >
                            <div
                              className={`w-full p-5 ${themeBgImg
                                ? currentMode === "dark"
                                  ? "bg-primary"
                                  : "bg-primary"
                                : currentMode === "dark"
                                  ? "bg-primary-dark-neu"
                                  : "bg-primary-light-neu"
                                } ${themeBgImg && "rounded-xl shadow-md"
                                } text-white`}
                            >
                              <p className={`text-center text-sm mb-2`}>
                                {t("vat_amount")}
                              </p>
                              <div
                                className={`w-full text-center text-2xl font-bold`}
                              >
                                {vat?.currency} {vat?.vat.toFixed(2)}
                              </div>
                            </div>
                            <p className={`text-center text-sm my-3`}>
                              {t("vat_calculated_for") +
                                " " +
                                vat?.currency +
                                " " +
                                vat?.amount.toFixed(2) +
                                " " +
                                t("from") +
                                " " +
                                vat?.count +
                                " " +
                                (vat?.count === 1
                                  ? t("invoice")
                                  : t("invoices")) +
                                "."}
                              {/* t("invoices")} */}
                            </p>
                          </div>
                        ))
                      ) : (
                        <h1>{t("no_data_year")}</h1>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <h1>{t("no_data_found")}</h1>
              </div>
            )}
          </div>
        )}

        {/* transactions list */}
        <Box
          sx={{ darkModeColors }}
          className={`p-5 ${themeBgImg
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
            <div className="flex flex-col gap-4">
              {transactionsData && transactionsData.length > 0 ? (
                transactionsData.map((trans) => (
                  <div
                    key={trans}
                    className="cursor-pointer"
                    onClick={() => setSingleTransModal(trans)}
                  >
                    {/* DATE */}
                    <p
                      className={`${themeBgImg ? "bg-primary"
                        : currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                        } font-semibold text-sm px-2 py-1 text-white rounded-md w-fit`}
                      style={{ zIndex: 1 }}
                    >
                      {trans?.invoice?.date}
                    </p>
                    <div
                      className={`${isLangRTL(i18n.language) ? "pl-5" : "pr-5"
                        } grid grid-cols-12 gap-5`}
                    >
                      <div className="col-span-3 md:col-span-2 w-full flex flex-col items-center relative">
                        <div
                          className={`${themeBgImg
                            ? currentMode === "dark" ? "blur-bg-black border border-[#AAAAAA]" : "blur-bg-white border border-[#AAAAAA]"
                            : currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
                            } w-fit h-fit p-3 mt-5`}
                          style={{ zIndex: 1 }}
                        >
                          {trans?.invoice?.category.toLowerCase() === "commission" ? (
                            <BsBuildings size={16} color={"#AAAAAA"} />
                          ) : trans?.invoice?.category.toLowerCase() === "salary" ? (
                            <BsCalendarCheck size={16} color={"#AAAAAA"} />
                          ) : trans?.invoice?.category.toLowerCase() === "purchase" ? (
                            <BsCart4 size={16} color={"#AAAAAA"} />
                          ) : trans?.invoice?.category.toLowerCase() === "visa" ? (
                            <RiVisaLine size={16} color={"#AAAAAA"} />
                          ) : trans?.invoice?.category.toLowerCase() ===
                            "maintenance" ? (
                            <BsTools size={16} color={"#AAAAAA"} />
                          ) : trans?.invoice?.category.toLowerCase() === "borrow" ? (
                            <BsCash size={16} color={"#AAAAAA"} />
                          ) : trans?.invoice?.category.toLowerCase() === "campaigns" ? (
                            <BsMegaphone size={16} color={"#AAAAAA"} />
                          ) : (
                            <BsQuestionLg size={16} color={"#AAAAAA"} />
                          )}
                        </div>
                        <div
                          className="h-full w-1 bg-primary absolute top-0"
                          style={{ transform: "translateX(-50%)" }}
                        ></div>
                      </div>
                      {/* DETAILS */}
                      <div className="col-span-9 md:col-span-8 pb-6 flex flex-col gap-2 mt-5">
                        {trans?.invoice?.vendor_id && (
                          <div className="flex">
                            {/* {trans?.vendor?.type} - {" "} */}
                            {trans?.vendor?.vendor_name}
                          </div>
                        )}
                        {trans?.invoice?.user_id && (
                          <div className="flex">{trans?.user?.userName}</div>
                        )}
                        <div className="flex items-center justify-between gap-5">
                          <div className="flex gap-1 text-sm">
                            <p
                              className={
                                trans?.invoice?.status === "Paid"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {trans?.invoice?.status}
                            </p>
                            <p> - {trans?.invoice?.category}</p>
                          </div>
                          {/* AMOUNT FOR MOBILE */}
                          {deviceType === "mobile" && (
                            <div className="flex flex-col items-end">
                              <p
                                className={`font-semibold ${trans?.invoice?.invoice_type == "Income"
                                  ? "text-green-600"
                                  : "text-red-600"
                                  } `}
                              >
                                {trans?.invoice?.invoice_type === "Income" ? "+" : "-"}{" "}
                                {trans?.invoice?.currency}{" "}
                                {formatNoIntl(trans?.invoice?.total_amount)}
                              </p>
                              {(trans?.invoice?.vat !== 0 || trans?.invoice?.vat !== null) && (
                                <p className="text-sm">
                                  {t("vat")}: {trans?.invoice?.currency} {trans?.invoice?.vat}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* AMOUNT */}
                      {deviceType !== "mobile" && (
                        <div className="col-span-3 md:col-span-2 pb-5 mt-5 flex flex-col items-end text-end gap-2">
                          <p
                            className={`font-semibold ${trans?.invoice?.invoice_type == "Income"
                              ? "text-green-600"
                              : "text-red-600"
                              } `}
                          >
                            {trans?.invoice?.invoice_type === "Income" ? "+" : "-"}{" "}
                            {trans?.invoice?.currency}{" "}
                            {formatNoIntl(trans?.invoice?.total_amount)}
                          </p>
                          {(trans?.invoice?.vat !== 0 && trans?.invoice?.vat !== null && trans?.invoice?.vat !== "0") && (
                            <p className="text-sm">
                              {t("vat")}: {trans?.invoice?.currency} {trans?.invoice?.vat}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h1>{t("no_data_found")}</h1>
                </div>
              )}
            </div>
          )}
        </Box>

      </div>
      {singleTransModal && (
        <SingleTransactionModal
          singleTransModal={singleTransModal}
          setSingleTransModal={setSingleTransModal}
        />
      )}
      {pdfModal && (
        <Comm_VAT_PDF pdfModal={pdfModal} setPDFModal={setPDFModal} />
      )}
    </div>
  );
};

export default Commission_VAT_List;
