import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";

const AddLead = (props) => {
  const { currentMode, User, BACKEND_URL } = useStateContext();
  return (
    <div className={`min-h-screen p-4 ${currentMode === "dark" ? "bg-black" : "bg-white"}`}>
      <AddLeadComponent />
    </div>
  );
};

export default AddLead;
