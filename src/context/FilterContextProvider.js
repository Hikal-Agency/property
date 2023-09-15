import React, { createContext, useContext, useState } from "react";
import axios from "../axoisConfig";
import { toast } from "react-toastify";
const FilterContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const FilterContextProvider = ({ children }) => {
  const [managerSelected, setManagerSelected] = useState("");
  const [agentSelected, setAgentSelected] = useState("");
  const [emailFilter, setEmailError] = useState("");
  const [toRange, setToRange] = useState("");
  const [fromRange, setFromRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [otpSelected, setOtpSelected] = useState({ id: 0 });
  const [phoneNumberFilter, setPhoneNumberFilter] = useState("");
  const [projectNameTyped, setProjectNameTyped] = useState("");

  const [leadOriginSelected, setLeadOriginSelected] = useState({
    id: "hotleads",
    formattedValue: "Fresh Leads",
  });
  const [leadTypeSelected, setLeadTypeSelected] = useState({
    id: "all",
    formattedValue: "All",
  });
  const [enquiryTypeSelected, setEnquiryTypeSelected] = useState({ id: 0 });

  return (
    <FilterContext.Provider
      value={{
        emailFilter,
        setEmailError,
        toRange,
        setToRange,
        fromRange,
        setFromRange,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        languageFilter,
        setLanguageFilter,
        otpSelected,
        setOtpSelected,
        phoneNumberFilter,
        setPhoneNumberFilter,
        leadOriginSelected,
        setLeadOriginSelected,
        leadTypeSelected,
        setLeadTypeSelected,
        enquiryTypeSelected,
        setEnquiryTypeSelected,
        projectNameTyped,
        setProjectNameTyped,
        managerSelected,
        setManagerSelected,
        agentSelected,
        setAgentSelected,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useStateContext = () => useContext(FilterContext);
