import { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { useStateContext } from "../../context/ContextProvider";
import AddLeadComponent from "../../Components/Leads/AddLeadComponent";
import axios from "axios";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AddLead = (props) => {
  const { currentMode, setopenBackDrop, User, setUser, BACKEND_URL } =
    useStateContext();
  const [loading, setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
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
        console.log("User: ", User);
        setloading(false);
      })
      .catch((err) => {
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // navigate("/", {
        //   state: {
        //     error: "Something Went Wrong! Please Try Again",
        //     continueURL: location.pathname,
        //   },
        // });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);
    if (User?.uid && User?.loginId) {
      setloading(false);
      console.log("User: ", User);
    } else {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      if (token) {
        // FetchProfile(token);
        const user = localStorage.getItem("user");
        console.log("User in add lead: ", user);
        setUser(JSON.parse(user));
        setloading(false);
      } else {
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      }
    }

    // eslint-disable-next-line
  }, []);
  return (
    <>
      <ToastContainer />
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
              <div className={`w-full`}>
                <div className="px-5 ">
                  <Navbar />
                  <AddLeadComponent BACKEND_URL={BACKEND_URL} User={User} />
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
