import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";

const EditUser = ({ user }) => {
  const [loading, setloading] = useState(false);
  const { currentMode, darkModeColors, User, BACKEND_URL } = useStateContext();
  const [error, setError] = useState(false);

  const currentDate = new Date();

  function format(value) {
    if (value < 10) {
      return "0" + value;
    } else {
      return value;
    }
  }

  const handleTrainerSwitchChange = async (cellValues) => {
    console.log("Id: ", cellValues?.id);
    const token = localStorage.getItem("auth-token");

    const make_trainer = cellValues?.formattedValue === 1 ? 0 : 1;

    console.log("Make trainer: ", make_trainer);

    const Update_trainer = new FormData();

    Update_trainer.append("is_trainer", make_trainer);

    try {
      const is_trainer = await axios.post(
        `${BACKEND_URL}/updateuser/${cellValues?.id}`,
        Update_trainer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Response: ", is_trainer);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //   AddLead();
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
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5">
                    <div>
                      <Box sx={darkModeColors}>
                        <TextField
                          id="master"
                          type={"password"}
                          label="Update Master Password"
                          className="w-full mb-5"
                          style={{ marginBottom: "20px" }}
                          variant="outlined"
                          size="medium"
                          value={user?.master || ""}
                          //   onChange={(e) => setLeadName(e.target.value)}
                        />

                        <br />

                        <TextField
                          id="packageName"
                          type={"text"}
                          label="Package Name"
                          className="w-full mb-5"
                          value={user?.package_name}
                          style={{ marginBottom: "20px" }}
                          variant="outlined"
                          size="medium"
                          //   error={emailError && emailError}
                          //   helperText={emailError && emailError}
                          //   onChange={handleEmail}
                        />

                        <Select
                          id="LeadSource"
                          value={user?.position}
                          label="Position"
                          size="medium"
                          className="w-full mb-5"
                          displayEmpty
                        >
                          <MenuItem value="" disabled>
                            Position
                          </MenuItem>
                          <MenuItem value={"developer"}>Developer</MenuItem>
                          <MenuItem value={"sales agent"}>Sales Agent</MenuItem>
                          <MenuItem value={"sales manager"}>
                            Sales Manager
                          </MenuItem>
                          <MenuItem value={"social media assisstant"}>
                            Social Media Assistant
                          </MenuItem>
                          <MenuItem value={"marketing head"}>
                            Head Of Marketing
                          </MenuItem>
                          <MenuItem value={"sales head"}>
                            Head Of Marketing
                          </MenuItem>
                          <MenuItem value={"office boy"}>
                            Head Of Marketing
                          </MenuItem>
                          <MenuItem value={"admin assistant"}>
                            Admin Assistant
                          </MenuItem>
                        </Select>

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Date of Birth"
                            value={user?.dob}
                            onChange={(newValue) => {
                              console.log(newValue);
                              //   setDatevalue(newValue);
                              //   setPersonalInfo({
                              //     ...PersonalInfo,
                              //     dob:
                              //       format(newValue?.$d.getUTCFullYear()) +
                              //       "-" +
                              //       format(newValue?.$d.getUTCMonth() + 1) +
                              //       "-" +
                              //       format(newValue?.$d.getUTCDate() + 1),
                              //   });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onKeyDown={(e) => e.preventDefault()}
                                readOnly={true}
                              />
                            )}
                            className="w-full"
                            required
                            maxDate={currentDate}
                            // minDate={minDate}
                            // inputFormat="MM/dd/yyyy"
                            disableFuture
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
