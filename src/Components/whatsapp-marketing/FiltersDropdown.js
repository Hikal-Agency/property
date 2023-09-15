import { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  FormControl,
  InputLabel,
  CircularProgress,
  Menu,
} from "@mui/material";
import { GrFormClose } from "react-icons/gr";
import { BiFilter } from "react-icons/bi";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SendSMSModal from "./SendSMSModal";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useEffect } from "react";
import moment from "moment";

const leadOrigins = [
  { id: "hotleads", formattedValue: "Fresh", originID: 0 },
  { id: "thirdpartyleads", formattedValue: "Third Party", originID: 3 },
  { id: "transfferedleads", formattedValue: "Reshuffled", originID: 0 },
  { id: "coldleads", formattedValue: "Cold", originID: 1 },
  { id: "archive", formattedValue: "Archived", originID: 4 },
  { id: "personalleads", formattedValue: "Personal", originID: 2 },
];
const leadTypes = [
  { id: "all", formattedValue: "All" },
  { id: "new", formattedValue: "New" },
  { id: "follow up", formattedValue: "Follow Up" },
  { id: "meeting", formattedValue: "Meeting" },
  { id: "low budget", formattedValue: "Low Budget" },
  { id: "not interested", formattedValue: "Not Interested" },
  { id: "no answer", formattedValue: "No Answer" },
  { id: "unreachable", formattedValue: "Unreachable" },
  { id: "dead", formattedValue: "Dead" },
];

const enquiryTypes = [
  {
    id: "studio",
    formattedValue: "Studio",
  },
  {
    id: "1 bedroom",
    formattedValue: "1 Bedroom",
  },
  {
    id: "2 bedrooms",
    formattedValue: "2 Bedrooms",
  },
  {
    id: "3 bedrooms",
    formattedValue: "3 Bedrooms",
  },
  {
    id: "4 bedrooms",
    formattedValue: "4 Bedrooms",
  },
  {
    id: "5 bedrooms",
    formattedValue: "5 Bedrooms",
  },
  {
    id: "6 bedrooms",
    formattedValue: "6 Bedrooms",
  },
  {
    id: "retail",
    formattedValue: "Retail",
  },
  {
    id: "others",
    formattedValue: "Others",
  },
];

const otpTypes = [
  {
    id: "No OTP Used",
    formattedValue: "NO OTP",
  },
  {
    id: "VERIFIED",
    formattedValue: "Verified",
  },
  {
    id: "UNVERIFIED",
    formattedValue: "Unverified",
  },
];

