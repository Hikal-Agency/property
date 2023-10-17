import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  InputLabel,
  MenuItem, TextField
} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import usePermission from "../../utils/usePermission";
const EditUser = ({ user }) => {
  console.log("Edit User: ", user);
  const [loading, setloading] = useState(false);
  const { currentMode, darkModeColors, t, BACKEND_URL } = useStateContext();
  const { hasPermission } = usePermission();

  const [userData, setUserData] = useState({
    position: "",
    target: "",
    salary: "",
    currency: "",
  });

  const UpdateUser = async (e) => {
    setloading(true);
    const token = localStorage.getItem("auth-token");

    const updated_data = new FormData();
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
        <div className="sm:mt-0 rounded-lg shadow-lg">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-3 md:mt-0">
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
                          InputLabel={t("label_position")}
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
                          label={t("label_target")}
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

                        <div
                          className="mt-4 h-0.5 w-full bg-primary"
                          style={{ marginBottom: "40px" }}
                        ></div>

                        {hasPermission("edit_user") && (
                          <>
                            <TextField
                              id="LeadSource"
                              value={userData?.currency || "AED"}
                              label={t("label_currency")}
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
                                {t("label_currency")}
                                <span className="ml-1 text-primary">
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
                              InputLabel={t("label_salary")}
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
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
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
                    <span>{t("btn_update_user")}</span>
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
