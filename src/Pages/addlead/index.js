import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";

const AddLead = (props) => {
  const { currentMode, User, BACKEND_URL } = useStateContext();
  return (
    <>
      <div className="min-h-screen">
        <div className={` ${currentMode === "dark" ? "bg-black" : "bg-white"}`}>
          <div className={`w-full pl-3`}>
            <AddLeadComponent />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLead;
