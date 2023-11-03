import axios from "../../axoisConfig";
import {
  AiOutlineAppstore,
  AiOutlineEdit,
  AiOutlineTable,
  AiOutlineHistory,
} from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs, Tooltip } from "@mui/material";
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
import ShowLocation from "../../Components/meetings/ShowLocation";
import Timeline from "../timeline";

const Meetings = () => {
  const [loading, setloading] = useState(true);
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    User,
    darkModeColors,
    DataGridStyles,
    primaryColor,
    t,
    themeBgImg,
  } = useStateContext();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [meetingNote, setMeetingNote] = useState(null);
  const [meetingLocation, setMeetingLocation] = useState(null);
  const [singleLeadData, setsingleLeadData] = useState({});
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);

  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    id: null,
  });

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
  };

  console.log("meeting notessss: ", meetingNote);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  const [searchText, setSearchText] = useState("");

  const [tabValue, setTabValue] = useState(0);

  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const handleEditMeeting = ({ row }) => {
    console.log("edit meeting : ");
    console.log("row: ", row);
    console.log("ID: ", row.meetingId);
    if (!row?.meetingId) {
      return;
    }
    setOpenEditModal({
      open: true,
      data: row,
    });
  };

  const handleRowClick = (params, event) => {
    if (!event.target.closest(" .edit_meeting_btn ")) {
      console.log("row clicked :::: ");
      setMeetingNote(params.row.meetingNote);
      setLocationModalOpen(true);
      const { mLat, mLong } = params.row;
      if (!mLat || !mLong) {
        setMeetingLocation({
          lat: "",
          lng: "",
          addressText: "",
        });
      } else {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: Number(mLat), lng: Number(mLong) } },
          (results, status) => {
            if (status === "OK") {
              setMeetingLocation({
                lat: Number(mLat),
                lng: Number(mLong),
                addressText: results[0].formatted_address,
              });
            } else {
              console.log("Getting address failed due to: " + status);
            }
          }
        );
      }
    }
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
    // MEETING DATE
    {
      field: "meetingDate",
      headerName: t("label_meeting_date"),
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
    },
    // MEETING TIME
    {
      field: "meetingTime",
      headerName: t("label_meeting_time"),
      minWidth: 50,
      headerAlign: "center",
      flex: 1,
    },
    // LEAD NAME
    {
      field: "leadName",
      headerName: t("label_lead_name"),
      headerAlign: "center",
      minWidth: 100,
      flex: 1,
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
          <div className="flex flex-col">
            <p>
              {cellValues.row.project === "null" ? "-" : cellValues.row.project}
            </p>
            <p>
              {cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}
            </p>
          </div>
        );
      },
    },
    // PROPERTY
    {
      field: "enquiryType",
      headerName: t("label_property"),
      minWidth: 80,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div className="flex flex-col">
            <p>
              {cellValues.row.enquiryType === "null"
                ? "-"
                : cellValues.row.enquiryType}
            </p>
            <p>
              {cellValues.row.leadType === "null"
                ? "-"
                : cellValues.row.leadType}
            </p>
          </div>
        );
      },
    },
    // STATUS
    {
      field: "meetingStatus",
      headerName: t("status"),
      width: 100,
      flex: 1,
      sortable: false,
      headerAlign: "center",
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <div className="p-1 rounded-md">
            {cellValues.formattedValue === "Attended" && (
              <div
                className={`${
                  currentMode === "dark" ? "bg-green-900" : "bg-green-100"
                } mx-1 w-full h-full flex justify-center items-center text-center font-semibold`}
                style={{ fontSize: 9 }}
              >
                <span className="text-[#238e41] p-1 rounded-md w-24 text-center">
                  {t("status_attended")?.toUpperCase()}
                </span>
              </div>
            )}

            {cellValues.formattedValue === "Cancelled" && (
              <div
                className={`${
                  currentMode === "dark" ? "bg-red-900" : "bg-red-100"
                } p-0 mx-1 w-full h-full flex justify-center items-center text-center font-semibold`}
                style={{ fontSize: 9 }}
              >
                <span className="text-[#DA1F26] p-1 rounded-md w-24 text-center">
                  {t("status_cancelled")?.toUpperCase()}
                </span>
              </div>
            )}

            {cellValues.formattedValue === "Postponed" && (
              <div
                className={`${
                  currentMode === "dark" ? "bg-orange-900" : "bg-orange-100"
                } p-0 mx-1 w-full h-full flex justify-center items-center text-center font-semibold`}
                style={{ fontSize: 9 }}
              >
                <span className="text-[#f27f25] p-1 rounded-md w-24 text-center">
                  {t("status_postponed")?.toUpperCase()}
                </span>
              </div>
            )}

            {cellValues.formattedValue === "Pending" && (
              <div
                className={`${
                  currentMode === "dark" ? "bg-[#424242]" : "bg-gray-200"
                } p-0 mx-1 w-full h-full flex justify-center items-center text-center font-semibold`}
                style={{ fontSize: 9 }}
              >
                <span className="text-[#AAAAAA] p-1 rounded-md w-24 text-center">
                  {t("status_pending")?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        );
      },
    },
    // MEETING BY
    {
      field: "meetingBy",
      headerName: t("label_meeting_by"),
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
    },
    // ACTION
    {
      field: "edit",
      headerName: t("label_action"),
      headerAlign: "center",
      minWidth: "50",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <div
            // className="deleteLeadBtn space-x-2 w-full flex items-center justify-center align-center"
            className={`w-full h-full px-1 flex items-center justify-center edit_meeting_btn`}
          >
            <p
              style={{ cursor: "pointer" }}
              className={`${
                currentMode === "dark"
                  ? "text-[#FFFFFF] bg-[#262626]"
                  : "text-[#1C1C1C] bg-[#EEEEEE]"
              } hover:bg-[#229ed1] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center timelineBtn edit_meeting_btn`}
            >
              <Tooltip title="Edit Meeting" arrow>
                <button
                  className="edit_meeting_btn"
                  onClick={() => handleEditMeeting(cellValues)}
                >
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
              } hover:bg-[#6a5acd] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center timelineBtn`}
            >
              <Tooltip title="View Timeline" arrow>
                <button
                  onClick={() => HandleViewTimeline(cellValues)}
                  className="timelineBtn"
                >
                  <AiOutlineHistory size={16} />
                </button>
              </Tooltip>
            </p>

            {cellValues.row.mLat === "" ? (
              <></>
            ) : (
              <p
                style={{ cursor: "pointer" }}
                className={`${
                  currentMode === "dark"
                    ? "text-[#FFFFFF] bg-[#262626]"
                    : "text-[#1C1C1C] bg-[#EEEEEE]"
                } hover:bg-[#ec9c19] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center `}
              >
                <Tooltip title="View Location" arrow>
                  <button
                    className="meetingBtn"
                    onClick={() =>
                      showLocation(cellValues.row.mLat, cellValues.row.mLong)
                    }
                  >
                    <MdOutlineLocationOn size={16} />
                  </button>
                </Tooltip>
              </p>
            )}
          </div>
        );
      },
    },
  ];

  const showLocation = (mLat, mLong) => {
    setLocationModalOpen(true);
    if (!mLat || !mLong) {
      setMeetingLocation({
        lat: "",
        lng: "",
        addressText: "",
      });
    } else {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat: Number(mLat), lng: Number(mLong) } },
        (results, status) => {
          if (status === "OK") {
            setMeetingLocation({
              lat: Number(mLat),
              lng: Number(mLong),
              addressText: results[0].formatted_address,
            });
          } else {
            console.log("Getting address failed due to: " + status);
          }
        }
      );
    }
  };

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
          leadName: row?.leadName || "-",
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          leadFor: row?.leadFor || "-",
          leadId: row?.lead_id,
          meetingDate: row?.meetingDate || "-",
          meetingBy: row?.userName || "-",
          meetingTime: row?.meetingTime || "-",
          meetingStatus: row?.meetingStatus || "-",
          mLat: row?.mLat,
          mLong: row?.mLong,
          meetingLocation: row?.meetingLocation || "-",
          meetingNote: row?.meetingNote || "No Notes",
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

  // const DataGridStyles = {
  //   "& .MuiButtonBase-root": {
  //     color: "white",
  //   },
  //   // TOOLBAR
  //   "& .MuiDataGrid-toolbarContainer": {
  //     backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
  //     paddingTop: "10px",
  //     paddingBottom: "10px",
  //     paddingLeft: "20px",
  //     paddingRight: "20px",
  //   },

  //   "& .MuiDataGrid-cell[data-field='meetingTime']": {
  //     display: "flex",
  //     justifyContent: "center",
  //   },
  //   "& .MuiInputBase-root": {
  //     color: "white",
  //   },
  //   "& .MuiInputBase-root::before": {
  //     color: "white",
  //   },
  //   "& .MuiInputBase-root:hover::before": {
  //     color: "white",
  //   },

  //   // Background color of header of data grid
  //   "& .MuiDataGrid-columnHeaders": {
  //     border: "none",
  //     backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
  //     color: currentMode === "dark" ? "white" : "white",
  //   },
  //   "& .MuiIconButton-sizeSmall": {
  //     color: currentMode === "dark" ? "white" : "white",
  //   },
  //   // background color of main table content
  //   "& .MuiDataGrid-virtualScroller": {
  //     backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
  //     color: currentMode === "dark" ? "white" : "black",
  //   },
  //   // changing rows hover color
  //   "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-root":
  //     {
  //       backgroundColor: currentMode === "dark" && "#000000",
  //       border: "none !important",
  //     },
  //   // changing row colors
  //   " .even": {
  //     backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
  //   },
  //   // changing rows right border
  //   // "& .MuiDataGrid-cell": {
  //   //   borderRight: "1px solid rgb(240, 240, 240)",
  //   // },
  //   // BACKGROUND COLOR OF FOOTER
  //   "& .MuiDataGrid-footerContainer": {
  //     borderTop: "none",
  //     backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
  //     color: "white",
  //   },
  //   "& .MuiTablePagination-selectLabel": {
  //     color: "white",
  //   },
  //   "& .MuiTablePagination-select ": { color: "white" },
  //   "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
  //   "& .MuiTablePagination-displayedRows": { color: "white" },
  //   // For inner data styling
  //   "& .MuiDataGrid-virtualScrollerRenderZone": {
  //     // backgroundColor: "red",
  //   },
  // };

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <>
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
          onChange={(event, value) => apiRef.current.setPage(value - 1)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-4 ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div className="flex justify-between">
              <div className="flex items-center pb-3">
                <div className="bg-primary h-10 w-1 rounded-full"></div>
                <h1
                  className={`text-lg font-semibold mx-2 uppercase ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("menu_meetings")}
                  {" "}
                  <span className="bg-primary text-white px-3 py-1 rounded-sm my-auto">
                    {pageState?.total}
                  </span>
                </h1>
              </div>

              <Box
                sx={{
                  ...darkModeColors,
                  "& .MuiTabs-indicator": {
                    borderRadius: "5px",
                  },
                  "& .Mui-selected": {
                    color: "white",
                    zIndex: "1",
                  },
                  "& .MuiSvgIcon-root": {
                    // Customize icon styles here
                    color: primaryColor,
                  },
                }}
                className={`rounded-md overflow-hidden`}
              >
                <Tabs value={value} onClick={handleChange} variant="standard">
                  <Tab
                    icon={
                      <AiOutlineTable
                        size={22}
                        style={{
                          color: currentMode === "dark" ? "#ffffff" : "#000000",
                        }}
                      />
                    }
                  />
                  <Tab
                    icon={
                      <AiOutlineAppstore
                        size={22}
                        style={{
                          color: currentMode === "dark" ? "#ffffff" : "#000000",
                        }}
                      />
                    }
                  />
                </Tabs>
              </Box>
            </div>

            <div className="mt-3 pb-3">
              <TabPanel value={value} index={0}>
                <Box
                  width={"100%"}
                  className={`${currentMode}-mode-datatable`}
                  sx={DataGridStyles}
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
                    onRowClick={handleRowClick}
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
                        printOptions: {
                          disableToolbarButton: User?.role !== 1,
                        },
                        csvOptions: {
                          disableToolbarButton: User?.role !== 1,
                        },
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
              <TabPanel value={value} index={1}>
                <GridMeeting
                  isLoading={loading}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  pageState={pageState}
                  setpageState={setpageState}
                />
              </TabPanel>
            </div>
          </div>
        )}
        {meetingLocation !== null && locationModalOpen ? (
          <ShowLocation
            isModalOpened={locationModalOpen}
            meetingLocation={meetingLocation}
            meetingNote={meetingNote}
            handleModalClose={() => {
              setLocationModalOpen(false);
              setMeetingLocation(null);
            }}
          />
        ) : (
          <></>
        )}

        {timelineModelOpen && (
          <Timeline
            timelineModelOpen={timelineModelOpen}
            handleCloseTimelineModel={() => setTimelineModelOpen(false)}
            LeadData={singleLeadData}
          />
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
