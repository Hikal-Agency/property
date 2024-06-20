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

import {
  currencies,
  payment_source,
  title,
} from "../../Components/_elements/SelectOptions";

import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { MdClose } from "react-icons/md";
import { selectStyles } from "../../Components/_elements/SelectStyles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import jsPDF from "jspdf";
import { fontSize } from "@mui/system";

const CommissionReceipt = ({
  commissionReceipt,
  setCommissionReceipt,
  Feedback,
  data,
}) => {
  console.log(" commission receipt : ", commissionReceipt);
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
    Managers,
    SalesPerson,
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const currentDate = moment().format("YYYY-MM-DD");

  const [pdfUrl, setPDFUrl] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [user, setUsers] = useState([]);
  const searchRef = useRef();

  const [commissionReceiptData, setCommRecData] = useState({
    project: data?.project || null,
    payment_source: null,
    title: null,
    unit: data?.unit || null,
    invoice_id: commissionReceipt?.id || null,
    date: moment().format("YYYY-MM-DD"),
    currency: commissionReceipt?.currency || "AED",
    developer: null,
    amount: commissionReceipt?.amount || 0,
    claim: "Full",
    user: null,
  });

  console.log("comm req data:: ", commissionReceiptData);

  const users = () => [
    {
      value: data?.managerId,
      label: user?.find((manager) => manager.id === data?.managerId)?.userName,
    },
    {
      value: data?.salesId,
      label: user?.find((sale) => sale.id === data?.salesId)?.userName,
    },
  ];

  const token = localStorage.getItem("auth-token");

  const fetchVendors = async () => {
    setLoading(true);
    const vendorUrl = `${BACKEND_URL}/vendors`;
    const ids = `${data?.salesId},${data?.managerId}`;
    const userUrl = `${BACKEND_URL}/users?ids=${ids}`;

    try {
      const [vendorsResponse, usersResponse] = await Promise.all([
        axios.get(vendorUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
        axios.get(userUrl, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }),
      ]);

      console.log("vendors list:: ", vendorsResponse);
      console.log("users list:: ", usersResponse);

      const vendor = vendorsResponse?.data?.data?.data;
      const filteredVendor = vendor?.filter(
        (ven) => ven?.type?.toLowerCase() === "developer"
      );

      console.log("filtered vendors : ", filteredVendor);

      setVendors(filteredVendor);
      setUsers(usersResponse?.data?.managers?.data);
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

      const vendor = response?.data?.data?.data;
      const filteredVendor = vendor?.filter(
        (ven) => ven?.type?.toLowerCase() === "developer"
      );

      console.log(" search filtered vendors : ", filteredVendor);

      setVendors(filteredVendor);
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

    setCommRecData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setCommissionReceipt(false);
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

    const addCompanyDetails = () => {
      doc.setFont("Arial", "normal");
      doc.setFontSize(12);
      // Message
      doc.text(
        `Dear: ${data?.title?.toUpperCase()} ${data?.user} `,
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
        `closed in ${data?.developer}. Kindly see the detailed table below for the unit.`,
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
      doc.text(`${data?.payment_source} `, paddingX, usedY + 39);

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

    doc.save(`${data?.invoice_id} - ${data?.developer}.pdf`);
    return pdfBlob;
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <Modal
      keepMounted
      open={commissionReceipt}
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
                    {t("commission_voucher_heading")}
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
                      {/* PROJECT NAME */}
                      <TextField
                        id="project"
                        type={"text"}
                        label={t("project")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commissionReceiptData?.project}
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
                        value={commissionReceiptData?.unit}
                        onChange={(e) => handleChange(e)}
                        required
                      />

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
                          id="developer"
                          select
                          value={commissionReceiptData?.developer || "selected"}
                          label={t("vendor")}
                          onChange={(e) => {
                            setCommRecData({
                              ...commissionReceiptData,
                              developer: e.target.value,
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
                      {/* TITLE  */}
                      <Select
                        id="title"
                        options={title()}
                        value={title(t)?.find(
                          (curr) => curr.value === commissionReceiptData?.title
                        )}
                        onChange={(e) => {
                          setCommRecData({
                            ...commissionReceiptData,
                            title: e.value,
                          });
                        }}
                        placeholder={t("title")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      {/* AGENT MANAGER USERNAMES  */}
                      <Select
                        id="user"
                        options={users()}
                        value={users()?.find(
                          (user) => user.label === commissionReceiptData?.user
                        )}
                        onChange={(e) => {
                          console.log("e::::::::: user: ", e);
                          setCommRecData({
                            ...commissionReceiptData,
                            user: e.label,
                          });
                        }}
                        placeholder={t("username")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                    </Box>
                  </div>
                </div>

                {/* PAYMENT DETAILS */}
                <div
                  className={`px-5 pt-5 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                >
                  <h1 className="text-center uppercase font-semibold">
                    {t("payment_details")?.toUpperCase()}
                  </h1>
                  <hr className="my-4" />
                  <div className="w-full">
                    <Box
                      sx={{
                        ...darkModeColors,
                      }}
                    >
                      {/* PAYMENT MODE  */}
                      <Select
                        id="payment_source"
                        options={payment_source(t)?.map((payment) => ({
                          value: payment.value,
                          label: payment.label,
                        }))}
                        value={payment_source(t)?.filter(
                          (pay_src) =>
                            pay_src?.value ===
                            commissionReceiptData?.payment_source
                        )}
                        onChange={(e) => {
                          setCommRecData({
                            ...commissionReceiptData,
                            payment_source: e.value,
                          });
                        }}
                        placeholder={t("payment_source")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      {/* CURRENCY  */}
                      <Select
                        id="currency"
                        options={currencies(t)}
                        value={currencies(t)?.find(
                          (curr) =>
                            curr.value === commissionReceiptData?.currency
                        )}
                        onChange={(e) => {
                          setCommRecData({
                            ...commissionReceiptData,
                            currency: e.value,
                          });
                        }}
                        placeholder={t("label_select_currency")}
                        className={`mb-5`}
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />

                      {/* AMOUNT  */}
                      <TextField
                        id="amount"
                        type={"text"}
                        label={t("label_amount")}
                        className="w-full"
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                            zIndex: 1,
                          },
                        }}
                        variant="outlined"
                        size="small"
                        value={commissionReceiptData?.amount}
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
              onClick={() => generatePDF(commissionReceiptData)}
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

export default CommissionReceipt;
