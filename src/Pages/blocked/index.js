import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";
import IPsList from "../../Components/blocked/IPsList";

const BlockedIps = () => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
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
          <div className="my-5 md:mt-2">
            <div>
              <IPsList
                isRequest={true}
                heading="Requests"
                ips={IPs?.filter((ip) => !Number(ip?.status))}
                fetchBlockedIPs={fetchBlockedIPs}
              />
            </div>

            <div>
              <IPsList
                heading="Blocked"
                fetchBlockedIPs={fetchBlockedIPs}
                ips={IPs?.filter((ip) => Number(ip?.status) === 1)}
              />
            </div>

            <div>
              <IPsList
                isRejected={true}
                heading="Rejected"
                ips={IPs?.filter((ip) => Number(ip?.status) === 2)}
                fetchBlockedIPs={fetchBlockedIPs}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlockedIps;
