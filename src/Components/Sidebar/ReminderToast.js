import {MdOutlineAssignmentTurnedIn} from "react-icons/md";
import { MdAccessAlarms } from "react-icons/md";

const ReminderToast = ({type, leadName = "", reminderTime = ""}) => {
  return (
    <div className="flex flex-col items-center rounded py-7 px-4">
      <div class="reminder-container self-start">
        <div class="reminder-line line-1"></div>
        <div class="reminder-line line-2"></div>
        <div class="reminder-line line-3"></div>
        <div class="reminder-line line-4"></div>
    </div>
      <div className="p-4 mb-4 bg-[#ecbf3f] flex items-center justify-center">
      {type === "reminder" ? 
            <MdAccessAlarms className="bell-ring" style={{color: "white"}} size={28} />
       : (type === "lead_assigned" ? <MdOutlineAssignmentTurnedIn style={{color: "white"}} size={28}/> : <></>)}
      </div>
      {type === "reminder" ? 
      <p className="text-center mb-4">
        A friendly reminder that you scheduled follow up with <strong>{leadName}</strong> is just 5 minutes away. Get ready to make the most of your conversation!
      </p> : (type === "lead_assigned" ? <p>Lead `{leadName}` is assigned to you!</p> : <></>)
      }

      {type === "reminder" ? 
      <div className="flex items-center self-end text-right justify-end text-gray-400">
            <small>Reminder</small>
            <span className="px-2">•</span>
            <small> {reminderTime}</small>
      </div>
      : (type === "lead_assigned" ? <div className="flex items-center self-end text-right justify-end text-gray-400">
            <small>Lead Assignment</small>
      </div> : <></>) }
    </div>
  );
};

export default ReminderToast;
