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

import axios from "../../axoisConfig";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { MdClose } from "react-icons/md";

const UpdateBookedDeal = ({
  LeadModelOpen,
  setLeadModelOpe,
  handleLeadModelOpen,
  handleLeadModelClose,
  LeadData,
  BACKEND_URL,
  FetchLeads,
}) => {
  const { darkModeColors, currentMode, User, t, isLangRTL, i18n } =
    useStateContext();
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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleLeadModelClose();
    }, 1000);
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
    UpdateLeadData.append("leadName", LeadName);
    UpdateLeadData.append("leadContact", LeadContact?.replaceAll(" ", ""));
    UpdateLeadData.append("leadEmail", LeadEmail);
    UpdateLeadData.append("enquiryType", EnquiryType);
    UpdateLeadData.append("leadType", PropertyType);
    UpdateLeadData.append("project", LeadProject);
    UpdateLeadData.append("booked_amount", booked_amount);
    UpdateLeadData.append("leadFor", ForType);
    UpdateLeadData.append("language", LanguagePrefered);
    UpdateLeadData.append("feedback", Feedback);
    UpdateLeadData.append("leadStatus", LeadStatus);
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
            } ${isLangRTL(i18n.language) ? "border-r-2" : "border-l-2"}
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
          >
            {/* <IconButton
              sx={{
                position: "absolute",
                right: 12,
                top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={handleClose}
            >
              <IoMdClose size={18} />
            </IconButton> */}
            {loading ? (
              <div className="">
                <CircularProgress size={20} />
                <span
                  className={`font-semibold text-lg ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  {" "}
                  Fetching Your Lead
                </span>
              </div>
            ) : (
              <>
                <div className="w-full flex items-center pb-3">
                  <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                  <h1
                    className={`text-lg font-semibold ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    Update Booked Deal Details
                  </h1>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateLeadFunc();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 sm:grid-cols-1 px-4 pt-4">
                    <div>
                      <Box sx={darkModeColors}>
                        <TextField
                          id="Project"
                          type={"number"}
                          label="Booked Amount"
                          className="w-full"
                          variant="outlined"
                          size="small"
                          value={booked_amount}
                          sx={{
                            marginBottom: "1.35rem !important",
                          }}
                          onChange={(e) => setBookedAmount(e.target.value)}
                        />

                        <TextField
                          id="Project"
                          type={"text"}
                          label="Project name"
                          className="w-full"
                          variant="outlined"
                          size="small"
                          value={LeadProject}
                          sx={{
                            marginBottom: "1.35rem !important",
                          }}
                          onChange={(e) => setLeadProject(e.target.value)}
                        />

                        <FormControl fullWidth variant="outlined" size="medium">
                          <InputLabel id="">Enquiry for</InputLabel>
                          <Select
                            id="enquiry"
                            value={EnquiryType}
                            label="Enquiry for"
                            onChange={ChangeEnquiryType}
                            className="w-full"
                            sx={{
                              marginBottom: "1.35rem !important",
                            }}
                            displayEmpty
                            required
                            size="small"
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
                            className="w-full"
                            displayEmpty
                            required
                            size="small"
                            sx={{
                              marginBottom: "1.35rem !important",
                            }}
                          >
                            <MenuItem value="" disabled>
                              ---NONE---
                            </MenuItem>
                            <MenuItem value={"Apartment"}>Apartment</MenuItem>
                            <MenuItem value={"Villa"}>Villa</MenuItem>
                            <MenuItem value={"penthouse"}>Penthouse</MenuItem>
                            <MenuItem value={"mansion"}>Mansion</MenuItem>
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
                            className="w-full"
                            displayEmpty
                            required
                            size="small"
                            sx={{
                              marginBottom: "1.35rem !important",
                            }}
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
                    className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
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
                      <span>Update Lead</span>
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

export default UpdateBookedDeal;
