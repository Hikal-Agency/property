import { Button } from "@material-tailwind/react";
import { Box, MenuItem, Select, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useStateContext } from "../../context/ContextProvider";

export const PersonalInfo = ({ PersonalInfoData, User }) => {
  const { currentMode, darkModeColors } = useStateContext();
  console.log(PersonalInfoData);
  const [PersonalInfo, setPersonalInfo] = useState(PersonalInfoData);
  const [Datevalue, setDatevalue] = useState(PersonalInfoData.dob);
  const [gender, setgender] = useState(User.gender ? User.gender : "");

  const ChangeGender = (event) => {
    setgender(event.target.value);
  };
  return (
    <div className="relative w-full">
      <form action="">
        <Box sx={darkModeColors} className="grid grid-cols-6 gap-x-3 gap-y-5">
          <div className="col-span-3 w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={Datevalue}
                onChange={(newValue) => {
                  console.log(newValue);
                  setDatevalue(newValue);
                  console.log(Datevalue);
                }}
                renderInput={(params) => <TextField {...params} />}
                className="w-full"
                required
              />
            </LocalizationProvider>
          </div>
          <div className="col-span-3 w-full">
            <Select
              id="gender"
              value={gender}
              label="Gender"
              onChange={ChangeGender}
              size="medium"
              className="w-full"
              displayEmpty
              required
            >
              <MenuItem value="" disabled>
                Select Gender
              </MenuItem>
              <MenuItem value={"Male"}>Male</MenuItem>
              <MenuItem value={"Female"}>Female</MenuItem>
            </Select>
          </div>
          <div className="col-span-3 w-full">
            <TextField
              id="country"
              type={"text"}
              label="Country"
              className="w-full"
              variant="outlined"
              size="medium"
              required
              value={PersonalInfo?.nationality}
              onChange={(e) =>
                setPersonalInfo({
                  ...PersonalInfo,
                  nationality: e.target.value,
                })
              }
            />
          </div>
          <div className="col-span-3 w-full">
            <TextField
              id="address"
              type={"text"}
              label="Address"
              className="w-full"
              variant="outlined"
              size="medium"
              required
              value={PersonalInfo?.address}
              onChange={(e) =>
                setPersonalInfo({
                  ...PersonalInfo,
                  address: e.target.value,
                })
              }
            />
          </div>
          <div className="col-span-3 w-full">
            <Button
              className={`min-w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
              ripple={true}
              size="lg"
            >
              Update Profile
            </Button>
          </div>
          {/* <div className="col-span-3 w-full">
            <Button
              ripple={true}
              variant="outlined"
              type="reset"
              className="shadow-none w-full rounded-md text-sm  text-main-red-color border-main-red-color"
            >
              Reset
            </Button>
          </div> */}
        </Box>
      </form>
      <div className="flex justify-between px-10 w-full pt-10">
        <div
          className={`text-center ${
            currentMode === "dark" ? "text-gray-50" : "text-gray-600"
          }`}
        >
          <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
            <h1>Created</h1>
          </div>
          {User?.creationDate}
        </div>
        <div
          className={`text-center ${
            currentMode === "dark" ? "text-gray-50" : "text-gray-600"
          }`}
        >
          <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
            <h1>Last Updated</h1>
          </div>
          {User?.lastEdited}
        </div>
      </div>
    </div>
  );
};
