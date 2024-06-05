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

  const [updatedField, setUpdatedField] = useState("");
  const [pdfUrl, setPDFUrl] = useState(false);

  const [receiptVoucherData, setCommReqData] = useState({
    cheque_number: null,
    unit: data?.unit || null,
    invoice_id: receiptVoucher?.lid || null,
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
    setUpdatedField(id);
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

  const token = localStorage.getItem("auth-token");

  const GenerateRequest = () => {
    setbtnloading(true);

    const pdfBlob = generatePDF(receiptVoucherData);

    const formData = new FormData();
    formData.append(
      "tax_invoice",
      pdfBlob,
      `Invoice_${receiptVoucherData?.lid}.pdf`
    );
    formData.append("currency", receiptVoucherData?.currency);
    formData.append("comm_amount", receiptVoucherData?.comm_amount);
    formData.append("comm_percent", receiptVoucherData?.comm_percent);
    formData.append("vat", receiptVoucherData?.vat);
    formData.append("amount", receiptVoucherData?.amount);
    formData.append("project", receiptVoucherData?.project);
    formData.append("unit", receiptVoucherData?.unit);
    formData.append("enquiryType", receiptVoucher?.enquiryType);

    axios
      .post(`${BACKEND_URL}/editdeal/${receiptVoucher?.lid}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ", result);
        setbtnloading(false);
        if (result?.data?.status === false || result?.status === false) {
          toast.error(result?.data?.message || result?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }

        toast.success("Commission Request Generated Successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        setbtnloading(false);
        console.log(err);
        toast.error("Something Went Wrong! Please Try Again", {
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
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        const x = pageWidth / 2 - 150; // Centered horizontally
        const y = pageHeight / 2 - 150; // Centered vertically
        const width = 300;
        const height = 300;

        doc.addImage(watermarkUrl, "PNG", x, y, width, height, "", "NONE", 0.3);
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
    // const addHeader = () => {
    //   const pageHeight = doc.internal.pageSize.getHeight();
    //   const pageWidth = doc.internal.pageSize.getWidth();

    //   // Add the header image
    //   const headerImg = "assets/Header.jpg";
    //   doc.addImage(
    //     headerImg,
    //     "JPEG",
    //     0,
    //     0,
    //     pageWidth,
    //     50
    //   );
    // };

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
    // const addFooter = () => {
    //   const pageHeight = doc.internal.pageSize.getHeight();
    //   const pageWidth = doc.internal.pageSize.getWidth();

    //   // Add the footer image
    //   const footerImage = "assets/Footer.jpg"; // Ensure the path is correct and image is accessible
    //   const footerHeight = 50; // Adjust height to fit your layout

    //   // Add image covering the footer area
    //   doc.addImage(
    //     footerImage,
    //     "JPEG",
    //     0,
    //     pageHeight - footerHeight,
    //     pageWidth,
    //     footerHeight
    //   );
    // };

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
      // doc.setFont("Arial", "normal");
      // doc.setFontSize(12);
      // doc.text("Company:", 120, 66);
      // doc.text(`${data?.company}`, 120, 73);
      // doc.text(`TRN No: ${data?.company_trn}`, 120, 80);
      // doc.text(` `, 120, 87);

      // doc.text("Bill to:", 20, 73);
      // doc.text(`${data?.vendor_name}`, 20, 80);
      // doc.text(`${data?.address}`, 20, 87);
      // doc.text(`TRN No: ${data?.trn}`, 20, 94);

      // doc.setDrawColor(0);
      // doc.setLineWidth(0.5);
      // doc.line(20, 101, 190, 101);
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
      // VENDOR
      doc.text("Bill to: ", paddingX, usedY + 15);
      doc.setFont("Arial", "bold");
      doc.text(`${data?.vendor_name}`, paddingX, usedY + 15 + 6);
      doc.setFont("Arial", "normal");
      doc.text(`${data?.address}`, paddingX, usedY + 15 + 6 + 6);
      doc.text(`TRN No: ${data?.trn}`, paddingX, usedY + 15 + 6 + 6 + 6);
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
    setPDFUrl(pdfBlobUrl);

    doc.save(`${data?.invoice_id} - ${data?.vendor_name}.pdf`);
    return pdfBlob;
  };
  useEffect(() => {
    console.log("total changed: ");
    setCommReqData({
      ...receiptVoucherData,
      total_amount:
        Number(receiptVoucherData?.comm_amount) +
        Number(receiptVoucherData?.vat),
    });
  }, [receiptVoucherData?.comm_amount, receiptVoucherData?.vat]);

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
        className={`${
          isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
        } ${
          isClosing
            ? isLangRTL(i18n.language)
              ? "modal-close-left"
              : "modal-close-right"
            : ""
        } w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
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
              <div className="w-full flex items-center pb-5">
                <div
                  className={`${
                    isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                  } bg-primary h-10 w-1 rounded-full my-1`}
                ></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                  style={{
                    fontFamily: isArabic(Feedback?.feedback)
                      ? "Noto Kufi Arabic"
                      : "inherit",
                  }}
                >
                  <h1 className="font-semibold pt-3 text-lg text-center">
                    {t("receipt_voucher_heading")}
                  </h1>
                </h1>
              </div>

              <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5 p-5">
                {/* PROJECT DETAILS  */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("project_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
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
                      }}
                    >
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
                  </div>
                </div>

                {/* DEVELOPER DETAILS  */}
                <div
                  className={`px-5 pt-5 \ rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("developer_detail")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
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
                  </div>
                </div>

                {/* CHEQUE DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("cheque_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
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
                </div>
              </div>
            </>
          )}
          <div className="px-4">
            <Button
              type="submit"
              size="medium"
              style={{
                color: "white",
                fontFamily: fontFam,
              }}
              className="bg-btn-primary w-full text-white rounded-lg py-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
              onClick={GenerateRequest}
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
            </Button>
          </div>
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