const FiltersDropdown = ({
  leadOriginSelected,
  managers,
  agents,
  otpSelected,
  setOtpSelected,
  agentSelected,
  setAgentSelected,
  setProjectNameTyped,
  setLeadOriginSelected,
  phoneNumberFilter,
  setPhoneNumberFilter,
  languageFilter,
  setLanguageFilter,
  managerSelected,
  emailFilter,
  setEmailFilter,
  setManagerSelected,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  leadTypeSelected,
  setLeadTypeSelected,
  enquiryTypeSelected,
  setEnquiryTypeSelected,
  projectNameTyped,
  setAgents,
  toRange,
  setToRange,
  fromRange,
  setFromRange,
}) => {
  const [sendSMSModal, setSendSMSModal] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rangeData, setRangeData] = useState([]);
  const { currentMode, darkModeColors, BACKEND_URL, pageState, formatNum } =
    useStateContext();
  const token = localStorage.getItem("auth-token");
  const formatDate = (dateObj) => {
    return (
      formatNum(dateObj?.$d?.getUTCFullYear()) +
      "-" +
      formatNum(dateObj?.$d?.getUTCMonth() + 1) +
      "-" +
      formatNum(dateObj?.$d?.getUTCDate() + 1)
    );
  };
  const handleClick = (event) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const getNumbers = async () => {
    setBtnLoading(true);
    let url = `${BACKEND_URL}/campaign-contact?from=${fromRange}&to=${toRange}&coldcall=${
      leadOriginSelected?.originID || 0
    }`;
    let dateRange;
    if (startDate && endDate) {
      console.log("start ,end: ", startDate, endDate);

      // dateRange = [formattedStartDate, formattedEndDate].join(",");
      dateRange = [startDate, endDate].join(",");
      url += `&date_range=${dateRange}`;
    }

    if (projectNameTyped) {
      url += `&project=${projectNameTyped}`;
    }

    if (enquiryTypeSelected?.i) {
      url += `&enquiryType=${enquiryTypeSelected?.i}`;
    }

    if (managerSelected) {
      url += `&managerAssigned=${managerSelected}`;
    }

    if (agentSelected) {
      url += `&agentAssigned=${agentSelected}`;
    }

    if (otpSelected?.id) {
      url += `&otp=${otpSelected?.id}`;
    }

    if (phoneNumberFilter) {
      url += `&hasphone=${phoneNumberFilter === "with" ? 1 : 0}`;
    }

    if (emailFilter) {
      url += `&hasmail=${emailFilter === "with" ? 1 : 0}`;
    }
    if (languageFilter) {
      url += `&language=${languageFilter}`;
    }

    try {
      const range = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setRangeData(range?.data?.result);
      handleClose();

      setBtnLoading(false);

      console.log("range: ", range);
    } catch (error) {
      setBtnLoading(false);
      toast.error("Unable to fetch data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    console.log("useeffect rangedata: ", rangeData);
    if (rangeData.length > 0) {
      setSendSMSModal(true);
    }
  }, [rangeData]);

  return (
    <Box sx={darkModeColors} className={`w-[350px]`}>
      <div className={`flex justify-end relative`}>
        {!open &&
          (enquiryTypeSelected?.i ||
            phoneNumberFilter ||
            emailFilter ||
            otpSelected?.id ||
            languageFilter ||
            projectNameTyped ||
            managerSelected ||
            startDate ||
            endDate ||
            agentSelected ||
            toRange ||
            fromRange) && (
            <Button
              onClick={() => {
                setEnquiryTypeSelected({ id: 0 });
                setProjectNameTyped("");
                setManagerSelected("");
                setAgentSelected("");
                setOtpSelected({ id: 0 });
                setPhoneNumberFilter("");
                setEmailFilter("");
                setStartDate("");
                setEndDate("");
                setLanguageFilter("");
                setFromRange("");
                setToRange("");
              }}
              sx={{
                color: "white",
                marginRight: 1,
              }}
              style={{
                background: "black",
              }}
            >
              <div className="flex items-center">
                <span>Clear</span>
              </div>
            </Button>
          )}
        <Button
          onClick={(e) => {
            handleClick(e);
          }}
          sx={{
            "& svg path": {
              stroke: "#da1f26 !important",
            },
            color: "#da1f26",
          }}
          style={{
            background: "rgb(218 31 38 / 16%)",
          }}
        >
          {open ? (
            <div className="flex items-center">
              <span>Close</span> <GrFormClose size={19} />
            </div>
          ) : (
            <div className="flex items-center">
              <span>Filters</span> <BiFilter size={19} />
            </div>
          )}
        </Button>
      </div>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClick={(e) => {
          handleClose();
        }}
        PaperProps={{
          elevation: 0,
          sx: {
            "& .MuiMenu-paper": {
              padding: "10px",
            },
            //  height: "auto",
            overflow: "visible",
            //  overflowY: "scroll",
            mt: 0.5,
            filter:
              currentMode === "dark"
                ? "drop-shadow(1px 1px 6px rgb(238 238 238 / 0.3))"
                : "drop-shadow(1px 1px 6px rgb(28 28 28 / 0.3))",
            // background: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
            background:
              currentMode === "dark"
                ? "rgb(28 28 28 / 0.9)"
                : "rgb(238 238 238 / 0.9)",
            color: currentMode === "dark" ? "#FFFFFF" : "#000000",
            minWidth: 300,
            padding: 0,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "& .MuiList-root": {
              padding: "3px",
            },
            "& .MuiList-root .clock-div": {
              background: "transparent !important",
              border: "none !important",
            },
          },
        }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <div className={` mt-2 border-2 rounded-md`}>
          <div className="grid grid-cols-2 gap-x-2">
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: managerSelected ? "25px" : "0",
              }}
            >
              <label
                style={{ position: "absolute", bottom: "-10px", right: 0 }}
                htmlFor="Manager"
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {managerSelected ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => {
                      setManagerSelected("");
                      setAgentSelected("");
                    }}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <FormControl fullWidth>
                  <InputLabel>Manager</InputLabel>
                  <Select
                    id="Manager"
                    value={managerSelected || ""}
                    onChange={(event) => setManagerSelected(event.target.value)}
                    size="small"
                    fullWidth
                    className={`w-full mt-1 mb-3 `}
                    displayEmpty
                    required
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor:
                          currentMode === "dark" ? "#ffffff" : "#000000",
                      },
                      "&:hover:not (.Mui-disabled):before": {
                        borderColor:
                          currentMode === "dark" ? "#ffffff" : "#000000",
                      },
                    }}
                  >
                    {/* <MenuItem value="" selected disabled></MenuItem> */}
                    {managers?.map((manager, index) => (
                      <MenuItem key={index} value={manager?.id || ""}>
                        {manager?.userName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: agentSelected ? "25px" : "0",
              }}
            >
              <label
                style={{ position: "absolute", bottom: "-10px", right: 0 }}
                htmlFor="Agent"
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {agentSelected ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => {
                      setAgentSelected("");
                      setAgents([]);
                    }}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <Select
                  id="Agent"
                  fullWidth
                  value={agentSelected || ""}
                  onChange={(event) => setAgentSelected(event.target.value)}
                  size="small"
                  className={`w-full mt-1 mb-3`}
                  displayEmpty
                  required
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                    "&:hover:not (.Mui-disabled):before": {
                      borderColor:
                        currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                  }}
                >
                  <MenuItem selected value="" disabled>
                    Agent
                  </MenuItem>
                  {agents[`manager-${managerSelected}`]?.map((agent, index) => (
                    <MenuItem key={index} value={agent?.id || ""}>
                      {agent?.userName}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <Box sx={darkModeColors}>
              <Select
                fullWidth
                id="leadOrigin"
                value={leadOriginSelected?.id || "hotleads"}
                onChange={(event) =>
                  setLeadOriginSelected(
                    leadOrigins.find(
                      (origin) => origin.id === event.target.value
                    )
                  )
                }
                size="small"
                className={`w-full mt-1 mb-3`}
                displayEmpty
                required
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                  "&:hover:not (.Mui-disabled):before": {
                    borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                <MenuItem value="0" disabled>
                  Lead Origin
                </MenuItem>
                {leadOrigins?.map((origin, index) => (
                  <MenuItem key={index} value={origin?.id || ""}>
                    {origin?.formattedValue}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={darkModeColors}>
              <Select
                id="leadType"
                fullWidth
                value={leadTypeSelected?.id || "all"}
                onChange={(event) =>
                  setLeadTypeSelected(
                    leadTypes.find((type) => type.id === event.target.value)
                  )
                }
                size="small"
                className={`w-full mt-1 mb-3`}
                displayEmpty
                required
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                  "&:hover:not (.Mui-disabled):before": {
                    borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                }}
              >
                <MenuItem value="0" disabled>
                  --- Feedback ---
                </MenuItem>
                {leadTypes?.map((type, index) => (
                  <MenuItem key={index} value={type?.id || ""}>
                    {type?.formattedValue}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: enquiryTypeSelected.id ? "25px" : "0",
              }}
            >
              <label
                htmlFor="enquiryType"
                style={{ position: "absolute", bottom: "-10px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {enquiryTypeSelected?.id ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => setEnquiryTypeSelected({ id: 0 })}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <Select
                  fullWidth
                  id="enquiryType"
                  value={enquiryTypeSelected?.id}
                  className={`w-full mt-1 mb-3`}
                  onChange={(event) =>
                    setEnquiryTypeSelected(
                      enquiryTypes.find(
                        (type) => type.id === event.target.value
                      )
                    )
                  }
                  displayEmpty
                  size="small"
                  required
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                    "&:hover:not (.Mui-disabled):before": {
                      borderColor:
                        currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                  }}
                >
                  <MenuItem value="0" disabled>
                    Enquiry
                  </MenuItem>
                  {enquiryTypes?.map((type, index) => (
                    <MenuItem key={index} value={type?.id || ""}>
                      {type?.formattedValue}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </div>
            <div className="mt-1">
              <Box sx={darkModeColors}>
                <TextField
                  className={`w-full`}
                  id="Project"
                  type={"text"}
                  value={projectNameTyped}
                  label="Project Name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) => setProjectNameTyped(e.target.value)}
                />
              </Box>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-2">
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: otpSelected?.id ? "15px" : "0",
              }}
            >
              <label
                htmlFor="otpSelected"
                style={{ position: "absolute", bottom: "-10px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {otpSelected?.id ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => setOtpSelected({ id: 0 })}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <Select
                  fullWidth
                  id="otpSelected"
                  value={otpSelected?.id}
                  className={`w-full mt-1 mb-3`}
                  onChange={(event) =>
                    setOtpSelected(
                      otpTypes.find((type) => type.id === event.target.value)
                    )
                  }
                  displayEmpty
                  size="small"
                  required
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor:
                        currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                    "&:hover:not (.Mui-disabled):before": {
                      borderColor:
                        currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                  }}
                >
                  <MenuItem value="0" disabled>
                    OTP
                  </MenuItem>
                  {otpTypes?.map((type, index) => (
                    <MenuItem key={index} value={type?.id || ""}>
                      {type?.formattedValue}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </div>
            <div className="mt-1">
              <Box sx={darkModeColors}>
                <TextField
                  className={`w-full`}
                  id="language"
                  type={"text"}
                  value={languageFilter}
                  label="Language"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) => setLanguageFilter(e.target.value)}
                />
              </Box>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              marginTop: "10px",
              marginBottom: phoneNumberFilter ? "25px" : "0px",
            }}
          >
            <label
              style={{ position: "absolute", bottom: "-16px", right: 0 }}
              className={`flex justify-end items-center ${
                currentMode === "dark" ? "text-white" : "text-dark"
              } `}
            >
              {phoneNumberFilter ? (
                <strong
                  className="ml-4 text-red-600 cursor-pointer"
                  onClick={() => setPhoneNumberFilter("")}
                >
                  Clear
                </strong>
              ) : (
                ""
              )}
            </label>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } flex items-center`}
            >
              <p className={`w-[25%]`}>Phone</p>
              <div className="flex flex-1 pr-6 justify-between items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="with"
                    className="mr-2"
                    checked={phoneNumberFilter === "with"}
                    onChange={(e) => setPhoneNumberFilter(e.target.value)}
                  />
                  Available
                </label>
                <label>
                  <input
                    type="radio"
                    className="mr-2"
                    value="without"
                    checked={phoneNumberFilter === "without"}
                    onChange={(e) => setPhoneNumberFilter(e.target.value)}
                  />
                  Unavailable
                </label>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: "100%",
              marginTop: "10px",
              marginBottom: emailFilter ? "15px" : "0",
            }}
          >
            <label
              style={{ position: "absolute", bottom: "-16px", right: 0 }}
              className={`flex justify-end items-center ${
                currentMode === "dark" ? "text-white" : "text-dark"
              } `}
            >
              {emailFilter ? (
                <strong
                  className="ml-4 text-red-600 cursor-pointer"
                  onClick={() => setEmailFilter("")}
                >
                  Clear
                </strong>
              ) : (
                ""
              )}
            </label>

            <div
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              } flex items-center`}
            >
              <p className="w-[25%]">Email</p>
              <div className="flex flex-1 pr-6 justify-between items-center">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="with"
                    className="mr-2"
                    checked={emailFilter === "with"}
                    onChange={(e) => setEmailFilter(e.target.value)}
                  />
                  Available
                </label>
                <label>
                  <input
                    type="radio"
                    className="mr-2"
                    value="without"
                    checked={emailFilter === "without"}
                    onChange={(e) => setEmailFilter(e.target.value)}
                  />
                  Unavailable
                </label>
              </div>
            </div>
          </div>

          <label
            className={`flex my-3  ${
              currentMode === "dark" ? "text-white" : "text-dark"
            } `}
          >
            <strong className=" ">Date Range</strong>
          </label>
          <div className="flex flex-row justify-between mt-3">
            <div className="flex flex-col" style={{ marginRight: "15px" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  marginBottom: startDate ? "35px" : "0",
                }}
              >
                <label
                  style={{ position: "absolute", bottom: "-16px", right: 0 }}
                  className={`flex justify-end items-center ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  } `}
                >
                  {startDate ? (
                    <strong
                      className="ml-4  text-red-600 cursor-pointer"
                      onClick={() => setStartDate("")}
                    >
                      Clear
                    </strong>
                  ) : (
                    ""
                  )}
                </label>

                <Box sx={darkModeColors}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      views={["year", "month", "day"]}
                      onChange={(newValue) => {
                        const formattedDate = moment(newValue?.$d).format(
                          "YYYY-MM-DD"
                        );
                        console.log("start date: ", formattedDate);
                        setStartDate(formattedDate);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      format="yyyy-MM-dd"
                      renderInput={(params) => (
                        <TextField
                          onClick={(e) => e.stopPropagation()}
                          size="small"
                          {...params}
                          onKeyDown={(e) => e.preventDefault()}
                          fullWidth
                        />
                      )}
                      InputProps={{ required: true }}
                    />
                  </LocalizationProvider>
                </Box>
              </div>
            </div>

            <div className="flex flex-col">
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  marginBottom: endDate ? "35px" : "0",
                }}
              >
                <label
                  style={{ position: "absolute", bottom: "-16px", right: 0 }}
                  className={`flex justify-end items-center ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  } `}
                >
                  {endDate ? (
                    <strong
                      className="ml-4 text-red-600 cursor-pointer"
                      onClick={() => setEndDate("")}
                    >
                      Clear
                    </strong>
                  ) : (
                    ""
                  )}
                </label>
                <Box sx={darkModeColors}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      views={["year", "month", "day"]}
                      onChange={(newValue) => {
                        const formattedDate = moment(newValue?.$d).format(
                          "YYYY-MM-DD"
                        );
                        setEndDate(formattedDate);
                      }}
                      format="yyyy-MM-dd"
                      renderInput={(params) => (
                        <TextField
                          onClick={(e) => e.stopPropagation()}
                          size="small"
                          {...params}
                          onKeyDown={(e) => e.preventDefault()}
                          fullWidth
                        />
                      )}
                      InputProps={{ required: true }}
                    />
                  </LocalizationProvider>
                </Box>
              </div>
            </div>
          </div>

          <label
            className={`flex mt-4 mb-2  ${
              currentMode === "dark" ? "text-white" : "text-dark"
            } `}
          >
            <strong className=" ">Lead Range</strong>
          </label>

          <div className="flex flex-row justify-between mb-4">
            {/* From */}
            <div className="" style={{ width: "100%", position: "relative" }}>
              <label
                style={{ position: "absolute", bottom: "-16px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {fromRange ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => setFromRange("")}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <TextField
                  onClick={(e) => e.stopPropagation()}
                  label="From"
                  size="small"
                  type="number"
                  value={fromRange}
                  onChange={(e) => {
                    setFromRange(e.target.value);
                  }}
                  InputProps={{ required: true }}
                />
              </Box>
            </div>

            {/* To */}
            <div
              className="ml-2"
              style={{ width: "100%", position: "relative" }}
            >
              <label
                style={{ position: "absolute", bottom: "-16px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {toRange ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => {
                      setToRange("");
                    }}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <TextField
                  label="To"
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                  value={toRange}
                  type="number"
                  onChange={(e) => {
                    if (e.target.value > pageState.total) {
                      return;
                    }
                    setToRange(e.target.value);
                  }}
                  className="w-full"
                  InputProps={{ required: true }}
                />
              </Box>
            </div>
          </div>
          {fromRange && toRange && (
            <Button
              onClick={getNumbers}
              className="text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-[#DA1F26]"
            >
              {btnLoading ? <CircularProgress /> : <span>Select</span>}
            </Button>
          )}
        </div>
      </Menu>

      {sendSMSModal && (
        <SendSMSModal
          sendSMSModal={sendSMSModal}
          handleSMSModelClose={() => setSendSMSModal(false)}
          setSendSMSModal={setSendSMSModal}
          fromRange={fromRange}
          toRange={toRange}
          rangeData={rangeData}
          setRangeData={setRangeData}
          setFromRange={setFromRange}
          setToRange={setToRange}
        />
      )}
    </Box>
  );
};

export default FiltersDropdown;
