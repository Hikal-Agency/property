
import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { useEffect, useState } from "react";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import EditUser from "../../Components/Users/EditUser";
import { useLocation } from "react-router-dom";

const UpdateUser = () => {
  const { currentMode, DataGridStyles, BACKEND_URL } =
    useStateContext();

  const location = useLocation();

  const id = location.pathname.split("/")[2].replace(/%20/g, " ");

  console.log("Id: ", id);

  const [user, setUser] = useState([]);

  console.log("user: ", user);

  const fetchUser = async (token) => {
    try {
      // const token = localStorage.getItem("auth-token");
      const response = await axios.get(`${BACKEND_URL}/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log("User: ", response?.data?.data);

      setUser(response?.data?.data);
    } catch (error) {
      console.log(error);
      toast.error("Unable to fetch users.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    fetchUser(token);
  }, []);

  return (
    <>
      
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
          <div className={`w-full `}>
            <div className="pl-3">
              <div className="mb-5 mt-8">
                <div>
                  <h2
                    className={` ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } font-semibold text-lg ml-8`}
                  >
                    Edit User:{" "}
                    <span className="text-primary font-bold">
                      {user?.userName &&
                        user?.userName.charAt(0).toUpperCase() +
                          user?.userName.slice(1)}
                    </span>
                  </h2>
                </div>
                <Box width={"100%"} sx={DataGridStyles}>
                  <EditUser user={user} />
                </Box>
              </div>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
