import React, { useState, useEffect } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import {RxCaretDown} from "react-icons/rx";
import IPsList from "../../Components/blocked/IPsList";

const BlockedIps = () => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [loading, setLoading] = useState(true);
  const [IPs, setIPs] = useState([]);

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

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
        className={`w-full p-4  ${
          currentMode === "dark" ? "bg-black" : "bg-white"
        }`}
      >
        <div className="w-full flex items-center pb-3 mb-1">
          <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
          <h1
            className={`text-lg font-semibold ${
              currentMode === "dark"
                ? "text-white"
                : "text-black"
            }`}
          >
            IP Blocking
          </h1>
        </div>

          <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}
            sx={{
              backgroundColor: currentMode === "dark" ? "#1C1C1C !important" : "#EEEEEE !important",
              color: currentMode === "dark" ? "#FFFFFF" : "#000000",
            }}
          >
            <AccordionSummary
              expandIcon={<RxCaretDown size={28} color={"#AAAAAA"}/>}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <p className="font-semibold text-lg" sx={{ width: '33%', flexShrink: 0 }}>
                Requested IPs to block
              </p>
            </AccordionSummary>
            <AccordionDetails>
                  <div>
                  <IPsList
                    isRequest={true}
                    heading="Requests"
                    ips={IPs?.filter((ip) => !Number(ip?.status))}
                    fetchBlockedIPs={fetchBlockedIPs}
                  />
                </div>
            </AccordionDetails>
          </Accordion>

          <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}
            sx={{
              backgroundColor: currentMode === "dark" ? "#1C1C1C !important" : "#EEEEEE !important",
              color: currentMode === "dark" ? "#FFFFFF" : "#000000",
            }}
          >
            <AccordionSummary
              expandIcon={<RxCaretDown size={28} color={"#AAAAAA"}/>}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <p className="font-semibold text-lg"  sx={{ width: '33%', flexShrink: 0 }}>Blocked</p>
            </AccordionSummary>
            <AccordionDetails>
                    <div>
                  <IPsList
                    heading="Blocked"
                    fetchBlockedIPs={fetchBlockedIPs}
                    ips={IPs?.filter((ip) => Number(ip?.status) === 1)}
                  />
                </div>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}
            sx={{
              backgroundColor: currentMode === "dark" ? "#1C1C1C !important" : "#EEEEEE !important",
              color: currentMode === "dark" ? "#FFFFFF" : "#000000",
            }}
          >
            <AccordionSummary
              expandIcon={<RxCaretDown size={28} color={"#AAAAAA"}/>}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <p className="font-semibold text-lg"  sx={{ width: '33%', flexShrink: 0 }}>
                Rejected
              </p>
            </AccordionSummary>
            <AccordionDetails>
                        <div>
                  <IPsList
                    isRejected={true}
                    heading="Rejected"
                    ips={IPs?.filter((ip) => Number(ip?.status) === 2)}
                    fetchBlockedIPs={fetchBlockedIPs}
                  />
                </div>
            </AccordionDetails>
          </Accordion>


        {/* <div className="pl-3">
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
        </div> */}
      </div>
    </>
  );
};

export default BlockedIps;
