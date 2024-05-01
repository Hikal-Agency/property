import React, { useEffect, useState } from "react";
import { Box, TextField, CircularProgress } from "@mui/material";
// import { Select as libSelect } from "@mui/material";
import { FaHome, FaUser, FaBan } from "react-icons/fa";

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
import { useRef } from "react";
import { BsDownload } from "react-icons/bs";
import { countries_list, currencies } from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import TransactionsListModal from "../TransactionComp/TransactionsListModal";
import StatmentsCharts from "./StatmentsChart";

const StatmentsList = () => {
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
  const [statementsData, setStatementsData] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [transactionsListModal, setTransactionsListModal] = useState(null);

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

    if (!filters?.month || !filters?.year) {
      toast.error("Month and year are required.", {
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
        month: filters?.month,
        year: filters?.year,
      };

      // Conditionally add country and currency if they have values
      if (filters?.country) {
        params.country = filters.country;
      }
      if (filters?.currency) {
        params.currency = filters.currency;
      }
      const response = await axios.get(`${BACKEND_URL}/statements`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("statements list:: ", response);
      setStatementsData(response?.data?.data);
    } catch (error) {
      setloading(false);
      console.error("Error fetching statements:", error);
      toast.error("Unable to fetch the Statments List", {
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
    <div className="w-full">
      {/* FILTERS  */}
      <div className="flex justify-end">
        <div className="flex items-center justify-between gap-4">
          <div className="mb-5">
            <button
              className="bg-primary py-1 px-3 text-white rounded-md"
              onClick={clearFilters}
            >
              {t("clear_all")}
            </button>
          </div>
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
          >
            <Select
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
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
              required
            />
          </Box>
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
          >
            <Select
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
              className={`mb-5`}
              menuPortalTarget={document.body}
              styles={selectStyles(currentMode, primaryColor)}
              required
            />
          </Box>
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
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={dayjs(`${filters?.year}-${filters?.month}-01`)}
                label={t("month_year")}
                views={["month", "year"]}
                onChange={(newValue) => {
                  // Extract month and year as numbers from newValue
                  const month = newValue ? newValue.$d.getMonth() + 1 : "";
                  const year = newValue ? newValue.$d.getFullYear() : "";

                  setFilters((prev) => ({
                    ...prev,
                    month: month.toString().padStart(2, "0"), // Ensure month is two digits
                    year: year.toString(),
                  }));
                }}
                format="MM-YYYY"
                renderInput={(params) => (
                  <TextField
                    sx={{
                      "& input": {
                        color: currentMode === "dark" ? "white" : "black",
                      },
                      "& .MuiSvgIcon-root": {
                        color: currentMode === "dark" ? "white" : "black",
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
          </Box>

          <div className="mb-4">
            <button className="bg-btn-primary p-4 mt-0 rounded-full">
              {" "}
              <BsDownload size={16} color={"#FFFFFF"} />
            </button>
          </div>
        </div>
      </div>
      {/* DATA */}
      {loading ? (
        <div className="flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {statementsData && statementsData?.length > 0 ? (
            statementsData?.map((stats) => {
              let loss;
              if (stats?.output?.toLowerCase() === "loss") {
                loss = true;
              } else {
                loss = false;
              }
              return (
                <div className="w-full grid grid-cols-1 lg: grid-cols-2 gap-4">
                  <div className={`p-4 pb-5 h-fit rounded-xl shadow-sm ${currentMode === "dark" ? "bg-[#1C1C1C] text-white" : "bg-[#EEEEEE] text-black"}`}>
                    <div className="flex justify-between items-center gap-4 pb-5">
                      {/* CURRENCY */}
                      <div className="flex gap-2 items-center">
                        <div className="bg-primary h-10 w-1 rounded-full"></div>
                        <h1 className={`text-lg font-semibold uppercase text-primary`} >
                          {stats?.currency}
                        </h1>
                      </div>
                      {/* TRANSACTIONS */}
                      <button
                        className="bg-btn-primary rounded-md text-white py-2 px-4 w-max"
                        onClick={() => setTransactionsListModal(true)}
                      >
                        {t("btn_view_transactions")}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-5 mb-2">
                      {/* INCOME */}
                      <div className={`rounded-xl shadow-sm w-full p-5 flex flex-col justify-center gap-4 ${currentMode === "dark" ? "bg-black" : "bg-white"}`}>
                        <p className="text-center">
                          {t("income_amount")}
                        </p>
                        <p className={`text-center text-xl font-semibold`} >
                          {stats?.currency} {" "} {stats?.total_income}
                        </p>
                      </div>
                      {/* EXPENSE */}
                      <div className={`rounded-xl shadow-sm w-full p-5 flex flex-col justify-center gap-4 ${currentMode === "dark" ? "bg-black" : "bg-white"}`}>
                        <p className="text-center">
                          {t("expense_amount")}
                        </p>
                        <p className={`text-center text-xl font-semibold`} >
                          {stats?.currency} {" "} {stats?.total_expense}
                        </p>
                      </div>
                    </div>
                    <div className={`rounded-xl shadow-sm ${currentMode === "dark" ? loss ? "bg-red-900" : "bg-green-900" : loss ? "bg-[#E8C4C4]" : "bg-[#D3E6D5]"
                      } w-full p-5 flex flex-col items-center justify-center gap-4 relative`} >
                      <p className="text-center">
                        {stats?.output}
                      </p>
                      <p className={`text-center text-xl font-bold ${currentMode === "dark" ? loss ? "text-[#E8C4C4]" : "text-[#D3E6D5]" : loss ? "text-[#DA1F26]" : "text-[#127339]"}`}>
                        {stats?.currency} {" "} {stats?.profit_loss}
                      </p>
                      <div className={`absolute text-sm top-0 p-2 ${isLangRTL(i18n.langguage) ? "left-0 rounded-tl-xl" : "right-0 rounded-tr-xl"
                        } ${currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
                        } bg-black`}>
                        {stats?.percent
                          ? parseFloat(stats?.percent).toFixed(1) + " " + "%"
                          : ""}
                      </div>
                    </div>
                  </div>
                  {/* CHART */}
                  <div className="">
                    <StatmentsCharts stats={stats} />
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
      
      {singleTransModal && (
        <SingleTransactionModal
          singleTransModal={singleTransModal}
          setSingleTransModal={setSingleTransModal}
        />
      )}
      {transactionsListModal && (
        <TransactionsListModal
          transactionsListModal={transactionsListModal}
          setTransactionsListModal={setTransactionsListModal}
          filters={filters}
        />
      )}
    </div>
  );
};

export default StatmentsList;
