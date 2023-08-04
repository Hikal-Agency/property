import React from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import axios from "../../axoisConfig";
import { ToastContainer, toast } from "react-toastify";
import { useEffect } from "react";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import LiveDateTimeComponent from "./LiveDateTimeComponent";
import { RiRadioButtonLine } from "react-icons/ri";
import { BsDot } from "react-icons/bs";

import { arrayUnion } from "firebase/firestore";
import moment from "moment";

const RegisterAttendance = () => {
  const {
    BACKEND_URL,
    darkModeColors,
    User,
    setUser,
    currentMode,
    setopenBackDrop,
  } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("auth-token");

  console.log("USer: ", User);
  const [loading, setLoading] = useState(false);
  const [attendanceTime, setAttendanceTime] = useState(null);

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  let query = useQuery();

  const check = query.get("check");
  const guid = query.get("guid");

  console.log("check,guid :::: ", check, guid);
  const currentDateTime = moment().format("YY-MM-DD HH:mm:ss");

  console.log("dateeeeeeeeeee: ", currentDateTime);

  const MarkAttendance = async (status) => {
    setLoading(true);
    try {
      // const date = new Date();
      // const day = ("0" + date.getDate()).slice(-2);
      // const month = ("0" + (date.getMonth() + 1)).slice(-2);
      // const year = date.getFullYear();
      const date = new Date().toLocaleString();
      const currentDateTime = moment().format("YY-MM-DD HH:mm:ss");
      console.log("dateeeeeeeeeee: ", currentDateTime);

      const AddAttendance = new FormData();

      const attendanceType = check === "in" ? "Check-in" : "Check-out";

      AddAttendance.append("user_id", User?.id);
      AddAttendance.append("check_datetime", currentDateTime);
      AddAttendance.append("attendance_type", attendanceType);
      AddAttendance.append("attendance_source", "qr");
      AddAttendance.append("agency_id", User?.agency || "");

      const registerAttendance = await axios.post(
        `${BACKEND_URL}/attendance`,
        AddAttendance,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Document successfully written!", registerAttendance);
      toast.success(`Successfully Checked-${status}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Error writing document: ", error);
      toast.error(`Unable to mark attendance. Kindly try again.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  const FetchProfile = async (token) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data is stored in local storage, parse and set it in state
      setUser(JSON.parse(storedUser));
      console.log("storedUser", storedUser);

      console.log("User from navbar", User);
    } else {
      await axios
        .get(`${BACKEND_URL}/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then((result) => {
          console.log("User data is");
          console.log(result.data);

          // Create a new object with only the specific fields you want to store
          const user = {
            addedBy: result.data.user[0].addedBy,
            addedFor: result.data.user[0].addedFor,
            agency: result.data.user[0].agency,
            created_at: result.data.user[0].created_at,
            creationDate: result.data.user[0].creationDate,
            displayImg: result.data.user[0].profile_picture,
            expiry_date: result.data.user[0].expiry_date,
            gender: result.data.user[0].gender,
            id: result.data.user[0].id,
            idExpiryDate: result.data.user[0].idExpiryDate,
            isParent: result.data.user[0].isParent,
            is_online: result.data.user[0].is_online,
            joiningDate: result.data.user[0].joiningDate,
            loginId: result.data.user[0].loginId,
            loginStatus: result.data.user[0].loginStatus,
            master: result.data.user[0].master,
            nationality: result.data.user[0].nationality,
            notes: result.data.user[0].notes,
            old_password: result.data.user[0].old_password,
            package_name: result.data.user[0].package_name,
            plusSales: result.data.user[0].plusSales,
            position: result.data.user[0].position,
            profile_picture: result.data.user[0].profile_picture,
            role: result.data.user[0].role,
            status: result.data.user[0].status,
            target: result.data.user[0].target,
            uid: result.data.user[0].uid,
            updated_at: result.data.user[0].updated_at,
            userEmail: result.data.user[0].userEmail,
            userName: result.data.user[0].userName,
            userType: result.data.user[0].userType,
          };

          setUser(user);

          console.log("Localstorage: ", user);

          // Save user data to local storage
          localStorage.setItem("user", JSON.stringify(user));
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 401) {
            setopenBackDrop(false);
            setLoading(false);

            localStorage.removeItem("auth-token");
            localStorage.removeItem("user");
            localStorage.removeItem("leadsData");
            navigate("/", {
              state: {
                error: "Please login to proceed.",
                continueURL: location.pathname,
              },
            });
            return;
          }
          toast.error("Sorry something went wrong. Kindly refresh the page.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  };
  useEffect(() => {
    console.log("attendnace page.");
    if (User?.id && User?.loginId) {
      FetchProfile(token);
    } else {
      if (token) {
        FetchProfile(token);
      } else {
        navigate("/attendanceLogin" + location.search, {
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
    <>
      <div
        style={{
          height: "96vh",
          backgroundImage: "url('/assets/wallapp.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="overflow-hidden"
      >
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
                currentMode !== "dark"
                  ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                  : "none",
            }}
          >
            <div className="flex items-center">
              <div className="flex items-center rounded-lg pl-1 cursor-pointer">
                <Link to="/dashboard">
                  {currentMode === "dark" ? (
                    <img
                      className="w-[70px]"
                      src="/assets/lightLogo.png"
                      alt="logo"
                    />
                  ) : (
                    <img
                      className="w-[70px]"
                      src="/assets/blackLogo.png"
                      alt="logo"
                    />
                  )}
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

        <div className="grid place-items-center h-screen ">
          <div
            className={`${
              currentMode === "dark"
                ? "bg-[#111827] text-white"
                : "bg-[#E5E7EB] text-black"
            } flex flex-col items-center p-10 rounded-md  sm:w-3/5 md:w-2/5 lg:w-1/3 xl:w-1/5 `}
            style={{ borderRadius: "20px" }}
          >
            <div className={`w-24 h-24 mb-4  rounded-full`}>
              {User?.profile_picture ? (
                <img
                  src={User?.profile_picture}
                  className={`rounded-md object-cover w-full h-full border rounded-full ${
                    currentMode === "dark" ? "border-white" : "border-black"
                  } `}
                  style={{ borderRadius: "50px" }}
                  alt=""
                />
              ) : (
                <Avatar
                  alt="User"
                  variant="circular"
                  className={`border ${
                    currentMode === "dark" ? "border-white" : "border-black"
                  }`}
                  style={{ width: "96px", height: "96px" }}
                />
              )}
            </div>

            {/* <div className="flex items-center space-x-0 text-lg font-bold mb-3">
              {check === "in" ? (
                <>
                  <h2>In</h2>
                  <BsDot style={{ color: "green" }} size={40} />
                </>
              ) : (
                <>
                  <h2>Out</h2>
                  <BsDot style={{ color: "red" }} size={40} />
                </>
              )}
            </div> */}
            <h1
              className={`${
                currentMode === "dark" ? "#ffffff" : "#000000"
              } font-semibold  mt-3 `}
              style={{ textTransform: "capitalize" }}
            >
              {User?.userName}
            </h1>
            <h6
              className={`text-[#DA1F26] font-semibold rounded-md p-2 text-sm `}
              style={{ textTransform: "capitalize" }}
            >
              {User?.position}
            </h6>
            <h6
              className={` text-[#DA1F26] font-semibold  p-2 text-sm `}
              style={{ textTransform: "capitalize" }}
            >
              {User?.deprtment}
            </h6>
            {/* <h6 className="mb-3 p-2">desc</h6> */}

            <h3 className="">
              {check === "in" ? "Check-in Time" : "Check-out Time"}
            </h3>
            <h1 className="font-semibold mb-3">
              <LiveDateTimeComponent setAttendanceTime={setAttendanceTime} />
            </h1>
            {/* <hr
              className={`mb-3 w-full ${
                currentMode === "dark" ? "border-white" : "border-black"
              }`}
            ></hr> */}

            {check === "in" ? (
              <button
                onClick={() => MarkAttendance("in")}
                className={`mb-3 bg-[#008000] text-white p-2 rounded-full w-full text-center ${
                  loading ? "relative" : ""
                }`}
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    // className="absolute inset-0 m-auto"
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Check In"
                )}
              </button>
            ) : (
              <button
                onClick={() => MarkAttendance("out")}
                className={`mb-3 mt-2 bg-main-red-color text-white p-2 rounded-md w-full text-center ${
                  loading ? "relative" : ""
                } `}
                style={{ textTransform: "capitalize", cursor: "pointer" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    // className="absolute inset-0 m-auto"
                    size={24}
                    color="inherit"
                  />
                ) : (
                  <span>Check Out</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterAttendance;
