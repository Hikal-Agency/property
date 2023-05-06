import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const currentDate = dayjs();

const CreateOffer = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, formatNum, BACKEND_URL } =
    useStateContext();
  const [validFromDate, setValidFromDate] = useState("");
  const [validFromDateValue, setValidFromDateValue] = useState({});
  const [validToDate, setValidToDate] = useState("");
  const [validToDateValue, setValidToDateValue] = useState({});
  const [loading, setloading] = useState(false);

  const [offerData, setOfferData] = useState({
    offerTitle: "",
    offerDescription: "",
    validToManager: 1,
    validToSales: 1,
  });

  const handleClick = async (e) => {
    e.preventDefault();

    const { offerTitle, offerDescription } = offerData;

    if (!offerTitle || !offerDescription || !validFromDate || !validToDate) {
      toast.error("Please fill all the required fields", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // check if validTo date is greater than validFrom date
    if (new Date(validToDate) < new Date(validFromDate)) {
      toast.error("Valid To date cannot be before Valid From date", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    console.log("OFFer Data: ", offerData);
    console.log("OFFer Valid from: ", validFromDate);
    console.log("OFFer Valid To: ", validToDate);

    setloading(true);
    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("User", user);
    const creationDate = new Date();
    const Offer = new FormData();

    Offer.append(
      "creationDate",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );
    Offer.append("offerTitle", offerData.offerTitle);
    Offer.append("offerDescription", offerData.offerDescription);
    Offer.append("status", "Open");
    Offer.append("validFrom", validFromDate);
    Offer.append("validTill", validToDate);
    Offer.append("offerFrom", user?.id);
    Offer.append("offerAgency", user?.agency);
    Offer.append("validToManager", offerData.validToManager);
    Offer.append("validToSales", offerData.validToSales);

    console.log("Offer append: ", Offer);

    try {
      const submitOffer = await axios.post(`${BACKEND_URL}/offers`, Offer, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("OFFer submitted: ", submitOffer);

      toast.success("Offer Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setOfferData({
        offerTitle: "",
        offerDescription: "",
        validToManager: "",
        validToSales: "",
      });
      setValidFromDate("");
      setValidToDate("");

      setloading(false);
    } catch (error) {
      console.log("Error: ", error);
      setloading(false);
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

  // useEffect(() => {
  //   setValidFromDateValue(dayjs("2023-01-01"));
  //   setValidToDateValue(dayjs("2023-01-01"));
  // }, []);
  return (
    <div>
      <ToastContainer />
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
              label="Offer Title "
              className="w-full mb-3"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              name="offerTitle"
              size="medium"
              value={offerData.offerTitle}
              onChange={(e) =>
                setOfferData({ ...offerData, offerTitle: e.target.value })
              }
              required
            />
            <TextField
              type="text"
              label="Offer Description"
              className="w-full mb-3"
              name="offerDescription"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
              value={offerData.offerDescription}
              required
              onChange={(e) =>
                setOfferData({ ...offerData, offerDescription: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-3 mb-1">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Valid From"
                  className="w-full"
                  style={{ marginBottom: "20px" }}
                  value={validFromDateValue}
                  views={["year", "month", "day"]}
                  minDate={currentDate.toDate()}
                  onChange={(newValue) => {
                    setValidFromDateValue(newValue);
                    setValidFromDate(
                      formatNum(newValue?.$d?.getUTCFullYear()) +
                        "-" +
                        formatNum(newValue?.$d?.getUTCMonth() + 1) +
                        "-" +
                        formatNum(newValue?.$d?.getUTCDate() + 1)
                    );
                  }}
                  format="yyyy-MM-dd"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onKeyDown={(e) => e.preventDefault()}
                      readOnly={true}
                    />
                  )}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Valid To"
                  className="w-full"
                  style={{ marginBottom: "20px" }}
                  value={validToDateValue}
                  views={["year", "month", "day"]}
                  minDate={currentDate.toDate()}
                  onChange={(newValue) => {
                    setValidToDateValue(newValue);
                    setValidToDate(
                      formatNum(newValue?.$d?.getUTCFullYear()) +
                        "-" +
                        formatNum(newValue?.$d?.getUTCMonth() + 1) +
                        "-" +
                        formatNum(newValue?.$d?.getUTCDate() + 1)
                    );
                  }}
                  format="yyyy-MM-dd"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onKeyDown={(e) => e.preventDefault()}
                      readOnly={true}
                    />
                  )}
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
                    value="manager"
                    name="validToManager"
                    control={<Radio />}
                    label="Sales Managers"
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        validToManager: 1,
                        validToSales: 0,
                      })
                    }
                  />
                  <FormControlLabel
                    className="m-1"
                    value="agent"
                    name="validToSales"
                    control={<Radio />}
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        validToSales: 1,
                        validToManager: 0,
                      })
                    }
                    label="Sales Agents"
                  />
                  <FormControlLabel
                    className="mt-1"
                    value="Both"
                    onChange={(e) =>
                      setOfferData({
                        ...offerData,
                        validToSales: 1,
                        validToManager: 1,
                      })
                    }
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
          onClick={handleClick}
          disabled={loading ? true : false}
        >
          {loading ? (
            <CircularProgress
              size={23}
              sx={{ color: "white" }}
              className="text-white"
            />
          ) : (
            <span> Create</span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateOffer;
