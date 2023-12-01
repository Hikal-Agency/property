import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

import {
  BsPerson,
  BsTelephone,
  BsEnvelopeAt,
  BsBuilding,
  BsInfoCircle,
  BsBookmark,
  BsPhone,
  BsLink45Deg,
  BsShare
} from "react-icons/bs";

const IPLead = ({ lead }) => {
  const { currentMode, Managers, SalesPerson, User, primaryColor, t, isArabic } = useStateContext();

  const { hasPermission } = usePermission();

  // Replace last 4 digits with "*"
  const stearics =
    lead?.leadContact?.replaceAll(" ", "")?.slice(0, lead?.leadContact?.replaceAll(" ", "")?.length - 4) + "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = lead?.leadContact?.replaceAll(" ", "");
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = lead?.leadContact?.replaceAll(" ", "");
  }

  const managerName = Managers?.find(
    (manager) => manager?.id === lead?.assignedToManager
  )?.userName;

  console.log(Managers, managerName);
  const agentName = SalesPerson[`manager-${lead?.assignedToManager}`]?.find(
    (agent) => agent?.id === lead?.assignedToSales
  )?.userName;
  return (
    <div className={`${currentMode === "dark" ? "bg-[#1C1C1C] text-white" : "bg-[#EEEEEE] text-black"} rounded-xl shadow-sm p-4`}>
      <Box
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
        key={lead.id}
      >
        {/* LEAD DETAILS  */}
        <div className={`p-4 rounded-xl shadow-sm ${currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"}`}>
          <div className="text-primary text-center">Lead details</div>
          <hr className="my-3" />
          {/* LEAD NAME  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsPerson size={16} /></div>
            <div className="col-span-5" style={{ fontFamily: isArabic(lead?.leadName) ? "Noto Kufi Arabic" : "inherit"}}>
              {lead?.leadName}
            </div>
          </div>
          {/* CONTACT  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsTelephone size={16} /></div>
            <div className="col-span-5">{contact}</div>
          </div>
          {/* EMAIL  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsEnvelopeAt size={16} /></div>
            <div className="col-span-5">{lead?.leadEmail}</div>
          </div>
          {/* FEEDBACK  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsBookmark size={16} /></div>
            <div className="col-span-5">{lead?.feedback}</div>
          </div>
        </div>
        {/* PROJECT DETAILS  */}
        <div className={`p-4 rounded-xl shadow-sm ${currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"}`}>
          <div className="text-primary text-center">Project details</div>
          <hr className="my-3" />
          {/* PROJECT NAME  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsBuilding size={16} /></div>
            <div className="col-span-5">
              {lead?.project} {lead?.enquiryType} {lead?.leadType} 
            </div>
          </div>
          {/* PURPOSE  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsInfoCircle size={16} /></div>
            <div className="col-span-5">{lead?.leadFor}</div>
          </div>
          {/* MANAGER  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsPerson size={16} /></div>
            <div className="col-span-5">{managerName}</div>
          </div>
          {/* AGENT  */}
          <div className="grid grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsPerson size={16} /></div>
            <div className="col-span-5">{agentName}</div>
          </div>
        </div>

        {/* SOURCE DETAILS  */}
        <div className={`col-span-2 xl:col-span-1 p-4 rounded-xl shadow-sm ${currentMode === "dark" ? "bg-[#000000]" : "bg-[#FFFFFF]"}`}>
          <div className="text-primary text-center">Source details</div>
          <hr className="my-3" />
          {/* SOURCE  */}
          <div className="grid grid-cols-10 xl:grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsShare size={16} /></div>
            <div className="col-span-9 xl:col-span-5">
              {lead?.leadSource}
            </div>
          </div>
          {/* FILENAME  */}
          <div className="grid grid-cols-10 xl:grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsLink45Deg size={16} /></div>
            <div className="col-span-9 xl:col-span-5">{lead?.filename}</div>
          </div>
          {/* DEVICE  */}
          <div className="grid grid-cols-10 xl:grid-cols-6 gap-3 my-3">
            <div className="flex justify-center"><BsPhone size={16} /></div>
            <div className="col-span-9 xl:col-span-5">{lead?.device}</div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default IPLead;
