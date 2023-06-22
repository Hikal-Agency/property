import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";

const RegisterAttendance = () => {
  const { currentMode, BACKEND_URL, darkModeColors, User } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  let query = useQuery();

  const check = query.get("check");
  const guid = query.get("guid");

  console.log("check,guid :::: ", check, guid);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (User?.id && User?.loginId) {
      // FetchProfile(token);
    } else {
      if (token) {
        // FetchProfile(token);
      } else {
        navigate("/attendanceLogin", {
          state: {
            error: "Please login to register attendance.",
            continueURL: location.pathname,
          },
        });
      }
    }

    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ height: "96vh" }} className="overflow-hidden">
      <div>
        <div
          className="flex justify-between items-center p-2 relative w-full"
          style={{
            position: "fixed",
            top: 0,
            // left: 0,
            right: 0,
            zIndex: "20",
            backgroundColor:
              currentMode === "dark" ? "black" : "rgb(229 231 235)",
            boxShadow:
              currentMode !== "dark" ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
          }}
        >
          <div className="flex items-center">
            <div className="flex items-center rounded-lg pl-1 cursor-pointer">
              <Link to="/dashboard">
                <img src="./favicon.png" className="w-10 h-10" />
              </Link>
            </div>
          </div>

          <div className="flex">
            <h1
              className={`${
                currentMode === "dark" ? "text-white" : "text-dark"
              } font-bold`}
            >
              Register Attendance
            </h1>
          </div>
        </div>
      </div>
      <ToastContainer />
      <div style={{ display: "block" }} className="pt-20 px-5 overflow-hidden">
        {" "}
        <div className="pt-5 space-y-6">
          <FormControl className="w-full mt-1 mb-5" variant="outlined" required>
            <InputLabel
              id="check"
              sx={{
                color:
                  currentMode === "dark"
                    ? "#ffffff !important"
                    : "#000000 !important",
              }}
            >
              Check
            </InputLabel>
            <Select
              id="check"
              //   value={UserRole}
              label="User Role"
              //   onChange={ChangeUserRole}
              size="medium"
              className="w-full"
              displayEmpty
              required
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                },
                "&:hover:not(.Mui-disabled):before": {
                  borderColor: currentMode === "dark" ? "#ffffff" : "#000000",
                },
              }}
            >
              <MenuItem value="" disabled>
                Check
              </MenuItem>

              <MenuItem value={"checkin"}>Check In</MenuItem>
              <MenuItem value={"agent"}>Check Out</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
    </div>
  );

  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default RegisterAttendance;
