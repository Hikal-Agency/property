import { TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { useStateContext } from "../../context/ContextProvider";

const Petty_Cash_Form = () => {
  const { currentMode, t, BACKEND_URL } = useStateContext();
  return (
    <div>
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
    </div>
  );
};

export default Petty_Cash_Form;
