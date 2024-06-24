import { useState } from "react";
import { Box } from "@mui/material";
import DeviceCard from "./DeviceCard";
import CreateDeviceModal from "./CreateDeviceModal";

const Devices = ({ handleCreateSession, fetchDevices, devices }) => {
  const [createDeviceModal, setCreateDeviceModal] = useState(false);
  return (
    <>
      <div className="w-full">
        <h1 className="uppercase font-semibold">
          Devices
        </h1>
        <Box className="flex flex-wrap mt-3">
          {devices?.map((device) => {
            return (
              <DeviceCard
                fetchInstances={fetchDevices}
                key={device.id}
                onClick={(e) => {
                  if (!e.target.closest(".delete-btn")) {
                    handleCreateSession(device.instance_name, device.id);
                  }
                }}
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
