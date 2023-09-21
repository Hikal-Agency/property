import {
  CircularProgress,
  Modal,
  Backdrop, IconButton
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import React, { useEffect, useState } from "react";
import "../../styles/app.css";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import RolesCheckbox from "./RolesCheckbox";
import { GridCloseIcon } from "@mui/x-data-grid";

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
  const [dataLoading, setDataLoading] = useState(false);
  const [UserRole, setUserRole] = useState([]);
  const { BACKEND_URL } = useStateContext();
  const token = localStorage.getItem("auth-token");

  console.log("user role list:  ", UserRole);

  const UpdateRole = async () => {
    setloading(true);

    await axios
      .post(
        `${BACKEND_URL}/updateuser/${UserData}`,
        { role: parseInt(formdata) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("result", result);

        toast.success("Role Updated Successfully", {
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
    setDataLoading(true);
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

        setDataLoading(false);
      })
      .catch((err) => {
        setDataLoading(false);

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
        className={`w-[calc(100%-20px)] md:w-[60%]  absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <div className="relative overflow-hidden">
          <div className={``}>
            <div className="flex  items-center justify-center pl-3">
              <div className="w-[calc(100vw-50px)] md:max-w-[600px] space-y-4 md:space-y-6 bg-white pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
                <div>
                  <IconButton
                    sx={{
                      position: "absolute",
                      // right: 4,
                      top: 10,
                      color: "#000000",
                    }}
                    onClick={handleUserModelClose}
                  >
                    <GridCloseIcon size={18} />
                  </IconButton>
                  <h2 className="text-center mt-3 text-xl font-bold text-[#1c1c1c] py-4">
                    Update Role of{" "}
                    <span className="text-primary" style={{fontWeight: "700" }}>
                      {UserName}
                    </span>
                  </h2>
                </div>

                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    UpdateRole();
                  }}
                >
                  <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md justify-center items-center w-full h-full">
                    {" "}
                    {dataLoading ? (
                      <div
                        className="w-full flex justify-center items-center"
                        style={{
                          width: "500px",
                        }}
                      >
                        <CircularProgress />
                      </div>
                    ) : UserRole?.length > 0 ? (
                      UserRole?.map((role) => (
                        <div className="col-span-2">
                          <RolesCheckbox
                            role={role}
                            defaultRole={userRole}
                            formData={formdata}
                            setFormData={setformdata}
                          />
                        </div>
                      ))
                    ) : (
                      "No Roles"
                    )}
                  </div>

                  <div>
                    <button
                      disabled={loading ? true : false}
                      type="submit"
                      className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-btn-primary py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 text-md font-bold uppercase"
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
