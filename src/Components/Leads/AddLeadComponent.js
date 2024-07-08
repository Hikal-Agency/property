import {
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useStateContext } from "../../context/ContextProvider";
import { socket } from "../../Pages/App";
import { Button } from "@material-tailwind/react";

import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { BsMic, BsMicFill } from "react-icons/bs";

import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import Loader from "../Loader";
import { selectStyles } from "../_elements/SelectStyles";
import {
  source_options,
  language_options,
  property_options,
  enquiry_options,
  purpose_options,
  lead_options,
} from "../_elements/SelectOptions";
import HeadingTitle from "../_elements/HeadingTitle";

const AddLeadComponent = ({
  handleCloseAddLeadModal,
  FetchLeads,
  noSourceDropdown,
}) => {
  const [loading, setloading] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const [Manager2, setManager2] = useState([]);
  const [PropertyType, setPropertyType] = useState("");
  const [EnquiryType, setEnquiryType] = useState("");
  const [ForType, setForType] = useState("");
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  const [LeadStatus, setLeadStatus] = useState("");
  const [LeadSource, setLeadSource] = useState(
    noSourceDropdown ? "Secondary" : ""
  );
  const [LeadCategory, setLeadCategory] = useState("0");
  const [Manager, setManager] = useState("");
  const [SalesPerson2, setSalesPerson2] = useState("");
  const [LeadName, setLeadName] = useState("");
  const [LeadContact, setLeadContact] = useState("");
  const [LeadEmail, setLeadEmail] = useState();
  const [emailError, setEmailError] = useState(false);
  const [LeadProject, setLeadProject] = useState("");
  const [LeadNotes, setLeadNotes] = useState("");
  const [value, setValue] = useState();
  const [error, setError] = useState(false);
  const { hasPermission } = usePermission();
  const {
    currentMode,
    darkModeColors,
    User,
    BACKEND_URL,
    fetchSidebarData,
    SalesPerson,
    Managers,
    primaryColor,
    t,
    themeBgImg,
    isLangRTL,
    i18n,
  } = useStateContext();

  const [isVoiceSearchState, setIsVoiceSearchState] = useState(false);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition("en");

  useEffect(() => {
    if (isVoiceSearchState && transcript.length > 0) {
      // setSearchTerm(transcript);
      setLeadNotes(transcript);
    }
    console.log(transcript, "transcript");
  }, [transcript, isVoiceSearchState]);

  useEffect(() => {
    if (isVoiceSearchState) {
      resetTranscript();
      clearSearchInput();
      startListening();
    } else {
      SpeechRecognition.stopListening();
      console.log(transcript, "transcript...");
      resetTranscript();
    }
  }, [isVoiceSearchState]);

  const clearSearchInput = () => {
    setLeadNotes("");
    resetTranscript();
  };
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition.");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const ChangeLeadSource = (selectedOption) => {
    setLeadSource(selectedOption.value);
  };

  const ChangeLeadCategory = (selectedOption) => {
    setLeadCategory(selectedOption.value);
  };

  const ChangeLanguagePrefered = (selectedOption) => {
    setLanguagePrefered(selectedOption.value);
  };

  const ChangeForType = (selectedOption) => {
    setForType(selectedOption.value);
  };

  const ChangePropertyType = (selectedOption) => {
    setPropertyType(selectedOption.value);
  };

  const ChangeEnquiryType = (selectedOption) => {
    setEnquiryType(selectedOption.value);
  };

  const ChangeManager = (event) => {
    setManager(event.value);
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === event.value;
    });
    // setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  };

  const ChangeSalesPerson = (event) => {
    // console.log("clicked");
    setSalesPerson2(event.value);
  };

  // ------------------------
  // console.log("Salesperson: ", SalesPerson);
  // console.log("MAnagers: ", Managers);

  console.log("lead category:::: ", LeadCategory);

  const handleEmail = (e) => {
    setEmailError(false);
    const value = e.target.value;
    console.log(value);
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (emailRegex.test(value)) {
      setEmailError(false);
    } else {
      setEmailError("Kindly enter a valid email.");
      // setLeadEmail("");
      return;
    }
    setLeadEmail(value);
    console.log("Email state: ", LeadEmail);
  };

  const handleContact = () => {
    setError(false);
    const inputValue = value;
    console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setLeadContact(formatPhoneNumberIntl(inputValue));
        console.log("Valid lead contact: ", LeadContact);
        console.log("Valid input: ", inputValue);
        setError(false);
      } else {
        setError("Not a valid number.");
      }
    } else {
      setError("Not a valid number.");
    }
  };

  // const ChangeManager = (event) => {
  //   setManager(event.target.value);
  //   const SalesPersons = Manager2.filter(function (el) {
  //     return el.uid === event.target.value;
  //   });
  //   // setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  // };
  // const ChangeSalesPerson = (event) => {
  //   console.log("clicked");
  //   setSalesPerson2(event.target.value);
  // };

  const AddLead = async () => {
    console.log("lead category in add lead :::: ", LeadCategory);
    setloading(true);
    if (LeadEmail && emailError !== false) {
      setloading(false);
      toast.error("Kindly enter a valid email.", {
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
      setloading(false);

      return;
    }
    const token = localStorage.getItem("auth-token");
    const LeadData = new FormData();
    console.log("leadSource: ", LeadSource);
    let coldCall = "0";
    if (LeadSource.toLowerCase() === "property finder") {
      coldCall = 3;
    } else if (LeadSource.toLowerCase() === "personal") {
      coldCall = 2;
    }
    // else if (LeadSource.toLowerCase() === "secondary") {
    //   coldCall = 5;
    // }
    else {
      coldCall = LeadCategory;
    }

    if (LeadName) LeadData.append("leadName", LeadName);
    if (LeadContact)
      LeadData.append("leadContact", LeadContact?.replaceAll(" ", ""));
    if (LeadEmail) LeadData.append("leadEmail", LeadEmail);
    if (EnquiryType) LeadData.append("enquiryType", EnquiryType);
    if (PropertyType) LeadData.append("leadType", PropertyType);
    if (LeadProject) LeadData.append("project", LeadProject);
    if (ForType) LeadData.append("leadFor", ForType);
    if (LanguagePrefered) LeadData.append("language", LanguagePrefered);
    if (LeadStatus) LeadData.append("leadStatus", LeadStatus);
    if (LeadSource) LeadData.append("leadSource", LeadSource);

    // if ((coldCall = 1)) {
    //   LeadData.append("is_whatsapp", 1);
    // }
    if (coldCall == 1) {
      LeadData.append("is_whatsapp", 1);
    }

    if (!LeadSource && noSourceDropdown) {
      LeadData.append("leadSource", "Secondary");
    }
    LeadData.append("feedback", "New"); //Always appended
    LeadData.append("agency_id", User?.agency); //Always appended

    if (coldCall) LeadData.append("coldCall", coldCall);
    console.log("coldcall in appending", coldCall);
    if (LeadNotes) LeadData.append("notes", LeadNotes);

    console.log("coldcalllll::::::::: ", coldCall);

    if (User?.role === 1) {
      if (Manager) {
        LeadData.append("assignedToManager", Number(Manager));
      }
      if (SalesPerson2) {
        LeadData.append("assignedToSales", Number(SalesPerson2));
      }
    } else if (User?.role === 3) {
      LeadData.append("assignedToManager", Number(User?.id));
      if (SalesPerson2) {
        LeadData.append("assignedToSales", Number(SalesPerson2));
      }
    } else if (User?.role === 7) {
      LeadData.append("assignedToManager", Number(User?.isParent));
      LeadData.append("assignedToSales", Number(User?.id));
    } else if (User?.role === 2) {
      console.log("values::", Manager, SalesPerson2);
      if (!Manager && !SalesPerson2) {
        LeadData.append("assignedToManager", User?.id);
      } else {
        if (Manager) {
          LeadData.append("assignedToManager", Number(Manager));
        }
        if (SalesPerson2) {
          LeadData.append("assignedToSales", Number(SalesPerson2));
        }
      }
    }

    for (var pair of LeadData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    await axios
      .post(`${BACKEND_URL}/leads`, LeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result);
        setloading(false);
        if (FetchLeads) {
          FetchLeads();
        }
        toast.success("Lead Added Successfully ", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        if (handleCloseAddLeadModal) {
          handleCloseAddLeadModal();
        }

        const recipients = [];
        if (SalesPerson2) {
          recipients.push(SalesPerson2);
          recipients.push(
            SalesPerson[`manager-${Manager}`]?.find(
              (s) => s?.id === SalesPerson2
            )?.isParent
          );
        } else {
          recipients.push(Manager);
        }
        socket.emit("notification_lead_add", {
          from: { id: User?.id, userName: User?.userName },
          leadName: LeadName,
          participants: recipients,
        });
        fetchSidebarData();
        setLeadName("");
        setLeadContact("");
        setLeadEmail("");
        setEnquiryType("");
        setPropertyType("");
        setLeadProject("");
        setForType("");
        setLanguagePrefered("");
        setLeadSource("");
        setLeadNotes("");
        setSalesPerson2("");
        setValue("");

        if (!User?.role === 1 && !User?.role === 3) {
          setManager("");
        }
      })
      .catch((err) => {
        console.log(err);
        setloading(false);
        toast.error("Something went wrong! Please Try Again", {
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

  console.log("manager: ", Manager);

  useEffect(() => {
    setpageloading(false);
    // eslint-disable-next-line
  }, []);

  console.log("Manager: ", Manager);

  return (
    <>
      {pageloading ? (
        <Loader />
      ) : (
        <div className="mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              AddLead();
            }}
            disabled={loading ? true : false}
          >
            <HeadingTitle title={t("title_add_new_lead_details")} />

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 gap-5 mb-5">
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
                }}
                className={`${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark shadow-sm"
                      : "blur-bg-light shadow-sm"
                    : currentMode === "dark"
                    ? "bg-dark-neu"
                    : "bg-light-neu"
                } p-5`}
              >
                <h4
                  className={`${
                    currentMode === "dark" ? `text-white` : "text-black"
                  } text-center uppercase font-semibold pb-5`}
                >
                  {t("agent_details")}
                </h4>
                {hasPermission("addlead_manager_dropdown") && (
                  <Select
                    id="Manager"
                    options={Managers.map((person) => ({
                      value: person.id,
                      label: person.userName,
                    }))}
                    value={
                      String(Manager) === "1" || !Manager || Manager === "0"
                        ? null
                        : {
                            label: Managers.find(
                              (manager) => manager.id === Manager
                            )?.userName,
                            value: Manager,
                          }
                    }
                    isDisabled={User?.role === 3}
                    onChange={ChangeManager}
                    placeholder={t("label_select_manager")}
                    className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                  // <>
                  // <TextField
                  //   id="Manager"
                  //   select
                  //   sx={{
                  //     "&": {
                  //       marginBottom: "1.25rem !important",
                  //     },
                  //   }}
                  //   value={Manager}
                  //   disabled={User?.role === 3 && true}
                  //   label={t("label_sales_manager")}
                  //   onChange={ChangeManager}
                  //   size="small"
                  //   className="w-full"
                  //   displayEmpty
                  // >
                  //   <MenuItem value="">
                  //     {t("label_select_manager")}
                  //     <span className="ml-1 text-primary">*</span>
                  //   </MenuItem>

                  //   {Managers?.map((person, index) => (
                  //     <MenuItem key={index} value={person?.id}>
                  //       {person?.userName}
                  //     </MenuItem>
                  //   ))}
                  // </TextField>
                  // </>
                )}

                {hasPermission("addlead_agent_dropdown") && (
                  <Select
                    id="SalesPerson"
                    options={
                      User.role === 1
                        ? SalesPerson[`manager-${Manager}`]?.map((agent) => ({
                            value: agent?.id,
                            label: agent?.userName,
                          }))
                        : SalesPerson[`manager-${User?.id}`]?.map((agent) => ({
                            value: agent?.id,
                            label: agent?.userName,
                          }))
                    }
                    // value={SalesPerson2}
                    value={
                      SalesPerson2
                        ? {
                            label: SalesPerson[`manager-${Manager}`]?.find(
                              (agent) => agent?.id === SalesPerson2
                            )?.userName,
                            value: SalesPerson2,
                          }
                        : null
                    }
                    onChange={ChangeSalesPerson}
                    placeholder={t("label_sales_agent")}
                    className={`mb-5`}
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                  />
                  // <>
                  //   <TextField
                  //     sx={{
                  //       "&": {
                  //         marginBottom: "1.25rem !important",
                  //       },
                  //     }}
                  //     select
                  //     id="SalesPerson"
                  //     label={t("label_sales_agent")}
                  //     value={SalesPerson2}
                  //     onChange={ChangeSalesPerson}
                  //     size="small"
                  //     className="w-full"
                  //     displayEmpty
                  //   >
                  //     <MenuItem value="">Select Agent</MenuItem>
                  //     {User.role === 1
                  //       ? SalesPerson[`manager-${Manager}`]?.map(
                  //           (agent, index) => (
                  //             <MenuItem key={index} value={agent?.id}>
                  //               {agent?.userName}
                  //             </MenuItem>
                  //           )
                  //         )
                  //       : SalesPerson[`manager-${User?.id}`]?.map(
                  //           (agent, index) => (
                  //             <MenuItem key={index} value={agent?.id}>
                  //               {agent?.userName}
                  //             </MenuItem>
                  //           )
                  //         )}
                  //   </TextField>
                  // </>
                )}

                <TextField
                  id="notes"
                  type={"text"}
                  label={t("label_note")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                      zIndex: 1,
                    },
                  }}
                  variant="outlined"
                  size="small"
                  value={LeadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <div
                          // ref={searchContainer}
                          className={`${
                            isVoiceSearchState ? "listening bg-primary" : ""
                          } ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          } rounded-full cursor-pointer hover:bg-gray-500 p-1`}
                          onClick={() => {
                            setIsVoiceSearchState(!isVoiceSearchState);
                            console.log("mic is clicked...");
                          }}
                        >
                          {isVoiceSearchState ? (
                            <BsMicFill id="search_mic" size={16} />
                          ) : (
                            <BsMic id="search_mic" size={16} />
                          )}
                        </div>
                      </InputAdornment>
                    ),
                  }}
                />

                {User?.role === 7 && (
                  <>
                    <TextField
                      id="Manager"
                      type="text"
                      label={t("label_manager")}
                      className="w-full"
                      sx={{
                        marginBottom: "1.25rem !important",
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                        pointerEvents: "none",
                      }}
                      variant="outlined"
                      size="small"
                      value={
                        Managers?.find(
                          (person) => person?.id === User?.isParent
                        )?.userName || "No manager"
                      }
                      onChange={(e) => {
                        e.preventDefault();
                      }}
                      readOnly={true}
                    />
                    <TextField
                      id="Salesperson"
                      label={t("label_agent")}
                      type="text"
                      className="w-full"
                      style={{
                        marginBottom: "1.25rem !important",
                        color: "#ffffff",
                        pointerEvents: "none",
                      }}
                      variant="outlined"
                      size="small"
                      value={User?.userName}
                      readOnly={true}
                    />
                  </>
                )}
              </Box>

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
                }}
                className={`${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark shadow-sm"
                      : "blur-bg-light shadow-sm"
                    : currentMode === "dark"
                    ? "bg-dark-neu"
                    : "bg-light-neu"
                } p-5`}
              >
                <h4
                  className={`${
                    currentMode === "dark" ? `text-white` : "text-black"
                  } text-center uppercase font-semibold pb-5`}
                >
                  {t("project_details")}
                </h4>
                <TextField
                  id="Project"
                  type={"text"}
                  label={t("project")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  value={LeadProject}
                  onChange={(e) => setLeadProject(e.target.value)}
                />

                {/* ENQUIRY TYPE  */}
                <Select
                  id="enquiry"
                  options={enquiry_options(t)}
                  value={enquiry_options(t).find(
                    (option) => option.value === EnquiryType
                  )}
                  onChange={ChangeEnquiryType}
                  placeholder={t("label_enquiry_for")}
                  className={`mb-5`}
                  styles={selectStyles(currentMode, primaryColor)}
                />
                {/* <TextField
                      id="enquiry"
                      label={t("label_enquiry_for")}
                      value={EnquiryType}
                      onChange={ChangeEnquiryType}
                      size="small"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                      {t("label_enquiry_about")}
                        <span className="ml-1 text-primary">*</span>
                      </MenuItem>
                      <MenuItem value={"Studio"}>{t("enquiry_studio")}</MenuItem>
                      <MenuItem value={"1 Bedroom"}>{t("enquiry_1bed")}</MenuItem>
                      <MenuItem value={"2 Bedrooms"}>{t("enquiry_2bed")}</MenuItem>
                      <MenuItem value={"3 Bedrooms"}>{t("enquiry_3bed")}</MenuItem>
                      <MenuItem value={"4 Bedrooms"}>{t("enquiry_4bed")}</MenuItem>
                      <MenuItem value={"5 Bedrooms"}>{t("enquiry_5bed")}</MenuItem>
                      <MenuItem value={"6 Bedrooms"}>{t("enquiry_6bed")}</MenuItem>
                      <MenuItem value={"Retail"}>{t("enquiry_retail")}</MenuItem>
                      <MenuItem value={"Other"}>{t("enquiry_others")}</MenuItem>
                    </TextField> */}

                {/* PROPERTY TYPE  */}
                <Select
                  id="property-type"
                  options={property_options(t)}
                  value={property_options(t).find(
                    (option) => option.value === PropertyType
                  )}
                  onChange={ChangePropertyType}
                  placeholder={t("label_property_type")}
                  className={`mb-5`}
                  styles={selectStyles(currentMode, primaryColor)}
                />
                {/* <TextField
                      id="property-type"
                      value={PropertyType}
                      label={t("label_property_type")}
                      onChange={ChangePropertyType}
                      size="small"
                      className="w-full mb-5"
                      displayEmpty
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      select
                    >
                      <MenuItem value="" disabled>
                        {t("label_property_type")}
                        <span className="ml-1 text-primary">*</span>
                      </MenuItem>
                      <MenuItem value={"Apartment"}>{t("property_apartment")}</MenuItem>
                      <MenuItem value={"Villa"}>{t("property_villa")}</MenuItem>
                      <MenuItem value={"penthouse"}>{t("property_penthouse")}</MenuItem>
                      <MenuItem value={"mansion"}>{t("property_mansion")}</MenuItem>
                      <MenuItem value={"Commercial"}>{t("property_commercial")}</MenuItem>
                      <MenuItem value={"Townhouse"}>{t("property_townhouse")}</MenuItem>
                    </TextField> */}

                {/* PURPOSE OF ENQUIRY  */}
                <Select
                  id="for"
                  options={purpose_options(t)}
                  value={purpose_options(t).find(
                    (option) => option.value === ForType
                  )}
                  onChange={ChangeForType}
                  placeholder={t("label_purpose_of_enquiry")}
                  className={`mb-5`}
                  styles={selectStyles(currentMode, primaryColor)}
                />
                {/* <TextField
                      id="for"
                      value={ForType}
                      label={t("label_purpose_of_enquiry")}
                      onChange={ChangeForType}
                      size="small"
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                        {t("label_purpose_of_enquiry")}
                        <span className="ml-1 text-primary">*</span>
                      </MenuItem>
                      <MenuItem value={"Investment"}>{t("purpose_investment")}</MenuItem>
                      <MenuItem value={"End-user"}>{t("purpose_end_user")}</MenuItem>
                    </TextField> */}
              </Box>

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
                }}
                className={`${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark shadow-sm"
                      : "blur-bg-light shadow-sm"
                    : currentMode === "dark"
                    ? "bg-dark-neu"
                    : "bg-light-neu"
                } p-5`}
              >
                <h4
                  className={`${
                    currentMode === "dark" ? `text-white` : "text-black"
                  } text-center font-semibold uppercase pb-5`}
                >
                  {t("lead_details")}
                </h4>
                <TextField
                  id="LeadName"
                  type={"text"}
                  label={t("label_lead_name")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  required
                  value={LeadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
                <PhoneInput
                  placeholder={t("label_contact_number")}
                  value={value}
                  onChange={(value) => setValue(value)}
                  onKeyUp={handleContact}
                  error={error}
                  className={` ${classNames({
                    "dark-mode": currentMode === "dark",
                    "phone-input-light": currentMode !== "dark",
                    "phone-input-dark": currentMode === "dark",
                  })} mb-5`}
                  size="small"
                  style={{
                    background: `${
                      !themeBgImg
                        ? currentMode === "dark"
                          ? "#000000"
                          : "#FFFFFF"
                        : "transparent"
                      // : (currentMode === "dark" ? blurDarkColor : blurLightColor)
                    }`,
                    "& .PhoneInputCountryIconImg": {
                      color: "#fff",
                    },
                    color: currentMode === "dark" ? "white" : "black",
                    border: `1px solid ${
                      currentMode === "dark" ? "#EEEEEE" : "#666666"
                    }`,
                    borderRadius: "5px",
                    outline: "none",
                  }}
                  inputStyle={{
                    outline: "none !important",
                  }}
                  required
                />

                {error && (
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                )}
                <TextField
                  id="LeadEmailAddress"
                  type={"email"}
                  label={t("label_email_address")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  error={emailError && emailError}
                  helperText={emailError && emailError}
                  // value={LeadEmail}
                  onChange={handleEmail}
                />

                {/* LANGUAGE  */}
                <Select
                  id="LanguagePrefered"
                  options={language_options}
                  value={language_options.find(
                    (option) => option.value === LanguagePrefered
                  )}
                  onChange={ChangeLanguagePrefered}
                  placeholder={t("label_language")}
                  className={`mb-5`}
                  styles={selectStyles(currentMode, primaryColor)}
                />
                {/* <TextField
                      id="LanguagePrefered"
                      value={LanguagePrefered}
                      onChange={ChangeLanguagePrefered}
                      size="small"
                      className="w-full"
                      label={t("label_language")}
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                        },
                      }}
                      displayEmpty
                      select
                    >
                      <MenuItem value="" disabled>
                        {t("label_language")}
                        <span className="ml-1 text-primary">*</span>
                      </MenuItem>
                      <MenuItem value={"English"}>English</MenuItem>
                      <MenuItem value={"Arabic"} style={{ fontFamily: "Noto Kufi Arabic" }}>عربي <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Arabic)</span></MenuItem>
                      <MenuItem value={"Chinese"} style={{ fontFamily: "Noto Sans TC" }}>中国人 <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Chinese)</span></MenuItem>
                      <MenuItem value={"Farsi"} style={{ fontFamily: "Noto Kufi Arabic" }}>فارسی <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Farsi/Persian)</span></MenuItem>
                      <MenuItem value={"French"}>Français <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(French)</span></MenuItem>
                      <MenuItem value={"Hebrew"} style={{ fontFamily: "Noto Sans Hebrew" }}>עִברִית <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Hebrew)</span></MenuItem>
                      <MenuItem value={"Hindi"}>हिंदी <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Hindi)</span></MenuItem>
                      <MenuItem value={"Russian"}>Русский <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Russian)</span></MenuItem>
                      <MenuItem value={"Spanish"}>Español <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Spanish)</span></MenuItem>
                      <MenuItem value={"Urdu"} style={{ fontFamily: "Noto Kufi Arabic" }}>اردو <span className="mx-2" style={{ fontFamily: "Noto Sans" }}>(Urdu)</span></MenuItem>
                    </TextField> */}

                {/* LEAD SOURCE  */}
                {
                  !noSourceDropdown && (
                    <Select
                      id="LeadSource"
                      options={source_options(t)}
                      value={source_options(t).find(
                        (option) => option.value === LeadSource
                      )}
                      onChange={ChangeLeadSource}
                      placeholder={t("label_source")}
                      className={`mb-5`}
                      styles={selectStyles(currentMode, primaryColor)}
                    />
                  )
                  // <TextField
                  //   id="LeadSource"
                  //   value={LeadSource}
                  //   label={t("label_source")}
                  //   onChange={ChangeLeadSource}
                  //   size="small"
                  //   className="w-full"
                  //   sx={{
                  //     "&": {
                  //       marginBottom: "1.25rem !important",
                  //     },
                  //   }}
                  //   displayEmpty
                  //   select
                  //   required
                  // >
                  //   <MenuItem value="" disabled>
                  //     {t("label_source")}
                  //     <span className="ml-1 text-primary">*</span>
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign Facebook"}>
                  //     {t("source_facebook")} Campaign
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign Instagram"}>
                  //     {t("source_instagram")} Campaign
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign Snapchat"}>
                  //   {t("source_snapchat")}  Campaign
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign TikTok"}>
                  //     {t("source_tiktok")} Campaign
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign GoogleAds"}>
                  // {t("source_googleads")} Campaign
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign YouTube"}>
                  //     {t("source_youtube")} Campaign
                  //   </MenuItem>
                  //   <MenuItem value={"Campaign"}>{t("source_campaign")}</MenuItem>
                  //   <MenuItem value={"WhatsApp"}>{t("source_whatsapp")}</MenuItem>
                  //   <MenuItem value={"Comment"}>{t("source_comment")}</MenuItem>
                  //   <MenuItem value={"Message"}>{t("source_message")}</MenuItem>
                  //   <MenuItem value={"Website"}>{t("source_website")}</MenuItem>
                  //   <MenuItem value={"Secondary"}>{t("source_secondary")}</MenuItem>

                  //   <MenuItem value={"Property Finder"}>
                  //     {t("source_property_finder")}
                  //   </MenuItem>

                  //   <MenuItem value={"Personal"}>{t("source_personal")}</MenuItem>
                  // </TextField>
                }

                <Select
                  id="LeadCategory"
                  options={lead_options(t)}
                  value={lead_options(t).find(
                    (option) => option.value === LeadCategory
                  )}
                  onChange={ChangeLeadCategory}
                  placeholder={t("label_category")}
                  className={`mb-5`}
                  styles={selectStyles(currentMode, primaryColor)}
                />
              </Box>
            </div>

            <button
              className={`${
                themeBgImg
                  ? currentMode === "dark"
                    ? "blur-bg-primary"
                    : "blur-bg-primary"
                  : currentMode === "dark"
                  ? "bg-primary-dark-neu"
                  : "bg-primary-light-neu"
              } w-full text-white uppercase py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed`}
              // ripple={true}
              // size="lg"
              // type="submit"
              disabled={loading ? true : false}
            >
              {loading ? (
                <CircularProgress
                  size={20}
                  sx={{ color: "white" }}
                  className="text-white"
                />
              ) : (
                <span>{t("button_add_new_lead")}</span>
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AddLeadComponent;
