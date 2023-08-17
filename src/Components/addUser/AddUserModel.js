import {
  CircularProgress,
  Modal,
  Backdrop,
  Button,
  IconButton,
} from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import { Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/app.css";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { GridCloseIcon } from "@mui/x-data-grid";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const AddUserModel = ({ handleOpenModel, addUserModelClose }) => {
  const { Managers, User } = useStateContext();
  const { BACKEND_URL, currentMode } = useStateContext();
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(true);
  const [UserRole, setUserRole] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [filterRole, setFilterRole] = useState([]);
  const [allRoles, setAllRoles] = useState([]);

  const handlePassword = (e) => {
    setPasswordError(false);
    const password = e.target.value;

    // Check if password meets the required criteria
    const validPassword =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@#$%^&+=]/.test(password);

    if (validPassword) {
      setPasswordError(false);
    } else {
      setPasswordError(
        "Password must be at least 8 characters long, include numbers, characters, and special characters. Example: Abc123@#"
      );
    }

    setformdata({
      ...formdata,
      password: e.target.value,
    });
  };
  const handleEmail = (e) => {
    setEmailError(false);
    const email = e.target.value;
    const emailRegex = /^\S+@\S+\.\S+$/; // regex pattern to match email address format
    const isValidEmail = emailRegex.test(email);
    if (isValidEmail) {
      setEmailError(false);
    } else {
      setEmailError("Please enter a valid email address");
    }

    setformdata({ ...formdata, userEmail: email });
  };

  const ChangeUserRole = (event) => {
    const selectedRole = event.target.value;
    setUserRole(selectedRole);
    setformdata({ ...formdata, role: selectedRole });
  };

  // sql injuction,
  function isSafeInput(input) {
    const regex = /([';\/*-])/g; // Characters to look for in input
    return !regex.test(input);
  }

  const RegisterUser = async () => {
    const { userName, userEmail, password, c_password, loginId } = formdata;
    if (
      !isSafeInput(userName) ||
      !isSafeInput(userEmail) ||
      !isSafeInput(password) ||
      !isSafeInput(c_password) ||
      !isSafeInput(loginId)
    ) {
      toast.error("Input contains invalid email", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (formdata.password === formdata.c_password) {
      setloading(true);
      const form = { ...formdata };
      if (UserRole === "Sales Manager") {
        const isParent = Managers?.find((m) => m?.role === 2)?.id;
        if (isParent) {
          form["isParent"] = isParent;
        }
      }

      console.log("formdata::: ", form);

      return;
      await axios
        .post(`${BACKEND_URL}/register`, form)
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
          addUserModelClose();
        })
        .catch((err) => {
          console.log("error : ", err);
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
    } else {
      setPasswordError("Your Password & Confirm Password must be Same");
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("auth-token");
    const rolesResult = await axios.get(`${BACKEND_URL}/roles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = rolesResult.data?.role?.data;

    const filterRole = data?.filter(
      (role) =>
        role?.role.toLowerCase() === "admin" ||
        role?.role.toLowerCase() === "head of sales"
    );

    setFilterRole(filterRole);

    console.log("filtered Roles: ", filterRole);
    setAllRoles(data);
    setFetchingRoles(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("User Model: ", formdata);
  return (
    <Modal
      keepMounted
      open={handleOpenModel}
      onClose={addUserModelClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="relative"
    >
      {/* <IconButton
        sx={{
          position: "absolute",
          right: 12,
          top: 10,
          color: "#000000",
        }}
        onClick={addUserModelClose}
      >
        <CloseIcon size={18} color="#000000" />
      </IconButton> */}
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[50%]  ${
          currentMode === "dark" ? "bg-gray-900" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-0 rounded-md`}
      >
        <div className="relative overflow-hidden">
          <div className={``}>
            <div className="flex pt-3 items-center justify-center pl-3">
              {fetchingRoles ? (
                <CircularProgress />
              ) : (
                <div>
                  <div className="pt-20 w-[calc(100vw-50px)] md:max-w-[600px] space-y-4 md:space-y-6 bg-white pb-5 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
                    <IconButton
                      sx={{
                        position: "absolute",
                        right: 12,
                        top: 20,
                        color: currentMode === "dark" ? "#ffffff" : "#000000",
                      }}
                      onClick={addUserModelClose}
                    >
                      <GridCloseIcon size={18} />
                    </IconButton>
                    <div>
                      <h2 className="text-center text-xl font-bold text-gray-900 mt-3">
                        Create A New Account
                      </h2>
                    </div>

                    <form
                      className="mt-8 space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        RegisterUser();
                      }}
                    >
                      <input
                        type="hidden"
                        name="remember"
                        defaultValue="true"
                      />
                      <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md">
                        <div className="col-span-6">
                          <TextField
                            id="username"
                            type={"text"}
                            label="Username"
                            className="w-full mt-3"
                            variant="outlined"
                            size="medium"
                            required
                            value={formdata?.userName}
                            onChange={(e) => {
                              setformdata({
                                ...formdata,
                                userName: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className="col-span-6">
                          <TextField
                            id="email"
                            type={"email"}
                            label="User Email Address"
                            className="w-full"
                            variant="outlined"
                            size="medium"
                            // error={!!emailError}
                            required
                            value={formdata?.userEmail}
                            onChange={handleEmail}
                          />
                        </div>
                        {emailError && (
                          <div className="col-span-6">
                            <p className="italic text-red-900">{emailError}</p>
                          </div>
                        )}

                        <div className="col-span-3">
                          <TextField
                            select
                            id="user-role"
                            value={UserRole}
                            label="User Role"
                            onChange={ChangeUserRole}
                            size="medium"
                            className="w-full"
                            displayEmpty
                            required
                          >
                            <MenuItem value="" disabled>
                              User Role
                            </MenuItem>

                            {allRoles?.map((role, index) => {
                              return (
                                <MenuItem key={index} value={role?.role}>
                                  {role?.role}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </div>
                        <div className="col-span-3">
                          {UserRole === "Sales Agent" && (
                            <TextField
                              select
                              id="managerId"
                              type={"text"}
                              label="Select Manager"
                              className="w-full mb-3"
                              variant="outlined"
                              size="medium"
                              sx={{ marginBottom: "7px" }}
                              required
                              value={formdata?.isParent}
                              onChange={(e) => {
                                setformdata({
                                  ...formdata,
                                  isParent: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value="" disabled>
                                Manager
                              </MenuItem>
                              {Managers?.map((manager, key) => {
                                return (
                                  <MenuItem value={manager?.id} key={key}>
                                    {manager?.userName}
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          )}

                          {UserRole === "Sales Manager" && (
                            <TextField
                              select
                              id="managerId"
                              type={"text"}
                              label="Select Manager"
                              className="w-full mb-3"
                              variant="outlined"
                              size="medium"
                              sx={{ marginBottom: "7px" }}
                              required
                              value={formdata?.isParent}
                              onChange={(e) => {
                                setformdata({
                                  ...formdata,
                                  isParent: e.target.value,
                                });
                              }}
                            >
                              <MenuItem value="" disabled>
                                Manager
                              </MenuItem>
                              {filterRole?.map((parent, key) => {
                                return (
                                  <MenuItem value={parent?.id} key={key}>
                                    {parent?.role}
                                  </MenuItem>
                                );
                              })}
                            </TextField>
                          )}

                          <TextField
                            id="login-id"
                            type={"text"}
                            label="Login ID"
                            className="w-full"
                            variant="outlined"
                            size="medium"
                            required
                            value={formdata?.loginId}
                            onChange={(e) => {
                              setformdata({
                                ...formdata,
                                loginId: e.target.value,
                              });
                            }}
                          />
                        </div>
                        {User?.role === 1 && (
                          <div className="col-span-6">
                            <TextField
                              id="agency"
                              type={"number"}
                              label="Agency Id"
                              className="w-full mt-3"
                              variant="outlined"
                              size="medium"
                              required
                              value={formdata?.agency}
                              onChange={(e) => {
                                setformdata({
                                  ...formdata,
                                  agency: e.target.value,
                                });
                              }}
                            />
                          </div>
                        )}

                        <div className="col-span-3">
                          <TextField
                            id="password"
                            type={"password"}
                            label="Password"
                            className="w-full"
                            variant="outlined"
                            size="medium"
                            required
                            value={formdata?.password}
                            onChange={handlePassword}
                            helperText={"Example: Abc123@#"}
                          />
                        </div>
                        <div className="col-span-3">
                          <TextField
                            id="confirm-password"
                            type={"password"}
                            label="Confirm Password"
                            className="w-full"
                            variant="outlined"
                            size="medium"
                            required
                            value={formdata?.c_password}
                            onChange={(e) => {
                              setPasswordError(false);
                              setformdata({
                                ...formdata,
                                c_password: e.target.value,
                              });
                            }}
                          />
                        </div>
                        {passwordError && (
                          <div className="col-span-6">
                            <p className="italic text-red-900">
                              {passwordError}
                            </p>
                          </div>
                        )}
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
                            <span>Create</span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModel;
