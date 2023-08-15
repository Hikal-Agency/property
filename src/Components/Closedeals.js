import { Button } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useStateContext } from "../context/ContextProvider";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";

import { MenuItem, Pagination, Select } from "@mui/material";
import { Box } from "@mui/system";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import axios from "../axoisConfig";
import UpdateClosedLead from "./Leads/UpdateClosedLead";
import Timeline from "../Pages/timeline";


import { 
  AiOutlineEdit, 
  AiOutlineHistory 
} from "react-icons/ai";
import { MdCampaign } from "react-icons/md";
import { 
  FaSnapchatGhost, 
  FaFacebookF,
  FaRegUser,
  FaWhatsapp,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaRegComments
} from "react-icons/fa";
import { 
  BiImport,
  BiMessageRoundedDots,
  BiArchive
} from "react-icons/bi";
import {
  BsPersonCircle, 
  BsSnow2 
} from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { GiMagnifyingGlass } from "react-icons/gi";
import { TbWorldWww } from "react-icons/tb";

const Closedeals = ({ pageState, setpageState }) => {
  // eslint-disable-next-line
  const [singleLeadData, setsingleLeadData] = useState();
  const navigate = useNavigate();
  const { currentMode, DataGridStyles, BACKEND_URL, User, isArabic } = useStateContext();
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
    const value = e.target.value;

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
      headerName: "Src",
      flex: 1,
      minWidth: 40,
      headerAlign: "center",
      renderCell: (cellValues) => {
        const sourceIcons = {
          "campaign snapchat": () => 
            <FaSnapchatGhost 
            size={16} 
            color={"#f6d80a"} 
            className="p-1"  />,

          "campaign facebook": () => 
            <FaFacebookF
            size={16} 
            color={"#0e82e1"} 
            className="p-1"  />,

          "campaign tiktok": () => 
            <FaTiktok 
            size={16} 
            color={`${ currentMode === "dark" ? "#ffffff" : "#000000" }`} 
            className="p-1"  />,

          "campaign googleads": () => 
            <FcGoogle 
            size={16}
            className="p-1" />,
            
          "campaign youtube": () => 
            <FaYoutube 
            size={16} 
            color={"#FF0000"}
            className="p-1" />,

          "campaign twitter": () => 
            <FaTwitter 
            size={16} 
            color={"#00acee"}
            className="p-1" />,

          "bulk import": () => 
            <BiImport 
            size={16} 
            color={"#da1f26"} 
            className="p-1"  />,

            "property finder": () =>
              <GiMagnifyingGlass 
              size={16} 
              color={"#ef5e4e"}
              className="p-1" />,

          campaign: () => 
            <MdCampaign 
            size={16} 
            color={"#696969"}
            className="p-0.5" />,

          cold: () => 
            <BsSnow2 
            size={16} 
            color={"#0ec7ff"}
            className="p-1" />,

          personal: () => 
            <BsPersonCircle 
            size={16} 
            color={"#0ec7ff"}
            className="p-1" />,

          whatsapp: () => 
            <FaWhatsapp 
            size={16} 
            color={"#53cc60"}
            className="p-1" />,

          message: () => 
            <BiMessageRoundedDots 
            size={16} 
            color={"#6A5ACD"}
            className="p-0.5" />,

          comment: () => 
            <FaRegComments 
            size={16} 
            color={"#a9b3c6"}
            className="p-0.5" />,

          website: () => 
            <TbWorldWww 
            size={16} 
            color={"#AED6F1"}
            className="p-0.5" />,
          
          self: () =>
            <FaRegUser 
            size={16} 
            color={"#6C7A89"}
            className="p-1" />,
        };
        return (
          <>
            <div className="flex items-center justify-center">
              {cellValues.row.leadSource?.toLowerCase().startsWith("warm") ? (
                <BiArchive
                  style={{
                    width: "50%",
                    height: "50%",
                    margin: "0 auto",
                  }}
                  size={16}
                  color={"#AEC6CF"}
                  className="p-0.5"
                />
              ) : (
                <Box
                  sx={{
                    "& svg": {
                      width: "50%",
                      height: "50%",
                      margin: "0 auto",
                    },
                  }}
                >
                  {sourceIcons[cellValues.row.leadSource?.toLowerCase()]
                    ? sourceIcons[cellValues.row.leadSource?.toLowerCase()]()
                    : "-"}
                </Box>
              )}
            </div>
          </>
        );
      },
    },
    // LEAD NAME 
    {
      field: "leadName",
      headerName: "Lead name",
      minWidth: 100,
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
    // PROJECT 
    {
      field: "project",
      headerName: "Project",
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
            <p>{cellValues.row.project}</p>
            <p>{cellValues.row.leadFor}</p>
          </div>
        );
      },
    },
    // ENQUIRY 
    {
      headerAlign: "center",
      field: "leadType",
      headerName: "Property",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>{cellValues.row.enquiryType}</p>
            <p>{cellValues.row.leadType}</p>
          </div>
        );
      },
    },
    // AMOUNT 
    {
      field: "amount",
      headerAlign: "center",
      headerName: "Amount (AED)",
      minWidth: 80,
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <span className="font-semibold text-red-600">
            AED {cellValues.formattedValue}
          </span>
        )
      }
    },
    // DEAL DATE
    {
      field: "dealDate",
      headerName: "Deal date",
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    // CONSULTANT 
    {
      field: "userName",
      headerAlign: "center",
      headerName: "Consultant",
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
      headerName: "OTP",
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="p-1 rounded-md">
            {cellValues.formattedValue === "Verified" && (
              <div className={`${ currentMode === "dark" ? "bg-green-900" : "bg-green-100"} mx-1 w-full h-full flex justify-center items-center text-center font-semibold`} style={{ fontSize: 9 }}>
                <span className="text-[#238e41] p-1 rounded-md w-24 text-center">
                  VERIFIED
                </span>
              </div>
            )}

            {cellValues.formattedValue === "Not Verified" && (
              <div className={`${ currentMode === "dark" ? "bg-red-900" : "bg-red-100"} p-0 mx-1 w-full h-full flex justify-center items-center text-center font-semibold`} style={{ fontSize: 9 }}>
                <span className="text-[#DA1F26] p-1 rounded-md w-24 text-center">
                  UNVERIFIED
                </span>
                {/* </div> */}
              </div>
            )}
            
            {cellValues.formattedValue !== "Not Verified" && cellValues.formattedValue !== "Verified" && (
              <div className={`${ currentMode === "dark" ? "bg-[#424242]" : "bg-gray-200"} p-0 mx-1 w-full h-full flex justify-center items-center text-center font-semibold`} style={{ fontSize: 9 }}>                    
                <span className="text-[#AAAAAA] p-1 rounded-md w-24text-center">
                  NO OTP
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      minWidth: 50,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-center ">
            <Button
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory
                size={16}
                onClick={() => HandleViewTimeline(cellValues)}
              />
            </Button>
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  const otherColumns = [
    {
      field: "dealDate",
      headerName: "Deal date",
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params) => moment(params?.value).format("YYYY-MM-DD"),
    },
    {
      field: "leadName",
      headerName: "Lead name",
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
      headerName: "Project",
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
           renderCell: (cellValues) => {
        return (
          <div className="w-full ">
            <p className="text-center capitalize" style={{fontFamily: isArabic(cellValues?.formattedValue) ? "Noto Kufi Arabic" : "inherit"}}>
              {cellValues?.formattedValue}
            </p>
          </div>
        );
      },
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      headerAlign: "center",

      minWidth: 60,
      flex: 1,
    },
    {
      field: "leadType",
      headerAlign: "center",

      headerName: "Property",
      minWidth: 60,
      flex: 1,
    },

    {
      field: "amount",
      headerAlign: "center",
      headerName: "Amount in AED",
      minWidth: 40,
      flex: 1,
    },
    {
      field: "userName",
      headerAlign: "center",
      headerName: "Property Consultant",
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
      headerName: "Action",
      minWidth: 80,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="space-x-2 w-full flex items-center justify-center ">
            <Button
              // onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineHistory
                size={20}
                onClick={() => HandleViewTimeline(cellValues)}
              />
            </Button>
            <Button
              onClick={() => HandleEditFunc(cellValues)}
              className={`${
                currentMode === "dark"
                  ? "text-white bg-transparent rounded-md p-1 shadow-none "
                  : "text-black bg-transparent rounded-md p-1 shadow-none "
              }`}
            >
              <AiOutlineEdit size={20} />
            </Button>
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

          <p className="text-white mr-3">Rows Per Page</p>

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
                backgroundColor: "white !important",
                color: "black !important",
                borderRadius: "5px !important",
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
