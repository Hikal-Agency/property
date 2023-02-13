import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";
import axios from "axios";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const AddLead = (props) => {
  const { currentMode, setopenBackDrop, User, setUser, BACKEND_URL } =
    useStateContext();
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("request completeted");
        setUser(result.data.user[0]);
        setloading(false);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again" },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
    } else {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again" },
        });
      }
    }

    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - Add Lead</title>
        <meta name="description" content="User Dashboard - HIKAL CRM" />
      </Head> */}
      <div className=" min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={` ${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
            <div className="flex">
              <Sidebarmui />
              <div className={`w-full`}>
                <div className="px-5 ">
                  <Navbar />
                  <AddLeadComponent BACKEND_URL={BACKEND_URL} User={User} />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default AddLead;
