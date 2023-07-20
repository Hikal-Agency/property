import moment from "moment";
import React, { useEffect, useState } from "react";
import { ImClock } from "react-icons/im";
import { useStateContext } from "../../context/ContextProvider";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";
import { RiStickyNoteLine } from "react-icons/ri";
import axios from "../../axoisConfig";
import { ToastContainer, toast } from "react-toastify";
import { BsBuilding } from "react-icons/bs";
import SingleLead from "../Leads/SingleLead";

const Reminder = ({ reminder, setReminder, visible, setVisible }) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const [openleadModel, setOpenLeadModel] = useState(false);
  const [leadData, setLeadData] = useState(null);
  // const [reminder, setReminder] = useState([]);
  const token = localStorage.getItem("auth-token");
  const handleLeadModelOpen = () => setOpenLeadModel(true);
  const handleLeadModelClose = () => setOpenLeadModel(false);
  const [loadingStates, setLoadingStates] = useState({});

  const handleClick = (id) => {
    console.log("id: ", id);
    setLeadData(id);
    setOpenLeadModel(true);
  };

  const UpdateReminder = async (value, id) => {
    setbtnLoading(true);
    console.log("value :", value);
    let reminderStatus;

    if (value === 1) {
      reminderStatus = "Completed";
    } else {
      reminderStatus = "Cancelled";
    }

    const ReminderUpdate = new FormData();
    ReminderUpdate.append("reminder_status", reminderStatus);

    try {
      const reminders = await axios.post(
        `${BACKEND_URL}/reminders/${id}`,
        ReminderUpdate,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setbtnLoading(false);

      toast.success("Successfully update reminder.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      fetchRminders(token);
    } catch (error) {
      setbtnLoading(false);
      console.log("Reminder error: ", error);
      toast.error("Unable to Update Reminders.", {
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

  const handleButtonClick = async (event, status, meetingId) => {
    event.stopPropagation();
    console.log("i am clicked: ");
    // Set loading state to true for the current meeting button that is clicked
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [meetingId]: true,
    }));

    await UpdateReminder(status, meetingId);

    // After the API call is complete, set loading state to false for the current meeting button
    setLoadingStates((prevLoadingStates) => ({
      ...prevLoadingStates,
      [meetingId]: false,
    }));
  };

  const fetchRminders = async () => {
    try {
      const reminders = await axios.get(`${BACKEND_URL}/reminders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          reminder_status: "Pending",
          user_id: User?.id,
        },
      });

      if (reminders.data.reminder.data.length > 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      setReminder(reminders.data.reminder.data);

      console.log("Reminders: ", reminders.data.reminder.data);
    } catch (error) {
      console.log("Reminder error: ", error);
      toast.error("Unable to Fetch Reminders.", {
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

  useEffect(() => {
    fetchRminders();
  }, []);

  return (
    <>
      {reminder?.length > 0 && (
        <>
          <h4
            className="font-semibold pb-5"
            style={{ textTransform: "capitalize" }}
          >
            Reminders
          </h4>
          <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
            {reminder?.map((meeting, index) => {
              const isLoading = loadingStates[meeting.id] || false;
              return (
                <div
                  key={meeting.id}
                  className={`w-[350px] flex flex-col justify-between ${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } rounded-md mb-3 cursor-pointer`}
                  onClick={() => handleClick(meeting?.lead_id)}
                >
                  <div className="px-5 py-5 space-y-3">
                    <h2 className="text-main-red-color text-md font-bold">
                      {meeting?.leadName || "No Lead Name"}
                    </h2>
                    {/* <div className="flex items-center space-x-1">
                  <BsBuilding
                    className={`mr-2 ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                  />
                  <p className="text-sm mr-3">
                    {meeting?.project} {meeting?.enquiryType}{" "}
                    {meeting?.leadType} {meeting?.leadFor}
                  </p>
                </div> */}
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <ImClock
                          className={`mr-2 ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        {meeting?.reminder_date && meeting?.reminder_time ? (
                          <p className="text-sm mr-3">{`${
                            meeting?.reminder_time
                          }, ${moment(meeting?.reminder_date).format(
                            "MMMM D, Y"
                          )}`}</p>
                        ) : (
                          "No time and date."
                        )}
                      </div>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <RiStickyNoteLine
                          className={`mr-2 ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                        />
                        <p className="text-sm mr-3">
                          {meeting?.reminder_note || "No Notes"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between px-5 py-3">
                    <Tooltip title="Complete" arrow>
                      <IconButton
                        style={{ backgroundColor: "#4CAF50", color: "white" }}
                        className="rounded-full"
                        onClick={(event) =>
                          handleButtonClick(event, 0, meeting?.id)
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : (
                          <CheckIcon />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Cancel" arrow>
                      <IconButton
                        style={{ backgroundColor: "#DC2626", color: "white" }}
                        className="rounded-full"
                        onClick={(event) =>
                          handleButtonClick(event, 0, meeting?.id)
                        }
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : (
                          <CloseIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {openleadModel && (
        <SingleLead
          LeadModelOpen={openleadModel}
          setLeadModelOpen={setOpenLeadModel}
          handleLeadModelOpen={handleLeadModelOpen}
          handleLeadModelClose={handleLeadModelClose}
          LeadData={leadData}
          BACKEND_URL={BACKEND_URL}
          setLeadData={setLeadData}
        />
      )}
    </>
  );
};

export default Reminder;
