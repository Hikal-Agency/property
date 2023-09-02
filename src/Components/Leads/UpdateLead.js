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

import axios from "../../axoisConfig";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import {BiBlock} from "react-icons/bi";
import { useStateContext } from "../../context/ContextProvider";
import "react-phone-number-input/style.css";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import BlockIPModal from "./BlockIPModal";

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
  } = useStateContext();
  const [value, setValue] = useState();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
  const [noAgents, setNoAgents] = useState(false);
  const [error, setError] = useState(false);
  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };
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

  // const handlePhone = (e) => {
  //   console.log("Phone: ", e.target.value);
  //   setValue(e.target.value);
  //   if (isPossiblePhoneNumber(value)) {
  //     console.log("Possible: ", e.target.value);
  //     if (isValidPhoneNumber(value)) {
  //       setValue(formatPhoneNumberIntl(value));
  //       console.log("Valid: ", value);
  //     }
  //   }
  // };


  const handlePhone = () => {
    setError(false);
    const inputValue = value;
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
  // eslint-disable-next-line
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
  };
  const ChangeManager = (event) => {
    setManager(event.target.value);
    setSalesPerson(AllSalesPersons[`manager-${event.target.value}`] || []);
  };
  const ChangeSalesPerson = (event) => {
    setSalesPerson2(event.target.value);
  };

  console.log("salesperson: ", SalesPerson2);

  const handleContact = (e) => {
    const value = e.target.value;
    const onlyDigitsAndPlus = /^[0-9+]*$/;
    if (onlyDigitsAndPlus.test(value) && value.startsWith("+")) {
      setLeadContact(value);
    }
  };

  console.log("Time:", moment().format("YYYY/MM/DD HH:mm:ss"));

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
      // return;
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

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    axios
      .get(`${BACKEND_URL}/managers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log(result);
        const managers = result?.data?.managers?.data;
        setManager2(managers || []);

        const urls = managers?.map((manager) => {
          return `${BACKEND_URL}/teamMembers/${manager?.id}`;
        });

        setPersons(urls || []);

        // if (User.role === 3) {
        //   setfilter_manager(
        //     result.data.team.filter((manager) => {
        //       return manager.id === User?.id;
        //     })
        //   );
        //   const SalesPerson = result.data.team.filter((manager) => {
        //     return manager.id === User?.id;
        //   });
        //   setSalesPerson(SalesPerson[0]?.child ? SalesPerson[0].child : []);
        //   console.log("filtyer manager is");
        //   console.log(filter_manager);
        // }
        setloading(false);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  }, []);

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
        setLeadContact(result?.data?.data?.leadContact);
        setLeadEmail(result?.data?.data?.leadEmail);
        setLanguagePrefered(result?.data?.data?.language);
        setLeadStatus(result?.data?.data?.leadStatus);
        setFeedback(result?.data?.data?.feedback);
        setLeadNotes(result?.data?.data?.notes);
        setManager(result?.data?.data?.assignedToManager);
        setSalesPerson2(result?.data?.data?.assignedToSales);
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

    // if (emailError !== false) {
    //   toast.error("Kindly enter a valid email.", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    //   setbtnloading(false);
    //   setloading(false);
    //   return;
    // }

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
    const creationDate = new Date();
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("id", User.id);
    UpdateLeadData.append("id", LeadData.leadId);
    // UpdateLeadData.append("lid", LeadData.leadId);
    UpdateLeadData.append("leadName", LeadName);
    UpdateLeadData.append("leadContact", LeadContact);
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
          style={style}
          className={`w-[calc(100%-30px)] md:w-[85%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md border boder-[#AAAAAA]`}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center space-x-1">
              <CircularProgress size={20} />
              <span className="font-semibold text-lg"> Fetching Your Lead</span>
            </div>
          ) : (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 10,
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={handleLeadModelClose}
              >
                <IoMdClose size={18} />
              </IconButton>
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-semibold text-lg pb-10`}
              >
                Update lead details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  UpdateLeadFunc();
                }}
              >
                <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5">
                  <div>
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark"
                            ? "text-red-600"
                            : "text-red-600"
                        } text-center font-semibold pb-5`}
                      >
                        Agent details
                      </h4>

                      <>
                        {/* <FormHelperText
                            sx={{
                              color: currentMode === "dark" ? "white" : "black",
                            }}
                          >
                            Manager
                          </FormHelperText> */}
                        {/* <label className="text-sm text-gray-500">
                            Manager
                          </label> */}
                        {/* <Select
                            id="Manager"
                            value={User?.role === 1 ? Manager : ""}
                            disabled={User?.role !== 1 && true}
                            label="Manager"
                            onChange={ChangeManager}
                            size="medium"
                            className="w-full mb-5"
                            displayEmpty
                            required
                          >
                            <MenuItem value="0" disabled>
                              Manager
                            </MenuItem>
                            {Manager2?.map((person, index) => (
                              <MenuItem key={index} value={person?.id || ""}>
                                {person?.userName}
                              </MenuItem>
                            ))}
                          </Select> */}
                        <TextField
                          id="Manager"
                          type="text"
                          label="Manager"
                          className="w-full"
                          sx={{
                            marginBottom: "1.25rem !important",
                            color:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                            pointerEvents: "none",
                          }}
                          variant="outlined"
                          size="small"
                          value={
                            Manager2?.find((person) => person?.id === Manager)
                              ?.userName || "No manager"
                          }
                          onChange={(e) => {
                            e.preventDefault();
                          }}
                          readOnly={true}
                        />
                      </>

                      {noAgents
                        ? ""
                        : // <p
                          //   style={{
                          //     color: "#0000005c",
                          //     textAlign: "left",
                          //     width: "85%",
                          //   }}
                          // >
                          //   No Agents
                          // </p>
                          (User.role === 1 || User.role === 3) && (
                            <>
                              {/* <label className="text-sm text-gray-500">
                              Sales Agent
                            </label> */}
                              {/* <FormHelperText
                              sx={{
                                color:
                                  currentMode === "dark" ? "white" : "black",
                              }}
                            >
                              SalesPerson
                            </FormHelperText>
                            <Select
                              id="SalesPerson"
                              value={SalesPerson2 || ""}
                              onChange={ChangeSalesPerson}
                              size="medium"
                              className="w-full mb-5"
                              displayEmpty
                              // required={SalesPerson.length > 0 ? true : false}
                            >
                              <MenuItem value="">Sales Person</MenuItem>
                              {SalesPerson?.map((person, index) => (
                                <MenuItem key={index} value={person?.id || ""}>
                                  {person?.userName}
                                </MenuItem>
                              ))}
                            </Select> */}
                              <TextField
                                id="Salesperson"
                                type="text"
                                label="Agent"
                                className="w-full"
                                style={{
                                  marginBottom: "1.25rem !important",
                                  color: "#ffffff",
                                  pointerEvents: "none",
                                }}
                                variant="outlined"
                                size="small"
                                value={
                                  SalesPerson?.find(
                                    (person) => person?.id === SalesPerson2
                                  )?.userName || "No Agent Assigned"
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
                          label="Agent"
                          type="text"
                          className="w-full mb-5"
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
                      )}
                    </Box>
                  </div>

                  <div>
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark"
                            ? "text-red-600"
                            : "text-red-600"
                        } text-center font-semibold pb-5`}
                      >
                        Project details
                      </h4>
                      <TextField
                        id="Project"
                        type={"text"}
                        className="w-full"
                        sx={{ marginBottom: "1.25rem !important" }}
                        label="Project name"
                        variant="outlined"
                        size="small"
                        value={LeadProject}
                        onChange={(e) => setLeadProject(e.target.value)}
                      />

                      {/* <label className="text-sm text-gray-500">
                        Enquiry About
                      </label> */}
                      <TextField
                        id="enquiry"
                        value={EnquiryType}
                        label="Enquiry for"
                        onChange={ChangeEnquiryType}
                        size="small"
                        className="w-full"
                        sx={{
                          marginBottom: "1.25rem !important",
                        }}
                        displayEmpty
                        select
                      >
                        <MenuItem value="">Enquiry about</MenuItem>
                        <MenuItem value={"Studio"}>Studio</MenuItem>
                        <MenuItem value={"1 Bedroom"}>1 Bedroom</MenuItem>
                        <MenuItem value={"2 Bedrooms"}>2 Bedrooms</MenuItem>
                        <MenuItem value={"3 Bedrooms"}>3 Bedrooms</MenuItem>
                        <MenuItem value={"4 Bedrooms"}>4 Bedrooms</MenuItem>
                        <MenuItem value={"5 Bedrooms"}>5 Bedrooms</MenuItem>
                        <MenuItem value={"6 Bedrooms"}>6 Bedrooms</MenuItem>
                        <MenuItem value={"Retail"}>Retail</MenuItem>
                        <MenuItem value={"Other"}>Others</MenuItem>
                      </TextField>

                      {/* <label className="text-sm text-gray-500">
                        Property Type
                      </label> */}
                      <TextField
                        id="property-type"
                        value={PropertyType}
                        label="Property type"
                        sx={{
                          marginBottom: "1.25rem !important",
                        }}
                        onChange={ChangePropertyType}
                        size="small"
                        className="w-full"
                        displayEmpty
                        select
                      >
                        <MenuItem value="">Property type</MenuItem>
                        <MenuItem value={"Apartment"}>Apartment</MenuItem>
                        <MenuItem value={"Villa"}>Villa</MenuItem>
                        <MenuItem value={"penthouse"}>Penthouse</MenuItem>
                        <MenuItem value={"mansion"}>Mansion</MenuItem>
                        <MenuItem value={"Commercial"}>Commercial</MenuItem>
                        <MenuItem value={"Townhouse"}>TownHouse</MenuItem>
                      </TextField>

                      {/* <label className="text-sm text-gray-500">For</label> */}
                      <TextField
                        id="for"
                        sx={{
                          marginBottom: "1.25rem !important",
                        }}
                        value={ForType}
                        label="Purpose of enquiry"
                        onChange={ChangeForType}
                        size="small"
                        className="w-full"
                        displayEmpty
                        select
                      >
                        <MenuItem value="" selected>
                          For
                        </MenuItem>
                        <MenuItem value={"Investment"}>Investment</MenuItem>
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
                        } text-center font-semibold pb-5`}
                      >
                        Lead details
                      </h4>
                      <TextField
                        id="LeadName"
                        type={"text"}
                        label="Lead name"
                        className="w-full"
                        sx={{ marginBottom: "1.25rem !important" }}
                        variant="outlined"
                        size="small"
                        required
                        value={LeadName}
                        onChange={(e) => setLeadName(e.target.value)}
                      />

                      <PhoneInput
                        placeholder="Contact number"
                        value={LeadContact}
                        onChange={(value) => setValue(value)}
                        onKeyUp={handlePhone}
                        required
                        labels={"Phone No"}
                        error={error}
                        className={`${classNames({
                          "dark-mode": currentMode === "dark",
                        })} mb-5`}
                        size="small"
                        style={{
                          background: `${
                            currentMode === "dark" ? "#1C1C1C" : "#fff"
                          }`,
                          "& .PhoneInputCountryIconImg": {
                            color: "#fff",
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

                      {/* Possible{" "}
                      {value && isPossiblePhoneNumber(value)
                        ? value
                        : "Invalid"} */}
                      {/* <TextField
                        sx={{
                          color: "red",
                        }}
                        id="LeadContactNumber"
                        type={"tel"}
                        label="Contact number"
                        className="w-full mb-5"
                        style={{ marginBottom: "20px" }}
                        variant="outlined"
                        size="medium"
                        required
                        value={LeadContact}
                        // onChange={(e) => setLeadContact(e.target.value)}
                        helperText="Enter contact number starting with '+'  "
                        onChange={handleContact}
                        autoComplete
                      /> */}

                      <TextField
                        id="LeadEmailAddress"
                        type={"email"}
                        className="w-full"
                        label="Email address"
                        sx={{ marginBottom: "1.25rem !important" }}
                        variant="outlined"
                        size="small"
                        value={LeadEmail === "undefined" ? "" : LeadEmail}
                        // onChange={(e) => setLeadEmail(e.target.value)}
                        error={emailError && emailError}
                        helperText={emailError && emailError}
                        onChange={handleEmail}
                      />

                      <TextField
                        sx={{
                          marginBottom: "1.25rem !important",
                        }}
                        id="LanguagePrefered"
                        value={LanguagePrefered}
                        onChange={ChangeLanguagePrefered}
                        label="Language"
                        size="small"
                        className="w-full"
                        select
                        displayEmpty
                      >
                        <MenuItem value="" selected>
                          Prefered language
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
                    </Box>
                  </div>
                </div>
                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
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
                    <span> Update Lead</span>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </Modal>

    </>
  );
};

export default UpdateLead;
