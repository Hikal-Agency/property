import {
  MenuItem,
  TextField,
  Select,
  CircularProgress,
  Box,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import "react-phone-number-input/style.css";

import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import Loader from "../Loader";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function isEmailValid(email) {
  console.log("Validating email: ", email);
  return emailRegex.test(email);
}

const AddLeadComponent = () => {
  const [loading, setloading] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const {
    currentMode,
    darkModeColors,
    User,
    BACKEND_URL,
    fetchSidebarData,
    SalesPerson,
    Managers,
  } = useStateContext();
  console.log("Salesperson: ", SalesPerson);
  const [Manager2, setManager2] = useState([]);
  // const [SalesPerson, setSalesPerson] = useState([]);
  console.log("managers: ", Managers);

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

  // const handleEmail = (e) => {
  //   setEmailError(false);
  //   const value = e.target.value;
  //   console.log(value);
  //   const emailRegex = /^\S+@\S+\.\S+$/;
  //   if (emailRegex.test(value)) {
  //     setEmailError(false);
  //   } else {
  //     setEmailError("Kindly enter a valid email.");
  //     // setLeadEmail("");
  //     return;
  //   }

  //   setLeadEmail(value);

  //   console.log("Email state: ", LeadEmail);
  // };

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
    if (emailError !== false) {
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
    const creationDate = new Date();
    const LeadData = new FormData();
    let coldCall = "0";
    if (LeadSource.toLowerCase() === "property finder") {
      coldCall = 3;
    } else if (LeadSource.toLowerCase() === "personal") {
      coldCall = 2;
    }

    LeadData.append("leadName", LeadName);
    LeadData.append("leadContact", LeadContact);
    LeadData.append("leadEmail", LeadEmail);
    LeadData.append("enquiryType", EnquiryType);
    LeadData.append("leadType", PropertyType);
    LeadData.append("project", LeadProject);
    LeadData.append("leadFor", ForType);
    LeadData.append("language", LanguagePrefered);
    LeadData.append("leadStatus", LeadStatus);
    LeadData.append("leadSource", LeadSource);
    LeadData.append("feedback", "New");
    LeadData.append("coldCall", coldCall);
    LeadData.append("notes", LeadNotes);
    if (User?.role === 1) {
      if(Manager) {
        LeadData.append("assignedToManager", Number(Manager));
      }
      if(SalesPerson2) {
        LeadData.append("assignedToSales", Number(SalesPerson2));
      }
    } else if(User?.role === 3) {
      LeadData.append("assignedToManager", Number(121));
      console.log("SENT");
      if(SalesPerson2) {
        LeadData.append("assignedToSales", Number(SalesPerson2));
      }
    } else if (User?.role === 7) {
      LeadData.append("assignedToManager", Number(User?.isParent));
      LeadData.append("assignedToSales", Number(User?.id));
    }
    LeadData.append(
      "creationDate",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );
    LeadData.append(
      "lastEdited",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );

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
        setManager("");
        setSalesPerson2("");
        setValue("");
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

  useEffect(() => {
    setpageloading(true);
    const token = localStorage.getItem("auth-token");
    console.log("USerID: ", User?.id);
    axios
      .get(`${BACKEND_URL}/teamMembers/${User?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("team: ", result);
        setManager2(result.data.team);
        if (User?.role === 3) {
          const SalesPerson = result.data.team;
          // setSalesPerson(SalesPerson || []);
        }
        setpageloading(false);
      })
      .catch((err) => {
        console.log(err);
        setpageloading(false);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />
      {pageloading ? (
        <Loader />
      ) : (
        <div className="pt-0 pb-5 mx-4 rounded-md sm:mx-6 lg:mx-auto ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              AddLead();
            }}
            disabled={loading ? true : false}
          >
            <div className="mt-5 sm:mt-0 rounded-lg shadow-lg">
              <div className="md:grid md:grid-cols-3 md:gap-6 mt-4">
                <div className="mt-10 md:col-span-3 md:mt-0">
                  <div className="sm:rounded-md">
                    <div
                      className={`${
                        currentMode === "dark" ? "bg-black" : "bg-white"
                      }  px-4 md:px-10 `}
                    >
                      <div className="mb-10">
                        <h3
                          className={`text-xl font-bold text-center leading-6 ${
                            currentMode === "dark"
                              ? "text-white "
                              : "text-black"
                          } `}
                          style={{ textTransform: "capitalize" }}
                        >
                          Add new lead details
                          {/* {camelCase("Add new lead details")} */}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
                        <div>
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? "text-red-600"
                                  : "text-red-600"
                              } text-center font-bold pb-5`}
                              style={{ textTransform: "capitalize" }}
                            >
                              Agent details
                            </h4>
                            {User?.role === 1 && (
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
                                  label="Manager"
                                  onChange={ChangeManager}
                                  size="medium"
                                  className="w-full mb-5"
                                  displayEmpty
                                >
                                  <MenuItem value="">
                                    Select Manager
                                    <span
                                      className="ml-1"
                                      style={{ color: "red" }}
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

                            {(User?.role === 1 || User?.role === 3) && (
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
                                <Select
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
                                  className="w-full mb-5"
                                  displayEmpty
                                >
                                  <MenuItem value="">
                                    Select Sales Person
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
                                </Select>
                              </>
                            )}

                            <TextField
                              id="notes"
                              type={"text"}
                              label="Notes"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              value={LeadNotes}
                              onChange={(e) => setLeadNotes(e.target.value)}
                            />
                          </Box>
                        </div>

                        <div>
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? "text-red-600"
                                  : "text-red-600"
                              } text-center font-bold pb-5`}
                              style={{ textTransform: "capitalize" }}
                            >
                              Project details
                            </h4>
                            <TextField
                              id="Project"
                              type={"text"}
                              label="Project name"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              value={LeadProject}
                              onChange={(e) => setLeadProject(e.target.value)}
                            />

                            <TextField
                              id="enquiry"
                              label="Enquiry"
                              value={EnquiryType}
                              onChange={ChangeEnquiryType}
                              size="medium"
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
                                <span className="ml-1" style={{ color: "red" }}>
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
                              label="Property Type"
                              onChange={ChangePropertyType}
                              size="medium"
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
                                <span className="ml-1" style={{ color: "red" }}>
                                  *
                                </span>
                              </MenuItem>
                              <MenuItem value={"Apartment"}>Apartment</MenuItem>
                              <MenuItem value={"Villa"}>Villa</MenuItem>
                              <MenuItem value={"Commercial"}>
                                Commercial
                              </MenuItem>
                              <MenuItem value={"Townhouse"}>TownHouse</MenuItem>
                            </TextField>

                            <TextField
                              id="for"
                              value={ForType}
                              label="Purpose"
                              onChange={ChangeForType}
                              size="medium"
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
                                <span className="ml-1" style={{ color: "red" }}>
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

                        <div>
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? "text-red-600"
                                  : "text-red-600"
                              } text-center font-bold pb-5`}
                              style={{ textTransform: "capitalize" }}
                            >
                              Lead details
                            </h4>
                            <TextField
                              id="LeadName"
                              type={"text"}
                              label="Lead name"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              required
                              value={LeadName}
                              onChange={(e) => setLeadName(e.target.value)}
                            />
                            <PhoneInput
                              placeholder="Enter phone number *"
                              value={value}
                              onChange={(value) => setValue(value)}
                              onKeyUp={handleContact}
                              error={error}
                              className={classNames({
                                "dark-mode": currentMode === "dark",
                                "phone-input-light": currentMode !== "dark",
                                "phone-input-dark": currentMode === "dark",
                              })}
                              style={{
                                background: `${
                                  currentMode === "dark" ? "#000000" : "#fff"
                                }`,
                                "& .PhoneInputCountryIconImg": {
                                  color: "#fff",
                                },
                                color: "#808080",
                                padding: "10",
                                border: `1px solid ${
                                  currentMode === "dark" ? "#fff" : "#ccc"
                                }`,
                                borderRadius: "3px",
                                outline: "none",
                              }}
                              inputStyle={{
                                outline: "none",
                                fontSize: "16px",
                              }}
                              required
                            />

                            {error && (
                              <Typography variant="body2" color="error">
                                {error}
                              </Typography>
                            )}
                            <br />
                            {/* <TextField
                              id="LeadContactNumber"
                              type={"tel"}
                              label="Contact number"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              required
                              value={LeadContact}
                              onChange={handlePhone}
                            /> */}

                            {/* <TextField
                              id="LeadEmailAddress"
                              type={"email"}
                              label="Email address"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              required
                              value={LeadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                            /> */}
                            <TextField
                              id="LeadEmailAddress"
                              type={"email"}
                              label="Email address"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              error={emailError && emailError}
                              helperText={emailError && emailError}
                              // value={LeadEmail}
                              onChange={handleEmail}
                            />

                            {/* <TextField
                              id="LeadEmailAddress"
                              type="email"
                              label="Email address"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              required
                              value={LeadEmail}
                              onChange={handleEmail}
                            /> */}

                            <TextField
                              id="LanguagePrefered"
                              value={LanguagePrefered}
                              onChange={ChangeLanguagePrefered}
                              size="medium"
                              className="w-full mb-5"
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
                                <span className="ml-1" style={{ color: "red" }}>
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
                              size="medium"
                              className="w-full mb-5"
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
                                <span className="ml-1" style={{ color: "red" }}>
                                  *
                                </span>
                              </MenuItem>
                              <MenuItem value={"Website"}>Website</MenuItem>
                              <MenuItem value={"Property Finder"}>
                                Property Finder
                              </MenuItem>
                              <MenuItem value={"Campaign"}>Campaign</MenuItem>
                              <MenuItem value={"Personal"}>Personal</MenuItem>
                              <MenuItem value={"Whatsapp"}>Whatsapp</MenuItem>
                              <MenuItem value={"Comment"}>Comment</MenuItem>
                              <MenuItem value={"Message"}>Message</MenuItem>
                              <MenuItem value={"Campaign Snapchat"}>
                                Campaign Snapchat
                              </MenuItem>
                              <MenuItem value={"Campaign Tiktok"}>
                                Campaign Tiktok
                              </MenuItem>
                              <MenuItem value={"Campaign Facebook"}>
                                Campaign Facebook
                              </MenuItem>
                              <MenuItem value={"Campaign GoogleAds"}>
                                Campaign GoogleAds
                              </MenuItem>
                            </TextField>
                          </Box>
                        </div>
                      </div>
                      {/* ------- */}
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    } px-4 text-center sm:px-6`}
                  >
                    <Button
                      className={`min-w-fit mb-5 w-full  text-white rounded-md py-3 font-semibold disabled:opacity-50  disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                      ripple={true}
                      size="lg"
                      type="submit"
                      disabled={loading ? true : false}
                    >
                      {loading ? (
                        <CircularProgress
                          size={23}
                          sx={{ color: "white" }}
                          className="text-white"
                        />
                      ) : (
                        <span> Add Lead</span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddLeadComponent;
