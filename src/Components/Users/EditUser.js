import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import axios from "axios";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const EditUser = ({ user }) => {
  console.log("Edit User: ", user);
  const [loading, setloading] = useState(false);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState({
    master: "",
    package_name: "",
    position: "",
    expiry_date: "",
    target: "",
  });

  console.log("UserData: ", userData);

  const currentDate = new Date();

  function format(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  const UpdateUser = async (e) => {
    setloading(true);
    const token = localStorage.getItem("auth-token");

    const updated_data = new FormData();

    if (!userData?.expiry_date) {
      setloading(false);

      toast.error("Kindly enter a valid date..", {
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

    updated_data.append("master", userData?.master);
    updated_data.append("package_name", userData?.package_name || "");
    updated_data.append("position", userData?.position);
    updated_data.append("expiry_date", userData?.expiry_date);
    updated_data.append("target", userData?.target);

    try {
      const UpdateUser = await axios.post(
        `${BACKEND_URL}/updateuser/${user?.id}`,
        updated_data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("User updated successfully.", {
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

      console.log("Response: ", UpdateUser);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Unable to update user.", {
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
    if (user) {
      setUserData({
        master: user?.master,
        package_name: !user?.package_name === "null" ? user?.package_name : "",
        position: user?.position,
        expiry_date: user?.expiry_date,
        target: user?.target,
      });
    }
  }, [user]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          UpdateUser();
        }}
        disabled={loading ? true : false}
      >
        <div className="mt-5 sm:mt-0 rounded-lg shadow-lg">
          <div className="md:grid md:grid-cols-3 md:gap-6 mt-4">
            <div className="mt-10 md:col-span-3 md:mt-0">
              <div className="sm:rounded-md">
                <div
                  className={`${
                    currentMode === "dark" ? "bg-black" : "bg-white"
                  } py-10 px-4 md:px-10 `}
                >
                  {/* <div className="mb-10"></div> */}
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 md:grid-cols- sm:grid-cols-1 gap-5">
                    <div>
                      <Box sx={darkModeColors}>
                        <TextField
                          id="master"
                          type={"password"}
                          label="Update Master Password"
                          className={`w-full mb-5 ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                          sx={{
                            marginBottom: "20px",
                            input: {
                              color: `${
                                currentMode === "dark" ? "#ffffff" : "#000000"
                              }`,
                            },
                          }}
                          variant="outlined"
                          size="medium"
                          value={userData?.master}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              master: e.target.value,
                            })
                          }
                          fullWidth
                        />

                        <br />

                        <TextField
                          id="target"
                          type={"number"}
                          label="Target"
                          className={`w-full mb-5 ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                          sx={{
                            marginBottom: "20px",
                            input: {
                              color: `${
                                currentMode === "dark" ? "#ffffff" : "#000000"
                              }`,
                            },
                          }}
                          variant="outlined"
                          size="medium"
                          value={userData?.target}
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              target: e.target.value,
                            })
                          }
                        />

                        <br />

                        <TextField
                          id="packageName"
                          type={"text"}
                          label="Package Name"
                          className="w-full mb-5"
                          value={userData?.package_name}
                          sx={{
                            marginBottom: "20px",
                            input: {
                              color: `${
                                currentMode === "dark" ? "#ffffff" : "#000000"
                              }`,
                            },
                          }}
                          variant="outlined"
                          size="medium"
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              package_name: e.target.value,
                            })
                          }
                        />

                        <InputLabel id="position">Position</InputLabel>
                        <Select
                          id="position"
                          value={userData?.position || "no position"}
                          InputLabel="Position"
                          size="medium"
                          className="w-full mb-5"
                          displayEmpty
                          onChange={(e) =>
                            setUserData({
                              ...userData,
                              position: e.target.value,
                            })
                          }
                          sx={{
                            marginBottom: "20px",
                            "& .Mui-selected": {
                              color: currentMode === "light" && "#000000",
                            },
                          }}
                          renderValue={(selected) => (
                            <span
                              style={{
                                color:
                                  currentMode === "dark"
                                    ? "#ffffff"
                                    : "#000000",
                              }}
                            >
                              {selected}
                            </span>
                          )}
                        >
                          <MenuItem value="no position">
                            Select Position
                          </MenuItem>
                          <MenuItem value={"IT Administration"}>
                            IT Administration
                          </MenuItem>
                          <MenuItem value={"developer"}>Developer</MenuItem>
                          <MenuItem value={"Sales Agent"}>Sales Agent</MenuItem>
                          <MenuItem value={"Sales Manager"}>
                            Sales Manager
                          </MenuItem>
                          <MenuItem value={"Social Media Assistant"}>
                            Social Media Assistant
                          </MenuItem>
                          <MenuItem value={"Head of Marketing"}>
                            Head Of Marketing
                          </MenuItem>
                          <MenuItem value={"Head of Sales"}>
                            Head Of Sales
                          </MenuItem>
                          <MenuItem value={"Admin Assistant"}>
                            Admin Assistant
                          </MenuItem>
                        </Select>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Expiry Date"
                            value={userData?.expiry_date}
                            onChange={(newValue) => {
                              console.log(newValue);
                              //   setDatevalue(newValue);
                              setUserData({
                                ...userData,
                                expiry_date:
                                  format(newValue?.$d.getUTCFullYear()) +
                                  "-" +
                                  format(newValue?.$d.getUTCMonth() + 1) +
                                  "-" +
                                  format(newValue?.$d.getUTCDate() + 1),
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                sx={{
                                  input: {
                                    color: `${
                                      currentMode === "dark"
                                        ? "#ffffff"
                                        : "#000000"
                                    }`,
                                  },
                                  svg: {
                                    color:
                                      currentMode === "dark"
                                        ? "#ffffff !important"
                                        : "#000000 !important",
                                  },
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                                readOnly={true}
                              />
                            )}
                            className={`w-full ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-black"
                            }`}
                            required
                            // maxDate={currentDate}
                            // minDate={minDate}
                            // inputFormat="MM/dd/yyyy"
                            // disableFuture
                            sx={{
                              marginBottom: "20px",
                              input: {
                                color: `${
                                  currentMode === "dark" ? "#ffffff" : "#000000"
                                }`,
                              },
                              "& .MuiSvgIcon-root": {
                                color: "red",
                              },
                            }}
                            invalidDateMessage="Invalid date"
                            mask="__/__/____"
                          />
                        </LocalizationProvider>
                      </Box>
                    </div>
                  </div>
                  {/* ------- */}
                </div>
              </div>
              <div
                className={`${
                  currentMode === "dark" ? "bg-black" : "bg-white"
                } px-4 py-3 text-right sm:px-6`}
              >
                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-main-red-color`}
                  ripple={true}
                  size="lg"
                  type="submit"
                  disabled={loading ? true : false}
                >
                  {loading ? (
                    <CircularProgress
                      size={23}
                      sx={{ color: "white" }}
                      className="text-white"
                    />
                  ) : (
                    <span> Update User</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
