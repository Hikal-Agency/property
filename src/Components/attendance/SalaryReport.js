import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Tooltip,
  Drawer,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { datetimeLong } from "../_elements/formatDateTime";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";
import AddNewListingModal from "../Listings/AddNewListingModal";

import { VscCallOutgoing, VscMail, VscEdit } from "react-icons/vsc";
import { IoIosAlert } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { BiBlock, BiBed } from "react-icons/bi";
import {
  BsShuffle,
  BsTelephone,
  BsEnvelopeAt,
  BsType,
  BsHouseGear,
  BsBuildings,
  BsTrash,
  BsBuildingGear,
  BsPersonPlus,
  BsBookmarkFill,
  BsPersonGear,
  BsChatLeftText,
} from "react-icons/bs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const SalaryReport = ({
  reportModal,
  setReportModal,
  LeadModelOpen,
  handleLeadModelClose,
  LeadData,
  setLeadData,
  handleUpdateLeadModelOpen,
  FetchLeads,
  setDeleteModelOpen,
  setBulkDeleteClicked,
  setLeadToDelete,
  isBookedDeal,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
  } = useStateContext();
  const token = localStorage.getItem("auth-token");

  const { hasPermission } = usePermission();
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [reportDetails, setReportDetails] = useState([]);
  const [singleLeadData, setsingleLeadData] = useState({});
  const [open, setOpen] = useState(false);
  const [requestBtnLoading, setRequestBtnLoading] = useState(false);

  const [addNoteloading, setaddNoteloading] = useState(false);
  const [lastNote, setLastNote] = useState("");
  const [lastNoteDate, setLastNoteDate] = useState("");
  const [lastNoteAddedBy, setLastNoteAddedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportMonth, setReportMonth] = useState({
    month: null,
    year: null,
  });
  const [reportMonthValue, setReportMonthValue] = useState("");
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [blockIPModalOpened, setBlockIPModalOpened] = useState({
    lead: null,
    isOpened: false,
  });
  const handleCloseListingModal = () => setListingModalOpen(false);

  console.log("report month:: ", reportMonth);

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setReportModal(false);
    }, 1000);
  };

  const fetchSalaryCalc = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `https://reports.hikalcrm.com/api/calculate_salary`,
        { month: reportMonth.month, year: reportMonth.year, agency: 1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Report will be downloaded in a while.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      console.log("salary Calc: ", response);

      let rowsDataArray = response?.data?.data;

      let rowsdata = rowsDataArray?.map((row, index) => ({
        id: row?.id,
        deducted_salary: row?.deducted_salary || "-",
        late_day_salary: row?.late_day_salary || "-",
        late_days: row?.late_days || "-",
        leave_day_salary: row?.leave_day_salary || "-",
        leave_days: row?.leave_days || "-",
        net_salary: row?.net_salary || "-",
        present_days: row?.present_days || "-",
        salary: row?.salary || "-",
        salary_per_day: row?.salary_per_day || "-",
        user_id: row?.user_id || "-",
        user_name: row?.user_name || "-",
        weekends: row?.weekends || "-",
      }));

      setReportDetails(rowsdata);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Unable to download report.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const FetchLead = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(`${BACKEND_URL}/leads/${LeadData}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("leads: ", result);

      setLeadData(result?.data?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const AddNote = (note = "") => {
    setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");

    const data = {
      leadId: LeadData.leadId || LeadData.id,
      leadNote: note || AddNoteTxt,
      addedBy: User?.id,
      addedByName: User?.userName,
    };
    axios
      .post(`${BACKEND_URL}/leadNotes`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setaddNoteloading(false);
        setAddNoteTxt("");
        if (!note) {
          toast.success("Note added Successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      })
      .catch((err) => {
        setaddNoteloading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
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

  const fetchLastNote = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const result = await axios.get(
        `${BACKEND_URL}/lastnote/${LeadData?.leadId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const lastNoteText = result.data?.notes?.data[0]?.leadNote;
      const lastNoteDate = result.data?.notes?.data[0]?.creationDate;
      const lastNoteAddedBy = result.data?.notes?.data[0]?.addedByName;
      setLastNote(lastNoteText);
      setLastNoteDate(lastNoteDate);
      setLastNoteAddedBy(lastNoteAddedBy);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (LeadData?.leadId) {
      fetchLastNote();
    }

    console.log("leaddata: ", LeadData);

    if (typeof LeadData === "number") {
      FetchLead(LeadData);
    }

    console.log("LeadData::", LeadData);
  }, [LeadData]);

  // Replace last 4 digits with "*"
  const stearics =
    LeadData?.leadContact
      ?.replaceAll(" ", "")
      ?.slice(0, LeadData?.leadContact?.replaceAll(" ", "")?.length - 4) +
    "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = LeadData?.leadContact?.replaceAll(" ", "");
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = LeadData?.leadContact?.replaceAll(" ", "");
  }

  const EmailButton = ({ email }) => {
    // console.log("email:::::::::::::::::::: ", email);
    const handleEmailClick = (event) => {
      event.stopPropagation();
      window.location.href = `mailto:${email}`;
    };

    return (
      <button className="email-button" onClick={handleEmailClick}>
        <VscMail size={16} />
      </button>
    );
  };

  const CallButton = ({ phone }) => {
    const handlePhoneClick = (event) => {
      event.stopPropagation();
      window.location.href = `tel:${phone}`;
    };

    return (
      <button className="call-button" onClick={handlePhoneClick}>
        <VscCallOutgoing size={16} />
      </button>
    );
  };

  useEffect(() => {
    // Open the modal after a short delay to allow the animation to work
    const timeout = setTimeout(() => {
      setOpen(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={reportModal}
        // onClose={handleLeadModelClose}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        openAfterTransition
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
        }}
      >
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
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {loading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="w-full flex items-center pb-3 ">
                    <div
                      className={`${
                        isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                      } bg-primary h-10 w-1 rounded-full my-1`}
                    ></div>
                    <h1
                      className={`text-lg font-semibold ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      }`}
                    >
                      {t("generate_report")}
                    </h1>
                  </div>

                  <div className="w-full flex justify-end items-center">
                    <Box sx={{ ...darkModeColors, marginRight: "12px" }}>
                      {/* <Select
                        id="monthSelect"
                        size="small"
                        className="w-[100px]"
                        displayEmpty
                        //   value={selectedDay || "Today"}
                        //   onChange={handleDayFilter}
                      >
                       
                        <MenuItem selected value="today">
                          {t("today")}
                        </MenuItem>
                        <MenuItem value="yesterday">{t("yesterday")}</MenuItem>
                      </Select> */}
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={reportMonthValue}
                          label={t("report_month")}
                          views={["month", "year"]}
                          onChange={(newValue) => {
                            if (newValue) {
                              // Extract the month digit
                              const monthDigit = moment(newValue.$d).format(
                                "M"
                              );

                              // Convert the month digit string to an integer
                              const monthDigitInt = parseInt(monthDigit, 10);
                              console.log(
                                "month digit int :: ",
                                typeof monthDigitInt
                              );

                              // Extract the year
                              const year = moment(newValue.$d).format("YYYY");

                              // Set the report month digit as an integer and the year
                              setReportMonth({
                                month: monthDigitInt,
                                year: parseInt(year, 10),
                              });
                            }

                            setReportMonthValue(newValue?.$d);
                          }}
                          format="MM-YYYY"
                          renderInput={(params) => (
                            <TextField
                              sx={{
                                "& input": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                                "& .MuiSvgIcon-root": {
                                  color:
                                    currentMode === "dark" ? "white" : "black",
                                },
                              }}
                              fullWidth
                              size="small"
                              {...params}
                              onKeyDown={(e) => e.preventDefault()}
                              readOnly={true}
                            />
                          )}
                          maxDate={dayjs().startOf("day").toDate()}
                        />
                      </LocalizationProvider>
                    </Box>

                    <button
                      className="bg-primary text-white rounded-md card-hover p-2 shadow-sm"
                      onClick={fetchSalaryCalc}
                    >
                      {t("generate_report_btn")?.toUpperCase()}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-5 p-5">
                  {/* USER DETAILS  */}
                  <div
                    className={`p-4 rounded-xl shadow-sm card-hover
                    ${
                      currentMode === "dark"
                        ? "bg-[#1C1C1C] text-white"
                        : "bg-[#EEEEEE] text-black"
                    }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("user_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsTelephone size={16} className="text-primary" />
                        <div className="col-span-7">{contact}</div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsEnvelopeAt size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.leadEmail === "" ||
                          LeadData?.leadEmail === "null" ||
                          LeadData?.leadEmail === "undefined" ||
                          LeadData?.leadEmail === "-" ||
                          LeadData?.leadEmail === null ||
                          LeadData?.leadEmail === undefined
                            ? "-"
                            : LeadData?.leadEmail}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsType size={16} className="text-primary" />
                        <div className="col-span-7">{LeadData?.language}</div>
                      </div>
                    </div>
                  </div>

                  {/* PROJECT DETAILS  */}
                  <div
                    className={`p-4 rounded-xl shadow-sm card-hover
                    ${
                      currentMode === "dark"
                        ? "bg-[#1C1C1C] text-white"
                        : "bg-[#EEEEEE] text-black"
                    }`}
                  >
                    <h1 className="text-center uppercase font-semibold">
                      {t("enquiry_details")?.toUpperCase()}
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsBuildings size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.project === "null"
                            ? "-"
                            : LeadData?.project}{" "}
                          {LeadData?.leadType === "null"
                            ? "-"
                            : LeadData?.leadType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BiBed size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.enquiryType === "null"
                            ? "-"
                            : LeadData?.enquiryType}
                        </div>
                      </div>
                      <div class="grid grid-cols-8 gap-3 my-4 lg:px-5">
                        <BsHouseGear size={16} className="text-primary" />
                        <div className="col-span-7">
                          {LeadData?.leadFor === "null"
                            ? "-"
                            : `${LeadData?.leadFor}`}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS  */}
                  <div
                    className={`sm:col-span-1 md:col-span-2 p-4 rounded-xl shadow-sm card-hover text-center
                    ${
                      currentMode === "dark"
                        ? "bg-[#1C1C1C] text-white"
                        : "bg-[#EEEEEE] text-black"
                    }`}
                  >
                    <h1 className="text-center uppercase flex items-center justify-center">
                      <BsBookmarkFill size={16} className="mx-2 text-primary" />
                      {t("label_feedback")?.toUpperCase()}
                      <span className="mx-2 font-semibold">
                        {t(
                          "feedback_" +
                            LeadData?.feedback
                              ?.toLowerCase()
                              ?.replaceAll(" ", "_")
                        ) ?? "---"}
                      </span>
                    </h1>
                    <hr className="my-4" />
                    <div className="w-full">
                      {LeadData?.notes === null ||
                      LeadData?.notes === "" ||
                      LeadData?.notes === "null" ||
                      LeadData?.notes === "-" ? (
                        <></>
                      ) : (
                        <div class="flex items-center gap-5 my-4 md:px-5">
                          <BsChatLeftText
                            size={16}
                            className="text-primary mx-2"
                          />
                          <div
                            className="text-start"
                            style={{
                              fontFamily: isArabic(LeadData?.notes)
                                ? "Noto Kufi Arabic"
                                : "inherit",
                            }}
                          >
                            {LeadData?.notes}
                          </div>
                        </div>
                      )}
                      <div class="flex items-center gap-5 my-4 md:px-5">
                        <BsPersonPlus size={16} className="text-primary mx-2" />
                        <div className="">
                          {t("lead_added_on")}{" "}
                          {datetimeLong(LeadData?.creationDate)}
                        </div>
                      </div>
                      <div class="flex items-center gap-5 my-4 md:px-5">
                        <BsPersonGear size={16} className="text-primary mx-2" />
                        <div className="">
                          {t("last_updated_on")}{" "}
                          {LeadData?.lastEdited === ""
                            ? "-"
                            : datetimeLong(LeadData?.lastEdited)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="p-5">
                  <div className="bg-primary h-0.5 w-full my-1"></div>
                </div> */}

                {/* LAST NOTE  */}
                <div className="p-5">
                  <div
                    className={`w-full text-center
                      ${currentMode === "dark" ? "text-white" : "text-black"}`}
                  >
                    <div className="w-full my-4">
                      {lastNote ? (
                        <div
                          className={`${
                            currentMode === "dark"
                              ? "text-white bg-black border-gray-800"
                              : "text-black bg-[#EEEEEE] border-gray-300"
                          } border-2 flex items-center my-2 gap-5 w-full rounded-xl shadow-sm`}
                        >
                          <div className="p-3 text-center text-sm">
                            <div className="mb-1">{lastNoteAddedBy}</div>
                            <div className="mt-1 text-[#AAAAAA]">
                              {lastNoteDate}
                            </div>
                          </div>
                          <div className="bg-primary h-10 w-0.5"></div>
                          <div className="p-3 flex-grow text-start">
                            <p
                              style={{
                                fontFamily: isArabic(lastNote)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {lastNote}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="italic text-xs text-primary text-center">
                          {t("no_notes_available")}
                        </div>
                      )}
                    </div>
                    <div className="my-4 w-full">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          AddNote();
                        }}
                      >
                        <TextField
                          sx={{
                            ...darkModeColors,
                            "& input": {
                              fontFamily: "Noto Kufi Arabic",
                            },
                          }}
                          id="note"
                          type={"text"}
                          label={t("label_note")}
                          className="w-full"
                          variant="outlined"
                          size="small"
                          multiline
                          minRows={2}
                          required
                          value={AddNoteTxt}
                          onChange={(e) => setAddNoteTxt(e.target.value)}
                        />

                        <button
                          disabled={addNoteloading ? true : false}
                          type="submit"
                          className="mt-4 disabled:opacity-50 disabled:cursor-not-allowed bg-btn-primary group relative flex w-full justify-center rounded-xl shadow-sm border border-transparent p-1 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 text-md font-bold uppercase"
                        >
                          {addNoteloading ? (
                            <CircularProgress
                              sx={{ color: "white" }}
                              size={25}
                              className="text-white"
                            />
                          ) : (
                            <span>{t("add_new_note")?.toUpperCase()}</span>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SalaryReport;
