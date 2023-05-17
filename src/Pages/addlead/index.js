import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";
import Footer from "../../Components/Footer/Footer";

const AddLead = (props) => {
  const { currentMode, User, BACKEND_URL } =
    useStateContext();
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Add Lead</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head> */}
      <div className=" min-h-screen">
          <div
            className={` ${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
              <div className={`w-full`}>
                <div className="px-5 ">
                  <Navbar />
                  <AddLeadComponent BACKEND_URL={BACKEND_URL} User={User} />
                </div>
            </div>
            <Footer />
          </div>
      </div>
    </>
  );
};

export default AddLead;
