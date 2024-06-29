import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Box,
  InputAdornment,
  FormControlLabel,
  Checkbox,
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
import HeadingTitle from "../_elements/HeadingTitle";

import { BsPercent } from "react-icons/bs";

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

  const [withDiscount, setWithDiscount] = useState(false);
  const [withCashback, setWithCashback] = useState(false);

  // const [updateLeadData, setUpdateLeadData] = useState({});
  const [updateLeadData, setUpdateLeadData] = useState({
    agent_comm_amount: 0,
    agent_comm_percent: 0,
    manager_comm_amount: 0,
    manager_comm_percent: 5,
    amount: 0,
    comm_amount: 0,
    comm_percent: 0,
    discount_amount: 0,
    discount_percent: 0,
    cashback_amount: 0,
    cashback_percent: 0,
    comm_status: "",
    currency: "",
    dealDate: "",
    id: "",
    leadId: "",
    managerId: "",
    unit: "",
    updated_at: "",
    updated_by: "",
    updated_by_name: "",
    vat: "",
    leadName: "",
    project: "",
    enquiryType: "",
  });

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

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

  // DISCOUNT
  const toggleDiscount = (value) => {
    setWithDiscount(value);
    if (value === true) {
      console.log("WITH DISCOUNT");
    } else {
      setUpdateLeadData({
        ...updateLeadData,
        discount_amount: 0,
        discount_percent: 0,
      });
    }
  };
  // CASHBACK
  const toggleCashback = (value) => {
    setWithCashback(value);
    if (value === true) {
      console.log("WITH CASHBACK");
    } else {
      setUpdateLeadData({
        ...updateLeadData,
        cashback_amount: 0,
        cashback_percent: 0,
      });
    }
  };

  useEffect(() => {
    const {
      amount,
      comm_percent,
      comm_amount,
      agent_comm_percent,
      agent_comm_amount,
      manager_comm_percent,
      manager_comm_amount,
      discount_percent,
      discount_amount,
      cashback_percent,
      cashback_amount,
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
    // MANAGER COMMISSION AMOUNT
    if (updatedField === "amount" || updatedField === "manager_comm_percent") {
      autoCalculate("manager_comm_amount", comm_amount, manager_comm_percent);
    }
    // AGENT COMMISSION PERCENT
    if (updatedField === "amount" || updatedField === "manager_comm_amount") {
      autoCalculate("manager_comm_percent", comm_amount, manager_comm_amount);
    }
    // DISCOUNT PERCENT
    if (updatedField === "amount" || updatedField === "discount_amount") {
      autoCalculate("discount_percent", amount, discount_amount);
    }
    // DISCOUNT AMOUNT
    if (updatedField === "amount" || updatedField === "discount_percent") {
      autoCalculate("discount_amount", amount, discount_percent);
    }
    // CASHBACK PERCENT
    if (updatedField === "amount" || updatedField === "cashback_amount") {
      autoCalculate("cashback_percent", amount, cashback_amount);
    }
    // CASHBACK AMOUNT
    if (updatedField === "amount" || updatedField === "cashback_percent") {
      autoCalculate("cashback_amount", amount, cashback_percent);
    }
  }, [
    updateLeadData.amount,
    updateLeadData.comm_percent,
    updateLeadData.comm_amount,
    updateLeadData.agent_comm_percent,
    updateLeadData.agent_comm_amount,
    updateLeadData.manager_comm_percent,
    updateLeadData.manager_comm_amount,
    updateLeadData.discount_percent,
    updateLeadData.discount_amount,
    updateLeadData.cashback_percent,
    updateLeadData.cashback_amount,
    updatedField,
  ]);

  const autoCalculate = (value, amount, percentOrAmount) => {
    const sellingAmount = parseFloat(amount);
    console.log("SELLING AMOUNT = ", sellingAmount);
    // COMM AMOUNT
    if (value === "comm_amount") {
      const commPercent = parseFloat(percentOrAmount);
      const managerCommPercent = parseFloat(
        updateLeadData?.manager_comm_percent
      );

      if (!isNaN(sellingAmount) && !isNaN(commPercent)) {
        let commAmount = (sellingAmount * commPercent) / 100;
        commAmount =
          commAmount % 1 === 0 ? commAmount.toFixed(0) : commAmount.toFixed(2);
        let vat = (commAmount * 5) / 100;
        vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);

        // MANAGER
        let managerCommAmount = 0;
        if (updateLeadData?.salesId === updateLeadData?.closedBy) {
          managerCommAmount = (managerCommPercent * commAmount) / 100;
          managerCommAmount =
            managerCommAmount % 1 === 0
              ? managerCommAmount.toFixed(0)
              : managerCommAmount.toFixed(2);
        }
        // AGENT
        let agentCommAmount = 0;
        if (updateLeadData.agent_comm_percent !== 0) {
          const agentCommPercent = updateLeadData.agent_comm_percent;
          agentCommAmount = (agentCommPercent * commAmount) / 100;
          agentCommAmount =
            agentCommAmount % 1 === 0
              ? agentCommAmount.toFixed(0)
              : agentCommAmount.toFixed(2);
        }

        console.log("COMM PERCENT = ", commPercent);
        console.log("COMM AMOUNT = ", commAmount);
        console.log("VAT = ", vat);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          comm_amount: commAmount,
          vat: vat,
          manager_comm_amount: managerCommAmount,
          agent_comm_amount: agentCommAmount,
        }));
      }
    }
    // COMM PERCENT
    if (value === "comm_percent") {
      const commAmount = parseFloat(percentOrAmount);
      const managerCommPercent = parseFloat(
        updateLeadData?.manager_comm_percent
      );

      if (!isNaN(sellingAmount) && !isNaN(commAmount)) {
        let commPercent = (commAmount / sellingAmount) * 100 || 0;
        commPercent =
          commPercent % 1 === 0
            ? commPercent.toFixed(0)
            : commPercent.toFixed(2);
        let vat = (commAmount * 5) / 100;
        vat = vat % 1 === 0 ? vat.toFixed(0) : vat.toFixed(2);

        let managerCommAmount = 0;
        if (updateLeadData?.salesId === updateLeadData?.closedBy) {
          managerCommAmount = (managerCommPercent * commAmount) / 100;
          managerCommAmount =
            managerCommAmount % 1 === 0
              ? managerCommAmount.toFixed(0)
              : managerCommAmount.toFixed(2);
        }
        // AGENT
        let agentCommAmount = 0;
        if (updateLeadData.agent_comm_percent !== 0) {
          const agentCommPercent = updateLeadData.agent_comm_percent;
          agentCommAmount = (agentCommPercent * commAmount) / 100;
          agentCommAmount =
            agentCommAmount % 1 === 0
              ? agentCommAmount.toFixed(0)
              : agentCommAmount.toFixed(2);
        }

        console.log("COMM AMOUNT = ", commAmount);
        console.log("COMM PERCENT = ", commPercent);
        console.log("VAT = ", vat);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          comm_percent: commPercent,
          vat: vat,
          manager_comm_amount: managerCommAmount,
          agent_comm_amount: agentCommAmount,
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
    // MANAGER COMM AMOUNT
    if (value === "manager_comm_amount") {
      const managerCommPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(managerCommPercent)) {
        let managerCommAmount = (sellingAmount * managerCommPercent) / 100;
        managerCommAmount =
          managerCommAmount % 1 === 0
            ? managerCommAmount.toFixed(0)
            : managerCommAmount.toFixed(2);

        console.log("MANAGER COMM PERCENT = ", managerCommPercent);
        console.log("MANAGER COMM AMOUNT = ", managerCommAmount);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          manager_comm_amount: managerCommAmount,
        }));
      }
    }
    // MANAGER COMM PERCENT
    if (value === "manager_comm_percent") {
      const managerCommAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(managerCommAmount)) {
        let managerCommPercent = (managerCommAmount / sellingAmount) * 100 || 0;
        managerCommPercent =
          managerCommPercent % 1 === 0
            ? managerCommPercent.toFixed(0)
            : managerCommPercent.toFixed(2);

        console.log("MANAGER COMM AMOUNT = ", managerCommAmount);
        console.log("MANAGER COMM PERCENT = ", managerCommPercent);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          manager_comm_percent: managerCommPercent,
        }));
      }
    }
    // DISCOUNT AMOUNT
    if (value === "discount_amount") {
      const discountPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(discountPercent)) {
        let discountAmount = (sellingAmount * discountPercent) / 100;
        discountAmount =
          discountAmount % 1 === 0
            ? discountAmount.toFixed(0)
            : discountAmount.toFixed(2);

        console.log("DISCOUNT PERCENT = ", discountPercent);
        console.log("DISCOUNT AMOUNT = ", discountAmount);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          discount_amount: discountAmount,
        }));
      }
    }
    // DISCOUNT PERCENT
    if (value === "discount_percent") {
      const discountAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(discountAmount)) {
        let discountPercent = (discountAmount / sellingAmount) * 100 || 0;
        discountPercent =
          discountPercent % 1 === 0
            ? discountPercent.toFixed(0)
            : discountPercent.toFixed(2);

        console.log("DISCOUNT AMOUNT = ", discountAmount);
        console.log("DISCOUNT PERCENT = ", discountPercent);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          discount_percent: discountPercent,
        }));
      }
    }
    // CASHBACK AMOUNT
    if (value === "cashback_amount") {
      const cashbackPercent = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(cashbackPercent)) {
        let cashbackAmount = (sellingAmount * cashbackPercent) / 100;
        cashbackAmount =
          cashbackAmount % 1 === 0
            ? cashbackAmount.toFixed(0)
            : cashbackAmount.toFixed(2);

        console.log("CASHBACK PERCENT = ", cashbackPercent);
        console.log("CASHBACK AMOUNT = ", cashbackAmount);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          cashback_amount: cashbackAmount,
        }));
      }
    }
    // CASHBACK PERCENT
    if (value === "cashback_percent") {
      const cashbackAmount = parseFloat(percentOrAmount);
      if (!isNaN(sellingAmount) && !isNaN(cashbackAmount)) {
        let cashbackPercent = (cashbackAmount / sellingAmount) * 100 || 0;
        cashbackPercent =
          cashbackPercent % 1 === 0
            ? cashbackPercent.toFixed(0)
            : cashbackPercent.toFixed(2);

        console.log("CASHBACK AMOUNT = ", cashbackAmount);
        console.log("CASHBACK PERCENT = ", cashbackPercent);

        setUpdateLeadData((prevData) => ({
          ...prevData,
          cashback_percent: cashbackPercent,
        }));
      }
    }
  };

  useEffect(() => {
    console.log("lead data is ");
    console.log(LeadData);
    const token = localStorage.getItem("auth-token");

    // GETTING LEAD DETAILS
    if (LeadData) {
      setUpdateLeadData({
        amount: LeadData.amount,
        agent_comm_amount: LeadData.agent_comm_amount,
        agent_comm_percent: LeadData.agent_comm_percent,
        manager_comm_amount: LeadData.manager_comm_amount,
        manager_comm_percent: LeadData.manager_comm_percent,

        discount_amount: LeadData.discount_amount,
        discount_percent: LeadData.discount_percent,
        cashback_amount: LeadData.cashback_amount,
        cashback_percent: LeadData.cashback_percent,

        comm_amount: LeadData.comm_amount,
        comm_percent: LeadData.comm_percent,
        comm_status: LeadData.comm_status,

        currency: LeadData.currency,
        dealDate: LeadData.dealDate,
        id: LeadData.id,
        leadId: LeadData.leadId,
        // passport: LeadData.passport,
        // pdc_status: newData.pdc_status,
        // spa_status: newData.spa_status,
        unit: LeadData.unit,
        updated_at: LeadData.updated_at,
        updated_by: LeadData.updated_by,
        updated_by_name: LeadData.updated_by_name,
        vat: LeadData.vat,
        leadName: LeadData.leadName,
        project: LeadData?.project,
        enquiryType: LeadData?.enquiryType,

        managerId: LeadData?.managerId,
        salesId: LeadData?.salesId,
        closedBy: LeadData?.closedBy,
      });
      setImagePreview(LeadData.passport);
      if (LeadData.discount_amount !== 0) {
        setWithDiscount(true);
      }
      if (LeadData.cashback_amount !== 0) {
        setWithCashback(true);
      }
    }
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
          className={`${isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
            } ${isClosing
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
              // ? "blur-bg-dark-nr text-white"
              // : "blur-bg-white-nr text-black"
              } ${isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
              }
            p-5 h-[100vh] w-[85vw] overflow-y-scroll 
          `}
          >
            {loading ? (
              <div className="flex justify-center items-center h-[200px]">
                <CircularProgress />
              </div>
            ) : (
              <>
                <HeadingTitle
                  title={t("update_closed_details")}
                />

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {/* LEAD DETAILS */}
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
                    className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"} p-5`}
                  >
                    <h1 className="text-center text-primary pb-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                      {t("lead_details")}
                    </h1>

                    {/* LEAD NAME */}
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
                      value={updateLeadData?.leadName}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                    {/* PASSPORT */}
                    <div className="mb-5 flex items-center justify-center ">
                      <div className=" rounded-lg border">
                        <img
                          src={imagePreview}
                          width="100px"
                          height="100px"
                        />
                      </div>
                    </div>
                    <>
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
                    </>
                  </Box>

                  {/* PROJECT DETAILS */}
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
                    className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"} p-5`}
                  >
                    <h1 className="text-center text-primary pb-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                      {t("project_details")}
                    </h1>

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
                    {/* ENQUIRY TYPE */}
                    <Select
                      id="enquiryType"
                      options={enquiry_options(t)}
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
                    {/* SELLING AMOUNT */}
                    <div className="grid grid-cols-4">
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
                        className="w-full col-span-3"
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
                  </Box>

                  {/* COMMISSION DETAILS */}
                  {hasPermission("deal_commission") && (
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
                      className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"} p-5`}
                    >
                      <h1 className="text-center text-primary pb-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                        {t("commission_details")}
                      </h1>

                      {/* COMMISSION */}
                      <div className="grid grid-cols-4">
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
                        {/* COMM PERCENT */}
                        <TextField
                          id="comm_percent"
                          type={"text"}
                          // label={t("total_commission")}
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
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <BsPercent size={18} color={"#777777"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                      {/* VAT */}
                      <div className="grid grid-cols-4">
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
                          className="w-full col-span-3"
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
                      {/* AGENT */}
                      {LeadData?.salesId && (
                        <div className="grid grid-cols-4">
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
                          {/* AGENT PERCENT */}
                          <TextField
                            id="agent_comm_percent"
                            type={"text"}
                            // label={t("agent_comm_perc")}
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
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <BsPercent size={18} color={"#777777"} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </div>
                      )}
                      {/* MANAGER */}
                      {updateLeadData?.salesId ===
                        updateLeadData?.closedBy && (
                          <div className="grid grid-cols-4">
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
                            {/* MANAGER COMM */}
                            <TextField
                              id="manager_comm_amount"
                              type={"text"}
                              label={t("manager_comm_amount")}
                              className="w-full col-span-2"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                  zIndex: 1,
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={updateLeadData?.manager_comm_amount}
                              onChange={(e) => handleChange(e)}
                              required
                            />
                            <TextField
                              id="manager_comm_percent"
                              type={"text"}
                              label={t("manager_comm_perc")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                  zIndex: 1,
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={updateLeadData?.manager_comm_percent}
                              onChange={(e) => handleChange(e)}
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
                        )}
                    </Box>
                  )}

                  {/* DISCOUNT OR CASHBACK */}
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
                    className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"} p-5`}
                  >
                    <h1 className="text-center text-primary pb-2 mb-5 uppercase font-semibold border-b-2 border-primary">
                      {t("label_other_details")}
                    </h1>
                    {/* DISCOUNT TOGGLE */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          checked={withDiscount}
                          onChange={() => toggleDiscount(!withDiscount)}
                        />
                      }
                      label={t("discount")}
                      className="font-semibold"
                    />
                    {withDiscount && (
                      <div className="grid grid-cols-4">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
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
                        {/* DISCOUNT AMOUNT */}
                        <TextField
                          id="discount_amount"
                          type={"number"}
                          label={t("discount")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={updateLeadData?.discount_amount}
                          onChange={(e) => handleChange(e)}
                        />
                        {/* DISCOUNT PERCENTAGE */}
                        <TextField
                          id="discount_percent"
                          type={"number"}
                          // label={t("paid_percent")}
                          className="w-full"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={updateLeadData?.discount_percent}
                          onChange={(e) => handleChange(e)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <BsPercent size={18} color={"#777777"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
                    )}
                    {/* CASHBACK TOGGLE */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="success"
                          checked={withCashback}
                          onChange={() => toggleCashback(!withCashback)}
                        />
                      }
                      label={t("cashback")}
                      className="font-semibold"
                    />
                    {withCashback && (
                      <div className="grid grid-cols-4">
                        {/* CURRENCY */}
                        <Select
                          id="currency"
                          options={currencies(t)}
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
                        {/* CASHBACK AMOUNT */}
                        <TextField
                          id="cashback_amount"
                          type={"number"}
                          label={t("cashback")}
                          className="w-full col-span-2"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={updateLeadData?.cashback_amount}
                          onChange={(e) => handleChange(e)}
                        />
                        {/* CASHBACK PERCENTAGE */}
                        <TextField
                          id="cashback_percent"
                          type={"number"}
                          // label={t("paid_percent")}
                          className="w-full"
                          sx={{
                            "&": {
                              zIndex: 1,
                            },
                          }}
                          variant="outlined"
                          size="small"
                          value={updateLeadData?.cashback_percent}
                          onChange={(e) => handleChange(e)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <BsPercent size={18} color={"#777777"} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </div>
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
                  className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"
                    } w-full uppercase text-white p-3 font-semibold my-5`}
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
                    <span>{t("update_deal")}</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateLead;
