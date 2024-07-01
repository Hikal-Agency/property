import React, { useEffect, useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

import { BsFilterCircle, BsX } from "react-icons/bs";
import moment from "moment";
import Select from "react-select";
import {
  commission_type,
  countries_list,
  currencies,
  invoice_category,
  payment_source,
  payment_status,
} from "../_elements/SelectOptions";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  MenuItem,
  TextField,
} from "@mui/material";
import { selectStyles } from "../_elements/SelectStyles";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TransactionFilters = ({
  open,
  setOpen,
  anchorEl,
  setAnchorEl,
  filtersData,
  setFilterData,
  handleClick,
  handleClose,
}) => {
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
  const [userLoading, setUserLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [user, setUser] = useState([]);
  const [vendors, setVendors] = useState([]);
  const searchRef = useRef("");

  const token = localStorage.getItem("auth-token");

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
    } catch (error) {
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

  const fetchVendor = async () => {
    setUserLoading(true);
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
      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
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

  const handleDateRange = (newValue, type) => {
    const formattedDate = moment(newValue?.$d).format("YYYY-MM-DD");

    if (type === "start") {
      setStartDate(newValue);

      if (newValue && endDate) {
        setFilterData((prev) => ({
          ...prev,
          date_range: `${formattedDate},${moment(endDate.$d).format(
            "YYYY-MM-DD"
          )}`,
        }));
      }
    } else {
      setEndDate(newValue);

      if (startDate && newValue) {
        setFilterData((prev) => ({
          ...prev,
          date_range: `${moment(startDate.$d).format(
            "YYYY-MM-DD"
          )},${formattedDate}`,
        }));
      }
    }
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
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    fetchVendor();
  }, []);

  return (
    <div>
      {/* FILTERS */}

      <div
        className={`fixed top-20 flex flex-col items-end ${
          isLangRTL(i18n.language) ? "left-0" : "right-0"
        }`}
        style={{
          zIndex: 10,
        }}
      >
        <button
          onClick={(e) => {
            handleClick(e);
          }}
          sx={{
            zIndex: "40",
            "& svg path": {
              stroke: "white !important",
            },
            color: "white",
          }}
          className={`w-fit bg-primary text-white py-2 px-3 ${
            isLangRTL(i18n.language)
              ? "left-0 rounded-r-full"
              : "right-0 rounded-l-full"
          }`}
        >
          {open ? (
            <div className="flex items-center">
              <BsX size={18} color={"white"} />
            </div>
          ) : (
            <div className="flex items-center">
              <BsFilterCircle size={18} color={"white"} />
            </div>
          )}
        </button>
        {open && (
          <div
            className={`p-2 mx-2 my-2 rounded-xl ${
              currentMode === "dark"
                ? "blur-bg-black text-white"
                : "blur-bg-white text-black"
            }`}
          >
            <div
              className="overflow-y-scroll hide-scrollbar p-2"
              style={{
                minWidth: "200px",
                minHeight: "150px",
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            >
              <h3 className="text-primary text-center font-semibold mb-5">
                {` ${t("btn_filters")}`}
              </h3>
              {userLoading ? (
                <CircularProgress />
              ) : (
                <div className="flex flex-col w-full mb-4">
                  {/* CATEGORY */}
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
                  {/* INVOICE TYPE */}
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
                  {/* COUNTRY */}
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
                  {/* CURRENCY */}
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
                  <Box
                    sx={{
                      ...darkModeColors,
                      "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                        {
                          right: isLangRTL(i18n.language)
                            ? "2.5rem"
                            : "inherit",
                          transformOrigin: isLangRTL(i18n.language)
                            ? "right"
                            : "left",
                        },
                      "& legend": {
                        textAlign: isLangRTL(i18n.language) ? "right" : "left",
                      },
                    }}
                  >
                    {/* USER */}
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
                    {/* VENDOR */}
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
                          <MenuItem value={vendor?.id}>
                            {vendor?.vendor_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                    {/* DATE RANGE */}
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={startDate}
                          label={t("start_date")}
                          views={["day", "month", "year"]}
                          onChange={(val) => handleDateRange(val, "start")}
                          format="DD-MM-YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                "& input": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                // "& .MuiOutlinedInput-notchedOutline": {
                                //   borderColor:
                                //     fieldErrors?.date === true &&
                                //     "#DA1F26 !important",
                                // },
                                marginBottom: "20px",
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={endDate}
                          label={t("end_date")}
                          views={["day", "month", "year"]}
                          minDate={startDate && startDate}
                          onChange={(val) => handleDateRange(val)}
                          format="DD-MM-YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                "& input": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                // "& .MuiOutlinedInput-notchedOutline": {
                                //   borderColor:
                                //     fieldErrors?.date === true &&
                                //     "#DA1F26 !important",
                                // },
                                marginBottom: "20px",
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </Box>
                  {/* PAYMENT STATUS */}
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
                  {/* PAYMENT SOURCE */}
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
                  {/* CLEAR BUTTON */}
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
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionFilters;
