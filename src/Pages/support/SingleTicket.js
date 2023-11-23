import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import SingleTickt from "../../Components/support/SingleTickt";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "../../axoisConfig";
import { CircularProgress, IconButton } from "@mui/material";
import { FaLongArrowAltLeft } from "react-icons/fa";

const SingleTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split("/")[3].replace(/%20/g, " ");

  console.log("Ticket Id: ", id);

  const { currentMode, t, BACKEND_URL, value, setValue } = useStateContext();

  const [tickeData, setTicketData] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("Ticket DAta: ", tickeData);

  const goBack = () => {
    setValue(1);
    navigate("/support");
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/tickets/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("Single Ticket: ", response);
      setTicketData(response?.data?.data[0]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <>
      {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <h4
                className={`font-semibold p-7 text-center text-2xl ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("label_issue")} :{" "}
                <span className="text-primary font-bold">
                  {tickeData?.issue &&
                    tickeData.issue.charAt(0).toUpperCase() +
                      tickeData.issue.slice(1)}
                </span>
              </h4>
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-[#1c1c1c] text-white"
                    : "bg-gray-200 text-black"
                } p-5 rounded-md my-5 mb-10 min-h-screen`}
              >
                <div className="mt-3 pb-3 min-h-screen">
                  <IconButton
                    onClick={goBack}
                    className="bg-btn-primary rounded-full mb-4"
                  >
                    <FaLongArrowAltLeft color="white" />
                  </IconButton>
                  {loading ? (
                    <div className="fixed  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <CircularProgress />
                    </div>
                  ) : (
                    <SingleTickt ticketData={tickeData} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default SingleTicket;
