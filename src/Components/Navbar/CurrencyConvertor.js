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
import useCurrencyInfo from "../_elements/currencyConverter";
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

  const [from, setFrom] = useState("aed");
  const [to, setTo] = useState("usd");
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [currencies, options] = useCurrencyInfo(from);

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
        } p-5 flex flex-col gap-[30px] `}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-[12px]`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 12,
              top: 10,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setCurrencyModal(false)}
          >
            <IoMdClose size={18} />
          </IconButton>
          <div className=" flex flex-col gap-[30px] ">
            <h1
              className={`${
                currentMode === "dark" ? `text-white` : "text-black"
              } text-center uppercase font-semibold pb-5 text-[25px]`}
            >
              {t("label_currency")} {t("label_converter")}
            </h1>

            <div className="flex gap-[15px] h-[50px]">
              <Select
                id="fromcurrency"
                options={options?.map((curr) => ({
                  value: curr,
                  label: curr?.toUpperCase(),
                }))}
                value={{ value: from, label: from?.toUpperCase() }}
                onChange={(e) => {
                  setFrom(e?.value);
                  setConvertedAmount(0);
                }}
                menuPortalTarget={document.body}
                className="md:w-[20%] w-[30%]  !h-full"
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
              <TextField
                id="from_currency"
                type={"number"}
                label="From"
                className=" md:w-[80%] w-[70%] text-[16px] font-semibold"
                variant="outlined"
                size="medium"
                required
                onChange={(e) => {
                  // setAmount(Number(e?.target?.value));
                  setAmount(e?.target?.value);
                  if (convertedAmount) {
                    setConvertedAmount(0);
                  }
                }}
                value={amount}
              />
            </div>
            <div className="flex gap-[15px] h-[50px]">
              <Select
                id="to_currency"
                options={options?.map((curr) => ({
                  value: curr,
                  label: curr?.toLocaleUpperCase(),
                }))}
                value={{ value: to, label: to?.toUpperCase() }}
                onChange={(e) => {
                  setTo(e?.value);
                }}
                className="md:w-[20%] w-[30%] !h-full"
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
              <TextField
                id="to_currency"
                type={"number"}
                label="To"
                className="md:w-[80%] w-[70%] text-[16px] font-semibold"
                variant="outlined"
                size="medium"
                // disabled={true}
                value={convertedAmount?.toFixed(2)}
              />
            </div>
            <div className="w-full flex gap-[15px] ">
              <button
                onClick={() => convert()}
                ripple={true}
                variant="outlined"
                className={`shadow-none p-3 rounded-md text-[14px] text-center  border-none text-white w-full ${
                  themeBgImg
                    ? "blur-bg-primary"
                    : currentMode === "dark"
                    ? "bg-primary-dark-neu"
                    : "bg-primary-light-neu"
                } w-full`}
              >
                Convert from {from?.toUpperCase()} to {to?.toUpperCase()}
              </button>
              {/* <button
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
              </button> */}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CurrencyConvertor;
