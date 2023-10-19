import React, { useState, useEffect } from "react";
import axios from "../../axoisConfig";
import {
    Box
} from "@mui/material";
import UserInstances from "./UserInstances";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";

const Instances = () => {
  const [allUsersInstances, setAllUsersInstances] = useState([]);
  const { BACKEND_URL, currentMode, t, themeBgImg } = useStateContext();
  const [loading, setLoading] = useState(true);

  const fetchInstances = async () => {
    setLoading(true);
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
    setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInstances();
  }, []);

  if(loading) {
    return <Loader/>;
  }
  return (
    <div className={`w-full`}>
      <div className="w-full flex items-center pb-3">
        <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
        <h1
          className={`text-lg font-semibold ${
            currentMode === "dark"
              ? "text-white"
              : "text-black"
          }`}
        >
          {t("instances")}
        </h1>
      </div>

      <Box className="">
      {allUsersInstances?.length === 0 ? <p className="text-red-600 text-sm">{t("nothing_to_show")}</p> :
        [allUsersInstances?.map((item) => {
            return <UserInstances fetchInstances={fetchInstances} user={item?.instances[0]?.user_name || item?.instances[0]?.user_id} instances={item?.instances}/>
        })]
      }
      </Box>
    </div>
  );
};

export default Instances;