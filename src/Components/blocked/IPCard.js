import { useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { CgUnblock } from "react-icons/cg";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";
import IPLeadsModal from "./IPLeadsModal";

import {
  BiNotepad,
  BiUser,
  BiBlock
} from "react-icons/bi";

const IPCard = ({ ip, isRequest, isRejected, fetchBlockedIPs }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
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
      <div className={`p-3 rounded-md ${currentMode === "dark" ? "bg-[#000000] text-white" : "bg-[#FFFFFF] text-black"}`}>
        {loading ? (
          <div className="flex py-4 justify-center items-center">
            <CircularProgress size={22} />
          </div>
        ) : (
          <div>
            <div className="flex flex-col">
              <strong className="mb-2">{ip?.byIP}</strong>
              <div className="h-0.5 w-full bg-[#DA1F26] my-2"></div>
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

            {isRequest ? (
              <div className="flex mt-4 items-center">
                <IconButton
                  style={{ backgroundColor: "#4CAF50" }}
                  className="rounded-full"
                  onClick={() => handleBlock(ip)}
                  sx={{
                    "& svg": {
                      color: currentMode === "dark" ? "white" : "white",
                    },
                    padding: "4px",
                    marginRight: "6px",
                  }}
                >
                  <FaCheck />
                </IconButton>
                <IconButton
                  style={{ backgroundColor: "#DC2626" }}
                  className="rounded-full"
                  onClick={() => handleReject(ip)}
                  sx={{
                    "& svg": {
                      color: currentMode === "dark" ? "white" : "white",
                    },
                    padding: "4px",
                  }}
                >
                  <RxCross2 />
                </IconButton>
              </div>
            ) : !isRejected ? (
              <IconButton
                onClick={() => handleUnblock(ip)}
                style={{ backgroundColor: "black" }}
                className="rounded-full"
                sx={{
                  "& svg": {
                    color: "white",
                  },
                  marginTop: "10px",
                }}
              >
                <CgUnblock />
              </IconButton>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
      {IPLeadsModalOpen && <IPLeadsModal ip={ip?.byIP} blockIPModalOpened={IPLeadsModalOpen} handleCloseIPModal={() => setIPLeadsModalOpen(false)}/>}
      </>
  );
};

export default IPCard;
