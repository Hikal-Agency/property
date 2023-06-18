import { Avatar, Box } from "@mui/material";
import { BsFillPhoneFill } from "react-icons/bs";
import {GrAdd} from "react-icons/gr";

const DeviceCard = ({ name, isConnected, addDeviceCard = false, onClick}) => {
    if(addDeviceCard) {
      return <Box className="rounded-lg flex flex-col items-center justify-center cursor-pointer border-dashed border-2 border-[#B2B2B2] mr-[3%] p-3 w-[30%]">
            <Avatar className="mb-1" style={{background: "#E5E7EB", width: 30, height: 30}}>
                <GrAdd size={14}/>
            </Avatar>
            <p>Add new device</p>
      </Box>;
    } else{
  return (
    <>
      <Box onClick={onClick} className="rounded-lg cursor-pointer bg-[#E5E7EB] mr-[3%] p-4 w-[30%]">
        <Box className="flex items-center justify-between">
          <Box>
            <h1 className="text-[#DA1F26]" style={{ fontSize: 20 }}>
              <strong>{name}</strong>
            </h1>
            <Box className="flex items-center">
              {isConnected ? (
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
          <Avatar sx={{ background: "#3B3D44" }}>
            <BsFillPhoneFill size={18} />
          </Avatar>
        </Box>
      </Box>
    </>
  );
}
};

export default DeviceCard;
