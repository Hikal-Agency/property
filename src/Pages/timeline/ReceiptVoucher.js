import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
  FormControl,
  MenuItem,
} from "@mui/material";
import Select from "react-select";

import { currencies } from "../../Components/_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose } from "react-icons/md";
import { selectStyles } from "../../Components/_elements/SelectStyles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import { fontSize } from "@mui/system";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const ReceiptVoucher = ({
  receiptVoucher,
  setReceiptVoucher,
  Feedback,
  data,
}) => {
  console.log("receipt voucher: ", receiptVoucher);
  console.log("closed deals data: ", data);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    fontFam,
    t,
    isLangRTL,
    i18n,
    primaryColor,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const currentDate = moment().format("YYYY-MM-DD");

  const [pdfUrl, setPDFUrl] = useState(false);

  const [receiptVoucherData, setCommReqData] = useState({
    cheque_number: null,
    unit: data?.unit || null,
    invoice_id: receiptVoucher?.id || null,
    date: moment().format("YYYY-MM-DD"),
    currency: receiptVoucher?.currency || "AED",
    developer: receiptVoucher?.vendor?.vendor_name || null,
    amount: receiptVoucher?.total_amount || 0,
    bank_name: null,
  });

  console.log("comm req data:: ", receiptVoucherData);

  const handleChange = (e) => {
    console.log("E::: ", e);
    const value = e.target.value;
    const id = e.target.id;

    setCommReqData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setReceiptVoucher(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

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

    // WATERMARK
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
      doc.text("Receipt Voucher", x, y, null, null, "center");
      const textWidth = doc.getTextWidth("Receipt Voucher");
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

      usedY = 54;
    };

    const addCompanyDetails = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
      // VENDOR
      doc.text("Received From: ", paddingX, usedY + 15);
      doc.setFont("Arial", "bold");
      doc.text(`${data?.developer}`, paddingX, usedY + 15 + 6);

      usedY = 93;
    };

    // CLIENT
    const addClientDetails = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      // TABLE
      doc.autoTable({
        startY: usedY + 10,
        head: [
          [
            "UNIT DETAIL",
            "BROKER COMPANY",
            "TOTAL COMMISSION",
            "CHEQUE NUMBER",
            "BANK",
          ],
        ],
        body: [
          [
            `${data?.unit}`,
            `HIKAL REAL ESTATE L.L.C.`,
            `${data?.amount}`,
            `${data?.cheque_number}`,
            `${data?.bank_name}`,
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

      const clientTableHeight = doc.lastAutoTable.finalY;
      usedY = clientTableHeight || 119;
    };

    const addMessage = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      doc.text("Being:", paddingX, usedY + 30);
      doc.text(
        `We, HIKAL REAL ESTATE L.L.C. received with thanks the sum of ${data?.currency}  ${data?.amount} as One Cheque,as a commission amount `,
        paddingX,
        usedY + 39
      );
      doc.text(`for selling mentioned unit above.`, paddingX, usedY + 44);

      usedY = 215;
    };

    const addSignatureSection = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(10);

      doc.text("Received By:", paddingX, usedY + 10 + 6 + 6);
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
    addMessage();
    addSignatureSection();

    // Save the PDF as Blob
    const pdfBlob = doc.output("blob");

    // Create a Blob URL
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    console.log("PDF Blob URL: ", pdfBlobUrl);

    // Set the PDF URL in the component state
    setPDFUrl(pdfBlobUrl);

    doc.save(`${data?.invoice_id} - ${data?.developer}.pdf`);
    return pdfBlob;
  };

  console.log("TOTAL:: ", receiptVoucherData?.total_amount);

  return (
    <Modal
      keepMounted
      open={receiptVoucher}
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
        className={`${isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${isClosing
            ? isLangRTL(i18n.language)
              ? "modal-close-left"
              : "modal-close-right"
            : ""
          } w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
          onClick={handleClose}
          className={`${isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
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
          className={` ${currentMode === "dark"
            ? "bg-dark text-white"
            : "bg-light text-black"
            } ${isLangRTL(i18n.language)
              ? currentMode === "dark" && " border-primary border-r-2"
              : currentMode === "dark" && " border-primary border-l-2"
            }
            p-5 h-[100vh] w-[85vw] overflow-y-scroll 
          `}
        >
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <HeadingTitle
                title={t("receipt_voucher_heading")}
              />

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {/* PROJECT DETAILS  */}
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                    {
                      right: isLangRTL(i18n.language)
                        ? "2.5rem"
                        : "inherit",
                      transformOrigin: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                    "& .css-10drtbx-MuiButtonBase-root-MuiCheckbox-root": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#2B2830"
                    }
                  }}
                  className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"}
                  p-5`}
                >
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("project_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5"></div>
                  {/* UNIT */}
                  <TextField
                    id="unit"
                    type={"text"}
                    label={t("unit")}
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        zIndex: 1,
                      },
                    }}
                    variant="outlined"
                    size="small"
                    value={receiptVoucherData?.unit}
                    onChange={(e) => handleChange(e)}
                    required
                  />

                  <div className="grid grid-cols-3">
                    {/* CURRENCY */}
                    <Select
                      id="currency"
                      options={currencies(t)}
                      value={currencies(t)?.find(
                        (curr) =>
                          curr.value === receiptVoucherData?.currency
                      )}
                      onChange={(e) => {
                        setCommReqData({
                          ...receiptVoucherData,
                          currency: e.value,
                        });
                      }}
                      placeholder={t("label_select_currency")}
                      className={`mb-5`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                    {/* SELLING AMOUNT */}
                    <TextField
                      id="amount"
                      type={"number"}
                      label={t("commission_amount")}
                      className="w-full col-span-2"
                      sx={{
                        "&": {
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={receiptVoucherData?.amount}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </Box>

                {/* DEVELOPER DETAILS  */}
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                    {
                      right: isLangRTL(i18n.language)
                        ? "2.5rem"
                        : "inherit",
                      transformOrigin: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                    "& .css-10drtbx-MuiButtonBase-root-MuiCheckbox-root": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#2B2830"
                    }
                  }}
                  className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"}
                  p-5`}
                >
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("developer_detail")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5"></div>
                  {/* VENDOR NAME */}
                  <TextField
                    id="developer"
                    type={"text"}
                    label={t("label_dev_name")}
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        zIndex: 1,
                      },
                    }}
                    InputLabelProps={{
                      shrink: !!receiptVoucherData?.developer,
                    }}
                    variant="outlined"
                    size="small"
                    value={receiptVoucherData?.developer}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </Box>

                {/* CHEQUE DETAILS */}
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                    {
                      right: isLangRTL(i18n.language)
                        ? "2.5rem"
                        : "inherit",
                      transformOrigin: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language)
                        ? "right"
                        : "left",
                    },
                    "& .css-10drtbx-MuiButtonBase-root-MuiCheckbox-root": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#2B2830"
                    }
                  }}
                  className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"}
                  p-5`}
                >
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("cheque_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5"></div>

                  {/* CHEQUE DATE */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={receiptVoucherData?.date}
                      label={t("date")}
                      views={["day", "month", "year"]}
                      onChange={(newValue) => {
                        const formattedDate = moment(newValue?.$d).format(
                          "YYYY-MM-DD"
                        );

                        setCommReqData((prev) => ({
                          ...prev,
                          date: formattedDate,
                        }));
                      }}
                      format="DD-MM-YYYY"
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
                            marginBottom: "15px",
                          }}
                          fullWidth
                          size="small"
                          {...params}
                          onKeyDown={(e) => e.preventDefault()}
                          readOnly={true}
                        />
                      )}
                    // maxDate={dayjs().startOf("day").toDate()}
                    />
                  </LocalizationProvider>

                  {/* CHEQUE NUMBER  */}
                  <TextField
                    id="cheque_number"
                    type={"text"}
                    label={t("cheque_number")}
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        zIndex: 1,
                      },
                    }}
                    variant="outlined"
                    size="small"
                    value={receiptVoucherData?.cheque_number}
                    onChange={(e) => handleChange(e)}
                  />

                  {/* BANK NAME  */}
                  <TextField
                    id="bank_name"
                    type={"text"}
                    label={t("bank_name")}
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                        zIndex: 1,
                      },
                    }}
                    variant="outlined"
                    size="small"
                    value={receiptVoucherData?.bank_name}
                    onChange={(e) => handleChange(e)}
                  />
                </Box>
              </div>

              <button
                // type="submit"
                // size="medium"
                style={{
                  color: "white",
                  fontFamily: fontFam,
                }}
                className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                  } w-full text-white p-3 my-5 font-semibold`}
                onClick={() => generatePDF(receiptVoucherData)}
                disabled={btnloading ? true : false}
              >
                {btnloading ? (
                  <CircularProgress
                    size={23}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <span>{t("create")}</span>
                )}
              </button>
            </>
          )}
          <div className="p-5">
            {pdfUrl && !loading && (
              <iframe
                src={pdfUrl}
                width="100%"
                height="600px"
                style={{ border: "none" }}
                title="PDF Preview"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptVoucher;
