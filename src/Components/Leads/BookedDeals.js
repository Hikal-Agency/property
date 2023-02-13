import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Dialog,
  MenuItem,
  Select,
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
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { BiEdit } from "react-icons/bi";
import { AiTwotoneEdit, AiOutlineEdit } from "react-icons/ai";
import {
  MdDeleteOutline,
  MdCampaign,
  MdOutlineNoEncryptionGmailerrorred,
} from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2, BsTrash } from "react-icons/bs";
import { IoIosAlert } from "react-icons/io";
import { BsSnapchat } from "react-icons/bs";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

import SingleLead from "./SingleLead";
import UpdateLead from "./UpdateLead";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";
import RenderPriority from "./RenderPriority";
import RenderFeedback from "./RenderFeedback";
import RenderManagers from "./RenderManagers";
import UpdateBookedDeal from "./UpdateBookedDeal";

const BookedDeals = ({
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
  const ManagerColumns = [];

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
      field: "language",
      headerName: "Language",
      headerAlign: "center",
      // width: 130,
      minWidth: 110,
      flex: 1,
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
          </div>
        );
      },
    },
  ];

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
      renderCell: RenderManagers,
    },
    // { field: "assignedToSales", headerName: "Salesperson",hideable: false, width: 110 },
    
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

    FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&feedback=Booked`;

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
          lid: row?.lid,
          lastEdited: row?.lastEdited,
          project: row?.project,
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
            lid: row?.lid,
            lastEdited: row?.lastEdited,
            project: row?.project,
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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
    // eslint-disable-next-line
  }, [pageState.page, lead_type, reloadDataGrid]);

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
          columns={User?.position === "Founder & CEO" ? columns : AgentColumns}
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
          <UpdateBookedDeal
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

export default BookedDeals;
