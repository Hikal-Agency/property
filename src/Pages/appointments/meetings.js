import axios from "../../axoisConfig";
import {
  AiOutlineAppstore,
  AiOutlineEdit,
  AiOutlineTable,
  AiOutlineHistory,
} from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import TableMeeting from "../../Components/meetings/TableMeeting";
import { socket } from "../App";
import {
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import Loader from "../../Components/Loader";
import { Tab, Tabs, Tooltip } from "@mui/material";
import { Box, Pagination } from "@mui/material";

import GridMeeting from "../../Components/meetings/GridMeeting";
import UpdateMeeting from "../../Components/meetings/UpdateMeeting";
import ShowLocation from "../../Components/meetings/ShowLocation";
import Timeline from "../timeline";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const Meetings = ({ isInLeads, leadId }) => {
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
    getUserById,
  } = useStateContext();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [meetingLocation, setMeetingLocation] = useState(null);
  const [singleLeadData, setsingleLeadData] = useState({});
  const [meetingNote, setMeetingNote] = useState(null);
  const [timelineModelOpen, setTimelineModelOpen] = useState(false);

  const [tabValue, setTabValue] = useState(0);
  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

  const [openEditModal, setOpenEditModal] = useState({
    open: false,
    id: null,
  });
  useEffect(() => {
    setopenBackDrop(false);
    setloading(false);
    const token = localStorage.getItem("auth-token");
    FetchLeads(token);
    // eslint-disable-next-line
  }, [pageState.page, leadId]);

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
  };

  console.log("meeting notessss: ", meetingNote);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
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
  const handleMeetingModalClose = () => {
    setOpenEditModal({
      open: false,
    });
  };

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
      .get(
        `${BACKEND_URL}/meeting${isInLeads ? "s" : ""}/?page=${pageState.page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          params: {
            leadId: isInLeads ? leadId : null,
          },
        }
      )
      .then((result) => {
        console.log("the meeting leads are ");
        console.log(result.data);
        let rowsDataArray = "";
        if (isInLeads) {
          if (result.data.meetings.current_page > 1) {
            const theme_values = Object.values(result.data.meetings.data);
            rowsDataArray = theme_values;
          } else {
            rowsDataArray = result.data.meetings.data;
          }
        } else {
          if (result.data.leads.current_page > 1) {
            const theme_values = Object.values(result.data.leads.data);
            rowsDataArray = theme_values;
          } else {
            rowsDataArray = result.data.leads.data;
          }
        }

        console.log("rows array is");
        console.log(User, "User is here");

        let rowsdata = rowsDataArray.map((row, index) => {
          if (isInLeads) {
            return {
              id:
                pageState.page > 1
                  ? pageState.page * 15 - 14 + index
                  : index + 1,
              meetingId: row?.id,
              leadName: row?.leadName || "-",
              project: row?.project || "-",
              enquiryType: row?.enquiryType || "-",
              leadType: row?.leadType || "-",
              leadFor: row?.leadFor || "-",
              leadId: row?.leadId,
              meetingDate: row?.meetingDate || "-",
              meetingBy: {
                isOwner: row?.addedBy == User?.id,
                name: getUserById(row?.addedBy)?.userName,
              },
              meetingTime: row?.meetingTime || "-",
              meetingStatus: row?.meetingStatus || "-",
              mLat: row?.mLat,
              mLong: row?.mLong,
              meetingLocation: row?.meetingLocation || "-",
              meetingNote: row?.meetingNote || "No Notes",
            };
          } else {
            return {
              id:
                pageState.page > 1
                  ? pageState.page * 15 - 14 + index
                  : index + 1,
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
            };
          }
        });

        if (isInLeads) {
          setpageState((old) => ({
            ...old,
            isLoading: false,
            data: rowsdata,
            pageSize: result.data.meetings.per_page,
            gridDataSize: result.data.meetings.last_page,
            total: result.data.meetings.total,
          }));
        } else {
          setpageState((old) => ({
            ...old,
            isLoading: false,
            data: rowsdata,
            pageSize: result.data.leads.per_page,
            gridDataSize: result.data.leads.last_page,
            total: result.data.leads.total,
          }));
        }
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
        setpageState((old) => ({
          ...old,
          isLoading: false,
        }));
      });

    // fetch meetings that are in future
    axios
      .get(`${BACKEND_URL}/meetings/future`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("future meetings are ", result);
        socket.emit("get_all_meetings", result?.data);
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

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

  const Additional = () => {
    return (
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
        {!isInLeads && (
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
            (
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
            )
          </Tabs>
        )}
      </Box>
    );
  };

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full p-5 mt-2 ${
              !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
            }`}
          >
            <HeadingTitle
              title={t("menu_meetings")}
              counter={pageState?.total}
              additional={<Additional />}
            />

            <div className="mt-1 pb-5">
              <TabPanel value={value} index={0}>
                <Box
                  width={"100%"}
                  className={`${currentMode}-mode-datatable`}
                  sx={DataGridStyles}
                >
                  <TableMeeting
                    setpageState={setpageState}
                    pageState={pageState}
                    setMeetingLocation={setMeetingLocation}
                    setLocationModalOpen={setLocationModalOpen}
                    setOpenEditModal={setOpenEditModal}
                    setTimelineModelOpen={setTimelineModelOpen}
                    setsingleLeadData={setsingleLeadData}
                    isInLeads={isInLeads}
                    leadId={leadId}
                    meetingNote={meetingNote}
                    setMeetingNote={setMeetingNote}
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
              {!isInLeads && (
                <TabPanel value={value} index={1}>
                  <GridMeeting
                    isLoading={loading}
                    tabValue={tabValue}
                    setTabValue={setTabValue}
                    pageState={pageState}
                    setpageState={setpageState}
                  />
                </TabPanel>
              )}
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
