import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const CreateOffer = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, formatNum } = useStateContext();
  const [validFromDate, setValidFromDate] = useState("");
  const [validFromDateValue, setValidFromDateValue] = useState({});
  const [validToDate, setValidToDate] = useState("");
  const [validToDateValue, setValidToDateValue] = useState({});

  useEffect(() => {
    setValidFromDateValue(dayjs("2023-01-01"));
    setValidToDateValue(dayjs("2023-01-01"));
  }, []);
  return (
    <div>
      <div
        className={`${
          currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
        } rounded-md p-5`}
      >
        <h3 className="text-main-red-color font-semibold mb-3 text-center">
          Create New Offer
        </h3>
        <hr className="mb-5"></hr>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5 py-5">
          <Box sx={darkModeColors}>
            <TextField
              type={"text"}
              label="Offer Title"
              className="w-full mb-3"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
              value=""
            />
            <TextField
              type={"text"}
              label="Offer Description"
              className="w-full mb-3"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
              value=""
            />
            <div className="grid grid-cols-2 gap-3 mb-1">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Valid From"
                  className="w-full"
                  style={{ marginBottom: "20px" }}
                  value={validFromDateValue}
                  views={["year", "month", "day"]}
                  onChange={(newValue) => {
                    setValidFromDateValue(newValue);
                    setValidFromDate(
                      formatNum(newValue.$d.getUTCFullYear()) +
                        "-" +
                        formatNum(newValue.$d.getUTCMonth() + 1) +
                        "-" +
                        formatNum(newValue.$d.getUTCDate() + 1)
                    );
                  }}
                  format="yyyy-MM-dd"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Valid To"
                  className="w-full"
                  style={{ marginBottom: "20px" }}
                  value={validToDateValue}
                  views={["year", "month", "day"]}
                  onChange={(newValue) => {
                    setValidToDateValue(newValue);
                    setValidToDate(
                      formatNum(newValue.$d.getUTCFullYear()) +
                        "-" +
                        formatNum(newValue.$d.getUTCMonth() + 1) +
                        "-" +
                        formatNum(newValue.$d.getUTCDate() + 1)
                    );
                  }}
                  format="yyyy-MM-dd"
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </div>
          </Box>
          <div
            className={`${
              currentMode === "dark" ? "bg-gray-900" : "bg-gray-200"
            } rounded-md px-5 pt-5 mx-5 mb-1`}
          >
            <Box sx={darkModeColors}>
              <label className="font-semibold text-sm">
                <span className="text-main-red-color">Valid for:</span>
              </label>
              <br></br>
              <FormControl>
                <RadioGroup defaultValue="Both" name="radio-buttons-group">
                  <FormControlLabel
                    className="m-1"
                    value="Managers"
                    control={<Radio />}
                    label="Sales Managers"
                  />
                  <FormControlLabel
                    className="m-1"
                    value="Agents"
                    control={<Radio />}
                    label="Sales Agents"
                  />
                  <FormControlLabel
                    className="mt-1"
                    value="Both"
                    control={<Radio />}
                    label="Both"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </div>
        </div>

        <Button
          type="submit"
          size="medium"
          className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
          style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
        >
          CREATE
        </Button>
      </div>
    </div>
  );
};

export default CreateOffer;
