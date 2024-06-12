import { Box, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { currencies } from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import Select from "react-select";

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
  return (
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
      >
        {/* DATE */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            // value={commissionData?.date}
            label={t("date")}
            views={["day", "month", "year"]}
            // onChange={(newValue) => {
            //   const formattedDate = moment(newValue?.$d).format(
            //     "YYYY-MM-DD"
            //   );

            //   setCommissionData((prev) => ({
            //     ...prev,
            //     date: formattedDate,
            //   }));
            // }}
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
            // maxDate={dayjs().startOf("day").toDate()}
          />
        </LocalizationProvider>

        {/* COMMISSION */}
        <div className="grid grid-cols-2">
          {/* CURRENCY */}
          <Select
            id="currency"
            options={currencies(t)}
            // value={currencies(t)?.find(
            //   (curr) => curr.value === commissionData?.currency
            // )}
            // onChange={(e) => {
            //   setCommissionData({
            //     ...commissionData,
            //     currency: e.value,
            //   });
            // }}
            placeholder={t("label_select_currency")}
            // className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          {/* AMOUNT */}
          <TextField
            id="amount"
            type={"text"}
            label={t("commission_amount")}
            className="w-full col-span-2"
            sx={{
              "&": {
                // marginBottom: "1.25rem !important",
                zIndex: 1,
              },
            }}
            variant="outlined"
            size="small"
            // value={commissionData?.amount}
            // onChange={handleChange}
            required
          />
        </div>
      </Box>
    </div>
  );
};

export default Petty_Cash_Form;
