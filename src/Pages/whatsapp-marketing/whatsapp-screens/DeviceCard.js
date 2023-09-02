import { useState } from "react";
import { Avatar, Box, CircularProgress, Tooltip } from "@mui/material";
import { GrAdd } from "react-icons/gr";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import { useStateContext } from "../../../context/ContextProvider";

import { 
  BsTrash 
} from "react-icons/bs";
import {
  RxCrossCircled,
  RxCheckCircled
} from "react-icons/rx";


const DeviceCard = ({
  details,
  fetchInstances,
  addDeviceCard = false,
  onClick = () => {},
  setCreateDeviceModal = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const { BACKEND_URL, currentMode } = useStateContext();

  const handleDeleteInstance = async (e, instance) => {
    if (e.target.closest(".delete-btn")) {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth-token");

        await axios.delete(`${BACKEND_URL}/instances/${instance?.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        toast.success("Instance deleted successfuly!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchInstances();
      } catch (error) {
        console.log(error);
        toast.error("Couldn't delete the instance", {
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
    }
  };

  if (addDeviceCard) {
    return (
      <Box
        onClick={() => setCreateDeviceModal(true)}
        className="rounded-lg flex flex-col items-center justify-center cursor-pointer border-dashed border-2 border-[#B2B2B2] mr-[3%] p-3 w-[30%]"
      >
        <Avatar
          className="mb-1"
          style={{ background: "#E5E7EB", width: 30, height: 30 }}
        >
          <GrAdd size={14} />
        </Avatar>
        <p>Add new device</p>
      </Box>
    );
  } else {
    return (
      <>
        {loading ? (
          <Box className={`${currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-gray-200"} rounded-lg cursor-pointer m-1 p-5 w-[32%]`}>
            <div className="flex h-full items-center justify-center">
              <CircularProgress size={20} />
            </div>
          </Box>
        ) : (
          <Box
            onClick={onClick}
            className={`${currentMode === "dark" ? "bg-[#1c1c1c] text-white" : "bg-gray-200 text-black"} rounded-lg cursor-pointer m-1 p-5 sm:w-full md:w-[50%] lg:w-[32%] `}
          >
            <Box className="flex items-center justify-between">
              <Box>
                <h1 className="text-lg mb-2">
                  <strong>{details.instance_name}</strong>
                </h1>
                <Box className="flex items-center">
                  {details.status === "connected" ? (
                    <>
                      <RxCheckCircled size={16} className="text-green-600 mr-2" />
                      <p className="text-green-600">
                        Connected
                      </p>
                    </>
                  ) : (
                    <>
                      <RxCrossCircled size={16} className="text-red-600 mr-2" />
                      <p className="text-red-600">
                        Disconnected
                      </p>
                    </>
                  )}
                </Box>
              </Box>
              <Tooltip title="Delete Instance" arrow>
                <Avatar
                  className="delete-btn"
                  onClick={(e) => handleDeleteInstance(e, details)}
                  sx={{ background: "transparent" }}
                >
                  <BsTrash size={18} className="text-[#DA1F26]" />
                </Avatar>
              </Tooltip>
            </Box>
            {details.phone_number && details.status === "connected" && (
              <Box className={`mt-2 ${currentMode === "dark" ? "text-white" : "text-black" }`}>
                <small>
                  Instance of <strong>+{details.phone_number}</strong>
                </small>
              </Box>
            )}
          </Box>
        )}
      </>
    );
  }
};

export default DeviceCard;
