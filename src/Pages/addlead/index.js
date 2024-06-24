import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";

const AddLead = (props) => {
  const { currentMode, User, BACKEND_URL, themeBgImg } = useStateContext();
  return (
    <div className={`min-h-screen p-5 mt-2 ${
      !themeBgImg && (currentMode === "dark" ? "bg-dark" : "bg-light")
      }`}>
      <AddLeadComponent />
    </div>
  );
};

export default AddLead;
