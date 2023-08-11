import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";

const AddLead = (props) => {
  const { currentMode, User, BACKEND_URL } = useStateContext();
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Add Lead</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head> */}
      <div className=" min-h-screen">
        <div className={` ${currentMode === "dark" ? "bg-black" : "bg-white"}`}>
          <div className={`w-full`}>
            <div className="px-5 ">
              <AddLeadComponent />
            </div>
          </div>
        </div>

        {/* <Footer /> */}
      </div>
    </>
  );
};

export default AddLead;
