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
import SingleSMSModal from "./SingleSMSModal";
const MessagesComponent = ({
  lead_type,
  lead_origin,
  filter,
  date_filter,
  fetch,
  sender_id_filter,
  selectedUser,
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
  //eslint-disable-next-line
  //eslint-disable-next-line
  const [openDialog, setopenDialog] = useState(false);
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

  const [singleMsg, setSingleMsg] = useState(null);

  //View LEAD MODAL VARIABLES
  const [smsModalOpen, setSMSModalOpen] = useState(false);
  const handleLeadModelOpen = () => setSMSModalOpen(true);
  const handleLeadModelClose = () => setSMSModalOpen(false);
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

  const FetchMessages = async (token) => {
    console.log("lead type is");
    console.log(lead_type);
    let FetchMessages = "";
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    FetchMessages = `${BACKEND_URL}/messages?page=${pageState.page}`;

    if (filter) FetchMessages += `&message_type=${filter}`;
    if (date_filter) FetchMessages += `&date_range=${date_filter}`;
    if (sender_id_filter) FetchMessages += `&sender=${sender_id_filter}`;
    if (selectedUser) FetchMessages += `&user_id=${selectedUser}`;

    axios
      .get(FetchMessages, {
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
            sender: row?.sender || "-",
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

  useEffect(() => {
    setopenBackDrop(false);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    FetchMessages(token);
  }, [
    pageState.page,
    pageState.perpage,
    filter,
    date_filter,
    fetch,
    sender_id_filter,
    selectedUser,
  ]);

  useEffect(() => {
    setpageState((oldPageState) => ({ ...oldPageState, page: 0 }));
    // searchRef.current.querySelector("input").value = "";
  }, [lead_type, lead_origin]);

  // ROW CLICK FUNCTION
  const handleRowClick = (params, event) => {
    if (!event.target.closest(".deleteLeadBtn")) {
      setSingleMsg(params.row);
      handleLeadModelOpen();
    }
  };

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
        {/* <div className="absolute top-[7px] right-[20px] z-[5]">
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
            onRowClick={handleRowClick}
            autoHeight
            disableSelectionOnClick
            rows={pageState.data}
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
      {smsModalOpen && (
        <SingleSMSModal
          smsModalOpen={smsModalOpen}
          handleLeadModelClose={handleLeadModelClose}
          singleMsg={singleMsg}
        />
      )}
    </div>
  );
};

export default MessagesComponent;
