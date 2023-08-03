// import {
//   Accordion,
//   AccordionDetails,
//   AccordionSummary,
//   CircularProgress,
//   Box,
//   Pagination,
//   Typography,
//   Button,
//   PaginationItem,
// } from "@mui/material";
// import { FaFileDownload } from "react-icons/fa";

// import {
//   DataGrid,
//   gridPageCountSelector,
//   gridPageSelector,
//   GridToolbar,
//   useGridApiContext,
//   useGridSelector,
// } from "@mui/x-data-grid";
// import { BsChevronCompactDown, BsTrash } from "react-icons/bs";
import { HiBars3BottomLeft } from "react-icons/hi2";


// import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
// import { useNavigate, useLocation } from "react-router-dom";
// import { CSVLink } from "react-csv";

// const ListQa = ({ pageState, setpageState }) => {
//   const { currentMode, BACKEND_URL } = useStateContext();
//   // eslint-disable-next-line
//   const [searchText, setSearchText] = useState("");
//   // eslint-disable-next-line
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [row, setRow] = useState([]);
//   const [exportData, setExportData] = useState([]);
//   const [column, setColumns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);

//   console.log("Current page : ", currentPage);

//   console.log("Rows: ", row);

//   const getSummaryBgClass = () => {
//     if (currentMode === "dark") {
//       return "bg-gray-800 text-white";
//     } else {
//       return "bg-gray-200 text-gray-800";
//     }
//   };

//   const getDetailBgClass = () => {
//     if (currentMode === "dark") {
//       return "bg-gray-900 text-white";
//     } else {
//       return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Model Variables
//   // const [LeadModelOpen, setLeadModelOpen] = useState(false);
//   // const handleLeadModelOpen = () => setLeadModelOpen(true);
//   // const handleLeadModelClose = () => setLeadModelOpen(false);

//   // TOOLBAR SEARCH FUNC
//   const HandleQuicSearch = (e) => {
//     console.log(e.target.value);
//   };

//   const handleDeleteQuestion = async () => {
//     console.log("Function called");
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   console.log("Data: ", data);

//   const renderedData = data?.QAs?.slice(
//     (currentPage - 1) * data?.links?.per_page,
//     currentPage * data?.links?.per_page
//   );

//   console.log("Rendered: ", renderedData);

//   const getExportData = () => {
//     const data = row?.map((qa) => ({
//       question: qa.question,
//       answers: qa.answers.join(", "),
//     }));

//     console.log("Export: ", data);
//     setExportData(data);
//   };

//   const headers = [
//     { label: "Question", key: "question" },
//     { label: "Answers", key: "answers" },
//   ];

//   const columns = [
//     {
//       field: "id",
//       headerName: "#",
//       minWidth: "10",
//       flex: 1,
//       headerAlign: "center",
//     },

//     {
//       field: "question",
//       headerName: "Question",
//       minWidth: 150,
//       flex: 1,
//       headerAlign: "center",
//     },

//     {
//       field: "answers",
//       headerName: "Answers",
//       minWidth: 100,
//       flex: 1,
//       headerAlign: "center",
//     },
//   ];

//   const FetchQA = async (token) => {
//     setLoading(true);
//     axios
//       .get(`${BACKEND_URL}/trainingdata`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       })
//       .then((result) => {
//         setLoading(false);
//         console.log("QAs ");
//         console.log(result.data);
//         console.log(result?.data?.QAs);

//         let data = result?.data?.QAs;

//         let rowData = data?.map((qa, index) => ({
//           id: index + 1,
//           question: qa?.question || "No Questions",
//           answers: qa?.answers || "No Answers",
//         }));

//         console.log("Row Data: ", rowData);
//         setData(result?.data);

//         setRow(rowData);
//       })
//       .catch((err) => {
//         setLoading(false);
//         console.log("error occured");
//         console.log(err);
//       });
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("auth-token");
//     FetchQA(token);
//     // eslint-disable-next-line
//   }, []);

//   // ROW CLICK FUNCTION
//   const handleRowClick = async (params) => {
//     window.open(`/newsletters/${params.row.leadId}`);
//   };

//   const DataGridStyles = {
//     "& .MuiButtonBase-root": {
//       color: "white",
//     },
//     // TOOLBAR
//     "& .MuiDataGrid-toolbarContainer": {
//       backgroundColor: currentMode === "dark" ? "#212121" : "#000000",
//       paddingTop: "10px",
//       paddingBottom: "10px",
//       paddingLeft: "20px",
//       paddingRight: "20px",
//     },

//     "& .MuiInputBase-root": {
//       color: "white",
//     },
//     "& .MuiInputBase-root::before": {
//       color: "white",
//     },
//     "& .MuiInputBase-root:hover::before": {
//       color: "white",
//     },

