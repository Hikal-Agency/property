import React, { useEffect } from "react";
import MessagesComponent from "./messages";
import TransactionsComponent from "./transactions";
import TemplatesComponent from "../../Components/whatsapp-marketing/TemplatesComponent";
import { useStateContext } from "../../context/ContextProvider";
import { useLocation, useNavigate } from "react-router-dom";
import AllMessages from "./AllMessages";
import Payments from "./payments";
import Chat from "./Chat";

const pagesComponents = {
  contacts: <MessagesComponent />,
  templates: <TemplatesComponent />,
  payments: <Payments />,
  transactions: <TransactionsComponent />,
  all: <AllMessages />,
  chat: <Chat />,
};

const WhatsappMarketing = () => {
  const { currentMode, User, setopenBackDrop, isUserSubscribed } =
    useStateContext();
  const location = useLocation();
  const navigate = useNavigate();

  const page = location.pathname.split("/")[2].replace(/%20/g, " ");

  console.log("Page: ", page);

  useEffect(() => {
    setopenBackDrop(false);
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
    <>
      <div className="min-h-screen">
        <div
          className={`w-full  ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className="pl-3">{pagesComponents[page]}</div>
        </div>
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default WhatsappMarketing;
