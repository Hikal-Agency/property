import {
  Box,
  Button as MuiButton,
  IconButton,
  LinearProgress,
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { FaComment } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory, AiFillEdit } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { FaUser } from "react-icons/fa";

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
import { RiMessage2Line } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import Loader from "../Loader";

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
  const [hovered, setHovered] = useState("");
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
                //     ? "text-white bg-transparent rounded-md shadow-none "
                //     : "text-black bg-transparent rounded-md shadow-none "
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
                //     ? "text-white bg-transparent rounded-md shadow-none "
                //     : "text-black bg-transparent rounded-md shadow-none "
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
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory size={20} />
            </p> */}
            {cellValues.row.leadId !== null && (
              <Link
                to={`/timeline/${cellValues.row.leadId}`}
                className={`editLeadBtn ${
                  currentMode === "dark"
                    ? "text-white bg-transparent rounded-md shadow-none "
                    : "text-black bg-transparent rounded-md shadow-none "
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

  const AgentColumns = [
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
                <badge className="bg-[#0f9d58] p-1 rounded-md available">
                  VERIFIED
                </badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md available">
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
          <div
            className={`deleteLeadBtn edit-lead-btns space-x-1 w-full flex items-center justify-center`}
          >
            <p
              onMouseEnter={() => setHovered("edit")}
              onMouseLeave={() => setHovered("")}
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "bg-transparent text-white rounded-md shadow-none"
                  : "bg-transparent text-black rounded-md shadow-none"
              }`}
              onClick={() => HandleEditFunc(cellValues)}
            >
              <IconButton sx={{ padding: 0 }}>
                <AiOutlineEdit size={20} />
              </IconButton>
            </p>

            {cellValues.row.leadId !== null && (
              <p>
                <Link
                  to={`/timeline/${cellValues.row.leadId}`}
                  className={`editLeadBtn cursor-pointer ${
                    currentMode === "dark"
                      ? "bg-transparent rounded-md shadow-none"
                      : "bg-transparent rounded-md shadow-none"
                  }`}
                >
                  <IconButton
                    sx={{ padding: 0 }}
                    color={currentMode === "dark" ? "black" : "white"}
                  >
                    <AiOutlineHistory size={20} style={{ color: "inherit" }} />
                  </IconButton>
                </Link>
              </p>
            )}
          </div>
        );
      },
    },
  ];

  const columns = [
    {
      field: "leadSource",
      headerName: "Src",
      flex: 1,
      minWidth: 45,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign snapchat" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaSnapchat size={22} color={"#f6d80a"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign facebook" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaFacebook size={22} color={"#0e82e1"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "campaign tiktok" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <img
                  src={"/assets/tiktok-app.svg"}
                  alt=""
                  height={22}
                  width={22}
                  className="object-cover"
                />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() ===
              "campaign googleads" && (
              <div className="bg-white w-max rounded-full text-white flex items-center justify-center">
                <FcGoogle size={22} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "campaign" && (
              <div className="w-max rounded-full flex items-center justify-center">
                <MdCampaign
                  size={22}
                  color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
                />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "cold" && (
              <div className="w-max rounded-full flex items-center justify-center">
                <BsSnow2 size={22} color={"#0ec7ff"} />
              </div>
            )}
            {cellValues.row.leadSource?.toLowerCase() === "personal" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <BsPersonCircle size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "whatsapp" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaWhatsapp size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "message" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <RiMessage2Line size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "comment" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaComment size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "website" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaGlobe size={22} color={"#14539a"} />
              </div>
            )}

            {(cellValues.row.leadSource?.toLowerCase() === "property finder" ||
              cellValues.row.leadSource?.toLowerCase() ===
                "propety finder") && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <GiMagnifyingGlass size={22} color={"#14539a"} />
              </div>
            )}

            {cellValues.row.leadSource?.toLowerCase() === "self" && (
              <div className="bg-white w-max rounded-full flex items-center justify-center">
                <FaUser size={22} color={"#14539a"} />
              </div>
            )}
          </>
        );
      },
    },
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
                <badge className="bg-[#0f9d58] p-1 rounded-md available">
                  VERIFIED
                </badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white text-center font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md available">
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
          <div
            className={`deleteLeadBtn edit-lead-btns space-x-1 w-full flex items-center justify-center`}
          >
            <p
              onMouseEnter={() => setHovered("edit")}
              onMouseLeave={() => setHovered("")}
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "bg-transparent text-white rounded-md shadow-none"
                  : "bg-transparent text-black rounded-md shadow-none"
              }`}
              onClick={() => HandleEditFunc(cellValues)}
            >
              <IconButton sx={{ padding: 0 }}>
                <AiOutlineEdit size={20} />
              </IconButton>
            </p>

            {cellValues.row.leadId !== null && (
              <p>
                <Link
                  to={`/timeline/${cellValues.row.leadId}`}
                  className={`editLeadBtn cursor-pointer ${
                    currentMode === "dark"
                      ? "bg-transparent rounded-md shadow-none"
                      : "bg-transparent rounded-md shadow-none"
                  }`}
                >
                  <IconButton
                    sx={{ padding: 0 }}
                    color={currentMode === "dark" ? "black" : "white"}
                  >
                    <AiOutlineHistory size={20} style={{ color: "inherit" }} />
                  </IconButton>
                </Link>
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
    if (lead_origin === "freshleads") {
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

        let total = result.data.coldLeads.total;
        let pageSize;

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
          console.log(rowsDataArray);

          if (User?.role === 3) {
            console.log("ROLE: ", User?.role);
            console.log(
              "Sales assignes: ",
              rowsDataArray.filter(
                (item) =>
                  !item.assignedToSales ||
                  !item.assignedToSales === 0 ||
                  item.assignedToSales === 102
              )
            );
            filteredData = rowsDataArray.filter(
              (item) =>
                !item.assignedToSales ||
                !item.assignedToSales === 0 ||
                item.assignedToSales === 102
            );
          } else {
            filteredData = rowsDataArray.filter(
              (item) =>
                !item.assignedToManager ||
                item.assignedToManager === 102 ||
                item.assignedToManager === 0
            );
          }

          total = filteredData?.length;
          console.log("Total: ", total);

          console.log("Unassigned rows data: ", filteredData);
        }

        let rowsdata = filteredData.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          leadId: row?.id,
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
          coldCall: row?.coldcall,
          notes: row?.notes || "No notes",
          otp: row?.otp || "No otp",
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
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
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
  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = async (e) => {
    if (e.target.value === "") {
      FetchLeads(token);
    } else {
      setpageState((old) => ({
        ...old,
        isLoading: true,
      }));

      const coldCallCode = pageState?.data[0]?.coldCall;
      let url = `${BACKEND_URL}/search?title=${e.target.value}&feedback=${lead_type}`;
      if (coldCallCode) {
        url += `&coldCall=${coldCallCode}`;
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
            coldCall: row?.coldcall,
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
    <>
      <ToastContainer />
      <div className="pb-10">
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
                  height: "auto",
                },
                "& .MuiDataGrid-cell[data-field='edit'] svg": {
                  color:
                    currentMode === "dark"
                      ? "white !important"
                      : "black !important",
                },
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
    </>
  );
};

export default AllLeads;
