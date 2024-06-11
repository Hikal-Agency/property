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

  const clearFilters = () => {
    setFilters({
      currency: "",
      country: "",
      month: moment().format("MM"),
      year: moment().format("YYYY"),
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setPDFModal(false);
    }, 1000);
  };

  // generate report
  const generatePDF = (data, invoicesData) => {
    console.log("PDF Data:: ", data);
    console.log("Invoice Data:: ", invoicesData);
    const doc = new jsPDF({
      format: "a4",
      unit: "mm",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const paddingX = 15;
    let usedY = 50;

    const addWatermark = (doc, pageWidth, pageHeight) => {
      const watermarkUrl = "assets/Watermark.png";
      const watermarkWidth = 150;
      const watermarkHeight = 150;
      const x = (pageWidth - watermarkWidth) / 2; // Centered horizontally
      const y = (pageHeight - watermarkHeight) / 2; // Centered vertically

      doc.setGState(new doc.GState({ opacity: 0.1 }));
      doc.addImage(watermarkUrl, "PNG", x, y, watermarkWidth, watermarkHeight);
      doc.setGState(new doc.GState({ opacity: 1.0 }));
    };

    const addHeader = (doc, pageWidth) => {
      const headerImg = "assets/Header-update.jpg";
      const x = 0;
      const y = -3;
      const width = pageWidth;
      const height = 50;

      doc.addImage(headerImg, "JPEG", x, y, width, height);
    };

    const addFooter = (doc, pageWidth, pageHeight) => {
      const footerImage = "assets/Footer.jpg";
      const width = pageWidth;
      const height = 44;
      const x = 0;
      const y = pageHeight - height + 4;

      doc.addImage(footerImage, "JPEG", x, y, width, height);
    };

    const addPageContent = () => {
      addHeader(doc, pageWidth);
      addFooter(doc, pageWidth, pageHeight);
      addWatermark(doc, pageWidth, pageHeight);
    };

    doc.setFont("Arial", "bold");
    doc.setFontSize(14);
    const x = pageWidth / 2;
    const y = 55 - 4;
    doc.text(
      `STATEMENT - ${filters?.month} ${filters?.year}`,
      x,
      y,
      null,
      null,
      "center"
    );
    const textWidth = doc.getTextWidth(
      `STATEMENT - ${filters?.month} ${filters?.year}`
    );
    const titleY = y + 2;
    doc.setLineWidth(0.5);
    doc.line(x - textWidth / 2, titleY, x + textWidth / 2, titleY);
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

    usedY = 75;

    const addProfitLoss = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      doc.text("Profit/Loss: ", paddingX, usedY + 6);

      const profitColumns = [
        { field: "currency", headerName: "CURRENCY" },
        { field: "total_income", headerName: "INCOME" },
        { field: "total_expense", headerName: "EXPENSE" },
        { field: "percent", headerName: "PROFIT/LOSS %" },
        { field: "profit_loss", headerName: "PROFIT/LOSS" },
      ];

      const profitHeaders = profitColumns?.map((col) => col.headerName);
      const tableData = data?.map((row) => {
        const loss = row?.output?.toLowerCase() === "loss";
        return profitColumns?.map((col) => {
          if (col.field === "percent") {
            return {
              content:
                row[col.field] !== undefined && row[col.field] !== null
                  ? parseFloat(row[col.field]).toFixed(1) + " %"
                  : "0.0 %",
              loss: loss,
            };
          }
          if (col.field === "profit_loss") {
            return {
              content:
                row[col.field] !== undefined && row[col.field] !== null
                  ? parseFloat(row[col.field]).toFixed(2)
                  : "0.00",
              loss: loss,
            };
          }
          return {
            content: row[col.field] || "",
            loss: false,
          };
        });
      });

      if (!tableData || tableData.length === 0) {
        doc.setFont("Arial", "bold");
        doc.setFontSize(12);
        doc.text("No profit/loss data available.", paddingX, usedY + 30);
        usedY = 100;
      } else {
        doc.autoTable({
          startY: usedY + 10,
          head: [profitHeaders],
          body: tableData?.map((row) => row.map((cell) => cell.content)),
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
          didParseCell: function (data) {
            const rowIndex = data.row.index;
            const colIndex = data.column.index;
            const cellData = tableData[rowIndex][colIndex];

            if (data.section === "body" && (colIndex === 3 || colIndex === 4)) {
              if (cellData.loss) {
                data.cell.styles.textColor = "#DA1F26";
              } else {
                data.cell.styles.textColor = "#269144";
              }
            }
          },
          addPageContent: addPageContent, // Ensure header, footer, and watermark are added to new pages
        });

        const clientTableHeight = doc.lastAutoTable.finalY;
        usedY = clientTableHeight || 119;
      }
    };

    const addTransactions = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      doc.text("Transactions: ", paddingX, usedY + 13);

      const transData = [
        { field: "date", headerName: "DATE" },
        { field: "category", headerName: "CATEGORY" },
        { field: "user", headerName: "USER" },
        { field: "vendor", headerName: "VENDOR" },
        { field: "total_amount", headerName: "AMOUNT" },
      ];

      const tableHead = transData?.map((col) => col.headerName);
      const tableData = invoicesData?.map((row) => {
        const loss = row?.invoice_type.toLowerCase() === "expense";
        return transData?.map((col) => {
          if (col.field === "user") {
            return {
              content: row?.user?.userName || "",
              loss: false,
            };
          }
          if (col.field === "vendor") {
            return {
              content: row?.vendor?.vendor_name || "",
              loss: false,
            };
          }
          return {
            content: row[col.field]
              ? `${row[col.field]} ${row.currency || ""}`
              : "",
            loss: col.field === "total_amount" ? loss : false,
          };
        });
      });

      if (!tableData || tableData.length === 0) {
        doc.setFont("Arial", "bold");
        doc.setFontSize(12);
        doc.text("No transactions available.", paddingX, usedY + 30);
        usedY = 200;
      } else {
        doc.autoTable({
          startY: usedY + 17,
          head: [tableHead],
          body: tableData?.map((row) => row.map((cell) => cell.content)),
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
          didParseCell: function (data) {
            const rowIndex = data.row.index;
            const colIndex = data.column.index;
            const cellData = tableData[rowIndex][colIndex];

            if (data.section === "body" && colIndex === 4 && cellData.loss) {
              data.cell.styles.textColor = "#DA1F26";
            } else if (data.section === "body" && colIndex === 4) {
              data.cell.styles.textColor = "#269144";
            }
          },
          addPageContent: addPageContent, // Ensure header, footer, and watermark are added to new pages
        });

        const tableHeight = doc.lastAutoTable.finalY;
        usedY = tableHeight || 152;
      }

      doc.setFont("Arial", "bold");
      doc.setFontSize(10);
      doc.text(`Generated By: ${User?.userName}`, paddingX, usedY + 12);
      usedY = usedY + 6;
    };

    const addSignatureSection = () => {
      const finalPageHeight = doc.internal.pageSize.getHeight();
      const signatureY = finalPageHeight - 60; // Adjust as needed to place the signature at the bottom

      doc.setLineWidth(0.5);
      doc.line(150, signatureY, pageWidth - paddingX, signatureY);
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      const text = "Authorized Signature";
      const centerX = (150 + pageWidth - paddingX) / 2;
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      const textX = centerX - textWidth / 2;
      doc.text(text, textX, signatureY + 5);
    };

    addPageContent();
    addProfitLoss();
    addTransactions();
    addSignatureSection();

    // Save the PDF as Blob
    const pdfBlob = doc.output("blob");

    // Create a Blob URL
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    console.log("PDF Blob URL: ", pdfBlobUrl);

    // Set the PDF URL in the component state
    setPdfUrl(pdfBlobUrl);

    doc.save(`Statement-${filters?.month}-${filters?.year}.pdf`);
    return pdfBlob;
  };

  // const generatePDF = (data, invoicesData) => {
  //   console.log("PDF Data:: ", data);
  //   console.log("Invoice Data:: ", invoicesData);
  //   const doc = new jsPDF({
  //     format: "a4",
  //     unit: "mm",
  //   });

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   const pageCount = doc.internal.getNumberOfPages();
  //   const paddingX = 15;
  //   let usedY = 50;

  //   const addWatermark = () => {
  //     const watermarkUrl = "assets/Watermark.png";
  //     const watermarkWidth = 150;
  //     const watermarkHeight = 150;

  //     for (let i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);

  //       // Center the watermark
  //       const x = (pageWidth - watermarkWidth) / 2; // Centered horizontally
  //       const y = (pageHeight - watermarkHeight) / 2; // Centered vertically

  //       // Set opacity to 0.1
  //       doc.setGState(new doc.GState({ opacity: 0.1 }));

  //       // Add the watermark image
  //       doc.addImage(
  //         watermarkUrl,
  //         "PNG",
  //         x,
  //         y,
  //         watermarkWidth,
  //         watermarkHeight
  //       );

  //       // Reset opacity to default (1.0) for subsequent content
  //       doc.setGState(new doc.GState({ opacity: 1.0 }));
  //     }
  //   };

  //   addWatermark();

  //   // HEADER
  //   const addHeader = () => {
  //     const headerImg = "assets/Header-update.jpg";

  //     for (let i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       const x = 0;
  //       const y = -3;
  //       const width = pageWidth;
  //       const height = 50;

  //       doc.addImage(headerImg, "JPEG", x, y, width, height);
  //     }
  //   };
  //   addHeader();

  //   // FOOTER
  //   const addFooter = () => {
  //     const footerImage = "assets/Footer.jpg";

  //     for (let i = 1; i <= pageCount; i++) {
  //       doc.setPage(i);
  //       const width = pageWidth;
  //       const height = 44;
  //       const x = 0;
  //       const y = pageHeight - height + 4;

  //       doc.addImage(footerImage, "JPEG", x, y, width, height);
  //     }
  //   };
  //   addFooter();

  //   const addHeading = () => {
  //     const x = pageWidth / 2;
  //     const y = 50 - 4;
  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(14);
  //     doc.text(
  //       `STATEMENT - ${filters?.month} ${filters?.year}`,
  //       x,
  //       y,
  //       null,
  //       null,
  //       "center"
  //     );
  //     const textWidth = doc.getTextWidth(
  //       `STATEMENT - ${filters?.month} ${filters?.year}`
  //     );
  //     const titleY = y + 2;
  //     doc.setLineWidth(0.5);
  //     doc.line(x - textWidth / 2, titleY, x + textWidth / 2, titleY);
  //     // DATE
  //     doc.setFont("Arial", "normal");
  //     doc.setFontSize(12);
  //     const dateY = titleY + 4;
  //     doc.text(
  //       `Date: ${currentDate}`,
  //       pageWidth - paddingX,
  //       dateY,
  //       null,
  //       null,
  //       "right"
  //     );

  //     usedY = 75;
  //   };

  //   // PROFIT LOSS
  //   const addProfitLoss = () => {
  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Profit/Loss: ", paddingX, usedY + 6);

  //     const profitColumns = [
  //       { field: "currency", headerName: "CURRENCY" },
  //       { field: "total_income", headerName: "INCOME" },
  //       { field: "total_expense", headerName: "EXPENSE" },
  //       { field: "percent", headerName: "PROFIT/LOSS %" },
  //       { field: "profit_loss", headerName: "PROFIT/LOSS" },
  //     ];

  //     const profitHeaders = profitColumns?.map((col) => col.headerName);
  //     const tableData = data?.map((row) => {
  //       const loss = row?.output?.toLowerCase() === "loss";
  //       return profitColumns?.map((col) => {
  //         if (col.field === "percent") {
  //           return {
  //             content:
  //               row[col.field] !== undefined && row[col.field] !== null
  //                 ? parseFloat(row[col.field]).toFixed(1) + " %"
  //                 : "0.0 %",
  //             loss: loss,
  //           };
  //         }
  //         if (col.field === "profit_loss") {
  //           return {
  //             content:
  //               row[col.field] !== undefined && row[col.field] !== null
  //                 ? parseFloat(row[col.field]).toFixed(2)
  //                 : "0.00",
  //             loss: loss,
  //           };
  //         }
  //         return {
  //           content: row[col.field] || "",
  //           loss: false, // Only the last two columns are conditionally styled
  //         };
  //       });
  //     });

  //     if (!tableData || tableData.length === 0) {
  //       doc.setFont("Arial", "bold");
  //       doc.setFontSize(12);
  //       doc.text("No profit/loss data available.", paddingX, usedY + 30);
  //       usedY = 100;
  //     } else {
  //       doc.autoTable({
  //         startY: usedY + 10,

  //         head: [profitHeaders],
  //         body: tableData.map((row) => row.map((cell) => cell.content)),

  //         theme: "grid",
  //         headStyles: {
  //           fillColor: [238, 238, 238],
  //           textColor: [0, 0, 0],
  //           fontStyle: "bold",
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         bodyStyles: {
  //           fillColor: null,
  //           textColor: [0, 0, 0],
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         styles: {
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0],
  //         },
  //         didParseCell: function (data) {
  //           const rowIndex = data.row.index;
  //           const colIndex = data.column.index;
  //           const cellData = tableData[rowIndex][colIndex];

  //           if (data.section === "body" && (colIndex === 3 || colIndex === 4)) {
  //             // Last two columns (percent and profit_loss)
  //             if (cellData.loss) {
  //               data.cell.styles.textColor = "#DA1F26"; // Red for loss
  //             } else {
  //               data.cell.styles.textColor = "#269144"; // Green for profit
  //             }
  //           }
  //         },
  //       });

  //       const clientTableHeight = doc.lastAutoTable.finalY;
  //       usedY = clientTableHeight || 119;
  //     }
  //   };

  //   // TRANSACTIONS
  //   const addTransactions = () => {
  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Transactions: ", paddingX, usedY + 13);

  //     const transData = [
  //       { field: "date", headerName: "DATE" },
  //       { field: "category", headerName: "CATEGORY" },
  //       { field: "user", headerName: "USER" },
  //       { field: "vendor", headerName: "VENDOR" },
  //       { field: "total_amount", headerName: "AMOUNT" },
  //     ];

  //     const tableHead = transData?.map((col) => col.headerName);
  //     const tableData = invoicesData?.map((row) => {
  //       const loss = row?.invoice_type.toLowerCase() === "expense";
  //       return transData?.map((col) => {
  //         if (col.field === "user") {
  //           return {
  //             content: row?.user?.userName || "",
  //             loss: false,
  //           };
  //         }
  //         if (col.field === "vendor") {
  //           return {
  //             content: row?.vendor?.vendor_name || "",
  //             loss: false,
  //           };
  //         }
  //         return {
  //           content: row[col.field] || "",
  //           loss: col.field === "total_amount" ? loss : false,
  //         };
  //       });
  //     });

  //     if (tableData.length === 0) {
  //       doc.setFont("Arial", "bold");
  //       doc.setFontSize(12);
  //       doc.text("No transactions available.", paddingX, usedY + 30);
  //       usedY = 200;
  //     } else {
  //       doc.autoTable({
  //         startY: usedY + 17,
  //         head: [tableHead],
  //         body: tableData.map((row) => row.map((cell) => cell.content)),
  //         theme: "grid",
  //         headStyles: {
  //           fillColor: [238, 238, 238],
  //           textColor: [0, 0, 0],
  //           fontStyle: "bold",
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         bodyStyles: {
  //           fillColor: null,
  //           textColor: [0, 0, 0],
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         styles: {
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0],
  //         },
  //         didParseCell: function (data) {
  //           const rowIndex = data.row.index;
  //           const colIndex = data.column.index;
  //           const cellData = tableData[rowIndex][colIndex];

  //           if (data.section === "body" && colIndex === 4 && cellData.loss) {
  //             // Check if the column is "AMOUNT" and loss is true
  //             data.cell.styles.textColor = "#DA1F26";
  //           } else if (data.section === "body" && colIndex === 4) {
  //             data.cell.styles.textColor = "#269144";
  //           }
  //         },
  //       });

  //       const tableHeight = doc.lastAutoTable.finalY;
  //       usedY = tableHeight || 152;
  //     }

  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(10);
  //     doc.text(`Generated By: ${User?.userName}`, paddingX, usedY + 12);
  //     usedY = usedY + 6;
  //   };

  //   const addSignatureSection = () => {
  //     doc.setLineWidth(0.5);
  //     doc.line(
  //       150,
  //       usedY + 10 + 6 + 6 + 6,
  //       pageWidth - paddingX,
  //       usedY + 10 + 6 + 6 + 6
  //     );
  //     doc.setFont("Arial", "normal");
  //     doc.setFontSize(10);
  //     const text = "Authorized Signature";
  //     const centerX = (150 + pageWidth - paddingX) / 2;
  //     const textWidth =
  //       (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
  //       doc.internal.scaleFactor;
  //     const textX = centerX - textWidth / 2;
  //     doc.text(text, textX, usedY + 10 + 6 + 6 + 6 + 6);
  //   };

  //   addHeading();
  //   addProfitLoss();
  //   addTransactions();
  //   addSignatureSection();

  //   // Save the PDF as Blob
  //   const pdfBlob = doc.output("blob");

  //   // Create a Blob URL
  //   const pdfBlobUrl = URL.createObjectURL(pdfBlob);

  //   console.log("PDF Blob URL: ", pdfBlobUrl);

  //   // Set the PDF URL in the component state
  //   setPdfUrl(pdfBlobUrl);

  //   doc.save(`Statement-${filters?.month}-${filters?.year}.pdf`);
  //   return pdfBlob;
  // };
  // const generatePDF = (data, invoicesData) => {
  //   console.log("PDF Data:: ", data);
  //   console.log("Invoice Data:: ", invoicesData);
  //   const doc = new jsPDF({
  //     format: "a4",
  //     unit: "mm",
  //   });

  //   const pageWidth = doc.internal.pageSize.getWidth();
  //   const pageHeight = doc.internal.pageSize.getHeight();
  //   const paddingX = 15;
  //   let usedY = 50;

  //   const addWatermark = () => {
  //     const watermarkUrl = "assets/Watermark.png";
  //     const watermarkWidth = 150;
  //     const watermarkHeight = 150;

  //     for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
  //       doc.setPage(i);

  //       const x = (pageWidth - watermarkWidth) / 2;
  //       const y = (pageHeight - watermarkHeight) / 2;

  //       doc.setGState(new doc.GState({ opacity: 0.1 }));
  //       doc.addImage(
  //         watermarkUrl,
  //         "PNG",
  //         x,
  //         y,
  //         watermarkWidth,
  //         watermarkHeight
  //       );
  //       doc.setGState(new doc.GState({ opacity: 1.0 }));
  //     }
  //   };

  //   const addHeader = () => {
  //     const headerImg = "assets/Header-update.jpg";

  //     for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
  //       doc.setPage(i);
  //       const x = 0;
  //       const y = -3;
  //       const width = pageWidth;
  //       const height = 50;

  //       doc.addImage(headerImg, "JPEG", x, y, width, height);
  //     }
  //   };

  //   const addFooter = () => {
  //     const footerImage = "assets/Footer.jpg";

  //     for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
  //       doc.setPage(i);
  //       const width = pageWidth;
  //       const height = 44;
  //       const x = 0;
  //       const y = pageHeight - height + 4;

  //       doc.addImage(footerImage, "JPEG", x, y, width, height);
  //     }
  //   };

  //   const addHeading = () => {
  //     const x = pageWidth / 2;
  //     const y = 50 - 4;
  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(14);
  //     doc.text(
  //       `STATEMENT - ${filters?.month} ${filters?.year}`,
  //       x,
  //       y,
  //       null,
  //       null,
  //       "center"
  //     );
  //     const textWidth = doc.getTextWidth(
  //       `STATEMENT - ${filters?.month} ${filters?.year}`
  //     );
  //     const titleY = y + 2;
  //     doc.setLineWidth(0.5);
  //     doc.line(x - textWidth / 2, titleY, x + textWidth / 2, titleY);
  //     doc.setFont("Arial", "normal");
  //     doc.setFontSize(12);
  //     const dateY = titleY + 4;
  //     doc.text(
  //       `Date: ${currentDate}`,
  //       pageWidth - paddingX,
  //       dateY,
  //       null,
  //       null,
  //       "right"
  //     );

  //     usedY = 75;
  //   };

  //   const addProfitLoss = () => {
  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Profit/Loss: ", paddingX, usedY + 6);

  //     const profitColumns = [
  //       { field: "currency", headerName: "CURRENCY" },
  //       { field: "total_income", headerName: "INCOME" },
  //       { field: "total_expense", headerName: "EXPENSE" },
  //       { field: "percent", headerName: "PROFIT/LOSS %" },
  //       { field: "profit_loss", headerName: "PROFIT/LOSS" },
  //     ];

  //     const profitHeaders = profitColumns?.map((col) => col.headerName);
  //     const tableData = data?.map((row) => {
  //       const loss = row?.output?.toLowerCase() === "loss";
  //       return profitColumns?.map((col) => {
  //         if (col.field === "percent") {
  //           return {
  //             content:
  //               row[col.field] !== undefined && row[col.field] !== null
  //                 ? parseFloat(row[col.field]).toFixed(1) + " %"
  //                 : "0.0 %",
  //             loss: loss,
  //           };
  //         }
  //         if (col.field === "profit_loss") {
  //           return {
  //             content:
  //               row[col.field] !== undefined && row[col.field] !== null
  //                 ? parseFloat(row[col.field]).toFixed(2)
  //                 : "0.00",
  //             loss: loss,
  //           };
  //         }
  //         return {
  //           content: row[col.field] || "",
  //           loss: false,
  //         };
  //       });
  //     });

  //     if (!tableData || tableData.length === 0) {
  //       doc.setFont("Arial", "bold");
  //       doc.setFontSize(12);
  //       doc.text("No profit/loss data available.", paddingX, usedY + 30);
  //       usedY = 100;
  //     } else {
  //       doc.autoTable({
  //         startY: usedY + 10,

  //         head: [profitHeaders],
  //         body: tableData.map((row) => row.map((cell) => cell.content)),

  //         theme: "grid",
  //         headStyles: {
  //           fillColor: [238, 238, 238],
  //           textColor: [0, 0, 0],
  //           fontStyle: "bold",
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         bodyStyles: {
  //           fillColor: null,
  //           textColor: [0, 0, 0],
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         styles: {
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0],
  //         },
  //         didParseCell: function (data) {
  //           const rowIndex = data.row.index;
  //           const colIndex = data.column.index;
  //           const cellData = tableData[rowIndex][colIndex];

  //           if (data.section === "body" && (colIndex === 3 || colIndex === 4)) {
  //             if (cellData.loss) {
  //               data.cell.styles.textColor = "#DA1F26";
  //             } else {
  //               data.cell.styles.textColor = "#269144";
  //             }
  //           }
  //         },
  //       });

  //       const clientTableHeight = doc.lastAutoTable.finalY;
  //       usedY = clientTableHeight || 119;
  //     }
  //   };

  //   const addTransactions = () => {
  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(12);
  //     doc.text("Transactions: ", paddingX, usedY + 13);

  //     const transData = [
  //       { field: "date", headerName: "DATE" },
  //       { field: "category", headerName: "CATEGORY" },
  //       { field: "user", headerName: "USER" },
  //       { field: "vendor", headerName: "VENDOR" },
  //       { field: "total_amount", headerName: "AMOUNT" },
  //     ];

  //     const tableHead = transData?.map((col) => col.headerName);
  //     const tableData = invoicesData?.map((row) => {
  //       const loss = row?.invoice_type.toLowerCase() === "expense";
  //       return transData?.map((col) => {
  //         if (col.field === "user") {
  //           return {
  //             content: row?.user?.userName || "",
  //             loss: false,
  //           };
  //         }
  //         if (col.field === "vendor") {
  //           return {
  //             content: row?.vendor?.vendor_name || "",
  //             loss: false,
  //           };
  //         }
  //         return {
  //           content: row[col.field] || "",
  //           loss: col.field === "total_amount" ? loss : false,
  //         };
  //       });
  //     });

  //     if (tableData.length === 0) {
  //       doc.setFont("Arial", "bold");
  //       doc.setFontSize(12);
  //       doc.text("No transactions available.", paddingX, usedY + 30);
  //       usedY = 200;
  //     } else {
  //       doc.autoTable({
  //         startY: usedY + 17,
  //         head: [tableHead],
  //         body: tableData.map((row) => row.map((cell) => cell.content)),
  //         theme: "grid",
  //         headStyles: {
  //           fillColor: [238, 238, 238],
  //           textColor: [0, 0, 0],
  //           fontStyle: "bold",
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         bodyStyles: {
  //           fillColor: null,
  //           textColor: [0, 0, 0],
  //           halign: "center",
  //           font: "Arial",
  //           fontSize: 12,
  //         },
  //         styles: {
  //           lineWidth: 0.1,
  //           lineColor: [0, 0, 0],
  //         },
  //         didParseCell: function (data) {
  //           const rowIndex = data.row.index;
  //           const colIndex = data.column.index;
  //           const cellData = tableData[rowIndex][colIndex];

  //           if (data.section === "body" && colIndex === 4 && cellData.loss) {
  //             data.cell.styles.textColor = "#DA1F26";
  //           } else if (data.section === "body" && colIndex === 4) {
  //             data.cell.styles.textColor = "#269144";
  //           }
  //         },
  //       });

  //       const tableHeight = doc.lastAutoTable.finalY;
  //       usedY = tableHeight || 152;
  //     }

  //     doc.setFont("Arial", "bold");
  //     doc.setFontSize(10);
  //     doc.text(`Generated By: ${User?.userName}`, paddingX, usedY + 12);
  //     usedY = usedY + 18; // Adjust the spacing to fit the signature section
  //   };

  //   const addSignatureSection = () => {
  //     if (usedY + 30 > pageHeight - 50) {
  //       doc.addPage();
  //       addHeader();
  //       addFooter();
  //       addWatermark();
  //       usedY = 50;
  //     }

  //     doc.setLineWidth(0.5);
  //     doc.line(
  //       150,
  //       usedY + 10 + 6 + 6 + 6,
  //       pageWidth - paddingX,
  //       usedY + 10 + 6 + 6 + 6
  //     );
  //     doc.setFont("Arial", "normal");
  //     doc.setFontSize(10);
  //     const text = "Authorized Signature";
  //     const centerX = (150 + pageWidth - paddingX) / 2;
  //     const textWidth =
  //       (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
  //       doc.internal.scaleFactor;
  //     const textX = centerX - textWidth / 2;
  //     doc.text(text, textX, usedY + 10 + 6 + 6 + 6 + 6);
  //   };

  //   addHeading();
  //   addProfitLoss();
  //   addTransactions();
  //   addSignatureSection();

  //   // Save the PDF as Blob
  //   const pdfBlob = doc.output("blob");

  //   // Create a Blob URL
  //   const pdfBlobUrl = URL.createObjectURL(pdfBlob);

  //   console.log("PDF Blob URL: ", pdfBlobUrl);

  //   // Set the PDF URL in the component state
  //   setPdfUrl(pdfBlobUrl);

  //   doc.save(`Statement-${filters?.month}-${filters?.year}.pdf`);
  //   return pdfBlob;
  // };

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

    const params = {
      month: filters?.month,
      year: filters?.year,
      include: 1,
    };

    // Conditionally add country and currency if they have values
    if (filters?.country) {
      params.country = filters.country;
    }
    if (filters?.currency) {
      params.currency = filters.currency;
    }

    try {
      const getStatements = await axios.get(`${BACKEND_URL}/statements`, {
        params: params,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("get statements:: ", getStatements);

      const statementsData = getStatements?.data?.data;
      const invoicesList = getStatements?.data?.invoices;

      console.log("Statements List:", statementsData);
      console.log("invoices length: ", invoicesList);

      // call pdf generation function
      generatePDF(statementsData, invoicesList);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Unable to fetch data", {
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
                    <button
                      className="bg-btn-primary py-2 px-4 mr-3 text-white rounded-md"
                      onClick={clearFilters}
                    >
                      {t("clear_all")}
                    </button>
                    <Box
                      sx={{
                        ...darkModeColors,
                        marginRight: "12px",
                        marginTop: "15px",
                        width: "100%",
                      }}
                    >
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
                        marginTop: "15px",
                        width: "100%",

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
                        marginTop: "15px",
                        width: "100%",

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
