import React, { useState, useEffect } from "react";
import axios from "../../axoisConfig";
import {
    Box
} from "@mui/material";
import UserInstances from "./UserInstances";
import { useStateContext } from "../../context/ContextProvider";

const Instances = () => {
  const [allUsersInstances, setAllUsersInstances] = useState([]);
  const { BACKEND_URL, currentMode } = useStateContext();

  const fetchInstances = async () => {

    try {
      const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/instances`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const allInstances = response.data.instances.data;
      const allUsers = new Set(allInstances.map((instance) => instance?.user_id));
      const userInstances = Array.from(allUsers)?.map((user) => ({
        instances: allInstances?.filter((instance) => instance?.user_id === user),
      }))
      setAllUsersInstances(userInstances);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);
  return (
    <div className="h-screen">
        <h1
          className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
            currentMode === "dark"
              ? "text-white border-white"
              : "text-red-600 font-bold border-red-600"
          }`}
        >
          ● Instances
        </h1>

      <Box className="mt-4">
        {allUsersInstances?.map((item) => {
            return <UserInstances user={item?.instances[0]?.user_name || item?.instances[0]?.user_id} instances={item?.instances}/>
        })}
      </Box>
    </div>
  );
};

export default Instances;