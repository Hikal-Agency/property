import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Box,
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

const ReportPdfModal = ({
  reportModal,
  setReportModal,

  LeadData,
  setLeadData,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, isLangRTL, i18n } =
    useStateContext();

  const [pdfUrl, setPdfUrl] = useState(null);

  const { hasPermission } = usePermission();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [reportDetails, setReportDetails] = useState([]);
  const [open, setOpen] = useState(false);

  const [addNoteloading, setaddNoteloading] = useState(false);
  const [lastNote, setLastNote] = useState("");
  const [lastNoteDate, setLastNoteDate] = useState("");
  const [lastNoteAddedBy, setLastNoteAddedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportMonth, setReportMonth] = useState({
    month: null,
    year: null,
  });
  const [reportMonthValue, setReportMonthValue] = useState("");

  console.log("salary report:: ", reportDetails);

  console.log("report month:: ", reportMonth);

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

  const fetchSalaryCalc = async () => {
    setLoading(true);

    if (!reportMonth?.month || !reportMonth?.year) {
      setLoading(false);
      toast.error("Kindly select month and year first.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    try {
      const response = await axios.post(
        `https://reports.hikalcrm.com/api/calculate_salary`,
        { month: reportMonth.month, year: reportMonth.year, agency: 1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Generating preview of report.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("salary Calc: ", response);

      let rowsDataArray = response?.data?.data;

      let rowsdata = rowsDataArray?.map((row, index) => ({
        id: index,
        deducted_salary: row?.deducted_salary || "-",
        late_day_salary: row?.late_day_salary || "-",
        late_days: row?.late_days || "-",
        leave_day_salary: row?.leave_day_salary || "-",
        leave_days: row?.leave_days || "-",
        net_salary: row?.net_salary || "-",
        present_days: row?.present_days || "-",
        salary: row?.salary || "-",
        salary_per_day: row?.salary_per_day || "-",
        user_id: row?.user_id || "-",
        user_name: row?.user_name || "-",
        weekends: row?.weekends || "-",
      }));

      setReportDetails(rowsdata);
      generateReportPDF(rowsDataArray);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("ERROR::: ", error);
      toast.error("Unable to download report.", {
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

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const FetchLead = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/leads/${LeadData}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("leads: ", result);

      setLeadData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const AddNote = (note = "") => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");

    const data = {
      leadId: LeadData.leadId || LeadData.id,
      leadNote: note || AddNoteTxt,
      addedBy: User?.id,
      addedByName: User?.userName,
    };
    axios
      .post(`${BACKEND_URL}/leadNotes`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setaddNoteloading(false);
        setAddNoteTxt("");
        if (!note) {
          toast.success("Note added Successfully", {
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
      })
      .catch((err) => {
        setaddNoteloading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const fetchLastNote = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(
        `${BACKEND_URL}/lastnote/${LeadData?.leadId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const lastNoteText = result.data?.notes?.data[0]?.leadNote;
      const lastNoteDate = result.data?.notes?.data[0]?.creationDate;
      const lastNoteAddedBy = result.data?.notes?.data[0]?.addedByName;
      setLastNote(lastNoteText);
      setLastNoteDate(lastNoteDate);
      setLastNoteAddedBy(lastNoteAddedBy);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LeadData?.leadId) {
      fetchLastNote();
    }

    console.log("leaddata: ", LeadData);

    if (typeof LeadData === "number") {
      FetchLead(LeadData);
    }

    console.log("LeadData::", LeadData);
  }, [LeadData]);

  // Replace last 4 digits with "*"
  const stearics =
    LeadData?.leadContact
      ?.replaceAll(" ", "")
      ?.slice(0, LeadData?.leadContact?.replaceAll(" ", "")?.length - 4) +
    "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = LeadData?.leadContact?.replaceAll(" ", "");
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = LeadData?.leadContact?.replaceAll(" ", "");
  }

  const EmailButton = ({ email }) => {
    // console.log("email:::::::::::::::::::: ", email);
    const handleEmailClick = (event) => {
      event.stopPropagation();
      window.location.href = `mailto:${email}`;
    };

    return (
      <button className="email-button" onClick={handleEmailClick}>
        <VscMail size={16} />
      </button>
    );
  };

  const CallButton = ({ phone }) => {
    const handlePhoneClick = (event) => {
      event.stopPropagation();
      window.location.href = `tel:${phone}`;
    };

    return (
      <button className="call-button" onClick={handlePhoneClick}>
        <VscCallOutgoing size={16} />
      </button>
    );
  };

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
            {loading ? (
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

                  <div className="w-full flex justify-end items-center">
                    <Box sx={{ ...darkModeColors, marginRight: "12px" }}>
                      {/* <Select
                        id="monthSelect"
                        size="small"
                        className="w-[100px]"
                        displayEmpty
                        //   value={selectedDay || "Today"}
                        //   onChange={handleDayFilter}
                      >
                       
                        <MenuItem selected value="today">
                          {t("today")}
                        </MenuItem>
                        <MenuItem value="yesterday">{t("yesterday")}</MenuItem>
                      </Select> */}
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
                      onClick={fetchSalaryCalc}
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
