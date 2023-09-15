import {
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  IconButton,
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

import {
  MdClear
} from "react-icons/md";

const BulkSMSModal = ({
  FetchLeads,
  fromRange,
  toRange,
  rangeData,
  setToRange,
  setFromRange,
  setRangeData,
  sendSMSModal,
  setSendSMSModal,
}) => {
  const [loading, setloading] = useState(false);
  const [btnloading, setBtnLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [senderAddress, setSenderAddress] = useState("");

  const [pageloading, setpageloading] = useState(true);
  const [msg, setMsg] = useState();
  const token = localStorage.getItem("auth-token");

  const handleMsg = (e) => {
    setMsg(e.target.value);
  };

  const { hasPermission } = usePermission();
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
  console.log("MAnagers: ", Managers);
  console.log("Range Data : ", rangeData);
  const senderAddresses = ["AD-HIKAL", "AD-HIKALCRM"];

  const [contactsList, setContactsList] = useState(
    rangeData?.map((contact) => contact?.leadContact)
  );
  const [displaRange, setDispalyRange] = useState(false);

  console.log("contact list : ", contactsList);

  const handleContacts = (event) => {
    // Split the textarea value into an array by comma
    const newContactsList = event.target.value.split(",");
    // Update the contactsList state
    setContactsList(newContactsList);
  };

  const getNumbers = async () => {
    setBtnLoading(true);
    try {
      const range = await axios.get(
        `${BACKEND_URL}/campaign-contact?from=${fromRange}&to=${toRange}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("range: ", range);
      const newContacts = range?.data?.result?.map(
        (contact) => contact?.leadContact
      );

      // Use reduce to update the contactsList
      const updatedContactsList = newContacts.reduce(
        (acc, newContact) => {
          const existingIndex = acc.findIndex(
            (contact) => contact === newContact
          );

          if (existingIndex !== -1) {
            // If the value already exists, override it
            acc[existingIndex] = newContact;
          } else {
            // If the value doesn't exist, append it
            acc.push(newContact);
          }

          return acc;
        },
        [...contactsList]
      );

      setContactsList(updatedContactsList);
      setDispalyRange(false);

      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      toast.error("Unable to fetch data.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("error: ", error);
    }
  };

  const sendMsg = async (e, messageText, contactList) => {
    e.preventDefault();
    setMsgLoading(true);
    if (msg && senderAddress) {
      console.log("sender,msg: ", msg, senderAddress);

      try {
        const croppedContacts = contactsList?.map((contact) => {
          if (contact) {
            // Remove plus sign and replace empty spaces with no spaces
            return contact.replace("+", "").replace(/\s/g, "");
          } else {
            return contact;
          }
        });

        console.log("cropped: ", croppedContacts);

        const etisalatToken = process.env.REACT_APP_ETISALAT_TOKEN;

        const sendMsg = await axios.post(
          `${BACKEND_URL}/sendsms`,
          JSON.stringify({
            msgCategory: "4.6",
            contentType: "3.1",
            senderAddr: senderAddress,
            dndCategory: "campaign",
            priority: 1,
            clientTxnId: "",
            desc: "Hikal CRM Single Message to Multiple Recipients",
            campaignName: "test",
            recipients: croppedContacts,
            msg: { en: msg },
            defLang: "en",
            dr: "1",
            wapUrl: "",
          }),
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );

        console.log("msg sent : ", sendMsg);

        // const allSentMessages = [];
        // responses.forEach((response, index) => {
        //   if (!response?.error) {
        //     const messageInfo = {
        //       msg_to: contactList[index],
        //       msg_from: "+15855013080",
        //       message: messageText,
        //       type: "sent",
        //       userID: User?.id,
        //       source: "sms",
        //       status: 1,
        //     };
        //     allSentMessages.push(messageInfo);
        //   }
        // });

        // saveMessages(allSentMessages);

        setSendSMSModal(false);
        toast.success("Messages Sent", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setMsgLoading(false);
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.error, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setMsgLoading(false);
      }
    } else {
      setMsgLoading(false);

      toast.error("All fields are required", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

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
            // onSubmit={(e) => {
            //   e.preventDefault();
            //   AddLead();
            // }}
            disabled={loading ? true : false}
          >
            <div className="w-full flex items-center py-1 mb-2">
              <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div>
              <h1
                className={`text-lg font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                Send Bullk SMS
              </h1>
            </div>

            <div className="px-5">
              <Box sx={darkModeColors}>
                <h4
                  className={`${
                    currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#1C1C1C]"
                  } text-center font-semibold pb-4`}
                >
                  SMS Recipients
                </h4>

                <TextField
                  id="Manager"
                  // sx={{
                  //   "&": {
                  //     marginBottom: "1.25rem !important",
                  //   },
                  // }}
                  placeholder="Recipients"
                  multiline
                  minRows={2}
                  label="Recipients"
                  value={contactsList?.join(",")}
                  onChange={handleContacts}
                  size="small"
                  className="w-full p-2"
                  displayEmpty
                />
              </Box>

              {displaRange && (
                <>
                  <div className="grid grid-cols-2 my-5">
                    {/* From */}
                    <div
                      className="pr-2"
                      style={{ width: "100%", position: "relative" }}
                    >
                      {/* <label
                        style={{
                          position: "absolute",
                          bottom: "-16px",
                          right: 0,
                        }}
                        className={`flex justify-end items-center ${
                          currentMode === "dark" ? "text-white" : "text-dark"
                        } `}
                      >
                        {fromRange ? (
                          <strong
                            className="mr-4 text-red-600 cursor-pointer"
                            onClick={() => setFromRange("")}
                          >
                            Clear
                          </strong>
                        ) : (
                          ""
                        )}
                      </label> */}
                      <Box sx={darkModeColors}>
                        <TextField
                          label="From"
                          type="number"
                          size="small"
                          value={fromRange}
                          className="w-full"
                          onChange={(e) => {
                            setFromRange(e.target.value);
                          }}
                          // InputProps={{ required: true }}
                          InputProps={{
                            endAdornment: fromRange ? (
                              <IconButton onClick={() => setFromRange("")} edge="end">
                                <MdClear size={16} color={"#AAAAAA"} />
                              </IconButton>
                            ) : null,
                          }}
                        />
                      </Box>
                    </div>

                    {/* To */}
                    <div
                      className="pl-2"
                      style={{ width: "100%", position: "relative" }}
                    >
                      {/* <label
                        style={{
                          position: "absolute",
                          bottom: "-16px",
                          right: 0,
                        }}
                        className={`flex justify-end items-center ${
                          currentMode === "dark" ? "text-white" : "text-dark"
                        } `}
                      >
                        {toRange ? (
                          <strong
                            className="ml-4 text-red-600 cursor-pointer"
                            onClick={() => setToRange("")}
                          >
                            Clear
                          </strong>
                        ) : (
                          ""
                        )}
                      </label> */}
                      <Box sx={darkModeColors}>
                        <TextField
                          label="To"
                          value={toRange}
                          type="number"
                          size="small"
                          onChange={(e) => {
                            setToRange(e.target.value);
                          }}
                          className="w-full"
                          // InputProps={{ required: true }}
                          InputProps={{
                            endAdornment: (
                              <IconButton onClick={() => setToRange("")} edge="end">
                                <MdClear size={16} color={"#AAAAAA"} />
                              </IconButton>
                            
                            ),
                          }}
                        />
                      </Box>
                    </div>
                  </div>
                </>
              )}

              {!displaRange ? (
                <div
                  className={`${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } py-2 text-center`}
                >
                  <Button
                    className={`w-full mt-1 mb-3 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color`}
                    ripple={true}
                    size="lg"
                    type="submit"
                    disabled={loading ? true : false}
                    onClick={(e) => {
                      e.preventDefault();
                      setDispalyRange(true);
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        size={20}
                        sx={{ color: "white" }}
                        className="text-white"
                      />
                    ) : (
                      <span>Add More</span>
                    )}
                  </Button>
                </div>
              ) : (
                fromRange &&
                toRange && (
                  <div
                    className={`${
                      currentMode === "dark" ? "bg-black" : "bg-white"
                    } py-2 text-center`}
                  >
                    <Button
                      className={`w-full mb-5 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                      ripple={true}
                      size="lg"
                      type="submit"
                      disabled={loading ? true : false}
                      onClick={(e) => {
                        e.preventDefault();
                        getNumbers();
                      }}
                    >
                      {btnloading ? (
                        <CircularProgress
                          size={20}
                          sx={{ color: "white" }}
                          className="text-white"
                        />
                      ) : (
                        <span>Select</span>
                      )}
                    </Button>
                  </div>
                )
              )}

              <div className="my-3">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark"
                        ? "text-[#EEEEEE]"
                        : "text-[#1C1C1C]"
                    } text-center font-semibold pb-4`}
                  >
                    SMS Message
                  </h4>

                  <TextField
                    id="Manager"
                    label="Message"
                    size="small"
                    // sx={{
                    //   "&": {
                    //     marginBottom: "1.25rem !important",
                    //   },
                    // }}
                    placeholder="Enter message here ....."
                    minRows={3}
                    value={msg}
                    onChange={handleMsg}
                    className="w-full p-2"
                    displayEmpty
                    multiline
                  />

                  {/* <label
                    className={`flex my-3 mt-4  ${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    } `}
                  >
                    <strong className=" ">
                      Number of Characters:{" "}
                      <span className="text-red">{msg?.length || 0}</span>
                    </strong>
                  </label> */}
                </Box>
              </div>

              <div className="mt-6 mb-3">
                <Box sx={darkModeColors}>
                  <h4
                    className={`${
                      currentMode === "dark"
                        ? "text-[#EEEEEE]"
                        : "text-[#1C1C1C]"
                    } text-center font-semibold pb-4`}
                  >
                    SMS Send Configurations
                  </h4>

                  <TextField
                    id="LanguagePrefered"
                    value={senderAddress}
                    onChange={(e) => {
                      setSenderAddress(e.target.value);
                    }}
                    size="small"
                    className="w-full p-2"
                    label="Send From"
                    // sx={{
                    //   "&": {
                    //     marginBottom: "1.25rem !important",
                    //   },
                    // }}
                    displayEmpty
                    select
                  >
                    {senderAddresses?.map((address) => {
                      return <MenuItem value={address}>{address}</MenuItem>;
                    })}
                  </TextField>
                </Box>
              </div>

              <div className={`py-2 text-center`}>
                <Button
                  className={`w-full mb-5 text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                  ripple={true}
                  size="lg"
                  type="submit"
                  disabled={loading ? true : false}
                  onClick={(e) => sendMsg(e)}
                >
                  {msgLoading ? (
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
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default BulkSMSModal;
