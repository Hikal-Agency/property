import React, { useEffect } from "react";
import MessagesComponent from "./messages";
import TemplatesComponent from "../../Components/whatsapp-marketing/TemplatesComponent";
import { useStateContext } from "../../context/ContextProvider";
import {  useNavigate } from "react-router-dom";
import AllMessages from "./AllMessages";
import Payments from "./payments";
import Chat from "./Chat";
import Instances from "./Instances";
import { FilterContextProvider } from "../../context/FilterContextProvider";
import MessagesDashboar from "./MessagesDashboar";

const pagesComponents = {
  contacts: (
    <FilterContextProvider>
      <MessagesComponent />
    </FilterContextProvider>
  ),
  templates: <TemplatesComponent />,
  instances: <Instances />,
  payments: <Payments />,
  chat: <Chat />,
  all: <AllMessages />,
  messages: <MessagesDashboar />,
};

const WhatsappMarketing = ({ pageName }) => {
  const { currentMode, User, setopenBackDrop, isUserSubscribed } =
    useStateContext();
  const navigate = useNavigate();

  const page = pageName;

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
