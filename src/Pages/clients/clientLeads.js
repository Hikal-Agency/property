import { Button } from "@material-tailwind/react";
import Navbar from "../../Components/Navbar/Navbar";
import { Box, Button as MuiButton } from "@mui/material";
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
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory, AiFillEdit } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2, BsTrash } from "react-icons/bs";
import { langs } from "../../langCodes";
import { TbFileImport } from "react-icons/tb";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";
import SingleLead from "../../Components/Leads/SingleLead";
import UpdateLead from "../../Components/Leads/UpdateLead";
import BulkUpdateLeads from "../../Components/Leads/BulkUpdateLeads";
import { toast, ToastContainer } from "react-toastify";
import RenderPriority from "../../Components/Leads/RenderPriority";
import RenderFeedback from "../../Components/Leads/RenderFeedback";
import RenderManagers from "../../Components/Leads/RenderManagers";
import RenderSalesperson from "../../Components/Leads/RenderSalesperson";
import { useNavigate, useParams } from "react-router-dom";
import DeleteLeadModel from "../../Components/Leads/DeleteLead";
import BulkImport from "../../Components/Leads/BulkImport";
import Footer from "../../Components/Footer/Footer";
import { Link } from "react-router-dom";
import Loader from "../../Components/Loader";

const bulkUpdateBtnStyles = {
  position: "absolute",
  top: "12.5px",
  zIndex: "500",
  left: "52.5%",
  transform: "translateX(-50%)",
  fontWeight: "500",
};

