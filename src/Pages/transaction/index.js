import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
  MenuItem,
  InputAdornment,
  Checkbox,
  FormLabel,
} from "@mui/material";
import { FaLinkedin } from "react-icons/fa";

import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import moment from "moment";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { ImFacebook2 } from "react-icons/im";
import { FaInstagramSquare, FaTiktok, FaSnapchat } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { CountryDropdown } from "react-country-region-selector";
import { FaStripe, FaPaypal, FaUniversity, FaCreditCard } from "react-icons/fa";
import { useRef } from "react";
import AddDocumentModal from "../../Pages/listings/AddDocumentModal";
import { FaWallet } from "react-icons/fa";
import Loader from "../../Components/Loader";
import Transactions from "../../Components/TransactionComp/Transactions";
import { useLocation } from "react-router-dom";
import TransactionsPage from "../../Components/TransactionComp/TransactionsPage";
import VisaTransaction from "../../Components/TransactionComp/VisaTransaction";

const currentDate = dayjs();

const Transaction = ({ isLoading }) => {
  const {
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    themeBgImg,
    t,
  } = useStateContext();

  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  console.log("pathname: ", pathname);

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="flex relative min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 mt-2 ${!themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
              } ${currentMode === "dark" ? "text-white" : "text-black"}`}
          >
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1 className={`text-lg font-semibold mx-2 uppercase`}>
                {pathname === "/transactions" ? t("transaction") : t("visa")}
              </h1>
            </div>

            <div className="mt-3 pb-3">
              {pathname === "/visa" ? (
                <VisaTransaction isLoading={loading} pathname={pathname} />
              ) : (
                <TransactionsPage isLoading={loading} pathname={pathname} />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Transaction;
