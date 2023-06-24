import { useState } from "react";
import { Box } from "@mui/material";
import DeviceCard from "./DeviceCard";
import CreateDeviceModal from "./CreateDeviceModal";

const Devices = ({ handleCreateSession }) => {
  const [createDeviceModal, setCreateDeviceModal] = useState(false);
  return (
    <>
      <div className="flex p-4 h-[90vh] flex-col">
        <h1>
          <strong>Devices</strong>
        </h1>
        <Box className="flex mt-3">
          <DeviceCard
            onClick={() => handleCreateSession("Test")}
            name="Test"
            isConnected={true}
          />
          <DeviceCard
            onClick={() => handleCreateSession("Test 2")}
            name="Test 2"
            isConnected={false}
          />
          <DeviceCard
            setCreateDeviceModal={setCreateDeviceModal}
            addDeviceCard
          />
        </Box>

    {createDeviceModal &&
        <CreateDeviceModal
          CreateDeviceModalOpen={createDeviceModal}
          handleCreateDeviceModalClose={() => setCreateDeviceModal(false)}
          handleCreateSession={handleCreateSession}
        />
    }
      </div>
    </>
  );
};

export default Devices;
