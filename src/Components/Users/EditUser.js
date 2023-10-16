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

const EditUser = ({ 
  user 
}) => {
  console.log("Edit User: ", user);
  const [loading, setloading] = useState(false);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
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
        <div className="shadow-lg rounded-lg w-full h-fit">
          <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} text-center font-semibold p-3 uppercase rounded-t-lg`}>
            Edit user details
          </div>
          <div className="p-5">
            <Box sx={darkModeColors} className="py-5">
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                {/* POSITION  */}
                <TextField
                  id="position"
                  label="Position"
                  value={userData?.position}
                  size="small"
                  className="w-full"
                  displayEmpty
                  required
                  onInput={(e) =>
                    setUserData({
                      ...userData,
                      position: e.target.value,
                    })
                  }
                  sx={{
                    marginBottom: "15px",
                  }}
                />

                {/* SALARY  */}
                {hasPermission("edit_user") && (
                  <div className="grid grid-cols-3">
                    <TextField
                      id="LeadSource"
                      size="small"
                      value={userData?.currency || "AED"}
                      label="Currency"
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          currency: e.target.value,
                        })
                      }
                      className="w-full"
                      sx={{
                        marginBottom: "15px",
                      }}
                      displayEmpty
                      select
                      required
                    >
                      <MenuItem value="" disabled>
                        Currency
                      </MenuItem>
                      <MenuItem value={"AED"}>AED</MenuItem>
                      <MenuItem value={"USD"}>USD</MenuItem>
                      <MenuItem value={"PKR"}>PKR</MenuItem>
                      <MenuItem value={"SAR"}>SAR</MenuItem>
                      <MenuItem value={"EGP"}>EGP</MenuItem>
                      <MenuItem value={"ILS"}>ILS</MenuItem>
                    </TextField>

                    <TextField
                      id="salary"
                      value={userData?.salary}
                      label="Salary"
                      size="small"
                      className="w-full col-span-2"
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
                        marginBottom: "15px",
                      }}
                    ></TextField>
                  </div>
                )}

                {/* TARGET  */}
                {user?.role === 3 || user?.role === 7 && (
                  <TextField
                    id="target"
                    type={"number"}
                    label="Target"
                    className="w-full"
                    sx={{
                      marginBottom: "15px",
                    }}
                    variant="outlined"
                    size="small"
                    value={userData?.target}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        target: e.target.value,
                      })
                    }
                  />
                )}
              </div>
            </Box>
            <Button
              className={`card-hover min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none  bg-btn-primary`}
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
                <span>Update User</span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
