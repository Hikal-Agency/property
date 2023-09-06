import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import SingleLead from "../Leads/SingleLead";
import ReminderComponent from "./ReminderComponent";

const Reminder = ({ reminder, setReminder, visible, setVisible }) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
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
    console.log("i am clicked: ", event, status, meetingId);
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
          <div className="overflow-x-scroll snap-x grid grid-flow-col auto-cols-max gap-x-3 scrollbar-thin">
            {reminder?.map((meeting, index) => {
              const isLoading = loadingStates[meeting.id] || false;
              return (
                <ReminderComponent
                  reminder={meeting}
                  handleButtonClick={handleButtonClick}
                  handleClick={handleClick}
                  isLoading={isLoading}
                  fetchRminders={fetchRminders}
                />
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
