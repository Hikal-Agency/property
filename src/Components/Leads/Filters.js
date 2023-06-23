import { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {Select, MenuItem, TextField} from "@mui/material";
import { Box } from "@mui/material";

const leadOrigins = [
  { id: "hotleads", formattedValue: "Fresh Leads" },
  { id: "coldleads", formattedValue: "Cold Leads" },
  { id: "thirdpartyleads", formattedValue: "Thirdparty Leads" },
  { id: "personaleads", formattedValue: "Personal Leads" },
  { id: "warmleads", formattedValue: "Warm Leads" },
  { id: "transfferedleads", formattedValue: "Transferred Leads" },
];
const leadTypes = [
  { id: "all", formattedValue: "All" },
  { id: "new", formattedValue: "New" },
  { id: "no answer", formattedValue: "No Answer" },
  { id: "meeting", formattedValue: "Meeting" },
  { id: "follow up", formattedValue: "Follow Up" },
  { id: "low budget", formattedValue: "Low Budget" },
  { id: "not interested", formattedValue: "Not Interested" },
  { id: "unreachable", formattedValue: "Unreachable" },
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

const Filters = ({ FetchLeads, pageState }) => {
  const { darkModeColors, currentMode, Managers, SalesPerson } = useStateContext();
  const [leadOriginSelected, setLeadOriginSelected] = useState(leadOrigins[0]);
  const [leadTypeSelected, setLeadTypeSelected] = useState(leadTypes[0]);
  const [enquiryTypeSelected, setEnquiryTypeSelected] = useState({ id: 0 });
  const [managerSelected, setManagerSelected] = useState("");
  const [agentSelected, setAgentSelected] = useState("");
  const [projectNameTyped, setProjectNameTyped] = useState("");
  const [managers, setManagers] = useState(Managers || []);
  const [agents, setAgents] = useState(SalesPerson || {});

    useEffect(() => {
    setManagers(Managers);
    setAgents(SalesPerson);
  }, [Managers, SalesPerson]);

    useEffect(() => {
      const token = localStorage.getItem("auth-token");
    FetchLeads(
      token,
      leadOriginSelected?.id || "hotleads",
      leadTypeSelected?.id || "all",
      projectNameTyped,
      enquiryTypeSelected?.id,
      managerSelected,
      agentSelected
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageState?.page,
    leadTypeSelected,
    managerSelected,
    agentSelected,
    leadOriginSelected,
    projectNameTyped,
    enquiryTypeSelected,
  ]);

  return (
    <>
      <Box
        className="flex items-center mt-3 mb-2"
        sx={{
          ...darkModeColors,
          "& .MuiSelect-select": {
            padding: "2px",
            paddingLeft: "6px !important",
            paddingRight: "20px",
            borderRadius: "8px",
          },
          "& .MuiInputBase-root": {
            width: "max-content",
            marginRight: "5px"
          },
          "& .applied-filter": {
            background: "#da1f26",
            borderRadius: 4,
            width: "max-content",
            padding: "3px 8px",
            color: "white",
            marginRight: "0.25rem"
          },
          "& .applied-filter span": {
            marginRight: "3px",
          },
        }}
      >
          <div>
          <Select
            id="leadOrigin"
            value={leadOriginSelected?.id || "hotleads"}
            onChange={(event) =>
              setLeadOriginSelected(
                leadOrigins.find((origin) => origin.id === event.target.value)
              )
            }
            size="small"
            className={`w-full mt-1 mb-5 `}
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
        </div>
        <div>
          <Select
            id="leadType"
            value={leadTypeSelected?.id || "all"}
            onChange={(event) =>
              setLeadTypeSelected(
                leadTypes.find((type) => type.id === event.target.value)
              )
            }
            size="small"
            className={`w-full mt-1 mb-5`}
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
            <MenuItem
              value="0"
              disabled
              sx={{
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              }}
            >
              Lead Type
            </MenuItem>
            {leadTypes?.map((type, index) => (
              <MenuItem key={index} value={type?.id || ""}>
                {type?.formattedValue}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ position: "relative" }}>
          <label
            htmlFor="enquiryType"
            style={{ position: "absolute", top: "-20px", right: 0 }}
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
          <Select
            id="enquiryType"
            value={enquiryTypeSelected?.id}
            className={`w-full mt-1 mb-5`}
            onChange={(event) =>
              setEnquiryTypeSelected(
                enquiryTypes.find((type) => type.id === event.target.value)
              )
            }
            displayEmpty
            size="small"
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
            <MenuItem
              value="0"
              disabled
              sx={{
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              }}
            >
              Select Enquiry Type
            </MenuItem>
            {enquiryTypes?.map((type, index) => (
              <MenuItem key={index} value={type?.id || ""}>
                {type?.formattedValue}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="mt-1">
          <TextField
            className={`w-full`}
            id="Project"
            type={"text"}
            label="Project Name"
            variant="outlined"
            size="small"
            onChange={(e) => setProjectNameTyped(e.target.value)}
            required
          />
        </div>
        <div style={{ position: "relative" }}>
          <label
            style={{ position: "absolute", top: "-20px", right: 0 }}
            htmlFor="Manager"
            className={`flex justify-end items-center ${
              currentMode === "dark" ? "text-white" : "text-dark"
            } `}
          >
            {managerSelected ? (
              <strong
                className="ml-4 text-red-600 cursor-pointer"
                onClick={() => setManagerSelected("")}
              >
                Clear
              </strong>
            ) : (
              ""
            )}
          </label>
          <Select
            id="Manager"
            value={managerSelected || ""}
            onChange={(event) => setManagerSelected(event.target.value)}
            size="small"
            className={`w-full mt-1 mb-5 `}
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
            <MenuItem value="" selected disabled>
              Manager
            </MenuItem>
            {managers?.map((manager, index) => (
              <MenuItem key={index} value={manager?.id || ""}>
                {manager?.userName}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div style={{ position: "relative" }}>
          <label
            style={{ position: "absolute", top: "-20px", right: 0 }}
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
          <Select
            id="Agent"
            value={agentSelected || ""}
            onChange={(event) => setAgentSelected(event.target.value)}
            size="small"
            className={`w-full mt-1 mb-5 `}
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
            <MenuItem selected value="" disabled>
              Agent
            </MenuItem>
            {agents[`manager-${managerSelected}`]?.map((agent, index) => (
              <MenuItem key={index} value={agent?.id || ""}>
                {agent?.userName}
              </MenuItem>
            ))}
          </Select>
        </div>
      </Box>
    </>
  );
};

export default Filters;
