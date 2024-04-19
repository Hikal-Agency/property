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
    <div
      className={`p-3 rounded-lg ${
        themeBgImg &&
        (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
      }`}
    >
      <div className="flex items-center justify-between space-x-3">
        <div></div>

        {/* <Box
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
          className={`p-4 `}
        > */}
        <div className="flex items-center justify-between space-x-3">
          <div className="mb-5">
            <button
              className="bg-btn-primary py-2 px-4  rounded-sm"
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
        {/* </Box> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col h-[600px] overflow-y-scroll">
            {statementsData && statementsData?.length > 0 ? (
              statementsData?.map((stats) => {
                let loss;
                if (stats?.output?.toLowerCase() === "loss") {
                  loss = true;
                } else {
                  loss = false;
                }
                return (
                  <div
                    className={`${
                      currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-[#eeeeee]"
                    } p-5 mb-3`}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div className="w-full flex items-center pb-3">
                        <div className="bg-primary h-10 w-1 rounded-full"></div>
                        <h1
                          className={`text-lg font-semibold mx-2 uppercase text-primary `}
                        >
                          {stats?.currency}
                        </h1>
                      </div>
                      <div>
                        <button
                          className="bg-btn-primary text-white py-2 px-4 w-max"
                          onClick={() => setTransactionsListModal(true)}
                        >
                          {t("btn_view_transactions")}
                        </button>
                      </div>
                    </div>
                    <br></br>

                    <div>
                      <div className="flex items-center justify-center space-x-3 mt-2 w-full">
                        <div className={`rounded-md bg-white w-full p-5`}>
                          <p className={`text-center text-sm text-black`}>
                            {t("income_amount")}
                          </p>
                          <h1
                            className={`text-center text-lg font-bold text-black`}
                          >
                            {stats?.total_income}
                          </h1>
                        </div>
                        <div className={`rounded-md bg-white w-full p-5`}>
                          <p className={`text-center text-sm text-black`}>
                            {t("expense_amount")}
                          </p>
                          <h1
                            className={`text-center text-lg font-bold text-black`}
                          >
                            {stats?.total_expense}
                          </h1>
                        </div>
                      </div>

                      {/* <div
                        className={`rounded-md ${
                          loss ? "bg-[#E8C4C4]" : "bg-[#D3E6D5]"
                        } w-full p-5 mt-2 h-24 `}
                      >
                        
                        <p className={`text-center text-sm text-black mb-3`}>
                          {stats?.output}
                        </p>

                        <h1
                          className={`text-center text-lg font-bold ${
                            loss ? "text-[#DA1F26]" : "text-[#127339]"
                          }`}
                        >
                          {stats?.profit_loss}
                        </h1>
                        
                        <p
                          className={`text-right -top-7 text-sm text-black mb-3`}
                        >
                          {stats?.percent}
                        </p>
                     
                      </div> */}
                      <div
                        className={`rounded-md ${
                          loss ? "bg-[#E8C4C4]" : "bg-[#D3E6D5]"
                        } w-full p-5 mt-2 flex flex-col items-center justify-center`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-center text-sm text-black">
                            {stats?.output}
                          </p>
                          <h1
                            className={`text-center text-lg font-bold ${
                              loss ? "text-[#DA1F26]" : "text-[#127339]"
                            }`}
                          >
                            {stats?.profit_loss}
                          </h1>
                        </div>
                        <p className="text-sm text-black self-end ">
                          {stats?.percent
                            ? parseFloat(stats?.percent).toFixed(3) + " " + "%"
                            : ""}
                        </p>
                      </div>
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
                {statementsData && statementsData?.length > 0 ? (
                  statementsData?.map((trans) => {
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
      </div>
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
