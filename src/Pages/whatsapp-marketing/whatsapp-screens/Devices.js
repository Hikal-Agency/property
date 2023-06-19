import { Box } from "@mui/material";
import DeviceCard from "./DeviceCard";

const Devices = ({handleCreateSession}) => {
    return (
        <>
             <div
                  className="flex p-4 w-[98%] h-[90vh] bg-[#F6F6F6] rounded-lg flex-col"
                >
                  <h1><strong>Devices</strong></h1>
                  <Box className="flex mt-3">
                    <DeviceCard onClick={() => handleCreateSession("Test")} name="Test" isConnected={true}/>
                    <DeviceCard onClick={() => handleCreateSession("Test 2")} name="Test 2" isConnected={false}/>
                    <DeviceCard addDeviceCard/>
                  </Box>
            </div>
        </>
    );
}

export default Devices;