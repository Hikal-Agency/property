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
import { Button, Textarea } from "@material-tailwind/react";

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

const BulkSMSModal = ({ FetchLeads, fromRange, toRange }) => {
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
    rangeData,
    setRangeData,
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

  const ChangeEnquiryType = (event) => {
    setEnquiryType(event.target.value);
  };

  const ChangeLanguagePrefered = (event) => {
    setLanguagePrefered(event.target.value);
  };
  // eslint-disable-next-line

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
            <div className="w-full flex items-center py-1 mb-7">
              <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                Send Bullk SMS
              </h1>
            </div>

            <div className="grid grid-cols-1 px-4 md:px-10 ">
              <div className="px-4">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark" ? "text-red-600" : "text-black"
                    } text-center font-semibold pb-5`}
                  >
                    SMS Recipients
                  </h4>

                  <Textarea
                    id="Manager"
                    select
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    rows={4}
                    value={Manager}
                    label="All Recipients"
                    onChange={ChangeManager}
                    size="small"
                    className="w-full"
                    displayEmpty
                  />
                </Box>
              </div>

              <div className="px-4 mt-3">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark" ? "text-red-600" : "text-black"
                    } text-center font-semibold pb-5`}
                  >
                    SMS Message
                  </h4>

                  <TextField
                    id="enquiry"
                    label="SMS Templates"
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
                      SMS Templates
                      <span className="ml-1" style={{ color: "red" }}>
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Studio"}>Email</MenuItem>
                  </TextField>

                  <Textarea
                    id="Manager"
                    select
                    sx={{
                      "&": {
                        marginBottom: "1.25rem !important",
                      },
                    }}
                    rows={4}
                    value={Manager}
                    label="All Recipients"
                    onChange={ChangeManager}
                    size="small"
                    className="w-full"
                    displayEmpty
                  />

                  <label
                    className={`flex my-3  ${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    } `}
                  >
                    <strong className=" ">
                      Number of Characters: <span className="text-red">48</span>
                    </strong>
                  </label>
                </Box>
              </div>

              <div className="px-4">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark" ? "text-red-600" : "text-black"
                    } text-center font-semibold pb-5`}
                  >
                    SMS Send Configurations
                  </h4>

                  <TextField
                    id="LanguagePrefered"
                    value={LanguagePrefered}
                    onChange={ChangeLanguagePrefered}
                    size="small"
                    className="w-full"
                    label="Send From"
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
                    <MenuItem value={"Hebrew"}>Hebrew</MenuItem>
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
                      <span className="ml-1" style={{ color: "red" }}>
                        *
                      </span>
                    </MenuItem>
                    <MenuItem value={"Campaign Facebook"}>
                      Facebook Campaign
                    </MenuItem>
                    <MenuItem value={"Campaign Snapchat"}>
                      Snapchat Campaign
                    </MenuItem>
                    <MenuItem value={"Campaign TikTok"}>
                      TikTok Campaign
                    </MenuItem>
                    <MenuItem value={"Campaign GoogleAds"}>
                      GoogleAds Campaign
                    </MenuItem>
                    <MenuItem value={"Campaign YouTube"}>
                      YouTube Campaign
                    </MenuItem>
                    <MenuItem value={"Campaign"}>Campaign</MenuItem>
                    <MenuItem value={"WhatsApp"}>WhatsApp</MenuItem>
                    <MenuItem value={"Comment"}>Comment</MenuItem>
                    <MenuItem value={"Message"}>Message</MenuItem>
                    <MenuItem value={"Website"}>Website</MenuItem>

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
                className={`min-w-fit mb-5 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                ripple={true}
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
                  <span>Send</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default BulkSMSModal;