//     // Background color of header of data grid
//     "& .MuiDataGrid-columnHeaders": {
//       backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
//       color: currentMode === "dark" ? "white" : "white",
//     },
//     "& .MuiIconButton-sizeSmall": {
//       color: currentMode === "dark" ? "white" : "white",
//     },
//     // background color of main table content
//     "& .MuiDataGrid-virtualScroller": {
//       backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
//       color: currentMode === "dark" ? "white" : "black",
//     },
//     // changing rows hover color
//     "& .css-1uhmucx-MuiDataGrid-root .MuiDataGrid-row:hover .MuiDataGrid-row": {
//       backgroundColor: currentMode === "dark" && "#000000",
//       border: "none",
//     },
//     // changing row colors
//     " .even": {
//       backgroundColor: currentMode === "dark" ? "#212121" : "#ffffff",
//     },
//     // changing rows right border
//     // "& .MuiDataGrid-cell": {
//     //   borderRight: "1px solid rgb(240, 240, 240)",
//     // },
//     // BACKGROUND COLOR OF FOOTER
//     "& .MuiDataGrid-footerContainer": {
//       borderTop: "none",
//       backgroundColor: currentMode === "dark" ? "#DA1F26" : "#DA1F26",
//       color: "white",
//     },
//     "& .MuiTablePagination-selectLabel": {
//       color: "white",
//     },
//     "& .MuiTablePagination-select ": { color: "white" },
//     "& .MuiSvgIcon-fontSizeMedium ": { color: "white" },
//     "& .MuiTablePagination-displayedRows": { color: "white" },
//     // For inner data styling
//     "& .MuiDataGrid-virtualScrollerRenderZone": {
//       // backgroundColor: "red",
//     },
//   };
//   // Custom Pagination
//   function CustomPagination() {
//     const apiRef = useGridApiContext();
//     const page = useGridSelector(apiRef, gridPageSelector);
//     const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//     return (
//       <>
//         {/* <Pagination
//           sx={{
//             "& .Mui-selected": {
//               backgroundColor: "white !important",
//               color: "black !important",
//               borderRadius: "5px !important",
//             },
//           }}
//           count={pageCount}
//           page={page + 1}
//           onChange={(event, value) => apiRef.current.setPage(value - 1)}
//         /> */}
//       </>
//     );
//   }
//   return (
//     <div className="pb-10 h-[500px] overflow-y-scroll">
//       {loading && (
//         <div className="flex items-center justify-center">
//           <CircularProgress
//             size={23}
//             // sx={{ color: "white" }}
//             className="text-white"
//           />
//         </div>
//       )}

//       {/* <CSVLink data={exportData} headers={headers}>
//         <Button
//           className="bg-main-red-color  text-white rounded-lg py-3 font-semibold mb-5"
//           style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
//           onClick={getExportData}
//           sx={{ marginBottom: "10px" }}
//         >
//           Export Data
//           <FaFileDownload className="ml-2" />
//         </Button>
//       </CSVLink> */}

//       {/* {!loading && row.length > 0 && (
//         <>
//           <CSVLink data={exportData} headers={headers}>
//             <Button
//               className="bg-main-red-color  text-white rounded-lg py-3 font-semibold mb-5"
//               style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
//               onClick={getExportData}
//               sx={{ marginBottom: "10px" }}
//             >
//               Export Data
//               <FaFileDownload className="ml-2" />
//             </Button>
//           </CSVLink>

//           {row?.map((qa, index) => (
//             <Accordion key={index} className="mb-4">
//               <AccordionSummary
//                 expandIcon={<BsChevronCompactDown />}
//                 className={getSummaryBgClass()}
//               >
//                 <HiBars3BottomLeft className="mr-4 mt-1" size={20} />
//                 <Typography style={{ userSelect: "text" }}>
//                   {qa.question}
//                 </Typography>
//                 <BsTrash
//                   className="ml-2 mt-1 cursor-pointer"
//                   onClick={handleDeleteQuestion}
//                 />
//               </AccordionSummary>

//               <AccordionDetails className={getDetailBgClass()}>
//                 <Typography>
//                   {qa?.answers.length > 0
//                     ? qa?.answers.map((ans) => (
//                         <>
//                           {ans}
//                           <hr />
//                           <br />
//                         </>
//                       ))
//                     : "No answer."}
//                 </Typography>
//               </AccordionDetails>
//             </Accordion>
//           ))}
//         </>
//       )} */}
//       {!loading && renderedData?.length > 0 && (
//         <>
//           <CSVLink data={exportData} headers={headers}>
//             <Button
//               className="bg-main-red-color text-white rounded-lg py-3 font-semibold mb-5"
//               style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
//               onClick={getExportData}
//               sx={{ marginBottom: "10px" }}
//             >
//               Export Data
//               <FaFileDownload className="ml-2" />
//             </Button>
//           </CSVLink>

//           {renderedData?.map((qa, index) => (
//             <Accordion key={index} className="mb-4">
//               <AccordionSummary
//                 expandIcon={<BsChevronCompactDown />}
//                 className={getSummaryBgClass()}
//               >
//                 <HiBars3BottomLeft className="mr-4 mt-1" size={20} />
//                 <Typography style={{ userSelect: "text" }}>
//                   {qa.question}
//                 </Typography>
//                 <BsTrash
//                   className="ml-2 mt-1 cursor-pointer"
//                   onClick={handleDeleteQuestion}
//                 />
//               </AccordionSummary>

