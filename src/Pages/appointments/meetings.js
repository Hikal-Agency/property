import axios from "axios";
import { Button } from "@material-tailwind/react";
import {
  AiOutlineAppstore,
  AiOutlineEdit,
  AiOutlineTable,
} from "react-icons/ai";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import { Box, Pagination } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import GridMeeting from "../../Components/meetings/GridMeeting";
import UpdateMeeting from "../../Components/meetings/UpdateMeeting";

const Meetings = () => {
  const [loading, setloading] = useState(true);
  const { currentMode, setopenBackDrop, BACKEND_URL, darkModeColors } =
    useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    id: null,
  });

  const [value, setValue] = useState(0);
  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  const [searchText, setSearchText] = useState("");

  const [tabValue, setTabValue] = useState(0);

  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const handleEditMeeting = ({ row }) => {
    console.log("ID: ", row.meetingId);
    if (!row?.meetingId) {
      return;
    }
    setOpenEditModal({
      open: true,
      id: row.meetingId,
    });
  };

  const handleMeetingModalClose = () => {
    setOpenEditModal({
      open: false,
    });
  };

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

 const columns = [
    {
      field: "leadName",
      headerName: "Lead name",
      minWidth: 160,
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "leadType",
      headerName: "Property",
      minWidth: 100,
      flex: 1,
    },

    {
      field: "meetingBy",
      headerName: "Meeting By",
      minWidth: 160,
      flex: 1,
    },

    {
      field: "meetingDate",
      headerName: "Date",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "meetingTime",
      headerName: "Time",
      minWidth: 50,
      flex: 1,
    },
    {
      field: "meetingStatus",
      headerName: "Status",
      width: 150,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="text-white w-[100%] flex justify-center">
            {cellValues.formattedValue === "Cancelled" && (
              <div className="w-full h-full flex align-center items-center bg-[#ff0000] rounded-sm">
                CANCELLED
              </div>
            )}

            {cellValues.formattedValue === "Pending" && (
              <div className="w-full h-full flex align-center p-2 items-center bg-[#f27f25] rounded-sm">
                PENDING
              </div>
            )}
            {cellValues.formattedValue === "Postponed" && (
              <div className="w-full h-full flex align-center p-2 items-center bg-[#f27f25] rounded-sm">
                POSTPONED
              </div>
            )}
            {cellValues.formattedValue === "Attended" && (
              <div className="w-full h-full flex align-center p-2 items-center bg-[#0f9d58] rounded-sm">
                ATTENDED
              </div>
            )}
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Actions",
      minWidth: "110",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="deleteLeadBtn space-x-2 w-full flex items-center justify-center align-center">
            <Button
              onClick={() => handleEditMeeting(cellValues)}
              // onClick={() => HandleEditFunc(cellValues)}
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

  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(`${BACKEND_URL}/meeting/?page=${pageState.page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("the meeting leads are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (result.data.leads.current_page > 1) {
          const theme_values = Object.values(result.data.leads.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.leads.data;
        }
        console.log("rows array is");
        console.log(rowsDataArray);

        let rowsdata = rowsDataArray.map((row, index) => ({
          id: pageState.page > 1 ? pageState.page * 15 - 14 + index : index + 1,
          meetingId: row?.id,
          leadName: row?.leadName,
          project: row?.project,
          enquiryType: row?.enquiryType,
          leadType: row?.leadType,
          meetingDate: row?.meetingDate,
          meetingBy: row?.userName,
          meetingTime: row?.meetingTime,
          meetingStatus: row?.meetingStatus,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          pageSize: result.data.leads.per_page,
          gridDataSize: result.data.leads.last_page,
          total: result.data.leads.total,
        }));
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
    // eslint-disable-next-line
  }, [pageState.page]);

  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: "white",
    },
    // TOOLBAR
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
      paddingTop: "10px",
      paddingBottom: "10px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },

    "& .MuiDataGrid-cell[data-field='meetingTime']": {
      display: "flex", 
      justifyContent: "center"
    },
    "& .MuiInputBase-root": {
      color: "white",
    },
    "& .MuiInputBase-root::before": {
      color: "white",
    },
    "& .MuiInputBase-root:hover::before": {
      color: "white",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-root":
      {
        backgroundColor: currentMode === "dark" && "#000000",
        border: "none !important",
      },
    // changing row colors
    " .even": {
      backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    //   borderRight: "1px solid rgb(240, 240, 240)",
    // },
    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      borderTop: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: "white",
    },
    "& .MuiTablePagination-selectLabel": {
      color: "white",
    },
    "& .MuiTablePagination-select ": { color: "white" },
    "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
    "& .MuiTablePagination-displayedRows": { color: "white" },
    // For inner data styling
    "& .MuiDataGrid-virtualScrollerRenderZone": {
      // backgroundColor: "red",
    },
  };

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
    <>
      {/* <Head>
        <title>HIKAL CRM -Meetings</title>
        <meta name="description" content="Meetings - HIKAL CRM" />
      </Head> */}
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className={`w-full`}>
              <div className="pl-3">
                <div className="mt-3 flex justify-between">
                  <h1
                    className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-red-600 font-bold border-red-600"
                    }`}
                  >
                    Meetings{" "}
                    <span className="bg-main-red-color text-white px-2 py-1 rounded-sm my-auto">
                      <span>{pageState?.total}</span>
                    </span>
                  </h1>
                  <Box
                    sx={{
                      ...darkModeColors,
                      "& .MuiTabs-indicator": {
                        borderRadius: "5px",
                        backgroundColor: "#da1f26",
                      },
                      "& .Mui-selected": {
                        color: "white",
                        zIndex: "1",
                      },
                      "& .MuiSvgIcon-root": {
                        // Customize icon styles here
                        color: "red",
                      },
                    }}
                    className={`rounded-md overflow-hidden ${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    }`}
                  >
                    <Tabs
                      value={value}
                      onClick={handleChange}
                      variant="standard"
                    >
                      <Tab
                        icon={
                          value === 0 ? (
                            <AiOutlineAppstore
                              style={{
                                color:
                                  currentMode === "dark"
                                    ? "#ffffff"
                                    : "#000000",
                              }}
                            />
                          ) : (
                            <AiOutlineTable
                              style={{
                                color:
                                  currentMode === "dark"
                                    ? "#ffffff"
                                    : "#000000",
                              }}
                            />
                          )
                        }
                      />
                    </Tabs>
                  </Box>
                </div>

                <div className="mt-3 pb-3">
                  <TabPanel value={value} index={0}>
                    <GridMeeting
                      isLoading={loading}
                      tabValue={tabValue}
                      setTabValue={setTabValue}
                      pageState={pageState}
                      setpageState={setpageState}
                    />
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    <Box width={"100%"} className={`${currentMode}-mode-datatable`} sx={DataGridStyles}>
                      <DataGrid
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
                          setpageState((old) => ({
                            ...old,
                            page: newPage + 1,
                          }));
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setpageState((old) => ({
                            ...old,
                            pageSize: newPageSize,
                          }))
                        }
                        columns={columns}
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
                          "& .MuiDataGrid-cell[data-field='edit'] svg": {
                            color:
                              currentMode === "dark"
                                ? "white !important"
                                : "black !important",
                          },
                        }}
                        getRowClassName={(params) =>
                          params.indexRelativeToCurrentPage % 2 === 0
                            ? "even"
                            : "odd"
                        }
                      />
                    </Box>

                    {openEditModal.open && (
                      <UpdateMeeting
                        FetchLeads={FetchLeads}
                        meetingModalOpen={openEditModal}
                        handleMeetingModalClose={handleMeetingModalClose}
                      />
                    )}
                  </TabPanel>
                </div>
              </div>
            </div>
            {/* <Footer /> */}
          </div>
        )}
      </div>
    </>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Meetings;
