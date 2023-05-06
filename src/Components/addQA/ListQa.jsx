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
import { useNavigate, useLocation } from "react-router-dom";

const ListQa = ({ pageState, setpageState }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation();
  const [row, setRow] = useState([]);
  const [column, setColumns] = useState([]);

  // Model Variables
  // const [LeadModelOpen, setLeadModelOpen] = useState(false);
  // const handleLeadModelOpen = () => setLeadModelOpen(true);
  // const handleLeadModelClose = () => setLeadModelOpen(false);

  // TOOLBAR SEARCH FUNC
  const HandleQuicSearch = (e) => {
    console.log(e.target.value);
  };

  const columns = [
    {
      field: "id",
      headerName: "#",
      minWidth: "10",
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "creationDate",
      headerName: "Date",
      minWidth: 50,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "question",
      headerName: "Question",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },

    {
      field: "answers",
      headerName: "Answers",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
    },
    // {
    //   field: "answers",
    //   headerName: "Answers",
    //   minWidth: 100,
    //   flex: 1,
    //   headerAlign: "center",
    //   renderCell: (params) => (
    //     <div style={{ whiteSpace: "pre-wrap" }}>
    //       {params.row.answers.map((answer, index) => (
    //         <span key={index}>
    //           {index > 0 && "\n"}
    //           {answer}
    //         </span>
    //       ))}
    //     </div>
    //   ),
    // },
  ];

  //   const FetchQA = async (token) => {
  //     axios
  //       .get(`${BACKEND_URL}/trainingdata`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       })
  //       .then((result) => {
  //         console.log("QAs ");
  //         console.log(result.data);
  //         console.log(result?.data?.QAs);

  //         let data = result?.data?.QAs;
  //         let rowData = data?.map((qa) => ({
  //           id: qa?.id,
  //           creationDate: qa?.created_at,
  //           question: qa?.question,
  //           answer:
  //             qa?.answers.length > 0
  //               ? qa?.map((ans) => ({
  //                   answer: ans?.question,
  //                 }))
  //               : "No answers",
  //         }));

  //         console.log("Row Data: ", rowData);

  //         setRow(rowData);

  //         // let rowsdata = rowsDataArray.map((row, index) => ({
  //         //   id:
  //         //     pageState.page > 1
  //         //       ? pageState.page * pageState.pageSize -
  //         //         (pageState.pageSize - 1) +
  //         //         index
  //         //       : index + 1,
  //         //   creationDate: row?.created_at,
  //         //   email: row?.email || "No Email",
  //         //   status:
  //         //     row?.status === "Subscribed" || row?.status === "Subscribed"
  //         //       ? "Subscribed"
  //         //       : "Not Subscribed",
  //         // }));
  //       })
  //       .catch((err) => {
  //         console.log("error occured");
  //         console.log(err);
  //       });
  //   };

  const FetchQA = async (token) => {
    axios
      .get(`${BACKEND_URL}/trainingdata`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("QAs ");
        console.log(result.data);
        console.log(result?.data?.QAs);

        let data = result?.data?.QAs;
        let rowData = data
          ?.filter((qa) => qa?.type === "Question")
          .map((qa) => ({
            id: qa?.id,
            creationDate: qa?.created_at,
            question: qa?.question,
            answers:
              qa?.answers.length > 0
                ? qa?.answers.map((ans) => ans?.question).join(", ")
                : "No answers",
          }));

        console.log("Row Data: ", rowData);

        setRow(rowData);
      })
      .catch((err) => {
        console.log("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchQA(token);
    // eslint-disable-next-line
  }, []);

  // ROW CLICK FUNCTION
  const handleRowClick = async (params) => {
    window.open(`/newsletters/${params.row.leadId}`);
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
        {/* <Pagination
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
        /> */}
      </>
    );
  }
  return (
    <div className="pb-10">
      <Box width={"100%"} sx={DataGridStyles}>
        <DataGrid
          autoHeight
          rows={row}
          // onRowClick={handleRowClick}
          // rowCount={pageState.total}
          // loading={pageState.isLoading}
          // rowsPerPageOptions={[30, 50, 75, 100]}
          // pagination
          // paginationMode="server"
          // page={pageState.page - 1}
          // pageSize={pageState.pageSize}
          // onPageChange={(newPage) => {
          //   setpageState((old) => ({ ...old, page: newPage + 1 }));
          // }}
          // onPageSizeChange={(newPageSize) =>
          //   setpageState((old) => ({ ...old, pageSize: newPageSize }))
          // }
          columns={columns}
          components={{
            Toolbar: GridToolbar,
            // Pagination: CustomPagination,
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
          // getRowClassName={(params) =>
          //   params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
          // }
        />
      </Box>
    </div>
  );
};

export default ListQa;
