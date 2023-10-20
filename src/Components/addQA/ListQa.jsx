
import { HiBars3BottomLeft } from "react-icons/hi2";
import { useStateContext } from "../../context/ContextProvider";
import React, { useState, useEffect } from "react";
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
import { BsChevronCompactDown } from "react-icons/bs";
import { FaFileDownload } from "react-icons/fa";
import Pagination from "@mui/material/Pagination";

const ListQa = ({ pageState, setpageState }) => {
  const { currentMode, themeBgImg, BACKEND_URL, primaryColor, t } = useStateContext();
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
      ? (themeBgImg ? "blur-bg-dark text-white" : "bg-[#1C1C1C] text-white")
      : (themeBgImg ? "blur-bg-light text-gray-800" : "bg-[#EEEEEE] text-gray-800");
  };

  const getDetailBgClass = () => {
    return currentMode === "dark"
      ? (themeBgImg ? "blur-bg-dark text-white" : "bg-[#1C1C1C] text-white")
      : (themeBgImg ? "blur-bg-light text-gray-800" : "bg-[#EEEEEE] text-gray-800");
  };


  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const renderedData = data?.QAs;

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
                  className="bg-btn-primary text-white rounded-lg py-3 font-semibold mb-5"
                  style={{color: "#ffffff" }}
                  onClick={getExportData}
                  sx={{ marginBottom: "10px" }}
                >
                  {t("export_data")}
                  <FaFileDownload className="ml-2" />
                </Button>
              </CSVLink>
            </div>
          </div>

          {renderedData?.map((qa, index) => (
            <Accordion key={index} className={`mb-4`}>
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
            color="secondary"
            className={{ ul: classes.ul }}
            sx={{
              "& .Mui-selected": {
                color: "white",
                backgroundColor: `${primaryColor} !important`,
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
          {t("no_data_to_display")}
        </p>
      )}
    </div>
  );
};

export default ListQa;

