import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  Select,
  InputAdornment,
  TextField,
  FormControl,
  Tooltip,
} from "@mui/material";
import usePermission from "../../utils/usePermission";
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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { socket } from "../../Pages/App";

import Pagination from "@mui/material/Pagination";
import { langs } from "../../langCodes";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

import {
  FaSnapchatGhost,
  FaFacebookF,
  FaTiktok,
  FaRegComments,
  FaUser,
  FaWhatsapp,
  FaYoutube,
  FaTwitter,
  FaSms,
} from "react-icons/fa";
import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import {
  BsPersonCircle,
  BsSnow2,
  BsShieldX,
  BsShieldCheck,
  BsShieldMinus,
} from "react-icons/bs";
import {
  BiSearch,
  BiImport,
  BiArchive,
  BiMessageRoundedDots,
} from "react-icons/bi";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { MdCampaign } from "react-icons/md";
import {
  RxCheckCircled,
  RxCrossCircled,
  RxQuestionMarkCircled,
} from "react-icons/rx";
import { TbWorldWww } from "react-icons/tb";
import moment from "moment";
import { RiWhatsappFill } from "react-icons/ri";
const MessagesComponent = ({
  BACKEND_URL,
  lead_type,
  lead_origin,
  leadCategory,
  DashboardData,
}) => {
  const { screenWidth, screenHeight } = useWindowSize();

  const token = localStorage.getItem("auth-token");
  const [singleLeadData, setsingleLeadData] = useState();
  const [filt, setFilt] = useState([]);
  const { hasPermission } = usePermission();

  //eslint-disable-next-line
  const [deleteloading, setdeleteloading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //eslint-disable-next-line
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  const dataTableRef = useRef();
  const searchRef = useRef();

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

  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    setreloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    isArabic,
    User,
    Managers,
  } = useStateContext();
  //eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  //eslint-disable-next-line
  const [openDialog, setopenDialog] = useState(false);
  //eslint-disable-next-line
  const [LeadToDelete, setLeadToDelete] = useState();
  const [pageRange, setPageRange] = useState();

  const handleCloseDialog = () => {
    setopenDialog(false);
  };

  const handleRangeChange = (e) => {
    const value = e.target.value;

    setPageRange(value);

    setpageState((old) => ({
      ...old,
      perpage: value,
    }));
  };

  //View LEAD MODAL VARIABLES
  const [LeadModelOpen, setLeadModelOpen] = useState(false);
  const handleLeadModelOpen = () => setLeadModelOpen(true);
  const handleLeadModelClose = () => setLeadModelOpen(false);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);

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

  const typeIcon = {
    sms: <FaSms color="#aaaaaa" size={22} />,
    whatsapp: <RiWhatsappFill color="#aaaaaa" size={22} />,
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <small>
            <strong>{cellValues?.formattedValue}</strong>
          </small>
        );
      },
    },

    {
      field: "type",
      headerAlign: "center",
      headerName: "Type",
      maxWidth: 40,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full flex items-center justify-center">
            <p className=" text-center ">{typeIcon["whatsapp"]}</p>
          </div>
        );
      },
    },
    {
      field: "message",
      headerName: "Message",
      minWidth: 250,
      headerAlign: "center",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="flex justify-center items-center">
            <span className="text-center">{params?.formattedValue}</span>
          </div>
        );
      },
    },
    {
      field: "user",
      headerName: "User",
      headerAlign: "center",
      minWidth: 60,
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues?.formattedValue}</div>;
      },
    },
    {
      headerAlign: "center",
      field: "date",
      headerName: "Date",
      minWidth: 50,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>{moment(cellValues?.formattedValue).format("YYYY-MM-DD")}</p>
          </div>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 30,
      headerAlign: "center",
      // headerClassName: headerClasses.header,
      headerClassName: "break-normal",
      flex: 1,
      renderCell: (cellValues) => {
        let status = cellValues?.formattedValue;
        if (status === "success") {
          <div className="bg-[#4ade80]">
            <p>Success</p>
          </div>;
        } else {
          <div className="bg-danger">
            <p>Failed</p>
          </div>;
        }
      },
    },

    {
      field: "recipientCount",
      headerName: "Recipients",
      flex: 1,
      minWidth: 50,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <>
            <div className="flex items-center justify-center">
              {cellValues?.formattedValue}
            </div>
          </>
        );
      },
    },
    {
      field: "credits",
      headerName: "Credits",
      headerAlign: "center",
      minWidth: 70,
      flex: 1,
    },
    // {
    //   field: "edit",
    //   headerName: "Edit",
    //   headerAlign: "center",
    //   maxWidth: 10,
    //   flex: 1,
    // },
  ];

  const FetchLeads = async (token) => {
    console.log("lead type is");
    console.log(lead_type);
    let FetchLeads_url = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    FetchLeads_url = `${BACKEND_URL}/messages?page=${pageState.page}`;

    axios
      .get(FetchLeads_url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(async (result) => {
        console.log("Messages: ", result);
        let rowsDataArray = "";
        if (result.data.messages.current_page > 1) {
          const theme_values = Object.values(result.data.messages.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.messages.data;
        }

        let rowsdata = rowsDataArray?.map((row, index) => {
          // Split the recipients string by commas and count the number of elements
          const recipientCount = row?.recipients
            ? row.recipients.split(",").length
            : 0;

          console.log("recipeint count : ", recipientCount);

          return {
            id:
              pageState.page > 1
                ? pageState.page * pageState.pageSize -
                  (pageState.pageSize - 1) +
                  index
                : index + 1,
            date: row?.created_at || "-",
            type: row?.message_type || "-",
            message: row?.message || "-",
            user: row?.user_id || "-",
            status: row?.status || "-",
            recipients: row?.recipients || "-",
            recipientCount: recipientCount || "-",
            credits: row?.credit_used || 0,
            edit: "edit",
          };
        });

        // count of campaings per source
        const sms = rowsdata?.filter(
          (row) => row?.type?.toLowerCase() === "sms"
        );
        const smsCount = sms.length;

        const whatsapp = rowsdata?.filter(
          (row) => row?.type?.toLowerCase() === "whatsapp"
        );
        const whatsappCount = whatsapp.length;

        // sms recipients
        const totalRecipientsForSMS = rowsdata.reduce((acc, row) => {
          if (
            row.type &&
            row.type.toLowerCase() === "sms" &&
            typeof row.recipientCount === "number" &&
            row.recipientCount !== "-"
          ) {
            return acc + row.recipientCount;
          } else {
            return acc;
          }
        }, 0);

        console.log("sms recep: ", totalRecipientsForSMS);

        // whatsapp recipients
        const totalRecipientsForWahtsapp = rowsdata.reduce((acc, row) => {
          if (
            row.type &&
            row.type.toLowerCase() === "whastapp" &&
            typeof row.recipientCount === "number" &&
            row.recipientCount !== "-"
          ) {
            return acc + row.recipientCount;
          } else {
            return acc;
          }
        }, 0);

        console.log("whatsapp: ", totalRecipientsForWahtsapp);

        // Calculate the total count of credit_used
        const credit_used_count = rowsdata.reduce((total, row) => {
          return total + row.credits;
        }, 0);

        console.log("total credit used : ", credit_used_count);

        setpageState((old) => ({
          ...old,
          smsCount: smsCount,
          whatsappCount: whatsappCount,
          sentSMS: totalRecipientsForSMS,
          sentWhatsapp: totalRecipientsForWahtsapp,
          credit_used: credit_used_count,
          isLoading: false,
          data: rowsdata,
          from: result.data.messages.from,
          to: result.data.messages.to,
          pageSize: result.data.messages.per_page,
          total: result.data.messages.total,
        }));

        console.log("Page state: ", pageState.total);
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
        lead_type !== "coldLeadsNotChecked"
      ) {
        url += `&feedback=${lead_type}`;
      }
    }

    if (lead_type === "coldLeadsVerified") {
      url += `&is_whatsapp=1`;
    } else if (lead_type === "coldLeadsInvalid") {
      url += `&is_whatsapp=2`;
    } else if (lead_type === "coldLeadsNotChecked") {
      url += `&is_whatsapp=0`;
    }

    if (coldCallCode !== "") {
      url += `&coldCall=${coldCallCode}`;
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
          leadContact: row?.leadContact?.slice(1)?.replaceAll(" ", "") || "-",
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
          firstAssigned: row?.firstAssigned || "",
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
        setpageState((oldPageState) => ({ ...oldPageState, page: 1 }));
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
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (searchTerm) {
      FetchSearchedLeads(token, searchTerm);
    } else {
      FetchLeads(token);
    }
    // setCEOColumns([...CEOColumns]);
    // eslint-disable-next-line
  }, [pageState.page, pageState.perpage, lead_type, reloadDataGrid]);

  useEffect(() => {
    setpageState((oldPageState) => ({ ...oldPageState, page: 0 }));
    searchRef.current.querySelector("input").value = "";
  }, [lead_type, lead_origin]);

  // ROW CLICK FUNCTION
  const handleRowClick = (params, event) => {
    if (!event.target.closest(".deleteLeadBtn")) {
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

  // Custom Pagination
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
                backgroundColor: "#DA1F26 !important",
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

  return (
    <div className="pb-10">
      {isClosed ? (
        <Confetti width={screenWidth} height={screenHeight} />
      ) : (
        <></>
      )}
      <Box sx={{ ...DataGridStyles, position: "relative", marginBottom: 50 }}>
        <div className="absolute top-[7px] right-[20px] z-[5]">
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
        <div
          className={`${currentMode}-mode-datatable`}
          style={{ position: "relative" }}
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
            disableColumnFilter
            pageSize={pageState.pageSize}
            onPageChange={(newPage) => {
              setpageState((old) => ({ ...old, page: newPage + 1 }));
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
              //   Toolbar: GridToolbar,
              Pagination: CustomPagination,
            }}
            componentsProps={{
              toolbar: {
                showQuickFilter: false,
                printOptions: { disableToolbarButton: User?.role !== 1 },
                csvOptions: { disableToolbarButton: User?.role !== 1 },
              },
            }}
            sx={{
              boxShadow: 2,
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
          />
        </div>
      </Box>
    </div>
  );
};

export default MessagesComponent;
