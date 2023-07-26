import {
  CircularProgress,
  Modal,
  Backdrop,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import { Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/app.css";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RolesCheckbox from "./RolesCheckbox";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const UpdateUserPermissions = ({
  UserModelOpen,
  handleUserModelClose,
  UserData,
  UserName,
  userRole,
}) => {
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [UserRole, setUserRole] = useState([]);
  const { BACKEND_URL, currentMode } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth-token");

  console.log("user role list:  ", UserRole);

  const UpdateRole = async () => {
    setloading(true);
    await axios
      .post(`${BACKEND_URL}/register`, formdata)
      .then((result) => {
        console.log("result", result);
        if (result.data.success) {
          toast.success("Registration Completed Successfully", {
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
        setloading(false);
        handleUserModelClose();
      })
      .catch((err) => {
        toast.error("Something went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setloading(false);
      });
  };

  const fetchRoles = async () => {
    setloading(true);
    await axios
      .get(`${BACKEND_URL}/roles`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("result", result);

        setUserRole(result?.data?.role?.data);

        setloading(false);
      })
      .catch((err) => {
        console.log("roles err: ", err);
        toast.error("Unable to fetch roles.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setloading(false);
      });
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  console.log("User Model: ");
  return (
    <Modal
      keepMounted
      open={UserModelOpen}
      onClose={handleUserModelClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[40%]  absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <div className="relative overflow-hidden">
          <div className={``}>
            <div className="flex  items-center justify-center pl-3">
              <div className="w-[calc(100vw-50px)] md:max-w-[600px] space-y-4 md:space-y-6 bg-white pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
                <div>
                  <h2 className="text-center mt-3 text-xl font-bold text-gray-900">
                    Update Role of <span className="text-red">{UserName}</span>
                  </h2>
                </div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateRole();
                  }}
                >
                  <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md">
                    {UserRole?.length > 0
                      ? UserRole?.map((role) => (
                          <div className="col-span-2">
                            <RolesCheckbox role={role} defaultRole={UserData} />
                          </div>
                        ))
                      : "No Roles"}
                  </div>

                  <div>
                    <button
                      disabled={loading ? true : false}
                      type="submit"
                      className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-main-red-color py-3 px-4 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
                    >
                      {loading ? (
                        <CircularProgress
                          sx={{ color: "white" }}
                          size={25}
                          className="text-white"
                        />
                      ) : (
                        <span>Update</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateUserPermissions;
