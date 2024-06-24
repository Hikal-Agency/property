import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress, Pagination,
  Typography,
  Button
} from "@mui/material";
import { HiBars3BottomLeft } from "react-icons/hi2";

import { BsChevronCompactDown, BsTrash } from "react-icons/bs";

import axios from "../../axoisConfig";
import { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { FaFileDownload } from "react-icons/fa";

const FitlerQA = ({ pageState, setpageState, user }) => {
  console.log("User id : ", user);
  const { currentMode, BACKEND_URL, t } = useStateContext();
  // eslint-disable-next-line
  const [searchText, setSearchText] = useState("");

  // eslint-disable-next-line
  const navigate = useNavigate();
  const [row, setRow] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);

  console.log("Data: ", data);

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
      return "bg-[#1c1c1c] text-white";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };


  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const renderedData = data?.QAs;

  console.log("render: ", renderedData);

  const getExportData = () => {
    const data = row?.map((qa) => ({
      question: qa.question,
      answers: qa.answers.join(", "),
    }));

    console.log("Export: ", data);
    setExportData(data);
  };

  const headers = [
    { label: "Question", key: "question" },
    { label: "Answers", key: "answers" },
  ];


  const FetchQA = async (token, page) => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/trainingdata?user_id=${user}&page=${page}`, {
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

        let res = result?.data;

        let data = result?.data?.QAs;

        let rowData = data?.map((qa, index) => ({
          id: index + 1,
          question: qa?.question || "No Questions",
          answers: qa?.answers || "No Answers",
        }));

        console.log("Row Data: ", rowData);

        setData(res);
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
      FetchQA(token, currentPage);
    }
    // eslint-disable-next-line
  }, [user, currentPage]);

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
      {!loading && row && row?.length > 0 && (
        <>
          <CSVLink data={exportData} headers={headers}>
            <Button
              className="bg-btn-primary text-white rounded-lg py-3 font-semibold mb-5"
              style={{ color: "#ffffff" }}
              onClick={getExportData}
              sx={{ marginBottom: "10px" }}
            >
              {t("export_data")} <FaFileDownload className="ml-2" />
            </Button>
          </CSVLink>

          {/* {row && row?.length > 0 ? (
            row?.map((qa, index) => (
              <Accordion key={index} className="mb-4">
                <AccordionSummary
                  expandIcon={<BsChevronCompactDown />}
                  className={getSummaryBgClass()}
                >
                  <HiBars3BottomLeft className="mr-4 mt-1" size={20} />
                  <Typography style={{ userSelect: "text" }}>
                    {qa.question}
                  </Typography>
                  <BsTrash
                    className="ml-2 mt-1 cursor-pointer"
                    // onClick={handleDeleteQuestion}
                  />
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
          )} */}
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
                <BsTrash
                  className="ml-2 mt-1 cursor-pointer"
                  // onClick={handleDeleteQuestion}
                />
              </AccordionSummary>

              <AccordionDetails className={getDetailBgClass()}>
                <Typography className="capitalize">
                  {qa?.answers.length > 0 ? (
                    qa.answers.map((ans, ansIndex) => (
                      <div key={ansIndex}>
                        {ans}
                        <hr />
                        <br />
                      </div>
                    ))
                  ) : (
                    <span>{t("no_answer")}.</span>
                  )}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}

     
          <Pagination
            count={data?.links?.last_page}
            page={currentPage}
            onChange={handlePageChange}
            color={currentMode === "dark" ? "primary" : "secondary"}
            sx={{
              "& .Mui-selected": {
                color: currentMode === "dark" ? "white" : "gray",
                backgroundColor: currentMode === "dark" ? "black" : "white",
                "&:hover": {
                  backgroundColor: currentMode === "dark" ? "black" : "white",
                },
              },
              "& .MuiPaginationItem-root": {
                color: currentMode === "dark" ? "white" : "gray",
              },
            }}
          />
        </>
      )}

      {renderedData?.length === 0 && (
        <p
          className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
        >
         {t("no_data_to_display")}
        </p>
      )}
    </div>
  );
};

export default FitlerQA;
