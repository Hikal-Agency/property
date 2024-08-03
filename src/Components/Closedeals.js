import { useEffect, useState } from "react";
import moment from "moment/moment";
import { selectStyles } from "./_elements/SelectStyles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Pagination,
  Tooltip,
  FormGroup,
  RadioGroup,
  Radio,
  TextField,
  Button,
  FormLabel,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import Select from "react-select";
import { Box, maxWidth } from "@mui/system";
import { BsFilterCircle } from "react-icons/bs";
import { DatePicker } from "@mui/x-date-pickers";

import {
  BsBuildings,
  BsQuestionLg,
  BsCart4,
  BsCalendarCheck,
} from "react-icons/bs";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import { useStateContext } from "../context/ContextProvider";
import { pageStyles } from "./_elements/SelectStyles";
import axios from "../axoisConfig";
import UpdateClosedLead from "./Leads/UpdateClosedLead";
import Timeline from "../Pages/timeline";
import { FaCheck, FaCheckCircle, FaHandshake } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import { renderSourceIcons } from "./_elements/SourceIconsDataGrid";
import { renderOTPIcons } from "./_elements/OTPIconsDataGrid";
import DealHistory from "../Pages/timeline/DealHistory";
import usePermission from "../utils/usePermission";

import { BsCheck2, BsX } from "react-icons/bs";
import { source_options } from "./_elements/SelectOptions";

