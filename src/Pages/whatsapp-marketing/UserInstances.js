import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import DeviceCard from "./whatsapp-screens/DeviceCard";

const UserInstances = ({ user, instances, fetchInstances }) => {
  const { currentMode } = useStateContext();
  return (
    <div className="m-3">
      <h1 className="my-2 font-bold text-base" style={{ color: currentMode === "dark" ? "white" : "black" }}>
        {user}
      </h1>
      <Box className="flex my-2">
        {instances?.map((instance) => {
          return <DeviceCard fetchInstances={fetchInstances} key={instance?.user_id} details={instance} />;
        })}
      </Box>
    </div>
  );
};

export default UserInstances;
