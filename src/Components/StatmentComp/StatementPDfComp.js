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
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { VscCallOutgoing, VscMail } from "react-icons/vsc";
import { MdClose } from "react-icons/md";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import Select from "react-select";
import { countries_list, currencies } from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";

const StatementPDFComp = ({
  pdfModal,
  setPDFModal,

  LeadData,
  setLeadData,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    t,
    isLangRTL,
    i18n,
    primaryColor,
  } = useStateContext();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [filters, setFilters] = useState({
    currency: "",
    country: "",
    month: moment().format("MM"),
    year: moment().format("YYYY"),
  });
  const currentDate = moment().format("YYYY-MM-DD");

  const { hasPermission } = usePermission();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setPDFModal(false);
    }, 1000);
  };

  // generate report
  const generatePDF = (data) => {
    console.log("PDF Data:: ", data);
    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageCount = doc.internal.getNumberOfPages();
    const paddingX = 15;
    let usedY = 50;

    const addWatermark = () => {
      const watermarkUrl = "assets/Watermark.png";
      const watermarkWidth = 150;
      const watermarkHeight = 150;

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Center the watermark
        const x = (pageWidth - watermarkWidth) / 2; // Centered horizontally
        const y = (pageHeight - watermarkHeight) / 2; // Centered vertically

        // Set opacity to 0.1
        doc.setGState(new doc.GState({ opacity: 0.1 }));

        // Add the watermark image
        doc.addImage(
          watermarkUrl,
          "PNG",
          x,
          y,
          watermarkWidth,
          watermarkHeight
        );

        // Reset opacity to default (1.0) for subsequent content
        doc.setGState(new doc.GState({ opacity: 1.0 }));
      }
    };

    addWatermark();

    // HEADER
    const addHeader = () => {
      const headerImg = "assets/Header-update.jpg";

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const x = 0;
        const y = -3;
        const width = pageWidth;
        const height = 50;

        doc.addImage(headerImg, "JPEG", x, y, width, height);
      }
    };
    addHeader();

    // FOOTER
    const addFooter = () => {
      const footerImage = "assets/Footer.jpg";

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const width = pageWidth;
        const height = 44;
        const x = 0;
        const y = pageHeight - height + 4;

        doc.addImage(footerImage, "JPEG", x, y, width, height);
      }
    };
    addFooter();

    const addHeading = () => {
      const x = pageWidth / 2;
      const y = 50 - 4;
      doc.setFont("Arial", "bold");
      doc.setFontSize(14);
      doc.text("TAX INVOICE", x, y, null, null, "center");
      const textWidth = doc.getTextWidth("TAX INVOICE");
      const titleY = y + 2;
      doc.setLineWidth(0.5);
      doc.line(x - textWidth / 2, titleY, x + textWidth / 2, titleY);
      // DATE
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
      const dateY = titleY + 4;
      doc.text(
        `Date: ${currentDate}`,
        pageWidth - paddingX,
        dateY,
        null,
        null,
        "right"
      );
      // INVOICE ID
      doc.text(
        `Invoice No.: ${data?.invoice_id}`,
        pageWidth - paddingX,
        dateY + 6,
        null,
        null,
        "right"
      );
      usedY = 54;
    };

    const addCompanyDetails = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
      // VENDOR
      doc.text("Bill to: ", paddingX, usedY + 15);
      doc.setFont("Arial", "bold");
      doc.text(`${data?.vendor_name}`, paddingX, usedY + 15 + 6);
      doc.setFont("Arial", "normal");

      // const maxWidth = doc.internal.pageSize.getWidth() - 2 * paddingX; // Subtracting padding from both sides
      const maxWidth = 90;

      // Split the address text to fit within the specified width
      const addressLines = doc.splitTextToSize(`${data?.address}`, maxWidth);

      // Render each line of the address
      let currentY = usedY + 15 + 6 + 6;
      addressLines.forEach((line, index) => {
        doc.text(line, paddingX, currentY + index * 5); // Adjust line spacing as needed (10 units here)
      });

      const addressHeight = addressLines.length * 5 + 1; // Total height occupied by the address lines
      const trnY = currentY + addressHeight; // Adjust Y position for the TRN

      doc.text(`TRN No: ${data?.trn}`, paddingX, trnY);
      // doc.text(`TRN No: ${data?.trn}`, paddingX, usedY + 15 + 6 + 6 + 6);
      // COMPANY
      doc.text("Company: ", pageWidth / 2 + paddingX, usedY + 15);
      doc.setFont("Arial", "bold");
      doc.text(`${data?.company}`, pageWidth / 2 + paddingX, usedY + 15 + 6);
      doc.setFont("Arial", "normal");
      doc.text(
        `TRN No: ${data?.company_trn}`,
        pageWidth / 2 + paddingX,
        usedY + 15 + 6 + 6
      );
      doc.text(
        `Email: ${data?.company_email}`,
        pageWidth / 2 + paddingX,
        usedY + 15 + 6 + 6 + 6
      );
      doc.text(
        `Telephone: ${data?.company_tele}`,
        pageWidth / 2 + paddingX,
        usedY + 15 + 6 + 6 + 6 + 6
      );
      usedY = 93;
    };

    // CLIENT
    const addClientDetails = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      // TABLE
      doc.autoTable({
        startY: usedY + 10,
        head: [["CLIENT NAME", "UNIT NO", "PROJECT NAME"]],
        body: [[`${data?.leadName}`, `${data?.unit}`, `${data?.project}`]],
        theme: "grid",
        headStyles: {
          fillColor: [238, 238, 238],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
          font: "Arial",
          fontSize: 12,
        },
        bodyStyles: {
          fillColor: null,
          textColor: [0, 0, 0],
          halign: "center",
          font: "Arial",
          fontSize: 12,
        },
        styles: {
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
      });

      const clientTableHeight = doc.lastAutoTable.finalY;
      usedY = clientTableHeight || 119;
    };
    // COMMISSION
    const addTable = () => {
      doc.autoTable({
        startY: usedY + 10,
        head: [
          [
            `SALES VALUE (${data?.currency})`,
            "COMMISSION %",
            "NET VALUE BEFORE VAT",
            "VAT VALUE",
            `GROSS VALUE (${data?.currency})`,
          ],
        ],
        body: [
          [
            `${data?.amount}`,
            `${data?.comm_percent}`,
            `${data?.comm_amount}`,
            `${data?.vat}`,
            `${data?.total_amount}`,
          ],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [238, 238, 238],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          halign: "center",
          font: "Arial",
          fontSize: 12,
        },
        bodyStyles: {
          fillColor: null,
          textColor: [0, 0, 0],
          halign: "center",
          font: "Arial",
          fontSize: 12,
        },
        styles: {
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
      });

      const tableHeight = doc.lastAutoTable.finalY;
      usedY = tableHeight || 152;

      doc.setFont("Arial", "bold");
      doc.text(
        `TOTAL: ${data?.currency} ${data?.total_amount}`,
        pageWidth - paddingX,
        usedY + 6,
        null,
        null,
        "right"
      );
      usedY = usedY + 6;
    };

    const addBankDetails = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      doc.text(
        "All cheques payable to the following account.",
        paddingX,
        usedY + 10
      );

      doc.autoTable({
        startY: usedY + 10 + 10,
        head: [
          ["Bank Name", `${data?.bank_name}`],
          ["Bank Address", `${data?.bank_address}`],
          ["Bank Account Name", `${data?.bank_acc_name}`],
          ["Account Number", `${data?.bank_acc_no}`],
          ["IBAN", `${data?.bank_iban}`],
          ["SWIFT Code", `${data?.bank_swift_code}`],
        ],
        body: [],
        theme: "grid",
        headStyles: {
          fillColor: null,
          textColor: [0, 0, 0],
          font: "Arial",
          fontSize: 10,
        },
        styles: {
          fontSize: 10,
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
      });
      const bankTableHeight = doc.lastAutoTable.finalY;
      usedY = bankTableHeight;
    };

    const addSignatureSection = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(10);
      doc.text("Sincerely,", paddingX, usedY + 10);
      doc.text(
        "Mr. MOHAMED MEDHAT FATHY IBRAHIM HIKAL",
        paddingX,
        usedY + 10 + 6
      );
      doc.text("CEO", paddingX, usedY + 10 + 6 + 6);
      doc.text("HIKAL REAL ESTATE L.L.C", paddingX, usedY + 10 + 6 + 6 + 6);

      doc.setLineWidth(0.5);
      doc.line(
        150,
        usedY + 10 + 6 + 6 + 6,
        pageWidth - paddingX,
        usedY + 10 + 6 + 6 + 6
      );
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      const text = "Authorized Signature";
      const centerX = (150 + pageWidth - paddingX) / 2;
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = centerX - textWidth / 2;
      doc.text(text, textX, usedY + 10 + 6 + 6 + 6 + 6);
    };

    addHeading();
    addCompanyDetails();
    addClientDetails();
    addTable();
    addBankDetails();
    addSignatureSection();

    // Save the PDF as Blob
    const pdfBlob = doc.output("blob");

    // Create a Blob URL
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    console.log("PDF Blob URL: ", pdfBlobUrl);

    // Set the PDF URL in the component state
    setPdfUrl(pdfBlobUrl);

    doc.save(`${data?.invoice_id} - ${data?.vendor_name}.pdf`);
    return pdfBlob;
  };

  const token = localStorage.getItem("auth-token");

  const fetchStatements = async () => {
    setLoading(true);

    if (!filters?.month || !filters?.year) {
      toast.error("Month and year are required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      return;
    }
    try {
      const params = {
        month: filters?.month,
        year: filters?.year,
      };

      // Conditionally add country and currency if they have values
      if (filters?.country) {
        params.country = filters.country;
      }
      if (filters?.currency) {
        params.currency = filters.currency;
      }
      const response = await axios.get(`${BACKEND_URL}/statements`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("statements list:: ", response);
      const data = response?.data?.data;
      generatePDF(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching statements:", error);
      toast.error("Unable to fetch the Statments List", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
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
        open={pdfModal}
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
                      {t("download_statment")}
                    </h1>
                  </div>

                  <div className="w-full flex justify-end items-center">
                    <Box sx={{ ...darkModeColors, marginRight: "12px" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={dayjs(`${filters?.year}-${filters?.month}-01`)}
                          label={t("month_year")}
                          views={["month", "year"]}
                          onChange={(newValue) => {
                            // Extract month and year as numbers from newValue
                            const month = newValue
                              ? newValue.$d.getMonth() + 1
                              : "";
                            const year = newValue
                              ? newValue.$d.getFullYear()
                              : "";

                            setFilters((prev) => ({
                              ...prev,
                              month: month.toString().padStart(2, "0"), // Ensure month is two digits
                              year: year.toString(),
                            }));
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
                                marginBottom: "20px",
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

                    <Box
                      sx={{
                        ...darkModeColors,
                        marginRight: "12px",
                        // "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                        //   {
                        //     right: isLangRTL(i18n.language)
                        //       ? "2.5rem"
                        //       : "inherit",
                        //     transformOrigin: isLangRTL(i18n.language)
                        //       ? "right"
                        //       : "left",
                        //   },
                        // "& legend": {
                        //   textAlign: isLangRTL(i18n.language)
                        //     ? "right"
                        //     : "left",
                        // },
                      }}
                    >
                      <Select
                        options={currencies(t)?.map((curr) => ({
                          value: curr?.value,
                          label: curr?.label,
                        }))}
                        value={currencies(t)?.filter(
                          (curr) => curr?.value === filters?.currency
                        )}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            currency: e.value,
                          });
                        }}
                        placeholder={t("label_currency")}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                        required
                      />
                    </Box>
                    <Box
                      sx={{
                        ...darkModeColors,
                        marginRight: "12px",

                        // "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                        //   {
                        //     right: isLangRTL(i18n.language)
                        //       ? "2.5rem"
                        //       : "inherit",
                        //     transformOrigin: isLangRTL(i18n.language)
                        //       ? "right"
                        //       : "left",
                        //   },
                        // "& legend": {
                        //   textAlign: isLangRTL(i18n.language)
                        //     ? "right"
                        //     : "left",
                        // },
                      }}
                    >
                      <Select
                        options={countries_list(t)?.map((country) => ({
                          value: country?.value,
                          label: country?.label,
                        }))}
                        value={countries_list(t)?.filter(
                          (country) => country?.value === filters?.country
                        )}
                        onChange={(e) => {
                          setFilters({
                            ...filters,
                            country: e.value,
                          });
                        }}
                        placeholder={t("label_country")}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                        required
                      />
                    </Box>

                    <button
                      className="bg-primary text-white rounded-md card-hover p-2 shadow-sm"
                      onClick={fetchStatements}
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

export default StatementPDFComp;
