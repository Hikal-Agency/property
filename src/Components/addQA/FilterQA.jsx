import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Box,
  Pagination,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  gridPageCountSelector,
  gridPageSelector,
  GridToolbar,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { BsChevronCompactDown } from "react-icons/bs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";

const FitlerQA = ({ pageState, setpageState, user }) => {
  console.log("User id : ", user);
  const { currentMode, BACKEND_URL } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");
  // eslint-disable-next-line
  const navigate = useNavigate();
  const location = useLocation();
  const [row, setRow] = useState([]);
  const [column, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Rows: ", row);

  const getSummaryBgClass = () => {
    if (currentMode === "dark") {
      return "bg-gray-800 text-white";
    } else {
      return "bg-gray-200 text-gray-800";
    }
  };

  const getDetailBgClass = () => {
    if (currentMode === "dark") {
      return "bg-gray-900 text-white";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

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
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/trainingdata?user_id=${user}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setLoading(false);
        console.log("QAs ");
        console.log(result.data);
        console.log(result?.data?.QAs);

        let data = result?.data?.QAs;
        // let rowData = data?.map((qa, index) => ({
        //   id: index + 1,
        //   question: qa?.question,
        //   answers:
        //     qa?.answers.length > 0
        //       ? qa?.answers.map((ans) => ans?.answer).join(", ")
        //       : "No answers",
        // }));

        let rowData = data?.map((qa, index) => ({
          id: index + 1,
          question: qa?.question || "No Questions",
          answers: qa?.answers || "No Answers",
        }));

        console.log("Row Data: ", rowData);

        setRow(rowData);
      })
      .catch((err) => {
        setLoading(false);
        console.log("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("auth-token");
      FetchQA(token);
    }
    // eslint-disable-next-line
  }, [user]);

  // ROW CLICK FUNCTION
  //   const handleRowClick = async (params) => {
  //     window.open(`/newsletters/${params.row.leadId}`);
  //   };

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
    <div className="pb-10 h-[500px] overflow-y-scroll">
      {loading && (
        <div className="flex items-center justify-center">
          <CircularProgress
            size={23}
            // sx={{ color: "white" }}
            className="text-white"
          />
        </div>
      )}

      {/* <Box width={"100%"} sx={DataGridStyles}>
          <DataGrid
            autoHeight
            rows={row}
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
        </Box> */}
      {!loading &&
        (row && row?.length > 0 ? (
          row?.map((qa, index) => (
            <Accordion key={index} className="mb-4">
              <AccordionSummary
                expandIcon={<BsChevronCompactDown />}
                className={getSummaryBgClass()}
              >
                <Typography>{qa.question}</Typography>
              </AccordionSummary>

              <AccordionDetails className={getDetailBgClass()}>
                <Typography>
                  {qa?.answers.length > 0
                    ? qa?.answers.map((ans) => (
                        <>
                          {ans}
                          <hr />
                          <br />
                        </>
                      ))
                    : "No answer."}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <p
            className={`${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            No data to display.
          </p>
        ))}
    </div>
  );
};

export default FitlerQA;
