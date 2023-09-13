import { useState } from "react";
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Box,
  FormControl,
  InputLabel,
} from "@mui/material";
import { GrFormClose } from "react-icons/gr";
import { BiFilter } from "react-icons/bi";
import { useStateContext } from "../../context/ContextProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SendSMSModal from "./SendSMSModal";

const leadOrigins = [
  { id: "hotleads", formattedValue: "Fresh" },
  { id: "thirdpartyleads", formattedValue: "Third Party" },
  { id: "transfferedleads", formattedValue: "Reshuffled" },
  { id: "coldleads", formattedValue: "Cold" },
  { id: "archive", formattedValue: "Archived" },
  { id: "personalleads", formattedValue: "Personal" },
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
  const [filtersDropdown, setFiltersDropdown] = useState(false);
  const [sendSMSModal, setSendSMSModal] = useState(false);
  const { currentMode, darkModeColors } = useStateContext();
  return (
    <div
      className={`fixed w-[350px] z-[1000] top-[40px] right-[8px] ${darkModeColors}`}
    >
      <div className={`flex justify-end mt-5 relative z-[1000]`}>
        {!filtersDropdown &&
          (enquiryTypeSelected?.i ||
            phoneNumberFilter ||
            emailFilter ||
            otpSelected?.id ||
            languageFilter ||
            projectNameTyped ||
            managerSelected ||
            startDate ||
            endDate ||
            agentSelected) && (
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
          onClick={() => {
            setFiltersDropdown(!filtersDropdown);
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
          {filtersDropdown ? (
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

      {filtersDropdown && (
        <div
          className={`${
            currentMode === "dark"
              ? "border-gray-800 bg-black"
              : "bg-white border-gray-200"
          } mt-2 border border-2 p-4 rounded-md`}
        >
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
              style={{ position: "absolute", bottom: "-10px", right: 0 }}
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
              style={{ position: "absolute", bottom: "-10px", right: 0 }}
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
                        setStartDate(newValue);
                      }}
                      format="yyyy-MM-dd"
                      renderInput={(params) => (
                        <TextField
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
                        setEndDate(newValue);
                      }}
                      format="yyyy-MM-dd"
                      renderInput={(params) => (
                        <TextField
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
            <strong className=" ">Range</strong>
          </label>

          <div className="flex flex-row justify-between mb-4">
            {/* From */}
            <div className="" style={{ width: "50%", position: "relative" }}>
              <label
                style={{ position: "absolute", bottom: "-10px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {fromRange ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    // onClick={() => setFromDate("")}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box sx={darkModeColors}>
                <TextField
                  label="From"
                  value={fromRange}
                  // onChange={(e) => {
                  //   setFromDate(e.target.value);
                  // }}
                  InputProps={{ required: true }}
                />
              </Box>
            </div>

            {/* To */}
            <div
              className="ml-2"
              style={{ width: "50%", position: "relative" }}
            >
              <label
                style={{ position: "absolute", bottom: "-10px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {toRange ? (
                  <strong
                    className="ml-4 text-red-600 cursor-pointer"
                    // onClick={() => setToDate("")}
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
                  value={toRange}
                  // onChange={(e) => {
                  //   setToDate(e.target.value);
                  // }}
                  className="w-full"
                  InputProps={{ required: true }}
                />
              </Box>
            </div>
          </div>
          <Button
            onClick={() => {
              setFiltersDropdown(false);
              setSendSMSModal(true);
            }}
          >
            Select
          </Button>
        </div>
      )}

      {sendSMSModal && (
        <SendSMSModal
          sendSMSModal={sendSMSModal}
          handleSMSModelClose={() => setSendSMSModal(false)}
          fromRange={fromRange}
          toRange={toRange}
        />
      )}
    </div>
  );
};

export default FiltersDropdown;
