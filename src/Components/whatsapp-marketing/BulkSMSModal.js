import {
  MenuItem,
  TextField,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Button } from "@material-tailwind/react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import "react-phone-number-input/style.css";


import Loader from "../Loader";
import { useFilterContext } from "../../context/FilterContextProvider";

import { MdClear } from "react-icons/md";

const charLimitForEnglish = 160;
const charLimitForArabic = 70;

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
  const [smsTextValue, setSmsTextValue] = useState();
  const token = localStorage.getItem("auth-token");
  const {
    emailFilter,
    phoneNumberFilter,
    otpSelected,
    startDate,
    endDate,
    languageFilter,
    leadOriginSelected,

    enquiryTypeSelected,
    managerSelected,
    agentSelected,
    projectNameTyped,
  } = useFilterContext();

  const {
    currentMode,
    darkModeColors,
    User,
    BACKEND_URL,

    isArabic,
    isEnglish,
    formatNum, t
  } = useStateContext();

  const senderAddresses = ["AD-HIKAL", "AD-HIKALCRM", "AD-MARAHEB"];

  const [contactsList, setContactsList] = useState(
    rangeData?.map((contact) => contact?.leadContact?.replaceAll(" ", ""))
  );
  const [displaRange, setDispalyRange] = useState(false);

  console.log("contact list : ", contactsList);

  const handleContacts = (event) => {
    // Split the textarea value into an array by comma
    const newContactsList = event.target.value.split(",");
    // Update the contactsList state
    setContactsList(newContactsList);
  };

  let lang = "";
  lang = isArabic(smsTextValue?.trim())
    ? "Arabic"
    : isEnglish(smsTextValue?.trim())
    ? "English"
    : "";

  const getNumbers = async () => {
    setBtnLoading(true);

    let url = `${BACKEND_URL}/campaign-contact?from=${fromRange}&to=${toRange}&coldcall=${
      leadOriginSelected?.originID || 0
    }`;
    let dateRange;
    if (startDate && endDate) {
      console.log("start ,end: ", startDate, endDate);

      dateRange = [startDate, endDate].join(",");
      url += `&date_range=${dateRange}`;
    }

    if (projectNameTyped) {
      url += `&project=${projectNameTyped}`;
    }

    if (enquiryTypeSelected?.i) {
      url += `&enquiryType=${enquiryTypeSelected?.i}`;
    }

    if (managerSelected) {
      url += `&managerAssigned=${managerSelected}`;
    }

    if (agentSelected) {
      url += `&agentAssigned=${agentSelected}`;
    }

    if (otpSelected?.id) {
      url += `&otp=${otpSelected?.id}`;
    }

    if (phoneNumberFilter) {
      url += `&hasphone=${phoneNumberFilter === "with" ? 1 : 0}`;
    }

    if (emailFilter) {
      url += `&hasmail=${emailFilter === "with" ? 1 : 0}`;
    }
    if (languageFilter) {
      url += `&language=${languageFilter}`;
    }
    try {
      const range = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      // console.log("range: ", range);
      // const newContacts = range?.data?.result?.map(
      //   (contact) => contact?.leadContact
      // );
      // const updatedContactsList = [...contactsList, ...newContacts];
      // setContactsList(updatedContactsList);
      // setDispalyRange(false);

      console.log("range: ", range);

      const newContacts = range?.data?.result?.map(
        (contact) => contact?.leadContact?.replaceAll(" ", "")
      );

      // Filter out existing contacts from contactsList based on whether they exist in newContacts
      const filteredContactsList = contactsList?.filter((existingContact) => {
        // Check if the existing contact is included in the newContacts array
        return !newContacts.includes(existingContact);
      });

      const updatedContactsList = [...filteredContactsList, ...newContacts];

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
    if (smsTextValue && senderAddress) {
      console.log("sender,msg: ", smsTextValue, senderAddress);

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
            campaignName: "Campaign",
            recipients: croppedContacts,
            msg: { en: smsTextValue },
            defLang: "en",
            dr: "1",
            wapUrl: "",
            user_name: User?.userName,
            message_type: "SMS",
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

  const [Manager, setManager] = useState("");



  // eslint-disable-next-line
  const ChangeManager = (event) => {
    setManager(event.target.value);
    // setSalesPerson(SalesPersons[0]?.child ? SalesPersons[0].child : []);
  };

  console.log("manager: ", Manager);

  useEffect(() => {
    setpageloading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {pageloading ? (
        <Loader />
      ) : (
        <div className="mx-auto">
          <form

            disabled={loading ? true : false}
          >
            <div className="w-full flex items-center py-1 mb-2">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("btn_send_bulk_sms")}
              </h1>
            </div>

            <div className="px-5">
              <Box sx={darkModeColors}>
                <h4
                  className={`${
                    currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#1C1C1C]"
                  } text-center font-semibold pb-4`}
                >
                  {t("sms_recipients")}
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
                  label={t("label_recipients")}
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
                              <IconButton
                                onClick={() => setFromRange("")}
                                edge="end"
                              >
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
                          label={t("to")}
                          value={toRange}
                          type="number"
                          size="small"
                          onChange={(e) => {
                            setToRange(e.target.value);
                          }}
                          className="w-full"
                          // InputProps={{ required: true }}
                          InputProps={{
                            endAdornment: toRange ? (
                              <IconButton
                                onClick={() => setToRange("")}
                                edge="end"
                              >
                                <MdClear size={16} color={"#AAAAAA"} />
                              </IconButton>
                            ) : null,
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
                      <span>{t("add_more")}</span>
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
                        <span>{t("label_select")}</span>
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
                   {t("sms_message")}
                  </h4>

                  <div className="w-full h-full mb-4 border border-gray-200 rounded-lg bg-gray-50 ">
                  <div className="flex items-center justify-between px-3 py-2 border-b">
                            {lang && (
                              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x ">
                                <div>{lang}</div>
                                {lang && (
                                  <div className="w-[2px] h-[12px] mx-3 bg-gray-400"></div>
                                )}
                                <div
                                  className={`flex flex-wrap items-center ${
                                    smsTextValue?.trim()?.length >
                                    (lang === "English"
                                      ? charLimitForEnglish
                                      : charLimitForArabic)
                                      ? "text-primary"
                                      : ""
                                  }`}
                                >
                                  {formatNum(smsTextValue?.trim()?.length)}
                                     {lang && (
                                  <div className="w-[2px] h-[12px] mx-3 bg-gray-400"></div>
                                )}
                                  <p className="ml-2">
                                    {parseInt((smsTextValue?.trim()?.length - 1) / ((lang === "English"
                                      ? charLimitForEnglish
                                      : charLimitForArabic)) + 1
                                    )}
                                    {" "}message(s)
                                  </p>
                                </div>
                              </div>
                            )}
                            <button
                              type="button"
                              className="p-2 text-gray-500 rounded cursor-pointer sm:ml-auto hover:text-gray-900 hover:bg-gray-100"
                            >
                              <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 19 19"
                              >
                                <path
                                  stroke="currentColor"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 1h5m0 0v5m0-5-5 5M1.979 6V1H7m0 16.042H1.979V12M18 12v5.042h-5M13 12l5 5M2 1l5 5m0 6-5 5"
                                />
                              </svg>
                              <span className="sr-only">{t("full_screen")}</span>
                            </button>
                          </div>
                          <div className="px-4 h-full py-2 bg-white rounded-b-lg">
                            <textarea
                              value={smsTextValue}
                              onInput={(e) =>
                                setSmsTextValue(e.target.value?.toString())
                              }
                              
                              className="block focus:border-0 focus:outline-none w-full h-full px-0 text-gray-800 bg-white border-0 focus:ring-0 "
                              placeholder="Type the message ..."
                              required
                            ></textarea>
                          </div>
                        </div>

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
                    {t("sms_send_configs")}
                  </h4>

                  <TextField
                    id="LanguagePrefered"
                    value={senderAddress}
                    onChange={(e) => {
                      setSenderAddress(e.target.value);
                    }}
                    size="small"
                    className="w-full p-2"
                    label={t("send_from")}
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
                  disabled={
                    smsTextValue?.trim()?.length === 0 ? true : false
                    }
                  onClick={(e) => sendMsg(e)}
                >
                  {msgLoading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "white" }}
                      className="text-white"
                    />
                  ) : (
                    <span>{t("send")}</span>
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
