import {
  Box,
  Button as MuiButton,
  IconButton,
  InputAdornment,
  TextField,
  styled,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
} from "@mui/material";
import "../../styles/index.css";
import Select from "react-select";
import usePermission from "../../utils/usePermission";
import { BiImport } from "react-icons/bi";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import axios from "../../axoisConfig";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  selectBgStyles,
  pageStyles,
} from "../../Components/_elements/SelectStyles";
import {
  renderSourceIcons,
  sourceIcons,
} from "../../Components/_elements/SourceIconsDataGrid";

import { AiOutlineHistory, AiFillEdit } from "react-icons/ai";
import { BiSearch, BiMessageRoundedDots, BiArchive } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { MdCampaign } from "react-icons/md";
import {
  BsPersonCircle,
  BsSnow2,
  BsTrash,
  BsAlarm,
  BsShieldX,
  BsShieldCheck,
  BsShieldMinus,
} from "react-icons/bs";
import { TbFileImport, TbWorldWww } from "react-icons/tb";
import {
  FaSnapchatGhost,
  FaFacebookF,
  FaTiktok,
  FaRegComments,
  FaYoutube,
  FaWhatsapp,
  FaTwitter,
  FaUser,
} from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { RiMailSendLine } from "react-icons/ri";
import { VscCallOutgoing } from "react-icons/vsc";

import Pagination from "@mui/material/Pagination";
import SingleLead from "../../Components/Leads/SingleLead";
import UpdateLead from "../../Components/Leads/UpdateLead";
import RenderManagers from "../../Components/Leads/RenderManagers";
import RenderSalesperson from "../../Components/Leads/RenderSalesperson";
import RenderFeedback from "../../Components/Leads/RenderFeedback";
import BulkUpdateLeads from "../../Components/Leads/BulkUpdateLeads";
import { toast } from "react-toastify";
import DeleteLeadModel from "../../Components/Leads/DeleteLead";
import { langs } from "../../langCodes";
import AddReminder from "../../Components/reminder/AddReminder";
import RenderPriority from "../../Components/Leads/RenderPriority";
import Timeline from "../timeline";
import {
  feedback_options,
  source_options,
} from "../../Components/_elements/SelectOptions";
import { renderOTPIcons } from "../../Components/_elements/OTPIconsDataGrid";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const bulkUpdateBtnStyles = {
  position: "absolute",
  top: "10.5px",
  zIndex: "500",
  transform: "translateX(-50%)",
  fontWeight: "500",
};

// FEEDBACK
const leadTypes = (t) => [
  {
    id: "all",
    label: t("feedback_all"),
  },
  {
    id: "new",
    label: t("feedback_new"),
  },
  {
    id: "callback",
    label: t("feedback_callback"),
  },
  {
    id: "follow up (short term)",
    label: t("feedback_follow_up_short_term"),
  },
  {
    id: "follow up (long term)",
    label: t("feedback_follow_up_long_term"),
  },
  {
    id: "meeting",
    label: t("feedback_meeting"),
  },
  {
    id: "booked",
    label: t("feedback_booked"),
  },
  {
    id: "low budget",
    label: t("feedback_low_budget"),
  },
  {
    id: "not interested",
    label: t("feedback_not_interested"),
  },
  {
    id: "no answer",
    label: t("feedback_no_answer"),
  },
  {
    id: "switched off",
    label: t("feedback_switched_off"),
  },
  {
    id: "unreachable",
    label: t("feedback_unreachable"),
  },
  {
    id: "wrong number",
    label: t("feedback_wrong_number"),
  },
  {
    id: "duplicate",
    label: t("feedback_duplicate"),
  },
  {
    id: "dead",
    label: t("feedback_dead"),
  },
];

// LEAD CATEGORY
const leadOrigins = [
  { id: "hotleads" },
  { id: "liveleads" },
  { id: "thirdpartyleads" },
  { id: "warmleads" },
  { id: "coldleads" },
  { id: "personalleads" },
  { id: "transfferedleads" },
];

// ENQUIRY TYPE
const enquiryTypes = (t) => [
  {
    id: "studio",
    label: t("enquiry_studio"),
  },
  {
    id: "1 bedroom",
    label: t("enquiry_1bed"),
  },
  {
    id: "2 bedrooms",
    label: t("enquiry_2bed"),
  },
  {
    id: "3 bedrooms",
    label: t("enquiry_3bed"),
  },
  {
    id: "4 bedrooms",
    label: t("enquiry_4bed"),
  },
  {
    id: "5 bedrooms",
    label: t("enquiry_5bed"),
  },
  {
    id: "6 bedrooms",
    label: t("enquiry_6bed"),
  },
  {
    value: "7 bedrooms",
    label: t("enquiry_7bed"),
  },
  {
    value: "8 bedrooms",
    label: t("enquiry_8bed"),
  },
  {
    value: "9 bedrooms",
    label: t("enquiry_9bed"),
  },
  {
    value: "10 bedrooms",
    label: t("enquiry_10bed"),
  },
  {
    id: "retail",
    label: t("enquiry_retail"),
  },
  {
    value: "other",
    label: t("enquiry_others"),
  },
];

