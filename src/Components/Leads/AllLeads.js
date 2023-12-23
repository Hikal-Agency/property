import {
  Box,
  Button as MuiButton,
  IconButton,
  InputAdornment,
  TextField,
  styled,
  Tooltip,
} from "@mui/material";
import Select from "react-select";
import readXlsxFile from "read-excel-file";
import "../../styles/index.css";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineHistory, AiFillEdit } from "react-icons/ai";
import { Form, useLocation } from "react-router-dom";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";
import SingleLead from "./SingleLead";
import UpdateLead from "./UpdateLead";
import BulkUpdateLeads from "./BulkUpdateLeads";
import { toast } from "react-toastify";
import RenderPriority from "./RenderPriority";
import RenderFeedback from "./RenderFeedback";
import RenderManagers from "./RenderManagers";
import RenderSalesperson from "./RenderSalesperson";
import DeleteLeadModel from "./DeleteLead";
import BulkImport from "./BulkImport";
import { langs } from "../../langCodes";
import AddReminder from "../reminder/AddReminder";
import AddMeetLink from "../liveleads/AddMeetLink";
import Timeline from "../../Pages/timeline";
import { pageStyles, selectBgStyles } from "../_elements/SelectStyles";
import { feedback_options } from "../_elements/SelectOptions";

import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import { BsShuffle, BsTrash, BsAlarm } from "react-icons/bs";
import { TbFileImport } from "react-icons/tb";
import { RiMailSendLine } from "react-icons/ri";
import { ImSearch } from "react-icons/im";
import { VscCallOutgoing } from "react-icons/vsc";
import { SiGooglemeet } from "react-icons/si";
import JoinMeeting from "../liveleads/JoinMeeting";
import SourceAnimation from "../_elements/SourceAnimation";
import ColdcallFiles from "./ColdcallFiles";
import { renderSourceIcons } from "../_elements/SourceIconsDataGrid";
import { renderOTPIcons } from "../_elements/OTPIconsDataGrid";

const bulkUpdateBtnStyles = {
  position: "absolute",
  top: "10.5px",
  zIndex: "500",
  transform: "translateX(-50%)",
  fontWeight: "500",
};

