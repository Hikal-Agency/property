import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Select from "react-select";
import axios from "../../axoisConfig";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import "react-phone-number-input/style.css";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import { selectStyles } from "../_elements/SelectStyles";
import {
  enquiry_options,
  language_options,
  property_options,
  purpose_options,
} from "../_elements/SelectOptions";
import { MdClose } from "react-icons/md";

const UpdateLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  lead_origin,
  LeadData,
  FetchLeads,
}) => {
  console.log("Single Lead: ", LeadData);
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    setSalesPerson: setAllSalesPersons,
    SalesPerson: AllSalesPersons,
    t,
    isArabic,
    Managers,
    isLangRTL,
    i18n,
    primaryColor,
    // SalesPerson,
  } = useStateContext();
  const [value, setValue] = useState();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const [noAgents, setNoAgents] = useState(false);
  const [error, setError] = useState(false);
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  const [isClosing, setIsClosing] = useState(false);

  const [PropertyType, setPropertyType] = useState("");
  const [EnquiryType, setEnquiryType] = useState("");
  const [ForType, setForType] = useState("");
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  const [LeadStatus, setLeadStatus] = useState("");
  // eslint-disable-next-line
  const [Feedback, setFeedback] = useState("");
  const [Manager, setManager] = useState("");
  const [Manager2, setManager2] = useState([]);
  const [SalesPerson, setSalesPerson] = useState([]);
  const [SalesPerson2, setSalesPerson2] = useState("");
  const [LeadName, setLeadName] = useState("");
  const [LeadContact, setLeadContact] = useState("");
  const [LeadEmail, setLeadEmail] = useState("");
  const [LeadProject, setLeadProject] = useState("");
  const [LeadNotes, setLeadNotes] = useState("");

  const [emailError, setEmailError] = useState(false);

  const handlePhone = () => {
    setError(false);
    let inputValue = value;
    // if (inputValue && !inputValue.startsWith("+")) {
    //   inputValue = "+" + inputValue;

    //   console.log("replaced : ", inputValue);
    // }
    console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setLeadContact(formatPhoneNumberIntl(inputValue));
        console.log("Valid: ", LeadContact);
        setError(false);
      } else {
        setError("Not a valid number.");
      }
    } else {
      setError("Not a valid number.");
    }
  };

  const ChangePropertyType = (event) => {
    setPropertyType(event.value);
  };
  const ChangeEnquiryType = (event) => {
    setEnquiryType(event.value);
  };
  const ChangeForType = (event) => {
    setForType(event.value);
  };
  const ChangeLanguagePrefered = (event) => {
    setLanguagePrefered(event.value);
  };
  // eslint-disable-next-line
  const ChangeLeadStatus = (event) => {
    setLeadStatus(event.target.value);
  };
  // eslint-disable-next-line
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
  };

  const handleEmail = (e) => {
    setEmailError(false);
    const value = e.target.value;
    console.log(value);
    const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (emailRegex.test(value)) {
      setEmailError(false);
    } else {
      setEmailError("Kindly enter a valid email.");
    }
    setLeadEmail(value);
    console.log("Email state: ", LeadEmail);
  };

  async function setPersons(urls) {
    const token = localStorage.getItem("auth-token");
    const requests = urls.map((url) =>
      axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
    );
    const responses = await Promise.all(requests);
    const data = {};
    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (response.data?.team[0]?.isParent) {
        const name = `manager-${response.data.team[0].isParent}`;
        data[name] = response.data.team;
      }
    }
    setAllSalesPersons(data);
  }

  // useEffect(() => {
  //   const token = localStorage.getItem("auth-token");
  //   axios
  //     .get(`${BACKEND_URL}/managers`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       const managers = result?.data?.managers?.data;
  //       setManager2(managers || []);

  //       const urls = managers?.map((manager) => {
  //         return `${BACKEND_URL}/teamMembers/${manager?.id}`;
  //       });

  //       setPersons(urls || []);
  //       setloading(false);
  //     })
  //     .catch((err) => {
  //       setloading(false);
  //       console.log(err);
  //     });
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

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
        setForType(result?.data?.data?.leadFor);
        setLeadName(result?.data?.data?.leadName);

        let leadContact = result?.data?.data?.leadContact?.replaceAll(" ", "");

        // if (leadContact) {
        //   leadContact = leadContact.replace(/^00/, "+");
        // }

        if (leadContact && !leadContact.startsWith("+")) {
          leadContact = "+" + leadContact;
        }

        setLeadContact(leadContact);
        // setLeadContact(result?.data?.data?.leadContact);
        setLeadEmail(result?.data?.data?.leadEmail);
        setLanguagePrefered(result?.data?.data?.language);
        setLeadStatus(result?.data?.data?.leadStatus);
        setFeedback(result?.data?.data?.feedback);
        setLeadNotes(result?.data?.data?.notes);
        setManager(result?.data?.data?.assignedToManager);
        setSalesPerson2(result?.data?.data?.assignedToSales);
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleLeadModelClose();
    }, 1000);
  };

  useEffect(() => {
    const agents = AllSalesPersons[`manager-${Manager}`];
    if (agents === undefined) {
      setNoAgents(true);
    } else {
      setNoAgents(false);
      setSalesPerson(agents);
    }
    // eslint-disable-next-line
  }, [Manager]);

  const UpdateLeadFunc = async () => {
    setbtnloading(true);

    if (!LeadContact) {
      setloading(false);
      toast.error("Contact number is required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);

      return;
    }

    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("id", User.id);
    UpdateLeadData.append("id", LeadData.leadId);
    // UpdateLeadData.append("lid", LeadData.leadId);
    UpdateLeadData.append("leadName", LeadName);
    UpdateLeadData.append("leadContact", LeadContact?.replaceAll(" ", ""));
    UpdateLeadData.append("leadEmail", LeadEmail);
    UpdateLeadData.append("enquiryType", EnquiryType);
    UpdateLeadData.append("leadType", PropertyType);
    UpdateLeadData.append("project", LeadProject);
    UpdateLeadData.append("leadFor", ForType);
    UpdateLeadData.append("language", LanguagePrefered);
    UpdateLeadData.append("leadStatus", LeadStatus);
    UpdateLeadData.append("notes", LeadNotes);
    if (User.role === 1 || User.role === 3) {
      console.log("manager and salesperson ", Manager, SalesPerson2);
    }

    // UpdateLeadData.append("last", LeadNotes);

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
  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
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
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-r-2 border-primary"
                : "border-l-2 border-primary")
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {loading ? (
              <div className="w-full flex items-center justify-center space-x-1">
                <CircularProgress size={20} />
                <span className="font-semibold text-lg">
                  {" "}
                  {t("fetching_your_lead")}
                </span>
              </div>
            ) : (
              <>
                <div className="w-full flex items-center pb-3 mb-3">
                  <div className="bg-primary h-10 w-1 rounded-full my-1"></div>
                  <h1
                    className={`text-lg font-semibold mx-2 ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {t("update_lead_details")}
                  </h1>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateLeadFunc();
                  }}
                >
                  <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 p-4">
                    <div>
                      <Box sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl": {
                          left: isLangRTL(i18n.language) ? "inherit" : "inherit",
                          right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                          transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
                        },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language) ? "right" : "left",
                        }
                      }}>
                        <h4
                          className={`${
                            currentMode === "dark"
                              ? "text-primary"
                              : "text-primary"
                          } text-center font-semibold pb-5`}
                        >
                          {t("agent_details")}
                        </h4>

                        {/* MANAGER  */}
                        <TextField
                          id="Manager"
                          type="text"
                          label={t("label_manager")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                            pointerEvents: "none",
                          }}
                          variant="outlined"
                          size="small"
                          value={
                            Managers?.find((person) => person?.id === Manager)
                              ?.userName || t("no_manager")
                          }
                          onChange={(e) => {
                            e.preventDefault();
                          }}
                          readOnly={true}
                        />

                        {/* AGENT  */}
                        {noAgents
                          ? ""
                          : (User.role === 1 || User.role === 3) && (
                              <>
                                <TextField
                                  id="Salesperson"
                                  type="text"
                                  label={t("label_agent")}
                                  className="w-full"
                                  style={{
                                    marginBottom: "20px",
                                    pointerEvents: "none",
                                  }}
                                  variant="outlined"
                                  size="small"
                                  value={
                                    SalesPerson?.find(
                                      (person) => person?.id === SalesPerson2
                                    )?.userName || t("no_agent_assigned")
                                  }
                                  onChange={(e) => {
                                    e.preventDefault();
                                  }}
                                  readOnly={true}
                                />
                              </>
                            )}

                        {User.role === 7 && (
                          <TextField
                            id="Salesperson"
                            label={t("label_agent")}
                            type="text"
                            className="w-full mb-5"
                            style={{
                              marginBottom: "20px",
                              pointerEvents: "none",
                            }}
                            variant="outlined"
                            size="small"
                            value={User?.userName}
                            readOnly={true}
                          />
                        )}
                      </Box>
                    </div>

                    <div>
                      <Box sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl": {
                          left: isLangRTL(i18n.language) ? "inherit" : "inherit",
                          right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                          transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
                        },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language) ? "right" : "left",
                        }
                        }}>
                        <h4
                          className={`${
                            currentMode === "dark"
                              ? "text-primary"
                              : "text-primary"
                          } text-center font-semibold pb-5`}
                        >
                          {t("project_details")}
                        </h4>
                        {/* PROJECT NAME  */}
                        <TextField
                          id="Project"
                          type={"text"}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          label={t("label_project_name")}
                          variant="outlined"
                          size="small"
                          value={LeadProject}
                          onChange={(e) => setLeadProject(e.target.value)}
                        />
                        {/* ENQUIRY  */}
                        <Select
                          id="enquiry"
                          value={enquiry_options(t).find(
                            (option) => option.value === EnquiryType
                          )}
                          onChange={ChangeEnquiryType}
                          options={enquiry_options(t)}
                          placeholder={t("label_enquiry_about")}
                          className="w-full"
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />

                        {/* <TextField
                          id="enquiry"
                          value={EnquiryType}
                          label={t("label_enquiry_for")}
                          onChange={ChangeEnquiryType}
                          size="small"
                          className="w-full"
                          sx={{
                            marginBottom: "1.25rem !important",
                          }}
                          displayEmpty
                          select
                        >
                          <MenuItem value="">
                            {t("label_enquiry_about")}
                          </MenuItem>
                          <MenuItem value={"Studio"}>
                            {t("enquiry_studio")}
                          </MenuItem>
                          <MenuItem value={"1 Bedroom"}>
                            {t("enquiry_1bed")}
                          </MenuItem>
                          <MenuItem value={"2 Bedrooms"}>
                            {t("enquiry_2bed")}
                          </MenuItem>
                          <MenuItem value={"3 Bedrooms"}>
                            {t("enquiry_3bed")}
                          </MenuItem>
                          <MenuItem value={"4 Bedrooms"}>
                            {t("enquiry_4bed")}
                          </MenuItem>
                          <MenuItem value={"5 Bedrooms"}>
                            {t("enquiry_5bed")}
                          </MenuItem>
                          <MenuItem value={"6 Bedrooms"}>
                            {t("enquiry_6bed")}
                          </MenuItem>
                          <MenuItem value={"Retail"}>
                            {t("enquiry_retail")}
                          </MenuItem>
                          <MenuItem value={"Other"}>
                            {t("enquiry_others")}
                          </MenuItem>
                        </TextField> */}

                        {/* PROPERTY TYPE  */}
                        <Select
                          id="property-type"
                          value={property_options(t).find(
                            (option) => option.value === PropertyType
                          )}
                          onChange={ChangePropertyType}
                          options={property_options(t)}
                          placeholder={t("label_property_type")}
                          className="w-full"
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* <TextField
                          id="property-type"
                          value={PropertyType}
                          label={t("label_property_type")}
                          sx={{
                            marginBottom: "1.25rem !important",
                          }}
                          onChange={ChangePropertyType}
                          size="small"
                          className="w-full"
                          displayEmpty
                          select
                        >
                          <MenuItem value="">
                            {t("label_property_type")}
                          </MenuItem>
                          <MenuItem value={"Apartment"}>
                            {t("property_apartment")}
                          </MenuItem>
                          <MenuItem value={"Villa"}>
                            {t("property_villa")}
                          </MenuItem>
                          <MenuItem value={"penthouse"}>
                            {t("property_penthouse")}
                          </MenuItem>
                          <MenuItem value={"mansion"}>
                            {t("property_mansion")}
                          </MenuItem>
                          <MenuItem value={"Commercial"}>
                            {t("property_commercial")}
                          </MenuItem>
                          <MenuItem value={"Townhouse"}>
                            {t("property_townhouse")}
                          </MenuItem>
                        </TextField> */}

                        {/* PURPOSE  */}
                        <Select
                          id="for"
                          value={purpose_options(t).find(
                            (option) => option.value === ForType
                          )}
                          onChange={ChangeForType}
                          options={purpose_options(t)}
                          placeholder={t("label_purpose_of_enquiry")}
                          className="w-full"
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* <TextField
                          id="for"
                          sx={{
                            marginBottom: "1.25rem !important",
                          }}
                          value={ForType}
                          label={t("label_purpose_of_enquiry")}
                          onChange={ChangeForType}
                          size="small"
                          className="w-full"
                          displayEmpty
                          select
                        >
                          <MenuItem value="" selected>
                            For
                          </MenuItem>
                          <MenuItem value={"Investment"}>
                            {t("purpose_investment")}
                          </MenuItem>
                          <MenuItem value={"End-user"}>
                            {t("purpose_end_user")}
                          </MenuItem>
                        </TextField> */}
                      </Box>
                    </div>

                    <div>
                      <Box sx={{
                        ...darkModeColors,
                        "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl": {
                          left: isLangRTL(i18n.language) ? "inherit" : "inherit",
                          right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                          transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
                        },
                        "& legend": {
                          textAlign: isLangRTL(i18n.language) ? "right" : "left",
                        }
                      }}>
                        <h4
                          className={`${
                            currentMode === "dark"
                              ? "text-primary"
                              : "text-primary"
                          } text-center font-semibold pb-5`}
                        >
                          {t("lead_details")}
                        </h4>
                        {/* LEAD NAME  */}
                        <TextField
                          id="LeadName"
                          type={"text"}
                          label={t("label_lead_name")}
                          className="w-full"
                          style={{ marginBottom: "20px" }}
                          variant="outlined"
                          size="small"
                          required
                          value={LeadName}
                          onChange={(e) => setLeadName(e.target.value)}
                        />

                        {/* CONTACT  */}
                        <PhoneInput
                          placeholder={t("label_contact_number")}
                          value={LeadContact}
                          onChange={(value) => setValue(value)}
                          onKeyUp={handlePhone}
                          required
                          labels={t("label_phone_number")}
                          error={error}
                          className={`
                          ${classNames({
                            "dark-mode": currentMode === "dark",
                          })}
                           mb-5`}
                          size="small"
                          style={{
                            marginBottom: "20px",
                            // background: `${
                            //   currentMode === "dark" ? "#1C1C1C" : "#fff"
                            // }`,
                            "& .PhoneInputCountryIconImg": {
                              color: "#fff",
                            },
                            "& .PhoneInputInput": {
                              background: "none !important",
                            },
                            // padding: "10px",
                            // color: "#808080",
                            border: `1px solid ${
                              currentMode === "dark" ? "#fff" : "#ccc"
                            }`,
                            borderRadius: "5px",
                            outline: "none",
                          }}
                          inputStyle={{
                            outline: "none",
                          }}
                        />
                        {error && (
                          <Typography variant="body2" color="error">
                            {error}
                          </Typography>
                        )}

                        {/* EMAIL  */}
                        <TextField
                          id="LeadEmailAddress"
                          type={"email"}
                          className="w-full"
                          label={t("label_email_address")}
                          style={{ marginBottom: "20px" }}
                          variant="outlined"
                          size="small"
                          value={LeadEmail === "undefined" ? "" : LeadEmail}
                          // onChange={(e) => setLeadEmail(e.target.value)}
                          error={emailError && emailError}
                          helperText={emailError && emailError}
                          onChange={handleEmail}
                        />

                        {/* LANGUAGE  */}
                        <Select
                          id="LanguagePrefered"
                          value={language_options.find(
                            (option) => option.value === LanguagePrefered
                          )}
                          onChange={ChangeLanguagePrefered}
                          options={language_options}
                          placeholder={t("label_language")}
                          className="w-full"
                          menuPortalTarget={document.body}
                          styles={selectStyles(currentMode, primaryColor)}
                        />
                        {/* <TextField
                          sx={{
                            marginBottom: "1.25rem !important",
                          }}
                          id="LanguagePrefered"
                          value={LanguagePrefered}
                          onChange={ChangeLanguagePrefered}
                          label={t("label_language")}
                          size="small"
                          className="w-full"
                          select
                          displayEmpty
                        >
                          <MenuItem value="" selected>
                            {t("label_language")}
                          </MenuItem>
                          <MenuItem value={"Arabic"}>Arabic</MenuItem>
                          <MenuItem value={"English"}>English</MenuItem>
                          <MenuItem value={"Farsi"}>Farsi</MenuItem>
                          <MenuItem value={"French"}>French</MenuItem>
                          <MenuItem value={"Hindi"}>Hindi</MenuItem>
                          <MenuItem value={"Russian"}>Russian</MenuItem>
                          <MenuItem value={"Spanish"}>Spanish</MenuItem>
                          <MenuItem value={"Urdu"}>Urdu</MenuItem>
                        </TextField> */}
                      </Box>
                    </div>
                  </div>
                  <Button
                    className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-btn-primary hover:shadow-none `}
                    ripple={true}
                    size="lg"
                    type="submit"
                    disabled={btnloading ? true : false}
                  >
                    {btnloading ? (
                      <div className="flex items-center justify-center space-x-1 mt-5">
                        <CircularProgress size={18} sx={{ color: "white" }} />
                      </div>
                    ) : (
                      <span> {t("btn_update_lead")}</span>
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UpdateLead;
