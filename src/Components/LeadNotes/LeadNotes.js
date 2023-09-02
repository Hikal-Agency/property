import { Box, Pagination, Tab, Tabs } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";

import axios from "../../axoisConfig";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import NotesGrid from "./NotesGrid";
import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineTable,
  AiOutlineAppstore,
} from "react-icons/ai";

const LeadNotes = ({ pageState, setpageState }) => {
  const { currentMode, BACKEND_URL, User, darkModeColors, isArabic } = useStateContext();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [value, setValue] = useState(0);

  // Model Variables
  // const [LeadModelOpen, setLeadModelOpen] = useState(false);
  // const handleLeadModelOpen = () => setLeadModelOpen(true);
  // const handleLeadModelClose = () => setLeadModelOpen(false);

  const handleChange = (event, newValue) => {
    setValue(value === 0 ? 1 : 0);
  };

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: 20,
      maxWidth: 50,
      headerAlign: "center",
      flex: 1,
      renderCell: (cellValues) => {
        return (
          <strong>
            {cellValues.formattedValue}
          </strong>
        )
      }
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
        return <p style={{fontFamily: isArabic(cellValues?.formattedValue) ? "Noto Kufi Arabic" : "inherit"}}>{cellValues?.formattedValue}</p>
      }
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
            <p className="text-center capitalize" style={{fontFamily: isArabic(cellValues?.formattedValue) ? "Noto Kufi Arabic" : "inherit"}}>
              <p>{cellValues.row.project === "null" ? "-" : cellValues.row.project}</p>
              <p>{cellValues.row.leadType === "null" ? "-" : cellValues.row.leadType}</p>
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
            <p className="text-center capitalize" style={{fontFamily: isArabic(cellValues?.formattedValue) ? "Noto Kufi Arabic" : "inherit"}}>
              <p>{cellValues.row.enquiryType === "null" ? "-" : cellValues.row.enquiryType}</p>
              <p>{cellValues.row.leadFor === "null" ? "-" : cellValues.row.leadFor}</p>
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
        return <p style={{fontFamily: isArabic(cellValues?.formattedValue) ? "Noto Kufi Arabic" : "inherit"}}>{cellValues?.formattedValue}</p>
      }
    },
    {
      field: "userName",
      headerName: "Added by",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const FetchLeads = async (token) => {
    setpageState((old) => ({
      ...old,
      isLoading: true,
    }));

    axios
      .get(`${BACKEND_URL}/leadNotes?page=${pageState.page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        // console.log("the lead notes are ");
        // console.log(result.data);
        let rowsDataArray = "";
        if (result.data.logs.current_page > 1) {
          const theme_values = Object.values(result.data.logs.data);
          rowsDataArray = theme_values;
        } else {
          rowsDataArray = result.data.logs.data;
        }
        console.log("rows array is");
        console.log(rowsDataArray);

        let rowsdata = rowsDataArray.map((row, index) => ({
          id:
            pageState.page > 1
              ? pageState.page * pageState.pageSize -
                (pageState.pageSize - 1) +
                index
              : index + 1,
          creationDate: row?.creationDate || "-",
          leadName: row?.leadName || "-",
          leadNote: row?.leadNote,
          project: row?.project || "-",
          enquiryType: row?.enquiryType || "-",
          leadType: row?.leadType || "-",
          leadFor: row?.leadFor || "-",
          userName: row?.userName || "-",
          leadId: row?.leadId,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          total: result.data.logs.total,
          pageSize: result.data.logs.per_page,
          gridPageSize: result.data.logs.last_page,
          currentPage: result.data.logs.current_page,
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
  }, [pageState.page]);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params) => {
    window.open(`/leadnotes/${params.row.leadId}`);
  };

  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: currentMode === "dark" ? "white" : "black",
    },
    // TOOLBAR COLORS
    "& .MuiDataGrid-toolbarContainer": {
      // backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
      backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
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
    "& .MuiDataGrid-columnHeaders": { // css-s3ulew-
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
      borderRadius: "0",
      width: "100%",
    },
    "& .MuiDataGrid-root .MuiDataGrid-main": {
      height: "auto",
      overflowY: "inherit !important",
    },
    // DATATABLE BORDER - DARK
    "& .MuiDataGrid-root": { //css-h0wcjk-
      border: "none !important",
      boxShadow: "none !important",
    },
    // DATATABLE BORDER - LIGHT
    "& .MuiDataGrid-root": { //css-hgxfug-
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "black",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "black" : "white",
      color: currentMode === "dark" ? "white" : "black",
    },
    // changing rows hover color
    "& .MuiDataGrid-row:hover": { //css-1uhmucx-
      backgroundColor: currentMode === "dark" && "#1C1C1C",
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiDataGrid-root": { //css-s3ulew-
      border: "none !important",
      boxShadow: "none !important",
    },
    "& .MuiDataGrid-root": { //css-otzuo3-
      border: "none !important",
      boxShadow: "none !important",
    },
    // changing row colors
    "& .even": {
      backgroundColor: currentMode === "dark" ? "black" : "white",
    },
    // changing rows right border
    // "& .MuiDataGrid-cell": {
      // borderRight: "1px solid rgb(240, 240, 240)",
    // },

    // BACKGROUND COLOR OF FOOTER
    "& .MuiDataGrid-footerContainer": {
      // border: "none",
      borderTop: "2px solid #DA1F26",
      // backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      backgroundColor: currentMode === "dark" ? "black" : "white",
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
              backgroundColor: "#DA1F26 !important",
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
    <div className="sm:-mt-0 md:-mt-5 lg:-mt-10">
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
        className={`rounded-md overflow-hidden flex ${
          currentMode === "dark" ? "bg-black" : "bg-white"
        }`}
        style={{justifyContent: "flex-end"}}
      >
        <Tabs value={value} onClick={handleChange} variant="standard" >
          <Tab
            icon={
              // value === 0 ? 
              (
                <AiOutlineAppstore
                  size={20}
                  style={{
                    color: currentMode === "dark" ? "#ffffff" : "#000000",
                  }}
                />
              )
            }
          />
          <Tab
            icon={
              (
                <AiOutlineTable
                  size={20}
                  style={{
                    color: currentMode === "dark" ? "#ffffff" : "#000000",
                  }}
                />
              )
            }
          />
        </Tabs>
      </Box>
      <div className="pb-1">
        <TabPanel value={value} index={1}>
          <Box
            width={"100%"}
            className={`${currentMode}-mode-datatable pb-20`}
            sx={DataGridStyles}
          >
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
              rows={pageState.data}
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
        </TabPanel>
        <TabPanel value={value} index={0}>
          <NotesGrid
            tabValue={tabValue}
            setTabValue={setTabValue}
            pageState={pageState}
            setpageState={setpageState}
          />
        </TabPanel>
      </div>
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default LeadNotes;
