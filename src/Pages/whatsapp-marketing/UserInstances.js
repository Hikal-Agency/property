import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import DeviceCard from "./whatsapp-screens/DeviceCard";

const UserInstances = ({ user, instances }) => {
  const { currentMode } = useStateContext();
  return (
    <div className="mb-4">
      <h1 className="mb-2" style={{ color: currentMode === "dark" ? "white" : "black" }}>
        {user}
      </h1>
      <Box className="flex mt-3">
        {instances?.map((instance) => {
          return <DeviceCard key={instance?.user_id} details={instance} />;
        })}
      </Box>
    </div>
  );
};

export default UserInstances;
