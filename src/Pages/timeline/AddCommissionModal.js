import React, { useEffect, useRef, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Box,
  MenuItem,
  FormControl,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Select from "react-select";
import {
  claim,
  commission_type,
  currencies,
  payment_source,
  payment_status,
  title,
} from "../../Components/_elements/SelectOptions";
import { BsFileEarmarkMedical } from "react-icons/bs";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../../Components/_elements/SelectStyles";

import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import moment from "moment";
import { BsPercent } from "react-icons/bs";
import jsPDF from "jspdf";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const AddCommissionModal = ({
  addCommissionModal,
  handleCloseAddCommission,
  fetchLeadsData,
  status,
}) => {
  console.log("parent commission data: ", addCommissionModal);
  console.log("status in add comm: ", status);
  const token = localStorage.getItem("auth-token");
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
    Managers,
    SalesPerson,
  } = useStateContext();
  console.log("managers list: ", Managers);

  const { hasPermission } = usePermission();

  const searchRef = useRef();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [vendor, setVendor] = useState([]);
  const [user, setUser] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [updatedField, setUpdatedField] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [pdfPreview, setPdfPreview] = useState(null);
  const [pdfUrl, setPDFUrl] = useState(false);
  const [singleVendor, setSingleVendor] = useState(null);
  const currentDate = moment().format("YYYY-MM-DD");

  const [amountToCalculate, setAmountToCalculate] = useState("");

  const [includeVat, setIncludeVat] = useState(true);

  const commData = addCommissionModal?.data;
  const newCommData = addCommissionModal?.commissionModal;

  console.log("com data: ", commData);

  console.log("vendors or users:: ", vendor);
  const [commissionData, setCommissionData] = useState({
    user_id:
      status?.field === "agent_comm_status"
        ? newCommData?.salesId
        : status?.field === "manager_comm_status"
        ? newCommData?.managerId
        : null,
    deal_id: newCommData?.lid,
    vendor_id: commData?.vendor_id || null,
    invoice_type:
      status?.field === "agent_comm_status" ||
      status?.field === "manager_comm_status"
        ? "Expense"
        : "Income",
    date: commData?.date || null,
    amount:
      commData?.amount ||
      (commData?.invoice_type === "Income" && newCommData?.comm_amount) ||
      0,
    vat: commData?.vat || 0,
    total_amount: commData?.total_amount || 0,
    status: commData?.status || null,
    comm_percent:
      commData?.comm_percent ||
      (commData?.invoice_type === "Income" && newCommData?.comm_percent) ||
      0,
    claim: commData?.claim || null,
    // comm_amount: commData?.comm_amount || null,
    paid_by: commData?.paid_by || null,
    // file: commData?.image || null,
    file: addCommissionModal?.image || null,
    currency: commData?.currency || newCommData?.currency,
    category: commData?.category || "Commission",
    title: null,
    project: newCommData?.project || null,
    unit: newCommData?.unit || null,
  });

  console.log("selected commission data:", commissionData);

  const users = () => [
    {
      value: newCommData?.managerId,
      label: user?.find((manager) => manager.id === newCommData?.managerId)
        ?.userName,
    },
    {
      value: newCommData?.salesId,
      label: user?.find((sale) => sale.id === newCommData?.salesId)?.userName,
    },
  ];

  console.log("commission data:: ", commissionData);
  console.log(
    "selected user or vendor: ",
    vendor?.filter((ven) =>
      commissionData?.invoice_type === "Expense"
        ? ven?.id === commissionData?.user_id
        : ven?.id === commissionData?.vendor_id
    )?.[0]?.userName
  );

  const handleImgUpload = (e) => {
    const file = e.target.files[0];

    console.log("files:: ", file);

    if (file && file.type.startsWith("image/")) {
      setPdfPreview(null);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);

        const base64Image = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      setPdfPreview(true);
    }

    setCommissionData({
      ...commissionData,
      file: file,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    const id = e.target.id;

    setCommissionData({
      ...commissionData,
      [id]: value,
    });
    setUpdatedField(id);
  };

  // genenrate pdf

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
      doc.text("Commission Receipt", x, y, null, null, "center");
      const textWidth = doc.getTextWidth("Commission Receipt");
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

    const user = users()?.find(
      (user) => user.value === commissionData?.user_id
    )?.label;

    const addCompanyDetails = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
      // Message
      doc.text(
        `Dear: ${data?.title?.toUpperCase()} ${user} `,
        paddingX,
        usedY + 15
      );
      doc.setFont("Arial", "normal");
      doc.text(
        `We, HIKAL REAL ESTATE L.L.C. is paying net commission againts following details, which you`,
        paddingX,
        usedY + 23 + 6
      );
      doc.text(
        `closed in ${singleVendor?.vendor_name}. Kindly see the detailed table below for the unit.`,
        paddingX,
        usedY + 30 + 6
      );

      usedY = 110;
    };

    // COMMISSION DETAILS
    const addCommDetails = () => {
      doc.setFont("Arial", "bold");
      doc.setFontSize(12);
      // TABLE
      doc.autoTable({
        startY: usedY + 10,
        head: [["PROJECT", "UNIT", "CLAIM TYPE", "AMOUNT"]],
        body: [
          [
            `${data?.project}`,
            `${data?.unit}`,
            `${data?.claim}`,
            `${data?.amount}`,
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

      doc.setFont("Arial", "bold");
      doc.text(
        `SUB TOTAL: ${data?.currency} ${data?.amount}`,
        pageWidth - paddingX,
        usedY + 6,
        null,
        null,
        "right"
      );
      usedY = usedY + 6;
    };

    const addPaymentModa = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(10);
      doc.text("Payment Mode:", paddingX, usedY + 30);
      doc.setFont("Arial", "bold");
      doc.setFontSize(10);
      doc.text(`${data?.paid_by} `, paddingX, usedY + 39);

      // const x = paddingX;
      // const y = 50 - 4;
      // const textWidth = doc.getTextWidth(`${data?.payment_source}`);
      // //   const textY = y + 2;
      // const textY = usedY + 41;
      // doc.setLineWidth(0.5);
      // doc.line(x - textWidth / 2, textY, x + textWidth / 2, textY);

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
    addCommDetails();
    addPaymentModa();
    addSignatureSection();

    // Save the PDF as Blob
    const pdfBlob = doc.output("blob");

    // Create a Blob URL
    const pdfBlobUrl = URL.createObjectURL(pdfBlob);

    console.log("PDF Blob URL: ", pdfBlobUrl);

    // Set the PDF URL in the component state
    setPDFUrl(pdfBlobUrl);

    doc.save(`${user}.pdf`);
    return pdfBlob;
  };

  // VAT TOGGLE
  const toggleVat = (value) => {
    setIncludeVat(value);
    if (value === true) {
      autoCalculate("amount");
    } else {
      setCommissionData({
        ...commissionData,
        vat: 0,
        amount: commissionData?.total_amount,
      });
    }
  };

  useEffect(() => {
    if (includeVat) {
      autoCalculate(updatedField);
    } else {
      console.log("VAT NOT INCLUDED!");
      if (updatedField === "amount" && includeVat === false) {
        setCommissionData({
          ...commissionData,
          total_amount: commissionData?.amount,
        });
      }
    }
  }, [
    updatedField,
    commissionData?.amount,
    commissionData?.vat,
    commissionData?.total_amount,
    commissionData?.comm_percent,
  ]);

  const autoCalculate = (upField) => {
    const inclVat = includeVat;
    const sellingAmount = newCommData?.amount || 0;

    if (inclVat === false) {
      setCommissionData((prevData) => ({
        ...prevData,
        vat: 0,
        amount: commissionData?.amount,
        total_amount: commissionData?.amount,
      }));
      return;
    } else {
      // AMOUNT
      if (upField === "amount") {
        const amount = parseFloat(commissionData.amount);
        if (!isNaN(amount)) {
          let vat = amount * (5 / 100);
          vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
          let totalAmount = amount + parseFloat(vat);
          totalAmount =
            totalAmount % 1 === 0
              ? totalAmount.toFixed(0)
              : totalAmount.toFixed(2);
          if (!isNaN(sellingAmount)) {
            let commPercent = parseFloat(amount) / parseFloat(sellingAmount);
            commPercent =
              commPercent % 1 === 0
                ? commPercent.toFixed(0)
                : commPercent.toFixed(2);
            setCommissionData((prevData) => ({
              ...prevData,
              vat: vat,
              amount: amount,
              total_amount: totalAmount,
              comm_percent: commPercent,
            }));
          } else {
            setCommissionData((prevData) => ({
              ...prevData,
              vat: vat,
              amount: amount,
              total_amount: totalAmount,
            }));
          }
        }
      }
      // TOTAL AMOUNT
      if (upField === "total_amount") {
        const totalAmount = parseFloat(commissionData.total_amount);
        if (!isNaN(totalAmount)) {
          let vat = totalAmount * (100 / 105) * (5 / 100);
          vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
          let amount = totalAmount - parseFloat(vat);
          amount = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);

          if (!isNaN(sellingAmount)) {
            let commPercent = parseFloat(amount) / parseFloat(sellingAmount);
            commPercent =
              commPercent % 1 === 0
                ? commPercent.toFixed(0)
                : commPercent.toFixed(2);
            setCommissionData((prevData) => ({
              ...prevData,
              vat: vat,
              amount: amount,
              total_amount: totalAmount,
              comm_percent: commPercent,
            }));
          } else {
            setCommissionData((prevData) => ({
              ...prevData,
              vat: vat,
              amount: amount,
              total_amount: totalAmount,
            }));
          }
        }
      }
      // VAT
      if (upField === "vat") {
        const vat = parseFloat(commissionData.vat);
        let totalAmount = parseFloat(commissionData.total_amount);
        let amount = parseFloat(commissionData.amount);
        if (!isNaN(vat)) {
          if (!isNaN(totalAmount)) {
            amount = parseFloat(totalAmount) - parseFloat(vat);
            amount = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
            if (!isNaN(sellingAmount)) {
              let commPercent = parseFloat(amount) / parseFloat(sellingAmount);
              commPercent =
                commPercent % 1 === 0
                  ? commPercent.toFixed(0)
                  : commPercent.toFixed(2);
              setCommissionData((prevData) => ({
                ...prevData,
                vat: vat,
                amount: amount,
                total_amount: totalAmount,
                comm_percent: commPercent,
              }));
            }
          }
          if (!isNaN(amount)) {
            totalAmount = parseFloat(amount) + parseFloat(vat);
            totalAmount =
              totalAmount % 1 === 0
                ? totalAmount.toFixed(0)
                : totalAmount.toFixed(2);
          }
          setCommissionData((prevData) => ({
            ...prevData,
            vat: vat,
            amount: amount,
            total_amount: totalAmount,
          }));
        }
      }
      // COMMISSION PERCENT
      if (upField === "comm_percent") {
        const commPercent = parseFloat(commissionData.comm_percent);
        if (!isNaN(commPercent) && !isNaN(sellingAmount)) {
          let amount = (commPercent / 100) * sellingAmount;
          amount = amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(2);
          let vat = parseFloat(amount) * (5 / 100);
          vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
          let totalAmount = parseFloat(amount) + parseFloat(vat);
          totalAmount =
            totalAmount % 1 === 0
              ? totalAmount.toFixed(0)
              : totalAmount.toFixed(2);
          setCommissionData((prevData) => ({
            ...prevData,
            vat: vat,
            amount: amount,
            total_amount: totalAmount,
            comm_percent: commPercent,
          }));
        }
      }
    }
  };

  useEffect(() => {
    const { invoice_type } = commissionData;
    if (invoice_type === "Income") {
      setAmountToCalculate(newCommData?.amount);
      setCommissionData((prevData) => ({
        ...prevData,
        comm_percent: newCommData?.comm_percent || 0,
        amount: newCommData?.comm_amount || 0,
      }));
    } else {
      setAmountToCalculate(newCommData?.comm_amount);
      setCommissionData((prevData) => ({
        ...prevData,
        comm_percent: newCommData?.agent_comm_percent,
        amount: newCommData?.agent_comm_amount,
      }));
    }
  }, [commissionData.invoice_type]);

  // useEffect(() => {
  //   autoCalculate(
  //     "comm_amount",
  //     amountToCalculate,
  //     commissionData.comm_percent
  //   );
  // }, [commissionData.comm_percent, amountToCalculate]);

  // useEffect(() => {
  //   autoCalculate("comm_percent", amountToCalculate, commissionData.amount);
  // }, [commissionData.amount, amountToCalculate]);

  // useEffect(() => {
  //   const {
  //     comm_percent,
  //     amount,
  //     invoice_type
  //   } = commissionData;

  //   if (updatedField === "comm_percent" || updatedField === "invoice_type") {
  //     if (invoice_type === "Income") {
  //       setAmountToCalculate(newCommData?.comm_amount);
  //       setCommissionData((prevData) => ({
  //         ...prevData,
  //         comm_percent: newCommData?.comm_percent,
  //         amount: newCommData?.comm_amount,
  //       }), () => {
  //         autoCalculate("comm_amount", amountToCalculate, comm_percent);
  //       });
  //     } else {
  //       setAmountToCalculate(newCommData?.amount);
  //       setCommissionData((prevData) => ({
  //         ...prevData,
  //         comm_percent: newCommData?.agent_comm_percent,
  //         amount: newCommData?.agent_comm_amount,
  //       }), () => {
  //         autoCalculate("comm_amount", amountToCalculate, comm_percent);
  //       });
  //     }
  //     // console.log("UPDATED");
  //     // autoCalculate("comm_amount", amountToCalculate, comm_percent);
  //   }
  //   // COMMISSION PERCENT
  //   if (updatedField === "amount" || updatedField === "invoice_type") {
  //     if (invoice_type === "Income") {
  //       setAmountToCalculate(newCommData?.comm_amount);
  //       setCommissionData((prevData) => ({
  //         ...prevData,
  //         comm_percent: newCommData?.comm_percent,
  //         amount: newCommData?.comm_amount,
  //       }), () => {
  //         autoCalculate("comm_percent", amountToCalculate, amount);
  //       });
  //     } else {
  //       setAmountToCalculate(newCommData?.amount);
  //       setCommissionData((prevData) => ({
  //         ...prevData,
  //         comm_percent: newCommData?.agent_comm_percent,
  //         amount: newCommData?.agent_comm_amount,
  //       }), () => {
  //         autoCalculate("comm_percent", amountToCalculate, amount);
  //       });
  //     }
  //     // autoCalculate("comm_percent", amountToCalculate, amount);
  //   }
  // }, [commissionData.invoice_type, commissionData.amount, commissionData.comm_percent, updatedField]);

  // const autoCalculate = (value, amount, percentOrAmount) => {
  //   const sellingAmount = parseFloat(amount);

  //   // COMM AMOUNT
  //   if (value === "comm_amount") {
  //     const commPercent = parseFloat(percentOrAmount);
  //     // const commPercent = percentOrAmount;
  //     if (!isNaN(sellingAmount) && !isNaN(commPercent)) {
  //       let commAmount = (sellingAmount * commPercent) / 100;
  //       commAmount =
  //         commAmount % 1 === 0 ? commAmount.toFixed(0) : commAmount.toFixed(2);

  //       let vat = 0;
  //       if (commissionData?.invoice_type === "Income") {
  //         vat = (commAmount * 5) / 100;
  //         vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
  //       }

  //       let total = parseFloat(commAmount) + parseFloat(vat);
  //       total = total % 1 === 0 ? total.toFixed(0) : total.toFixed(2);

  //       console.log("COMM PERCENT = ", commPercent);
  //       console.log("COMM AMOUNT = ", commAmount);
  //       console.log("VAT = ", vat);
  //       console.log("TOTAL AMOUNT = ", total);

  //       setCommissionData((prevData) => ({
  //         ...prevData,
  //         comm_percent: commPercent,
  //         amount: commAmount,
  //         vat: vat,
  //       }));
  //       setTotalAmount(total);
  //     }
  //   }
  //   // COMM PERCENT
  //   if (value === "comm_percent") {
  //     const commAmount = parseFloat(percentOrAmount);
  //     if (!isNaN(sellingAmount) && !isNaN(commAmount)) {
  //       let commPercent = (commAmount / sellingAmount) * 100 || 0;
  //       commPercent =
  //         commPercent % 1 === 0
  //           ? commPercent.toFixed(0)
  //           : commPercent.toFixed(2);
  //       let vat = 0;
  //       if (commissionData?.invoice_type === "Income") {
  //         vat = (commAmount * 5) / 100;
  //         vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
  //       }
  //       // let vat = commAmount * 5 / 100;
  //       // vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);
  //       let total = parseFloat(commAmount) + parseFloat(vat);
  //       total = total % 1 === 0 ? total.toFixed(0) : total.toFixed(2);

  //       console.log("COMM AMOUNT = ", commAmount);
  //       console.log("COMM PERCENT = ", commPercent);
  //       console.log("VAT = ", vat);
  //       console.log("TOTAL AMOUNT = ", total);

  //       setCommissionData((prevData) => ({
  //         ...prevData,
  //         comm_percent: commPercent,
  //         amount: commAmount,
  //         vat: vat,
  //       }));
  //       setTotalAmount(total);
  //     }
  //   }
  // };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseAddCommission();
    }, 1000);
  };

  const fetchUsers = async (title, type) => {
    try {
      let url = "";

      if (type === "user") {
        const ids = `${newCommData?.salesId},${newCommData?.managerId}`;
        url = `${BACKEND_URL}/users?title=${title}&ids=${ids}`;
      } else {
        url = `${BACKEND_URL}/vendors?vendor_name=${title}`;
      }

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Users: ", response);

      if (type === "user") {
        setUser(response?.data?.managers?.data);
        setPageLoading(false);
      } else {
        const vendors = response?.data?.data?.data;
        const filterDevs = vendors?.filter(
          (ven) => ven?.type?.toLowerCase() === "developer"
        );
        console.log("filter devs: ", filterDevs);
        setVendor(filterDevs);
      }
    } catch (error) {
      console.log(error);
      setPageLoading(false);

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

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const fetchVendors = async () => {
    setLoading(true);

    let url;

    if (
      commissionData?.invoice_type === "Income" ||
      status?.field !== "comm_status"
    ) {
      url = `${BACKEND_URL}/vendors`;
    } else {
      url = `${BACKEND_URL}/users`;
    }

    try {
      const vendorsList = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("vendors ::: ", vendorsList);

      if (
        commissionData?.invoice_type === "Income" ||
        status?.field !== "comm_status"
      ) {
        const vendors = vendorsList?.data?.data?.data;
        const filterDevs = vendors?.filter(
          (ven) => ven?.type?.toLowerCase() === "developer"
        );
        console.log("filter devs: ", filterDevs);
        setVendor(filterDevs);
      } else {
        setUser(vendorsList?.data?.managers?.data);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      toast.error("Unable to fetch the vendors", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      handleClose();
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [commissionData?.invoice_type]);
  useEffect(() => {
    setPageLoading(true);
    fetchUsers("", "user");
  }, [status?.field !== "comm_status"]);

  const AddCommmission = () => {
    // setBtnLoading(true);

    const token = localStorage.getItem("auth-token");

    let url;
    if (commData) {
      url = `${BACKEND_URL}/invoices/${commData?.id}`;
    } else {
      url = `${BACKEND_URL}/invoices`;
    }

    axios
      .post(url, commissionData, {
        // params: { category: "Commission" },
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);

        if (result?.data?.status === false) {
          toast.error(result?.data?.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setBtnLoading(false);
          return;
        }

        toast.success(
          `Commission ${commData ? "Updated" : "Added"} Successfully.`,
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );

        if (status?.field !== "comm_status") {
          const pdfBlob = generatePDF(commissionData);
        }

        setPdfPreview(null);
        setImagePreview(null);
        setBtnLoading(false);
        handleClose();
        fetchLeadsData();
      })
      .catch((err) => {
        setBtnLoading(false);

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

  return (
    <Modal
      keepMounted
      open={addCommissionModal}
      // onClose={handleCloseAddCommission}
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
              ? "bg-dark text-white"
              : "bg-light text-black"
          } ${
            isLangRTL(i18n.language)
              ? currentMode === "dark" && " border-primary border-r-2"
              : currentMode === "dark" && " border-primary border-l-2"
          }
            p-5 h-[100vh] w-[85vw] overflow-y-scroll 
          `}
        >
          {pageLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <HeadingTitle
                title={
                  commData ? t("edit_commission") : t("commission_details")
                }
              />

              <div
                className={`grid md:grid-cols-2 sm:grid-cols-1 ${
                  commData ? "lg:grid-cols-2" : "lg:grid-cols-2 xl:grid-cols-3"
                } ${
                  currentMode === "dark" ? "text-white" : "text-black"
                } gap-5 my-5`}
              >
                {/* Commission DETAILS  */}
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language) ? "right" : "left",
                    },
                    "& .css-10drtbx-MuiButtonBase-root-MuiCheckbox-root": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#2B2830",
                    },
                  }}
                  className={`${
                    currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
                  }
                  p-5`}
                >
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("commission_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5"></div>
                  {/* COMMISSION TYPE */}
                  <Select
                    options={commission_type(t, true)?.map((comm_type) => ({
                      value: comm_type?.value,
                      label: comm_type?.label,
                    }))}
                    value={commission_type(t, true)?.filter(
                      (comm) => comm?.value === commissionData?.invoice_type
                    )}
                    onChange={(e) => {
                      setCommissionData({
                        ...commissionData,
                        invoice_type: e.value,
                      });
                      setUpdatedField("invoice_type");
                    }}
                    placeholder={t("commission_type")}
                    className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                    required
                  />
                  {/* DATE */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={commissionData?.date}
                      label={t("date")}
                      views={["day", "month", "year"]}
                      onChange={(newValue) => {
                        const formattedDate = moment(newValue?.$d).format(
                          "YYYY-MM-DD"
                        );

                        setCommissionData((prev) => ({
                          ...prev,
                          date: formattedDate,
                        }));
                      }}
                      format="DD-MM-YYYY"
                      renderInput={(params) => (
                        <TextField
                          sx={{
                            "& input": {
                              color: currentMode === "dark" ? "white" : "black",
                            },
                            "& .MuiSvgIcon-root": {
                              color: currentMode === "dark" ? "white" : "black",
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
                  {/* CLAIM */}
                  <Select
                    options={claim(t)?.map((claim) => ({
                      value: claim.value,
                      label: claim.label,
                    }))}
                    value={claim(t)?.filter(
                      (claim) => claim?.value === commissionData?.claim
                    )}
                    onChange={(e) => {
                      setCommissionData({
                        ...commissionData,
                        claim: e.value,
                      });
                    }}
                    placeholder={t("claim")}
                    className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                  {status?.field !== "comm_status" &&
                  commissionData?.invoice_type !== "Income" ? (
                    // VENDOR
                    <FormControl
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                      sx={{
                        minWidth: "100%",
                        borderRadius: 1,
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        id="vendor_id"
                        select
                        value={commissionData?.vendor_id || "selected"}
                        label={t("vendor")}
                        onChange={(e) => {
                          const singleVendor = vendor?.find(
                            (ven) => ven?.id === e.target.value
                          );
                          console.log("singlevendor: ", singleVendor);
                          setSingleVendor(singleVendor);
                          setCommissionData({
                            ...commissionData,

                            vendor_id: e.target.value,
                          });
                        }}
                        size="small"
                        className="w-full border border-gray-300 rounded"
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
                        <MenuItem onKeyDown={(e) => e.stopPropagation()}>
                          <TextField
                            placeholder={t("search_vendors")}
                            ref={searchRef}
                            sx={{ "& input": { border: "0" } }}
                            variant="standard"
                            onChange={(e) => {
                              e.preventDefault();
                              const inputValue =
                                searchRef.current.querySelector("input").value;
                              if (inputValue) {
                                fetchUsers(inputValue);
                              }
                            }}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </MenuItem>
                        {vendor?.map((vendor) => (
                          <MenuItem key={vendor?.id} value={vendor?.id}>
                            {vendor?.vendor_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  ) : null}
                  {/* VENDOR / USER */}
                  {commissionData?.invoice_type === "Income" ? (
                    // VENDOR
                    <FormControl
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                      sx={{
                        minWidth: "100%",
                        borderRadius: 1,
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        id="vendor_id"
                        select
                        value={commissionData?.vendor_id || "selected"}
                        label={t("vendor")}
                        onChange={(e) => {
                          const singleVendor = vendor?.find(
                            (ven) => ven?.id === e.target.value
                          );
                          console.log("singlevendor: ", singleVendor);
                          setSingleVendor(singleVendor);
                          setCommissionData({
                            ...commissionData,

                            vendor_id: e.target.value,
                          });
                        }}
                        size="small"
                        className="w-full border border-gray-300 rounded"
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
                        <MenuItem onKeyDown={(e) => e.stopPropagation()}>
                          <TextField
                            placeholder={t("search_vendors")}
                            ref={searchRef}
                            sx={{ "& input": { border: "0" } }}
                            variant="standard"
                            onChange={(e) => {
                              e.preventDefault();
                              const inputValue =
                                searchRef.current.querySelector("input").value;
                              if (inputValue) {
                                fetchUsers(inputValue);
                              }
                            }}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </MenuItem>
                        {vendor?.map((vendor) => (
                          <MenuItem key={vendor?.id} value={vendor?.id}>
                            {vendor?.vendor_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  ) : commissionData?.invoice_type === "Expense" &&
                    status?.field == "comm_status" ? (
                    // USER
                    <FormControl
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                      sx={{
                        minWidth: "100%",
                        borderRadius: 1,
                        marginBottom: "10px",
                      }}
                    >
                      <TextField
                        id="user_id"
                        select
                        value={commissionData?.user_id || "selected"}
                        label={t("select_user")}
                        onChange={(e) => {
                          setCommissionData({
                            ...commissionData,

                            user_id: e.target.value,
                          });
                        }}
                        size="small"
                        className="w-full border border-gray-300 rounded"
                        displayEmpty
                        required
                        sx={{
                          height: "40px",
                          "& .MuiSelect-select": {
                            fontSize: 11,
                          },
                        }}
                      >
                        <MenuItem selected value="selected">
                          ---{t("select_user")}----
                        </MenuItem>
                        <MenuItem onKeyDown={(e) => e.stopPropagation()}>
                          <TextField
                            placeholder={t("search_users")}
                            ref={searchRef}
                            sx={{ "& input": { border: "0" } }}
                            variant="standard"
                            onChange={(e) => {
                              e.preventDefault();
                              const inputValue =
                                searchRef.current.querySelector("input").value;
                              if (inputValue) {
                                fetchUsers(inputValue, "user");
                              }
                            }}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </MenuItem>
                        {user?.map((user) => (
                          <MenuItem key={user?.id} value={user?.id}>
                            {user?.userName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  ) : (
                    <></>
                  )}
                  {/* AGENT MANAGER USERNAMES  */}
                  {status?.field !== "comm_status" && (
                    <>
                      {/* TITLE  */}
                      <Select
                        id="title"
                        options={title()}
                        value={title(t)?.find(
                          (curr) => curr.value === commissionData?.title
                        )}
                        onChange={(e) => {
                          setCommissionData({
                            ...commissionData,
                            title: e.value,
                          });
                        }}
                        placeholder={t("title")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      <Select
                        id="user_id"
                        options={users()?.filter(
                          (user) => user?.value !== null
                        )}
                        value={users()?.find(
                          (user) => user.value === commissionData?.user_id
                        )}
                        onChange={(e) => {
                          console.log("e::::::::: user: ", e);
                          setCommissionData({
                            ...commissionData,
                            user_id: e.value,
                          });
                        }}
                        placeholder={t("username")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                    </>
                  )}

                  {/* INVOICE */}
                  {!commData && (
                    <>
                      {imagePreview && (
                        <div className="mb-5 flex items-center justify-center ">
                          <div className=" rounded-lg border">
                            <img
                              src={imagePreview}
                              width="100px"
                              height="100px"
                            />
                          </div>
                        </div>
                      )}
                      {pdfPreview && (
                        <div className="flex flex-col justify-center items-center w-full gap-4">
                          <BsFileEarmarkMedical size={100} color={"#AAAAAA"} />
                          <div className="">
                            <p>File Selected </p>
                          </div>
                        </div>
                      )}
                      <input
                        accept="image/jpeg, image/png, image/jpg, image/gif, application/pdf"
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                        onChange={handleImgUpload}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          variant="contained"
                          size="medium"
                          className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold my-3"
                          style={{
                            color: "#ffffff",
                            border: "1px solid white",
                            fontFamily: fontFam,
                          }}
                          component="span" // Required so the button doesn't automatically submit form
                          disabled={loading ? true : false}
                          startIcon={
                            loading ? null : (
                              <MdFileUpload className="mx-2" size={16} />
                            )
                          }
                        >
                          <span>{t("upload_invoice")}</span>
                        </Button>
                      </label>
                    </>
                  )}
                </Box>
                {/* PAYMENT DETAILS */}
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language) ? "right" : "left",
                    },
                    "& .css-10drtbx-MuiButtonBase-root-MuiCheckbox-root": {
                      color: currentMode === "dark" ? "#EEEEEE" : "#2B2830",
                    },
                  }}
                  className={`${
                    currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"
                  }
                  p-5`}
                >
                  <h1 className="text-center text-primary py-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                    {t("payment_details")?.toUpperCase()}
                  </h1>
                  <div className="w-full pt-5"></div>
                  {/* PAYMENT STATUS */}
                  <Select
                    id="status"
                    options={payment_status(t)?.map((status) => ({
                      value: status?.value,
                      label: status?.label,
                    }))}
                    value={payment_status(t)?.filter(
                      (status) => status?.value === commissionData?.status
                    )}
                    onChange={(e) => {
                      setCommissionData({
                        ...commissionData,
                        status: e.value,
                      });
                    }}
                    placeholder={t("status")}
                    className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                  {/* PAYMENT SOURCE */}
                  <Select
                    id="paid_by"
                    options={payment_source(t)?.map((payment) => ({
                      value: payment.value,
                      label: payment.label,
                    }))}
                    value={payment_source(t)?.filter(
                      (pay_src) => pay_src?.value === commissionData?.paid_by
                    )}
                    onChange={(e) => {
                      setCommissionData({
                        ...commissionData,
                        paid_by: e.value,
                      });
                    }}
                    placeholder={t("payment_source")}
                    className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                  {/* COMMISSION */}
                  <div className="grid grid-cols-4">
                    {/* CURRENCY */}
                    <Select
                      id="currency"
                      options={currencies(t)}
                      value={currencies(t)?.find(
                        (curr) => curr.value === commissionData?.currency
                      )}
                      onChange={(e) => {
                        setCommissionData({
                          ...commissionData,
                          currency: e.value,
                        });
                      }}
                      placeholder={t("label_select_currency")}
                      // className={`mb-5`}
                      menuPortalTarget={document.body}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                    {/* AMOUNT */}
                    <TextField
                      id="amount"
                      type={"text"}
                      label={t("commission_amount")}
                      className="w-full col-span-2"
                      sx={{
                        "&": {
                          // marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={commissionData?.amount}
                      onChange={handleChange}
                      required
                    />
                    {/* PERCENTAGE */}
                    <TextField
                      id="comm_percent"
                      type={"number"}
                      // label={t("commission_perc")}
                      className="w-full"
                      sx={{
                        "&": {
                          // marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={commissionData?.comm_percent}
                      onChange={handleChange}
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <BsPercent size={18} color={"#777777"} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                  {/* VAT TOGGLE */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="success"
                        checked={includeVat}
                        onChange={() => toggleVat(!includeVat)}
                      />
                    }
                    label={t("including_vat")}
                    className="font-semibold mb-5"
                  />
                  {includeVat && (
                    <>
                      {/* VAT */}
                      <div className="grid grid-cols-4">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === commissionData?.currency
                          )}
                          onChange={(e) => {
                            setCommissionData({
                              ...commissionData,
                              currency: e.value,
                            });
                          }}
                          placeholder={t("label_select_currency")}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* AMOUNT */}
                        <TextField
                          id="vat"
                          type={"text"}
                          label={t("vat_amount")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={commissionData?.vat}
                          onChange={handleChange}
                          required
                        />
                        {/* PERCENT */}
                        <TextField
                          type={"number"}
                          className="w-full"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={"5"}
                          // onChange={handleChange}
                          required
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <BsPercent size={18} color={"#777777"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      {/* TOTAL AMOUNT */}
                      <div className="grid grid-cols-4">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) => curr.value === commissionData?.currency
                          )}
                          onChange={(e) => {
                            setCommissionData({
                              ...commissionData,
                              currency: e.value,
                            });
                          }}
                          placeholder={t("label_select_currency")}
                          // className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* AMOUNT */}
                        <TextField
                          id="total_amount"
                          type={"text"}
                          label={t("total_amount")}
                          className="w-full col-span-3"
                          sx={{
                            "&": {
                              // marginBottom: "1.25rem !important",
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={commissionData?.total_amount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}
                </Box>
              </div>

              <button
                // type="submit"
                // size="medium"
                style={{
                  color: "white",
                  fontFamily: fontFam,
                }}
                className={`${
                  currentMode === "dark"
                    ? "bg-primary-dark-neu"
                    : "bg-primary-light-neu"
                } w-full text-white p-3 font-semibold mb-3 `}
                onClick={AddCommmission}
                disabled={btnLoading ? true : false}
              >
                {btnLoading ? (
                  <CircularProgress
                    size={23}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <span>{commData ? t("edit_commission") : t("save")}</span>
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

export default AddCommissionModal;
