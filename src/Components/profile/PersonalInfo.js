import { Button } from "@material-tailwind/react";
import {
  Box,
  MenuItem,
  TextField,
  CircularProgress,
  FormControl,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useStateContext } from "../../context/ContextProvider";

export const PersonalInfo = ({
  PersonalInfoData,
  User,
  btnloading,
  UpdateProfile,
}) => {
  const { currentMode, darkModeColors, t } = useStateContext();
  console.log(PersonalInfoData);
  const [PersonalInfo, setPersonalInfo] = useState(PersonalInfoData);
  const [Datevalue, setDatevalue] = useState(PersonalInfoData.dob);
  const [error, setError] = useState(false);

  const handleCountry = (e) => {
    const value = e.target.value;
    const onlyLetters = /^[A-Za-z]*$/;
    if (onlyLetters.test(value)) {
      setError(false);
      setPersonalInfo({
        ...PersonalInfo,
        nationality: value,
      });
    } else {
      setError("Kindly enter a valid country name.");
    }
  };

  const currentDate = new Date();

  const UpdateProfileFunc = () => {
    UpdateProfile(PersonalInfo);
  };

  function format(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  return (
    <div className="relative w-full">
      <form action="">
        <Box sx={darkModeColors} className="grid grid-cols-6 gap-x-3 gap-y-5">
          <div className="col-span-3 w-full">
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={Datevalue}
                onChange={(newValue) => {
                  console.log(newValue);
                  setDatevalue(newValue);
                  setPersonalInfo({
                    ...PersonalInfo,
                    dob:
                      format(newValue.$d.getUTCFullYear()) +
                      "-" +
                      format(newValue.$d.getUTCMonth() + 1) +
                      "-" +
                      format(newValue.$d.getUTCDate() + 1),
                  });
                  console.log(Datevalue);
                }}
                renderInput={(params) => <TextField {...params} />}
                className="w-full"
                required
              />
            </LocalizationProvider> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label={t("label_dob")}
                value={Datevalue}
                onChange={(newValue) => {
                  console.log(newValue);
                  setDatevalue(newValue);
                  setPersonalInfo({
                    ...PersonalInfo,
                    dob:
                      format(newValue?.$d.getUTCFullYear()) +
                      "-" +
                      format(newValue?.$d.getUTCMonth() + 1) +
                      "-" +
                      format(newValue?.$d.getUTCDate() + 1),
                  });
                  console.log(Datevalue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onKeyDown={(e) => e.preventDefault()}
                    readOnly={true}
                  />
                )}
                className="w-full"
                required
                maxDate={currentDate}
                // minDate={minDate}
                // inputFormat="MM/dd/yyyy"
                disableFuture
                invalidDateMessage="Invalid date"
                mask="__/__/____"
              />
            </LocalizationProvider>
          </div>
          <div className="col-span-3 w-full">
            <FormControl className="w-full">
              <TextField
                id="gender"
                label={t("label_gender")}
                value={PersonalInfo?.gender}
                onChange={(event) =>
                  setPersonalInfo({
                    ...PersonalInfo,
                    gender: event.target.value,
                  })
                }
                size="medium"
                className="w-full"
                select
                displayEmpty
                required
              >
                <MenuItem value="" disabled>
                {t("select_gender")}
                </MenuItem>
                <MenuItem value={"Male"}>{t("label_male")}</MenuItem>
                <MenuItem value={"Female"}>{t("label_female")}</MenuItem>
              </TextField>
            </FormControl>
          </div>
          <div className="col-span-3 w-full">
  
            <TextField
              id="country"
              type={"text"}
              label={t("label_country")}
              className="w-full"
              variant="outlined"
              size="medium"
              required
              error={error && error}
              helperText={error && error}
              value={PersonalInfo?.nationality}
              onChange={handleCountry}
            />
          </div>
          <div className="col-span-3 w-full">
            <TextField
              id="address"
              type={"text"}
              label={t("label_address")}
              className="w-full"
              variant="outlined"
              size="medium"
              required
              value={PersonalInfo?.currentAddress}
              onChange={(e) => {
                setPersonalInfo({
                  ...PersonalInfo,
                  currentAddress: e.target.value,
                });
                console.log("address: ", PersonalInfo.currentAddress);
              }}
            />
          </div>
          <div className="col-span-3 w-full">
            <Button
              className={`min-w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
              ripple={true}
              style={{
                color: "white"
              }}
              onClick={UpdateProfileFunc}
              size="lg"
            >
              {btnloading ? (
                <CircularProgress
                  sx={{ color: "white" }}
                  size={16}
                  className="text-white"
                />
              ) : (
                <span>{t("update_profile")}</span>
              )}
            </Button>
          </div>
 
        </Box>
      </form>
      <div className="flex justify-between px-10 w-full pt-10">
        <div
          className={`text-center ${
            currentMode === "dark" ? "text-gray-50" : "text-gray-600"
          }`}
        >
          <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
            <h1>{t("created")}</h1>
          </div>
          {User?.creationDate}
        </div>
        <div
          className={`text-center ${
            currentMode === "dark" ? "text-gray-50" : "text-gray-600"
          }`}
        >
          <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
            <h1>{t("last_updated")}</h1>
          </div>
          {User?.lastEdited}
        </div>
      </div>
    </div>
  );
};
