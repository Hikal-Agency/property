import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Select from "react-select";
import { selectStyles } from "../_elements/SelectStyles";
import useCurrencyInfo from "../../utils/currencyConverter";
import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CurrencyConvertor = ({ setCurrencyModal, currencyModal }) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    t,
    primaryColor,
    themeBgImg,
    i18n,
    isLangRTL,
  } = useStateContext();

  const [from, setFrom] = useState("usd");
  const [to, setTo] = useState("pkr");
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const currencies = useCurrencyInfo(from);

  console.log(currencies, "currencies");

  const options = Object?.keys(currencies);

  const convert = () => {
    setConvertedAmount(amount * currencies[to]);
  };

  //   let mySelectStyles =
  return (
    <Modal
      keepMounted
      open={currencyModal}
      onClose={() => setCurrencyModal(false)}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
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
        className={`${
          themeBgImg
            ? currentMode === "dark"
              ? "blur-bg-dark shadow-sm"
              : "blur-bg-light shadow-sm"
            : currentMode === "dark"
            ? "bg-dark-neu"
            : "bg-light-neu"
        } p-5 flex flex-col gap-[30px]`}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <div className=" flex flex-col gap-[30px] ">
            <h1
              className={`${
                currentMode === "dark" ? `text-white` : "text-black"
              } text-center uppercase font-semibold pb-5 text-[30px]`}
            >
              Currency Convertor
            </h1>

            <div className="flex gap-[15px] h-[50px]">
              <TextField
                id="from_currency"
                type={"number"}
                label="From"
                className=" w-[80%] text-[16px] font-semibold"
                variant="outlined"
                size="medium"
                required
                onChange={(e) => {
                  // setAmount(Number(e?.target?.value));
                  setAmount(e?.target?.value);
                }}
                value={amount}
              />
              <Select
                id="fromcurrency"
                options={options?.map((curr) => ({
                  value: curr,
                  label: curr,
                }))}
                value={{ value: from, label: from }}
                onChange={(e) => {
                  setFrom(e?.value);
                  setConvertedAmount(0);
                }}
                menuPortalTarget={document.body}
                className="w-[20%] !h-full"
                styles={{
                  ...selectStyles(currentMode, primaryColor),
                  control: (provided) => ({
                    ...provided,
                    background: "transparent",
                    borderColor: currentMode === "dark" ? "#EEEEEE" : "#666666",
                    color: currentMode === "dark" ? "#FFFFFF" : "#000000",
                    height: "100%",
                    minHeight: "34px",
                  }),
                }}
              />
            </div>
            <div className="flex gap-[15px] h-[50px]">
              <TextField
                id="to_currency"
                type={"number"}
                label="From"
                className="w-[80%] text-[16px] font-semibold"
                variant="outlined"
                size="medium"
                // disabled={true}
                value={convertedAmount?.toFixed(2)}
              />
              <Select
                id="to_currency"
                options={options?.map((curr) => ({
                  value: curr,
                  label: curr,
                }))}
                value={{ value: to, label: to }}
                onChange={(e) => {
                  setTo(e?.value);
                }}
                className="w-[20%] !h-full"
                menuPortalTarget={document.body}
                styles={{
                  ...selectStyles(currentMode, primaryColor),
                  control: (provided) => ({
                    ...provided,
                    background: "transparent",
                    borderColor: currentMode === "dark" ? "#EEEEEE" : "#666666",
                    color: currentMode === "dark" ? "#FFFFFF" : "#000000",
                    height: "100%",
                    minHeight: "34px",
                  }),
                }}
              />
            </div>
            <div className="w-full flex gap-[15px] ">
              <button
                onClick={() => convert()}
                ripple={true}
                variant="outlined"
                className={`shadow-none p-3 rounded-md text-[14px] text-center  border-none text-white !w-[80%] ${
                  themeBgImg
                    ? "blur-bg-primary"
                    : currentMode === "dark"
                    ? "bg-primary-dark-neu"
                    : "bg-primary-light-neu"
                } w-full`}
              >
                Convert from {from} to {to}
              </button>
              <button
                onClick={() => setCurrencyModal(false)}
                ripple={true}
                variant="outlined"
                className={`shadow-none p-3 rounded-md text-[14px] text-center  border-none text-white !w-[20%] ${
                  themeBgImg
                    ? "blur-bg-primary"
                    : currentMode === "dark"
                    ? "bg-primary-dark-neu"
                    : "bg-primary-light-neu"
                } w-full`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CurrencyConvertor;
