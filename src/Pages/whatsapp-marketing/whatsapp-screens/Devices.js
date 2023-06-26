import { useState } from "react";
import { Box } from "@mui/material";
import DeviceCard from "./DeviceCard";
import CreateDeviceModal from "./CreateDeviceModal";

const Devices = ({ handleCreateSession, fetchDevices, devices }) => {
  const [createDeviceModal, setCreateDeviceModal] = useState(false);
  return (
    <>
      <div className="flex p-4 h-[90vh] flex-col">
        <h1>
          <strong>Devices</strong>
        </h1>
        <Box className="flex mt-3">
          {devices?.map((device) => {
            return (
              <DeviceCard
                onClick={() => handleCreateSession(device.instance_name)}
                details={device}
              />
            );
          })}
          <DeviceCard
            setCreateDeviceModal={setCreateDeviceModal}
            addDeviceCard
          />
        </Box>

        {createDeviceModal && (
          <CreateDeviceModal
          fetchDevices={fetchDevices}
            CreateDeviceModalOpen={createDeviceModal}
            handleCreateDeviceModalClose={() => setCreateDeviceModal(false)}
            handleCreateSession={handleCreateSession}
          />
        )}
      </div>
    </>
  );
};

export default Devices;
