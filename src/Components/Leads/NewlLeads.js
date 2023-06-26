import { Button } from "@material-tailwind/react";
import { Box, CircularProgress, Dialog, TextField, IconButton, InputAdornment } from "@mui/material";
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
import { AiOutlineEdit } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import {BiSearch} from "react-icons/bi";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2, BsTrash } from "react-icons/bs";
import { IoIosAlert } from "react-icons/io";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";

import SingleLead from "./SingleLead";
import UpdateLead from "./UpdateLead";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import RenderPriority from "./RenderPriority";
import {langs} from "../../langCodes";
import RenderFeedback from "./RenderFeedback";
import RenderManagers from "./RenderManagers";

const Newleads = ({
  BACKEND_URL,
  lead_type,
  lead_origin,
  leadCategory,
  DashboardData,
}) => {
  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState();
  const [deleteloading, setdeleteloading] = useState(false);
  const [deletebtnloading, setdeletebtnloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    User,
  } = useStateContext();
  const [searchText, setSearchText] = useState("");
  const [openDialog, setopenDialog] = useState(false);
  const [LeadToDelete, setLeadToDelete] = useState();

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium,& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        borderColor: currentMode === "dark" ? "white" : "black",
        fontSize: "0.9rem",
        fontWeight: "500",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiDataGrid-cell .MuiDataGrid-cellContent": {
      justifyContent: "center",
    },
  };

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

  const searchRef = useRef();

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

  // ROLE 7
  const AgentColumns = [
    {
      field: "creationDate",
      headerName: "Date",
      // width: 120,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex flex-col">
          <p>{moment(params?.formattedValue).format("YY-MM-DD")}</p>
          <p>{moment(params?.formattedValue).format("HH:mm:ss")}</p>
        </div>
      ),
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
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              {/* <AiTwotoneEdit size={20} /> */}
              <AiOutlineEdit size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  const columns = [
    {
      field: "creationDate",
      headerName: "Date",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="flex flex-col">
          <p>{moment(params?.formattedValue).format("YY-MM-DD")}</p>
          <p>{moment(params?.formattedValue).format("HH:mm:ss")}</p>
        </div>
      ),
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
    // { field: "assignedToSales", headerName: "Salesperson",hideable: false, width: 110 },
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
      minWidth: 90,
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
                <Image
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
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
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
                      ? "text-white bg-transparent rounded-md p-1 shadow-none "
                      : "text-black bg-transparent rounded-md p-1 shadow-none "
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

  const FetchLeads = async (token) => {
    console.log("lead type is");
    console.log(lead_type);
    let FetchLeads_url = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&feedback=New`;

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
          coldCall: row?.coldcall,
          priority: row.priority,
          language: getLangCode(row?.language) || "-",
          leadSource: row?.leadSource,
          lid: row?.lid,
          lastEdited: row?.lastEdited,
          leadFor: row?.leadFor,
          leadStatus: row?.leadStatus,
          leadCategory: leadCategory,
          notes: row?.notes,
          otp: (row?.otp === "No OTP" || row?.otp === "No OTP Used") ? "No OTP Used" : (row?.otp || "No OTP Used"),
          edit: "edit",
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          total: result.data.coldLeads.total,
        }));
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
    console.log("the search lead  url is ");
    console.log(`${BACKEND_URL}/search?title=${term}&page=${pageState.page}`);
    const coldCallCode = pageState?.data[0]?.coldCall;
    let url = `${BACKEND_URL}/search?title=${term}&feedback=New`;
    if (coldCallCode) {
      url += `&coldCall=${coldCallCode}`;
    }


    if(lead_origin === "transfferedleads") {
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
          leadContact:
            row?.leadContact?.slice(1)?.replaceAll(" ", "") || "-",
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
          otp: (row?.otp === "No OTP" || row?.otp === "No OTP Used") ? "No OTP Used" : (row?.otp || "No OTP Used"),
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

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = async (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    setopenBackDrop(false);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (searchTerm) {
      FetchSearchedLeads(token, searchTerm);
    } else {
      FetchLeads(token);
    }
    // setCEOColumns([...CEOColumns]);
    // eslint-disable-next-line
  }, [pageState.page, lead_type, reloadDataGrid]);

  useEffect(() => {
    setpageState((oldPageState) => ({ ...oldPageState, page: 0 }));
    searchRef.current.querySelector("input").value = "";
  }, [lead_type, lead_origin]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params, event) => {
    if (!event.target.classList.contains("deleteLeadBtn")) {
      setsingleLeadData(params.row);
      handleLeadModelOpen();
    }
  };
  // EDIT BTN CLICK FUNC
  const HandleEditFunc = async (params) => {
    console.log(params.row);
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
    setUpdateLeadModelOpen(true);
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
      <Box
        width={"100%"}
        className={`${currentMode}-mode-datatable`}
        sx={{ ...DataGridStyles, position: "relative" }}
      >
                    <div className="absolute top-[7px] right-[20px] z-[5]">
            <TextField
              placeholder="Search.."
              ref={searchRef}
              sx={{"& input": {
                borderBottom: "2px solid #ffffff6e"
              }}}
              variant="standard"
              onKeyUp={handleKeyUp}
              onInput={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton sx={{padding: 0}}>
                      <BiSearch size={17} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
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
          columns={(User?.role === 1 || User?.role === 2) ? columns : AgentColumns}
          // columns={columns}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: {
              showQuickFilter: false,
              printOptions: { disableToolbarButton: User?.role !== 1 },
              csvOptions: { disableToolbarButton: User?.role !== 1 },
              // value: searchText,
              // onChange: HandleQuicSearch,
            },
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
          />
        )}
      </Box>
    </div>
  );
};

export default Newleads;
