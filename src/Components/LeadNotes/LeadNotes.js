import { Box, Pagination, Tab, Tabs } from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { TabPanel } from "@material-tailwind/react";
import NotesGrid from "./NotesGrid";
import {
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineTable,
  AiOutlineAppstore,
} from "react-icons/ai";

const LeadNotes = ({ pageState, setpageState }) => {
  const { currentMode, BACKEND_URL, darkModeColors } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
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
      minWidth: 40,
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "creationDate",
      headerName: "Date",
      minWidth: 170,
      flex: 1,
    },
    {
      field: "leadName",
      headerName: "Lead name",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "project",
      headerName: "Project",
      minWidth: 110,
      flex: 1,
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      minWidth: 110,
      flex: 1,
    },
    // {
    //   field: "leadNote",
    //   headerName: "Note",
    //   minWidth: 400,
    //   flex: 1,
    //   headerAlign: "center",
    // },

    // {
    //   field: "userName",
    //   headerName: "Added by",
    //   minWidth: 150,
    //   flex: 1,
    //   headerAlign: "center",
    // },
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
          creationDate: row?.creationDate,
          leadName: row?.leadName,
          leadNote: row?.leadNote,
          project: row?.project,
          enquiryType: row?.enquiryType,
          userName: row?.userName,
          leadId: row?.leadId,
        }));

        setpageState((old) => ({
          ...old,
          isLoading: false,
          data: rowsdata,
          total: result.data.logs.total,
          pageSize: result.data.logs.per_page,
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
    "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-row": {
      backgroundColor: currentMode === "dark" && "#000000",
      border: "none",
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
    <div className="pb-10">
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
        <Tabs value={value} onClick={handleChange} variant="standard">
          <Tab
            icon={
              value === 0 ? (
                <AiOutlineAppstore
                  style={{
                    color: currentMode === "dark" ? "#ffffff" : "#000000",
                  }}
                />
              ) : (
                <AiOutlineTable
                  style={{
                    color: currentMode === "dark" ? "#ffffff" : "#000000",
                  }}
                />
              )
            }
          />
        </Tabs>
      </Box>
      <div className="mt-3 pb-3">
        <TabPanel value={value} index={1}>
          <Box width={"100%"} sx={DataGridStyles}>
            <DataGrid
              autoHeight
              rows={pageState.data}
              onRowClick={handleRowClick}
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
                color: currentMode === "dark" ? "white !important" : "black !important"
              }
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
