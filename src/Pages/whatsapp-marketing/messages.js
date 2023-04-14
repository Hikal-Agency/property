import { Button, Box, Select, MenuItem, Alert } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { MdCampaign, MdSend } from "react-icons/md";
import { FaSnapchat } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { BsPersonCircle, BsSnow2 } from "react-icons/bs";
import Pagination from "@mui/material/Pagination";
import { toast, ToastContainer } from "react-toastify";
import SendMessageModal from "../../Components/whatsapp-marketing/SendMessageModal";
import MessageLogs from "../../Components/whatsapp-marketing/MessageLogs";

const leadOrigins = [
  { id: "hotleads", formattedValue: "Fresh Leads" },
  { id: "coldleads", formattedValue: "Cold Leads" },
  { id: "thirdpartyleads", formattedValue: "Thirdparty Leads" },
  { id: "personaleads", formattedValue: "Personal Leads" },
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

const AllLeads = () => {
  const token = localStorage.getItem("auth-token");
  const [selectedRows, setSelectedRows] = useState([]);
  const [leadOriginSelected, setLeadOriginSelected] = useState(leadOrigins[0]);
  const [leadTypeSelected, setLeadTypeSelected] = useState(leadTypes[0]);
  const [openMessageModal, setOpenMessageModal] = useState({
    open: false,
    isWhatsapp: false,
  });
  const [messageLogsModal, setMessageLogsModal] = useState({
    isOpen: false,
    data: {},
  });
  const [whatsappSenderNo, setWhatsappSenderNo] = useState("");

  // const [openMessageModal, setOpenMessageModal] = useState(false);

  const {
    currentMode,
    pageState,
    setpageState,
    reloadDataGrid,
    DataGridStyles,
    setopenBackDrop,
    BACKEND_URL,
    darkModeColors,
  } = useStateContext();

  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");

  const columns = [
    {
      field: "id",
      headerName: "#",
      // width: 150,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div
            className={`${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#000000] text-white"
            } h-full justify-center flex w-full items-center px-5 font-semibold`}
          >
            {cellValues.formattedValue}
          </div>
        );
      },
    },
    {
      field: "leadName",
      headerAlign: "left",
      headerName: "Lead name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "leadContact",
      headerName: "Contact",
      minWidth: 150,
      headerAlign: "left",
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      // width: 150,
      minWidth: 110,
      flex: 1,
      headerAlign: "left",
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
  ];

  const [columnsArr, setColumnsArr] = useState(columns);

  const FetchLeads = async (token, lead_origin, lead_type) => {
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
      } else if (lead_type === "warm") {
        FetchLeads_url = `${BACKEND_URL}/coldLeads?page=${pageState.page}&unassigned=1&coldCall=4`;
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
          leadType: row?.leadType,
          leadSource: row?.leadSource,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.coldLeads.per_page,
          total: result.data.coldLeads.total,
        }));
        setColumnsArr([...columnsArr]);
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  const ULTRA_MSG_API = process.env.REACT_APP_ULTRAMSG_API_URL;
  const ULTRA_MSG_TOKEN = process.env.REACT_APP_ULTRAMSG_API_TOKEN;

  const fetchUltraMsgInstance = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(
        `${ULTRA_MSG_API}/instance/me?token=${ULTRA_MSG_TOKEN}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const waNo = response.data?.id.slice(0, response.data?.id.indexOf("@"));
      setWhatsappSenderNo(waNo);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUltraMsgInstance();
  }, []);

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
            leadType: row?.leadType,
            leadSource: row?.leadSource,
            lid: row?.id,
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
  }, [leadTypeSelected, leadOriginSelected]);

  useEffect(() => {
    FetchLeads(
      token,
      leadOriginSelected?.id || "hotleads",
      leadTypeSelected?.id || "all"
    );
    setColumnsArr([...columnsArr]);
    // eslint-disable-next-line
  }, [pageState.page, leadTypeSelected, leadOriginSelected, reloadDataGrid]);

  const handleRowClick = async (params, event) => {
    setMessageLogsModal({
      isOpen: true,
      data: params,
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
      <Box className={darkModeColors}>
        <label
          htmlFor="leadOrigin"
          className={`${currentMode === "dark" ? "text-white" : "text-dark"} `}
        >
          Lead Origin
        </label>
        <Select
          id="leadOrigin"
          value={leadOriginSelected?.id || "hotleads"}
          onChange={(event) =>
            setLeadOriginSelected(
              leadOrigins.find((origin) => origin.id === event.target.value)
            )
          }
          size="medium"
          className={`w-full mt-1 mb-5 `}
          displayEmpty
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
          <MenuItem value="0" disabled>
            Lead Origin
          </MenuItem>
          {leadOrigins?.map((origin, index) => (
            <MenuItem key={index} value={origin?.id || ""}>
              {origin?.formattedValue}
            </MenuItem>
          ))}
        </Select>
        <label
          htmlFor="leadType"
          className={`${currentMode === "dark" ? "text-white" : "text-dark"} `}
        >
          Lead Type
        </label>
        <Select
          id="leadType"
          value={leadTypeSelected?.id || "all"}
          onChange={(event) =>
            setLeadTypeSelected(
              leadTypes.find((type) => type.id === event.target.value)
            )
          }
          size="medium"
          className={`w-full mt-1 mb-5`}
          displayEmpty
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
            sx={{
              color: currentMode === "dark" ? "#ffffff" : "#000000",
            }}
          >
            Lead Type
          </MenuItem>
          {leadTypes?.map((type, index) => (
            <MenuItem key={index} value={type?.id || ""}>
              {type?.formattedValue}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <h1
        className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
          currentMode === "dark"
            ? "text-white border-white"
            : "text-main-red-color font-bold border-main-red-color"
        }`}
      >
        {leadOriginSelected.formattedValue} -{" "}
        <span className="uppercase">{leadTypeSelected.formattedValue}</span>{" "}
        <span className="bg-main-red-color text-white px-3 py-1 rounded-sm my-auto">
          {pageState?.total}
        </span>
      </h1>

      <Alert color="success" sx={{ mb: 2 }}>
        {selectedRows.length} rows selected
      </Alert>
      {selectedRows.length > 0 && (
        <Box className="flex items-center">
          <Button
            onClick={() =>
              setOpenMessageModal({ open: true, isWhatsapp: false })
            }
            type="button"
            variant="contained"
            sx={{ padding: "12px", mb: 2, mr: 2 }}
            // {selectedRows.length > 0 && (
            //   <Button
            //     onClick={() => setOpenMessageModal(true)}
            //     type="button"
            //     variant="contained"
            //     sx={{ padding: "12px", mb: 2 }}
            color="info"
            size="lg"
          >
            <MdSend style={{ marginRight: 8 }} size={20} /> Bulk SMS
          </Button>
          <Button
            onClick={() =>
              setOpenMessageModal({ open: true, isWhatsapp: true })
            }
            type="button"
            variant="contained"
            sx={{ padding: "12px", mb: 2 }}
            color="success"
            size="lg"
          >
            <MdSend style={{ marginRight: 8 }} size={20} /> Bulk Whatsapp
          </Button>
        </Box>
      )}

      <Box width={"100%"} sx={{ ...DataGridStyles, position: "relative" }}>
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
              ids.map((id) => pageState?.data[id - 1]?.leadContact)
            );
          }}
          pageSize={pageState.pageSize}
          onPageChange={(newPage) => {
            setpageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) =>
            setpageState((old) => ({ ...old, pageSize: newPageSize }))
          }
          columns={columns}
          components={{
            // Toolbar: GridToolbar,
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
        />
      </Box>
      {openMessageModal.open && (
        <SendMessageModal
          sendMessageModal={openMessageModal}
          setSendMessageModal={setOpenMessageModal}
          selectedContacts={selectedRows}
          whatsappSenderNo={whatsappSenderNo}
        />
      )}
      {messageLogsModal.isOpen && (
        <MessageLogs
          messageLogsModal={messageLogsModal}
          setMessageLogsModal={setMessageLogsModal}
          whatsappSenderNo={whatsappSenderNo}
        />
      )}
    </div>
  );
};

export default AllLeads;
