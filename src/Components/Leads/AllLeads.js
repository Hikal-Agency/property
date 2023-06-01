import { Box, Button as MuiButton, Avatar, IconButton } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory, AiFillEdit } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2, BsTrash } from "react-icons/bs";
import { TbFileImport } from "react-icons/tb";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";
import SingleLead from "./SingleLead";
import UpdateLead from "./UpdateLead";
import BulkUpdateLeads from "./BulkUpdateLeads";
import { toast, ToastContainer } from "react-toastify";
import RenderPriority from "./RenderPriority";
import RenderFeedback from "./RenderFeedback";
import RenderManagers from "./RenderManagers";
import RenderSalesperson from "./RenderSalesperson";
import { Link, useNavigate } from "react-router-dom";
import DeleteLeadModel from "./DeleteLead";
import BulkImport from "./BulkImport";

const bulkUpdateBtnStyles = {
  position: "absolute",
  top: "12.5px",
  zIndex: "500",
  transform: "translateX(-50%)",
  fontWeight: "500",
};

const AllLeads = ({ lead_type, lead_origin, leadCategory, DashboardData }) => {
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();
  const [singleLeadData, setsingleLeadData] = useState({});
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkUpdateModelOpen, setBulkUpdateModelOpen] = useState(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [bulkDeleteClicked, setBulkDeleteClicked] = useState(false);
  const [bulkImportModelOpen, setBulkImportModelOpen] = useState(false);
  const [CSVData, setCSVData] = useState({
    keys: [],
    rows: [],
  });

  const bulkImportRef = useRef();
  const dataTableRef = useRef();

  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    User,
    BACKEND_URL,
  } = useStateContext();

  console.log("Path in alleads component: ", lead_origin);

  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [LeadToDelete, setLeadToDelete] = useState();

  //View LEAD MODAL VARIABLES
  const [LeadModelOpen, setLeadModelOpen] = useState(false);
  const handleLeadModelOpen = () => setLeadModelOpen(true);
  const handleLeadModelClose = () => setLeadModelOpen(false);

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);
  const handleUpdateLeadModelClose = () => {
    setLeadModelOpen(false);
    setUpdateLeadModelOpen(false);
  };

  // ROLE 3
  // eslint-disable-next-line

  const ManagerColumns = [
    {
      field: "leadName",
      headerName: "Name",
      flex: 1,
      minWidth: 100,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-wrap items-center">
            <span>{cellValues.row.leadName}</span>
          </div>
        );
      },
    },
    {
      field: "leadContact",
      headerName: "Contact",
      minWidth: 115,
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "leadType",
      headerName: "Property",
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>{cellValues.row.leadType}</p>
            <p>{cellValues.row.enquiryType}</p>
          </div>
        );
      },
    },
    {
      field: "assignedToSales",
      headerName: "Agent",
      minWidth: 110,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      minWidth: 110,
      flex: 1,

      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 110,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "language",
      headerName: "Lang",
      minWidth: 65,
      flex: 1,
    },
    // {
    //   field: "leadSource",
    //   headerName: "Src",
    //   minWidth: 38,
    //   flex: 1,

    //   renderCell: (cellValues) => {
    //     return (
    // <div className="w-full mx-auto flex justify-center ">
    //   {cellValues.row.leadSource.toLowerCase() ===
    //     "campaign snapchat" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <FaSnapchat size={22} color={"#f6d80a"} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() ===
    //     "campaign facebook" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <FaFacebook size={22} color={"#0e82e1"} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "campaign tiktok" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <img
    //         src={"/assets/tiktok-app.svg"}
    //         alt=""
    //         height={22}
    //         width={22}
    //         className="object-cover"
    //       />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() ===
    //     "campaign googleads" && (
    //     <div className="bg-white w-fit rounded-full text-white flex items-center justify-center">
    //       <FcGoogle size={22} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "campaign" && (
    //     <div className="w-fit rounded-full flex items-center justify-center">
    //       <MdCampaign
    //         size={22}
    //         color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
    //       />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "cold" && (
    //     <div className="w-fit rounded-full flex items-center justify-center">
    //       <BsSnow2 size={22} color={"#0ec7ff"} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "personal" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <BsPersonCircle size={22} color={"#14539a"} />
    //     </div>
    //   )}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "creationDate",
      headerName: "Date",
      flex: 1,

      sortable: false,
      minWidth: 45,
      filterable: false,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      width: "100%",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn space-x-1 w-full flex items-center justify-center ">
            {currentMode === "dark" ? (
              <p
                onClick={() => HandleEditFunc(cellValues)}
                // className={`${
                //   currentMode === "dark"
                //     ? "text-white bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                //     : "text-black bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
                // }`}
              >
                <AiOutlineEdit size={20} color="white" />

                {/* {currentMode === "dark" ? (
                  <AiOutlineEdit
                    size={20}
                    color="white"
                    // sx={{ color: "red" }}
                  />
                ) : (
                  <AiOutlineEdit size={20} color="black" />
                )} */}
              </p>
            ) : (
              <p
                onClick={() => HandleEditFunc(cellValues)}
                // className={`${
                //   currentMode === "dark"
                //     ? "text-white bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                //     : "text-black bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
                // }`}
              >
                <AiOutlineEdit
                  size={20}
                  color="black"
                  // sx={{ color: "red" }}
                />
                {/* {currentMode === "dark" ? (
                  <AiOutlineEdit
                    size={20}
                    color="white"
                    // sx={{ color: "red" }}
                  />
                ) : (
                  <AiOutlineEdit size={20} color="black" />
                )} */}
              </p>
            )}

            {/* <p
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineHistory size={20} />
            </p> */}
            {cellValues.row.lid !== null && (
              <Link
                to={`/timeline/${cellValues.row.lid}`}
                className={`editLeadBtn ${
                  currentMode === "dark"
                    ? "text-white bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                    : "text-black bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
                }`}
              >
                <AiOutlineHistory size={20} />
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  // ROLE 7
  const AgentColumns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 50,
      flex: 1,

      renderCell: (cellValues) => {
        return (
          <div
            className={`${
              currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
            } w-full h-full flex justify-center items-center px-5 font-semibold`}
          >
            {cellValues.formattedValue}
          </div>
        );
      },
    },
    {
      field: "creationDate",
      headerName: "Date",
      // width: 120,
      minWidth: 110,
      flex: 1,

      sortable: false,
      filterable: false,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "leadName",
      headerName: "Lead name",
      // width: 170,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "leadContact",
      headerName: "Contact",
      // width: 150,
      minWidth: 150,
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      // width: 110,
      minWidth: 110,
      flex: 1,
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      // width: 110,
      minWidth: 110,
      flex: 1,
    },
    {
      field: "leadType",
      headerName: "Property",
      // width: 100,
      minWidth: 110,
      flex: 1,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      // width: 150,
      minWidth: 160,
      flex: 1,

      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: "Priority",

      // width: 150,
      minWidth: 160,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "language",
      headerName: "Language",

      // width: 130,
      minWidth: 110,
      flex: 1,
    },
    {
      field: "otp",
      headerName: "OTP",

      // width: "130",
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div style={{ fontSize: 11 }}>
            {cellValues.formattedValue === "Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white font-semibold">
                <badge className="bg-[#0f9d58] p-1 rounded-md">VERIFIED</badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md">
                  NOT VERIFIED
                </badge>
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      // width: 150,
      minWidth: 170,
      flex: 1,

      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            {/* <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button> */}
            <p
              onClick={() => HandleEditFunc(cellValues)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineEdit size={20} />
            </p>
            <p
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineHistory size={20} />
            </p>
          </div>
        );
      },
    },
  ];

  const columns = [

    {
      field: "leadName",
      headerName: "Name",
      flex: 1,
      minWidth: 85,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-wrap items-center">
            <span>{cellValues.row.leadName}</span>
          </div>
        );
      },
    },
    {
      field: "leadContact",
      headerName: "Contact",
      minWidth: 105,
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      minWidth: 55,
      flex: 1,
    },
    // {
    //   field: "enquiryType",
    //   headerName: "Enquiry",
    //   minWidth: 75,
    //   flex: 1,

    // },
    {
      field: "leadType",
      headerName: "Property",
      minWidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>{cellValues.row.leadType}</p>
            <p>{cellValues.row.enquiryType}</p>
          </div>
        );
      },
    },
    {
      field: "assignedToManager",
      headerName: "Manager",
      minWidth: 90,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderManagers cellValues={cellValues} />,
    },
    {
      field: "assignedToSales",
      headerName: "Agent",
      minWidth: 90,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      minWidth: 85,
      flex: 1,

      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      minWidth: 85,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "language",
      headerName: "Lang",
      minWidth: 45,
      flex: 1,
    },
    // {
    //   field: "leadSource",
    //   headerName: "Src",
    //   minWidth: 38,
    //   flex: 1,

    //   renderCell: (cellValues) => {
    //     return (
    // <div className="w-full mx-auto flex justify-center ">
    //   {cellValues.row.leadSource.toLowerCase() ===
    //     "campaign snapchat" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <FaSnapchat size={22} color={"#f6d80a"} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() ===
    //     "campaign facebook" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <FaFacebook size={22} color={"#0e82e1"} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "campaign tiktok" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <img
    //         src={"/assets/tiktok-app.svg"}
    //         alt=""
    //         height={22}
    //         width={22}
    //         className="object-cover"
    //       />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() ===
    //     "campaign googleads" && (
    //     <div className="bg-white w-fit rounded-full text-white flex items-center justify-center">
    //       <FcGoogle size={22} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "campaign" && (
    //     <div className="w-fit rounded-full flex items-center justify-center">
    //       <MdCampaign
    //         size={22}
    //         color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
    //       />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "cold" && (
    //     <div className="w-fit rounded-full flex items-center justify-center">
    //       <BsSnow2 size={22} color={"#0ec7ff"} />
    //     </div>
    //   )}
    //   {cellValues.row.leadSource.toLowerCase() === "personal" && (
    //     <div className="bg-white w-fit rounded-full flex items-center justify-center">
    //       <BsPersonCircle size={22} color={"#14539a"} />
    //     </div>
    //   )}
    //       </div>
    //     );
    //   },
    // },
    {
      field: "otp",
      headerName: "OTP",
      minWidth: 72,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div style={{ fontSize: 10 }}>
            {cellValues.formattedValue === "Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                <badge className="bg-[#0f9d58] p-1 rounded-md">VERIFIED</badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md">
                  NOT VERIFIED
                </badge>
              </div>
            )}

            {cellValues.formattedValue !== "Not Verified" &&
              cellValues.formattedValue !== "Verified" && (
                <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                  <badge className=" p-1 rounded-md">
                    {cellValues.formattedValue}
                  </badge>
                </div>
              )}
          </div>
        );
      },
    },
    {
      field: "creationDate",
      headerName: "Date",
      flex: 1,

      sortable: false,
      minWidth: 50,
      filterable: false,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 1,
      width: "100%",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className={`deleteLeadBtn edit-lead-btns space-x-1 w-full flex items-center justify-center`}>
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
              onClick={() => HandleEditFunc(cellValues)}
            >
              <IconButton
                sx={{ padding: 0}}
              >
                <AiOutlineEdit size={20} />
              </IconButton>
            </p>

            {cellValues.row.lid !== null && (
              <Link
                to={`/timeline/${cellValues.row.lid}`}
                className={`editLeadBtn cursor-pointer ${
                  currentMode === "dark"
                    ? "bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                    : "bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
                }`}
              >
                <IconButton
                  sx={{ padding: 0 }}
                  color={currentMode === "dark" ? "black" : "white"}
                >
                  <AiOutlineHistory size={20} style={{ color: "inherit" }} />
                </IconButton>
              </Link>
            )}

            <p
              onClick={() => {
                setLeadToDelete(cellValues?.row.lid);
                setDeleteModelOpen(true);
                setBulkDeleteClicked(false);
              }}
              disabled={deleteloading ? true : false}
              className={`deleteLeadBtn cursor-pointer ${
                currentMode === "dark"
                  ? " bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "bg-transparent rounded-md shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
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
            </p>
          </div>
        );
      },
    },
  ];

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
    // LEADS URL GENERATON FOR HOT LEADS SECTION

    // LEADS URL GENERATON FOR HOT LEADS SECTION
    if (lead_origin === "hotleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR COLD LEADS PAGE
    else if (lead_origin === "coldleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=New`;
      } else if (lead_type === "coldLeadsVerified") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&is_whatsapp=1`;
      } else if (lead_type === "coldLeadsInvalid") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&is_whatsapp=2`;
      } else if (lead_type === "coldLeadsNotChecked") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&is_whatsapp=0`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR THIRDPARTY PAGE
    else if (lead_origin === "thirdpartyleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=3&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR PERSONAL PAGE
    else if (lead_origin === "personalleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=2&feedback=Unreachable`;
      }
    }
    // LEADS URL GENERATON FOR WARM LEADS PAGE
    else if (lead_origin === "warmleads") {
      if (lead_type === "all") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4&feedback=Unreachable`;
      }
    } else if (lead_origin === "transfferedleads") {
      FetchLeads_url = `${BACKEND_URL}/coldLeads?page=1&coldCall=0&leadStatus=Transferred`;
    } else if (lead_origin === "unassigned") {
      if (lead_type === "fresh") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=0`;
      } else if (lead_type === "new") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=New`;
      } else if (lead_type === "no answer") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=No Answer`;
      } else if (lead_type === "meeting") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=Meeting`;
      } else if (lead_type === "follow up") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=Follow Up`;
      } else if (lead_type === "low budget") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=Low Budget`;
      } else if (lead_type === "not interested") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=Not Interested`;
      } else if (lead_type === "unreachable") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0&feedback=Unreachable`;
      } else if (lead_type === "cold") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=1`;
      } else if (lead_type === "warm") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&coldCall=4`;
      }
    }

    console.log("fetch lead url is");
    console.log(FetchLeads_url, lead_type);

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

        let filteredData = rowsDataArray;
        if (lead_origin === "unassigned") {
          console.log("Hi, I am unassigned. Please assign me to someone 😢");
          console.log(rowsDataArray)
          filteredData = rowsDataArray.filter(
            (item) => !item.assignedToManager || item.assignedToManager === 102
          );

          console.log("Unassigned rows data: ", filteredData);
        }

        let rowsdata = filteredData.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: row?.creationDate,
          leadName: row?.leadName || "No Name",
          leadContact:
            row?.leadContact?.slice(1)?.replaceAll(" ", "") || "No Contact",
          project: row?.project || "No Project",
          enquiryType: row?.enquiryType || "No Type",
          leadType: row?.leadType || "No Type",
          assignedToManager: row?.assignedToManager || null,
          assignedToSales: row?.assignedToSales || null,
          feedback: row?.feedback || null,
          priority: row?.priority || null,
          language: row?.language || "No language",
          leadSource: row?.leadSource || "No source",
          lid: row?.lid || "No id",
          lastEdited: row?.lastEdited || "No date",
          leadFor: row?.leadFor || "No lead",
          leadStatus: row?.leadStatus || "No status",
          leadCategory: leadCategory || "No category",
          notes: row?.notes || "No notes",
          otp: row?.otp || "No otp",
          edit: "edit",
        }));

        console.log("Rows Data: ", rowsdata);

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          total: result.data.coldLeads.total,
        }));
        setCEOColumns([...CEOColumns]);
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };
  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = async (e) => {
    console.log(e.target.value);
    if (e.target.value === "") {
      FetchLeads(token);
    } else {
      setpageState((old) => ({
        ...old,
        isLoading: true,
      }));
      console.log("the search lead  url is ");
      console.log(
        `${BACKEND_URL}/search?title=${e.target.value}&page=${pageState.page}`
      );
      await axios
        .get(`${BACKEND_URL}/search?title=${e.target.value}`, {
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
            creationDate: row?.creationDate,
            leadName: row?.leadName || "No Name",
            leadContact:
              row?.leadContact?.slice(1)?.replaceAll(" ", "") || "No Contact",
            project: row?.project || "No Project",
            enquiryType: row?.enquiryType || "No Type",
            leadType: row?.leadType || "No Type",
            assignedToManager: row?.assignedToManager || null,
            assignedToSales: row?.assignedToSales || null,
            feedback: row?.feedback || null,
            priority: row?.priority || null,
            language: row?.language || "No Language",
            leadSource: row?.leadSource || "No Source",
            lid: row?.lid || "No id",
            lastEdited: row?.lastEdited || "No Date",
            leadFor: row?.leadFor || "No Lead",
            leadStatus: row?.leadStatus || "No Status",
            leadCategory: leadCategory || "No Category",
            notes: row?.notes || "No notes",
            otp: row?.otp || "No otp",
            edit: "edit",
          }));
          setpageState((old) => ({
            ...old,
            isLoading: false,
            data: rowsdata,
            pageSize: result.data.result.per_page,
            total: result.data.result.total,
          }));
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);

  useEffect(() => {
    FetchLeads(token);
    setCEOColumns([...CEOColumns]);
    // eslint-disable-next-line
  }, [pageState.page, lead_type, reloadDataGrid]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    if (
      !event.target.closest(".editLeadBtn") &&
      !event.target.closest(".deleteLeadBtn")
    ) {
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
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

      const urls = selectedRows.map((lead) =>
        axios.delete(`${BACKEND_URL}/leads/${lead}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
      );

      await Promise.all(urls);
      setdeleteloading(false);
      setdeletebtnloading(false);
      setreloadDataGrid(!reloadDataGrid);
      FetchLeads(token);
      setDeleteModelOpen(false);
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

  // Custom Pagination
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    return (
      <>
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
    <div className="pb-10">
      <ToastContainer />
      <Box
        sx={{
          ...DataGridStyles,
          position: "relative",
          marginBottom: "50px",
        }}
      >
        {selectedRows.length > 0 && (
          <MuiButton
            size="small"
            sx={{ ...bulkUpdateBtnStyles, left: "564px" }}
            variant="text"
            onClick={handleClickBulkUpdate}
          >
            <AiFillEdit size={20} />{" "}
            <span style={{ paddingLeft: "5px" }}>Bulk Update</span>
          </MuiButton>
        )}
        {selectedRows.length > 0 && (
          <MuiButton
            size="small"
            sx={{ ...bulkUpdateBtnStyles, left: "685px" }}
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
            sx={{ ...bulkUpdateBtnStyles, left: "444px" }}
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
        <div style={{ position: "relative" }}>
          {/* {pageState.data.length > 0 && (
            <>
              <div onClick={handleNextArrow}>
                <Avatar
                  className="shadow-md"
                  style={{
                    ...arrowStyles,
                    right: -30,
                  }}
                >
                  <GrFormNext size={30} />
                </Avatar>
              </div>
              <div onClick={handlePrevArrow}>
                <Avatar
                  className="shadow-md"
                  style={{
                    ...arrowStyles,
                    left: -30,
                  }}
                >
                  <GrFormPrevious size={30} />
                </Avatar>
              </div>
            </>
          )} */}
          {pageState.data.length > 0 && <></>}
          <DataGrid
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
            onSelectionModelChange={(ids) => {
              setSelectedRows(ids.map((id) => pageState?.data[id - 1]?.lid));
            }}
            pageSize={pageState.pageSize}
            onPageChange={(newPage) => {
              setpageState((old) => ({ ...old, page: newPage + 1 }));
            }}
            onPageSizeChange={(newPageSize) =>
              setpageState((old) => ({ ...old, pageSize: newPageSize }))
            }
            columns={
              User?.role === 1
                ? CEOColumns
                : User?.role === 3
                ? ManagerColumns
                : AgentColumns
            }
            // columns={columns}
            components={{
              Toolbar: GridToolbar,
              Pagination: CustomPagination,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: true,
                value: searchText,
                onChange: HandleQuicSearch,
              },
              // columnsPanel: {
              //   disableHideAllButton: true,
              // }
            }}
            sx={{
              boxShadow: 2,
              "& .MuiDataGrid-virtualScrollerContent .MuiSvgIcon-root": {
                color: currentMode === "dark" ? "#ffffff" : "#000000",
              },
              "& .MuiDataGrid-main": {
                overflowY: "scroll",
                height: pageState.data.length > 0 ? "475px" : "auto",
              },
              "& .MuiDataGrid-cell[data-field='edit'] svg": {
                color: currentMode === "dark" ? "white !important" : "black !important"
              }
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            columnWidths={{
              checkbox: "30px",
            }}
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

        {bulkUpdateModelOpen && (
          <BulkUpdateLeads
            handleCloseBulkUpdateModel={handleCloseBulkUpdateModel}
            bulkUpdateModelOpen={bulkUpdateModelOpen}
            selectedRows={selectedRows}
            FetchLeads={FetchLeads}
            setSelectedRows={setSelectedRows}
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
          />
        )}
      </Box>
    </div>
  );
};

export default AllLeads;
