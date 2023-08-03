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

import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import usePermission from "../../utils/usePermission";
const EditUser = ({ user }) => {
  console.log("Edit User: ", user);
  const [loading, setloading] = useState(false);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
  const { hasPermission } = usePermission();

  const [error, setError] = useState(false);
  const [userData, setUserData] = useState({
    position: "",
    target: "",
    salary: "",
    currency: "",
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

    // if (!userData?.expiry_date) {
    //   setloading(false);

    //   toast.error("Kindly enter a valid date..", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });

    //   return;
    // }

    updated_data.append("position", userData?.position);
    updated_data.append("target", userData?.target);
    updated_data.append("salary", userData?.salary);
    updated_data.append("currency", userData?.currency);

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
        position: user?.position,
        target: user?.target,
        salary: user?.salary,
        currency: user?.currency,
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
                        <InputLabel id="position">Position</InputLabel>
                        <TextField
                          id="position"
                          value={userData?.position}
                          InputLabel="Position"
                          size="medium"
                          className="w-full mb-5"
                          displayEmpty
                          required
                          onInput={(e) =>
                            setUserData({
                              ...userData,
                              position: e.target.value,
                            })
                          }
                          sx={{
                            "& input": {
                              color: currentMode === "light" && "#000000",
                            },
                            marginBottom: "20px",
                            "& .Mui-selected": {
                              color: currentMode === "light" && "#000000",
                            },
                          }}
                        ></TextField>

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

                        <div className="mb-5 h-0.5 w-full bg-[#DA1F26]"></div>

                        {/* <InputLabel id="currency">Currency</InputLabel>
                        <TextField
                          id="currency"
                          value={userData?.currency}
                          InputLabel="currency"
                          size="medium"
                          className="w-full mb-2"
                          type="number"
                          displayEmpty
                          required
                          onInput={(e) =>
                            setUserData({
                              ...userData,
                              currency: e.target.value,
                            })
                          }
                          sx={{
                            "& input": {
                              color: currentMode === "light" && "#000000",
                            },
                            marginBottom: "20px",
                            "& .Mui-selected": {
                              color: currentMode === "light" && "#000000",
                            },
                          }}
                        >
                        </TextField> */}

                        {hasPermission("edit_user") && (
                          <>
                            <TextField
                              id="LeadSource"
                              value={userData?.currency || "AED"}
                              label="Currency"
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  currency: e.target.value,
                                })
                              }
                              size="medium"
                              className="w-full mb-5"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                                "& .MuiOutlinedInput-input": {
                                  color:
                                    currentMode === "dark"
                                      ? "#ffffff"
                                      : "#000000",
                                },
                              }}
                              displayEmpty
                              select
                              required
                            >
                              <MenuItem value="" disabled>
                                Currency
                                <span className="ml-1" style={{ color: "red" }}>
                                  *
                                </span>
                              </MenuItem>
                              <MenuItem value={"AED"}>AED</MenuItem>
                              <MenuItem value={"USD"}>USD</MenuItem>
                              <MenuItem value={"PKR"}>PKR</MenuItem>
                              <MenuItem value={"SAR"}>SAR</MenuItem>
                              <MenuItem value={"EGP"}>EGP</MenuItem>
                              <MenuItem value={"ILS"}>ILS</MenuItem>
                            </TextField>

                            <br />

                            <InputLabel id="salary">Salary</InputLabel>
                            <TextField
                              id="salary"
                              value={userData?.salary}
                              InputLabel="Salary"
                              size="medium"
                              className="w-full mb-2"
                              type="number"
                              displayEmpty
                              required
                              onInput={(e) =>
                                setUserData({
                                  ...userData,
                                  salary: e.target.value,
                                })
                              }
                              sx={{
                                "& input": {
                                  color: currentMode === "light" && "#000000",
                                },
                                marginBottom: "20px",
                                "& .Mui-selected": {
                                  color: currentMode === "light" && "#000000",
                                },
                              }}
                            ></TextField>
                          </>
                        )}
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
