import { Button } from "@material-tailwind/react";
import { Box, CircularProgress, Dialog } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2, BsTrash } from "react-icons/bs";
import { IoIosAlert } from "react-icons/io";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";
import SingleLead from "./SingleLead";
import UpdateLead from "./UpdateLead";
import { toast, ToastContainer } from "react-toastify";
import RenderPriority from "./RenderPriority";
import RenderFeedback from "./RenderFeedback";
import RenderManagers from "./RenderManagers";
import RenderSalesperson from "./RenderSalesperson";
import { useNavigate } from "react-router-dom";

const AllLeads = ({ lead_type, lead_origin, leadCategory, DashboardData }) => {
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();
  const [singleLeadData, setsingleLeadData] = useState();
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebtnloading, setdeletebtnloading] = useState(false);

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
    setSalesPerson,
    setManagers,
  } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [LeadToDelete, setLeadToDelete] = useState();

  const handleCloseDialog = () => {
    setopenDialog(false);
  };
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
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
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
      renderCell: (cellValues) => <RenderSalesperson setSalesPersons={setSalesPersons} FetchLeads={(token) => FetchLeads(token)} cellValues={cellValues} />,
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
                <badge className="text-[#0f9d58] p-1 rounded-md">CLOSED DEAL</badge>
              </div>
            )}

            {cellValues.formattedValue !== "Closed Deal" && (
              (<RenderFeedback cellValues={cellValues} />)
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
      minWidth: 110,
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
                <badge className="bg-[#0f9d58] p-1 rounded-md">VERIFIED</badge>
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
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              {/* <AiTwotoneEdit size={20} /> */}
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
    {
      field: "timeline",
      headerName: "TimeLine",
      // width: 150,
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              {/* <AiTwotAiOutlineHistoryoneEdit size={20} /> */}
              <AiOutlineHistory size={20} />
            </Button>
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
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
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
      minWidth: 110,
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
                <badge className="bg-[#0f9d58] p-1 rounded-md">VERIFIED</badge>
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
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              {/* <AiTwotoneEdit size={20} /> */}
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
    {
      field: "timeline",
      headerName: "TimeLine",
      // width: 150,
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,

      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn editLeadBtn space-x-2 w-full flex items-center justify-center ">
            <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              {/* <AiTwotAiOutlineHistoryoneEdit size={20} /> */}
              <AiOutlineHistory size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  async function setSalesPersons(urls){
    const token = localStorage.getItem("auth-token");
    const requests = urls.map(url => axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
    }));
    const responses = await Promise.all(requests);
    const data = {};
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if(response.data?.team[0]?.isParent) {
        const name = `manager-${response.data.team[0].isParent}`;
        data[name] = response.data.team;
      }
    }
    setSalesPerson(data);
    setCEOColumnsState();
    
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      // width: 150,
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
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
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
      minWidth: 110,
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
                <badge className="bg-[#0f9d58] p-1 rounded-md">VERIFIED</badge>
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
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              {/* <AiTwotoneEdit size={20} /> */}
              <AiOutlineEdit size={20} />
            </Button>
            {DashboardData?.designation === "Head" ? (
              <div>
                <Button
                  onClick={() => {
                    setLeadToDelete(cellValues);
                    setopenDialog(true);
                  }}
                  disabled={deleteloading ? true : false}
                  className={`deleteLeadBtn ${
                    currentMode === "dark"
                      ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                      : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
                  }`}
                >
                  <BsTrash className="deleteLeadBtn" size={18} />
                </Button>
                {openDialog && (
                  <Dialog
                    sx={{
                      "& .MuiPaper-root": {
                        boxShadow: "none !important",
                      },
                      "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                        {
                          backgroundColor: "rgba(0, 0, 0, 0.05) !important",
                        },
                    }}
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <div className="px-10 py-5">
                      <div className="flex flex-col justify-center items-center">
                        <IoIosAlert
                          size={50}
                          className="text-main-red-color text-2xl"
                        />
                        <h1 className="font-semibold pt-3 text-lg">
                          Do You Really Want to delete this Lead?
                        </h1>
                      </div>

                      <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                        <Button
                          className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                          ripple={true}
                          size="lg"
                          onClick={() => deleteLead(LeadToDelete)}
                        >
                          {deletebtnloading ? (
                            <CircularProgress
                              size={18}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            <span>Delete</span>
                          )}
                        </Button>

                        <Button
                          onClick={handleCloseDialog}
                          ripple={true}
                          variant="outlined"
                          className={`shadow-none  rounded-md text-sm  ${
                            currentMode === "dark"
                              ? "text-white border-white"
                              : "text-main-red-color border-main-red-color"
                          }`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Dialog>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        );
      },
    },
  ];

  const [CEOColumns, setCEOColumns] = useState(columns);

  function setCEOColumnsState() {
      setCEOColumns([...CEOColumns]);
  }

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
    // LEADS URL GENERATON FOR THIRDPARTY PAGE
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
    } else if (lead_origin === "transfferedleads") {
      FetchLeads_url = `${BACKEND_URL}/coldLeads?page=1&coldCall=0&leadStatus=Transferred`;
    } else if (lead_origin === "unassigned") {
      if (lead_type === "fresh") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=0`;
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
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=1`;
      }
    }

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
          language: row.language,
          leadSource: row?.leadSource,
          lid: row?.id,
          lastEdited: row?.lastEdited,
          leadFor: row?.leadFor,
          leadStatus: row?.leadStatus,
          leadCategory: leadCategory,
          notes: row?.notes,
          otp: row?.otp,
          edit: "edit",
        }));

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
            leadName: row?.leadName,
            leadContact: row?.leadContact,
            project: row?.project,
            enquiryType: row?.enquiryType,
            leadType: row?.leadType,
            assignedToManager: row.assignedToManager,
            assignedToSales: row.assignedToSales,
            feedback: row?.feedback,
            priority: row.priority,
            language: row.language,
            leadSource: row?.leadSource,
            lid: row?.id,
            lastEdited: row?.lastEdited,
            leadFor: row?.leadFor,
            leadStatus: row?.leadStatus,
            leadCategory: leadCategory,
            notes: row?.notes,
            otp: row?.otp,
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
    const token = localStorage.getItem("auth-token");
    if(User?.position !== "Founder & CEO") {
      axios.get(`${BACKEND_URL}/teamMembers/${User?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((result) => {
        const agents = result.data?.team;
        setSalesPerson({[`manager-${User?.id}`]: agents});
      })
    } else {
      axios.get(`${BACKEND_URL}/managers`).then((result) => {
        console.log("manager response is");
        console.log(result);
        const managers = result?.data?.managers;
        setManagers(managers || []);

        const urls = managers.map((manager) => {
          return `${BACKEND_URL}/teamMembers/${manager?.id}`;
        });

        setSalesPersons(urls || []);
      });
    }

    FetchLeads(token);
    setCEOColumns([...CEOColumns]);
    // eslint-disable-next-line
  }, [pageState.page, lead_type, reloadDataGrid]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    if (
      !event.target.classList.contains("deleteLeadBtn") ||
      !event.target.classList.contains("editLeadBtn")
    ) {
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
  };
  // EDIT BTN CLICK FUNC
  const HandleEditFunc = async (params) => {
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
    // setUpdateLeadModelOpen(true);
  };
  // Delete Lead
  const deleteLead = async (params) => {
    setdeleteloading(true);
    setdeletebtnloading(true);
    axios
      .delete(`${BACKEND_URL}/leads/${params.row.lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result);
        setdeleteloading(false);
        setdeletebtnloading(false);
        handleCloseDialog();
        setreloadDataGrid(!reloadDataGrid);
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

  return (
    <div className="pb-10">
      <ToastContainer />
      <Box width={"100%"} sx={DataGridStyles}>
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
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
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
      </Box>
    </div>
  );
};

export default AllLeads;
