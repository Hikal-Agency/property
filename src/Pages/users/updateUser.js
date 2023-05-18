import { Button } from "@material-tailwind/react";
import Switch from "@mui/material/Switch";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import Footer from "../../Components/Footer/Footer";

import { AiOutlineEdit } from "react-icons/ai";
import SingleUser from "../../Components/Users/SingleUser";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EditUser from "../../Components/Users/EditUser";
import { useLocation } from "react-router-dom";

const UpdateUser = () => {
  const { currentMode, DataGridStyles, BACKEND_URL, pageState, setpageState } =
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
      <ToastContainer />
      <div className="flex min-h-screen">
        <div
          className={`w-full ${
            currentMode === "dark" ? "bg-black" : "bg-white"
          }`}
        >
            <div className={`w-full `}>
              <div className="px-5">
                
                <div className="my-5 mb-10">
                  <div className="my-3">
                    <h2
                      className={` ${
                        currentMode === "dark" ? "text-white" : "text-black"
                      } font-semibold text-xl`}
                    >
                      Edit User:{" "}
                      <span className="text-main-red-color font-bold">
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
          <Footer />
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
