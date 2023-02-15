import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const UpdateLead = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
}) => {
  // eslint-disable-next-line
  const { darkModeColors, currentMode, User, BACKEND_URL } = useStateContext();
  const [loading, setloading] = useState(true);
  const [btnloading, setbtnloading] = useState(false);
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
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === event.target.value;
    });
    setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  };
  const ChangeSalesPerson = (event) => {
    setSalesPerson2(event.target.value);
  };
  useEffect(() => {
    console.log("lead data is ");
    console.log(LeadData);
    const token = localStorage.getItem("auth-token");

    axios
      .get(`https://staging.hikalcrm.com/api/teamMembers/160`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        // console.log(result);
        setManager2(result.data.team);
      })
      .catch((err) => {
        console.log(err);
      });

    // GETTING LEAD DETAILS
    axios
      .get(`${BACKEND_URL}/leads/${LeadData.lid}`, {
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
    UpdateLeadData.append("lid", LeadData.lid);
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
      UpdateLeadData.append("assignedToManager", Manager);
      UpdateLeadData.append("assignedToSales", SalesPerson2);
    }
    UpdateLeadData.append(
      "lastEdited",
      moment(creationDate).format("YYYY/MM/DD HH:mm:ss")
    );

    await axios
      .post(`${BACKEND_URL}/leads/${LeadData.lid}`, UpdateLeadData, {
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
          className={`w-[calc(100%-20px)] md:w-[85%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          {loading ? (
            <div className="w-full flex items-center justify-center space-x-1">
              <CircularProgress size={20} />
              <span className="font-semibold text-lg"> Fetching Your Lead</span>
            </div>
          ) : (
            <>
              <h1
                className={`${
                  currentMode === "dark" ? "text-white" : "text-black"
                } text-center font-bold text-xl pb-10`}
              >
                Update lead details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  UpdateLeadFunc();
                }}
              >
                <div className="grid grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
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
                          value={Manager}
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
                              {person?.loginId}
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
                              {person?.loginId}
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
                        <MenuItem value={"2 Bedrooms"}>2 Bedrooms</MenuItem>
                        <MenuItem value={"3 Bedrooms"}>3 Bedrooms</MenuItem>
                        <MenuItem value={"4 Bedrooms"}>4 Bedrooms</MenuItem>
                        <MenuItem value={"5 Bedrooms"}>5 Bedrooms</MenuItem>
                        <MenuItem value={"6 Bedrooms"}>6 Bedrooms</MenuItem>
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
                        <MenuItem value={"Apartment"}>Appartment</MenuItem>
                        <MenuItem value={"Villa"}>Villa</MenuItem>
                        <MenuItem value={"Commercial"}>Commercial</MenuItem>
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
                          For
                        </MenuItem>
                        <MenuItem value={"Investment"}>Investment</MenuItem>
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
                        onChange={(e) => setLeadContact(e.target.value)}
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
                        label="Prefered language"
                        onChange={ChangeLanguagePrefered}
                        size="medium"
                        className="w-full mb-5"
                        displayEmpty
                        required
                      >
                        <MenuItem value="" disabled>
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
                      </Select>
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
                    <div className="flex items-center justify-center space-x-1">
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