const AllLeads = ({
  lead_type,
  lead_origin,
  leadCategory,
  transferRequest,
  transferleads,
}) => {
  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState({});
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebtnloading, setdeletebtnloading] = useState(false);
  const [filt, setFilt] = useState([]);
  const [error, setError] = useState(false);
  const { hasPermission } = usePermission();
  console.log("LeadType::", lead_type);
  const [projectOptions, setProjectOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkUpdateModelOpen, setBulkUpdateModelOpen] = useState(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [unassignedFeedback, setUnassignedFeedback] = useState("All");
  const [bulkDeleteClicked, setBulkDeleteClicked] = useState(false);
  const [bulkImportModelOpen, setBulkImportModelOpen] = useState(false);

  // const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef();
  const selectionModelRef = useRef([]);
  const [CSVData, setCSVData] = useState({
    keys: [],
    rows: [],
  });

  const [hoveredRow, setHoveredRow] = useState(null);

  const bulkImportRef = useRef();
  const dataTableRef = useRef();

  const location = useLocation();
  console.log("Location::", location);

  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    User,
    fetchSidebarData,
    BACKEND_URL,
    isArabic,
    darkModeColors,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    blurDarkColor,
    blurLightColor,
  } = useStateContext();

  console.log("Path in alleads component: ", lead_origin);

  // eslint-disable-next-line
  const [LeadToDelete, setLeadToDelete] = useState();
  const [pageRange, setPageRange] = useState();

  //View LEAD MODAL VARIABLES
  const [LeadModelOpen, setLeadModelOpen] = useState(false);
  const handleLeadModelOpen = () => setLeadModelOpen(true);
  const handleLeadModelClose = () => setLeadModelOpen(false);

  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const [AddReminderModelOpen, setAddReminderModelOpen] = useState(false);
  const [AddMeetLinkModelOpen, setAddMeetLinkModelOpen] = useState(false);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);

  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);
  const handleUpdateLeadModelClose = () => {
    setLeadModelOpen(false);
    setUpdateLeadModelOpen(false);
  };

  const handleAdReminderModalOpen = () => setAddReminderModelOpen(true);
  const handleAdReminderModalClose = () => {
    setLeadModelOpen(false);
    setAddReminderModelOpen(false);
  };

  const handleAddMeetLinkModalOpen = () => setAddMeetLinkModelOpen(true);
  const handleAddMeetLinkModalClose = () => {
    setLeadModelOpen(false);
    setAddMeetLinkModelOpen(false);
  };

  const CustomColorSwitch = styled(() => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "green",
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "green",
    },
    "& .MuiSwitch-switchBase": {
      color: "pink",
    },
  }));

  const classes = CustomColorSwitch();

  // ROLE 3
  // eslint-disable-next-line

  const handleRangeChange = (e) => {
    setError(false);
    // const value = e.target.value;
    const value = e.value;

    if (value === "" || (value >= 10 && value <= 100)) {
      setPageRange(value);

      setError(false);

      setpageState((old) => ({
        ...old,
        perpage: value,
      }));
    } else {
      setError("Value out of range (10-150)");
    }
  };

  const handleSearch = (e) => {
    if (e.target.value === "") {
      setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
      FetchLeads(token);
    }
    // setSearchTerm(e.target.value);
  };

  const handleKeyUp = (e) => {
    if (searchRef.current.querySelector("input").value) {
      if (e.key === "Enter" || e.keyCode === 13) {
        // setpageState((oldPageState) => ({...oldPageState, page: 1}));
        FetchSearchedLeads(token, e.target.value);
      }
    }
  };

  const getLangCode = (language) => {
    if (language) {
      const l = langs.find(
        (lang) =>
          lang["name"].toLowerCase() === String(language).toLowerCase() ||
          lang["nativeName"].toLowerCase() === String(language).toLowerCase()
      );
      if (l) {
        return l.code.toUpperCase();
      } else {
        return language;
      }
    } else {
      return null;
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return <strong>{cellValues?.formattedValue}</strong>;
      },
    },

    {
      field: "leadName",
      headerAlign: "center",
      headerName: t("label_lead_name"),
      minWidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex  text-left">
            <p
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              {cellValues?.formattedValue}
            </p>
            {cellValues?.row?.transferRequest === 1 ? (
              <Tooltip title="Requested for Reshuffle" arrow>
                <BsShuffle size={14} className="ml-3" />
              </Tooltip>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
    {
      field: "leadContact",
      headerName: t("label_contact"),
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const contactNumber = params.getValue(params.id, "leadContact");
        // const countryCode = `(+${contactNumber.slice(0, 1)} ${contactNumber.slice(1, 3)})`;

        // Replace last 4 digits with "*"
        const stearics =
          contactNumber
            ?.replaceAll(" ", "")
            ?.slice(0, contactNumber?.replaceAll(" ", "")?.length - 4) + "****";
        let finalNumber;

        if (hasPermission("number_masking")) {
          if (User?.role === 1) {
            finalNumber = contactNumber?.replaceAll(" ", "");
          } else {
            finalNumber = `${stearics}`;
          }
        } else {
          finalNumber = contactNumber?.replaceAll(" ", "");
        }

        return (
          <div>
            <span>{finalNumber}</span>
          </div>
        );
      },
    },

    {
      field: "project",
      headerName: t("label_project"),
      headerAlign: "center",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          // <div className="w-full ">
          //   <p
          //     className="text-center capitalize"
          //     style={{
          // fontFamily: isArabic(cellValues?.formattedValue)
          //         ? "Noto Kufi Arabic"
          //         : "inherit",
          //     }}
          //   >
          //     {cellValues?.formattedValue}
          //   </p>
          // </div>
          <div
            style={{
              fontFamily: isArabic(cellValues?.formattedValue)
                ? "Noto Kufi Arabic"
                : "inherit",
            }}
            className="flex flex-col"
          >
            <p>
              {cellValues.row.project === "null" ? "-" : cellValues.row.project}
            </p>
            <p>
              {cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}
            </p>
          </div>
        );
      },
    },
    {
      headerAlign: "center",
      field: "leadType",
      headerName: t("label_property"),
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>
              {cellValues.row.enquiryType === "null"
                ? "-"
                : cellValues.row.enquiryType}
            </p>
            <p>
              {cellValues.row.leadType === "null"
                ? "-"
                : cellValues.row.leadType}
            </p>
          </div>
        );
      },
    },
    {
      headerAlign: "center",
      field: "assignedToManager",
      headerName: t("label_manager"),
      minWidth: 100,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => (
        <RenderManagers
          className="renderDD"
          cellValues={cellValues}
          lead_origin={lead_origin}
        />
      ),
    },
    {
      headerAlign: "center",
      field: "assignedToSales",
      headerName: t("label_agent"),
      minWidth: 100,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => (
        <RenderSalesperson
          className="renderDD"
          cellValues={cellValues}
          lead_origin={lead_origin}
        />
      ),
    },
    {
      field: "feedback",
      headerAlign: "center",
      headerName: t("label_feedback"),
      minWidth: 100,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => (
        <RenderFeedback className="renderDD" cellValues={cellValues} />
      ),
      // onFeedbackClick={handleFeedbackClick}
    },
    {
      field: "priority",
      headerName: t("label_priority"),
      minWidth: 80,
      headerAlign: "center",
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => (
        <RenderPriority className="renderDD" cellValues={cellValues} />
      ),
    },
    {
      field: "otp",
      headerName:
        lead_origin === "transfferedleads"
          ? t("label_ex_agent")
          : t("label_otp"),
      minWidth: 40,
      headerAlign: "center",
      headerClassName: "break-normal",
      hide: true,
      flex: 1,
      renderCell: (cellValues) => {
        if (lead_origin === "transfferedleads") {
          return (
            <div style={{ fontSize: 11 }}>
              <p>{cellValues.row.transferredFromName || "-"}</p>
            </div>
          );
        } else {
          return renderOTPIcons(cellValues, currentMode);
        }
      },
    },
    {
      field: "leadSource",
      headerName: t("label_source"),
      flex: 1,
      minWidth: 50,
      headerAlign: "center",
      renderCell: (cellValues) => renderSourceIcons(cellValues, currentMode),
    },
    {
      field: "language",
      headerName: t("label_language"),
      headerAlign: "center",
      minWidth: 40,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "null"
              ? "-"
              : cellValues.formattedValue}
          </>
        );
      },
    },
    {
      field: "creationDate",
      headerName:
        lead_origin === "transfferedleads"
          ? t("label_transferred_date")
          : t("date"),
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        if (lead_origin === "transfferedleads") {
          return (
            <div style={{ fontSize: 10 }}>
              <p>
                {moment(cellValues.row.transferredDate).format("YYYY-MM-DD")}
              </p>
            </div>
          );
        } else {
          return (
            <div style={{ fontSize: 10 }}>
              {moment(cellValues.formattedValue).format("YYYY-MM-DD")}
            </div>
          );
        }
      },
    },
    {
      field: "notes",
      headerName: "Note",
      minWidth: 150,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div
            className="p-3"
            style={{
              fontFamily: "Noto Kufi Arabic",
            }}
          >
            {cellValues.row.notes}
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: t("label_action"),
      flex: 1,
      minWidth: 130,
      sortable: false,
      filterable: false,
      headerAlign: "center",

      renderCell: (cellValues) => {
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {/* MEET LINK  */}
            {
              // (lead_origin === "liveleads" || lead_type === "liveleads") &&
              //   cellValues.row.notes.startsWith("Live") &&
              cellValues.row.meet_link === null ||
              cellValues.row.meet_link === "" ||
              cellValues.row.meet_link === "null" ? (
                <p
                  style={{ cursor: "pointer" }}
                  className={`text-white bg-primary rounded-full shadow-none p-1.5 mr-1 flex items-center reminderBtn`}
                >
                  <Tooltip title="Send Link" arrow>
                    <button onClick={() => HandleSendMeetLinkBtn(cellValues)}>
                      <SiGooglemeet size={16} />
                    </button>
                  </Tooltip>
                </p>
              ) : (
                <p
                  style={{ cursor: "pointer" }}
                  className={`${
                    currentMode === "dark"
                      ? "text-[#FFFFFF] bg-[#262626]"
                      : "text-[#1C1C1C] bg-[#EEEEEE]"
                  } hover:bg-blue-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center reminderBtn`}
                >
                  <Tooltip title="Send Link" arrow>
                    <button onClick={() => HandleAddMeetLinkBtn(cellValues)}>
                      <SiGooglemeet size={16} />
                    </button>
                  </Tooltip>
                </p>
              )
            }

            {/* CALL  */}
            <Tooltip title="Call" arrow>
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-green-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <CallButton
                  phone={cellValues.row.leadContact?.replaceAll(" ", "")}
                />
              </p>
            </Tooltip>

            {/* EMAIL  */}
            <Tooltip title="Send Mail" arrow>
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-[#0078d7] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center `}
              >
                <EmailButton email={cellValues.row.leadEmail} />
              </p>
            </Tooltip>

            {/* REMINDER  */}
            <Tooltip title="Set Reminder" arrow>
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-[#ec8d00] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center reminderBtn`}
              >
                <button onClick={() => HandleReminderBtn(cellValues)}>
                  <BsAlarm size={16} />
                </button>
              </p>
            </Tooltip>

            {/* EDIT  */}
            {/* <p
              style={{ cursor: "pointer" }}
              className={`${currentMode === "dark" ? "text-[#FFFFFF] bg-[#262626]" : "text-[#1C1C1C] bg-[#EEEEEE]"} hover:bg-[#019a9a] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Update Details" arrow>
                <button onClick={() => HandleEditFunc(cellValues)}>
                  <AiOutlineEdit size={16} />
                </button>
              </Tooltip>
            </p> */}

            {/* TIMELINE  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center timelineBtn`}
            >
              <Tooltip title="View Timeline" arrow>
                <button onClick={() => HandleViewTimeline(cellValues)}>
                  <AiOutlineHistory size={16} />
                </button>
              </Tooltip>
            </p>

            {/* DELETE  */}
            {/* {hasPermission("lead_delete") && (
              <p
                style={{ cursor: "pointer" }}
                disabled={deleteloading ? true : false}
                className={`${currentMode === "dark" ? "text-[#FFFFFF] bg-[#262626]" : "text-[#1C1C1C] bg-[#EEEEEE]"} hover:bg-[#DA1F26] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <Tooltip title="Delete Lead" arrow>
                  <button onClick={() => {
                    setLeadToDelete(cellValues?.row.leadId);
                    setDeleteModelOpen(true);
                    setBulkDeleteClicked(false);
                  }}>
                    <BsTrash
                      className="deleteLeadBtn"
                      size={18}
                      style={{ color: "inherit" }}
                    /> 
                  </button>
                </Tooltip>
              </p>      
            )} */}
          </div>
        );
      },
    },
  ];

  const CallButton = ({ phone }) => {
    const handlePhoneClick = (event) => {
      event.stopPropagation();
      window.location.href = `tel:${phone}`;
    };

    return (
      <button className="call-button" onClick={handlePhoneClick}>
        <VscCallOutgoing size={16} />
      </button>
    );
  };

  const EmailButton = ({ email }) => {
    const handleEmailClick = (event) => {
      event.stopPropagation();
      window.location.href = `mailto:${email}`;
    };

    return (
      <button className="email-button" onClick={handleEmailClick}>
        <RiMailSendLine size={16} />
      </button>
    );
  };

  const [CEOColumns, setCEOColumns] = useState(columns);

  const FetchLeads = async (
    token,
    projectName,
    source,
    enquiryType,
    assignedManager,
    assignedAgent
  ) => {
    console.log("lead type is");
    console.log(lead_type);
    console.log("lead origin is");
    console.log(lead_origin);
    let FetchLeads_url = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    // BUYERS LIST
    if (lead_origin === "buyers") {
      FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
        pageState.page
      }&perpage=${pageState.perpage || 14}&coldCall=5`;
      if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=5&transferRequest=1`;
      }
      if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=5&leadStatus=Transferred`;
      }
    }

    // LEADS URL GENERATON FOR FRESH LEADS SECTION
    if (lead_origin === "freshleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Unreachable`;
      } else if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&transferRequest=1`;
      } else if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&leadStatus=Transferred`;
      }
    }
    // LEADS URL GENERATON FOR COLD LEADS PAGE
    else if (lead_origin === "coldleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=New`;
      } else if (lead_type === "coldLeadsVerified") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=1`;
      } else if (lead_type === "coldLeadsInvalid") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=2`;
      } else if (lead_type === "coldLeadsNotChecked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=0`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=1&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Unreachable`;
      } else if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&transferRequest=1`;
      } else if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&leadStatus=Transferred`;
      }
    }
    // LEADS URL GENERATON FOR THIRD PARTY LEADS PAGE
    else if (lead_origin === "thirdpartyleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=3&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Unreachable`;
      } else if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&transferRequest=1`;
      } else if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&leadStatus=Transferred`;
      }
    }
    // LEADS URL GENERATON FOR PERSONAL LEADS PAGE
    else if (lead_origin === "personalleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=2&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Unreachable`;
      } else if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&transferRequest=1`;
      } else if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&leadStatus=Transferred`;
      }
    }
    // LEADS URL GENERATON FOR ARCHIVED LEADS PAGE
    else if (lead_origin === "archive") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=4&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Unreachable`;
      } else if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&transferRequest=1`;
      } else if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&leadStatus=Transferred`;
      }
    }

    // LEADS URL GENERATON FOR RESHUFFLED LEADS PAGE
    else if (lead_origin === "transfferedleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&perpage=${pageState.perpage}&coldCall=0&leadStatus=Transferred`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=New&leadStatus=Transferred`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=No Answer&leadStatus=Transferred`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Meeting&leadStatus=Transferred`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Callback&leadStatus=Transferred`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Switched Off&leadStatus=Transferred`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up (Short Term)&leadStatus=Transferred`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up (Long Term)&leadStatus=Transferred`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${
      //     pageState.perpage || 14
      //   }&coldCall=0&feedback=Follow Up&leadStatus=Transferred`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Low Budget&leadStatus=Transferred`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Not Interested&leadStatus=Transferred`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Unreachable&leadStatus=Transferred`;
      }
    }

    // LEADS URL GENERATON FOR FRESH LEADS SECTION
    else if (lead_origin === "liveleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=6&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Unreachable`;
      } else if (transferRequest === "transferRequest") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&transferRequest=1`;
      } else if (transferRequest === "transferleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&leadStatus=Transferred`;
      }
    }

    // LEADS URL GENERATON FOR UNASSIGNED LEADS PAGE
    else if (lead_origin === "unassigned") {
      if (lead_type === "fresh") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=0`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Meeting`;
      } 
      // CALLBACK
      else if (lead_type === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Callback`;
      } 
      // SWITCHED OFF
      else if (lead_type === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Switched Off`;
      } 
      // FOLLOW UP
      else if (lead_type === "follow up short term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up (Short Term)`;
      } 
      else if (lead_type === "follow up long term") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up (Long Term)`;
      } 
      // else if (lead_type === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${
      //     pageState.perpage || 14
      //   }&unassigned=1&coldCall=0&feedback=Follow Up`;
      // } 
      else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Unreachable`;
      } else if (lead_type === "coldleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=1`;
      } else if (lead_type === "archive") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=4`;
      } else if (lead_type === "personalleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=2`;
      } else if (lead_type === "thirdpartyleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=3`;
      } else if (lead_type === "liveleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=6`;
      }
    }

    console.log("fetch lead url is");
    console.log(FetchLeads_url, lead_type);

    if (projectName) {
      FetchLeads_url += `&project=${projectName}`;
    }

    if (enquiryType) {
      FetchLeads_url += `&enquiryType=${enquiryType}`;
    }

    if (source) {
      FetchLeads_url += `&leadSource=${source}`;
    }

    if (assignedManager) {
      FetchLeads_url += `&managerAssigned=${assignedManager}`;
    }

    if (assignedAgent) {
      FetchLeads_url += `&agentAssigned=${assignedAgent}`;
    }

    if (unassignedFeedback) {
      if (unassignedFeedback !== "All") {
        FetchLeads_url += `&feedback=${unassignedFeedback}`;
      }
    }

    axios
      .get(FetchLeads_url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(async (result) => {
        console.log("the user leads are ");
        console.log(result.data);

        let total = result.data.coldLeads.total;

        let rowsDataArray = "";
        if (result.data.coldLeads.current_page > 1) {
          const theme_values = Object.values(result.data.coldLeads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.coldLeads.data;
        }

        let filteredData = rowsDataArray;
        let rowsdata = filteredData.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          leadId: row?.id,
          creationDate: row?.creationDate,
          transferredDate: row?.transferredDate,
          transferredFrom: row?.transferredFrom,
          transferredFromName: row?.transferredFromName,
          leadName: row?.leadName || "-",
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
          leadEmail: row?.leadEmail || "-",
          project: row?.project || "-",
          ip: row?.ip,
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row?.assignedToManager || null,
          assignedToSales: row?.assignedToSales || null,
          feedback: row?.feedback || null,
          priority: row?.priority || null,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource || "-",
          is_blocked: row?.is_blocked,
          lid: row?.lid || "-",
          firstAssigned: row?.firstAssigned || "",
          transferRequest: row?.transferRequest || "",
          lastEdited: row?.lastEdited || "-",
          leadFor: row?.leadFor || "-",
          leadStatus: row?.leadStatus || "-",
          leadCategory: leadCategory || "-",
          coldCall: row?.coldcall,
          meet_link: row?.meet_link || "",
          admin_link: row?.admin_link || "",
          notes: row?.notes || "",
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          edit: "edit",
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          from: result.data.coldLeads.from,
          to: result.data.coldLeads.to,
          total: total,
        }));
        setCEOColumns([...CEOColumns]);
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  const FetchSearchedLeads = async (token, term) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    let coldCallCode = "";
    if (lead_origin === "freshleads") {
      coldCallCode = 0;
    } else if (lead_origin === "coldleads") {
      coldCallCode = 1;
    } else if (lead_origin === "thirdpartyleads") {
      coldCallCode = 3;
    } else if (lead_origin === "personalleads") {
      coldCallCode = 2;
    } else if (lead_origin === "warmleads") {
      coldCallCode = 4;
    } else if (lead_origin === "liveleads") {
      coldCallCode = 6;
    } else if (lead_origin === "buyers") {
      coldCallCode = 5;
    } else if (lead_origin === "transfferedleads") {
      coldCallCode = 0;
    } else if (lead_origin === "archive") {
      coldCallCode = 4;
    }

    let url = `${BACKEND_URL}/search?title=${term}&page=${pageState.page}`;

    if (lead_type) {
      if (
        lead_type !== "all" &&
        lead_type !== "coldLeadsVerified" &&
        lead_type !== "coldLeadsInvalid" &&
        lead_type !== "coldLeadsNotChecked" &&
        lead_origin !== "unassigned" &&
        transferRequest !== "transferleads" &&
        transferRequest !== "transferRequest"
      ) {
        url += `&feedback=${lead_type}`;
      }
    }

    if (lead_origin === "unassigned") {
      url += "&unassigned=1";
      if (lead_type === "cold") {
        coldCallCode = 1;
      } else if (lead_type === "warm") {
        coldCallCode = 4;
      } else if (lead_type === "personal") {
        coldCallCode = 2;
      } else if (lead_type === "thirdpartyleads") {
        coldCallCode = 3;
      } else if (lead_type === "liveleads") {
        coldCallCode = 6;
      } else if (lead_type === "buyers") {
        coldCallCode = 5;
      }
    }

    if (coldCallCode !== "") {
      url += `&coldCall=${coldCallCode}`;
    }

    if (lead_type === "coldLeadsVerified") {
      url += `&is_whatsapp=1`;
    } else if (lead_type === "coldLeadsInvalid") {
      url += `&is_whatsapp=2`;
    } else if (lead_type === "coldLeadsNotChecked") {
      url += `&is_whatsapp=0`;
    }

    if (
      lead_origin === "transfferedleads" ||
      transferRequest === "transferleads"
    ) {
      url += `&status=Transferred`;
    }

    if (transferRequest === "transferRequest") {
      url += `&transferRequest=1`;
    }

    await axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("search result is");
        console.log(result.data);
        let rowsdata = result.data.result.data.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          leadId: row?.id,
          creationDate: row?.creationDate,
          leadName: row?.leadName || "-",
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
          leadEmail: row?.leadEmail || "-",
          project: row?.project || "-",
          is_blocked: row?.is_blocked,
          ip: row?.ip,
          device: row?.device,
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row?.assignedToManager || null,
          assignedToSales: row?.assignedToSales || null,
          feedback: row?.feedback || null,
          priority: row?.priority || null,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource || "-",
          lid: row?.lid || "-",
          firstAssigned: row?.firstAssigned || "",
          transferRequest: row?.transferRequest || "",
          lastEdited: row?.lastEdited || "-",
          leadFor: row?.leadFor || "-",
          leadStatus: row?.leadStatus || "-",
          coldCall: row?.coldcall,
          meet_link: row?.meet_link || "",
          admin_link: row?.admin_link || "",
          leadCategory: leadCategory || "-",
          notes: row?.notes || "",
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          edit: "edit",
        }));
        setpageState((old) => ({
          ...old,
          data: rowsdata,
          pageSize: result.data.result.per_page,
          total: result.data.result.total,
        }));
        setpageState((old) => ({
          ...old,
          isLoading: false,
        }));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
  }, [unassignedFeedback]);

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);

  useEffect(() => {
    setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
    searchRef.current.querySelector("input").value = "";
  }, [lead_type, lead_origin]);

  useEffect(() => {
    if (searchRef.current.querySelector("input").value) {
      FetchSearchedLeads(token, searchRef.current.querySelector("input").value);
    } else {
      if (pageState?.page > 0) {
        FetchLeads(token);
      }
    }
  }, [pageState.page, pageState.perpage, lead_type, reloadDataGrid]);

  const fetchUnassFreshFilters = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const data = await Promise.all([
        axios.get(`${BACKEND_URL}/lead-projects?unassigned=1&coldCall=0`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${BACKEND_URL}/totalSource?unassigned=1&coldCall=0`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);
      const leadProjects = data[0].data?.data?.query_result
        ?.filter((proj) => proj?.project)
        ?.map((proj) => ({ label: proj?.project, value: proj?.project }));
      const leadSources = data[1].data?.data?.query_result;

      if (
        typeof leadSources === "object" &&
        !Array.isArray(leadSources) &&
        leadSources !== null &&
        Object.values(leadSources)?.length === 0
      ) {
        setSourceOptions([]);
      } else {
        setSourceOptions(leadSources);
      }

      setProjectOptions(leadProjects || []);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
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

  useEffect(() => {
    if (lead_origin === "unassigned" && lead_type === "fresh") {
      fetchUnassFreshFilters();
    }
  }, []);

  useEffect(() => {
    FetchLeads(
      localStorage.getItem("auth-token"),
      selectedProject === "All" ? null : selectedProject,
      selectedSource === "All" ? null : selectedSource
    );
  }, [selectedProject, selectedSource]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    // if (event &&
    //   event.target &&
    //   event.target.className &&
    //   (event.target.className.includes("renderDD") ||
    //   event.target.closest(".renderDD"))
    // ) {
    //   if (!excludedColumns.includes(params.field)) {
    //     console.log("RENDER");
    //   }
    // }
    // else {
    if (
      !event.target.closest(".reminderBtn") &&
      !event.target.closest(".timelineBtn") &&
      !event.target.closest(".renderDD")
    ) {
      console.log("Single lead clicked::::::: ", params.row);
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
    // }
    // console.log("Single lead clicked::::::: ", params.row);
    // setsingleLeadData(params.row);
    // handleLeadModelOpen();
  };

  // REMINDER BTN CLICK FUNC
  const HandleReminderBtn = async (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params.row);
    handleAdReminderModalOpen();
    // setUpdateLeadModelOpen(true);
  };

  // MEET LINK BUTTON CLICK ------- NO------------
  const HandleAddMeetLinkBtn = async (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params.row);
    handleAddMeetLinkModalOpen();
    // setUpdateLeadModelOpen(true);
  };

  // NEW MEETING
  const AddMeetLinkFunction = async (
    mLeadId,
    mLeadName,
    mLeadEmail,
    meetLink,
    adminLink
  ) => {
    setBtnLoading(true);

    const token = localStorage.getItem("auth-token");

    // LEAD DATA
    const AddLeadData = new FormData();
    AddLeadData.append("id", mLeadId);
    AddLeadData.append("meet_link", meetLink);
    AddLeadData.append("admin_link", adminLink);

    // EMAIL DATA
    const AddEmailData = new FormData();
    AddEmailData.append("notification", "common");
    AddEmailData.append("email", mLeadEmail);
    AddEmailData.append(
      "title",
      "UAE Real Estate Market Consultation by Hikal"
    );
    AddEmailData.append(
      "message",
      `<h3>Hi ${mLeadName}!</h3><p>We are pleased to inform you that your consultation has been scheduled successfully for now.</p><h3 style%equal%"text-align: center;"><a href%equal%"${meetLink}" style%equal%"padding: 10px; border-radius: 10px; background-color: #DA1F26; color: #FFFFFF; font-weight: bold;">Click here to join the meeting!</a></h3><p>If you have any questions or need further assistance, feel free to contact us at <a href%equal%"tel:97142722249"><span>+971 4 272 2249</span></a>.</p>`
    );
    AddEmailData.append(
      "style",
      "body{color: #000000;} span{font-weight: bold; color: #1245A8;}"
    );

    // UPDATE LEADS TABLE
    await axios
      .post(`${BACKEND_URL}/leads/${mLeadId}`, AddLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Meeting link sent successfully!");
        console.log(result);
        toast.success("Meeting link sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setBtnLoading(false);
        FetchLeads(token);
      })
      .catch((err) => {
        toast.error("Error in sending meeting link", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setBtnLoading(false);
      });

    // SEND EMAIL TO LEAD
    await axios
      .post(`${BACKEND_URL}/sendEmail/`, AddEmailData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Email sent successfully!");
        setBtnLoading(false);
        FetchLeads(token);
      })
      .catch((err) => {
        setBtnLoading(false);
      });
  };

  // REDIRECT TO MEETING
  const [redirectAnimation, setRedirectAnimation] = useState(false);
  const redirectToMeeting = (url) => {
    // console.log("URL")
    // setRedirectAnimation(true);

    // setTimeout(() => {
    window.open(url, "_blank");
    //   setRedirectAnimation(false);
    // }, 3000);
  };

  const [newMeetingModal, setNewMeetingModal] = useState({
    isOpen: false,
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [nameOfLead, setNameOfLead] = useState({});

  const HandleSendMeetLinkBtn = async (params) => {
    const currentTime = new Date();
    const leadTime = new Date(params?.row?.creationDate);

    const diff = (currentTime - leadTime) / (1000 * 60); //CONVERT MILLISECONDS TO MINUTES

    // if (diff < 5) {
    setNameOfLead(params);
    try {
      setBtnLoading(true);
      // CREATE MEETING
      const createMeeting = await axios.get(
        `${BACKEND_URL}/create?name=${User?.userName.replaceAll(" ", "%20")}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
        }
      );

      // JOIN AS MODERATOR
      const meetingID = createMeeting?.data?.data?.meetingID;
      const joinAsModerator = await axios.post(
        `${BACKEND_URL}/join`,
        JSON.stringify({
          meetingID: meetingID,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
        }
      );

      // ATTENDEE LINK
      const joinAsAttendee = await axios.post(
        `${BACKEND_URL}/attendee`,
        JSON.stringify({
          meetingID: meetingID,
          // fullName: "Example Full Name".replaceAll(" ", "%20")
          fullName: params?.row?.leadName.replaceAll(" ", "%20"),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
        }
      );
      const urlForModerator = joinAsModerator?.data?.url;
      const urlForAttendee = joinAsAttendee?.data?.url;
      // setNewMeetingModal({isOpen: true, urlForModerator, urlForAttendee});

      redirectToMeeting(urlForModerator);
      AddMeetLinkFunction(
        params?.row?.leadId,
        params?.row?.leadName,
        params?.row?.leadEmail,
        urlForAttendee,
        urlForModerator
      );
    } catch (error) {
      console.log(error);
      toast.error("Unable to create meeting at the moment.", {
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
    setBtnLoading(false);
    // } else {
    //   HandleAddMeetLinkBtn(params);
    // }
  };

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
  };

  const handleBulkDelete = async () => {
    try {
      setdeleteloading(true);
      setdeletebtnloading(true);
      const Data = {
        action: "delete",
        ids: selectedRows,
      };
      await axios.post(`${BACKEND_URL}/bulkaction`, JSON.stringify(Data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setdeleteloading(false);
      setdeletebtnloading(false);
      setreloadDataGrid(!reloadDataGrid);
      FetchLeads(token);
      selectionModelRef.current = [];
      setDeleteModelOpen(false);
      fetchSidebarData();
      toast.success("Leads Deleted Successfull", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      setdeleteloading(false);
      setdeletebtnloading(false);
      toast.error("Something Went Wrong! Please Try Again", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const deleteLead = async (lid) => {
    setdeleteloading(true);
    setdeletebtnloading(true);
    axios
      .delete(`${BACKEND_URL}/leads/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result);
        setdeleteloading(false);
        setdeletebtnloading(false);
        setreloadDataGrid(!reloadDataGrid);
        FetchLeads(token);
        setDeleteModelOpen(false);
        fetchSidebarData();
        toast.success("Lead Deleted Successfull", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleLeadModelClose();
      })
      .catch((err) => {
        console.log(err);
        setdeleteloading(false);
        setdeletebtnloading(false);
        toast.error("Something Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <>
        <div className="flex justify-center items-center">
          <p className="mr-3">
            {pageState.from}-{pageState.to}
          </p>

          <p className="mr-3">{t("rows_per_page")}</p>

          <Select
            id="select-page-size-label"
            value={{ label: pageState.pageSize, value: pageState.pageSize }}
            onChange={handleRangeChange}
            options={[14, 30, 50, 75, 100].map((size) => ({
              label: size,
              value: size,
            }))}
            className="min-w-[60px] my-2"
            menuPortalTarget={document.body}
            styles={pageStyles(currentMode, primaryColor)}
          />

          {/* <Select
            labelId="select-page-size-label"
            value={pageState.pageSize}
            onChange={handleRangeChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          >
            {[14, 30, 50, 75, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select> */}

          <Pagination
            sx={{
              "& .Mui-selected": {
                backgroundColor: `${primaryColor} !important`,
                color: "white !important",
                borderRadius: "50px !important",
              },
            }}
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef?.current?.setPage(value - 1)}
          />
        </div>
      </>
    );
  }

  const handleClickBulkUpdate = () => {
    setBulkUpdateModelOpen(true);
  };

  const handleCloseBulkUpdateModel = () => {
    setBulkUpdateModelOpen(false);
  };

  const handleCloseDeleteModel = () => {
    setDeleteModelOpen(false);
  };

  const handleClickBulkDelete = () => {
    setBulkDeleteClicked(true);
    setDeleteModelOpen(true);
  };

  const handleCloseBulkImportModel = () => {
    setBulkImportModelOpen(false);
    bulkImportRef.current.value = "";
  };

  const handleBulkImport = (event) => {
    const file = event.target.files[0];

    if (file?.name?.slice(-4) === "xlsx") {
      readXlsxFile(file).then((sheet) => {
        const rows = sheet?.map((item) => item?.join(","));
        const keys = rows[0].split(",").map((key) => key.toString().trim());
        const data = rows?.slice(1, rows.length);
        const formatted = data.map((row) =>
          row.split(",").map((value) => value.toString().trim())
        );
        setCSVData({
          rows: formatted,
          keys,
          fileName: file?.name,
        });
        setBulkImportModelOpen(true);
      });
    } else {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split("\n");
        console.log("Rows::", rows);
        const keys = rows[0].split(",").map((key) => key.toString().trim());
        const data = rows?.slice(1, rows.length);
        const formatted = data.map((row) =>
          row.split(",").map((value) => value.toString().trim())
        );
        setCSVData({
          rows: formatted,
          keys,
          fileName: file?.name,
        });
        setBulkImportModelOpen(true);
      };

      if (file) {
        reader.readAsText(file);
      }
    }
  };

  const handleRowHover = (params) => {
    setHoveredRow(params.row);
  };

  return (
    <>
      <div className="pb-10 mb-10">
        {hasPermission("coldcallfiles") &&
          (lead_origin === "coldleads" ||
            (lead_origin === "unassigned" && lead_type === "coldleads")) && (
            <ColdcallFiles
              pageState={pageState}
              setpageState={setpageState}
              leadCategory={leadCategory}
              bulkImportRef={bulkImportRef}
              lead_type={lead_type}
            />
          )}
        {lead_origin === "unassigned" && lead_type === "fresh" && (
          <Box
            sx={{
              ...darkModeColors,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "end",
              "& .MuiSelect-select": {
                padding: "1px",
                paddingX: "5px !important",
              },
              "& .applied-filter": {
                width: "max-content",
              },
            }}
            className={"flex items-center"}
          >
            <div></div>
            <div className="flex items-end justify-end mb-2">
              <div className="w-fit mr-2">
                <Box
                  sx={{
                    width: "150px",
                    minWidth: "100px",
                    maxWidth: "200px",
                  }}
                >
                  <Select
                    id="project"
                    options={[
                      {
                        value: "All",
                        label: `${t("all")} ${" "} ${t("project")}`,
                      },
                      ...projectOptions,
                    ]}
                    value={projectOptions?.find(
                      (option) => option?.label === selectedProject
                    )}
                    onChange={(event) => {
                      setSelectedProject(event.value);
                    }}
                    placeholder={t("project")}
                    className={`w-full mr-2`}
                    menuPortalTarget={document.body}
                    styles={selectBgStyles(
                      currentMode,
                      primaryColor,
                      blurDarkColor,
                      blurLightColor
                    )}
                  />
                </Box>
              </div>
              <div className="w-fit mr-2">
                <Box
                  sx={{
                    width: "150px",
                    minWidth: "100px",
                    maxWidth: "200px",
                  }}
                >
                  <Select
                    id="source"
                    options={[
                      {
                        value: "All",
                        label: `${t("all")} ${" "} ${t("label_source")}`,
                      },
                      ...sourceOptions,
                    ]}
                    value={sourceOptions?.find(
                      (option) => option.value === selectedSource
                    )}
                    // value={unassignedFeedback}
                    onChange={(event) => {
                      setSelectedSource(event.value);
                    }}
                    placeholder={t("label_source")}
                    className={`w-full mr-2`}
                    menuPortalTarget={document.body}
                    styles={selectBgStyles(
                      currentMode,
                      primaryColor,
                      blurDarkColor,
                      blurLightColor
                    )}
                  />
                </Box>
              </div>
              <div className="w-fit flex justify-end">
                <Box
                  sx={{
                    width: "150px",
                    minWidth: "100px",
                    maxWidth: "200px",
                  }}
                >
                  <Select
                    id="un-feedback"
                    options={[
                      {
                        value: "All",
                        label: `${t("all")} ${" "} ${t("label_feedback")}`,
                      },
                      ...feedback_options(t),
                    ]}
                    value={feedback_options(t).find(
                      (option) => option.value === unassignedFeedback
                    )}
                    // value={unassignedFeedback}
                    onChange={(event) => {
                      setUnassignedFeedback(event.value);
                    }}
                    placeholder={t("label_feedback")}
                    className={`w-full`}
                    menuPortalTarget={document.body}
                    styles={selectBgStyles(
                      currentMode,
                      primaryColor,
                      blurDarkColor,
                      blurLightColor
                    )}
                  />
                  {/* <FormControl fullWidth>
                    <InputLabel>{t("label_feedback")}</InputLabel>
                    <Select
                      label={t("label_feedback")}
                      id="un-feedback"
                      value={unassignedFeedback}
                      className={`w-full py-2 px-3`}
                      onChange={(event) => {
                        setUnassignedFeedback(event.target.value);
                      }}
                      displayEmpty
                      size="small"
                      required
                      sx={{
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor:
                            currentMode === "dark" ? "white" : "black",
                        },
                        "& .MuiSelect-select": {
                          color: currentMode === "dark" ? "white" : "black",
                        },
                        "&:hover:not (.Mui-disabled):before": {
                          borderColor:
                            currentMode === "dark" ? "white" : "black",
                        },
                      }}
                    >
                      {feedbacks?.map((feedback, index) => (
                        <MenuItem key={index} value={feedback || ""}>
                          {t(
                            "feedback_" +
                              feedback?.toLowerCase()?.replaceAll(" ", "_")
                          )}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl> */}
                </Box>
              </div>

              {(hasPermission("leadSource_counts") || User.role === 1) && (
                <SourceAnimation />
              )}
            </div>
          </Box>
        )}
        <Box
          sx={{
            ...DataGridStyles,
            position: "relative",
            marginBottom: "50px",
          }}
          className={`${currentMode}-mode-datatable`}
        >
          {selectedRows.length > 0 && hasPermission("leads_bulk_update") && (
            <MuiButton
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                left: User?.role === 1 ? "340px" : "250px",
                zIndex: "5 !important",
              }}
              variant="text"
              onClick={handleClickBulkUpdate}
            >
              <AiFillEdit size={20} />{" "}
              <span style={{ paddingLeft: "5px" }}>
                {t("table_bulk_update")}
              </span>
            </MuiButton>
          )}
          {selectedRows.length > 0 && hasPermission("leads_bulk_delete") && (
            <MuiButton
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                left: "455px",
                zIndex: "5 !important",
              }}
              variant="text"
              onClick={handleClickBulkDelete}
            >
              <BsTrash size={18} />{" "}
              <span style={{ paddingLeft: "5px" }}>
                {t("table_bulk_delete")}
              </span>
            </MuiButton>
          )}
          <label htmlFor="bulkImport">
            <MuiButton
              onClick={() => bulkImportRef.current.click()}
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                left: User?.role === 1 ? "230px" : "150px",
              }}
              variant="text"
            >
              <TbFileImport size={18} />{" "}
              <span style={{ paddingLeft: "5px" }}>
                {t("table_bulk_import")}
              </span>
            </MuiButton>
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            ref={bulkImportRef}
            onInput={handleBulkImport}
            id="bulkImport"
          />

          <div
            style={{ zIndex: "5 !important" }}
            className={`absolute top-[7px] ${
              isLangRTL(i18n.language) ? "left-[10px]" : "right-[10px]"
            } z-[2]`}
          >
            <TextField
              placeholder={t("search")}
              ref={searchRef}
              sx={{
                "& input": {
                  borderBottom: "1px solid #777777",
                },
              }}
              variant="standard"
              onKeyUp={handleKeyUp}
              onInput={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton sx={{ padding: 0 }}>
                      <ImSearch size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <DataGrid
              disableDensitySelector
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    otp: false,
                    creationDate: false,
                    notes: lead_origin === "liveleads" ? true : false,
                    leadType: lead_origin === "liveleads" ? false : true,
                    leadSource: lead_origin === "liveleads" ? false : true,
                  },
                },
              }}
              ref={dataTableRef}
              autoHeight
              disableSelectionOnClick
              rows={pageState.data}
              onCellHover={handleRowHover}
              onRowClick={handleRowClick}
              rowCount={pageState.total}
              loading={pageState.isLoading}
              rowsPerPageOptions={[30, 50, 75, 100]}
              pagination
              width="auto"
              // rowHeight={160}
              getRowHeight={() => "auto"}
              paginationMode="server"
              page={pageState.page - 1}
              checkboxSelection
              selectionModel={selectionModelRef.current}
              onSelectionModelChange={(ids) => {
                selectionModelRef.current = ids;
                setSelectedRows(
                  ids.map((id) => pageState?.data[id - pageState?.from]?.leadId)
                );
              }}
              pageSize={pageState.pageSize}
              onPageChange={(newPage) => {
                const newPerPage = pageRange;
                console.log("change page range: ", newPerPage);
                setpageState((old) => ({
                  ...old,
                  page: newPage + 1,
                  perpage: newPerPage,
                }));
              }}
              onPageSizeChange={(newPageSize) =>
                setpageState((old) => ({ ...old, pageSize: newPageSize }))
              }
              columns={columns?.filter((c) =>
                hasPermission("leads_col_" + c?.field)
              )}
              filterModel={{
                items: filt,
              }}
              components={{
                Toolbar: GridToolbar,
                Pagination: CustomPagination,
              }}
              disableColumnFilter
              componentsProps={{
                toolbar: {
                  showQuickFilter: false,
                  printOptions: { disableToolbarButton: User?.role !== 1 },
                  csvOptions: { disableToolbarButton: User?.role !== 1 },
                },
              }}
              sx={{
                boxShadow: 2,
                "& .MuiDataGrid-virtualScrollerContent .MuiSvgIcon-root": {
                  color: currentMode === "dark" ? "#ffffff" : "#000000",
                },

                "& .MuiButtonBase-root .MuiSwitch-switchBase": {
                  color: `${primaryColor} !important`,
                },

                "& .MuiSwitch-root .MuiSwitch-track": {
                  backgroundColor: `${primaryColor} !important`,
                },
              }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
              }
              columnWidths={{
                checkbox: "30px",
              }}
              className={{ classes }}
            />
          </div>

          {!timelineModelOpen && (
            <SingleLead
              LeadModelOpen={LeadModelOpen}
              setLeadModelOpen={setLeadModelOpen}
              handleLeadModelOpen={handleLeadModelOpen}
              handleLeadModelClose={handleLeadModelClose}
              BACKEND_URL={BACKEND_URL}
              FetchLeads={FetchLeads}
              LeadData={singleLeadData}
              // lead_origin={lead_origin}
              setDeleteModelOpen={setDeleteModelOpen}
              deleteModelOpen={deleteModelOpen}
              handleUpdateLeadModelOpen={handleUpdateLeadModelOpen}
              handleUpdateLeadModelClose={handleUpdateLeadModelClose}
              UpdateLeadModelOpen={UpdateLeadModelOpen}
              setBulkDeleteClicked={setBulkDeleteClicked}
              setLeadToDelete={setLeadToDelete}
            />
          )}

          {timelineModelOpen && (
            <Timeline
              timelineModelOpen={timelineModelOpen}
              handleCloseTimelineModel={() => setTimelineModelOpen(false)}
              LeadData={singleLeadData}
            />
          )}

          {UpdateLeadModelOpen && (
            <UpdateLead
              lead_origin={lead_origin}
              LeadModelOpen={UpdateLeadModelOpen}
              setLeadModelOpen={setUpdateLeadModelOpen}
              handleLeadModelOpen={handleUpdateLeadModelOpen}
              handleLeadModelClose={handleUpdateLeadModelClose}
              LeadData={singleLeadData}
              BACKEND_URL={BACKEND_URL}
              FetchLeads={FetchLeads}
            />
          )}

          {AddReminderModelOpen && (
            <AddReminder
              LeadModelOpen={AddReminderModelOpen}
              setLeadModelOpen={setAddReminderModelOpen}
              handleLeadModelOpen={handleAdReminderModalOpen}
              handleLeadModelClose={handleAdReminderModalClose}
              LeadData={singleLeadData}
              BACKEND_URL={BACKEND_URL}
              FetchLeads={FetchLeads}
            />
          )}

          {AddMeetLinkModelOpen && (
            <AddMeetLink
              LeadModelOpen={AddMeetLinkModelOpen}
              setLeadModelOpen={setAddMeetLinkModelOpen}
              handleLeadModelOpen={handleAddMeetLinkModalOpen}
              handleLeadModelClose={handleAddMeetLinkModalClose}
              LeadData={singleLeadData}
              BACKEND_URL={BACKEND_URL}
              FetchLeads={FetchLeads}
            />
          )}

          {bulkUpdateModelOpen && (
            <BulkUpdateLeads
              handleCloseBulkUpdateModel={handleCloseBulkUpdateModel}
              bulkUpdateModelOpen={bulkUpdateModelOpen}
              selectedRows={selectedRows}
              FetchLeads={FetchLeads}
              setSelectedRows={setSelectedRows}
              selectionModelRef={selectionModelRef}
            />
          )}

          {deleteModelOpen && (
            <DeleteLeadModel
              handleCloseDeleteModel={handleCloseDeleteModel}
              deleteLead={deleteLead}
              deleteModelOpen={deleteModelOpen}
              LeadToDelete={LeadToDelete}
              deletebtnloading={deletebtnloading}
              bulkDeleteClicked={bulkDeleteClicked}
              selectedRows={selectedRows}
              handleBulkDelete={handleBulkDelete}
              handleLeadModelClose={handleLeadModelClose}
            />
          )}

          {bulkImportModelOpen && (
            <BulkImport
              bulkImportModelOpen={bulkImportModelOpen}
              handleCloseBulkImportModel={handleCloseBulkImportModel}
              FetchLeads={FetchLeads}
              CSVData={CSVData}
              lead_origin={lead_origin}
            />
          )}

          {newMeetingModal?.isOpen && (
            <JoinMeeting
              handleClose={() => setNewMeetingModal({ isOpen: false })}
              newMeetingModal={newMeetingModal}
            />
          )}

          {redirectAnimation && (
            <div className="flex fixed z-[100000] bg-black text-white top-0 left-0 w-screen h-screen flex-col justify-center items-center">
              <h1 className="text-4xl mb-6">Redirecting you to the meeting</h1>
              <div id="fountainG">
                <div id="fountainG_1" className="fountainG"></div>
                <div id="fountainG_2" className="fountainG"></div>
                <div id="fountainG_3" className="fountainG"></div>
                <div id="fountainG_4" className="fountainG"></div>
                <div id="fountainG_5" className="fountainG"></div>
                <div id="fountainG_6" className="fountainG"></div>
                <div id="fountainG_7" className="fountainG"></div>
                <div id="fountainG_8" className="fountainG"></div>
              </div>
            </div>
          )}
        </Box>
      </div>
    </>
  );
};

export default AllLeads;