const ClientLeads = ({
  lead_type,
  lead_origin,
  leadCategory,
  DashboardData,
}) => {
  const token = localStorage.getItem("auth-token");
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();
  const [singleLeadData, setsingleLeadData] = useState();
  const [deleteloading, setdeleteloading] = useState(false);
  const { client_id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const [deletebtnloading, setdeletebtnloading] = useState(false);

    const getLangCode = (language) => {
    if(language) {
      const l = langs.find((lang) => lang["name"].toLowerCase() === String(language).toLowerCase() || lang['nativeName'].toLowerCase() === String(language).toLowerCase());
      if(l) {
        return l.code.toUpperCase();
      } else {
        return "Invalid";
      }
    } else {
      return null;
    }
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const [bulkUpdateModelOpen, setBulkUpdateModelOpen] = useState(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState(false);
  const [bulkDeleteClicked, setBulkDeleteClicked] = useState(false);
  const [bulkImportModelOpen, setBulkImportModelOpen] = useState(false);
  const [CSVData, setCSVData] = useState({
    keys: [],
    rows: [],
  });
  const [client, setClient] = useState({});

  const FetchClient = async (token) => {
    try {
      const client = await axios.get(`${BACKEND_URL}/clients/${client_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      client?.data?.data?.map((client) => {
        setClient({
          name: client?.clientName,
          businessName: client?.businessName,
        });
      });

      console.log("Singe client: ", client);
    } catch (error) {
      console.log("Single Client error: ", error);
    }
  };

  const bulkImportRef = useRef();

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
      field: "id",
      headerName: "#",
      minWidth: 50,
      flex: 1,
      headerAlign: "center",
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
      headerAlign: "center",
      sortable: false,
      filterable: false,
                  renderCell: (params) => <div className="flex flex-col">
        <p>{moment(params?.formattedValue).format("YY-MM-DD")}</p>
        <p>{moment(params?.formattedValue).format("HH:mm:ss")}</p>
      </div>,
    },
    {
      field: "leadName",
      headerName: "Lead name",
      // width: 170,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadContact",
      headerName: "Contact",
      // width: 150,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      // width: 110,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      // width: 110,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadType",
      headerName: "Property",
      // width: 100,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "assignedToSales",
      headerName: "Agent",
      headerAlign: "center",
      minWidth: 170,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      // width: 150,
      minWidth: 160,
      flex: 1,
      headerAlign: "center",
      hideable: false,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Closed Deal" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="text-[#0f9d58] p-1 rounded-md">
                  CLOSED DEAL
                </badge>
              </div>
            )}

            {cellValues.formattedValue !== "Closed Deal" && (
              <RenderFeedback cellValues={cellValues} />
            )}
          </>
        );
      },
    },
    {
      field: "priority",
      headerName: "Priority",
      headerAlign: "center",
      // width: 150,
      minWidth: 160,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "language",
      headerName: "Language",
      headerAlign: "center",
      // width: 130,
      minWidth: 100,
      flex: 1,
    },
    {
      field: "otp",
      headerName: "OTP",
      headerAlign: "center",
      // width: "130",
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="bg-[#0f9d58] p-1 rounded-md">OTP VERIFIED</badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md">
                  NOT VERIFIED
                </badge>
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      // width: 150,
      minWidth: 170,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            {/* <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button> */}
            <p
              onClick={() => HandleEditFunc(cellValues)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </p>

            {/* <Link
              to={`/timeline/${cellValues.row.lid}`}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
             
              <AiOutlineHistory size={20} />
            </Link> */}

            <p
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory size={20} />
            </p>
          </div>
        );
      },
    },
  ];

  const AgentColumns = [
    {
      field: "creationDate",
      headerName: "Date",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
                  renderCell: (params) => <div className="flex flex-col">
        <p>{moment(params?.formattedValue).format("YY-MM-DD")}</p>
        <p>{moment(params?.formattedValue).format("HH:mm:ss")}</p>
      </div>,
    },
    {
      field: "leadName",
      headerName: "Lead name",
      // width: 150,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadContact",
      headerName: "Contact",
      // width: 150,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadType",
      headerName: "Property",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "feedback",
      headerName: "Feedback",
      // width: 150,
      minWidth: 160,
      flex: 1,
      headerAlign: "center",
      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      headerAlign: "center",
      // width: 150,
      minWidth: 160,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "language",
      headerName: "Language",
      headerAlign: "center",
      // width: 130,
      minWidth: 100,
      flex: 1,
    },
    {
      field: "otp",
      headerName: "OTP",
      headerAlign: "center",
      // width: "130",
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="bg-[#0f9d58] p-1 rounded-md">OTP VERIFIED</badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md">
                  NOT VERIFIED
                </badge>
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      // width: 150,
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn space-x-2 w-full flex items-center justify-center ">
            {/* <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button> */}
            <p
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </p>

            {/* <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory size={20} />
            </Button> */}
            <Link
              to={`/timeline/${cellValues.row.lid}`}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory
                size={20}
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              />
            </Link>
            {/* <Button
              onClick={() => {
                setLeadToDelete(cellValues?.row.lid);
                setDeleteModelOpen(true);
                setBulkDeleteClicked(false);
              }}
              disabled={deleteloading ? true : false}
              className={`deleteLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <BsTrash className="deleteLeadBtn" size={18} />
            </Button> */}
          </div>
        );
      },
    },
  ];

  const columns = [
    {
      field: "id",
      headerName: "#",
      // width: 150,
      minWidth: 50,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div
            className={`${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#000000] text-white"
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
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
                  renderCell: (params) => <div className="flex flex-col">
        <p>{moment(params?.formattedValue).format("YY-MM-DD")}</p>
        <p>{moment(params?.formattedValue).format("HH:mm:ss")}</p>
      </div>,
    },
    {
      field: "leadName",
      headerName: "Lead name",
      // width: 150,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadContact",
      headerName: "Contact",
      // width: 150,
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "leadType",
      headerName: "Property",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "assignedToManager",
      headerName: "Manager",
      // width: 150,
      minWidth: 200,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderManagers cellValues={cellValues} />,
    },
    {
      field: "assignedToSales",
      headerName: "Agent",
      // width: 150,
      minWidth: 200,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderSalesperson cellValues={cellValues} />,
    },
    {
      field: "feedback",
      headerName: "Feedback",
      // width: 150,
      minWidth: 160,
      flex: 1,
      headerAlign: "center",
      hideable: false,
      renderCell: (cellValues) => <RenderFeedback cellValues={cellValues} />,
    },
    {
      field: "priority",
      headerName: "Priority",
      headerAlign: "center",
      // width: 150,
      minWidth: 160,
      flex: 1,
      hideable: false,
      renderCell: (cellValues) => <RenderPriority cellValues={cellValues} />,
    },
    {
      field: "language",
      headerName: "Language",
      headerAlign: "center",
      // width: 130,
      minWidth: 100,
      flex: 1,
    },
    {
      field: "leadSource",
      headerName: "Source",
      // width: 110,
      minWidth: 70,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="w-full mx-auto flex justify-center ">
            {cellValues.row.leadSource.toLowerCase() === "campaign " && (
              <div className=" w-fit rounded-full flex items-center justify-center">
                Campaign
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() ===
              "campaign snapchat" && (
              <div className="bg-white w-fit rounded-full flex items-center justify-center">
                <FaSnapchat size={22} color={"#f6d80a"} />
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() ===
              "campaign facebook" && (
              <div className="bg-white w-fit rounded-full flex items-center justify-center">
                <FaFacebook size={22} color={"#0e82e1"} />
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() === "campaign tiktok" && (
              <div className="bg-white w-fit rounded-full flex items-center justify-center">
                <img
                  src={"/assets/tiktok-app.svg"}
                  alt=""
                  height={22}
                  width={22}
                  className="object-cover"
                />
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() ===
              "campaign googleads" && (
              <div className="bg-white w-fit rounded-full text-white flex items-center justify-center">
                <FcGoogle size={22} />
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() === "campaign" && (
              <div className="w-fit rounded-full flex items-center justify-center">
                <MdCampaign
                  size={22}
                  color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
                />
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() === "cold" && (
              <div className="w-fit rounded-full flex items-center justify-center">
                <BsSnow2 size={22} color={"#0ec7ff"} />
              </div>
            )}
            {cellValues.row.leadSource.toLowerCase() === "personal" && (
              <div className="bg-white w-fit rounded-full flex items-center justify-center">
                <BsPersonCircle size={22} color={"#14539a"} />
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "otp",
      headerName: "OTP",
      headerAlign: "center",
      // width: "130",
      minWidth: 110,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="bg-[#0f9d58] p-1 rounded-md">OTP VERIFIED</badge>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className="w-full h-full flex justify-center items-center text-white px-5 text-xs font-semibold">
                <badge className="bg-[#ff0000] p-1 rounded-md">
                  NOT VERIFIED
                </badge>
              </div>
            )}
          </>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      // width: 150,
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn space-x-2 w-full flex items-center justify-center ">
            {/* <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button> */}
            <p
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </p>

            {/* <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory size={20} />
            </Button> */}
            <Link
              to={`/timeline/${cellValues.row.lid}`}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory
                size={20}
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              />
            </Link>
            {/* <Button
              onClick={() => {
                setLeadToDelete(cellValues?.row.lid);
                setDeleteModelOpen(true);
                setBulkDeleteClicked(false);
              }}
              disabled={deleteloading ? true : false}
              className={`deleteLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <BsTrash className="deleteLeadBtn" size={18} />
            </Button> */}

            <p
              onClick={() => {
                setLeadToDelete(cellValues?.row.lid);
                setDeleteModelOpen(true);
                setBulkDeleteClicked(false);
              }}
              disabled={deleteloading ? true : false}
              // className={`deleteLeadBtn ${
              //   currentMode === "dark"
              //     ? "text-white bg-transparent rounded-md p-1 shadow-none "
              //     : "text-black bg-transparent rounded-md p-1 shadow-none "
              // }`}
            >
              <BsTrash size={18} color="action" />
            </p>
          </div>
        );
      },
    },
  ];

  const [CEOColumns, setCEOColumns] = useState(columns);

  function setCEOColumnsState() {
    setCEOColumns([...CEOColumns]);
  }

  console.log("Leads: ", pageState);

  const FetchLeads = async (token) => {
    console.log("lead type is here");
    console.log(lead_type);
    console.log("lead origin is");
    console.log(lead_origin);
    let FetchLeads_url = `${BACKEND_URL}/agencyleads/${client_id}`;
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));
    // LEADS URL GENERATON FOR HOT LEADS SECTION

    console.log("fetch lead url is");
    console.log(FetchLeads_url);

    axios
      .get(FetchLeads_url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(async (result) => {
        setloading(false);
        console.log("the user leads are here ");
        console.log("Agency leads", result?.data?.agency_leads);

        let rowsDataArray = "";
        if (result?.data?.agency_leads?.data > 1) {
          const theme_values = Object.values(result?.data?.agency_leads?.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result?.data?.agency_leads?.data;
        }

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: row?.creationDate,
          leadName: row?.leadName,
          leadContact: row?.leadContact,
          project: row?.project,
          enquiryType: row?.enquiryType,
          leadType: row?.leadType,
          assignedToManager: row.assignedToManager,
          assignedToSales: row.assignedToSales,
          feedback: row?.feedback,
          priority: row.priority,
          language: getLangCode(row?.language) || "No language",
          leadSource: row?.leadSource,
          lid: row?.id,
          lastEdited: row?.lastEdited,
          leadFor: row?.leadFor,
          leadStatus: row?.leadStatus,
          leadCategory: leadCategory,
          notes: row?.notes,
          otp: (row?.otp === "No OTP" || row?.otp === "No OTP Used") ? "No OTP Used" : (row?.otp || "No OTP Used"),
          edit: "edit",
        }));

        // filter leads with status "new"
        const newLeads = rowsdata.filter(
          (row) => row?.leadStatus.toLowerCase() === "new"
        );
        const newLeadsCount = newLeads.length;

        // filter leads with feedback = no answer
        const feedback_no_answer = rowsdata.filter(
          (row) => row?.feedback?.toLowerCase() === "no answer"
        );
        const feedback_no_answer_count = feedback_no_answer.length;

        // filter leads with feedback = not interested
        const feedback_not_intrsd = rowsdata.filter(
          (row) => row?.feedback.toLowerCase() === "not interested"
        );
        const feedback_not_intrsd_count = feedback_not_intrsd.length;

        // filter leads with feedback = ureachable
        const unreachable = rowsdata.filter(
          (row) => row?.feedback.toLowerCase() === "unreachable"
        );
        const unreachable_count = unreachable.length;

        // filter leads with feedback = low budget
        const lowBudget = rowsdata.filter(
          (row) => row?.feedback.toLowerCase() === "low budget"
        );
        const lowBudget_count = lowBudget.length;

        // filter leads with feedback = low budget
        const followUp = rowsdata.filter(
          (row) => row?.feedback.toLowerCase() === "low budget"
        );
        const followUp_count = followUp.length;

        // filter leads with feedback = meeting
        const meeting = rowsdata.filter(
          (row) => row?.feedback.toLowerCase() === "meeting"
        );
        const meeting_count = meeting.length;

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          newLeads: newLeadsCount,
          noAnswer: feedback_no_answer_count,
          notIntrsd: feedback_not_intrsd_count,
          unreachable: unreachable_count,
          lowBugt: lowBudget_count,
          followUp: followUp_count,
          meeting: meeting_count,
          pageSize: result?.data?.agency_leads.per_page,
          total: result?.data?.agency_leads?.total,
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
    // setSearchTerm(e.target.value);
  };

  useEffect(() => {
    setopenBackDrop(false);
    // eslint-disable-next-line
  }, [lead_type]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
      FetchLeads(token);
    FetchClient(token);
    setCEOColumns([...CEOColumns]);
    // eslint-disable-next-line
  }, [pageState.page, lead_type, reloadDataGrid, searchTerm]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    if (
      !event.target.closest(".editLeadBtn") &&
      !event.target.closest(".deleteLeadBtn")
    ) {
      setsingleLeadData(params?.row);
      handleLeadModelOpen();
    }
  };
  // EDIT BTN CLICK FUNC
  const HandleEditFunc = async (params) => {
    setsingleLeadData(params?.row);
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
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
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

      {/* <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-dark" : "bg-white"
          }`}
        >
          <div className="flex pb-10">
            <div className={`w-full`}>
              <div className="pl-3">
                
                <div className="my-5 mb-10">
                  <div className="my-3">
                    <h2
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } font-semibold text-xl`}
                    >
                      Leads
                    </h2>
                  </div>
                  <Box
                    width={"100%"}
                    sx={{ ...DataGridStyles, position: "relative" }}
                  >
                    {selectedRows.length > 0 && (
                      <MuiButton
                        size="small"
                        sx={bulkUpdateBtnStyles}
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
                        sx={{ ...bulkUpdateBtnStyles, left: "64%" }}
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
                        sx={{ ...bulkUpdateBtnStyles, left: "50.5%" }}
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
                    <DataGrid
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
                      onSelectionModelChange={(ids) => {
                        setSelectedRows(
                          ids.map((id) => pageState?.data[id - 1]?.lid)
                        );
                      }}
                      pageSize={pageState.pageSize}
                      onPageChange={(newPage) => {
                        setpageState((old) => ({ ...old, page: newPage + 1 }));
                      }}
                      onPageSizeChange={(newPageSize) =>
                        setpageState((old) => ({
                          ...old,
                          pageSize: newPageSize,
                        }))
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
                        "& .MuiDataGrid-cell:hover": {
                          cursor: "pointer",
                        },
                      }}
                      getRowClassName={(params) =>
                        params.indexRelativeToCurrentPage % 2 === 0
                          ? "even"
                          : "odd"
                      }
                      // style={{justifyContent: "center", alignItems: "center"}}
                    />

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
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div> */}

      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="w-full pl-3">
              <div className="mt-5">
                <h1
                  className={`text-xl border-l-[4px] ml-1 pl-1 mb-5  font-bold ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-red-600 font-bold border-red-600"
                  }`}
                >
                  {client?.name} -{" "}
                  <span className="capitalize mt-5">
                    {client?.businessName}
                  </span>{" "}
                  <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>

                <div className=" mb-5">
                  <div className=" mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 ">
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                          width: "auto",
                          // maxWidth: "100%",
                        }}
                      >
                        <span>New</span>
                        <span>{pageState?.newLeads}</span>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <span>No Answer</span>
                        <span>{pageState?.noAnswer}</span>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <span>Not Interested</span>
                        <span>{pageState?.notIntrsd}</span>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <span>Unreachable</span>
                        <span>{pageState?.unreachable}</span>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <span>Low Budget</span>
                        <span>{pageState?.lowBugt}</span>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <span>Follow Up</span>
                        <span>{pageState?.followUp}</span>
                      </Box>
                      <Box
                        sx={{
                          padding: "10px",
                          margin: "10px",
                          borderRadius: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontWeight: "bold",
                          background: `${
                            currentMode === "dark" ? "#202020" : "#fafafa"
                          }`,
                          color: `${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`,
                          boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        <span>Meeting</span>
                        <span>{pageState?.meeting}</span>
                      </Box>
                    </div>
                  </div>
                </div>

                <Box
                className={`${currentMode}-mode-datatable`}
                  width={"100%"}
                  sx={{ ...DataGridStyles, position: "relative" }}
                >
                  {selectedRows.length > 0 && (
                    <MuiButton
                      size="small"
                      sx={{...bulkUpdateBtnStyles, zIndex: "5 !important"}}
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
                      sx={{ ...bulkUpdateBtnStyles, left: "64%", zIndex: "5 !important" }}
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
                      sx={{ ...bulkUpdateBtnStyles, left: "50.5%", zIndex: "5 !important" }}
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
                  <DataGrid
                    autoHeight
                    disableSelectionOnClick
                    rows={pageState?.data}
                    onRowClick={handleRowClick}
                    rowCount={pageState.total}
                    loading={pageState.isLoading}
                    rowsPerPageOptions={[30, 50, 75, 100]}
                    pagination
                    width="auto"
                    paginationMode="server"
                    page={pageState.page - 1}
                    checkboxSelection
                    onSelectionModelChange={(ids) => {
                      setSelectedRows(
                        ids.map((id) => pageState?.data[id - 1]?.lid)
                      );
                    }}
                    pageSize={pageState.pageSize}
                    onPageChange={(newPage) => {
                      setpageState((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    onPageSizeChange={(newPageSize) =>
                      setpageState((old) => ({
                        ...old,
                        pageSize: newPageSize,
                      }))
                    }
                    columns={
                      (User?.role === 1 || User?.role === 2)
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
                                          printOptions: { disableToolbarButton: User?.role !== 1 },
            csvOptions: { disableToolbarButton: User?.role !==  1},
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
                      "& .MuiDataGrid-cell:hover": {
                        cursor: "pointer",
                      },
                      "& .MuiDataGrid-cell[data-field='edit'] svg": {
                        color:
                          currentMode === "dark"
                            ? "white !important"
                            : "black !important",
                      },
                    }}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 0
                        ? "even"
                        : "odd"
                    }
                    // style={{justifyContent: "center", alignItems: "center"}}
                  />

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
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );
};

export default ClientLeads;
