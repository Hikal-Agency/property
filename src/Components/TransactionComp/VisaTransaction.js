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
} from "react-icons/bs";
import AddTransactionForm from "./AddTransactionForm";
import { DatePicker } from "@mui/x-date-pickers";
import NewTransactionForm from "./NewTransactionForm";
import TransactionsList from "./TransactionsList";
import { formatNoIntl } from "../_elements/FormatNoIntl";
import { useLocation } from "react-router-dom";

const VisaTransaction = ({ pathname }) => {
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
  const [transactionsData, setTransactionsData] = useState([]);
  const [vatData, setVAT] = useState([]);
  const [singleTransModal, setSingleTransModal] = useState(null);
  const [error, setError] = useState(false);
  const [maxPage, setMaxPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  console.log("location:: ", pathname);

  const visaPage = pathname === "/visa" ? true : false;

  const handleClick = (event) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const searchRef = useRef("");

  console.log("vat data:", vatData);

  const token = localStorage.getItem("auth-token");
  const [vendors, setVendors] = useState([]);

  const imagesInputRef = useRef(null);

  const [addTransactionData, setAddTransactionData] = useState({
    user_id: "",
    invoice_type: visaPage ? "Expense" : "",
    amount: 0,
    total_amount: 0,
    date: "",
    currency: "AED",
    country: "",
    status: "Paid",
    paid_by: "",
    vendor_id: "",
    category: visaPage ? "Visa" : "",
    image: null,
    vat: 0,
  });

  console.log("addtransaction data: ", addTransactionData);

  const [user, setUser] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [page, setPage] = useState(1);

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

  // Function to merge selectStyles with error styles
  const getMergedStyles = (hasError, currentStyles) => {
    const errorStyles = {
      control: (provided) => ({
        ...provided,
        borderColor: hasError ? "red" : provided.borderColor,
        "&:hover": {
          borderColor: hasError ? "red" : provided.borderColor,
        },
        boxShadow: hasError ? "0 0 0 1px red" : provided.boxShadow,
      }),
    };

    // Merge the errorStyles with the currentStyles
    const mergedStyles = {
      ...currentStyles,
      control: (provided) => ({
        ...currentStyles.control(provided),
        ...errorStyles.control(provided),
      }),
    };

    return mergedStyles;
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

  // Define an error state object
  const [fieldErrors, setFieldErrors] = useState({
    invoice_type: false,
    amount: false,
    date: false,
    currency: false,
    category: false,
  });

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

      console.log("vendors list:: ", vendorResponse);
      console.log("users list:: ", userResponse);

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
      console.log("Users: ", response);

      if (type === "user") {
        setUser(response?.data?.managers?.data);
      } else {
        setVendors(response?.data?.data?.data);
      }

      setUserLoading(false);
    } catch (error) {
      setUserLoading(false);
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

  const fetchTransactions = async () => {
    setloading(true);
    try {
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

      console.log("activeFilters:: ", activeFilters);
      console.log("queryParams:: ", queryParams);

      let url;
      // if (isUrl) {
      url = `${BACKEND_URL}/invoices?page=${page}${queryParams}`;
      // } else {
      // url = `${BACKEND_URL}/invoices?page=${page}&added_by=${User?.id}`;
      // }

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

      // if (vendors?.length == 0) {
      await fetchVendor();
      // }
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

  useEffect(() => {
    fetchTransactions();
  }, [filtersData, page, "/visa"]);

  return (
    <div className="flex flex-col gap-5">

      {/* NEW TRANSACTION */}
      <NewTransactionForm
        fetchTransactions={fetchTransactions}
        addTransactionData={addTransactionData}
        setAddTransactionData={setAddTransactionData}
        user={user}
        vendors={vendors}
        loading={loading}
        fetchUsers={fetchUsers}
        fullRow={true}
        visa={visaPage}
      />

      {/* TRANSACTIONS LIST */}
      <TransactionsList filtersData={filtersData} />

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

export default VisaTransaction;
