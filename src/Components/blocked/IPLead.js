import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const IPLead = ({ lead }) => {
  const { currentMode, Managers, SalesPerson } = useStateContext();

  const managerName = Managers?.find((manager) => manager?.id === lead?.assignedToManager)?.userName;

  console.log(Managers, managerName)
  const agentName = SalesPerson[`manager-${lead?.assignedToManager}`]?.find((agent) => agent?.id === lead?.assignedToSales)?.userName;
  return (
    <>
    <Box
      sx={{
        "& p": {
          fontWeight: "bold",
          color: currentMode === "dark" ? "white" : "black",
        },
        "& span": {
          color: "#da1f26",
        },
      }}
      className="flex px-24 justify-between items-center"
      key={lead.id}
    >
      <div>
        <p className="mb-1">
          Lead Name: <span>{lead?.leadName}</span>
        </p>
        <p className="mb-1">
          Contact: <span>{lead?.leadContact}</span>
        </p>
        <p className="mb-1">
          Project:{" "}
          <span>
            {lead?.project} {lead?.enquiryType} {lead?.leadFor}
          </span>
        </p>
      </div>
      <div>
        <p className="mb-1">
          Manager: <span>{managerName}</span>
        </p>
        <p className="mb-1">
          Agent: <span>{agentName}</span>
        </p>
        <p className="mb-1">
          Feedback: <span>{lead?.feedback}</span>
        </p>
      </div>
    </Box>
    
    <hr className="bg-[#da1f26] my-10 w-[90%] mx-auto"/>
    </>
  );
};

export default IPLead;
