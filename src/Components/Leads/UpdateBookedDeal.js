import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  TextField,
  FormControl,
  IconButton,
  InputLabel,
} from "@mui/material";
import Select from "react-select";
import axios from "../../axoisConfig";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { MdClose } from "react-icons/md";
import {
  currencies,
  enquiry_options,
  property_options,
  purpose_options,
} from "../_elements/SelectOptions";
import { selectStyles } from "../_elements/SelectStyles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import HeadingTitle from "../_elements/HeadingTitle";

const UpdateBookedDeal = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  BACKEND_URL,
  FetchLeads,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    t,
    isLangRTL,
    i18n,
    primaryColor,
  } = useStateContext();

  console.log("enquiry options ===> ", enquiry_options);
  const [isClosing, setIsClosing] = useState(false);

  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  const token = localStorage.getItem("auth-token");
  const [PropertyType, setPropertyType] = useState("");
  const [EnquiryType, setEnquiryType] = useState("");
  const [ForType, setForType] = useState("");
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  //eslint-disable-next-line
  const [LeadStatus, setLeadStatus] = useState("");
  //eslint-disable-next-line
  const [LeadSource, setLeadSource] = useState("");
  const [Feedback, setFeedback] = useState("");
  const [Manager, setManager] = useState("");
  const [Manager2, setManager2] = useState([]);
  //eslint-disable-next-line
  const [SalesPerson, setSalesPerson] = useState([]);
  //eslint-disable-next-line
  const [SalesPerson2, setSalesPerson2] = useState("");
  const [LeadName, setLeadName] = useState("");
  const [LeadContact, setLeadContact] = useState("");
  const [LeadEmail, setLeadEmail] = useState("");
  const [LeadProject, setLeadProject] = useState("");
  const [booked_amount, setBookedAmount] = useState("");
  const [sellingAmount, setSellingAmount] = useState("");
  const [booked_date, setBookedDate] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [currency, setCurrency] = useState("AED");
  const [unit, setUnit] = useState("");
  //eslint-disable-next-line
  const [LeadNotes, setLeadNotes] = useState("");

  //eslint-disable-next-line
  // const ChangeLeadStatus = (event) => {
  //   setLeadStatus(event.target.value);
  // };
  //eslint-disable-next-line
  // const ChangeLeadSource = (event) => {
  //   setLeadSource(event.target.value);
  // };
  // const ChangeFeedback = (event) => {
  //   setFeedback(event.target.value);
  // };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleLeadModelClose();
    }, 1000);
  };

  //eslint-disable-next-line
  // const ChangeManager = (event) => {
  //   setManager(event.target.value);
  //   const SalesPersons = Manager2.filter(function (el) {
  //     return el.uid === event.target.value;
  //   });
  //   setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  // };
  // //eslint-disable-next-line
  // const ChangeSalesPerson = (event) => {
  //   setSalesPerson2(event.target.value);
  // };

  // const ChangeLanguagePrefered = (e) => {
  //   setLanguagePrefered(e.target.value);
  // };

  const ChangeEnquiryType = (e) => {
    setEnquiryType(e.value);
  };

  const ChangePropertyType = (e) => {
    setPropertyType(e.value);
  };

  const ChangeForType = (e) => {
    setForType(e.value);
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    // console.log("User is");
    // console.log(User);

    axios
      .get(`${BACKEND_URL}/teamMembers/${User.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result);
        setManager2(result.data.team);
      })
      .catch((err) => {
        console.log(err);
      });

    // GETTING LEAD DETAILS
    axios
      .get(`${BACKEND_URL}/leads/${LeadData.leadId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("the lead details is given by");
        console.log(result);
        // setlead(result?.data?.data);
        setPropertyType(result?.data?.data?.leadType);
        setEnquiryType(result?.data?.data?.enquiryType);
        setLeadProject(result?.data?.data?.project);
        setBookedAmount(result?.data?.data?.booked_amount);
        setSellingAmount(result?.data?.data?.amount);
        setForType(result?.data?.data?.leadFor);
        setLeadName(result?.data?.data?.leadName);
        setLeadContact(result?.data?.data?.leadContact?.replaceAll(" ", ""));
        setLeadEmail(result?.data?.data?.leadEmail);
        setLanguagePrefered(result?.data?.data?.language);
        setLeadStatus(result?.data?.data?.leadStatus);
        setLeadSource(result?.data?.data?.leadSource);
        setFeedback(result?.data?.data?.feedback);
        setLeadNotes(result?.data?.data?.notes);
        setManager(result?.data?.data?.assignedToManager);
        setSalesPerson2(result?.data?.data?.assignedToSales);
        setBookedDate(result?.data?.data?.booked_date);
        setDeveloperName(result?.data?.data?.developer);
        setCurrency(result?.data?.data?.currency);
        setUnit(result?.data?.data?.unit);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Fetching the Lead", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleLeadModelClose();
      });

    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // console.log("manager hook is calling");
    // console.log(Manager2);
    // console.log(Manager);
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === parseInt(Manager);
    });
    // console.log(SalesPersons);
    setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
    // eslint-disable-next-line
  }, [Manager]);

  const UpdateLeadFunc = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const creationDate = new Date();
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("id", User.id);
    UpdateLeadData.append("id", LeadData.leadId);
    // UpdateLeadData.append("leadName", LeadName);
    // UpdateLeadData.append("leadContact", LeadContact?.replaceAll(" ", ""));
    // UpdateLeadData.append("leadEmail", LeadEmail);
    UpdateLeadData.append("enquiryType", EnquiryType);
    UpdateLeadData.append("leadType", PropertyType);
    UpdateLeadData.append("project", LeadProject);
    UpdateLeadData.append("developer", developerName);
    UpdateLeadData.append("booked_amount", booked_amount);
    UpdateLeadData.append("amount", sellingAmount);
    UpdateLeadData.append("currency", currency);
    UpdateLeadData.append("unit", unit);
    UpdateLeadData.append("leadFor", ForType);
    UpdateLeadData.append("booked_date", booked_date);
    // UpdateLeadData.append("language", LanguagePrefered);
    // UpdateLeadData.append("feedback", Feedback);
    // UpdateLeadData.append("leadStatus", LeadStatus);
    // UpdateLeadData.append("leadSource", LeadSource);
    // UpdateLeadData.append("notes", LeadNotes);
    // UpdateLeadData.append("assignedToManager", Manager);

    await axios
      .post(`${BACKEND_URL}/leads/${LeadData.leadId}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("lead updated successfull");
        console.log(result);
        handleLeadModelClose();
        toast.success("Lead Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,

          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        FetchLeads(token);
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
  return (
    <>
      {/* MODAL FOR BOOKED LEAD SHOW */}
      <Modal
        keepMounted
        open={LeadModelOpen}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        {/* <div
          style={style}
          className={`  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-4 rounded-md`}
        > */}
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
              } ${currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-r-2 border-primary"
                : "border-l-2 border-primary")
              }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {loading ? (
              <div className="">
                <CircularProgress size={20} />
                <span
                  className={`font-semibold text-lg ${currentMode === "dark" ? "text-white" : "text-dark"
                    }`}
                >
                  {" "}
                  Fetching your data
                </span>
              </div>
            ) : (
              <>
                <HeadingTitle title={t("update_booked_deal")} />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateLeadFunc();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* PROJECT DETAILS */}
                    <Box
                      sx={darkModeColors}
                      className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"} p-5`}
                    >
                      <h5 className="uppercase text-center font-semibold text-primary mb-6">
                        {t("project_details")}
                      </h5>
                      {/* DEVELOPER */}
                      <TextField
                        id="Developer"
                        type={"text"}
                        label={t("form_developer_name")}
                        className="w-full"
                        variant="outlined"
                        size="small"
                        value={developerName}
                        style={{
                          marginBottom: "20px",
                        }}
                        onChange={(e) => setDeveloperName(e.target.value)}
                      />
                      {/* PROJECT NAME */}
                      <TextField
                        id="Project"
                        type={"text"}
                        label={t("label_project_name")}
                        className="w-full"
                        variant="outlined"
                        size="small"
                        value={LeadProject}
                        style={{
                          marginBottom: "20px",
                        }}
                        onChange={(e) => setLeadProject(e.target.value)}
                      />
                      {/* ENQUIRY TYPE  */}
                      <Select
                        id="enquiry"
                        value={
                          EnquiryType && EnquiryType !== "null"
                            ? {
                              value: enquiry_options(t).find(
                                (option) => option?.value === EnquiryType
                              ),
                              label: enquiry_options(t).find(
                                (option) => option.value === EnquiryType
                              )?.label,
                            }
                            : null
                        }
                        onChange={ChangeEnquiryType}
                        options={enquiry_options(t)}
                        placeholder={t("label_enquiry")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      {/* PROPERTY TYPE  */}
                      <Select
                        id="property-type"
                        value={
                          PropertyType && PropertyType !== "null"
                            ? {
                              value: property_options(t).find(
                                (option) => option.value === PropertyType
                              ),
                              label: property_options(t).find(
                                (option) => option.value === PropertyType
                              )?.label,
                            }
                            : null
                        }
                        onChange={ChangePropertyType}
                        options={property_options(t)}
                        placeholder={t("label_property")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                      {/* PURPOSE  */}
                      <Select
                        id="for"
                        value={
                          ForType && ForType !== "null"
                            ? {
                              value: purpose_options(t).find(
                                (option) => option.value === ForType
                              ),
                              label: purpose_options(t).find(
                                (option) => option.value === ForType
                              )?.label,
                            }
                            : null
                        }
                        onChange={ChangeForType}
                        options={purpose_options(t)}
                        placeholder={t("label_purpose_of_enquiry")}
                        className="w-full"
                        menuPortalTarget={document.body}
                        styles={selectStyles(currentMode, primaryColor)}
                      />
                    </Box>
                    {/* BOOKING DETAILS */}
                    <Box
                      sx={darkModeColors}
                      className={`${currentMode === "dark" ? "bg-dark-neu" : "bg-light-neu"} p-5`}
                    >
                      <h5 className="uppercase text-center font-semibold text-primary mb-6">
                        {t("booking_details")}
                      </h5>
                      {/* SELLING AMOUNT */}
                      <div className="grid grid-cols-3">
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) =>
                              curr.value === currency
                          )}
                          onChange={(e) => {
                            setCurrency(e.value);
                          }}
                          placeholder={t("label_select_currency")}
                          // className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        <TextField
                          id="SellingAmount"
                          type={"number"}
                          label={t("selling_amount")}
                          className="w-full col-span-2"
                          variant="outlined"
                          size="small"
                          value={sellingAmount}
                          style={{
                            marginBottom: "20px",
                          }}
                          onChange={(e) => setSellingAmount(e.target.value)}
                        />
                      </div>
                      {/* UNIT */}
                      <TextField
                        id="Unit"
                        type={"text"}
                        label={t("label_unit")}
                        className="w-full"
                        variant="outlined"
                        size="small"
                        value={unit}
                        style={{
                          marginBottom: "20px",
                        }}
                        onChange={(e) => setUnit(e.target.value)}
                      />
                      {/* BOOKING AMOUNT */}
                      <div className="grid grid-cols-3">
                        <Select
                          id="currency"
                          options={currencies(t)}
                          value={currencies(t)?.find(
                            (curr) =>
                              curr.value === currency
                          )}
                          onChange={(e) => {
                            setCurrency(e.value);
                          }}
                          placeholder={t("label_select_currency")}
                          // className={`mb-5`}
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                      <TextField
                        id="BookedAmount"
                        type={"number"}
                        label={t("booking_amount")}
                        className="w-full col-span-2"
                        variant="outlined"
                        size="small"
                        value={booked_amount}
                        style={{
                          marginBottom: "20px",
                        }}
                        onChange={(e) => setBookedAmount(e.target.value)}
                      />
                      </div>
                      {/* BOOKING DATE */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={booked_date}
                          label={t("booking_date")}
                          views={["day", "month", "year"]}
                          onChange={(newValue) => {
                            const formattedDate = moment(newValue?.$d).format(
                              "YYYY-MM-DD"
                            );

                            setBookedDate(formattedDate);
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
                        />
                      </LocalizationProvider>
                    </Box>
                  </div>

                  <button
                    // ripple={true}
                    // size="lg"
                    // type="submit"
                    disabled={btnloading ? true : false}
                    className={`${currentMode === "dark" ? "bg-primary-dark-neu" : "bg-primary-light-neu"} w-full my-5 p-3 text-white font-semibold uppercase`}
                  >
                    {btnloading ? (
                      <div className="flex items-center justify-center space-x-1">
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      </div>
                    ) : (
                      <span>{t("update_booked_deal")}</span>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateBookedDeal;
