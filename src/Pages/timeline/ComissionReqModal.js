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

const CommissionReqModal = ({
  commReqModal,
  setCommReqModal,
  newFeedback,
  Feedback,
}) => {
  console.log("Commission req modal: ", commReqModal);
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

  const [vendors, setVendors] = useState([]);
  const [singleVendor, setSingleVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const currentDate = moment().format("YYYY-MM-DD");

  const [updatedField, setUpdatedField] = useState("");
  const [pdfUrl, setPDFUrl] = useState(false);

  const searchRef = useRef();

  const [commReqData, setCommReqData] = useState({
    vendor_id: null,
    vendor_name: "",
    address: null,
    trn: null,
    unit: commReqModal?.unit || null,
    invoice_id: commReqModal?.lid || null,
    date: moment().format("YYYY-MM-DD"),
    currency: commReqModal?.currency || "AED",
    comm_amount: commReqModal?.comm_amount || null,
    comm_percent: commReqModal?.comm_percent || null,
    project: commReqModal?.project || null,
    leadName: commReqModal?.leadName || null,
    amount: commReqModal?.amount || null,
    vat: commReqModal?.vat || 0,
    total_amount:
      (Number(commReqModal?.comm_amount) || 0) +
      (Number(commReqModal?.vat) || 0),
    company: "HIKAL REAL STATE LLC" || null,
    company_trn: "100587185800003" || null,
    company_email: "info@hikalagency.ae" || null,
    company_tele: "+97142722249" || null,
    bank_name: "EMIRATES ISLAMIC" || null,
    bank_address: "EI SHK ZAYED RD AL WASL TOWER" || null,
    bank_acc_name: "HIKAL REAL STATE L.L.C." || null,
    bank_acc_no: "3708453323701" || null,
    bank_iban: "AE810340003708453323701" || null,
    bank_swift_code: "MEBLAEAD" || null,
  });

  console.log("comm req data:: ", commReqData);

  const fetchVendors = async () => {
    setLoading(true);
    const vendorUrl = `${BACKEND_URL}/vendors`;

    try {
      const vendorsList = await axios.get(vendorUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("vendors list:: ", vendorsList);

      setVendors(vendorsList?.data?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
    }
  };

  const fetchUsers = async (title) => {
    try {
      let url = "";

      url = `${BACKEND_URL}/vendors?vendor_name=${title}`;

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("vendors: ", response);

      setVendors(response?.data?.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch vendors.", {
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
      setCommReqModal(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const token = localStorage.getItem("auth-token");

  const GenerateRequest = () => {
    setbtnloading(true);

    const pdfBlob = generatePDF(commReqData);

    const formData = new FormData();
    formData.append("tax_invoice", pdfBlob, `Invoice_${commReqData?.lid}.pdf`);
    formData.append("currency", commReqData?.currency);
    formData.append("comm_amount", commReqData?.comm_amount);
    formData.append("comm_percent", commReqData?.comm_percent);
    formData.append("vat", commReqData?.vat);
    formData.append("amount", commReqData?.amount);
    formData.append("project", commReqData?.project);
    formData.append("unit", commReqData?.unit);
    formData.append("enquiryType", commReqModal?.enquiryType);

    axios
      .post(`${BACKEND_URL}/editdeal/${commReqModal?.lid}`, formData, {
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

    const addWatermark = () => {
      const watermarkUrl = "assets/pdf-watermark.png";
      console.log("watermark url: ", watermarkUrl);
      const pageCount = doc.internal.getNumberOfPages();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      console.log("");

      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // doc.setGState(new doc.GState({ opacity: 0.1 })); // Set opacity for watermark
        const x = pageWidth / 2 - 50; // Centered horizontally
        const y = pageHeight / 2 - 50; // Centered vertically
        const width = 100;
        const height = 100;

        // doc.addImage(watermarkUrl, "PNG", x, y, width, height);
        doc.addImage(watermarkUrl, "PNG", 50, 120, 100, 100, "", "NONE", 0.3);
        // doc.addImage(watermarkUrl, "PNG", 50, 120, 100, 100, "", "NONE", 0.3);
        // doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity to default
      }
    };

    addWatermark();

    // Define the document structure
    const addHeader = () => {
      const pageWidth = doc.internal.pageSize.getWidth();

      // Add the header image
      const headerImg = "assets/header-pdf.png";
      doc.addImage(headerImg, "PNG", 0, 2, pageWidth, 35);
      // const logoUrl = "assets/hikal-logo.png";
      // doc.addImage(logoUrl, "JPEG", 10, 2, 50, 50);

      doc.setFont("Arial", "bold");
      doc.setFontSize(18);
      doc.text("TAX INVOICE", 105, 39, null, null, "center");

      // Underline the "TAX INVOICE" title
      const textWidth = doc.getTextWidth("TAX INVOICE");
      doc.setLineWidth(0.5);
      doc.line(105 - textWidth / 2, 40, 105 + textWidth / 2, 40);

      doc.setFontSize(12);
      doc.text("Company:", 120, 66);
      doc.text(`${data?.company}`, 120, 73);
      doc.text(`TRN No: ${data?.company_trn}`, 120, 80);
      doc.text(`Email Address: ${data?.company_email} `, 120, 87);
      doc.text(`Telephone: ${data?.company_tele}`, 120, 94);

      doc.text("Bill to:", 20, 73);
      doc.text(`${data?.vendor_name}`, 20, 80);
      doc.text(`${data?.address}`, 20, 87);
      doc.text(`TRN No: ${data?.trn}`, 20, 94);

      doc.setFont("Arial", "normal");
      doc.text(`Date: ${currentDate}`, 140, 49);
      data?.invoice_id &&
        doc.text(`Invoice No: ${data?.invoice_id || "-"}`, 140, 57);

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(20, 101, 190, 101);
    };

    const addClientDetails = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(10);
      doc.text("CLIENT NAME", 20, 112);
      doc.text("UNIT NO", 75, 112);
      doc.text("PROJECT NAME", 130, 112);

      doc.setFont("Arial", "normal");
      doc.text(`${data?.leadName}`, 20, 120);
      doc.text(`${data?.unit}`, 75, 120);
      doc.text(`${data?.project}`, 130, 120);

      doc.setLineWidth(0.5);
      doc.line(20, 130, 190, 130); // Draw a line below the client details
    };

    const addTable = () => {
      doc.autoTable({
        startY: 140, // Adjusted startY for spacing
        head: [
          [
            `SALES VALUE ${data?.currency}`,
            "COMMISSION %",
            "NET VALUE BEFORE VAT",
            "VAT VALUE",
            `GROSS VALUE ${data?.currency}`,
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
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        styles: {
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
      });

      const tableHeight = doc.lastAutoTable.finalY;

      doc.setFont("Arial", "bold");
      doc.text("TOTAL", 150, tableHeight + 10);
      doc.text(`${data?.total_amount}`, 170, tableHeight + 10);
    };

    const addBankDetails = (startY) => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      doc.text("All cheques payable to the following account.", 20, startY + 6);

      // Adjusted the table format to two columns
      doc.autoTable({
        startY: startY + 10,
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
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        styles: {
          fontSize: 10,
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },

        columnStyles: {
          0: { fontStyle: "bold" }, // Make the first column bold
          1: { fontStyle: "normal" },
        },
      });
    };

    const addSignatureSection = (startY) => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(10);
      doc.text("Sincerely,", 20, startY + 11);
      doc.text("Mr. MOHAMED MEDHAT FATHY IBRAHIM HIKAL", 20, startY + 16);
      doc.text("CEO", 20, startY + 21);
      doc.text("HIKAL REAL ESTATE L.L.C", 20, startY + 26);

      doc.setFont("Arial", "normal");
      doc.text("Authorized Signature", 150, startY + 28);
      doc.setLineWidth(0.5);
      doc.line(150, startY + 23, 190, startY + 23);
    };

    // const addFooter = () => {
    //   const pageHeight = doc.internal.pageSize.getHeight();
    //   doc.setLineWidth(0.5);
    //   doc.line(20, pageHeight - 20, 190, pageHeight - 20);

    //   doc.setFont("Arial", "normal");
    //   doc.setFontSize(10);
    //   doc.setTextColor(0, 0, 0);

    //   const iconOffset = 4;
    //   doc.setFont("Arial", "bold");
    //   doc.setTextColor(255, 0, 0);

    //   // Phone icon
    //   doc.setFontSize(12);

    //   const callIcon = "assets/icon-call.png";
    //   doc.addImage(callIcon, "JPEG", 98, pageHeight - 14, 5, 5);
    //   doc.setFontSize(10);
    //   doc.setTextColor(0, 0, 0);
    //   doc.text("+971 4 272 2249", 100 + iconOffset, pageHeight - 10);

    //   // Email icon
    //   doc.setFontSize(12);
    //   doc.setTextColor(255, 0, 0);

    //   const emailIcon = "assets/icon-email.png";
    //   doc.addImage(emailIcon, "JPEG", 152, pageHeight - 14, 5, 5);
    //   doc.setFontSize(10);
    //   doc.setTextColor(0, 0, 0);
    //   doc.text("info@hikalagency.ae", 155 + iconOffset, pageHeight - 10);

    //   // Office address icon
    //   doc.setFontSize(12);
    //   doc.setTextColor(255, 0, 0);
    //   const locIcon = "assets/icon-location.png";
    //   doc.addImage(locIcon, "JPEG", 18, pageHeight - 14, 5, 5);
    //   doc.setFontSize(10);
    //   doc.setTextColor(0, 0, 0);
    //   doc.text(
    //     "Office No. 2704, API World Tower.",
    //     20 + iconOffset,
    //     pageHeight - 10
    //   );
    //   // doc.text("Sheikh Zayed Road, Dubai", 130 + iconOffset, pageHeight - 17);
    // };

    // const addFooter = () => {
    //   const pageHeight = doc.internal.pageSize.getHeight();
    //   doc.setLineWidth(0.5);
    //   doc.line(20, pageHeight - 20, 190, pageHeight - 20);
    //   const footerImg = "assets/footer-pdf.png";
    //   doc.addImage(footerImg, "PNG", 98, pageHeight - 10, 100, 100);
    // };

    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Draw line at the top of the footer
      doc.setLineWidth(0.5);
      doc.line(5, pageHeight - 35, pageWidth - 5, pageHeight - 35);

      // Add the footer image
      const footerImage = "assets/Footer.jpg"; // Ensure the path is correct and image is accessible
      const footerHeight = 27; // Adjust height to fit your layout

      // Add image covering the footer area
      doc.addImage(
        footerImage,
        "JPEG",
        1,
        pageHeight - footerHeight - 7,
        pageWidth - 2,
        footerHeight
      );
    };

    // const addWatermark = () => {
    //   const watermarkUrl = "assets/pdf-watermark.png";
    //   console.log("watermark url: ", watermarkUrl);
    //   const pageCount = doc.internal.getNumberOfPages();
    //   const pageWidth = doc.internal.pageSize.getWidth();
    //   const pageHeight = doc.internal.pageSize.getHeight();

    //   console.log("");

    //   for (let i = 1; i <= pageCount; i++) {
    //     doc.setPage(i);

    //     // doc.setGState(new doc.GState({ opacity: 0.1 })); // Set opacity for watermark
    //     const x = pageWidth / 2 - 50; // Centered horizontally
    //     const y = pageHeight / 2 - 50; // Centered vertically
    //     const width = 100;
    //     const height = 100;

    //     // doc.addImage(watermarkUrl, "PNG", x, y, width, height);
    //     doc.addImage(watermarkUrl, "PNG", 50, 120, 100, 100, "", "NONE", 0.3);
    //     // doc.addImage(watermarkUrl, "PNG", 50, 120, 100, 100, "", "NONE", 0.3);
    //     // doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity to default
    //   }
    // };

    addHeader();
    addClientDetails();
    addTable();
    const tableHeight = doc.lastAutoTable.finalY;
    addBankDetails(tableHeight + 12);
    const bankDetailsHeight = doc.lastAutoTable.finalY;
    addSignatureSection(bankDetailsHeight + 6);
    addFooter();
    // addWatermark();

    // Save the PDF as Blob
    const pdfBlob = doc.output("blob");

    // Create a Blob URL
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    console.log("PDF Blob URL: ", pdfBlobUrl);

    // Set the PDF URL in the component state
    setPDFUrl(pdfBlobUrl);

    doc.save(`${data?.vendor_name || "Invoice"}.pdf`);
    return pdfBlob;
  };
  useEffect(() => {
    console.log("total changed: ");
    setCommReqData({
      ...commReqData,
      total_amount: Number(commReqData?.comm_amount) + Number(commReqData?.vat),
    });
  }, [commReqData?.comm_amount, commReqData?.vat]);

  console.log("TOTAL:: ", commReqData?.total_amount);

  useEffect(() => {
    const handleChange = () => {
      setCommReqData({
        ...commReqData,
        vendor_name: singleVendor?.vendor_name,
        address: singleVendor?.address,
        trn: singleVendor?.trn,
      });
    };

    handleChange();
  }, [singleVendor]);

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <Modal
      keepMounted
      open={commReqModal}
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
                    {t("generate_comm_req")}
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
                      {/* PROJECT */}
                      <TextField
                        id="project"
                        type={"text"}
                        label={t("label_project_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.project}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                      {/* ENQUIRY  */}
                      {/* <TextField
                        id="enquiryType"
                        type={"text"}
                        label={t("label_enquiry_for")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData.enquiryType}
                        onChange={(e) => handleChange(e)}
                        required
                      /> */}

                      {/* CLIENT NAME */}
                      <TextField
                        id="leadName"
                        type={"text"}
                        label={t("label_lead_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.leadName}
                        onChange={(e) => handleChange(e)}
                        required
                      />

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
                        value={commReqData?.unit}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      <div className="grid grid-cols-3">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === commReqData?.currency
                          )}
                          onChange={(e) => {
                            setCommReqData({
                              ...commReqData,
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
                          label={t("selling_amount")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={commReqData?.amount}
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
                        // marginTop:"20p"
                      }}
                    >
                      {/* VENDORS LIST */}
                      <FormControl
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                        sx={{
                          minWidth: "100%",
                          // border: 1,
                          borderRadius: 1,
                          marginBottom: "10px",
                        }}
                      >
                        <TextField
                          id="vendor_id"
                          select
                          value={commReqData?.vendor_id || "selected"}
                          label={t("vendor")}
                          onChange={(e) => {
                            const singleVendor = vendors?.find(
                              (ven) => ven?.id === e.target.value
                            );
                            console.log("singlevendor: ", singleVendor);
                            setSingleVendor(singleVendor);
                            setCommReqData({
                              ...commReqData,
                              vendor_id: e.target.value,
                              // vendor_name: singleVendor?.vendor_name,
                              // address: singleVendor?.address,
                              // trn: singleVendor?.trn,
                            });
                          }}
                          size="small"
                          className="w-full border border-gray-300 rounded "
                          displayEmpty
                          required
                          sx={{
                            // border: "1px solid #000000",
                            height: "40px",

                            "& .MuiSelect-select": {
                              fontSize: 11,
                            },
                          }}
                        >
                          <MenuItem selected value="selected">
                            ---{t("select_vendor")}----
                          </MenuItem>
                          <MenuItem
                            onKeyDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <TextField
                              placeholder={t("search_vendors")}
                              ref={searchRef}
                              sx={{
                                "& input": {
                                  border: "0",
                                },
                              }}
                              variant="standard"
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length >= 3) {
                                  fetchUsers(value);
                                }
                              }}
                            />
                          </MenuItem>

                          {vendors?.map((vendor) => (
                            <MenuItem value={vendor?.id}>
                              {vendor?.vendor_name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </FormControl>

                      {/* VENDOR NAME */}
                      <TextField
                        id="vendor_name"
                        type={"text"}
                        label={t("form_vendor_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        InputLabelProps={{ shrink: !!commReqData?.vendor_name }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.vendor_name}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      {/* VENDOR ADDRESS */}
                      <TextField
                        id="address"
                        type={"text"}
                        label={t("label_address")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.address}
                        InputLabelProps={{ shrink: !!commReqData?.address }}
                        onChange={(e) => handleChange(e)}
                        required
                      />

                      {/* TRN */}
                      <TextField
                        id="trn"
                        type={"text"}
                        label={t("trn")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.trn}
                        InputLabelProps={{ shrink: !!commReqData?.trn }}
                        onChange={(e) => handleChange(e)}
                        required
                      />
                    </Box>
                  </div>
                </div>

                {/* COMMISSION DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("commission_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
                      {/* BOOKING DATE  */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={commReqData?.date}
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

                      {/* COMMISSION AMOUNT */}
                      <TextField
                        id="comm_amount"
                        type={"number"}
                        label={t("comm_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.comm_amount}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMMISSION PERCENT */}
                      <TextField
                        id="comm_percent"
                        type={"number"}
                        label={t("comm_perc")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.comm_percent}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* VAT AMOUNT*/}
                      <TextField
                        id="vat"
                        type={"number"}
                        label={t("vat")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.vat}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* TOTAL AMOUNT*/}
                      <TextField
                        id="total_amount"
                        type={"text"}
                        label={t("total")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.total_amount}
                        onChange={(e) => e.preventDefault()}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </Box>
                  </div>
                </div>

                {/* COMPANY DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("company_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
                      {/* COMPANY NAME  */}
                      <TextField
                        id="company"
                        type={"text"}
                        label={t("company_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.company}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMPANY TRN */}
                      <TextField
                        id="company_trn"
                        type={"number"}
                        label={t("trn")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.company_trn}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMPANY EMAIL */}
                      <TextField
                        id="company_email"
                        type={"text"}
                        label={t("label_email")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.company_email}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* COMPANY TELEPHONE */}
                      <TextField
                        id="company_tele"
                        type={"text"}
                        label={t("company_tele")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.company_tele}
                        onChange={(e) => handleChange(e)}
                      />
                    </Box>
                  </div>
                </div>

                {/* BANK DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("bank_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
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
                        value={commReqData?.bank_name}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK ADDRESS */}
                      <TextField
                        id="bank_address"
                        type={"text"}
                        label={t("bank_address")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_address}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK ACC NAME */}
                      <TextField
                        id="bank_acc_name"
                        type={"text"}
                        label={t("bank_acc_name")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_acc_name}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK ACC NO */}
                      <TextField
                        id="bank_acc_no"
                        type={"number"}
                        label={t("bank_acc_no")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_acc_no}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* BANK IBAN */}
                      <TextField
                        id="bank_iban"
                        type={"text"}
                        label={t("bank_iban")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_iban}
                        onChange={(e) => handleChange(e)}
                      />

                      {/* SWIFT CODE */}
                      <TextField
                        id="bank_swift_code"
                        type={"text"}
                        label={t("bank_swift_code")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commReqData?.bank_swift_code}
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

export default CommissionReqModal;
