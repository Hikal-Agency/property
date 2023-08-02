import {
  Box,
  Button as MuiButton,
  IconButton,
  InputAdornment,
  TextField,
  styled,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import "../../styles/index.css";
import usePermission from "../../utils/usePermission";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

// import axios from "axios";
import axios from "../../axoisConfig";
import { FaComment } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory, AiFillEdit } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaArchive } from "react-icons/fa";
import { GiMagnifyingGlass } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import { BsPersonCircle, BsSnow2, BsTrash, BsAlarm } from "react-icons/bs";
import { TbFileImport } from "react-icons/tb";
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
import { RiMessage2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { langs } from "../../langCodes";
import AddReminder from "../reminder/AddReminder";
import Timeline from "../../Pages/timeline";

const bulkUpdateBtnStyles = {
  position: "absolute",
  top: "10.5px",
  zIndex: "500",
  transform: "translateX(-50%)",
  fontWeight: "500",
};

const feedbacks = [
  "All",
  "New",
  "No Answer",
  "Meeting",
  "Follow Up",
  "Low Budget",
  "Not Interested",
  "Unreachable",
];

const AllLeads = ({ lead_type, lead_origin, leadCategory }) => {
  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState({});
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebtnloading, setdeletebtnloading] = useState(false);
  const [filt, setFilt] = useState([]);
  const [error, setError] = useState(false);
  const { hasPermission } = usePermission();
  console.log("LeadType::", lead_type);

  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkUpdateModelOpen, setBulkUpdateModelOpen] = useState(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [unassignedFeedback, setUnassignedFeedback] = useState("All");
  const [bulkDeleteClicked, setBulkDeleteClicked] = useState(false);
  const [bulkImportModelOpen, setBulkImportModelOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef();
  const selectionModelRef = useRef([]);
  const [hovered, setHovered] = useState("");
  const [CSVData, setCSVData] = useState({
    keys: [],
    rows: [],
  });

  const bulkImportRef = useRef();
  const dataTableRef = useRef();

  // contact masking
  // const renderMaskedContactNumber = (params) => {
  //   const leadContact = params.getValue(params.id, "leadContact");

  //   return (
  //     <InputMask mask="(+9 99) 9999-9999" value={leadContact}>
  //       {() => <input style={{ border: "none", outline: "none" }} />}{" "}
  //       {/* Optional styling */}
  //     </InputMask>
  //   );
  // };

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
  } = useStateContext();

  console.log("Path in alleads component: ", lead_origin);

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
    const value = e.target.value;

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
      headerName: "Lead name",
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
      headerName: "Contact",
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        const contactNumber = params.getValue(params.id, "leadContact");
        // const countryCode = `(+${contactNumber.slice(0, 1)} ${contactNumber.slice(1, 3)})`;

        // Replace last 4 digits with "*"
        const lastFourDigits = contactNumber.slice(-4).replace(/\d/g, "*");

        const stearics = contactNumber + lastFourDigits;
        let finalNumber;

        if (!hasPermission("number_masking")) {
          finalNumber = ` ${stearics}`;
        } else {
          finalNumber = contactNumber;
        }

        return <span>{finalNumber}</span>;
      },
    },

    {
      field: "project",
      headerName: "Project",
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
           className="flex flex-col">
            <p>{cellValues.row.project}</p>
            <p>{cellValues.row.leadFor}</p>
          </div>
        );
      },
    },
    {
      headerAlign: "center",
      field: "leadType",
      headerName: "Property",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>{cellValues.row.enquiryType}</p>
            <p>{cellValues.row.leadType}</p>
          </div>
        );
      },
    },
    {
      headerAlign: "center",
      field: "assignedToManager",
      headerName: "Manager",
      minWidth: 100,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => (
        <RenderManagers cellValues={cellValues} lead_origin={lead_origin} />
      ),
    },
    {
      headerAlign: "center",
      field: "assignedToSales",
      headerName: "Agent",
      minWidth: 100,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => (
        <RenderSalesperson cellValues={cellValues} lead_origin={lead_origin} />
      ),
    },
    {
      field: "feedback",
      headerAlign: "center",
      headerName: "Feedback",
      minWidth: 100,
      flex: 1,

      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },

    {
      field: "priority",
      headerName: "Priority",
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },

    {
      field: "otp",
      headerName: lead_origin === "transfferedleads" ? "Ex-Agent" : "OTP",
      minWidth: 80,
      headerAlign: "center",
      // headerClassName: headerClasses.header,
      headerClassName: "break-normal",
      flex: 1,
      renderCell: (cellValues) => {
        if (lead_origin === "transfferedleads") {
          return (
            <div style={{ fontSize: 11 }}>
              <p>{cellValues.row.transferredFromName || "No Name"}</p>
            </div>
          );
        } else {
          return (
            <div style={{ fontSize: 9 }}>
              {cellValues.formattedValue === "Verified" && (
                <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                  <span className="bg-[#238e41] p-1 rounded-md w-24 text-center">
                    VERIFIED
                  </span>
                </div>
              )}

              {cellValues.formattedValue === "Not Verified" && (
                <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                  <span className="bg-[#DA1F26] p-1 rounded-md w-24 text-center">
                    UNVERIFIED
                  </span>
                </div>
              )}

              {cellValues.formattedValue !== "Not Verified" &&
                cellValues.formattedValue !== "Verified" && (
                  <div className="w-full h-full flex justify-center items-center text-white  text-center font-semibold">
                    <span className="bg-[#000000] p-1 rounded-md w-24text-center">
                      {cellValues.formattedValue}
                    </span>
                  </div>
                )}
            </div>
          );
        }
      },
    },
    {
      field: "leadSource",
      headerName: "Src",
      flex: 1,
      minWidth: 30,
      headerAlign: "center",
      renderCell: (cellValues) => {
        console.log("Start::", cellValues.row.leadSource);
        const sourceIcons = {
          "campaign snapchat": () => <FaSnapchat size={22} color={"#f6d80a"} />,
          "bulk import": () => <FaSnapchat size={22} color={"#f6d80a"} />,
          "campaign facebook": () => <FaFacebook size={22} color={"#0e82e1"} />,
          "campaign tiktok": () => (
            <img
              src={"/assets/tiktok-app.svg"}
              alt=""
              style={{ margin: "0 auto" }}
              height={18}
              width={18}
              className="object-cover"
            />
          ),
          "campaign googleads": () => <FcGoogle size={22} />,
          campaign: () => <FcGoogle size={22} />,
          cold: () => <BsSnow2 size={22} color={"#0ec7ff"} />,
          personal: () => <BsPersonCircle size={22} color={"#14539a"} />,
          whatsapp: () => <FaWhatsapp size={22} color={"#29EC62"} />,
          message: () => <RiMessage2Line size={22} color={"#14539a"} />,
          comment: () => <FaComment size={22} color={"#14539a"} />,
          website: () => <FaGlobe size={22} color={"#14539a"} />,
          "property finder": () => (
            <GiMagnifyingGlass size={22} color={"#14539a"} />
          ),
          "propety finder": () => (
            <GiMagnifyingGlass size={22} color={"#14539a"} />
          ),
          self: () => <FaUser size={22} color={"#14539a"} />,
          "campaign youtube": () => <FaYoutube size={22} color={"#FF0000"} />,
          "campaign twitter": () => <FaTwitter size={22} color={"#14539a"} />,
        };
        return (
          <>
            <div className="flex items-center justify-center">
              {cellValues.row.leadSource?.toLowerCase().startsWith("warm") ? (
                <FaArchive
                  style={{
                    background: "white",
                    padding: "5px",
                    borderRadius: "50%",
                    width: "70%",
                    height: "100%",
                    margin: "0 auto",
                  }}
                  size={22}
                  color={"#14539a"}
                />
              ) : (
                <Box
                  sx={{
                    "& svg": {
                      background: "white",
                      padding: "5px",
                      borderRadius: "50%",
                      width: "70%",
                      height: "100%",
                      margin: "0 auto",
                    },
                  }}
                >
                  {sourceIcons[cellValues.row.leadSource?.toLowerCase()]
                    ? sourceIcons[cellValues.row.leadSource?.toLowerCase()]()
                    : "-"}
                </Box>
              )}
            </div>
          </>
        );
      },
    },
    {
      field: "language",
      headerName: "Lang",
      headerAlign: "center",
      minWidth: 30,
      flex: 1,
    },

    {
      field: "creationDate",
      headerName:
        lead_origin === "transfferedleads" ? "Transferred Date" : "Date",
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
      field: "edit",
      headerName: "Action",
      flex: 1,
      minWidth: 100,
      sortable: false,
      filterable: false,
      headerAlign: "center",

      renderCell: (cellValues) => {
        return (
          <div
            className={`deleteLeadBtn edit-lead-btns space-x-1 w-full flex items-center justify-center`}
          >
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "bg-transparent text-white rounded-md shadow-none"
                  : "bg-transparent text-black rounded-md shadow-none"
              }`}
              onClick={() => HandleReminderBtn(cellValues)}
            >
              <Tooltip title="Set Reminder" arrow>
                <IconButton sx={{ padding: 0 }}>
                  <BsAlarm size={16} />
                </IconButton>
              </Tooltip>
            </p>
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "bg-transparent text-white rounded-md shadow-none"
                  : "bg-transparent text-black rounded-md shadow-none"
              }`}
              onClick={() => HandleEditFunc(cellValues)}
            >
              <Tooltip title="Edit Lead Details" arrow>
                <IconButton sx={{ padding: 0 }}>
                  <AiOutlineEdit size={16} />
                </IconButton>
              </Tooltip>
            </p>

            {cellValues.row.leadId !== null && (
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "bg-transparent text-white rounded-md shadow-none"
                    : "bg-transparent text-black rounded-md shadow-none"
                }`}
                onClick={() => HandleViewTimeline(cellValues)}
              >
                <Tooltip title="View Timeline" arrow>
                  <IconButton sx={{ padding: 0 }}>
                    <AiOutlineHistory size={16} />
                  </IconButton>
                </Tooltip>
              </p>
            )}

            <p
              onClick={() => {
                setLeadToDelete(cellValues?.row.leadId);
                setDeleteModelOpen(true);
                setBulkDeleteClicked(false);
              }}
              disabled={deleteloading ? true : false}
              className={`deleteLeadBtn cursor-pointer ${
                currentMode === "dark"
                  ? " bg-transparent rounded-md shadow-none"
                  : "bg-transparent rounded-md shadow-none"
              }`}
            >
              <Tooltip title="Delete Lead" arrow>
                <IconButton
                  sx={{ padding: 0 }}
                  color={currentMode === "dark" ? "black" : "white"}
                >
                  <BsTrash
                    className="deleteLeadBtn"
                    size={18}
                    style={{ color: "inherit" }}
                  />
                </IconButton>
              </Tooltip>
            </p>
          </div>
        );
      },
    },
  ];

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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&coldCall=0&feedback=Follow Up&leadStatus=Transferred`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
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
      } else if (lead_type === "cold") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=1`;
      } else if (lead_type === "archive") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=4`;
      } else if (lead_type === "personal") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=2`;
      } else if (lead_type === "thirdpartyleads") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&unassigned=1&coldCall=3`;
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
          transferredFromName: row?.transferredFromName,
          leadName: row?.leadName || "-",
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
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

        console.log("Rows Data: ", rowsdata);

        // count of leads per source
        const facebook = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign facebook"
        );
        const fbCounts = facebook.length;

        const snapchat = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign snapchat"
        );
        const spCount = snapchat.length;

        const tiktok = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign tiktok"
        );
        const ttCount = tiktok.length;

        const googleads = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign googleads"
        );
        const gCount = googleads.length;

        const campaign = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "campaign"
        );
        const cCount = campaign.length;

        const cold = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "cold"
        );
        const coCount = cold.length;

        const personal = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "personal"
        );
        const pCount = personal.length;

        const message = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "message"
        );
        const mCount = message.length;

        const whatsapp = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "whatsapp"
        );
        const wCount = whatsapp.length;

        const comment = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "comment"
        );
        const comCount = comment.length;

        const website = rowsdata.filter(
          (row) => row?.leadSource.toLowerCase() === "website"
        );
        const webCount = website.length;

        console.log("FB: ", fbCounts);
        console.log("Snap: ", spCount);
        console.log("wa: ", wCount);
        console.log("ms: ", mCount);

        setpageState((old) => ({
          ...old,
          isLoading: false,
          fbCounts: fbCounts,
          spCount: spCount,
          ttCount: ttCount,
          gCount: gCount,
          cCount: cCount,
          pCount: pCount,
          coCount: coCount,
          mCount: mCount,
          wCount: wCount,
          comment: comCount,
          webCount: webCount,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          from: result.data.coldLeads.from,
          to: result.data.coldLeads.to,
          // total: result.data.coldLeads.total,
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
    } else if (lead_origin === "transfferedleads") {
      coldCallCode = 0;
    }

    let url = `${BACKEND_URL}/search?title=${term}&page=${pageState.page}`;

    if (lead_type) {
      if (
        lead_type !== "all" &&
        lead_type !== "coldLeadsVerified" &&
        lead_type !== "coldLeadsInvalid" &&
        lead_type !== "coldLeadsNotChecked" &&
        lead_origin !== "unassigned"
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

    if (lead_origin === "transfferedleads") {
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
          leadContact: row?.leadContact?.replaceAll(" ", "") || "-",
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
    setpageState((oldPageState) => ({ ...oldPageState, page: 0 }));
    searchRef.current.querySelector("input").value = "";
  }, [lead_type, lead_origin]);

  useEffect(() => {
    if (searchRef.current.querySelector("input").value) {
      FetchSearchedLeads(token, searchRef.current.querySelector("input").value);
    } else {
      FetchLeads(token);
    }
  }, [pageState.page, pageState.perpage, lead_type, reloadDataGrid]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    if (
      !event.target.closest(".editLeadBtn") &&
      !event.target.closest(".deleteLeadBtn")
    ) {
      console.log("Single lead clicked::::::: ", params.row);
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
  };

  // REMINDER BTN CLICK FUNC
  const HandleReminderBtn = async (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params.row);
    handleAdReminderModalOpen();
    // setUpdateLeadModelOpen(true);
  };
  // EDIT BTN CLICK FUNC
  const HandleEditFunc = (params) => {
    console.log("LEADID: ", params);
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
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

          <p className="text-white mr-3">Rows Per Page</p>

          <Select
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
          </Select>

          <Pagination
            sx={{
              "& .Mui-selected": {
                backgroundColor: "white !important",
                color: "black !important",
                borderRadius: "5px !important",
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
  return (
    <>
      <div className="pb-10">
        {lead_origin === "unassigned" && lead_type === "fresh" && (
          <Box
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
                marginRight: "5px",
              },
            }}
          >
            <Select
              id="un-feedback"
              value={unassignedFeedback}
              className={`w-full mt-1 mb-5`}
              onChange={(event) => {
                setUnassignedFeedback(event.target.value);
              }}
              displayEmpty
              size="small"
              required
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                },
                "& .MuiSelect-select": {
                  color: currentMode === "dark" ? "#ffffff" : "#000000",
                },
                "&:hover:not (.Mui-disabled):before": {
                  borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                },
              }}
            >
              <MenuItem
                value="0"
                disabled
                selected
                sx={{
                  color: currentMode === "dark" ? "#ffffff" : "#000000",
                }}
              >
                Feedback
              </MenuItem>
              {feedbacks?.map((feedback, index) => (
                <MenuItem key={index} value={feedback || ""}>
                  {feedback}
                </MenuItem>
              ))}
            </Select>
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
                left: "476px",
                zIndex: "5 !important",
              }}
              variant="text"
              onClick={handleClickBulkUpdate}
            >
              <AiFillEdit size={20} />{" "}
              <span style={{ paddingLeft: "5px" }}>Bulk Update</span>
            </MuiButton>
          )}
          {selectedRows.length > 0 && hasPermission("leads_bulk_delete") && (
            <MuiButton
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                left: "600px",
                zIndex: "5 !important",
              }}
              variant="text"
              onClick={handleClickBulkDelete}
            >
              <BsTrash size={18} />{" "}
              <span style={{ paddingLeft: "5px" }}>Bulk Delete</span>
            </MuiButton>
          )}
          <label htmlFor="bulkImport">
            <MuiButton
              onClick={() => bulkImportRef.current.click()}
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                left: User?.role === 1 ? "355px" : "266px",
              }}
              variant="text"
            >
              <TbFileImport size={18} />{" "}
              <span style={{ paddingLeft: "5px" }}>Bulk Import</span>
            </MuiButton>
          </label>
          <input
            type="file"
            style={{ display: "none" }}
            ref={bulkImportRef}
            onInput={handleBulkImport}
            id="bulkImport"
          />

          {/* <div
            style={{ zIndex: "5 !important" }}
            className="absolute top-[7px] right-[20px] z-[5]"
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
          </div> */}
          <div
            style={{ zIndex: "5 !important" }}
            className="absolute top-[7px] right-[20px] z-[5]"
          >
            {/* <TextField
              type="number"
              placeholder="From"
              value={fromLead}
              sx={{
                "& input": {
                  border: "2px solid #ffffff6e",
                },
              }}
              variant="standard"
              onChange={(e) => setFromLead(e.target.value)}
            />
            <TextField
              type="number"
              placeholder="To"
              value={toLead}
              sx={{
                "& input": {
                  border: "2px solid #ffffff6e",
                },
              }}
              variant="standard"
              onKeyUp={handleChangeNumber}
              onChange={(e) => setToLead(e.target.value)}
            /> */}

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

          <div style={{ position: "relative" }}>
            <DataGrid
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    creationDate: false,
                  },
                },
              }}
              ref={dataTableRef}
              autoHeight
              disableSelectionOnClick
              rows={pageState.data}
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
                  ids.map((id) => pageState?.data[id - 1]?.leadId)
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
                "& .MuiDataGrid-main": {
                  overflowY: "scroll",
                  height: "auto",
                },
                "& .MuiDataGrid-cell[data-field='edit'] svg": {
                  color:
                    currentMode === "dark"
                      ? "white !important"
                      : "black !important",
                },

                "& .MuiButtonBase-root .MuiSwitch-switchBase": {
                  color: "red !important",
                },

                "& .MuiSwitch-root .MuiSwitch-track": {
                  backgroundColor: "red !important",
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

          {!UpdateLeadModelOpen && (
            <SingleLead
              LeadModelOpen={LeadModelOpen}
              setLeadModelOpen={setLeadModelOpen}
              handleLeadModelOpen={handleLeadModelOpen}
              handleLeadModelClose={handleLeadModelClose}
              LeadData={singleLeadData}
              BACKEND_URL={BACKEND_URL}
              lead_origin={lead_origin}
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
        </Box>
      </div>
    </>
  );
};

export default AllLeads;
