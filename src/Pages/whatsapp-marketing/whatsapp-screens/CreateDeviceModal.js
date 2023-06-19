import { Modal, Backdrop, IconButton, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import {IoMdClose} from "react-icons/io";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateDeviceModal = ({
  CreateDeviceModalOpen,
  handleCreateDeviceModalClose,
  handleCreateSession
}) => {
  const { currentMode } = useStateContext();
  const [deviceName, setDeviceName] = useState("");

  const createSession = () => {
    if(deviceName) {
        handleCreateSession(deviceName);
        handleCreateDeviceModalClose();
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
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
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
