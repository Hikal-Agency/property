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
  const [emailFilter, setEmailError] = useState("");
  const [toRange, setToRange] = useState("");
  const [fromRange, setFromRange] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [otpSelected, setOtpSelected] = useState({ id: 0 });
  const [phoneNumberFilter, setPhoneNumberFilter] = useState("");

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
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
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useStateContext = () => useContext(FilterContext);
