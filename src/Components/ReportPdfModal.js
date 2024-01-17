import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useStateContext } from "../context/ContextProvider";
import usePermission from "../utils/usePermission";
import axios from "../axoisConfig";

import { VscCallOutgoing, VscMail } from "react-icons/vsc";
import { MdClose } from "react-icons/md";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import { BsSearch } from "react-icons/bs";

const ReportPdfModal = ({ reportModal, setReportModal }) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, isLangRTL, i18n } =
    useStateContext();

  const [pdfUrl, setPdfUrl] = useState(null);

  const { hasPermission } = usePermission();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [reportMonth, setReportMonth] = useState({
    month: null,
    year: null,
  });
  const [reportMonthValue, setReportMonthValue] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [selectedUser, setSelectedUSer] = useState(null);
  const searchRef = useRef("");
  const [fetch, setFetch] = useState(true);

  const token = localStorage.getItem("auth-token");

  const fetchUsers = async (keyword = "", pageNo = 1) => {
    console.log("keyword: ", keyword);
    if (!keyword) {
      setUserLoading(true);
    }
    try {
      let url = "";
      if (keyword) {
        url = `${BACKEND_URL}/users?title=${keyword}`;
      } else {
        url = `${BACKEND_URL}/users?page=${pageNo}`;
      }
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      setUser(response?.data?.managers?.data);
      setUserLoading(false);
      setFetch(false);
    } catch (error) {
      setUserLoading(false);
      console.log(error);
      toast.error("Unable to fetch users.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setReportModal(false);
    }, 1000);
  };

  // generate report
  const generateReportPDF = (data) => {
    const doc = new jsPDF({
      format: [300, 300],
      unit: "mm",
    });

    const columns = [
      { field: "user_name", headerName: "Name" },
      { field: "salary", headerName: "Salary" },
      { field: "present_days", headerName: "Attended" },
      { field: "leave_days", headerName: "Leave" },
      { field: "late_days", headerName: "Late" },
      { field: "deducted_salary", headerName: "Deducted" },
      { field: "net_salary", headerName: "Total" },
    ];

    const headers = columns.map((column) => column.headerName);

    const tableData = data?.map((row) =>
      columns.map((column) =>
        column.renderCell ? column.renderCell({ row }) : row[column.field]
      )
    );

    if (tableData.length > 0) {
      const totalWidth = headers.length * 30;
      const fontSize = 7;

      // Add the red line above the logo and text
      doc.setDrawColor(218, 31, 38);
      doc.setLineWidth(1);
      doc.line(10, 25, doc.internal.pageSize.getWidth() - 10, 25);

      const currentDate = new Date();
      const monthName = new Intl.DateTimeFormat("en-US", {
        month: "long",
      }).format(currentDate);
      const year = currentDate.getFullYear();
      const reportMonthName = moment()
        .month(reportMonth?.month - 1)
        .format("MMMM");
      const reportText = `Salary Evaluation Report for ${reportMonthName}`;

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(reportText, 20, 15);

      doc.setTextColor("#DA1F26");
      doc.setFont("helvetica", "bold");

      const DateinNum = moment().format("YYYY-MM-DD");
      const date = `Date: ${DateinNum}`;
      doc.setTextColor("#000");
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(date, doc.internal.pageSize.getWidth() - 45, 33);

      const numColumns = 2;
      const columnWidth = (doc.internal.pageSize.getWidth() - 30) / numColumns;

      // Load the logo image
      const logoImg = new Image();
      logoImg.src = "/assets/hikal_watermark.png";
      logoImg.onload = () => {
        const originalWidth = logoImg.width; // Get the original width of the logo
        const originalHeight = logoImg.height; // Get the original height of the logo

        const desiredWidth = 20; // Set the desired width of the logo
        const scaleFactor = desiredWidth / originalWidth; // Calculate the scale factor

        // Calculate the height to maintain the original aspect ratio
        const desiredHeight = originalHeight * scaleFactor;

        // Calculate the position to place the logo in the top right corner
        const logoX = doc.internal.pageSize.getWidth() - desiredWidth - 15;
        const logoY = 8;

        // Add the logo to the PDF with the adjusted dimensions
        doc.addImage(
          logoImg.src,
          "PNG",
          logoX,
          logoY,
          desiredWidth,
          desiredHeight // Use the adjusted height here
        );
        // Add the table to the PDF

        doc.autoTable({
          head: [headers],
          body: tableData,
          tableWidth: totalWidth,
          startY: 40,
          headStyles: {
            fillColor: "#DA1F26",
          },
          styles: {
            fontSize: fontSize,
            cellPadding: 2,
            head: { fillColor: "#DA1F26" },
          },
          autoSize: true,
          minCellWidth: 40,
          margin: { top: 50, right: 15, bottom: 20, left: 15 },
        });

        // Save the PDF as Blob
        const pdfBlob = doc.output("blob");

        // Create a Blob URL
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);

        // Set the PDF URL in the component state
        setPdfUrl(pdfBlobUrl);

        // doc.save(`Salary-Report.pdf`);
      };

      // Handle image load error
      logoImg.onerror = () => {
        console.error("Error loading the logo image.");
      };
    } else {
      alert("No valid data to export!");
    }
  };

  const fetchReportDetails = async () => {};
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  useEffect(() => {
    fetchUsers();
  }, [fetch]);

  useEffect(() => {
    // Open the modal after a short delay to allow the animation to work
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={reportModal}
        // onClose={handleLeadModelClose}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        openAfterTransition
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
      >
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {userLoading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="w-full flex items-center pb-3 ">
                    <div
                      className={`${
                        isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                      } bg-primary h-10 w-1 rounded-full my-1`}
                    ></div>
                    <h1
                      className={`text-lg font-semibold ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {t("generate_report_btn")}
                    </h1>
                  </div>

                  <div className="w-full flex justify-end items-center ">
                    <Box sx={{ ...darkModeColors, marginRight: "12px" }}>
                      <FormControl
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                        sx={{
                          minWidth: "100%",
                          // border: 1,
                          borderRadius: 1,
                        }}
                      >
                        <Select
                          id="feedback"
                          value={selectedUser || "selected"}
                          label={t("filter_by_user")}
                          // onChange={(e) => handleFilter(e, 2)}
                          onChange={(e) => {
                            setSelectedUSer(e.target.value);
                            setFetch(true);
                          }}
                          size="medium"
                          className="w-full border border-gray-300 rounded "
                          displayEmpty
                          required
                          sx={{
                            border: "1px solid #000000",
                            height: "40px",

                            "& .MuiSelect-select": {
                              fontSize: 11,
                            },
                          }}
                        >
                          <MenuItem selected value="selected">
                            ---{t("select_user")}----
                          </MenuItem>
                          <MenuItem
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              // e.preventDefault();
                            }}
                          >
                            {/* <Box sx={darkModeColors}> */}
                            <TextField
                              placeholder={t("search_users")}
                              ref={searchRef}
                              sx={{
                                "& input": {
                                  border: "0",
                                },
                              }}
                              variant="standard"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <IconButton
                                      sx={{ padding: 1 }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const inputValue =
                                          searchRef.current.querySelector(
                                            "input"
                                          ).value;
                                        if (inputValue) {
                                          fetchUsers(inputValue);
                                        }
                                      }}
                                    >
                                      <BsSearch
                                        className={`text-[#AAAAAA]`}
                                        size={18}
                                      />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                            />
                            {/* </Box> */}
                          </MenuItem>

                          {user?.length > 0 ? (
                            user?.map((user) => (
                              <MenuItem value={user?.id}>
                                {user?.userName}
                              </MenuItem>
                            ))
                          ) : (
                            <h2 className="text-center">{t("no_users")}</h2>
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ ...darkModeColors, marginRight: "12px" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={reportMonthValue || new Date()?.toString()}
                          label={t("report_month")}
                          views={["month", "year"]}
                          onChange={(newValue) => {
                            if (newValue) {
                              // Extract the month digit
                              const monthDigit = moment(newValue.$d).format(
                                "M"
                              );

                              // Convert the month digit string to an integer
                              const monthDigitInt = parseInt(monthDigit, 10);
                              console.log(
                                "month digit int :: ",
                                typeof monthDigitInt
                              );

                              // Extract the year
                              const year = moment(newValue.$d).format("YYYY");

                              // Set the report month digit as an integer and the year
                              setReportMonth({
                                month: monthDigitInt,
                                year: parseInt(year, 10),
                              });
                            }
                            console.log("val:", newValue);

                            setReportMonthValue(newValue?.$d);
                          }}
                          format="MM-YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                "& input": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                          maxDate={dayjs().startOf("day").toDate()}
                        />
                      </LocalizationProvider>
                    </Box>

                    <button
                      className="bg-primary text-white rounded-md card-hover p-2 shadow-sm"
                      onClick={fetchReportDetails}
                    >
                      {t("generate_report_btn")?.toUpperCase()}
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  {pdfUrl && (
                    <iframe
                      src={pdfUrl}
                      width="100%"
                      height="600px"
                      style={{ border: "none" }}
                      title="PDF Preview"
                    ></iframe>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReportPdfModal;
