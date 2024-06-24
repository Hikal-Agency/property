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
  const [checkinLoading, setCheckInLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [attendanceTime, setAttendanceTime] = useState(null);
  const [attendanceType, setAttendanceType] = useState(null);

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
    console.log("status: ", status);

    setLoading(true);
    try {
      // const date = new Date();
      // const day = ("0" + date.getDate()).slice(-2);
      // const month = ("0" + (date.getMonth() + 1)).slice(-2);
      // const year = date.getFullYear();
      const date = new Date().toLocaleString();
      const currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log("dateeeeeeeeeee: ", currentDateTime);

      const AddAttendance = new FormData();

      const attendanceType = status === "in" ? "Check-in" : "Check-out";
      status === "in" ? setCheckInLoading(true) : setCheckoutLoading(true);

      AddAttendance.append("user_id", User?.id);
      AddAttendance.append("check_datetime", currentDateTime);
      AddAttendance.append("attendance_type", attendanceType);
      AddAttendance.append("attendance_source", "QR");
      AddAttendance.append(
        "default_datetime",
        attendanceType === "Check-in" ? "09:30 AM" : "06:30 PM"
      );
      AddAttendance.append("agency_id", User?.agency || 1);

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
      navigate("/attendance_self");
    } catch (error) {
      console.error("Error writing document: ", error);

      toast.error(error.response.data.data, {
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
      setCheckoutLoading(false);
      setCheckInLoading(false);
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

  const FetchAttendance = async (token) => {
    try {
      const currentDate = moment().format("YYYY-MM-DD");
      const oneDayBefore = moment(currentDate)
        .subtract(1, "days")
        .format("YYYY-MM-DD");
      const oneDayAfter = moment(currentDate)
        .add(1, "days")
        .format("YYYY-MM-DD");

      const response = await axios.get(
        `${BACKEND_URL}/attendance?user_id=${User?.id}`,
        {
          params: {
            page: 1,
            agency_id: User?.agency || 1,
            date_range: [oneDayBefore, oneDayAfter].join(","),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("attendance res:: ", response);

      const sortedData = response.data.Record.data.sort((a, b) => {
        const timeA = moment(a?.check_datetime, "YYYY-MM-DD HH:mm:ss").toDate();
        const timeB = moment(b?.check_datetime, "YYYY-MM-DD HH:mm:ss").toDate();

        // Sort in descending order (latest time first)
        return timeB - timeA;
      });

      console.log("sorted attendance:: ", sortedData);

      const currentDayAttendance = sortedData?.find((row) => {
        const rowDate = moment(row?.check_datetime, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        return rowDate === currentDate;
      });

      console.log("current Day Attendnace:: ", currentDayAttendance);

      const attendanceType =
        currentDayAttendance?.attendance_type || "Not Available";
      console.log("Attendance Type for Current Date:", attendanceType);
      setAttendanceType(attendanceType);
      setDataLoading(false);
    } catch (error) {
      setDataLoading(false);
      console.error("Error fetching attendance:", error);
      toast.error(`Unable to fetch attendance`, {
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
    console.log("attendnace page.");
    if (User?.id && User?.loginId) {
      FetchProfile(token);
    } else {
      if (token) {
        FetchProfile(token);
        // FetchAttendance(token);
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

  useEffect(() => {
    FetchAttendance();
  }, [User]);

  return (
    <>
      <div
        style={{
          height: "100vh",
          backgroundImage: "url('/assets/wallapp.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="overflow-hidden"
      >
        {/* HEADER  */}
        <div className="fixed top-0 w-full grid grid-cols-2 items-center gap-5 p-4">
          <Link to="/dashboard">
            <img className="w-[80px]" src="/assets/whiteLogo.png" alt="logo" />
          </Link>
          <h1
            className={`${
              currentMode === "dark" ? "text-white" : "text-dark"
            } font-semibold text-end uppercase`}
          >
            Attendance
          </h1>
        </div>

        {/* CARD  */}
        <div className="w-full h-full flex items-center justify-center">
          <div
            className={`w-[80%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[20%] text-white p-4 text-center rounded-xl shadow-md `}
            style={{
              border: "1px solid #AAAAAA",
              background: "rgba(28,28,28,0.8)",
            }}
          >
            <div className="flex flex-col items-center justify-center gap-5">
              {/* PROFILE PICTURE  */}
              {User?.profile_picture ? (
                <img
                  src={User?.profile_picture}
                  className={`object-cover w-[100px] h-[100px] border rounded-full`}
                />
              ) : (
                <Avatar
                  alt="User"
                  variant="circular"
                  className={`object-cover w-[100px] h-[100px] border rounded-full`}
                  style={{ width: "100px", height: "100px" }}
                />
              )}

              {/* USER NAME  */}
              <h1
                className={`font-semibold uppercase`}
                // style={{ textTransform: "capitalize" }}
              >
                {User?.userName}
              </h1>

              {/* CHECK TIME  */}
              <div className="text-center text-sm">
                <h3 className="">Check Time</h3>
                <h1 className="font-semibold">
                  <LiveDateTimeComponent
                    setAttendanceTime={setAttendanceTime}
                  />
                </h1>
              </div>

              {/* CHECK IN AND OUT BUTTON  */}
              {!dataLoading && (
                <div className="my-3 gap-3 w-full h-full flex flex-col">
                  <button
                    onClick={() => MarkAttendance("in")}
                    className={`bg-green-600 text-white font-semibold p-2 rounded-xl shadow-md w-full text-center ${
                      loading ? "relative" : ""
                    }`}
                    style={{ textTransform: "capitalize", cursor: "pointer" }}
                    disabled={checkinLoading}
                  >
                    {checkinLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <span className="uppercase">Check In</span>
                    )}
                  </button>
                  <button
                    onClick={() => MarkAttendance("out")}
                    className={`bg-red-600 text-white font-semibold p-2 rounded-xl shadow-md w-full text-center ${
                      loading ? "relative" : ""
                    } `}
                    style={{ textTransform: "capitalize", cursor: "pointer" }}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <span className="uppercase">Check Out</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterAttendance;