const Search = ({ lead_type, lead_origin, leadCategory, DashboardData }) => {
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
    Managers,
    SalesPerson,
    isArabic,
    darkModeColors,
    primaryColor,
    t,
    themeBgImg,
    blurDarkColor,
    blurLightColor,
    isLangRTL,
    i18n,
  } = useStateContext();

  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState({});
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebtnloading, setdeletebtnloading] = useState(false);
  const [error, setError] = useState(false);
  const { hasPermission } = usePermission();

  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkUpdateModelOpen, setBulkUpdateModelOpen] = useState(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [unassignedFeedback, setUnassignedFeedback] = useState("All");
  const [leadOriginSelected, setLeadOriginSelected] = useState(leadOrigins[0]);
  const [leadTypeSelected, setLeadTypeSelected] = useState(leadTypes(t)[0]);
  const [enquiryTypeSelected, setEnquiryTypeSelected] = useState({ id: 0 });
  const [managerSelected, setManagerSelected] = useState("");
  const [agentSelected, setAgentSelected] = useState("");
  const [projectNameTyped, setProjectNameTyped] = useState("");
  const [bulkDeleteClicked, setBulkDeleteClicked] = useState(false);
  const [leadSourceSelected, setLeadSourceSelected] = useState(0);
  const [bulkImportModelOpen, setBulkImportModelOpen] = useState(false);
  const [managers, setManagers] = useState(Managers || []);
  const [agents, setAgents] = useState(SalesPerson || {});
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);
  const searchRef = useRef();
  const selectionModelRef = useRef([]);
  const [CSVData, setCSVData] = useState({
    keys: [],
    rows: [],
  });

  const bulkImportRef = useRef();

  // eslint-disable-next-line
  const [LeadToDelete, setLeadToDelete] = useState();
  const [pageRange, setPageRange] = useState();

  //View LEAD MODAL VARIABLES
  const [LeadModelOpen, setLeadModelOpen] = useState(false);
  const handleLeadModelOpen = () => setLeadModelOpen(true);
  const handleLeadModelClose = () => setLeadModelOpen(false);

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const [AddReminderModelOpen, setAddReminderModelOpen] = useState(false);
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

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
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

  const handleRangeChange = (e) => {
    setError(false);
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
        setProjectNameTyped("");
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
      minWidth: 50,
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
          <div className="w-full ">
            <p
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              {cellValues?.formattedValue}
            </p>
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
          contactNumber?.slice(0, contactNumber?.length - 4) + "****";
        let finalNumber;

        if (hasPermission("number_masking")) {
          if (User?.role === 1) {
            finalNumber = contactNumber;
          } else {
            finalNumber = `${stearics}`;
          }
        } else {
          finalNumber = contactNumber;
        }

        return <span>{finalNumber}</span>;
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
      minWidth: 120,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderManagers cellValues={cellValues} />,
    },
    {
      headerAlign: "center",
      field: "assignedToSales",
      headerName: t("label_agent"),
      minWidth: 120,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
    },
    {
      field: "feedback",
      headerAlign: "center",
      headerName: t("label_feedback"),
      minWidth: 120,
      flex: 1,

      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: t("label_priority"),
      minWidth: 80,
      headerAlign: "center",
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "otp",
      headerName:
        lead_origin === "transfferedleads"
          ? t("label_transferred_from")
          : t("label_otp"),
      minWidth: 40,
      headerAlign: "center",
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
      minWidth: 30,
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
      field: "edit",
      headerName: t("label_action"),
      flex: 1,
      minWidth: 100,
      maxWidth: 200,
      sortable: false,
      filterable: false,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {/* CALL  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-green-600 hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Call" arrow>
                <CallButton phone={cellValues.row.leadContact} />
              </Tooltip>
            </p>

            {/* EMAIL  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#0078d7] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Send Mail" arrow>
                <EmailButton email={cellValues.row.leadEmail} />
              </Tooltip>
            </p>

            {/* REMINDER  */}
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#ec8d00] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Set Reminder" arrow>
                <button onClick={() => HandleReminderBtn(cellValues)}>
                  <BsAlarm size={16} />
                </button>
              </Tooltip>
            </p>

            {/* EDIT  */}
            {/* <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#019a9a] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
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
              } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
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
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-[#DA1F26] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <Tooltip title="Delete Lead" arrow>
                  <button
                    onClick={() => {
                      setLeadToDelete(cellValues?.row.leadId);
                      setDeleteModelOpen(true);
                      setBulkDeleteClicked(false);
                    }}
                  >
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

      // renderCell: (cellValues) => {
      //   return (
      //     <div
      //       className={`deleteLeadBtn edit-lead-btns space-x-1 w-full flex items-center justify-center`}
      //     >
      //       <p
      //         onMouseEnter={() => setHovered("edit")}
      //         onMouseLeave={() => setHovered("")}
      //         style={{ cursor: "pointer" }}
      //         className={`${
      //           currentMode === "dark"
      //             ? "bg-transparent text-white rounded-md shadow-none"
      //             : "bg-transparent text-black rounded-md shadow-none"
      //         }`}
      //         onClick={() => HandleReminderBtn(cellValues)}
      //       >
      //         <Tooltip title="Set Reminder" arrow>
      //           <IconButton sx={{ padding: 0 }}>
      //             <BsAlarm size={16} />
      //           </IconButton>
      //         </Tooltip>
      //       </p>
      //       <p
      //         style={{ cursor: "pointer" }}
      //         className={`${
      //           currentMode === "dark"
      //             ? "bg-transparent text-white rounded-md shadow-none"
      //             : "bg-transparent text-black rounded-md shadow-none"
      //         }`}
      //         onClick={() => HandleEditFunc(cellValues)}
      //       >
      //         <Tooltip title="Edit Lead Details" arrow>
      //           <IconButton sx={{ padding: 0 }}>
      //             <AiOutlineEdit size={16} />
      //           </IconButton>
      //         </Tooltip>
      //       </p>

      //       {cellValues.row.leadId !== null && (
      //         <p
      //           style={{ cursor: "pointer" }}
      //           className={`${
      //             currentMode === "dark"
      //               ? "bg-transparent text-white rounded-md shadow-none"
      //               : "bg-transparent text-black rounded-md shadow-none"
      //           }`}
      //           onClick={() => HandleViewTimeline(cellValues)}
      //         >
      //           <Tooltip title="View Timeline" arrow>
      //             <IconButton sx={{ padding: 0 }}>
      //               <AiOutlineHistory size={16} />
      //             </IconButton>
      //           </Tooltip>
      //         </p>
      //       )}

      //       <p
      //         onClick={() => {
      //           setLeadToDelete(cellValues?.row.leadId);
      //           setDeleteModelOpen(true);
      //           setBulkDeleteClicked(false);
      //         }}
      //         disabled={deleteloading ? true : false}
      //         className={`deleteLeadBtn cursor-pointer ${
      //           currentMode === "dark"
      //             ? " bg-transparent rounded-md shadow-none"
      //             : "bg-transparent rounded-md shadow-none"
      //         }`}
      //       >
      //         <Tooltip title="Delete Lead" arrow>
      //           <IconButton
      //             sx={{ padding: 0 }}
      //             color={currentMode === "dark" ? "black" : "white"}
      //           >
      //             <BsTrash
      //               className="deleteLeadBtn"
      //               size={16}
      //               style={{ color: "inherit" }}
      //             />
      //           </IconButton>
      //         </Tooltip>
      //       </p>
      //     </div>
      //   );
      // },
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

  const FetchLeads = async (token) => {
    console.log("leadTypeSelected ============= ", leadTypeSelected);
    console.log("lead type is");
    console.log(lead_type);
    console.log("lead origin is");
    console.log(leadOriginSelected);
    let FetchLeads_url = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    if (leadOriginSelected?.id === "hotleads") {
      if (leadTypeSelected?.id === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=New`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Booked`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Duplicate`;
      }

      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Dead`;
      }
    }
    // LIVE LEADS
    else if (leadOriginSelected?.id === "liveleads") {
      if (leadTypeSelected?.id === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=New`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=6&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=6&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Duplicate`;
      }
      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=6&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=6&feedback=Dead`;
      }
    }
    // LEADS URL GENERATON FOR COLD LEADS PAGE
    else if (leadOriginSelected?.id === "coldleads") {
      if (leadTypeSelected?.id === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=New`;
      } else if (leadTypeSelected?.id === "coldLeadsVerified") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=1`;
      } else if (leadTypeSelected?.id === "coldLeadsInvalid") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=2`;
      } else if (leadTypeSelected?.id === "coldLeadsNotChecked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&is_whatsapp=0`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=1&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=1&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Duplicate`;
      }

      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=1&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Dead`;
      }
    }
    // LEADS URL GENERATON FOR THIRDPARTY PAGE
    else if (leadOriginSelected?.id === "thirdpartyleads") {
      if (leadTypeSelected?.id === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=New`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=3&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=3&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Duplicate`;
      }
      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=3&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Dead`;
      }
    }
    // LEADS URL GENERATON FOR PERSONAL PAGE
    else if (leadOriginSelected?.id === "personalleads") {
      if (leadTypeSelected?.id === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=New`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=2&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=2&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Duplicate`;
      }
      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=2&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Dead`;
      }
    }
    // LEADS URL GENERATON FOR WARM LEADS PAGE
    else if (leadOriginSelected?.id === "warmleads") {
      if (leadTypeSelected?.id === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=New`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=4&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=4&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Duplicate`;
      }
      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=4&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Dead`;
      }
    }
    // RESHUFFLED LEADS
    else if (leadOriginSelected?.id === "transfferedleads") {
      FetchLeads_url = `${BACKEND_URL}/coldLeads?page=1&coldCall=0&leadStatus=Transferred`;
    }
    // UNASSIGNED
    else if (leadOriginSelected?.id === "unassigned") {
      if (leadTypeSelected?.id === "fresh") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=0`;
      } else if (leadTypeSelected?.id === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=New`;
      } else if (leadTypeSelected?.id === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=No Answer`;
      } else if (leadTypeSelected?.id === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Meeting`;
      } else if (leadTypeSelected?.id === "callback") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Callback`;
      }
      // FOLLOW UP
      else if (leadTypeSelected?.id === "follow up (short term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up (Short Term)`;
      } else if (leadTypeSelected?.id === "follow up (long term)") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up (Long Term)`;
      } else if (leadTypeSelected?.id === "switched off") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Switched Off`;
      } else if (leadTypeSelected?.id === "booked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Booked`;
      } else if (leadTypeSelected?.id === "wrong number") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned&coldCall=0&feedback=Wrong Number`;
      } else if (leadTypeSelected?.id === "duplicate") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned&coldCall=0&feedback=Duplicate`;
      }
      // else if (leadTypeSelected?.id === "follow up") {
      //   FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
      //     pageState.page
      //   }&perpage=${
      //     pageState.perpage || 14
      //   }&unassigned=1&coldCall=0&feedback=Follow Up`;
      // }
      else if (leadTypeSelected?.id === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Low Budget`;
      } else if (leadTypeSelected?.id === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Not Interested`;
      } else if (leadTypeSelected?.id === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Unreachable`;
      } else if (leadTypeSelected?.id === "dead") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Dead`;
      } else if (leadTypeSelected?.id === "coldleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=1`;
      } else if (leadTypeSelected?.id === "archive") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=4`;
      } else if (leadTypeSelected?.id === "personalleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=2`;
      } else if (leadTypeSelected?.id === "thirdpartyleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=3`;
      }
    }

    console.log("fetch lead url is");
    console.log(FetchLeads_url);

    if (projectNameTyped) {
      FetchLeads_url += `&project=${projectNameTyped}`;
    }

    if (enquiryTypeSelected?.id) {
      FetchLeads_url += `&enquiryType=${enquiryTypeSelected?.id}`;
    }

    if (leadSourceSelected) {
      FetchLeads_url += `&leadSource=${leadSourceSelected}`;
    }

    if (managerSelected) {
      FetchLeads_url += `&managerAssigned=${managerSelected}`;
    }

    if (agentSelected) {
      FetchLeads_url += `&agentAssigned=${agentSelected}`;
    }

    console.log(FetchLeads_url);

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

        let rowsDataArray = "";
        if (result.data.coldLeads.current_page > 1) {
          const theme_values = Object.values(result.data.coldLeads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.coldLeads.data;
        }

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          leadId: row?.id,
          creationDate: row?.creationDate,
          transferredDate: row?.transferredDate,
          transferredFromName: row?.transferredFromName,
          leadName: row?.leadName || "-",
          // leadContact:
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row?.assignedToManager || null,
          assignedToSales: row?.assignedToSales || null,
          feedback: row?.feedback || null,
          priority: row?.priority || null,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource || "-",
          lid: row?.lid || "-",
          lastEdited: row?.lastEdited || "-",
          leadFor: row?.leadFor || "-",
          leadStatus: row?.leadStatus || "-",
          leadCategory: leadCategory || "-",
          coldCall: row?.coldcall,
          notes: row?.notes || "-",
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
          pageSize: result?.data?.coldLeads?.per_page,
          total: result?.data?.coldLeads?.total,
          from: result?.data?.coldLeads?.from,
          to: result?.data?.coldLeads?.to,
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
    if (leadOriginSelected?.id === "freshleads") {
      coldCallCode = 0;
    } else if (leadOriginSelected?.id === "coldleads") {
      coldCallCode = 1;
    } else if (leadOriginSelected?.id === "thirdpartyleads") {
      coldCallCode = 3;
    } else if (leadOriginSelected?.id === "personalleads") {
      coldCallCode = 2;
    } else if (leadOriginSelected?.id === "warmleads") {
      coldCallCode = 4;
    } else if (leadOriginSelected?.id === "transfferedleads") {
      coldCallCode = 0;
    }

    let url = `${BACKEND_URL}/search?title=${term}&page=${pageState.page}`;

    if (leadTypeSelected?.id) {
      if (
        leadTypeSelected?.id !== "all" &&
        leadTypeSelected?.id !== "coldLeadsVerified" &&
        leadTypeSelected?.id !== "coldLeadsInvalid" &&
        leadTypeSelected?.id !== "coldLeadsNotChecked" &&
        leadOriginSelected?.id !== "unassigned"
      ) {
        url += `&feedback=${leadTypeSelected?.id}`;
      }
    }

    if (leadSourceSelected) {
      url += `&leadStatus=${leadSourceSelected}`;
    }

    if (leadOriginSelected?.id === "unassigned") {
      url += "&unassigned=1";
      if (leadTypeSelected?.id === "cold") {
        coldCallCode = 1;
      } else if (leadTypeSelected?.id === "warm") {
        coldCallCode = 4;
      } else if (leadTypeSelected?.id === "personal") {
        coldCallCode = 2;
      } else if (leadTypeSelected?.id === "thirdpartyleads") {
        coldCallCode = 3;
      }
    }

    if (coldCallCode !== "") {
      url += `&coldCall=${coldCallCode}`;
    }

    if (leadTypeSelected?.id === "coldLeadsVerified") {
      url += `&is_whatsapp=1`;
    } else if (leadTypeSelected?.id === "coldLeadsInvalid") {
      url += `&is_whatsapp=2`;
    } else if (leadTypeSelected?.id === "coldLeadsNotChecked") {
      url += `&is_whatsapp=0`;
    }

    if (leadOriginSelected?.id === "transfferedleads") {
      url += `&status=Transferred`;
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
          // leadContact:
          //   row?.leadContact?.slice(1)?.replaceAll(" ", "") || "No Contact",
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          assignedToManager: row?.assignedToManager || null,
          assignedToSales: row?.assignedToSales || null,
          feedback: row?.feedback || null,
          priority: row?.priority || null,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource || "-",
          lid: row?.lid || "-",
          lastEdited: row?.lastEdited || "-",
          leadFor: row?.leadFor || "-",
          leadStatus: row?.leadStatus || "-",
          coldCall: row?.coldcall,
          leadCategory: leadCategory || "-",
          notes: row?.notes || "-",
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          edit: "edit",
        }));
        setpageState((old) => ({
          ...old,
          data: rowsdata,
          pageSize: result?.data?.result?.per_page,
          total: result?.data?.result?.total,
          from: result?.data?.result?.from,
          to: result?.data?.result?.to,
        }));
        setpageState((old) => ({
          ...old,
          isLoading: false,
        }));
      })
      .catch((err) => console.log(err));
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    e.preventDefault();
    //  setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
  }, [unassignedFeedback]);

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [leadTypeSelected?.id]);

  useEffect(() => {
    setpageState((oldPageState) => ({ ...oldPageState, page: 0 }));
    searchRef.current.querySelector("input").value = "";
  }, [leadTypeSelected, leadOriginSelected]);

  useEffect(() => {
    if (searchRef.current.querySelector("input").value) {
      setProjectNameTyped("");
      FetchSearchedLeads(token, searchRef.current.querySelector("input").value);
    } else {
      FetchLeads(token);
    }
  }, [pageState.page, pageState.perpage, leadTypeSelected?.id, reloadDataGrid]);

  useEffect(() => {
    setManagers(Managers);
    setAgents(SalesPerson);
  }, [Managers, SalesPerson]);

  useEffect(() => {
    FetchLeads(token);
    // eslint-disable-next-line
  }, [
    pageState.page,
    leadTypeSelected,
    managerSelected,
    agentSelected,
    leadOriginSelected,
    projectNameTyped,
    leadSourceSelected,
    enquiryTypeSelected,
    reloadDataGrid,
    pageState.perpage,
  ]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    // if (event &&
    //   event.target &&
    //   event.target.className &&
    //   (event.target.className.includes("renderDD") ||
    //   event.target.closest(".renderDD"))
    // ) {
    //   console.log("RENDER");
    // }
    // else {
    if (
      !event.target.closest(".editLeadBtn") &&
      !event.target.closest(".deleteLeadBtn") &&
      !event.target.closest(".renderDD")
    ) {
      console.log("Single lead clicked::::::: ", params.row);
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
    // }
  };
  // REMINDER BTN CLICK FUNC
  const HandleReminderBtn = async (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params.row);
    handleAdReminderModalOpen();
    // setUpdateLeadModelOpen(true);
  };
  // EDIT BTN CLICK FUNC
  const HandleEditFunc = async (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
    // setUpdateLeadModelOpen(true);
  };
  // Delete Lead

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

  // const handleCloseBulkImportModel = () => {
  //   setBulkImportModelOpen(false);
  //   bulkImportRef.current.value = "";
  // };

  const handleBulkImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;
      const rows = text.split("\n");
      const keys = rows[0].split(",").map((key) => key.toString().trim());
      const data = rows.slice(1, rows.length);
      const formatted = data.map((row) =>
        row.split(",").map((value) => value.toString().trim())
      );
      setCSVData({
        rows: formatted,
        keys,
      });
      setBulkImportModelOpen(true);
    };

    reader.readAsText(file);
  };

  let allAgents = [];

  if (User?.role === 1 || User?.role === 2 || User?.role === 8) {
    allAgents = agents[`manager-${managerSelected}`];
  } else {
    allAgents = agents[`manager-${User?.id}`];
  }

  return (
    <div
      className={`${
        !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
      }`}
    >
      <div className="p-5 mt-2 w-full">
        <HeadingTitle title={t("leads_search")} counter={pageState?.total} />

        <Box
          sx={{
            // darkModeColors,
            ...darkModeColors,
            marginTop: "5px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "end",
            "& .MuiSelect-select": {
              padding: "2px",
              paddingLeft: "6px !important",
              paddingRight: "20px",
              borderRadius: "8px",
            },
            "& .MuiInputBase-root": {
              width: "max-content",
              marginRight: "5px",
            },
            "& input": {
              paddingTop: "0",
            },
            "& .applied-filter": {
              background: primaryColor,
              borderRadius: 4,
              width: "max-content",
              padding: "3px 8px",
              color: "white",
              marginRight: "0.25rem",
            },
            "& .applied-filter span": {
              marginRight: "3px",
            },
          }}
          className={"items-center mb-1"}
        >
          {/* LEAD CATEGORY  */}
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            {/* LEAD CATEGORY  */}
            <Select
              id="lead_category"
              options={leadOrigins.map((origin) => ({
                value: origin.id,
                label: t("origin_" + origin.id),
              }))}
              value={{
                value: leadOriginSelected?.id || "hotleads",
                label: t("origin_" + (leadOriginSelected?.id || "hotleads")),
              }}
              onChange={(selectedOption) => {
                searchRef.current.querySelector("input").value = "";
                setLeadOriginSelected(
                  leadOrigins.find(
                    (origin) => origin.id === selectedOption.value
                  )
                );
              }}
              className="w-full"
              menuPortalTarget={document.body}
              styles={selectBgStyles(
                currentMode,
                primaryColor,
                blurDarkColor,
                blurLightColor
              )}
            />
          </Box>

          {/* FEEDBACK  */}
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            {/* <Select
              id="leadType"
              options={leadTypes(t).map((type) => ({
                value: type.id,
                label: t("feedback_" + type.id.toLowerCase().replaceAll(" ", "_")),
              }))}
              value={{
                value: leadTypeSelected?.id || "all",
                // label: t("feedback_" + (leadTypeSelected?.id || "all").toLowerCase().replaceAll(" ", "_")),
                label: leadTypeSelected?.label || "All",
              }}
              onChange={({value: selectedOption}) => {
                searchRef.current.querySelector("input").value = "";
                setLeadTypeSelected(
                  leadTypes(t).find((type) => type.id === selectedOption)
                );
              }}
              className="w-full"
              menuPortalTarget={document.body}
              styles={selectBgStyles(currentMode, primaryColor, blurDarkColor, blurLightColor)}
            /> */}
            <Select
              id="leadType"
              options={leadTypes(t).map((type) => ({
                value: type.id,
                label: type.label,
              }))}
              value={{
                value: leadTypeSelected?.id || "all",
                label: leadTypeSelected?.label || t("feedback_all"),
              }}
              onChange={({ value: selectedOption }) => {
                searchRef.current.querySelector("input").value = "";
                setLeadTypeSelected(
                  leadTypes(t).find((type) => type.id === selectedOption)
                );
              }}
              className="w-full"
              menuPortalTarget={document.body}
              styles={selectBgStyles(
                currentMode,
                primaryColor,
                blurDarkColor,
                blurLightColor
              )}
            />
          </Box>

          {/* ENQUIRY TYPE  */}
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
                  className="ml-4 text-sm cursor-pointer"
                  onClick={() => setEnquiryTypeSelected({ id: 0 })}
                >
                  {t("clear")}
                </strong>
              ) : (
                ""
              )}
            </label>
            <Box className="m-1" sx={{ minWidth: "100px" }}>
              <Select
                label={t("label_enquiry")}
                id="enquiryType"
                value={{
                  value: enquiryTypeSelected?.id || "",
                  label: enquiryTypeSelected?.label || t("label_enquiry"),
                }}
                options={enquiryTypes(t).map((type) => ({
                  value: type.id,
                  label: type.label,
                }))}
                onChange={({ value: selectedOption }) => {
                  searchRef.current.querySelector("input").value = "";
                  setEnquiryTypeSelected(
                    enquiryTypes(t).find((type) => type.id === selectedOption)
                  );
                }}
                className={`w-full`}
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

          {/* LEAD SOURCE  */}
          {hasPermission("search_leadSource_filter") && (
            <div style={{ position: "relative" }}>
              <label
                htmlFor="leadSource"
                style={{ position: "absolute", top: "-20px", right: 0 }}
                className={`flex justify-end items-center ${
                  currentMode === "dark" ? "text-white" : "text-dark"
                } `}
              >
                {leadSourceSelected ? (
                  <strong
                    className="ml-4 text-sm cursor-pointer"
                    onClick={() => setLeadSourceSelected(0)}
                  >
                    {t("clear")}
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box className="m-1" sx={{ minWidth: "100px" }}>
                <Select
                  label={t("label_source")}
                  id="leadSource"
                  value={
                    leadSourceSelected
                      ? {
                          value: leadSourceSelected,
                          label: source_options(t).find(
                            (option) => option.value === leadSourceSelected
                          ).label,
                        }
                      : {
                          value: "",
                          label: t("label_source"),
                        }
                  }
                  options={source_options(t)}
                  onChange={(selectedOption) => {
                    searchRef.current.querySelector("input").value = "";
                    setLeadSourceSelected(selectedOption.value);
                  }}
                  className={`w-full`}
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
          )}

          {/* PROJECT NAME  */}
          <Box className="m-1" sx={{ minWidth: "100px" }}>
            <TextField
              className={`w-full py-2 px-3`}
              id="Project"
              type={"text"}
              label={t("label_project")}
              variant="outlined"
              size="medium"
              sx={{
                minWidth: "100px",
                "& label": {
                  top: "-7px",
                },
                "& input": {
                  background:
                    themeBgImg &&
                    (currentMode === "dark" ? blurDarkColor : blurLightColor),
                  borderRadius: "4px",
                },
              }}
              onChange={(e) => {
                searchRef.current.querySelector("input").value = "";
                setProjectNameTyped(e.target.value);
              }}
              required
            />
          </Box>

          {/* MANAGER  */}
          {hasPermission("search_manager_filter") && (
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
                    className="ml-4 text-sm cursor-pointer"
                    onClick={() => setManagerSelected("")}
                  >
                    {t("clear")}
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box className="m-1" sx={{ minWidth: "100px" }}>
                <Select
                  label={t("label_manager")}
                  id="Manager"
                  value={
                    managerSelected
                      ? {
                          value: managerSelected,
                          label: managers.find(
                            (manager) => manager.id === managerSelected
                          ).userName,
                        }
                      : {
                          value: "",
                          label: t("label_manager"),
                        }
                  }
                  onChange={(selectedOption) => {
                    searchRef.current.querySelector("input").value = "";
                    setManagerSelected(selectedOption.value);
                  }}
                  options={managers.map((manager) => ({
                    value: manager.id,
                    label: manager.userName,
                  }))}
                  placeholder={t("label_manager")}
                  className={`w-full`}
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
          )}

          {/* AGENT  */}
          {hasPermission("search_agent_filter") && (
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
                    className="ml-4 text-sm cursor-pointer"
                    onClick={() => {
                      setAgentSelected("");
                    }}
                  >
                    {t("clear")}
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box className="m-1" sx={{ minWidth: "100px" }}>
                <Select
                  label={t("label_agent")}
                  id="Agent"
                  value={
                    agentSelected
                      ? {
                          value: agentSelected,
                          label: allAgents?.find(
                            (agent) => agent.id === agentSelected
                          )?.userName,
                        }
                      : {
                          value: "",
                          label: t("label_agent"),
                        }
                  }
                  onChange={(selectedOption) => {
                    searchRef.current.querySelector("input").value = "";
                    setAgentSelected(selectedOption.value);
                  }}
                  options={allAgents
                    ?.filter((agent) => agent.role === 7)
                    .map((agent) => ({
                      value: agent?.id,
                      label: agent?.userName,
                    }))}
                  placeholder={t("label_agent")}
                  className={`w-full`}
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
          )}
        </Box>

        <Box
          sx={{
            ...DataGridStyles,
            position: "relative",
            marginBottom: "50px",
          }}
          className={`${currentMode}-mode-datatable`}
        >
          {
            // selectedRows.length > 0 && hasPermission("leads_bulk_update") &&
            <MuiButton
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                // left: User?.role === 1 ? "431px" : "476px",
                left:
                  User?.role === 1
                    ? isLangRTL(i18n?.language)
                      ? "auto"
                      : "340px"
                    : isLangRTL(i18n?.language)
                    ? "auto"
                    : "250px",
                right:
                  User?.role === 1
                    ? isLangRTL(i18n?.language)
                      ? "235px"
                      : "auto"
                    : isLangRTL(i18n?.language)
                    ? "135px"
                    : "auto",
                zIndex: "5 !important",
              }}
              variant="text"
              onClick={handleClickBulkUpdate}
            >
              <AiFillEdit size={20} />{" "}
              <span style={{ paddingLeft: "5px" }}>{t("bulk_assign")}</span>
            </MuiButton>
          }
          {
            // selectedRows.length > 0 && hasPermission("leads_bulk_delete") &&
            <MuiButton
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                // left: User?.role === 1 ? "325px" : "260px",
                left:
                  User?.role === 1
                    ? isLangRTL(i18n?.language)
                      ? "auto"
                      : "455px"
                    : isLangRTL(i18n?.language)
                    ? "auto"
                    : "355px",
                right:
                  User?.role == 1
                    ? isLangRTL(i18n?.language)
                      ? "340px"
                      : "auto"
                    : isLangRTL(i18n?.language)
                    ? "240px"
                    : "auto",
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
          }
          <label htmlFor="bulkImport">
            <MuiButton
              onClick={() => bulkImportRef.current.click()}
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                // left: User?.role === 1 ? "230px" : "155px",
                left:
                  User?.role === 1
                    ? isLangRTL(i18n?.language)
                      ? "auto"
                      : "230px"
                    : isLangRTL(i18n?.language)
                    ? "auto"
                    : "150px",

                right:
                  User?.role == 1
                    ? isLangRTL(i18n?.language)
                      ? "140px"
                      : "auto"
                    : isLangRTL(i18n?.language)
                    ? "40px"
                    : "auto",
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
              placeholder="Search.."
              ref={searchRef}
              sx={{
                "& input": {
                  borderBottom: "2px solid #ffffff6e",
                },
              }}
              variant="standard"
              onKeyUp={handleKeyUp}
              onInput={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton sx={{ padding: 0 }}>
                      <BiSearch size={17} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Box
            width={"100%"}
            className={`${currentMode}-mode-datatable`}
            sx={{ ...DataGridStyles, position: "relative" }}
          >
            <DataGrid
              disableDensitySelector
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    creationDate: false,
                  },
                },
              }}
              autoHeight
              disableSelectionOnClick
              rows={pageState.data}
              onRowClick={handleRowClick}
              rowCount={pageState.total}
              loading={pageState.isLoading}
              rowsPerPageOptions={[30, 50, 75, 100]}
              pagination
              width="auto"
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
                setpageState((old) => ({ ...old, page: newPage + 1 }));
              }}
              onPageSizeChange={(newPageSize) =>
                setpageState((old) => ({ ...old, pageSize: newPageSize }))
              }
              disableColumnFilter
              columns={columns?.filter((c) =>
                hasPermission("leads_col_" + c?.field)
              )}
              components={{
                Toolbar: GridToolbar,
                Pagination: CustomPagination,
              }}
              componentsProps={{
                toolbar: {
                  printOptions: { disableToolbarButton: User?.role !== 1 },
                  csvOptions: { disableToolbarButton: User?.role !== 1 },
                  showQuickFilter: false,
                },
              }}
              sx={{
                boxShadow: 2,
                "& .MuiDataGrid-cell:hover": {
                  cursor: "pointer",
                },
                "& .MuiCheckbox-root": {
                  color: currentMode === "dark" ? "#FFF" : "#000",
                },
                "& .Mui-checked": {
                  color: currentMode === "dark" ? "#FFF" : "#000",
                },
                "& .MuiDataGrid-cell[data-field='edit'] svg": {
                  color:
                    currentMode === "dark"
                      ? "white !important"
                      : "black !important",
                },
                "& .MuiDataGrid-virtualScrollerContent .MuiSvgIcon-root": {
                  color: currentMode === "dark" ? "#ffffff" : "#000000",
                },
                // "& .MuiDataGrid-main": {
                //   overflowY: "scroll",
                //   height: "auto",
                // },
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
            />
          </Box>
          {!UpdateLeadModelOpen && (
            <SingleLead
              LeadModelOpen={LeadModelOpen}
              setLeadModelOpen={setLeadModelOpen}
              handleLeadModelOpen={handleLeadModelOpen}
              handleLeadModelClose={handleLeadModelClose}
              LeadData={singleLeadData}
              BACKEND_URL={BACKEND_URL}
              handleUpdateLeadModelOpen={handleUpdateLeadModelOpen}
              handleUpdateLeadModelClose={handleUpdateLeadModelClose}
              UpdateLeadModelOpen={UpdateLeadModelOpen}
              setBulkDeleteClicked={setBulkDeleteClicked}
              setLeadToDelete={setLeadToDelete}
              setDeleteModelOpen={setDeleteModelOpen}
            />
          )}

          {UpdateLeadModelOpen && (
            <UpdateLead
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

          {timelineModelOpen && (
            <Timeline
              timelineModelOpen={timelineModelOpen}
              handleCloseTimelineModel={() => setTimelineModelOpen(false)}
              LeadData={singleLeadData}
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
            />
          )}

          {/* {bulkImportModelOpen && (
            <BulkImport
              bulkImportModelOpen={bulkImportModelOpen}
              handleCloseBulkImportModel={handleCloseBulkImportModel}
              FetchLeads={FetchLeads}
              CSVData={CSVData}
            />
          )} */}
        </Box>
      </div>
    </div>
  );
};

export default Search;