const Closedeals = ({ pageState, setpageState }) => {
  // eslint-disable-next-line
  const [singleLeadData, setsingleLeadData] = useState();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    User,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    darkModeColors,
    Managers,
    SalesPerson,
  } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [pageRange, setPageRange] = useState();
  const { hasPermission } = usePermission();

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);
  const [dealHisotryModel, setDealHistoryModel] = useState(false);
  const [managers, setManagers] = useState(Managers || []);
  const [agents, setAgents] = useState(SalesPerson || []);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);

  const handleUpdateLeadModelClose = () => {
    setUpdateLeadModelOpen(false);
  };

  const [filtersData, setFiltersData] = useState({
    leadSource: null,
    agentAssigned: null,
    managerAssigned: null,
    unit: "",
    leadName: "",
    startDate: null,
    endDate: null,
    pdc_status: "",
    spa_status: "",
    invoice_status: "",
    comm_status: "",
  });

  useEffect(() => {
    setManagers(Managers);
    setAgents(SalesPerson);
  }, [Managers, SalesPerson]);

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
  };
  const HandleViewDealHistory = (params) => {
    setsingleLeadData(params.row);
    setDealHistoryModel(true);
  };

  const handleRangeChange = (e) => {
    const value = e.value;

    setPageRange(value);

    setpageState((old) => ({
      ...old,
      perpage: value,
    }));
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  // RENDER STATUS ICONS
  const renderStatusIcons = (cellValues, currentMode) => {
    const statuses = [
      {
        field: "pdc_status",
        label: t("pdc"),
        status: cellValues.row.pdc_status,
      },
      {
        field: "spa_status",
        label: t("spa"),
        status: cellValues.row.spa_status,
      },
      {
        field: "invoice_status",
        label: t("invoice"),
        status: cellValues.row.invoice_status,
      },
      {
        field: "comm_status",
        label: t("commission"),
        status: cellValues.row.comm_status,
      },
      {
        field: "agent_comm_status",
        label: t("agent_comm"),
        status: cellValues.row.agent_comm_status,
      },
      {
        field: "manager_comm_status",
        label: t("manager_comm"),
        status: cellValues.row.manager_comm_status,
      },
    ];
    const other_statuses = [
      {
        field: "pdc_status",
        label: t("pdc"),
        status: cellValues.row.pdc_status,
      },
      {
        field: "spa_status",
        label: t("spa"),
        status: cellValues.row.spa_status,
      },
      {
        field: "invoice_status",
        label: t("invoice"),
        status: cellValues.row.invoice_status,
      },
      {
        field: "comm_status",
        label: t("commission"),
        status: cellValues.row.comm_status,
      },
      {
        field: "agent_comm_status",
        label: t("agent_comm"),
        status: cellValues.row.agent_comm_status,
      },
    ];

    return (
      <Box display="flex" flexDirection="row" gap={0.5}>
        {User?.role === 1 || User?.role === 8
          ? statuses.map((status) => (
              <Tooltip
                key={status.field}
                title={
                  <Box>
                    <strong>{status.label}</strong>
                    <br />
                    {status.status === 1 ? "Completed" : "Pending"}
                  </Box>
                }
                arrow
              >
                <div className="flex items-center justify-center">
                  {status.status === 1 ? (
                    <p className="bg-green-600 rounded-full shadow-none p-1 flex items-center">
                      <BsCheck2 size={12} color="white" />
                    </p>
                  ) : (
                    <p className="bg-red-600 rounded-full shadow-none p-1 flex items-center">
                      <BsX size={12} color="#ffffff" />
                    </p>
                  )}
                </div>
              </Tooltip>
            ))
          : other_statuses.map((status) => (
              <Tooltip
                key={status.field}
                title={
                  <Box>
                    <strong>{status.label}</strong>
                    <br />
                    {status.status === 1 ? "Completed" : "Pending"}
                  </Box>
                }
                arrow
              >
                <div className="flex items-center justify-center">
                  {status.status === 1 ? (
                    <p className="bg-green-600 rounded-full shadow-none p-1 flex items-center">
                      <BsCheck2 size={12} color="white" />
                    </p>
                  ) : (
                    <p className="bg-red-600 rounded-full shadow-none p-1 flex items-center">
                      <BsX size={12} color="#ffffff" />
                    </p>
                  )}
                </div>
              </Tooltip>
            ))}
      </Box>
    );
  };

  const columns = [
    // SOURCE
    {
      field: "leadSource",
      headerName: t("label_source"),
      flex: 1,
      minWidth: 40,
      // width: 20,
      headerAlign: "center",
      renderCell: (cellValues) => renderSourceIcons(cellValues, currentMode),
    },
    // LEAD NAME
    {
      field: "leadName",
      headerName: t("label_lead_name"),
      minWidth: 100,
      flex: 1,
      // width: 100,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="w-full">
            <p
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    // PROJECT
    {
      field: "project",
      headerName: t("label_project"),
      headerAlign: "center",
      minWidth: 80,
      flex: 1,
      // width: 100,
      renderCell: (cellValues) => {
        return (
          <div
            style={{
              fontFamily: isArabic(cellValues?.formattedValue)
                ? "Noto Kufi Arabic"
                : "inherit",
            }}
            className="w-full flex flex-col"
          >
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.project === "null" ? "-" : cellValues.row.project}
            </p>
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}
            </p>
          </div>
        );
      },
    },
    // ENQUIRY
    {
      headerAlign: "center",
      field: "leadType",
      headerName: t("label_property"),
      minWidth: 80,
      flex: 1,
      // width: 100,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.enquiryType === "null"
                ? "-"
                : cellValues.row.enquiryType}
            </p>
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.leadType === "null"
                ? "-"
                : cellValues.row.leadType}
            </p>
          </div>
        );
      },
    },
    // UNIT
    {
      field: "unit",
      headerAlign: "center",
      headerName: t("label_unit"),
      minWidth: 80,
      flex: 1,
      // width: 50,
    },
    // AMOUNT
    {
      field: "amount",
      headerAlign: "center",
      headerName: t("label_amount_aed"),
      minWidth: 80,
      flex: 1,
      // width: 100,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col w-full ">
            {cellValues.formattedValue && (
              <div className="bg-primary w-full text-white font-semibold rounded-md p-2 flex-wrap whitespace-normal">
                {cellValues.row.currency} {cellValues.formattedValue}
              </div>
            )}
          </div>
        );
      },
    },
    // DEAL DATE
    {
      field: "dealDate",
      headerName: t("label_deal_date"),
      minWidth: 75,
      flex: 1,
      // width: 80,
      headerAlign: "center",
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    // CONSULTANT
    {
      field: "userName",
      headerAlign: "center",
      headerName: t("label_consultant"),
      minWidth: 100,
      flex: 1,
      // width: 100,
      renderCell: (cellValues) => {
        return (
          <div style={{ textWrap: "wrap" }}>{cellValues.formattedValue}</div>
        );
      },
    },
    // OTP
    {
      field: "otp",
      headerName: t("label_otp"),
      minWidth: 20,
      flex: 1,
      // width: 20,
      headerAlign: "center",
      renderCell: (cellValues) => renderOTPIcons(cellValues, currentMode),
    },
    // STATUS
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 160,
      // width: 150,
      headerAlign: "center",
      renderCell: (cellValues) => renderStatusIcons(cellValues, currentMode),
    },
    // ACTION
    {
      field: "",
      headerName: t("label_action"),
      minWidth: 100,
      maxWidth: 250,
      flex: 1,
      // width: 150,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center flex-wrap`}
            style={{
              minWidth: "100px !important",
            }}
          >
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#2ea8d7] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Edit Closed Deal" arrow>
                <button onClick={() => HandleEditFunc(cellValues)}>
                  <AiOutlineEdit size={16} />
                </button>
              </Tooltip>
            </p>

            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="View Timeline" arrow>
                <button onClick={() => HandleViewTimeline(cellValues)}>
                  <AiOutlineHistory size={16} />
                </button>
              </Tooltip>
            </p>

            {hasPermission("deal_history") && (
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <Tooltip title="View Deal History" arrow>
                  <button onClick={() => HandleViewDealHistory(cellValues)}>
                    <FaHandshake size={16} />
                  </button>
                </Tooltip>
              </p>
            )}
          </div>
        );
      },
    },
  ];

  const otherColumns = [
    // DEAL DATE
    {
      field: "dealDate",
      headerName: t("label_deal_date"),
      minWidth: 75,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    // LEAD NAME
    {
      field: "leadName",
      headerName: t("label_lead_name"),
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="w-full">
            <p
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    // PROJECT
    {
      field: "project",
      headerName: t("label_project"),
      headerAlign: "center",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div
            style={{
              fontFamily: isArabic(cellValues?.formattedValue)
                ? "Noto Kufi Arabic"
                : "inherit",
            }}
            className="w-full flex flex-col"
          >
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.project === "null" ? "-" : cellValues.row.project}
            </p>
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}
            </p>
          </div>
        );
      },
    },
    // ENQUIRY
    {
      headerAlign: "center",
      field: "leadType",
      headerName: t("label_property"),
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.enquiryType === "null"
                ? "-"
                : cellValues.row.enquiryType}
            </p>
            <p className="flex-wrap whitespace-normal">
              {cellValues.row.leadType === "null"
                ? "-"
                : cellValues.row.leadType}
            </p>
          </div>
        );
      },
    },
    // UNIT
    {
      field: "unit",
      headerAlign: "center",
      headerName: t("label_unit"),
      minWidth: 80,
      flex: 1,
    },
    // AMOUNT
    {
      field: "amount",
      headerAlign: "center",
      headerName: t("label_amount_aed"),
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col w-full ">
            {cellValues.formattedValue && (
              <div className="bg-primary w-full text-white font-semibold rounded-md p-2 flex-wrap whitespace-normal">
                {cellValues.row.currency} {cellValues.formattedValue}
              </div>
            )}
          </div>
        );
      },
    },
    // CONSULTANT
    {
      field: "userName",
      headerAlign: "center",
      headerName: t("label_consultant"),
      minWidth: 100,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div style={{ textWrap: "wrap" }}>{cellValues.formattedValue}</div>
        );
      },
    },
    // OTP
    {
      field: "otp",
      headerName: t("label_otp"),
      minWidth: 20,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => renderOTPIcons(cellValues, currentMode),
    },
    // STATUS
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 160,
      // width: 150,
      headerAlign: "center",
      renderCell: (cellValues) => renderStatusIcons(cellValues, currentMode),
    },
    // ACTION
    {
      field: "",
      headerName: t("label_action"),
      minWidth: 120,
      maxWidth: 250,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#2ea8d7] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="Edit Closed Deal" arrow>
                <button onClick={() => HandleEditFunc(cellValues)}>
                  <AiOutlineEdit size={16} />
                </button>
              </Tooltip>
            </p>

            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
            >
              <Tooltip title="View Timeline" arrow>
                <button onClick={() => HandleViewTimeline(cellValues)}>
                  <AiOutlineHistory size={16} />
                </button>
              </Tooltip>
            </p>
            {hasPermission("deal_history") && (
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <Tooltip title="View Deal History" arrow>
                  <button onClick={() => HandleViewDealHistory(cellValues)}>
                    <FaHandshake size={16} />
                  </button>
                </Tooltip>
              </p>
            )}
          </div>
        );
      },
    },
  ];

  //   const HandleClick = (params) => {
  //     console.log(params);
  //   };
  const HandleEditFunc = async (params) => {
    setsingleLeadData(params.row);
    handleUpdateLeadModelOpen();
    // setUpdateLeadModelOpen(true);
  };
  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(
        `${BACKEND_URL}/closedDeals?page=${pageState.page}&perpage=${
          pageState.perpage || 14
        }`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("the closed deals are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (result.data.leads.current_page > 1) {
          const theme_values = Object.values(result.data.leads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.leads.data;
        }

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          dealDate: row?.dealDate || "-",
          leadName: row?.leadName || "-",
          userName: row?.userName ? row?.userName : "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          otp:
            row?.otp === "No OTP" || row?.otp === "No OTP Used"
              ? "No OTP Used"
              : row?.otp || "No OTP Used",
          leadSource: row?.leadSource || "-",
          amount: row?.amount || "-",
          lid: row?.id,
          leadId: row?.leadId,
          unit: row?.unit,
          currency: row?.currency,
          booking_date: row?.booking_date,
          booking_amount: row?.booking_amount,
          spa_status: row?.spa_status,
          invoice_status: row?.invoice_status,
          comm_status: row?.comm_status,
          agent_comm_status: row?.agent_comm_status,
          manager_comm_status: row?.manager_comm_status,
          pdc_status: row?.pdc_status,
          comm_percent: row?.comm_percent || 0,
          comm_amount: row?.comm_amount || 0,
          vat: row?.vat || 0,
          agent_comm_percent: row?.agent_comm_percent || 0,
          agent_comm_amount: row?.agent_comm_amount || 0,
          manager_comm_percent: row?.manager_comm_percent || 5,
          manager_comm_amount: row?.manager_comm_amount || 0,
          managerId: row?.managerId,
          salesId: row?.salesId,
          closedBy: row?.closedBy,
          discount_amount: row?.discount_amount || 0,
          discount_percent: row?.discount_percent || 0,
          cashback_amount: row?.cashback_amount || 0,
          cashback_percent: row?.cashback_percent || 0,
          passport: row?.passport,
          tax_invoice: row?.tax_invoice || null,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          from: result.data.leads.from,
          to: result.data.leads.to,
          pageSize: result.data.leads.per_page,
          total: result.data.leads.total,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);

    // eslint-disable-next-line
  }, [pageState.page, pageState.perpage]);

  // ROW CLICK FUNCTION
  // const handleRowClick = async (params) => {
  //   setsingleLeadData(params.row);
  //   handleLeadModelOpen();
  // };
  // EDIT BTN CLICK FUNC
  // const HandleEditFunc = async (params) => {
  //   setsingleLeadData(params.row);
  //   handleUpdateLeadModelOpen();
  // };
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
            id="select-page-size-label"
            value={{ label: pageState.pageSize, value: pageState.pageSize }}
            onChange={handleRangeChange}
            options={[14, 30, 50, 75, 100].map((size) => ({
              label: size,
              value: size,
            }))}
            className="min-w-[60px] my-2"
            menuPortalTarget={document.body}
            styles={pageStyles(currentMode, primaryColor)}
          />

          {/* <Select
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
          </Select> */}

          <Pagination
            sx={{
              "& .Mui-selected": {
                backgroundColor: `${primaryColor} !important`,
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
  const handleClick = (event) => {
    setOpen(!open);
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    // const getManagers = async () => {
    //   const token = localStorage?.getItem("auth-token");
    //   try {
    //     const res = await axios.get(`${BACKEND_URL}/managers`, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + token,
    //       },
    //     });
    //     setManagers(res?.data?.managers);
    //     console.log(res, "response of manager");
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // const getAgents = async () => {
    //   let token = localStorage?.getItem("auth-token");
    //   try {
    //     const res = await axios.get(`${BACKEND_URL}/agents?isParent=132`, {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: "Bearer " + token,
    //       },
    //     });
    //     setAgents(res?.data?.agents?.data);
    //     console.log("agents", res?.data?.agents);
    //   } catch (error) {
    //     console.log("agents can't be fetched error", error);
    //   }
    // };
    // getManagers();
    // getAgents();
  }, []);
  const handleDateRange = (newValue, type) => {
    const formattedDate = moment(newValue?.$d).format("YYYY-MM-DD");

    if (type === "start") {
      setFiltersData((filtersData) => ({
        ...filtersData,
        startDate: formattedDate,
      }));
    } else {
      setFiltersData((filtersData) => ({
        ...filtersData,
        endDate: formattedDate,
      }));
    }
  };

  useEffect(() => {
    const filterItems = async () => {
      let token = localStorage?.getItem("auth-token");
      setpageState((old) => ({
        ...old,
        isLoading: true,
      }));

      try {
        const filterParams = (params) => {
          return Object.fromEntries(
            Object.entries(params).filter(
              ([_, value]) => value !== null && value !== ""
            )
            // .map(([key, value]) => {
            //   const validKeys = [
            //     "pdc_status",
            //     "comm_status",
            //     "invoice_status",
            //     "spa_status",
            //   ];
            //   if (validKeys.includes(key) && value == 0) {
            //     return [key, "null"];
            //   }
            //   return [key, value];
            // })
          );
        };

        const result = await axios?.get(
          `${BACKEND_URL}/closedDeals`,

          {
            params: filterParams({
              managerAssigned: filtersData?.managerAssigned?.value,
              agentAssigned: filtersData?.agentAssigned?.value,
              unit: filtersData?.unit,
              startDate: filtersData?.startDate,
              endDate: filtersData?.endDate,
              leadName: filtersData?.leadName,
              leadSource: filtersData?.leadSource?.value,
              pdc_status: filtersData?.pdc_status,
              spa_status: filtersData?.spa_status,
              invoice_status: filtersData?.invoice_status,
              comm_status: filtersData?.comm_status,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        if (result?.data.message == "Success") {
          let rowsDataArray = "";
          if (result.data.leads.current_page > 1) {
            const theme_values = Object.values(result.data.leads.data);
            rowsDataArray = theme_values;
          } else {
            rowsDataArray = result.data.leads.data;
          }

          let rowsdata = rowsDataArray.map((row, index) => ({
            id:
              pageState.page > 1
                ? pageState.page * pageState.pageSize -
                  (pageState.pageSize - 1) +
                  index
                : index + 1,
            dealDate: row?.dealDate || "-",
            leadName: row?.leadName || "-",
            userName: row?.userName ? row?.userName : "-",
            project: row?.project || "-",
            enquiryType: row?.enquiryType || "-",
            leadType: row?.leadType || "-",
            otp:
              row?.otp === "No OTP" || row?.otp === "No OTP Used"
                ? "No OTP Used"
                : row?.otp || "No OTP Used",
            leadSource: row?.leadSource || "-",
            amount: row?.amount || "-",
            lid: row?.id,
            leadId: row?.leadId,
            unit: row?.unit,
            currency: row?.currency,
            booking_date: row?.booking_date,
            booking_amount: row?.booking_amount,
            spa_status: row?.spa_status,
            invoice_status: row?.invoice_status,
            comm_status: row?.comm_status,
            agent_comm_status: row?.agent_comm_status,
            manager_comm_status: row?.manager_comm_status,
            pdc_status: row?.pdc_status,
            comm_percent: row?.comm_percent || 0,
            comm_amount: row?.comm_amount || 0,
            vat: row?.vat || 0,
            agent_comm_percent: row?.agent_comm_percent || 0,
            agent_comm_amount: row?.agent_comm_amount || 0,
            manager_comm_percent: row?.manager_comm_percent || 5,
            manager_comm_amount: row?.manager_comm_amount || 0,
            managerId: row?.managerId,
            salesId: row?.salesId,
            closedBy: row?.closedBy,
            discount_amount: row?.discount_amount || 0,
            discount_percent: row?.discount_percent || 0,
            cashback_amount: row?.cashback_amount || 0,
            cashback_percent: row?.cashback_percent || 0,
            passport: row?.passport,
            tax_invoice: row?.tax_invoice || null,
          }));

          setpageState((old) => ({
            ...old,
            isLoading: false,
            data: rowsdata,
            from: result.data.leads.from,
            to: result.data.leads.to,
            pageSize: result.data.leads.per_page,
            total: result.data.leads.total,
          }));
        }

        console.log(result, "response of closed deals");
      } catch (error) {
        console.log("error occured while fetching closed deals api", error);
      } finally {
        setpageState((old) => ({
          ...old,
          isLoading: false,
        }));
      }
    };
    filterItems();
  }, [filtersData]);

  let allAgents = [];

  if (User?.role === 1 || User?.role === 2 || User?.role === 8) {
    allAgents = agents[`manager-${filtersData?.managerAssigned?.value}`];
  } else {
    allAgents = agents[`manager-${User?.id}`];
  }

  return (
    <div className="pb-10">
      <div
        className={`fixed top-20 flex flex-col items-end ${
          isLangRTL(i18n.language) ? "left-0" : "right-0"
        }`}
        style={{
          zIndex: 10,
        }}
      >
        <button
          onClick={(e) => {
            handleClick(e);
          }}
          sx={{
            zIndex: "40",
            "& svg path": {
              stroke: "white !important",
            },
            color: "white",
          }}
          className={`w-fit bg-primary text-white py-2 px-3 ${
            isLangRTL(i18n.language)
              ? "left-0 rounded-r-full"
              : "right-0 rounded-l-full"
          }`}
        >
          {open ? (
            <div className="flex items-center">
              <BsX size={18} color={"white"} />
            </div>
          ) : (
            <div className="flex items-center">
              <BsFilterCircle size={18} color={"white"} />
            </div>
          )}
        </button>
        {open && (
          <div
            className={`p-2 mx-2 my-2 rounded-xl ${
              currentMode === "dark"
                ? "blur-bg-black text-white"
                : "blur-bg-white text-black"
            }`}
          >
            <div
              className="overflow-y-scroll hide-scrollbar p-2"
              style={{
                minWidth: "200px",
                minHeight: "150px",
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            >
              <h3 className="text-primary text-center font-semibold mb-5">
                {` ${t("btn_filters")}`}
              </h3>
              <div className="flex flex-col w-full mb-4">
                {hasPermission("search_manager_filter") && (
                  <Select
                    id="Manager Assigned"
                    options={managers?.map((manager) => ({
                      value: manager.id,
                      label: manager?.userName,
                    }))}
                    value={filtersData?.managerAssigned}
                    onChange={(e) => {
                      setFiltersData((filtersData) => ({
                        ...filtersData,
                        managerAssigned: e,
                        agentAssigned: null,
                      }));
                    }}
                    placeholder={t("label_manager")}
                    // className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                )}
                {/* CATEGORY */}
                {hasPermission("search_agent_filter") && (
                  <Select
                    id="agentAssigned"
                    // options={agents?.map((agent) => ({
                    //   value: agent.id,
                    //   label: agent.userName,
                    // }))}
                    options={allAgents
                      ?.filter((agent) => agent.role === 7)
                      .map((agent) => ({
                        value: agent?.id,
                        label: agent?.userName,
                      }))}
                    value={filtersData?.agentAssigned}
                    onChange={(e) => {
                      setFiltersData((filtersData) => ({
                        ...filtersData,
                        agentAssigned: e,
                      }));
                    }}
                    placeholder={t("label_agent")}
                    // className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                )}

                {hasPermission("search_leadSource_filter") && (
                  <Select
                    id="Lead Source"
                    options={source_options(t)}
                    value={filtersData?.leadSource}
                    onChange={(e) => {
                      setFiltersData({
                        ...filtersData,
                        leadSource: {
                          label: e?.label,
                          value: e?.value?.toLowerCase(),
                        },
                      });
                    }}
                    placeholder={t("lead_source")}
                    // className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                )}

                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language) ? "right" : "left",
                    },
                  }}
                >
                  <TextField
                    id="unit-filter"
                    aria-label="unit filter"
                    type={"number"}
                    label={t("unit")}
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    variant="outlined"
                    size="small"
                    value={filtersData?.unit}
                    onChange={(e) =>
                      setFiltersData((filtersData) => ({
                        ...filtersData,
                        unit: e?.target?.value,
                      }))
                    }
                  />
                  <TextField
                    id="LeadName"
                    aria-label="Lead Name"
                    type={"text"}
                    label={t("label_lead_name")}
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    variant="outlined"
                    size="small"
                    value={filtersData?.leadName}
                    onChange={(e) =>
                      setFiltersData((filtersData) => ({
                        ...filtersData,
                        leadName: e?.target?.value,
                      }))
                    }
                  />
                  <div className="grid grid-cols-2 gap-4 items-center">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={filtersData?.startDate}
                        label={t("start_date")}
                        views={["day", "month", "year"]}
                        onChange={(val) => handleDateRange(val, "start")}
                        format="DD-MM-YYYY"
                        renderInput={(params) => (
                          <TextField
                            sx={{
                              "& input": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "& .MuiSvgIcon-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              // "& .MuiOutlinedInput-notchedOutline": {
                              //   borderColor:
                              //     fieldErrors?.date === true &&
                              //     "#DA1F26 !important",
                              // },
                              marginBottom: "20px",
                            }}
                            fullWidth
                            size="small"
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={filtersData?.endDate}
                        label={t("end_date")}
                        views={["day", "month", "year"]}
                        minDate={
                          filtersData?.startDate && filtersData?.startDate
                        }
                        onChange={(val) => handleDateRange(val)}
                        format="DD-MM-YYYY"
                        renderInput={(params) => (
                          <TextField
                            sx={{
                              "& input": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              "& .MuiSvgIcon-root": {
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              },
                              // "& .MuiOutlinedInput-notchedOutline": {
                              //   borderColor:
                              //     fieldErrors?.date === true &&
                              //     "#DA1F26 !important",
                              // },
                              marginBottom: "20px",
                            }}
                            fullWidth
                            size="small"
                            {...params}
                            onKeyDown={(e) => e.preventDefault()}
                            readOnly={true}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </Box>
                <div
                  className={`${isLangRTL(i18n?.language) ? "ml-3" : ""}   ${
                    currentMode === "dark" ? " text-white" : " text-black"
                  }`}
                >
                  <Box
                    sx={{
                      // color: currentMode === "dark" ? "white" : "black",
                      "& .MuiFormLabel-root": {
                        color: currentMode === "dark" ? " white" : " black", // Set the desired color here
                      },
                      "& .MuiRadio-root": {
                        color: currentMode === "dark" ? " white" : " black", // Set the desired color for RadioGroup here
                      },
                    }}
                  >
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: currentMode === "dark" ? " white" : "black",
                      }}
                    >
                      <FormLabel id="demo-controlled-radio-buttons-group">
                        {`${t("pdc")} ${t("status")}`}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={filtersData?.pdc_status}
                        onChange={(e) =>
                          setFiltersData((filtersData) => ({
                            ...filtersData,
                            pdc_status: e?.target?.value,
                          }))
                        }
                        row
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={t("marked")}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={t("pending")}
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormLabel id="demo-controlled-radio-buttons-group">
                        {`${t("spa")} ${t("status")}`}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={filtersData?.spa_status}
                        onChange={(e) =>
                          setFiltersData((filtersData) => ({
                            ...filtersData,
                            spa_status: e?.target?.value,
                          }))
                        }
                        row
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={t("marked")}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={t("pending")}
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormLabel id="demo-controlled-radio-buttons-group">
                        {`${t("invoice")} ${t("status")}`}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={filtersData?.invoice_status}
                        onChange={(e) =>
                          setFiltersData((filtersData) => ({
                            ...filtersData,
                            invoice_status: e?.target?.value,
                          }))
                        }
                        row
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={t("marked")}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={t("pending")}
                        />
                      </RadioGroup>
                    </FormControl>
                    <FormControl
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormLabel id="demo-controlled-radio-buttons-group">
                        {`${t("commission")} ${t("status")}`}
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={filtersData?.comm_status}
                        onChange={(e) =>
                          setFiltersData((filtersData) => ({
                            ...filtersData,
                            comm_status: e?.target?.value,
                          }))
                        }
                        row
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label={t("marked")}
                        />
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label={t("pending")}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>

                {/* CLEAR BUTTON */}
                <Button
                  variant="contained"
                  size="lg"
                  className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                  style={{
                    // backgroundColor: "#111827",
                    color: "#ffffff",
                    // border: "1px solid #DA1F26",
                  }}
                  // component="span"
                  // disabled={setBtnLoading ? true : false}
                  onClick={() => {
                    setFiltersData({
                      leadSource: null,
                      agentAssigned: null,
                      managerAssigned: null,
                      unit: "",
                      leadName: "",
                      startDate: null,
                      endDate: null,
                      pdc_status: "",
                      spa_status: "",
                      invoice_status: "",
                      comm_status: "",
                    });
                  }}
                >
                  <span>{t("clear_all")}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Box
        className={`closed-datatable ${currentMode}-mode-datatable`}
        sx={{
          ...DataGridStyles,
          position: "relative",
          marginBottom: "50px",
          width: "100%",
        }}
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
          autoHeight
          rows={pageState.data}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[30, 50, 75, 100]}
          pagination
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
            User?.role === 1 || User?.role === 8 ? columns : otherColumns
          }
          // columns={columns?.filter((c) =>
          //   hasPermission("leads_col_" + c?.field)
          // )}
          components={{
            Toolbar: GridToolbar,
            Pagination: CustomPagination,
          }}
          componentsProps={{
            toolbar: {
              printOptions: { disableToolbarButton: User?.role !== 1 },
              csvOptions: { disableToolbarButton: User?.role !== 1 },
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
            // "& .MuiDataGrid-main": {
            //   overflowY: "inherit",
            //   height: "auto",
            // },
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
      </Box>
      {UpdateLeadModelOpen && (
        <UpdateClosedLead
          LeadModelOpen={UpdateLeadModelOpen}
          setLeadModelOpen={setUpdateLeadModelOpen}
          handleLeadModelOpen={handleUpdateLeadModelOpen}
          handleLeadModelClose={handleUpdateLeadModelClose}
          LeadData={singleLeadData}
          BACKEND_URL={BACKEND_URL}
          FetchLeads={FetchLeads}
        />
      )}

      {timelineModelOpen && (
        <Timeline
          timelineModelOpen={timelineModelOpen}
          handleCloseTimelineModel={() => setTimelineModelOpen(false)}
          LeadData={singleLeadData}
        />
      )}

      {dealHisotryModel && (
        <DealHistory
          dealHistoryModel={dealHisotryModel}
          handleCloseDealHistory={() => setDealHistoryModel(false)}
          LeadData={singleLeadData}
          FetchLeads={FetchLeads}
        />
      )}
    </div>
  );
};

export default Closedeals;
