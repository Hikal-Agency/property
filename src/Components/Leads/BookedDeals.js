import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  Select,
  Avatar,
  TextField,
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
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FaSnapchat } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2 } from "react-icons/bs";
import moment from "moment/moment";
import Pagination from "@mui/material/Pagination";
import SingleLead from "./SingleLead";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast, ToastContainer } from "react-toastify";
import RenderManagers from "./RenderManagers";
import UpdateBookedDeal from "./UpdateBookedDeal";
import { useNavigate, useLocation } from "react-router-dom";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import RenderSalesperson from "./RenderSalesperson";

const arrowStyles = {
  position: "absolute",
  background: "red",
  cursor: "pointer",
  width: 50,
  height: 50,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 10,
};

const BookedDeals = ({
  BACKEND_URL,
  lead_type,
  lead_origin,
  leadCategory,
  DashboardData,
}) => {
  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  //eslint-disable-next-line
  const [deleteloading, setdeleteloading] = useState(false);
  //eslint-disable-next-line
  const [deletebtnloading, setdeletebtnloading] = useState(false);

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
  } = useStateContext();
  //eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  //eslint-disable-next-line
  const [openDialog, setopenDialog] = useState(false);
  //eslint-disable-next-line
  const [LeadToDelete, setLeadToDelete] = useState();

  const handleCloseDialog = () => {
    setopenDialog(false);
  };

  const handleNextArrow = () => {
    dataTableRef.current
      .querySelector(".MuiDataGrid-virtualScroller")
      .scrollBy(140, 0);
  };

  const handlePrevArrow = () => {
    dataTableRef.current
      .querySelector(".MuiDataGrid-virtualScroller")
      .scrollBy(-140, 0);
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
  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        fontSize: "0.9rem",
        fontWeight: "500",
        // borderLeft: currentMode === "dark" ? "1px solid white" : "1px solid black",
        // borderRight: currentMode === "dark" ? "1px solid white" : "1px solid black",
        border: "none",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };

  const RenderFeedback = ({ cellValues }) => {
    const [Feedback, setFeedback] = useState(cellValues?.row?.feedback);
    const [newFeedback, setnewFeedback] = useState("");
    const [DialogueVal, setDialogue] = useState(false);
    const [btnloading, setbtnloading] = useState(false);
    const [leadDateValue, setLeadDateValue] = useState({});
    const [leadDate, setLeadDate] = useState("");
    const [leadAmount, setLeadAmount] = useState("");

    function format(value) {
      if (value < 10) {
        return "0" + value;
      } else {
        return value;
      }
    }

    const ChangeFeedback = (e) => {
      setnewFeedback(e.target.value);
      setDialogue(true);
    };

    const UpdateFeedback = async (event) => {
      event.preventDefault();

      setbtnloading(true);
      const token = localStorage.getItem("auth-token");
      const UpdateLeadData = new FormData();
      UpdateLeadData.append("lid", cellValues?.row?.lid);
      UpdateLeadData.append("feedback", newFeedback);
      UpdateLeadData.append("amount", leadAmount);
      UpdateLeadData.append("dealDate", leadDate);

      await axios
        .post(`${BACKEND_URL}/leads/${cellValues?.row?.lid}`, UpdateLeadData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log("Feedback Updated successfull");
          console.log(result);
          toast.success("Feedback Updated Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // UpdateLeadFunc();
          setbtnloading(false);
          setFeedback(newFeedback);
          setreloadDataGrid(!reloadDataGrid);
          setDialogue(false);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error in Updating Feedback", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setbtnloading(false);
        });
    };
    return (
      <Box
        className={`w-full h-full flex items-center justify-center ${
          currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
        }`}
        sx={SelectStyles}
      >
        <Select
          id="feedback"
          value={Feedback}
          label="Feedback"
          onChange={ChangeFeedback}
          size="medium"
          className="w-[100%] h-[75%] border-none"
          displayEmpty
          required
        >
          <MenuItem value={null} disabled>
            ---SELECT---
          </MenuItem>
          <MenuItem value={"Booked"}>Booked</MenuItem>
          <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
          <MenuItem value={"Closed"}>Closed</MenuItem>
        </Select>
        {DialogueVal && (
          <>
            <Dialog
              sx={{
                "& .MuiPaper-root": {
                  boxShadow: "none !important",
                },
                "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
                  {
                    backgroundColor: "rgba(0, 0, 0, 0.5) !important",
                  },
              }}
              open={DialogueVal}
              onClose={(e) => setDialogue(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <form action="" onSubmit={(event) => UpdateFeedback(event)}>
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: 10,
                    color: (theme) => theme.palette.grey[500],
                  }}
                  onClick={() => setDialogue(false)}
                >
                  <IoMdClose size={18} />
                </IconButton>
                <div className="px-10 py-5">
                  <div className="flex flex-col justify-center items-center">
                    <IoIosAlert
                      size={50}
                      className="text-main-red-color text-2xl"
                    />
                    <h1 className="font-semibold pt-3 text-lg text-center">
                      Do You Really Want Change the Feedback from{" "}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {Feedback}
                      </span>{" "}
                      to{" "}
                      <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                        {newFeedback}
                      </span>{" "}
                      ?
                    </h1>
                    {newFeedback.toLowerCase() === "closed" && (
                      <div className="grid sm:grid-cols-1 gap-5">
                        <div className="flex flex-col justify-center items-center gap-4 mt-2 mb-4">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Deal Date"
                              value={leadDateValue}
                              views={["year", "month", "day"]}
                              required
                              onChange={(newValue) => {
                                setLeadDateValue(newValue);
                                setLeadDate(
                                  format(newValue.$d.getUTCFullYear()) +
                                    "-" +
                                    format(newValue.$d.getUTCMonth() + 1) +
                                    "-" +
                                    format(newValue.$d.getUTCDate() + 1)
                                );
                              }}
                              format="yyyy-MM-dd"
                              // renderInput={(params) => (
                              //   <TextField {...params} fullWidth />
                              // )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onKeyDown={(e) => e.preventDefault()}
                                  readOnly={true}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <TextField
                            required
                            fullWidth
                            label="Closed Amount"
                            value={leadAmount}
                            onChange={(e) => {
                              setLeadAmount(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                    <Button
                      className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                      ripple={true}
                      size="lg"
                      type="submit"
                    >
                      {btnloading ? (
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      ) : (
                        <span>Confirm</span>
                      )}
                    </Button>
                    <Button
                      onClick={() => setDialogue(false)}
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
              </form>
            </Dialog>
          </>
        )}
      </Box>
    );
  };

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
      minWidth: 170,
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
            <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineHistory size={20} />
            </Button>
          </div>
        );
      },
    },
  ];

  // ROLE 3
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
      minWidth: 170,
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
            <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineHistory size={20} />
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
            {cellValues?.row?.leadSource?.toLowerCase() ===
              "campaign snapchat" && (
              <div className="bg-white w-fit rounded-full flex items-center justify-center">
                <FaSnapchat size={22} color={"#f6d80a"} />
              </div>
            )}
            {cellValues?.row?.leadSource?.toLowerCase() ===
              "campaign facebook" && (
              <div className="bg-white w-fit rounded-full flex items-center justify-center">
                <FaFacebook size={22} color={"#0e82e1"} />
              </div>
            )}
            {cellValues?.row?.leadSource?.toLowerCase() ===
              "campaign tiktok" && (
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
            {cellValues?.row?.leadSource?.toLowerCase() ===
              "campaign googleads" && (
              <div className="bg-white w-fit rounded-full text-white flex items-center justify-center">
                <FcGoogle size={22} />
              </div>
            )}
            {cellValues?.row?.leadSource?.toLowerCase() === "campaign" && (
              <div className="w-fit rounded-full flex items-center justify-center">
                <MdCampaign
                  size={22}
                  color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
                />
              </div>
            )}
            {cellValues?.row?.leadSource?.toLowerCase() === "cold" && (
              <div className="w-fit rounded-full flex items-center justify-center">
                <BsSnow2 size={22} color={"#0ec7ff"} />
              </div>
            )}
            {cellValues?.row?.leadSource?.toLowerCase() === "personal" && (
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
      minWidth: 170,
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
            <Button
              onClick={() => navigate(`/timeline/${cellValues.row.lid}`)}
              className={`editLeadBtn ${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-white hover:text-red-600"
                  : "text-black bg-transparent rounded-md p-1 shadow-none hover:shadow-red-600 hover:bg-black hover:text-white"
              }`}
            >
              <AiOutlineHistory size={20} />
            </Button>
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
        console.log("Booked deals list: ", result);
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
          //eslint-disable-next-line
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

        console.log("Page state: ", pageState.total);
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
            //eslint-disable-next-line
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
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
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
  //eslint-disable-next-line
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
        width={"73vw"}
        sx={{ ...DataGridStyles, marginLeft: "auto", marginRight: "auto" }}
      >
        <div style={{ position: "relative" }}>
        {pageState.data.length > 0 &&
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
        }
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
              User?.role === 3
                ? columns
                : User?.role === 1
                ? columns
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
            }}
            sx={{
              boxShadow: 2,
              "& .MuiDataGrid-cell:hover": {
                cursor: "pointer",
              },
              "& .MuiDataGrid-cellCheckbox": {
                paddingLeft: "28px",
              },
              "& .MuiDataGrid-virtualScroller": {
                scrollBehavior: "smooth",
                marginTop: "0 !important",
              },
              "& .MuiDataGrid-main": {
                overflowY: "scroll",
                height: pageState.data.length > 0 ? 475 : "auto",
              },
              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 0,
                zIndex: 10,
              },
            }}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
            }
            // style={{justifyContent: "center", alignItems: "center"}}
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
