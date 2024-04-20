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
              className="bg-btn-primary py-2 px-4 text-white  rounded-sm"
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
            {comm_vat_data && comm_vat_data?.length > 0 ? (
              comm_vat_data?.map((comm_vat) => {
                let loss;
                if (comm_vat?.output?.toLowerCase() === "loss") {
                  loss = true;
                } else {
                  loss = false;
                }
                return (
                  <>
                    <div>
                      <h1
                        className={`text-2xl font-bold mx-2 uppercase text-primary text-center my-3 `}
                      >
                        {comm_vat?.year}
                      </h1>
                      <hr className="border-primary h-3" />
                    </div>
                    {comm_vat?.vat && comm_vat?.vat?.length > 0 ? (
                      comm_vat?.vat?.map((vat) => (
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "bg-[#1c1c1c]"
                              : "bg-[#eeeeee]"
                          } p-5 mb-3`}
                        >
                          <div className="w-full ">
                            <h1
                              className={`text-xl font-bold mx-2 uppercase text-primary text-center `}
                            >
                              {vat?.currency}
                            </h1>
                          </div>
                          <br></br>

                          <div>
                            <div className=" mt-2 w-full">
                              <div className={`rounded-md bg-white w-full p-5`}>
                                <h1
                                  className={`text-center text-lg font-bold text-black mb-3`}
                                >
                                  {comm_vat?.count}
                                </h1>

                                <p className={`text-center text-sm text-black`}>
                                  {t("vat_amount")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h1>{t("no_data_year")}</h1>
                    )}
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
                {transactionsData?.data &&
                transactionsData?.data?.length > 0 ? (
                  transactionsData?.data?.map((trans) => {
                    let user;
                    if (trans?.category?.toLowerCase() === "salary") {
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
                          <p>{trans?.date}</p>
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
                                  {trans?.category}
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

export default Commission_VAT_List;
