import axios from "../../axoisConfig";
import {
  AiOutlineAppstore,
  AiOutlineEdit,
  AiOutlineTable,
  AiOutlineHistory,
} from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { BsMic, BsMicFill } from "react-icons/bs";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { IoMdSearch } from "react-icons/io";
// import Loader from "../../Components/Loader";
import { Tab, Tabs, Tooltip } from "@mui/material";
import { Box, Pagination } from "@mui/material";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const TableMeeting = ({
  setpageState,
  pageState,
  setMeetingLocation,
  setLocationModalOpen,
  setOpenEditModal,
  setTimelineModelOpen,
  setsingleLeadData,
}) => {
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
  const [meetingNote, setMeetingNote] = useState(null);
  const [isVoiceSearchState, setIsVoiceSearchState] = useState(false);
  const [searchRows, setSearchRows] = useState(pageState?.data);
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition("en");

  useEffect(() => {
    if (isVoiceSearchState && transcript.length > 0) {
      // setSearchTerm(transcript);
      setSearchText(transcript);
      handleSearchChange({ target: { value: transcript } });
    }
    console.log(transcript, "transcript");
  }, [transcript, isVoiceSearchState]);

  useEffect(() => {
    if (isVoiceSearchState) {
      handleSearchChange({ target: { value: "" } });
      resetTranscript();
      setSearchText("");
      startListening();
    } else {
      SpeechRecognition.stopListening();
      console.log(transcript, "transcript...");
      resetTranscript();
    }
  }, [isVoiceSearchState]);
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  function CustomToolbar() {
    useEffect(() => {
      searchRef?.current?.focus();
    }, [searchText]);

    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
            button: { variant: "outlined" },
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <div className="flex items-center border-b-[1px] border-b-black gap-2">
          <div>
            <IoMdSearch size={22} />
          </div>
          <input
            ref={searchRef}
            type="text"
            className=" focus:outline-none h-full bg-transparent text-[12px]"
            placeholder="Search"
            onChange={handleSearchChange}
            value={searchText}
          />
          <div
            // ref={searchContainer}
            className={`${isVoiceSearchState ? "listening bg-primary" : ""} ${
              currentMode === "dark" ? "text-white" : "text-black"
            } rounded-full cursor-pointer hover:bg-gray-500 p-1`}
            onClick={() => {
              setIsVoiceSearchState(!isVoiceSearchState);
              console.log("mic is clicked...");
            }}
          >
            {isVoiceSearchState ? <BsMicFill size={16} /> : <BsMic size={16} />}
          </div>
        </div>
      </GridToolbarContainer>
    );
  }

  const HandleViewTimeline = (params) => {
    setsingleLeadData(params.row);
    setTimelineModelOpen(true);
  };

  console.log("meeting notessss: ", meetingNote);
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

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
    if (
      !event.target.closest(".editBtn ") ||
      !event.target.closest(".timelineBtn ")
    ) {
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

  useEffect(() => {
    setSearchRows(pageState?.data);
  }, [pageState?.data]);

  const handleSearchChange = (e) => {
    setSearchText(e?.target?.value);

    const searchResults = pageState?.data?.filter((row) => {
      return (
        row?.meetingDate
          ?.toString()
          .toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.meetingTime
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.leadName?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.project?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.enquiryType
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.meetingStatus
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.meetingBy?.toLowerCase().includes(e?.target?.value.toLowerCase())
      );
    });
    setSearchRows(searchResults);
  };
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
              } hover:bg-[#229ed1] hover:text-white rounded-full shadow-none p-1.5 mr-1 flex items-center timelineBtn editBtn`}
            >
              <Tooltip title="Edit Meeting here" arrow>
                <button
                  className="editBtn"
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
      <DataGrid
        disableDensitySelector
        initialState={{
          columns: {
            columnVisibilityModel: {
              creationDate: true,
            },
          },
        }}
        autoHeight
        rows={searchRows}
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
          // Toolbar: GridToolbar,
          Toolbar: CustomToolbar,
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
              currentMode === "dark" ? "white !important" : "black !important",
          },
        }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
      />
    </>
  );
};

export default TableMeeting;
