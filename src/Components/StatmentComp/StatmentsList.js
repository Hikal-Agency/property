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
  const [btnLoading, setBtnLoading] = useState(false);
  const [statementsData, setStatementsData] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [maxPage, setMaxPage] = useState(0);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("auth-token");
  const [vendors, setVendors] = useState([]);

  console.log("vendors array:: ", vendors);

  const currentDate = moment();
  const currentMonth = currentDate.month() + 1;
  const currentYear = currentDate.year();

  const [addTransactionData, setAddTransactionData] = useState({
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
    image: "",
    date: dayjs().format("MM-YYYY"),
  });

  console.log("addtransaction:: ", addTransactionData);

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
      const params = {
        month: moment().format("MM"),
        year: moment().format("YYYY"),
      };

      const response = await axios.get(`${BACKEND_URL}/statements`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("statements list:: ", response);
      setStatementsData(response?.data?.data);

      if (vendors?.length == 0) {
        await fetchVendor();
      }
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
    fetchTransactions();
  }, [filtersData]);

  useEffect(() => {
    fetchVendor();
  }, [addTransactionData?.category, filtersData?.category]);

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
                (curr) => curr?.value === addTransactionData?.currency
              )}
              onChange={(e) => {
                setAddTransactionData({
                  ...statementsData,
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
                (country) => country?.value === addTransactionData?.country
              )}
              onChange={(e) => {
                setAddTransactionData({
                  ...statementsData,
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
                value={addTransactionData?.date}
                label={t("month_year")}
                views={["month", "year"]}
                onChange={(newValue) => {
                  const formattedDate = moment(newValue?.$d).format("MM-YYYY");

                  setAddTransactionData((prev) => ({
                    ...prev,
                    date: formattedDate,
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
                        <button className="bg-btn-primary text-white py-2 px-4 w-max">
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

                      <div
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
    </div>
  );
};

export default StatmentsList;
