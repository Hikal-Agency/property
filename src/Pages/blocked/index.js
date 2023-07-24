import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { Box } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";

const BlockedIps = () => {
  const { currentMode, BACKEND_URL, Managers, SalesPerson } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [IPs, setIPs] = useState([]);

  const fetchBlockedIPs = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/blocked`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const IPsList = response.data.data.data;
      setIPs(IPsList);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch blocked IPs", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchBlockedIPs();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <div
        className={`w-full  ${
          currentMode === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div className="pl-3">
          <div className="mt-5 md:mt-2">
            <h1
              className={`text-2xl border-l-[4px]  ml-1 pl-1 mb-5 mt-4 font-bold ${
                currentMode === "dark"
                  ? "text-white border-white"
                  : "text-main-red-color font-bold border-main-red-color"
              }`}
            >
              ● Blocked IPs
            </h1>

            {IPs?.length === 0 ? (
              <p style={{ color: "red" }}>Nothing to show!</p>
            ) : (
              <div className="flex flex-wrap">
                {IPs?.map((ip) => {
                  if (ip?.byIP) {
                    return (
                      <div className="rounded m-2 w-[20%] p-3 text-white bg-black">
                        {ip?.byIP}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockedIps;
