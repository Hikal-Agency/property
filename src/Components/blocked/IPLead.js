import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";

const IPLead = ({ lead }) => {
  const { currentMode, Managers, SalesPerson, User, primaryColor, t } = useStateContext();

  const { hasPermission } = usePermission();

  // Replace last 4 digits with "*"
  const stearics =
    lead?.leadContact?.slice(0, lead?.leadContact?.length - 4) + "****";
  let contact;

  if (hasPermission("number_masking")) {
    if (User?.role === 1) {
      contact = lead?.leadContact;
    } else {
      contact = `${stearics}`;
    }
  } else {
    contact = lead?.leadContact;
  }

  const managerName = Managers?.find(
    (manager) => manager?.id === lead?.assignedToManager
  )?.userName;

  console.log(Managers, managerName);
  const agentName = SalesPerson[`manager-${lead?.assignedToManager}`]?.find(
    (agent) => agent?.id === lead?.assignedToSales
  )?.userName;
  return (
    <>
      <Box
        sx={{
          "& p": {
            fontWeight: "bold",
            color: currentMode === "dark" ? "white" : "black",
          },
          "& span": {
            color: primaryColor,
          },
        }}
        className="flex px-24 justify-between items-center"
        key={lead.id}
      >
        <div>
          <p className="mb-1">
          {t("label_lead_name")}: <span>{lead?.leadName}</span>
          </p>
          <p className="mb-1">
            {t("label_contact_number")}: <span>{contact}</span>
          </p>
          <p className="mb-1">
            {t("label_project")}:{" "}
            <span>
              {lead?.project} {lead?.enquiryType} {lead?.leadFor}
            </span>
          </p>
        </div>
        <div>
          <p className="mb-1">
            {t("label_manager")} : <span>{managerName}</span>
          </p>
          <p className="mb-1">
            {t("label_agent")}: <span>{agentName}</span>
          </p>
          <p className="mb-1">
            {t("label_feedback")}: <span>{lead?.feedback}</span>
          </p>
        </div>
      </Box>

      <hr className="bg-primary my-10 w-[90%] mx-auto" />
    </>
  );
};

export default IPLead;
