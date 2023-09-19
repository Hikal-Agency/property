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
  FormControl,
  InputLabel,
} from "@mui/material";
import "../../styles/index.css";
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
import { useNavigate } from "react-router-dom";
import DeleteLeadModel from "../../Components/Leads/DeleteLead";
import { langs } from "../../langCodes";
import AddReminder from "../../Components/reminder/AddReminder";
import RenderPriority from "../../Components/Leads/RenderPriority";
import Timeline from "../timeline";

const bulkUpdateBtnStyles = {
  position: "absolute",
  top: "10.5px",
  zIndex: "500",
  transform: "translateX(-50%)",
  fontWeight: "500",
};


const leadOrigins = [
  { id: "hotleads", formattedValue: "Fresh Leads" },
  { id: "coldleads", formattedValue: "Cold Leads" },
  { id: "thirdpartyleads", formattedValue: "Thirdparty Leads" },
  { id: "personalleads", formattedValue: "Personal Leads" },
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

const Search = ({ lead_type, lead_origin, leadCategory, DashboardData }) => {
  const token = localStorage.getItem("auth-token");

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
    primaryColor
  } = useStateContext();
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
  const [leadTypeSelected, setLeadTypeSelected] = useState(leadTypes[0]);
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

  console.log("Path in alleads component: ", lead_origin);
  console.log("Sales:", SalesPerson);

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

  const handleChangeNumber = (e) => {};

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
        return "Invalid";
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
      headerName: "Property",
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
              {cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}
            </p>
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
      renderCell: (cellValues) => <RenderManagers cellValues={cellValues} />,
    },
    {
      headerAlign: "center",
      field: "assignedToSales",
      headerName: "Agent",
      minWidth: 100,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
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
      minWidth: 80,
      headerAlign: "center",
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "otp",
      headerName:
        lead_origin === "transfferedleads" ? "Transferred From" : "OTP",
      minWidth: 30,
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
          return (
            <div className="p-1 rounded-md">
              {cellValues.formattedValue === "Verified" && (
                <Tooltip title="Verified" arrow>
                  <div
                    className={`mx-1 w-full h-full flex justify-center items-center text-center`}
                  >
                    <span className="text-[#238e41] p-1 text-center">
                      <BsShieldCheck size={16} />
                    </span>
                  </div>
                </Tooltip>
              )}

              {cellValues.formattedValue === "Not Verified" && (
                <Tooltip title="Not Verified" arrow>
                  <div
                    className={`mx-1 w-full h-full flex justify-center items-center text-center`}
                  >
                    <span className="text-primary p-1 text-center">
                      <BsShieldX size={16} />
                    </span>
                  </div>
                </Tooltip>
              )}

              {cellValues.formattedValue !== "Not Verified" &&
                cellValues.formattedValue !== "Verified" && (
                  <Tooltip title="No OTP used" arrow>
                    <div
                      className={`mx-1 w-full h-full flex justify-center items-center text-center`}
                    >
                      <span className="text-[#AAAAAA] p-1 text-center">
                        <BsShieldMinus size={16} />
                      </span>
                    </div>
                  </Tooltip>
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
        const sourceIcons = {
          "campaign snapchat": () => (
            <FaSnapchatGhost size={16} color={"#f6d80a"} className="p-1" />
          ),

          "campaign facebook": () => (
            <FaFacebookF size={16} color={"#0e82e1"} className="p-1" />
          ),

          "campaign tiktok": () => (
            <FaTiktok
              size={16}
              color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
              className="p-1"
            />
          ),

          "campaign googleads": () => <FcGoogle size={16} className="p-1" />,

          "campaign youtube": () => (
            <FaYoutube size={16} color={"#FF0000"} className="p-1" />
          ),

          "campaign twitter": () => (
            <FaTwitter size={16} color={"#00acee"} className="p-1" />
          ),

          "bulk import": () => (
            <BiImport size={16} className="text-primary" className="p-1" />
          ),

          "property finder": () => (
            <GiMagnifyingGlass size={16} color={"#ef5e4e"} className="p-1" />
          ),

          campaign: () => (
            <MdCampaign size={16} color={"#696969"} className="p-0.5" />
          ),

          cold: () => <BsSnow2 size={16} color={"#0ec7ff"} className="p-1" />,

          personal: () => (
            <BsPersonCircle size={16} color={"#6C7A89"} className="p-1" />
          ),

          whatsapp: () => (
            <FaWhatsapp size={16} color={"#53cc60"} className="p-1" />
          ),

          message: () => (
            <BiMessageRoundedDots
              size={16}
              color={"#6A5ACD"}
              className="p-0.5"
            />
          ),

          comment: () => (
            <FaRegComments size={16} color={"#a9b3c6"} className="p-0.5" />
          ),

          website: () => (
            <TbWorldWww size={16} color={"#AED6F1"} className="p-0.5" />
          ),

          self: () => <FaUser size={16} color={"#6C7A89"} className="p-0.5" />,
        };
        return (
          <>
            <div className="flex items-center justify-center">
              {cellValues.row.leadSource?.toLowerCase().startsWith("warm") ? (
                <BiArchive
                  style={{
                    width: "50%",
                    height: "50%",
                    margin: "0 auto",
                  }}
                  size={16}
                  color={"#AEC6CF"}
                  className="p-0.5"
                />
              ) : (
                <Box
                  sx={{
                    "& svg": {
                      width: "50%",
                      height: "50%",
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
    console.log("lead type is");
    console.log(lead_type);
    console.log("lead origin is");
    console.log(lead_origin);
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
      } else if (leadTypeSelected?.id === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=0&feedback=Follow Up`;
      } else if (leadTypeSelected?.id === "low budget") {
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
      } else if (leadTypeSelected?.id === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=1&feedback=Follow Up`;
      } else if (leadTypeSelected?.id === "low budget") {
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
      } else if (leadTypeSelected?.id === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=3&feedback=Follow Up`;
      } else if (leadTypeSelected?.id === "low budget") {
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
      } else if (leadTypeSelected?.id === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=2&feedback=Follow Up`;
      } else if (leadTypeSelected?.id === "low budget") {
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
      } else if (leadTypeSelected?.id === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${pageState.perpage || 14}&coldCall=4&feedback=Follow Up`;
      } else if (leadTypeSelected?.id === "low budget") {
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
      }
    } else if (leadOriginSelected?.id === "transfferedleads") {
      FetchLeads_url = `${BACKEND_URL}/coldLeads?page=1&coldCall=0&leadStatus=Transferred`;
    } else if (leadOriginSelected?.id === "unassigned") {
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
      } else if (leadTypeSelected?.id === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${
          pageState.page
        }&perpage=${
          pageState.perpage || 14
        }&unassigned=1&coldCall=0&feedback=Follow Up`;
      } else if (leadTypeSelected?.id === "low budget") {
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

          <p className="mr-3">Rows Per Page</p>

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
    <>
      <div className="pl-3 w-full">
        {/* {leadOriginSelected?.id === "unassigned" &&
          leadTypeSelected?.id === "fresh" && (
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
        <Box></Box> */}

        <div className="w-full flex items-center py-3">
          <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
          <h1
            className={`text-lg font-semibold ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            Leads Search{" "}
            <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
              {pageState?.total}
            </span>
          </h1>
        </div>

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
          <Box className="m-1" sx={{ minWidth: "90px" }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                id="leadOrigin"
                label="Category"
                value={leadOriginSelected?.id || "hotleads"}
                onChange={(event) => {
                  searchRef.current.querySelector("input").value = "";
                  setLeadOriginSelected(
                    leadOrigins.find(
                      (origin) => origin.id === event.target.value
                    )
                  );
                }}
                className={`w-full py-2 px-3`}
                displayEmpty
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
                  minWidth: "90px !important",
                }}
              >
                <MenuItem value="0" disabled>
                  Lead Origin
                </MenuItem>
                {leadOrigins?.map((origin, index) => (
                  <MenuItem
                    key={index}
                    value={origin?.id || ""}
                    // sx={{ color: "#ffffff" }}
                  >
                    {origin?.formattedValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* FEEDBACK  */}
          <Box className="m-1" sx={{ minWidth: "90px" }}>
            <FormControl fullWidth>
              <InputLabel>Feedback</InputLabel>
              <Select
                id="leadType"
                label="Feedback"
                value={leadTypeSelected?.id || "all"}
                onChange={(event) => {
                  searchRef.current.querySelector("input").value = "";
                  setLeadTypeSelected(
                    leadTypes.find((type) => type.id === event.target.value)
                  );
                }}
                className={`w-full py-2 px-3`}
                displayEmpty
                required
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                  "&:hover:not (.Mui-disabled):before": {
                    borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                  "& .MuiSelect-select": {
                    color: currentMode === "dark" ? "#ffffff" : "#000000",
                  },
                  minWidth: "90px !important",
                }}
              >
                <MenuItem
                  value="0"
                  disabled
                  sx={{
                    color: currentMode === "dark" ? "#ffffff" : "#000000",
                  }}
                >
                  Feedback
                </MenuItem>
                {leadTypes?.map((type, index) => (
                  <MenuItem key={index} value={type?.id || ""}>
                    {type?.formattedValue}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  className="ml-4 text-red-600 cursor-pointer"
                  onClick={() => setEnquiryTypeSelected({ id: 0 })}
                >
                  Clear
                </strong>
              ) : (
                ""
              )}
            </label>
            <Box className="m-1" sx={{ minWidth: "90px" }}>
              <FormControl fullWidth>
                <InputLabel>Enquiry</InputLabel>
                <Select
                  label="Enquiry"
                  id="enquiryType"
                  value={enquiryTypeSelected?.id}
                  className={`w-full py-2 px-3`}
                  onChange={(event) => {
                    searchRef.current.querySelector("input").value = "";
                    setEnquiryTypeSelected(
                      enquiryTypes.find(
                        (type) => type.id === event.target.value
                      )
                    );
                  }}
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
                    "& .MuiSelect-select": {
                      color: currentMode === "dark" ? "#ffffff" : "#000000",
                    },
                    minWidth: "90px !important",
                  }}
                >
                  <MenuItem
                    value="0"
                    disabled
                    sx={{
                      color: currentMode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    <span className="text-gray-400">- - -</span>
                  </MenuItem>
                  {enquiryTypes?.map((type, index) => (
                    <MenuItem key={index} value={type?.id || ""}>
                      {type?.formattedValue}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => setLeadSourceSelected(0)}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box className="m-1" sx={{ minWidth: "90px" }}>
                <FormControl fullWidth>
                  <InputLabel>Source</InputLabel>
                  <Select
                    label="Source"
                    id="leadSource"
                    value={leadSourceSelected}
                    className={`w-full py-2 px-3`}
                    onChange={(event) => {
                      searchRef.current.querySelector("input").value = "";
                      setLeadSourceSelected(event.target.value);
                    }}
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
                      "& .MuiSelect-select": {
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      },
                      minWidth: "90px !important",
                    }}
                  >
                    <MenuItem
                      value="0"
                      disabled
                      sx={{
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      <span className="text-gray-400">- - -</span>
                    </MenuItem>
                    <MenuItem value={"Website"}>Website</MenuItem>
                    <MenuItem value={"Campaign Facebook"}>Facebook</MenuItem>
                    <MenuItem value={"Campaign Snapchat"}>Snapchat</MenuItem>
                    <MenuItem value={"Campaign Tiktok"}>Tiktok</MenuItem>
                    <MenuItem value={"Campaign GoogleAds"}>GoogleAds</MenuItem>
                    <MenuItem value={"Campaign YouTube"}>YouTube</MenuItem>
                    <MenuItem value={"Campaign"}>Campaign</MenuItem>
                    <MenuItem value={"Whatsapp"}>Whatsapp</MenuItem>
                    <MenuItem value={"Comment"}>Comment</MenuItem>
                    <MenuItem value={"Message"}>Message</MenuItem>
                    <MenuItem value={"Property Finder"}>
                      Property Finder
                    </MenuItem>
                    <MenuItem value={"Bulk Import"}>Bulk Import</MenuItem>
                    <MenuItem value={"Personal"}>Personal</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          )}

          {/* PROJECT NAME  */}
          <Box className="m-1" sx={{ minWidth: "90px" }}>
            <TextField
              className={`w-full py-2 px-3`}
              id="Project"
              type={"text"}
              label="Project"
              variant="outlined"
              size="medium"
              sx={{
                minWidth: "90px",
                "& label": {
                  top: "-6px",
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
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => setManagerSelected("")}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box className="m-1" sx={{ minWidth: "90px" }}>
                <FormControl fullWidth>
                  <InputLabel style={{ top: "-6px" }}>Manager</InputLabel>
                  <Select
                    label="Manager"
                    id="Manager"
                    value={managerSelected || ""}
                    onChange={(event) => {
                      searchRef.current.querySelector("input").value = "";
                      setManagerSelected(event.target.value);
                    }}
                    className={`w-full py-2 px-3`}
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
                      "& .MuiSelect-select": {
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      },
                      minWidth: "100px !important",
                    }}
                  >
                    <MenuItem
                      value=""
                      disabled
                      sx={{
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                    >
                      {/* <span className="text-gray-400"></span> */}
                    </MenuItem>
                    {managers?.map((manager, index) => (
                      <MenuItem key={index} value={manager?.id || ""}>
                        {manager?.userName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    className="ml-4 text-red-600 cursor-pointer"
                    onClick={() => {
                      setAgentSelected("");
                    }}
                  >
                    Clear
                  </strong>
                ) : (
                  ""
                )}
              </label>
              <Box className="m-1" sx={{ minWidth: "90px" }}>
                <FormControl fullWidth>
                  <InputLabel style={{ top: "-6px" }}>Agent</InputLabel>
                  <Select
                    label="Agent"
                    id="Agent"
                    value={agentSelected || ""}
                    onChange={(event) => {
                      searchRef.current.querySelector("input").value = "";
                      setAgentSelected(event.target.value);
                    }}
                    className={`w-full py-2 px-3`}
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
                      "& .MuiSelect-select": {
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      },
                      minWidth: "100px",
                    }}
                  >
                    <MenuItem selected value="" disabled>
                      {/* <span className="text-gray-400">Agent</span> */}
                    </MenuItem>
                    {allAgents?.map((agent, index) => (
                      <MenuItem key={index} value={agent?.id || ""}>
                        {agent?.userName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
          {selectedRows.length > 0 && hasPermission("leads_bulk_update") && (
            <MuiButton
              size="small"
              sx={{
                ...bulkUpdateBtnStyles,
                left: User?.role === 1 ? "431px" : "476px",
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
                left: User?.role === 1 ? "325px" : "260px",
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
                left: User?.role === 1 ? "230px" : "155px",
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
          <div
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
                  color: "red !important",
                },

                "& .MuiSwitch-root .MuiSwitch-track": {
                  backgroundColor: "red !important",
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
    </>
  );
};

export default Search;
