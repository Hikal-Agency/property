import { useTranslation } from "react-i18next";
import React, { createContext, useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "../axoisConfig";
import { toast } from "react-toastify";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const BACKEND_URL = process.env.REACT_APP_API_URL;
  const [Counters, setCounters] = useState([]);


  const SourceCounters = async () => {
    const token = localStorage.getItem("auth-token");
    const currentDate = moment().format("YYYY-MM-DD");
    console.log("CURRENT DATE ==============", currentDate);
    await axios
      .get(`${BACKEND_URL}/totalSource?date=${currentDate}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        const source = {
          counters: result.data.data.query_result,
        };
        console.log("NEW COUNTERS ======== ", source);
        setCounters(source);
      });
    // setCounters(callCounter?.data?.data?.query_result);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      SourceCounters(token);
    }
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider
      value={{
        BACKEND_URL,
        SourceCounters,
        Counters,
        setCounters,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
