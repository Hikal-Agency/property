import { Modal, Backdrop, IconButton, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import {toast} from "react-toastify";
import axios from "../../../axoisConfig";
import {IoMdClose} from "react-icons/io";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateDeviceModal = ({
  CreateDeviceModalOpen,
  handleCreateDeviceModalClose,
  handleCreateSession,
  fetchDevices
}) => {
  const { currentMode, BACKEND_URL, User } = useStateContext();
  const [deviceName, setDeviceName] = useState("");

  const createNewDevice = async (deviceName) => {
    try { 
      const DeviceData = new FormData();
      const token = localStorage.getItem("auth-token");
      const sessionId = `${deviceName
        .toLowerCase()
        .replaceAll(" ", "-")}`;
      DeviceData.append("instance_name", sessionId);
      DeviceData.append("user_name", User?.userName);
      DeviceData.append("status", "disconnected");
      DeviceData.append("user_id", User?.id);

      await axios.post(`${BACKEND_URL}/instances`, DeviceData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      toast.success("Device Created Successfuly", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
        handleCreateDeviceModalClose();
        fetchDevices();
      
    } catch (error) {
      console.log(error);
      toast.error("Couldn't create a new device!", {
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
  }

  const createSession = () => {
    if(deviceName) {
        createNewDevice(deviceName);
    }
  }
  return (
    <>
      <Modal
        keepMounted
        open={CreateDeviceModalOpen}
        onClose={handleCreateDeviceModalClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          style={style}
          className={`w-[calc(100%-20px)] md:w-[35%]  ${
            currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
              <IconButton
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 10,
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={handleCreateDeviceModalClose}
              >
                <IoMdClose size={18} />
              </IconButton>

              <h1 className="mb-3"><strong>Create a new device</strong></h1>
              <TextField
                label="Device Name"
                fullWidth
                sx={{mb: 2}}
                required
                value={deviceName}
                onInput={(e) => setDeviceName(e.target.value)}
              />
              <Button onClick={createSession} fullWidth variant="contained" color="error">Done</Button>
        </div>
      </Modal>
    </>
  );
};

export default CreateDeviceModal;
