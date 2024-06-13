import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { boss, countries_list, currencies } from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import Select from "react-select";
import { toast } from "react-toastify";
import moment from "moment";
import axios from "../../axoisConfig";

const Petty_Cash_Form = () => {
  const {
    currentMode,
    t,
    BACKEND_URL,
    darkModeColors,
    isLangRTL,
    i18n,
    isArabic,
    fontFam,
    primaryColor,
  } = useStateContext();

  console.log(
    "boss list: ",
    boss(t)?.map((boss) => ({
      value: boss?.id,
      name: boss?.name,
    }))
  );
  const [btnLoading, setBtnLoading] = useState(false);
  const token = localStorage.getItem("auth-token");

  const [petty_data, setPettyData] = useState({
    date: "",
    country: "",
    currency: "AED",
    fund_amount: "",
    type: "Fund",
    fund_by: "",
  });

  console.log("petty data:", petty_data);

  const AddPettyCash = async (e) => {
    e.preventDefault();

    setBtnLoading(true);

    try {
      const submitPettyCash = await axios.post(
        `${BACKEND_URL}/pettycash`,
        petty_data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("petty cash submited ", submitPettyCash);

      if (submitPettyCash?.data?.status === false) {
        toast.error(`${submitPettyCash?.data?.message}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setBtnLoading(false);

        return;
      }

      toast.success(`Petty Cash Added. `, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setPettyData({
        date: "",
        country: "",
        currency: "AED",
        fund_amount: "",
        fund_by: "",
      });

      setBtnLoading(false);
    } catch (error) {
      console.log("Error: ", error);
      setBtnLoading(false);
      toast.error("Something went wrong! Please Try Again", {
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

  return (
    <div className="flex flex-row items-center justify-between space-x-3">
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
          width: "80%",
          marginTop: "5px",
        }}
      >
        {/* DATE */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={petty_data?.date}
            label={t("date")}
            views={["day", "month", "year"]}
            onChange={(newValue) => {
              const formattedDate = moment(newValue?.$d).format("YYYY-MM-DD");

              setPettyData((prev) => ({
                ...prev,
                date: formattedDate,
              }));
            }}
            format="DD-MM-YYYY"
            renderInput={(params) => (
              <TextField
                sx={{
                  "& input": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                  "& .MuiSvgIcon-root": {
                    color: currentMode === "dark" ? "white" : "black",
                  },
                  marginBottom: "15px",
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
          width: "100%",
          marginTop: "10px",
        }}
      >
        <div className="grid grid-cols-4">
          {/* CURRENCY */}
          <Select
            id="currency"
            options={currencies(t)}
            value={currencies(t)?.find(
              (curr) => curr.value === petty_data?.currency
            )}
            onChange={(e) => {
              setPettyData({
                ...petty_data,
                currency: e.value,
              });
            }}
            placeholder={t("label_select_currency")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          {/* AMOUNT */}
          <TextField
            id="fund_amount"
            type={"text"}
            label={t("amount")}
            className="w-full col-span-2"
            sx={{
              "&": {
                zIndex: 1,
              },
            }}
            variant="outlined"
            size="small"
            value={petty_data?.fund_amount}
            onChange={(e) =>
              setPettyData({
                ...petty_data,
                [e.target.id]: e.target.value,
              })
            }
            required
          />
        </div>
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
          width: "80%",
          marginTop: "10px",
        }}
      >
        <Select
          id="country"
          options={countries_list(t)}
          value={countries_list(t)?.find(
            (country) => country.value === petty_data?.country
          )}
          onChange={(e) => {
            setPettyData({
              ...petty_data,
              country: e.value,
            });
          }}
          placeholder={t("label_country")}
          menuPortalTarget={document.body}
          styles={selectStyles(currentMode, primaryColor)}
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
          width: "80%",
          marginTop: "10px",
        }}
      >
        <Select
          id="fund_by"
          options={boss(t)?.map((boss) => ({
            value: boss?.id,
            label: boss?.name,
          }))}
          value={currencies(t)?.find(
            (curr) => curr.value === petty_data?.fund_by
          )}
          onChange={(e) => {
            setPettyData({
              ...petty_data,
              fund_by: e.value,
            });
          }}
          placeholder={t("label_fund_by")}
          // className={`mb-5`}
          menuPortalTarget={document.body}
          styles={selectStyles(currentMode, primaryColor)}
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
        <Button
          type="submit"
          size="medium"
          style={{
            color: "white",
            fontFamily: fontFam,
            width: "100%",
          }}
          className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
          onClick={AddPettyCash}
          disabled={btnLoading ? true : false}
        >
          {btnLoading ? (
            <CircularProgress
              size={23}
              sx={{ color: "white" }}
              className="text-white"
            />
          ) : (
            <span>{t("save")}</span>
          )}
        </Button>
      </Box>
    </div>
  );
};

export default Petty_Cash_Form;
