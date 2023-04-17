import React, { useEffect } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import MessagesComponent from "./messages";
import TransactionsComponent from "./transactions";
import TemplatesComponent from "../../Components/whatsapp-marketing/TemplatesComponent";
import InstancesComponent from "./Instances";
import axios from "axios";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { useLocation, useNavigate } from "react-router-dom";
import AllMessages from "./AllMessages";
import Payments from "./payments";

const pagesComponents = {
  instances: <InstancesComponent />,
  messages: <MessagesComponent />,
  templates: <TemplatesComponent />,
  payments: <Payments />,
  transactions: <TransactionsComponent />,
  all: <AllMessages />,
};

const WhatsappMarketing = () => {
  const {
    currentMode,
    User,
    setUser,
    BACKEND_URL,
    setopenBackDrop,
    isUserSubscribed,
  } = useStateContext();
  const location = useLocation();
  const navigate = useNavigate();

  const page = location.pathname.split("/")[2].replace(/%20/g, " ");

  console.log("Page: ", page);

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setUser(result.data.user[0]);
      })
      .catch((err) => {
        navigate("/", {
          state: { error: "Something Went Wrong! Please Try Again " },
        });
      });
  };
  useEffect(() => {
    setopenBackDrop(false);

    if (!(User?.uid && User?.loginId)) {
      const token = localStorage.getItem("auth-token");
      if (token) {
        FetchProfile(token);
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

  useEffect(() => {
    if (User && isUserSubscribed != null) {
      if (!isUserSubscribed && page !== "payments") {
        navigate("/dashboard", {
          state: { error: "You are not subscribed to access these pages" },
        });
      }
    }
  }, [User, isUserSubscribed, page]);
  return (
    // <>
    //   <div className="min-h-screen">
    //     <div className="flex">
    //       <Sidebarmui />
    //       <div
    //         className={`w-full  ${
    //           currentMode === "dark" ? "bg-black" : "bg-white"
    //         }`}
    //       >
    //         <div className="px-5">
    //           <Navbar />
    //           {pagesComponents[page]}
    //         </div>
    //         <Footer />
    //       </div>
    //     </div>
    //   </div>
    // </>
    <>
      <div className="min-h-screen flex">
        <Sidebarmui />
        <div
          className={`w-full flex flex-col ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="flex-grow px-5">
            <Navbar />
            {pagesComponents[page]}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WhatsappMarketing;
