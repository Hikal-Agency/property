import { useEffect, useState } from "react";
import moment from "moment/moment";

import { Pagination, Tooltip } from "@mui/material";
import Select from "react-select";
import { Box } from "@mui/system";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import { useStateContext } from "../context/ContextProvider";
import { pageStyles, selectStyles } from "./_elements/SelectStyles";
import axios from "../axoisConfig";
import UpdateClosedLead from "./Leads/UpdateClosedLead";
import Timeline from "../Pages/timeline";

import { AiOutlineEdit, AiOutlineHistory } from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import {
  FaSnapchatGhost,
  FaFacebookF,
  FaRegUser,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaRegComments,
} from "react-icons/fa";
import {
  BiImport,
  BiMessageRoundedDots,
  BiArchive
} from "react-icons/bi";
import {
  BsPersonCircle,
  BsSnow2,
  BsShieldX,
  BsShieldCheck,
  BsShieldMinus
} from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { TbWorldWww } from "react-icons/tb";
import { renderSourceIcons } from "./_elements/SourceIconsDataGrid";
import { renderOTPIcons } from "./_elements/OTPIconsDataGrid";

const Closedeals = ({ pageState, setpageState }) => {
  // eslint-disable-next-line
  const [singleLeadData, setsingleLeadData] = useState();
  const { currentMode, DataGridStyles, BACKEND_URL, User, isArabic, primaryColor, t } =
    useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  const [pageRange, setPageRange] = useState();

  //Update LEAD MODAL VARIABLES
  const [UpdateLeadModelOpen, setUpdateLeadModelOpen] = useState(false);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);
  const handleUpdateLeadModelOpen = () => setUpdateLeadModelOpen(true);
  const handleUpdateLeadModelClose = () => {
    setUpdateLeadModelOpen(false);
  };

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
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
      renderCell: (cellValues) => renderSourceIcons(cellValues, currentMode)
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
            className="flex flex-col"
          >
            <p>{cellValues.row.project === "null" ? "-" : cellValues.row.project}</p>
            <p>{cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}</p>
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
            <p>{cellValues.row.enquiryType === "null" ? "-" : cellValues.row.enquiryType}</p>
            <p>{cellValues.row.leadType === "null" ? "-" : cellValues.row.leadType}</p>
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
              <div className="bg-primary w-full text-white font-semibold rounded-md p-2">
                AED {cellValues.formattedValue}
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
      minWidth: 50,
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
      renderCell: (cellValues) => renderOTPIcons(cellValues, currentMode)
    },
    {
      field: "",
      headerName: t("label_action"),
      minWidth: 50,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          // <div className="space-x-2 w-full flex items-center justify-center ">
          //   <Button
          //     className={`${
          //       currentMode === "dark"
          //         ? "text-white bg-transparent rounded-md p-1 shadow-none "
          //         : "text-black bg-transparent rounded-md p-1 shadow-none "
          //     }`}
          //   >
          //     <AiOutlineHistory
          //       size={16}
          //       onClick={() => HandleViewTimeline(cellValues)}
          //     />
          //   </Button>
          //   <Button
          //     onClick={() => HandleEditFunc(cellValues)}
          //     className={`${
          //       currentMode === "dark"
          //         ? "text-white bg-transparent rounded-md p-1 shadow-none "
          //         : "text-black bg-transparent rounded-md p-1 shadow-none "
          //     }`}
          //   >
          //     <AiOutlineEdit size={16} />
          //   </Button>
          // </div>
          <div className={`w-full h-full px-1 flex items-center justify-center`}>
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
          </div>
        );
      },
    },
  ];

  const otherColumns = [
    {
      field: "dealDate",
      headerName: t("label_deal_date"),
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "leadName",
      headerName: t("label_lead_name"),
      minWidth: 60,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
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
    {
      field: "project",
      headerName: t("label_project"),
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p
              className="text-center capitalize"
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
    {
      field: "enquiryType",
      headerName: t("label_enquiry"),
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
    },
    {
      field: "leadType",
      headerAlign: "center",

      headerName: t("label_property"),
      minWidth: 60,
      flex: 1,
    },
    {
      field: "unit",
      headerAlign: "center",
      headerName: t("label_unit"),
      minWidth: 40,
      flex: 1,
    },
    {
      field: "amount",
      headerAlign: "center",
      headerName: t("label_amount_aed"),
      minWidth: 40,
      flex: 1,
    },
    {
      field: "userName",
      headerAlign: "center",
      headerName: t("label_property_consultant"),
      minWidth: 40,
      flex: 1,
    },
    // {
    //   field: "manager",
    //   headerName: "Manager",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
    // {
    //   field: "salesperson",
    //   headerName: "Agent",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
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
          <div className={`w-full h-full px-1 flex items-center justify-center`}>
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
    </div>
  );
};

export default Closedeals;
