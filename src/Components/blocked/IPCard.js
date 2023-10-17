import { useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import IPLeadsModal from "./IPLeadsModal";

import { CgUnblock } from "react-icons/cg";
import { toast } from "react-toastify";
import { 
  RxCheck,
  RxCross2
} from "react-icons/rx";

import {
  BiNotepad,
  BiUser,
  BiBlock
} from "react-icons/bi";

const IPCard = ({ ip, isRequest, isRejected, fetchBlockedIPs }) => {
  const { currentMode, BACKEND_URL, themeBgImg } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [IPLeadsModalOpen, setIPLeadsModalOpen] = useState(false);

  const handleUnblock = async (ip) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth-token");

      await axios.delete(`${BACKEND_URL}/blocked/${ip?.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      toast.success("IP unblocked successfuly!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchBlockedIPs();
    } catch (error) {
      console.log(error);
      toast.error("Couldn't unblock the IP", {
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
    setLoading(false);
  };

  const handleBlock = async (ip) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const data = {
        status: 1,
      };
      await axios.post(
        `${BACKEND_URL}/blocked/${ip?.id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("IP blocked successfuly!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      fetchBlockedIPs();
    } catch (error) {
      console.log(error);
      toast.error("Failed block IP", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
    }
  };

  const handleReject = async (ip) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const data = {
        status: 2,
      };
      await axios.post(
        `${BACKEND_URL}/blocked/${ip?.id}`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Request rejected successfuly!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      fetchBlockedIPs();
    } catch (error) {
      console.log(error);
      toast.error("Failed to reject IP!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
    }
  };

  return (
    <>
    <div
      onClick={(e) => {
        if(!e.target.closest(".MuiButtonBase-root")) {
        setIPLeadsModalOpen(true);
        }
      }}
      className={`relative sm:w-[100%] md:w-[50%] lg:w-[33%] p-3`}
    >
      <div className={`p-3 card-hover shadow-md rounded-lg 
        ${!themeBgImg 
          ? (currentMode === "dark" ? "bg-black text-white" : "bg-white text-black") 
          : (currentMode === "dark" ? "blur-bg-dark text-white" : "blur-bg-white text-black")}
      `}>
        {loading ? (
          <div className="flex py-4 justify-center items-center">
            <CircularProgress size={22} />
          </div>
        ) : (
          <div>
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <strong className="mb-2">{ip?.byIP}</strong>
                {isRequest ? (
                  <div className="flex items-center">
                    <Tooltip title="Approve" arrow>
                      <button
                        className="rounded-full bg-[#4CAF50] text-white p-1.5 mx-1"
                        onClick={() => handleBlock(ip)}
                      >
                        <RxCheck size={16} />
                      </button>
                    </Tooltip>

                    <Tooltip title="Reject" arrow>
                      <button
                        className="rounded-full bg-[#DC2626] text-white p-1.5 mx-1"
                        onClick={() => handleReject(ip)}
                      >
                        <RxCross2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                ) : !isRejected ? (
                  <Tooltip title="Unblock IP" arrow>
                    <button
                      onClick={() => handleUnblock(ip)}
                      className="rounded-full bg-primary text-white p-1.5"
                    >
                      <CgUnblock size={16} />
                    </button>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </div>
              <div className="h-0.5 w-full bg-primary my-2"></div>
              <div className="font-semibold my-1 flex">
                <BiNotepad size={16} className="mr-3" />
                {ip?.reason}
              </div>
              <div className="my-1 flex">
                <BiUser size={16} className="mr-3" />
                {ip?.blocked_by_name}
              </div>
              <div className="my-1 flex">
                <BiBlock size={16} className="mr-3" />
                {new Date(ip?.created_at)?.toUTCString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
      {IPLeadsModalOpen && <IPLeadsModal ip={ip?.byIP} blockIPModalOpened={IPLeadsModalOpen} handleCloseIPModal={() => setIPLeadsModalOpen(false)}/>}
      </>
  );
};

export default IPCard;