//               <AccordionDetails className={getDetailBgClass()}>
//                 <Typography>
//                   {qa?.answers.length > 0 ? (
//                     qa.answers.map((ans) => (
//                       <>
//                         {ans}
//                         <hr />
//                         <br />
//                       </>
//                     ))
//                   ) : (
//                     <span>No answer.</span>
//                   )}
//                 </Typography>
//               </AccordionDetails>
//             </Accordion>
//           ))}

//           <PaginationItem
//             count={data?.links?.last_page}
//             page={currentPage}
//             onChange={(event, page) => handlePageChange(page)}
//             color="secondary"
//             sx={{ color: "#ffffff" }}
//           />
//         </>
//       )}

//       {renderedData?.length === 0 && (
//         <p
//           className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
//         >
//           No data to display.
//         </p>
//       )}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import axios from "../../axoisConfig";
import { CSVLink } from "react-csv";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  CircularProgress,
  styled,
} from "@mui/material";
import { BsChevronCompactDown, BsTrash } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";

const ListQa = ({ pageState, setpageState }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const [row, setRow] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  console.log("Data: ", data);

  const useStyles = styled(() => ({
    ul: {
      "& .MuiPaginationItem-root": {
        color: "#000",
      },
    },
  }));

  const classes = useStyles();

  const getSummaryBgClass = () => {
    return currentMode === "dark"
      ? "bg-gray-800 text-white"
      : "bg-gray-200 text-gray-800";
  };

  const getDetailBgClass = () => {
    return currentMode === "dark"
      ? "bg-gray-900 text-white"
      : "bg-gray-100 text-gray-800";
  };

  const handleDeleteQuestion = async () => {
    console.log("Function called");
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // const renderedData = data?.QAs?.slice(
  //   (currentPage - 1) * data?.links?.per_page,
  //   currentPage * data?.links?.per_page
  // );

  const renderedData = data?.QAs;

  console.log("Render: ", renderedData);

  const getExportData = () => {
    const data = row?.map((qa) => ({
      question: qa.question,
      answers: qa.answers.join(", "),
    }));

    setExportData(data);
  };

  const headers = [
    { label: "Question", key: "question" },
    { label: "Answers", key: "answers" },
  ];

  const FetchQA = async (token, page) => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/trainingdata?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setLoading(false);
        let data = result?.data;
        let rowData = data?.QAs?.map((qa, index) => ({
          id: index + 1,
          question: qa?.question || "No Questions",
          answers: qa?.answers || "No Answers",
        }));

        setData(data);
        setRow(rowData);
      })
      .catch((err) => {
        setLoading(false);
        console.log("error occurred");
        console.log(err);
      });
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("auth-token");
  //   FetchQA(token, currentPage);
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchQA(token, currentPage);
  }, [currentPage]);

  const handleRowClick = async (params) => {
    console.log(params);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <CircularProgress size={50} />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <CSVLink data={exportData} headers={headers}>
                <Button
                  className="bg-main-red-color text-white rounded-lg py-3 font-semibold mb-5"
                  style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
                  onClick={getExportData}
                  sx={{ marginBottom: "10px" }}
                >
                  Export Data
                  <FaFileDownload className="ml-2" />
                </Button>
              </CSVLink>
            </div>
          </div>

          {renderedData?.map((qa, index) => (
            <Accordion key={index} className="mb-4">
              <AccordionSummary
                expandIcon={<BsChevronCompactDown />}
                className={getSummaryBgClass()}
              >
                <HiBars3BottomLeft className="mr-4 mt-1" size={20} />
                <Typography
                  style={{ userSelect: "text" }}
                  className="capitalize"
                >
                  {qa.question}
                </Typography>
                {/* <BsTrash
                  className="ml-2 mt-1 cursor-pointer"
                  onClick={handleDeleteQuestion}
                /> */}
              </AccordionSummary>

              <AccordionDetails className={getDetailBgClass()}>
                <Typography className="capitalize">
                  {qa?.answers.length > 0 ? (
                    qa.answers.map((ans, ansIndex) => (
                      <React.Fragment key={ansIndex}>
                        {ans}
                        <hr />
                        <br />
                      </React.Fragment>
                    ))
                  ) : (
                    <span>No answer.</span>
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* <Pagination
            count={data?.links?.last_page}
            page={currentPage}
            onChange={handlePageChange}
            color={currentMode === "dark" ? "primary" : "secondary"}
            sx={{
              color: currentMode === "dark" ? "white" : "gray",
            }}
          /> */}

          <Pagination
            count={data?.links?.last_page}
            page={currentPage}
            onChange={handlePageChange}
            color="secondary"
            className={{ ul: classes.ul }}
            sx={{
              "& .Mui-selected": {
                color: "white",
                backgroundColor: "red !important",
                "&:hover": {
                  backgroundColor: currentMode === "dark" ? "black" : "white",
                },
              },
              "& .MuiPaginationItem-root": {
                color: "white",
              },
            }}
          />
        </>
      )}

      {renderedData?.length === 0 && (
        <p
          className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
        >
          No data to display.
        </p>
      )}
    </div>
  );
};

export default ListQa;

// export default ListQa;
