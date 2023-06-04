import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
  TextField,
  FormControl,
  IconButton,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const UpdateBookedDeal = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  BACKEND_URL,
}) => {
  const { darkModeColors, currentMode, User } = useStateContext();
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
  //eslint-disable-next-line
  const [LeadNotes, setLeadNotes] = useState("");

  //eslint-disable-next-line
  const ChangeLeadStatus = (event) => {
    setLeadStatus(event.target.value);
  };
  //eslint-disable-next-line
  const ChangeLeadSource = (event) => {
    setLeadSource(event.target.value);
  };
  const ChangeFeedback = (event) => {
    setFeedback(event.target.value);
  };

  //eslint-disable-next-line
  const ChangeManager = (event) => {
    setManager(event.target.value);
    const SalesPersons = Manager2.filter(function (el) {
      return el.uid === event.target.value;
    });
    setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  };
  //eslint-disable-next-line
  const ChangeSalesPerson = (event) => {
    setSalesPerson2(event.target.value);
  };

  const ChangeLanguagePrefered = (e) => {
    setLanguagePrefered(e.target.value);
  };

  const ChangeEnquiryType = (e) => {
    setEnquiryType(e.target.value);
  };

  const ChangePropertyType = (e) => {
    setPropertyType(e.target.value);
  };

  const ChangeForType = (e) => {
    setForType(e.target.value);
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
        setLeadSource(result?.data?.data?.leadSource);
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
    UpdateLeadData.append("feedback", Feedback);
    UpdateLeadData.append("leadStatus", LeadStatus);
    // UpdateLeadData.append("leadSource", LeadSource);
    // UpdateLeadData.append("notes", LeadNotes);
    // UpdateLeadData.append("assignedToManager", Manager);
    // UpdateLeadData.append("assignedToSales", SalesPerson2);
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
          className={`  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-7 rounded-md`}
        >
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
                Update booked deal details
              </h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  UpdateLeadFunc();
                }}
              >
                <div className="mb-5 grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1">
                  {/* <div>
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
                        value={LeadName || ""}
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
                        value={LeadContact || ""}
                        onChange={(e) => setLeadContact(e.target.value)}
                      />

                      <TextField
                        id="LeadEmail"
                        type={"email"}
                        label="Email address"
                        className="w-full mb-5"
                        style={{ marginBottom: "20px" }}
                        variant="outlined"
                        size="medium"
                        required
                        value={LeadEmail || ""}
                        onChange={(e) => setLeadEmail(e.target.value)}
                      />

                      <FormControl fullWidth variant="outlined" size="medium">
                        <InputLabel id="">Preferred language</InputLabel>
                        <Select
                          id="LanguagePrefered"
                          value={LanguagePrefered}
                          label="Prefered language"
                          onChange={ChangeLanguagePrefered}
                          className="w-full mb-5"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            ---NONE---
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
                      </FormControl>
                    </Box>
                  </div> */}

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

                      <FormControl fullWidth variant="outlined" size="medium">
                        <InputLabel id="">Enquiry for</InputLabel>
                        <Select
                          id="enquiry"
                          value={EnquiryType}
                          label="Enquiry Type"
                          onChange={ChangeEnquiryType}
                          className="w-full mb-5"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            ---NONE---
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
                      </FormControl>

                      <FormControl fullWidth variant="outlined" size="medium">
                        <InputLabel id="">Property type</InputLabel>
                        <Select
                          id="property-type"
                          value={PropertyType}
                          label="Property type"
                          onChange={ChangePropertyType}
                          className="w-full mb-5"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            ---NONE---
                          </MenuItem>
                          <MenuItem value={"Apartment"}>Apartment</MenuItem>
                          <MenuItem value={"Villa"}>Villa</MenuItem>
                          <MenuItem value={"Commercial"}>Commercial</MenuItem>
                          <MenuItem value={"Townhouse"}>Townhouse</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth variant="outlined" size="medium">
                        <InputLabel id="">Purpose of enquiry</InputLabel>
                        <Select
                          id="for"
                          value={ForType}
                          label="Purpose of enquiry"
                          onChange={ChangeForType}
                          className="w-full mb-5"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            ---NONE---
                          </MenuItem>
                          <MenuItem value={"Investment"}>Investment</MenuItem>
                          <MenuItem value={"End-user"}>End-User</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div>

                  {/* <div>
                    <Box sx={darkModeColors}>
                      <h4
                        className={`${
                          currentMode === "dark"
                            ? "text-red-600"
                            : "text-red-600"
                        } text-center font-bold pb-5`}
                      >
                        Status
                      </h4>

                      <FormControl fullWidth variant="outlined" size="medium">
                        <InputLabel id="">Feedback</InputLabel>
                        <Select
                          id="for"
                          value={Feedback}
                          label="Feedback"
                          onChange={ChangeFeedback}
                          className="w-full mb-5"
                          displayEmpty
                          required
                        >
                          <MenuItem value="" disabled>
                            ---NONE---
                          </MenuItem>
                          <MenuItem value={"Closed Deal"}>Closed Deal</MenuItem>
                          <MenuItem value={"Booked"}>Booked</MenuItem>
                          <MenuItem value={"Cancelled"}>Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </div> */}
                </div>

                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                  ripple={true}
                  size="sm"
                  type="submit"
                  disabled={btnloading ? true : false}
                >
                  {btnloading ? (
                    <div className="flex items-center justify-center space-x-1">
                      <CircularProgress size={18} sx={{ color: "white" }} />
                    </div>
                  ) : (
                    <span>Update Lead</span>
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

export default UpdateBookedDeal;
