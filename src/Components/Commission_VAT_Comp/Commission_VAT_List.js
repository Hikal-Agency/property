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
import TransactionsListModal from "../TransactionComp/TransactionsListModal";

import {
  BsBuildings,
  BsCalendarCheck,
  BsCart4,
  BsQuestionLg,
} from "react-icons/bs";

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
  } = useStateContext();

  const [loading, setloading] = useState(true);
  const [comm_vat_data, setCommVATData] = useState([]);
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
    <div className={`pb-4 px-4`}>
      <div className="flex items-center justify-end gap-4">
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
        <div className="mb-5">
          <button
            className="bg-btn-primary py-2 px-4 text-white rounded-md"
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
        {/* </Box> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="flex items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="flex flex-col">
            {comm_vat_data && comm_vat_data?.length > 0 ? (
              comm_vat_data?.map((comm_vat) => {
                return (
                  <div className="bg-primary p-4 rounded-xl shadow-sm mb-5">
                    <h1
                      className={`text-2xl font-bold mx-2 uppercase text-white text-center mb-4`}
                    >
                      {comm_vat?.year}
                    </h1>
                    <div className="flex flex-col gap-4">
                      {comm_vat?.vat && comm_vat?.vat?.length > 0 ? (
                        comm_vat?.vat?.map((vat) => (
                          <div
                            className={`${
                              currentMode === "dark"
                                ? "bg-[#1c1c1c] text-white"
                                : "bg-[#eeeeee] text-black"
                            } p-5 rounded-xl flex flex-col items-center justify-center gap-4`}
                          >
                            <div className="w-full text-xl font-bold mx-2 uppercase text-center">
                              {vat?.currency}
                            </div>
                            <div
                              className={`w-full rounded-xl shadow-sm p-5 ${
                                currentMode === "dark"
                                  ? "bg-black text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              <div
                                className={`w-full text-center text-primary text-2xl font-bold mb-3`}
                              >
                                {vat?.currency} {vat?.vat}
                              </div>
                              <p className={`text-center text-sm`}>
                                {t("vat_amount")}
                              </p>
                            </div>
                            <p className={`text-center text-sm my-3`}>
                              {t("vat_calculated_for") +
                                " " +
                                vat?.currency +
                                " " +
                                vat?.amount +
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
                {transactionsData && transactionsData?.length > 0 ? (
                  transactionsData?.map((trans) => {
                    // let user;
                    // if (trans?.invoice?.category?.toLowerCase() === "salary") {
                    //   user = true;
                    // } else {
                    //   user = false;
                    // }
                    let user;
                    if (trans?.invoice?.user_id) {
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
                            {moment(trans?.invoice?.date).format("YYYY-MM-DD")}
                          </p>
                          <div className="flex justify-between gap-4">
                            <div className="flex gap-4">
                              <div className="border w-fit h-fit border-[#AAAAAA] shadow-sm rounded-md p-3">
                                {trans?.invoice?.category === "Commission" ? (
                                  <BsBuildings size={16} color={"#AAAAAA"} />
                                ) : trans?.invoice?.category === "Salary" ? (
                                  <BsCalendarCheck
                                    size={16}
                                    color={"#AAAAAA"}
                                  />
                                ) : trans?.invoice?.category === "Purchase" ? (
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
                                      trans?.invoice?.status === "Paid"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {trans?.invoice?.status}
                                  </p>
                                  <p> - {trans?.invoice?.category}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p
                                className={`font-semibold text-lg ${
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
    </div>
  );
};

export default Commission_VAT_List;
