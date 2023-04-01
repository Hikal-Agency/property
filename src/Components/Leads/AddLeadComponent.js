import {
  MenuItem,
  TextField,
  Select,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Button } from "@material-tailwind/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

const AddLeadComponent = () => {
  const [loading, setloading] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
  const [Manager2, setManager2] = useState([]);
  const [SalesPerson, setSalesPerson] = useState([]);
  const [filter_manager, setfilter_manager] = useState();

  const [PropertyType, setPropertyType] = useState("");
  const [EnquiryType, setEnquiryType] = useState("");
  const [ForType, setForType] = useState("");
  const [LanguagePrefered, setLanguagePrefered] = useState("");
  const [LeadStatus, setLeadStatus] = useState("");
  const [LeadSource, setLeadSource] = useState("");
  const [Feedback, setFeedback] = useState("");
  const [Manager, setManager] = useState("");

  const [SalesPerson2, setSalesPerson2] = useState("");
  const [LeadName, setLeadName] = useState("");
  const [LeadContact, setLeadContact] = useState("");
  const [LeadEmail, setLeadEmail] = useState("");
  const [LeadProject, setLeadProject] = useState("");
  const [LeadNotes, setLeadNotes] = useState("");

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
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
  };
  const ChangeManager = (event) => {
    setManager(event.target.value);
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === event.target.value;
    });
    setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  };
  const ChangeSalesPerson = (event) => {
    setSalesPerson2(event.target.value);
  };

  const AddLead = async () => {
    setloading(true);
    const token = localStorage.getItem("auth-token");
    const creationDate = new Date();
    const LeadData = new FormData();
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
    LeadData.append("feedback", Feedback);
    LeadData.append("notes", LeadNotes);
    if (User.role === 1 || User.role === 3) {
      LeadData.append("assignedToManager", Manager);
      LeadData.append("assignedToSales", SalesPerson2);
    }
    LeadData.append(
      "creationDate",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );
    LeadData.append(
      "lastEdited",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );

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
        setLeadName("");
        setLeadContact("");
        setLeadEmail("");
        setEnquiryType("");
        setPropertyType("");
        setLeadProject("");
        setForType("");
        setLanguagePrefered("");
        setLeadSource("");
        setFeedback("");
        setLeadNotes("");
        setManager("");
        setSalesPerson2("");
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
    const token = localStorage.getItem("auth-token");
    console.log(User);
    axios
      .get(`${BACKEND_URL}/teamMembers/${User.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("result", result);
        setManager2(result.data.team);
        if (User.role === 3) {
          setfilter_manager(
            result.data.team.filter((manager) => {
              return manager.id === User?.id;
            })
          );
          const SalesPerson = result.data.team.filter((manager) => {
            return manager.id === User?.id;
          });
          setSalesPerson(SalesPerson[0]?.child ? SalesPerson[0].child : []);
        }
        setpageloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <ToastContainer />
      {pageloading ? (
        <div className="h-full w-full flex items-center justify-center">
          <img
            height={350}
            width={350}
            src={"/assets/loading/hikalloading.gif"}
            alt=""
            // className="h-[200px] w-[200px] object-cover"
          />
        </div>
      ) : (
        <div className="pt-0 pb-5 mx-4 rounded-md sm:mx-6 lg:mx-auto ">
          {console.log("filtered managers are ")}
          {console.log(filter_manager)}
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
                      } py-10 px-4 md:px-10 `}
                    >
                      <div className="mb-10">
                        <h3
                          className={`text-xl font-bold text-center leading-6 ${
                            currentMode === "dark"
                              ? "text-white "
                              : "text-black"
                          } `}
                        >
                          Add new lead details
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
                            >
                              Agent details
                            </h4>
                            {(User.role === 1 || User.role === 3) && (
                              <Select
                                id="Manager"
                                value={
                                  User.role === 3
                                    ? filter_manager[0]?.id
                                    : Manager
                                }
                                disabled={User.role === 3 && true}
                                label="Manager"
                                onChange={ChangeManager}
                                size="medium"
                                className="w-full mb-5"
                                displayEmpty
                                required
                              >
                                <MenuItem value="" disabled>
                                  Manager
                                </MenuItem>

                                {Manager2.map((person, index) => (
                                  <MenuItem key={index} value={person?.id}>
                                    {person?.userName}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}

                            {(User.role === 1 || User.role === 3) && (
                              <Select
                                id="SalesPerson"
                                value={SalesPerson2}
                                label="SalesPerson"
                                onChange={ChangeSalesPerson}
                                size="medium"
                                className="w-full mb-5"
                                displayEmpty
                                // required={SalesPerson.length > 0 ? true : false}
                              >
                                <MenuItem value="" disabled>
                                  Sales Person
                                </MenuItem>
                                {SalesPerson.map((person, index) => (
                                  <MenuItem key={index} value={person?.id}>
                                    {person?.userName}
                                  </MenuItem>
                                ))}
                              </Select>
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

                            <Select
                              id="enquiry"
                              value={EnquiryType}
                              label="Enquiry Type"
                              onChange={ChangeEnquiryType}
                              size="medium"
                              className="w-full mb-5"
                              displayEmpty
                              required
                            >
                              <MenuItem value="" disabled>
                                Enquiry about
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
                            </Select>

                            <Select
                              id="property-type"
                              value={PropertyType}
                              label="Property type"
                              onChange={ChangePropertyType}
                              size="medium"
                              className="w-full mb-5"
                              displayEmpty
                              required
                            >
                              <MenuItem value="" disabled>
                                Property type
                              </MenuItem>
                              <MenuItem value={"Apartment"}>
                                Appartment
                              </MenuItem>
                              <MenuItem value={"Villa"}>Villa</MenuItem>
                              <MenuItem value={"Commercial"}>
                                Commercial
                              </MenuItem>
                              <MenuItem value={"Townhouse"}>TownHouse</MenuItem>
                            </Select>

                            <Select
                              id="for"
                              value={ForType}
                              label="Purpose of enquiry"
                              onChange={ChangeForType}
                              size="medium"
                              className="w-full"
                              displayEmpty
                              required
                            >
                              <MenuItem value="" disabled>
                                Purpose of enquiry
                              </MenuItem>
                              <MenuItem value={"Investment"}>
                                Investment
                              </MenuItem>
                              <MenuItem value={"End-user"}>End-User</MenuItem>
                            </Select>
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
                            <TextField
                              id="LeadContactNumber"
                              type={"number"}
                              label="Contact number"
                              className="w-full mb-5"
                              style={{ marginBottom: "20px" }}
                              variant="outlined"
                              size="medium"
                              required
                              value={LeadContact}
                              onChange={handlePhone}
                            />

                            <TextField
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
                            />

                            <Select
                              id="LanguagePrefered"
                              value={LanguagePrefered}
                              label="Preferred language"
                              onChange={ChangeLanguagePrefered}
                              size="medium"
                              className="w-full mb-5"
                              displayEmpty
                              required
                            >
                              <MenuItem value="" disabled>
                                Preferred language
                              </MenuItem>
                              <MenuItem value={"Arabic"}>Arabic</MenuItem>
                              <MenuItem value={"English"}>English</MenuItem>
                              <MenuItem value={"Farsi"}>Farsi</MenuItem>
                              <MenuItem value={"French"}>French</MenuItem>
                              <MenuItem value={"Hindi"}>Hindi</MenuItem>
                              <MenuItem value={"Russian"}>Russian</MenuItem>
                              <MenuItem value={"Spanish"}>Spanish</MenuItem>
                              <MenuItem value={"Urdu"}>Urdu</MenuItem>
                            </Select>

                            <Select
                              id="LeadSource"
                              value={LeadSource}
                              label="Source"
                              onChange={ChangeLeadSource}
                              size="medium"
                              className="w-full mb-5"
                              displayEmpty
                              required
                            >
                              <MenuItem value="" disabled>
                                Source
                              </MenuItem>
                              <MenuItem value={"Website"}>Website</MenuItem>
                              <MenuItem value={"Propety Finder"}>
                                Property Finder
                              </MenuItem>
                              <MenuItem value={"Campaign"}>Campaign</MenuItem>
                              <MenuItem value={"Personal"}>Personal</MenuItem>
                              <MenuItem value={"Cold"}>Cold</MenuItem>
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
                            </Select>
                          </Box>
                        </div>
                      </div>
                      {/* ------- */}
                    </div>
                  </div>
                  <div
                    className={`${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    } px-4 py-3 text-right sm:px-6`}
                  >
                    <Button
                      className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
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
