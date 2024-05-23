import { useEffect, useState } from "react";
import moment from "moment/moment";

import { Pagination, Tooltip } from "@mui/material";
import Select from "react-select";
import { Box, maxWidth } from "@mui/system";
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

const Closedeals = ({ pageState, setpageState }) => {
  // eslint-disable-next-line
  const [singleLeadData, setsingleLeadData] = useState();
  const {
    currentMode,
    DataGridStyles,
    BACKEND_URL,
    User,
    isArabic,
    primaryColor,
    t,
  } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [pageRange, setPageRange] = useState();
  const { hasPermission } = usePermission();

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);
  const [dealHisotryModel, setDealHistoryModel] = useState(false);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);
  const handleUpdateLeadModelClose = () => {
    setUpdateLeadModelOpen(false);
  };

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

  const columns = [
    // SOURCE
    {
      field: "leadSource",
      headerName: t("label_source"),
      flex: 1,
      minWidth: 40,
      headerAlign: "center",
      renderCell: (cellValues) => renderSourceIcons(cellValues, currentMode),
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
    // DEAL DATE
    {
      field: "dealDate",
      headerName: t("label_deal_date"),
      minWidth: 75,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
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
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => renderOTPIcons(cellValues, currentMode),
    },
    //PDC
    {
      field: "pdc_status",
      headerName: t("pdc"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.pdc_status === 1 ? (
              <p
                className={`
                   text-[#1C1C1C] bg-green-600
                rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <FaCheck size={14} color="white" />
              </p>
            ) : (
              <p
                className={` text-[#1C1C1C] bg-red-600
              rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <RxCross2 size={14} color="#ffffff" />
              </p>
            )}
          </div>
        );
      },
    },
    // SPA
    {
      field: "spa_status",
      headerName: t("spa"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.spa_status === 1 ? (
              <p
                className={`
                   text-[#1C1C1C] bg-green-600
                rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <FaCheck size={14} color="white" />
              </p>
            ) : (
              <p
                className={` text-[#1C1C1C] bg-red-600
              rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <RxCross2 size={14} color="#ffffff" />
              </p>
            )}
          </div>
        );
      },
    },
    // COMMISSION
    {
      field: "comm_status",
      headerName: t("short_commission"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.comm_status === 1 ? (
              <Tooltip title="Received from Developer" arrow>
                <p
                  className={`
                   text-[#1C1C1C] bg-green-600 rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <FaCheck size={14} color="white" />
                </p>
              </Tooltip>
            ) : (
              <Tooltip title="Pending from Developer" arrow>
                <p
                  className={` text-[#1C1C1C] bg-red-600 rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <RxCross2 size={14} color="#ffffff" />
                </p>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    // AGENT COMMISSION
    {
      field: "agent_comm_status",
      headerName: t("agent_comm"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.agent_comm_status === 1 ? (
              <Tooltip title="Sent to Agent" arrow>
                <p
                  className={`
                   text-[#1C1C1C] bg-green-600
                rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <FaCheck size={14} color="white" />
                </p>
              </Tooltip>
            ) : (
              <Tooltip title="Pending Commission for Agent" arrow>
                <p
                  className={` text-[#1C1C1C] bg-red-600
              rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <RxCross2 size={14} color="#ffffff" />
                </p>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      field: "",
      headerName: t("label_action"),
      minWidth: 100,
      maxWidth: 200,
      flex: 1,
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
              className={`${currentMode === "dark"
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
              className={`${currentMode === "dark"
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
                className={`${currentMode === "dark"
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
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => renderOTPIcons(cellValues, currentMode),
    },
    //PDC
    {
      field: "pdc_status",
      headerName: t("pdc"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.pdc_status === 1 ? (
              <p
                className={`
                   text-[#1C1C1C] bg-green-600
                rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <FaCheck size={14} color="white" />
              </p>
            ) : (
              <p
                className={` text-[#1C1C1C] bg-red-600
              rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <RxCross2 size={14} color="#ffffff" />
              </p>
            )}
          </div>
        );
      },
    },
    // SPA
    {
      field: "spa_status",
      headerName: t("spa"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.spa_status === 1 ? (
              <p
                className={`
                   text-[#1C1C1C] bg-green-600
                rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <FaCheck size={14} color="white" />
              </p>
            ) : (
              <p
                className={` text-[#1C1C1C] bg-red-600
              rounded-full shadow-none p-1.5 mr-1 flex items-center`}
              >
                <RxCross2 size={14} color="#ffffff" />
              </p>
            )}
          </div>
        );
      },
    },
    // COMMISSION
    {
      field: "comm_status",
      headerName: t("commission"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.comm_status === 1 ? (
              <Tooltip title="Received from Developer" arrow>
                <p
                  className={`
                   text-[#1C1C1C] bg-green-600 rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <FaCheck size={14} color="white" />
                </p>
              </Tooltip>
            ) : (
              <Tooltip title="Pending from Developer" arrow>
                <p
                  className={` text-[#1C1C1C] bg-red-600 rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <RxCross2 size={14} color="#ffffff" />
                </p>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    // AGENT COMMISSION
    {
      field: "agent_comm_status",
      headerName: t("agent_comm"),
      minWidth: 30,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        const value = cellValues?.row;
        return (
          <div
            className={`w-full h-full px-1 flex items-center justify-center`}
          >
            {value?.agent_comm_status === 1 ? (
              <Tooltip title="Sent to Agent" arrow>
                <p
                  className={`
                   text-[#1C1C1C] bg-green-600
                rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <FaCheck size={14} color="white" />
                </p>
              </Tooltip>
            ) : (
              <Tooltip title="Pending Commission for Agent" arrow>
                <p
                  className={` text-[#1C1C1C] bg-red-600
              rounded-full shadow-none p-1.5 mr-1 flex items-center`}
                >
                  <RxCross2 size={14} color="#ffffff" />
                </p>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      field: "",
      headerName: t("label_action"),
      minWidth: 80,
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
              className={`${currentMode === "dark"
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
              className={`${currentMode === "dark"
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
                className={`${currentMode === "dark"
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
        `${BACKEND_URL}/closedDeals?page=${pageState.page}&perpage=${pageState.perpage || 14
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
          comm_status: row?.comm_status,
          agent_comm_status: row?.agent_comm_status,
          pdc_status: row?.pdc_status,
          comm_percent: row?.comm_percent,
          comm_amount: row?.comm_amount,
          vat: row?.vat,
          agent_comm_percent: row?.agent_comm_percent,
          agent_comm_amount: row?.agent_comm_amount,
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

  return (
    <div className="pb-10">
      <Box
        className={`closed-datatable ${currentMode}-mode-datatable`}
        sx={{ ...DataGridStyles, position: "relative", marginBottom: "50px" }}
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
          columns={User?.role === 1 ? columns : otherColumns}
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
