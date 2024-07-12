import { Box, Pagination, Tab, Tabs } from "@mui/material";
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
import { useEffect, useState, useRef } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { BsMic, BsMicFill } from "react-icons/bs";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import SingleLeadModal from "../../Pages/singlelead/SingleLeadModal";
import { AiOutlineTable, AiOutlineAppstore } from "react-icons/ai";

const NotesTable = ({ pageState, setpageState, HandleSingleLead }) => {
  const {
    currentMode,
    BACKEND_URL,
    User,
    darkModeColors,
    isArabic,
    primaryColor,
    blurDarkColor,
    blurLightColor,
    blurBlackColor,
    blurWhiteColor,
    themeBgImg,
  } = useStateContext();
  const [searchText, setSearchText] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);
  const [isVoiceSearchState, setIsVoiceSearchState] = useState(false);
  const [searchRows, setSearchRows] = useState(pageState?.data);
  const searchRef = useRef(null);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition("en");
  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

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
  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };
  useEffect(() => {
    setSearchRows(pageState?.data);
  }, [pageState?.data]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 20,
      maxWidth: 50,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return <strong>{cellValues.formattedValue}</strong>;
      },
    },
    {
      field: "creationDate",
      headerName: "Date",
      minWidth: 70,
      maxWidth: 90,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "leadName",
      headerName: "Lead name",
      minWidth: 100,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <p
            style={{
              fontFamily: isArabic(cellValues?.formattedValue)
                ? "Noto Kufi Arabic"
                : "inherit",
            }}
          >
            {cellValues?.formattedValue}
          </p>
        );
      },
    },
    {
      field: "project",
      headerName: "Project",
      minWidth: 80,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="w-full my-2">
            <p
              className="text-center capitalize"
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              <p>
                {cellValues.row.project === "null"
                  ? "-"
                  : cellValues.row.project}
              </p>
              <p>
                {cellValues.row.leadType === "null"
                  ? "-"
                  : cellValues.row.leadType}
              </p>
            </p>
          </div>
        );
      },
    },
    {
      field: "enquiryType",
      headerName: "Property",
      minWidth: 80,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <div className="w-full my-2">
            <p
              className="text-center capitalize"
              style={{
                fontFamily: isArabic(cellValues?.formattedValue)
                  ? "Noto Kufi Arabic"
                  : "inherit",
              }}
            >
              <p>
                {cellValues.row.enquiryType === "null"
                  ? "-"
                  : cellValues.row.enquiryType}
              </p>
              <p>
                {cellValues.row.leadFor === "null"
                  ? "-"
                  : cellValues.row.leadFor}
              </p>
            </p>
          </div>
        );
      },
    },
    {
      field: "leadNote",
      headerName: "Note",
      minWidth: 300,
      flex: 1,
      headerAlign: "center",
      renderCell: (cellValues) => {
        return (
          <p
            style={{
              fontFamily: isArabic(cellValues?.formattedValue)
                ? "Noto Kufi Arabic"
                : "inherit",
            }}
          >
            {cellValues?.formattedValue}
          </p>
        );
      },
    },
    {
      field: "userName",
      headerName: "Added by",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const handleSearchChange = (e) => {
    setSearchText(e?.target?.value);

    const searchResults = pageState?.data?.filter((row) => {
      return (
        row?.id
          ?.toString()
          .toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.creationDate
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.project?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.enquiryType
          ?.toLowerCase()
          .includes(e?.target?.value.toLowerCase()) ||
        row?.leadNote?.toLowerCase().includes(e?.target?.value.toLowerCase()) ||
        row?.userName?.toLowerCase().includes(e?.target?.value.toLowerCase())
      );
    });
    setSearchRows(searchResults);
  };

  //   const FetchLeads = async (token) => {
  //     setpageState((old) => ({
  //       ...old,
  //       isLoading: true,
  //     }));

  //     axios
  //       .get(`${BACKEND_URL}/leadNotes?page=${pageState.page}`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((result) => {
  //         // console.log("the lead notes are ");
  //         // console.log(result.data);
  //         let rowsDataArray = "";
  //         if (result.data.logs.current_page > 1) {
  //           const theme_values = Object.values(result.data.logs.data);
  //           rowsDataArray = theme_values;
  //         } else {
  //           rowsDataArray = result.data.logs.data;
  //         }
  //         console.log("rows array is");
  //         console.log(rowsDataArray);

  //         let rowsdata = rowsDataArray.map((row, index) => ({
  //           id:
  //             pageState.page > 1
  //               ? pageState.page * pageState.pageSize -
  //                 (pageState.pageSize - 1) +
  //                 index
  //               : index + 1,
  //           creationDate: row?.creationDate || "-",
  //           leadName: row?.leadName || "-",
  //           leadNote: row?.leadNote,
  //           project: row?.project || "-",
  //           enquiryType: row?.enquiryType || "-",
  //           leadType: row?.leadType || "-",
  //           leadFor: row?.leadFor || "-",
  //           userName: row?.userName || "-",
  //           leadId: row?.leadId,
  //         }));

  //         setpageState((old) => ({
  //           ...old,
  //           isLoading: false,
  //           data: rowsdata,
  //           total: result.data.logs.total,
  //           pageSize: result.data.logs.per_page,
  //           gridPageSize: result.data.logs.last_page,
  //           currentPage: result.data.logs.current_page,
  //         }));
  //       })
  //       .catch((err) => {
  //         console.log("error occured");
  //         console.log(err);
  //       });
  //   };

  //   useEffect(() => {
  //     const token = localStorage.getItem("auth-token");
  //     FetchLeads(token);
  //     // eslint-disable-next-line
  //   }, [pageState.page]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params) => {
    // window.open(`/leadnotes/${params.row.leadId}`);
    HandleSingleLead(params.row.leadId);
  };

  function CustomToolbar() {
    // if (searchText) {
    //   searchRef?.current?.focus();
    // }
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

  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
    // TOOLBAR COLORS
    "& .MuiDataGrid-toolbarContainer": {
      // backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
      backgroundColor: currentMode === "dark" ? blurBlackColor : blurWhiteColor,
      padding: "10px 5px",
      gap: "15px",
      color: currentMode === "dark" ? "white" : "black",
    },
    // TOOLBAR BUTTON
    "& .MuiInputBase-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-root::before": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiInputBase-root:hover::before": {
      color: currentMode === "dark" ? "white" : "black",
    },

    // Background color of header of data grid
    "& .MuiDataGrid-columnHeaders": {
      // css-s3ulew-
      border: "none",
      backgroundColor: primaryColor,
      color: currentMode === "dark" ? "white" : "white",
      borderRadius: "0",
      width: "100%",
    },
    "& .MuiDataGrid-root .MuiDataGrid-main": {
      height: "auto",
      overflowY: "inherit !important",
    },
    // DATATABLE BORDER - DARK
    "& .MuiDataGrid-root": {
      //css-h0wcjk-
      border: "none !important",
      boxShadow: "none !important",
    },
    // DATATABLE BORDER - LIGHT
    "& .MuiDataGrid-root": {
      //css-hgxfug-
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "black",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? blurBlackColor : blurWhiteColor,
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .MuiDataGrid-row:hover": {
      //css-1uhmucx-
      backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiDataGrid-root": {
      //css-s3ulew-
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiDataGrid-root": {
      //css-otzuo3-
      border: "none !important",
      boxShadow: "none !important",
    },
    // changing row colors
    // "& .even": {
    //   backgroundColor: currentMode === "dark" ? "black" : "white",
    // },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
    // borderRight: "1px solid rgb(240, 240, 240)",
    // },

    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      // border: "none",
      borderTop: `2px solid ${primaryColor}`,
      backgroundColor: currentMode === "dark" ? blurBlackColor : blurWhiteColor,
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiTablePagination-selectLabel": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiTablePagination-select ": {
      color: currentMode === "dark" ? "white" : "black",
    },
    "& .MuiSvgIcon-fontSizeMedium ": {
      color: currentMode === "dark" ? "white" : "black",
      // TODO: For Pagination SVG, white
    },
    "& .MuiTablePagination-displayedRows": {
      color: currentMode === "dark" ? "white" : "black",
    },
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
      // rows={pageState.data}
      rows={searchRows}
      onRowClick={handleRowClick}
      rowCount={pageState.total}
      loading={pageState.isLoading}
      rowsPerPageOptions={[30, 50, 75, 100]}
      pagination
      getRowHeight={() => "auto"}
      paginationMode="server"
      page={pageState.page - 1}
      pageSize={pageState.pageSize}
      onPageChange={(newPage) => {
        setpageState((old) => ({ ...old, page: newPage + 1 }));
      }}
      onPageSizeChange={(newPageSize) =>
        setpageState((old) => ({ ...old, pageSize: newPageSize }))
      }
      columns={columns}
      components={{
        Toolbar: GridToolbar,
        // Toolbar: CustomToolbar,
        Pagination: CustomPagination,
      }}
      componentsProps={{
        toolbar: {
          printOptions: { disableToolbarButton: User?.role !== 1 },
          csvOptions: { disableToolbarButton: User?.role !== 1 },
          showQuickFilter: true,
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
  );
};

export default NotesTable;
