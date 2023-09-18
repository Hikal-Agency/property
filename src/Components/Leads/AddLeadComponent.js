import {
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { socket } from "../../Pages/App";
import { Button } from "@material-tailwind/react";

import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";

import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import Loader from "../Loader";

const AddLeadComponent = ({ FetchLeads }) => {
  const [loading, setloading] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const { hasPermission } = usePermission();
  const {
    currentMode,
    darkModeColors,
    User,
    BACKEND_URL,
    fetchSidebarData,
    SalesPerson,
    Managers,
    primaryColor
  } = useStateContext();
  console.log("Salesperson: ", SalesPerson);
  console.log("MAnagers: ", Managers);
  const [Manager2, setManager2] = useState([]);
  // const [SalesPerson, setSalesPerson] = useState([]);

  const [PropertyType, setPropertyType] = useState("");
  const [EnquiryType, setEnquiryType] = useState("");
  const [ForType, setForType] = useState("");
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  const [LeadStatus, setLeadStatus] = useState("");
  const [LeadSource, setLeadSource] = useState("");
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

  const handlePhone = (e) => {
    const value = e.target.value;
    const onlyDigitsAndPlus = /^[0-9+]*$/;
    if (onlyDigitsAndPlus.test(value)) {
      setLeadContact(value);
    }
    console.log(LeadContact);
  };
  const ChangePropertyType = (event) => {
    setPropertyType(event.target.value);
  };
  const ChangeEnquiryType = (event) => {
    setEnquiryType(event.target.value);
  };
  const ChangeForType = (event) => {
    setForType(event.target.value);
  };
  const ChangeLanguagePrefered = (event) => {
    setLanguagePrefered(event.target.value);
  };
  // eslint-disable-next-line
  const ChangeLeadStatus = (event) => {
    setLeadStatus(event.target.value);
  };
  const ChangeLeadSource = (event) => {
    setLeadSource(event.target.value);
  };
  // eslint-disable-next-line
  const ChangeManager = (event) => {
    setManager(event.target.value);
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === event.target.value;
    });
    // setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  };
  const ChangeSalesPerson = (event) => {
    console.log("clicked");
    setSalesPerson2(event.target.value);
  };

  const AddLead = async () => {
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
    let coldCall = "0";
    if (LeadSource.toLowerCase() === "property finder") {
      coldCall = 3;
    } else if (LeadSource.toLowerCase() === "personal") {
      coldCall = 2;
    }
    if (LeadName) LeadData.append("leadName", LeadName);
    if (LeadContact) LeadData.append("leadContact", LeadContact);
    if (LeadEmail) LeadData.append("leadEmail", LeadEmail);
    if (EnquiryType) LeadData.append("enquiryType", EnquiryType);
    if (PropertyType) LeadData.append("leadType", PropertyType);
    if (LeadProject) LeadData.append("project", LeadProject);
    if (ForType) LeadData.append("leadFor", ForType);
    if (LanguagePrefered) LeadData.append("language", LanguagePrefered);
    if (LeadStatus) LeadData.append("leadStatus", LeadStatus);
    if (LeadSource) LeadData.append("leadSource", LeadSource);
    LeadData.append("feedback", "New"); //Always appended
    LeadData.append("agency_id", User?.agency); //Always appended
    if (coldCall) LeadData.append("coldCall", coldCall);
    if (LeadNotes) LeadData.append("notes", LeadNotes);

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
        toast.success("Lead Added Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        const recipients = [];
        if(SalesPerson2) {
          recipients.push(SalesPerson2); 
          recipients.push(SalesPerson[`manager-${Manager}`]?.find((s) => s?.id === SalesPerson2)?.isParent); 
        } else {
          recipients.push(Manager);
        }
        socket.emit("notification_lead_add", {
          from: {id: User?.id, userName: User?.userName},
          leadName: LeadName,
          participants: recipients
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
            <div className="w-full flex items-center py-3 mb-7">
              <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                Add New Lead Details
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 px-4 md:px-10 ">
              <div className="px-4">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark"
                        ? `text-primary`
                        : "text-black"
                    } text-center font-semibold pb-5`}
                  >
                    Agent details
                  </h4>
                  {hasPermission("addlead_manager_dropdown") && (
                    <>
                      <TextField
                        id="Manager"
                        select
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        value={Manager}
                        disabled={User?.role === 3 && true}
                        label="Sales Manager"
                        onChange={ChangeManager}
                        size="small"
                        className="w-full"
                        displayEmpty
                      >
                        <MenuItem value="">
                          Select Manager
                          <span
                            className="ml-1 text-primary"
                          >
                            *
                          </span>
                        </MenuItem>

                        {Managers?.map((person, index) => (
                          <MenuItem key={index} value={person?.id}>
                            {person?.userName}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  )}

                  {hasPermission("addlead_agent_dropdown") && (
                    <>
                      {/* <InputLabel id="sales-person-label">
                        Select Sales Person
                      </InputLabel> */}
                      {/* <TextField
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        id="SalesPerson"
                        label="Sales Person"
                        value={SalesPerson2}
                        onChange={ChangeSalesPerson}
                        size="medium"
                        select
                        className="w-full mb-5"
                        displayEmpty
                      >
                        <MenuItem value="">
                          Select Sales Person
                        </MenuItem>
                        {SalesPerson.map((person, index) => (
                          <MenuItem key={index} value={person?.id}>
                            {person?.userName}
                          </MenuItem>
                        ))}
                      </TextField> */}
                      <TextField
                        sx={{
                          "&": {
                            marginBottom: "1.25rem !important",
                          },
                        }}
                        select
                        id="SalesPerson"
                        label="Sales Agent"
                        value={SalesPerson2}
                        onChange={ChangeSalesPerson}
                        size="small"
                        className="w-full"
                        displayEmpty
                      >
                        <MenuItem value="">
                          Select Agent
                        </MenuItem>
                        {User.role === 1
                          ? SalesPerson[`manager-${Manager}`]?.map(
                              (agent, index) => (
                                <MenuItem
                                  key={index}
                                  value={agent?.id}
                                >
                                  {agent?.userName}
                                </MenuItem>
                              )
                            )
                          : SalesPerson[`manager-${User?.id}`]?.map(
                              (agent, index) => (
                                <MenuItem
                                  key={index}
                                  value={agent?.id}
                                >
                                  {agent?.userName}
                                </MenuItem>
                              )
                            )}
                      </TextField>
                    </>
                  )}

                  <TextField
                    id="notes"
                    type={"text"}
                    label="Note"
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    variant="outlined"
                    size="small"
                    value={LeadNotes}
                    onChange={(e) => setLeadNotes(e.target.value)}
                  />

                  {User?.role === 7 && (
                    <>
                      <TextField
                        id="Manager"
                        type="text"
                        label="Manager"
                        className="w-full"
                        sx={{
                          marginBottom: "1.25rem !important",
                          color:
                            currentMode === "dark"
                              ? "#ffffff"
                              : "#000000",
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
                        label="Agent"
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
              </div>

              <div className="px-4">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark"
                        ? `text-primary`
                        : "text-black"
                    } text-center font-semibold pb-5`}
                  >
                    Project details
                  </h4>
                  <TextField
                    id="Project"
                    type={"text"}
                    label="Project name"
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

                  <TextField
                    id="enquiry"
                    label="Enquiry for"
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
                      Enquiry about
                      <span className="ml-1 text-primary">
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Studio"}>Studio</MenuItem>
                    <MenuItem value={"1 Bedroom"}>1 Bedroom</MenuItem>
                    <MenuItem value={"2 Bedrooms"}>
                      2 Bedrooms
                    </MenuItem>
                    <MenuItem value={"3 Bedrooms"}>
                      3 Bedrooms
                    </MenuItem>
                    <MenuItem value={"4 Bedrooms"}>
                      4 Bedrooms
                    </MenuItem>
                    <MenuItem value={"5 Bedrooms"}>
                      5 Bedrooms
                    </MenuItem>
                    <MenuItem value={"6 Bedrooms"}>
                      6 Bedrooms
                    </MenuItem>
                    <MenuItem value={"Retail"}>Retail</MenuItem>
                    <MenuItem value={"Other"}>Others</MenuItem>
                  </TextField>

                  <TextField
                    id="property-type"
                    value={PropertyType}
                    label="Property type"
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
                      Property type
                      <span className="ml-1 text-primary">
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Apartment"}>Apartment</MenuItem>
                    <MenuItem value={"Villa"}>Villa</MenuItem>
                    <MenuItem value={"penthouse"}>Penthouse</MenuItem>
                    <MenuItem value={"mansion"}>Mansion</MenuItem>
                    <MenuItem value={"Commercial"}>
                      Commercial
                    </MenuItem>
                    <MenuItem value={"Townhouse"}>TownHouse</MenuItem>
                  </TextField>

                  <TextField
                    id="for"
                    value={ForType}
                    label="Purpose of enquiry"
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
                      Purpose of enquiry
                      <span className="ml-1 text-primary">
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Investment"}>
                      Investment
                    </MenuItem>
                    <MenuItem value={"End-user"}>End-User</MenuItem>
                  </TextField>
                </Box>
              </div>

              <div className="px-4">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark"
                        ? `text-primary`
                        : "text-black"
                    } text-center font-semibold pb-5`}
                  >
                    Lead details
                  </h4>
                  <TextField
                    id="LeadName"
                    type={"text"}
                    label="Lead name"
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
                    placeholder="Contact number *"
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
                        currentMode === "dark" ? "#000000" : "#fff"
                      }`,
                      "& .PhoneInputCountryIconImg": {
                        color: "#fff",
                      },
                      color: "#808080",
                      border: `1px solid ${
                        currentMode === "dark" ? "#fff" : "#ccc"
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
                    label="Email address"
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

                  <TextField
                    id="LanguagePrefered"
                    value={LanguagePrefered}
                    onChange={ChangeLanguagePrefered}
                    size="small"
                    className="w-full"
                    label="Language"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    displayEmpty
                    select
                  >
                    <MenuItem value="" disabled>
                      Preferred language
                      <span className="ml-1 text-primary">
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Arabic"}>Arabic</MenuItem>
                    <MenuItem value={"English"}>English</MenuItem>
                    <MenuItem value={"Farsi"}>Farsi</MenuItem>
                    <MenuItem value={"French"}>French</MenuItem>
                    <MenuItem value={"Hindi"}>Hindi</MenuItem>
                    <MenuItem value={"Russian"}>Russian</MenuItem>
                    <MenuItem value={"Spanish"}>Spanish</MenuItem>
                    <MenuItem value={"Urdu"}>Urdu</MenuItem>
                  </TextField>

                  <TextField
                    id="LeadSource"
                    value={LeadSource}
                    label="Source"
                    onChange={ChangeLeadSource}
                    size="small"
                    className="w-full"
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    displayEmpty
                    select
                    required
                  >
                    <MenuItem value="" disabled>
                      Source
                      <span className="ml-1 text-primary" >
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Website"}>Website</MenuItem>
                    <MenuItem value={"Campaign"}>Campaign</MenuItem>
                    <MenuItem value={"Whatsapp"}>Whatsapp</MenuItem>
                    <MenuItem value={"Comment"}>Comment</MenuItem>
                    <MenuItem value={"Message"}>Message</MenuItem>
                    <MenuItem value={"Campaign Tiktok"}>
                      Campaign Tiktok
                    </MenuItem>
                    <MenuItem value={"Campaign Facebook"}>
                      Campaign Facebook
                    </MenuItem>
                    <MenuItem value={"Campaign GoogleAds"}>
                      Campaign GoogleAds
                    </MenuItem>
                    <MenuItem value={"Campaign Snapchat"}>
                      Campaign Snapchat
                    </MenuItem>

                    <MenuItem value={"Property Finder"}>
                      Property Finder
                    </MenuItem>

                    <MenuItem value={"Personal"}>Personal</MenuItem>
                  </TextField>
                </Box>
              </div>
            </div>

            <div
              className={`${
                currentMode === "dark" ? "bg-black" : "bg-white"
              } px-5 mx-5 py-2 text-center sm:px-6`}
            >
              <Button
                className={`min-w-fit mb-5 w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                ripple={true}
                style={{
                  background: `${primaryColor}`
                }}
                size="lg"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <span>Add New Lead</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddLeadComponent;
