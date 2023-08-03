import { useState } from "react";
import { Avatar, Box, CircularProgress } from "@mui/material";
import { BsTrash } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { toast } from "react-toastify";
import axios from "../../../axoisConfig";
import { useStateContext } from "../../../context/ContextProvider";

const DeviceCard = ({
  details,
  fetchInstances,
  addDeviceCard = false,
  onClick = () => {},
  setCreateDeviceModal = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  const { BACKEND_URL } = useStateContext();

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
          <Box className="rounded-lg cursor-pointer bg-[#E5E7EB] mr-[3%] p-4 w-[30%]">
            <div className="flex h-full items-center justify-center">
              <CircularProgress size={20} />
            </div>
          </Box>
        ) : (
          <Box
            onClick={onClick}
            className="rounded-lg cursor-pointer bg-[#E5E7EB] mr-[3%] p-4 w-[30%]"
          >
            <Box className="flex items-center justify-between">
              <Box>
                <h1 className="text-[#DA1F26]" style={{ fontSize: 20 }}>
                  <strong>{details.instance_name}</strong>
                </h1>
                <Box className="flex items-center">
                  {details.status === "connected" ? (
                    <>
                      <Box className="rounded-full mr-1 w-[8px] h-[8px] bg-[#04B900]"></Box>
                      <p style={{ fontSize: 15 }} className="text-[#04B900]">
                        Connected
                      </p>
                    </>
                  ) : (
                    <>
                      <Box className="rounded-full mr-1 w-[8px] h-[8px] bg-[#FF000A]"></Box>
                      <p style={{ fontSize: 15 }} className="text-[#FF000A]">
                        Disconnected
                      </p>
                    </>
                  )}
                </Box>
              </Box>
              <Avatar
                className="delete-btn"
                onClick={(e) => handleDeleteInstance(e, details)}
                sx={{ background: "#3B3D44" }}
              >
                <BsTrash size={18} />
              </Avatar>
            </Box>
            {details.phone_number && details.status === "connected" && (
              <Box className="mt-4">
                <small>
                  Phone Number: <strong>+{details.phone_number}</strong>
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
