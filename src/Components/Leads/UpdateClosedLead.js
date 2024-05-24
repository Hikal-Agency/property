import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Box,
} from "@mui/material";

import axios from "../../axoisConfig";
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { MdClose, MdFileUpload } from "react-icons/md";
import { selectStyles } from "../_elements/SelectStyles";
import Select from "react-select";
import { currencies, enquiry_options } from "../_elements/SelectOptions";
import usePermission from "../../utils/usePermission";
import moment from "moment";

const UpdateLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  FetchLeads,
  LeadData,
}) => {
  // eslint-disable-next-line
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    formatNum,
    t,
    isLangRTL,
    i18n,
    fontFam,
    isArabic,
    primaryColor,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  const { hasPermission } = usePermission();

  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);

  const inputFileRef = useRef(null);
  const [Feedback, setFeedback] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [leadDate, setLeadDate] = useState("");
  const [updatedField, setUpdatedField] = useState("");
  // const [updateLeadData, setUpdateLeadData] = useState({});
  const [updateLeadData, setUpdateLeadData] = useState({
    agent_comm_amount: "",
    agent_comm_percent: "",
    amount: "",
    comm_amount: "",
    comm_percent: "",
    comm_status: "",
    currency: "",
    dealDate: "",
    id: "",
    leadId: "",
    managerId: "",
    passport: "",
    unit: "",
    updated_at: "",
    updated_by: "",
    updated_by_name: "",
    vat: "",
    project: "",
    enquiryType: "",
  });

  // const style = {
  //   transform: "translate(-50%, -50%)",
  //   boxShadow: 24,
  // };
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  console.log("update lead data:: ", updateLeadData);

  const handleImgUpload = (e) => {
    console.log("image upload: ");
    const file = e.target.files[0];

    console.log("files:: ", file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);

      const base64Image = reader.result;
      setUpdateLeadData({
        ...updateLeadData,
        passport: file,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleLeadModelClose();
    }, 1000);
  };

  const handleChange = (e) => {
    console.log("E::: ", e);
    const value = e.target.value;
    const id = e.target.id;

    setUpdateLeadData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setUpdatedField(id);
  };

  useEffect(() => {
    const {
      amount,
      comm_percent,
      comm_amount,
      agent_comm_percent,
      agent_comm_amount,
    } = updateLeadData;

    // COMMISSION AMOUNT
    if (updatedField === "amount" || updatedField === "comm_percent") {
      autoCalculate("comm_amount", amount, comm_percent);
      // autoCalculate("vat", comm_amount, 5);
    }
    // COMMISSION PERCENT
    if (updatedField === "amount" || updatedField === "comm_amount") {
      autoCalculate("comm_percent", amount, comm_amount);
    }
    // AGENT COMM AMOUNT
    if (updatedField === "amount" || updatedField === "agent_comm_percent") {
      autoCalculate("agent_comm_amount", comm_amount, agent_comm_percent);
    }
    // AGENT COMMISSION PERCENT
    if (updatedField === "amount" || updatedField === "agent_comm_amount") {
      autoCalculate("agent_comm_percent", comm_amount, agent_comm_amount);
    }
  }, [
    updateLeadData.amount,
    updateLeadData.comm_percent,
    updateLeadData.comm_amount,
    updateLeadData.agent_comm_percent,
    updateLeadData.agent_comm_amount,
    updatedField,
  ]);

  const autoCalculate = (value, amount, percentOrAmount) => {
    const sellingAmount = parseFloat(amount);
    console.log("SELLING AMOUNT = ", sellingAmount);
    // COMM AMOUNT
    if (value === "comm_amount") {
      const commPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(commPercent)) {
        let commAmount = (sellingAmount * commPercent) / 100;
        commAmount =
          commAmount % 1 === 0 ? commAmount.toFixed(0) : commAmount.toFixed(2);
        let vat = (commAmount * 5) / 100;
        vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);

        console.log("COMM PERCENT = ", commPercent);
        console.log("COMM AMOUNT = ", commAmount);
        console.log("VAT = ", vat);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          comm_amount: commAmount,
          vat: vat,
        }));
      }
    }
    // COMM PERCENT
    if (value === "comm_percent") {
      const commAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(commAmount)) {
        let commPercent = (commAmount / sellingAmount) * 100 || 0;
        commPercent =
          commPercent % 1 === 0
            ? commPercent.toFixed(0)
            : commPercent.toFixed(2);
        let vat = (commAmount * 5) / 100;
        vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);

        console.log("COMM AMOUNT = ", commAmount);
        console.log("COMM PERCENT = ", commPercent);
        console.log("VAT = ", vat);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          comm_percent: commPercent,
          vat: vat,
        }));
      }
    }
    // AGENT COMM AMOUNT
    if (value === "agent_comm_amount") {
      const agentCommPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(agentCommPercent)) {
        let agentCommAmount = (sellingAmount * agentCommPercent) / 100;
        agentCommAmount =
          agentCommAmount % 1 === 0
            ? agentCommAmount.toFixed(0)
            : agentCommAmount.toFixed(2);

        console.log("AGENT COMM PERCENT = ", agentCommPercent);
        console.log("AGENT COMM AMOUNT = ", agentCommAmount);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          agent_comm_amount: agentCommAmount,
        }));
      }
    }
    // AGENT COMM PERCENT
    if (value === "agent_comm_percent") {
      const agentCommAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(agentCommAmount)) {
        let agentCommPercent = (agentCommAmount / sellingAmount) * 100 || 0;
        agentCommPercent =
          agentCommPercent % 1 === 0
            ? agentCommPercent.toFixed(0)
            : agentCommPercent.toFixed(2);

        console.log("AGENT COMM AMOUNT = ", agentCommAmount);
        console.log("AGENT COMM PERCENT = ", agentCommPercent);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          agent_comm_percent: agentCommPercent,
        }));
      }
    }
  };
  // ----------------------

  useEffect(() => {
    console.log("lead data is ");
    console.log(LeadData);
    const token = localStorage.getItem("auth-token");

    // GETTING LEAD DETAILS
    if (LeadData) {
      setUpdateLeadData({
        agent_comm_amount: LeadData.agent_comm_amount,
        agent_comm_percent: LeadData.agent_comm_percent,
        amount: LeadData.amount,

        comm_amount: LeadData.comm_amount,
        comm_percent: LeadData.comm_percent,
        comm_status: LeadData.comm_status,

        currency: LeadData.currency,
        dealDate: LeadData.dealDate,
        id: LeadData.id,
        leadId: LeadData.leadId,
        managerId: LeadData.managerId,
        passport: LeadData.passport,
        // pdc_status: newData.pdc_status,
        // salesId: newData.salesId,
        // spa_status: newData.spa_status,
        unit: LeadData.unit,
        updated_at: LeadData.updated_at,
        updated_by: LeadData.updated_by,
        updated_by_name: LeadData.updated_by_name,
        vat: LeadData.vat,
        project: LeadData?.project,
        enquiryType: LeadData?.enquiryType,
      });
    }
    // axios
    //   .get(
    //     `${BACKEND_URL}/closedDeals/${LeadData.lid}`,
    //     {},
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //         Authorization: "Bearer " + token,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log("the lead details is given by");
    //     console.log(result);
    //     setloading(false);

    //     if (result.data.status) {
    //       const newData = result.data.closeddeals;
    //       setUpdateLeadData({
    //         agent_comm_amount: newData.agent_comm_amount,
    //         agent_comm_percent: newData.agent_comm_percent,
    //         amount: newData.amount,

    //         comm_amount: newData.comm_amount,
    //         comm_percent: newData.comm_percent,
    //         comm_status: newData.comm_status,

    //         currency: newData.currency,
    //         dealDate: newData.dealDate,
    //         id: newData.id,
    //         leadId: newData.leadId,
    //         managerId: newData.managerId,
    //         passport: newData.passport,
    //         // pdc_status: newData.pdc_status,
    //         // salesId: newData.salesId,
    //         // spa_status: newData.spa_status,
    //         unit: newData.unit,
    //         updated_at: newData.updated_at,
    //         updated_by: newData.updated_by,
    //         updated_by_name: newData.updated_by_name,
    //         vat: newData.vat,
    //         project: LeadData?.project,
    //         enquiryType: LeadData?.enquiryType,
    //       });
    //     } else {
    //       toast.error("Error in Fetching the Lead", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //       });
    //       handleLeadModelClose();
    //     }
    //     setloading(false);
    //   })
    //   .catch((err) => {
    //     setloading(false);
    //     console.error(err);
    //     toast.error("Error in Fetching the Lead", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //     handleLeadModelClose();
    //   });
    // eslint-disable-next-line
  }, [LeadData]);

  console.log("leadDate:: ", leadDate);

  const UpdateLeadFunc = async () => {
    console.log("leadDate:: ", leadDate);

    let date = leadDate;
    if (!leadDate) {
      date = LeadData?.dealDate;
    }

    setbtnloading(true);
    const token = localStorage.getItem("auth-token");

    await axios
      .post(`${BACKEND_URL}/editdeal/${LeadData.lid}`, updateLeadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("lead updated successfull");
        console.log(result);
        toast.success("Lead Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        FetchLeads(token);
        setbtnloading(false);
        handleLeadModelClose();
      })
      .catch((err) => {
        toast.error("Error in Updating the Lead", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };

  function format(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={LeadModelOpen}
        onClose={handleLeadModelClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
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
              <div className="flex justify-center items-center h-[200px]">
                <CircularProgress />
              </div>
            ) : (
              <>
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
                    style={{
                      fontFamily: isArabic(Feedback?.feedback)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {t("update_closed_details")}
                  </h1>
                </div>

                <div className="grid md:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6 p-6 justify-center">
                  {/* Project DETAILS  */}
                  <div
                    className={`p-4 rounded-xl shadow-sm card-hover
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
                          value={updateLeadData?.project}
                          onChange={(e) => handleChange(e)}
                          required
                        />
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
                          value={updateLeadData?.enquiryType}
                          onChange={(e) => handleChange(e)}
                          required
                        /> */}
                        {/* ENQUIRY TYPE */}
                        <Select
                          id="enquiryType"
                          options={enquiry_options(t)}
                          // value={closedDealData.enquiryType}
                          value={enquiry_options(t)?.find(
                            (fb) => fb.value === updateLeadData?.enquiryType
                          )}
                          onChange={(e) => {
                            setUpdateLeadData({
                              ...updateLeadData,
                              enquiryType: e.value,
                            });
                          }}
                          placeholder={t("label_enquiry_for")}
                          className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
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
                          value={updateLeadData?.unit}
                          onChange={(e) => handleChange(e)}
                          required
                        />
                        {/* DEAL DATE */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={
                              updateLeadData?.dealDate || new Date()?.toString()
                            }
                            label={t("deal_date")}
                            views={["day", "month", "year"]}
                            onChange={(newValue) => {
                              const formattedDate = moment(newValue?.$d).format(
                                "YYYY-MM-DD"
                              );

                              setUpdateLeadData((prev) => ({
                                ...prev,
                                dealDate: formattedDate,
                              }));
                            }}
                            format="DD-MM-YYYY"
                            renderInput={(params) => (
                              <TextField
                                sx={{
                                  "& input": {
                                    color:
                                      currentMode === "dark"
                                        ? "white"
                                        : "black",
                                  },
                                  "& .MuiSvgIcon-root": {
                                    color:
                                      currentMode === "dark"
                                        ? "white"
                                        : "black",
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
                            maxDate={dayjs().startOf("day").toDate()}
                          />
                        </LocalizationProvider>
                        <div className="grid grid-cols-3">
                          {/* CURRENCY */}
                          <Select
                            id="currency"
                            options={currencies(t)?.map((curr) => ({
                              value: curr.value,
                              label: curr.label,
                            }))}
                            value={currencies(t)?.find(
                              (curr) => curr.value === updateLeadData?.currency
                            )}
                            onChange={(e) => {
                              setUpdateLeadData({
                                ...updateLeadData,
                                currency: e.value,
                              });
                            }}
                            placeholder={t("label_select_currency")}
                            // className={`mb-5`}
                            menuPortalTarget={document.body}
                            styles={selectStyles(currentMode, primaryColor)}
                          />
                          {/* SELLING AMOUNT */}
                          <TextField
                            id="amount"
                            type={"text"}
                            label={t("selling_amount")}
                            className="w-full col-span-2"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={updateLeadData?.amount}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                        </div>
                      </Box>
                    </div>
                  </div>

                  {/* COMMISSION DETAILS  */}
                  {hasPermission("deal_commission") && (
                    <div
                      className={`p-4 rounded-xl shadow-sm card-hover ${
                        currentMode === "dark"
                          ? "bg-[#1C1C1C] text-white"
                          : "bg-[#EEEEEE] text-black"
                      }
                      `}
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
                          {/* COMM PERCENT */}
                          <TextField
                            id="comm_percent"
                            type={"text"}
                            label={t("total_commission")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={updateLeadData?.comm_percent}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                          <div className="grid grid-cols-3">
                            {/* CURRENCY */}
                            <Select
                              id="currency"
                              options={currencies(t)?.map((curr) => ({
                                value: curr.value,
                                label: curr.label,
                              }))}
                              value={currencies(t)?.find(
                                (curr) =>
                                  curr.value === updateLeadData?.currency
                              )}
                              onChange={(e) => {
                                setUpdateLeadData({
                                  ...updateLeadData,
                                  currency: e.value,
                                });
                              }}
                              placeholder={t("label_select_currency")}
                              // className={`mb-5`}
                              menuPortalTarget={document.body}
                              styles={selectStyles(currentMode, primaryColor)}
                            />
                            {/* COMM AMOUNT */}
                            <TextField
                              id="comm_amount"
                              type={"text"}
                              label={t("total_commission_amount")}
                              className="w-full col-span-2"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                  zIndex: 1,
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={updateLeadData?.comm_amount}
                              onChange={(e) => handleChange(e)}
                              required
                            />
                          </div>
                          <div className="grid grid-cols-3">
                            {/* CURRENCY */}
                            <Select
                              id="currency"
                              options={currencies(t)?.map((curr) => ({
                                value: curr.value,
                                label: curr.label,
                              }))}
                              value={currencies(t)?.find(
                                (curr) =>
                                  curr.value === updateLeadData?.currency
                              )}
                              onChange={(e) => {
                                setUpdateLeadData({
                                  ...updateLeadData,
                                  currency: e.value,
                                });
                              }}
                              placeholder={t("label_select_currency")}
                              // className={`mb-5`}
                              menuPortalTarget={document.body}
                              styles={selectStyles(currentMode, primaryColor)}
                            />
                            {/* VAT AMOUNT */}
                            <TextField
                              id="vat"
                              type={"text"}
                              label={t("vat_amount")}
                              className="w-full col-span-2"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                  zIndex: 1,
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={updateLeadData?.vat}
                              onChange={(e) => handleChange(e)}
                              required
                            />
                          </div>

                          {/* <TextField
                            id="vat"
                            type={"text"}
                            label={t("vat_perc")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={updateLeadData?.vat}
                            onChange={(e) => handleChange(e)}
                            required
                          /> */}

                          {/* AGENT PERCENT */}
                          <TextField
                            id="agent_comm_percent"
                            type={"text"}
                            label={t("agent_comm_perc")}
                            className="w-full"
                            sx={{
                              "&": {
                                marginBottom: "1.25rem !important",
                                zIndex: 1,
                              },
                            }}
                            variant="outlined"
                            size="small"
                            value={updateLeadData?.agent_comm_percent}
                            onChange={(e) => handleChange(e)}
                            required
                          />
                          <div className="grid grid-cols-3">
                            {/* CURRENCY */}
                            <Select
                              id="currency"
                              options={currencies(t)?.map((curr) => ({
                                value: curr.value,
                                label: curr.label,
                              }))}
                              value={currencies(t)?.find(
                                (curr) =>
                                  curr.value === updateLeadData?.currency
                              )}
                              onChange={(e) => {
                                setUpdateLeadData({
                                  ...updateLeadData,
                                  currency: e.value,
                                });
                              }}
                              placeholder={t("label_select_currency")}
                              // className={`mb-5`}
                              menuPortalTarget={document.body}
                              styles={selectStyles(currentMode, primaryColor)}
                            />
                            {/* AGENT COMM */}
                            <TextField
                              id="agent_comm_amount"
                              type={"text"}
                              label={t("agent_comm_amount")}
                              className="w-full col-span-2"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                  zIndex: 1,
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={updateLeadData?.agent_comm_amount}
                              onChange={(e) => handleChange(e)}
                              required
                            />
                          </div>
                        </Box>
                      </div>
                    </div>
                  )}

                  {/* CLIENT  DETAILS  */}
                  {/* <div
                    className={`p-4 rounded-xl shadow-sm card-hover
                  ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("client_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <Box sx={darkModeColors} className="p-2">
                        <div className="  mb-5 flex items-center justify-center ">
                          <div className=" rounded-lg border">
                            <img
                              src={imagePreview}
                              width="100px"
                              height="100px"
                            />
                          </div>
                        </div>
                        <input
                          accept="image/*"
                          style={{ display: "none" }}
                          id="contained-button-file"
                          type="file"
                          onChange={handleImgUpload}
                          ref={inputFileRef}
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
                            disabled={btnloading ? true : false}
                            startIcon={
                              <MdFileUpload className="mx-2" size={16} />
                            }
                            onClick={() => inputFileRef.current.click()}
                          >
                            <span>{t("button_upload_image")}</span>
                          </Button>
                        </label>
                      </Box>
                    </div>
                  </div> */}
                </div>
              </>
            )}

            <div className="p-6">
              <Button
                type="submit"
                size="medium"
                style={{
                  color: "white",
                  fontFamily: fontFam,
                }}
                className="bg-btn-primary w-full text-white rounded-lg p-4 font-semibold mb-3 shadow-md hover:-mt-1 hover:mb-1"
                onClick={UpdateLeadFunc}
                disabled={btnloading ? true : false}
              >
                {btnloading ? (
                  <CircularProgress
                    size={23}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <span>{t("update")}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateLead;
