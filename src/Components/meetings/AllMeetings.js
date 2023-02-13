import { Button } from "@material-tailwind/react";
import { Box, Pagination } from "@mui/material";
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

const AllMeetings = ({ BACKEND_URL, pageState, setpageState }) => {
  //eslint-disable-next-line
  const [singleLeadData, setsingleLeadData] = useState();
  const { currentMode } = useStateContext();
  //eslint-disable-next-line
  const [searchText, setSearchText] = useState("");

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const columns = [
    { field: "id", headerName: "#", width: 70, headerAlign: "center" },
    {
      field: "leadName",
      headerName: "Lead name",
      width: 170,
      headerAlign: "center",
    },
    {
      field: "project",
      headerName: "Project",
      width: 110,
      headerAlign: "center",
    },
    {
      field: "enquiryType",
      headerName: "Enquiry",
      width: 110,
      headerAlign: "center",
    },
    {
      field: "leadType",
      headerName: "Property",
      width: 100,
      headerAlign: "center",
    },

    {
      field: "meetingBy",
      headerName: "Meeting by",
      width: 150,
      headerAlign: "center",
    },

    {
      field: "meetingDate",
      headerName: "Meeting date",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "meetingTime",
      headerName: "Meeting time",
      width: 110,
      headerAlign: "center",
    },
    {
      field: "meetingStatus",
      headerName: "Meeting status",
      width: 150,
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <>
            {cellValues.formattedValue === "Cancelled" && (
              <div className="w-full h-full flex justify-center align-center">
                <Button
                  disabled
                  className="bg-transparent disabled:opacity-100 cursor-none text-[#ff0000]"
                >
                  Cancelled
                </Button>
              </div>
            )}

            {cellValues.formattedValue === "Pending" && (
              <div className="w-full h-full flex justify-center align-center">
                <Button
                  disabled
                  className="bg-transparent disabled:opacity-100 cursor-none text-[#f27f25]"
                >
                  Pending
                </Button>
              </div>
            )}
            {cellValues.formattedValue === "Postponed" && (
              <div className="w-full h-full flex justify-center align-center">
                <Button
                  disabled
                  className="bg-transparent disabled:opacity-100 cursor-none text-[#f27f25]"
                >
                  Postponed
                </Button>
              </div>
            )}
            {cellValues.formattedValue === "Attended" && (
              <div className="w-full h-full flex justify-center align-center">
                <Button
                  disabled
                  className="bg-transparent disabled:opacity-100 cursor-none text-[#0f9d58]"
                >
                  Attended
                </Button>
              </div>
            )}
          </>
        );
      },
    },
  ];

  //eslint-disable-next-line
  const HandleClick = (params) => {
    console.log(params);
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
  }, [pageState.page]);

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

  const DataGridStyles = {
    "& .MuiButtonBase-root": {
      color: "white",
    },
    // TOOLBAR
    "& .MuiDataGrid-toolbarContainer": {
      backgroundColor: currentMode === "dark" ? "#424242" : "#000000",
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
      border: "none",
      backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
      color: currentMode === "dark" ? "white" : "white",
    },
    "& .MuiIconButton-sizeSmall": {
      color: currentMode === "dark" ? "white" : "white",
    },
    // background color of main table content
    "& .MuiDataGrid-virtualScroller": {
      backgroundColor: currentMode === "dark" ? "#424242" : "#ffffff",
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
      backgroundColor: currentMode === "dark" ? "#424242" : "#ffffff",
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
      <Box width={"100%"} sx={DataGridStyles}>
        <DataGrid
          autoHeight
          rows={pageState.data}
          // onRowClick={handleRowClick}
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
          }}
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          }
        />
      </Box>
    </div>
  );
};

export default AllMeetings;
