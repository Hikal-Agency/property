import React from "react";
import {
  Avatar,
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
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import LiveDateTimeComponent from "./LiveDateTimeComponent";
import { RiRadioButtonLine } from "react-icons/ri";

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
  console.log("USer: ", User);
  const [loading, setLoading] = useState(false);

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  let query = useQuery();

  const check = query.get("check");
  const guid = query.get("guid");

  console.log("check,guid :::: ", check, guid);

  // useEffect(() => {
  //   const checkConnection = async () => {
  //     try {
  //       // const data = await db.collection("attendance").get();
  //       const data = collection(db, "attendance");
  //       const attendance = await getDocs(data);
  //       console.log(
  //         "Connected to Firestore successfully:",
  //         attendance.docs.map((doc) => doc.data())
  //       );
  //     } catch (error) {
  //       console.error("Failed to connect to Firestore:", error);
  //     }
  //   };

  //   checkConnection();
  // }, []);

  const FetchProfile = async (token) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      // If user data is stored in local storage, parse and set it in state
      setUser(JSON.parse(storedUser));

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

          console.log("USer: ", user);
        })
        .catch((err) => {
          console.log(err);
          if (err.response?.status === 401) {
            setopenBackDrop(false);
            // setloading(false);

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
    const token = localStorage.getItem("auth-token");
    if (User?.id && User?.loginId) {
      FetchProfile(token);
    } else {
      if (token) {
        FetchProfile(token);
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
      <div className="grid place-items-center h-screen ">
        <div
          className={`${
            currentMode === "dark"
              ? "bg-[#111827] text-white"
              : "bg-[#E5E7EB] text-black"
          } flex flex-col items-center p-5 rounded-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4`}
        >
          <div className="w-24 h-24 mb-4">
            {User?.profile_picture ? (
              <img
                src={User?.profile_picture}
                className="rounded-md cursor-pointer object-cover w-full h-full"
                alt=""
              />
            ) : (
              <Avatar
                alt="User"
                variant="circular"
                style={{ width: "96px", height: "96px" }}
              />
            )}
          </div>
          <hr
            className={`mb-3 w-full ${
              currentMode === "dark" ? "border-white" : "border-black"
            }`}
          ></hr>
          <div className="flex items-center space-x-1 text-lg font-bold mb-3">
            {check === "in" ? (
              <>
                <h2>In</h2>
                <RiRadioButtonLine
                  style={{ color: "green", fontSize: "20px" }}
                />
              </>
            ) : (
              <>
                <h2>Out</h2>
                <RiRadioButtonLine style={{ color: "red", fontSize: "20px" }} />
              </>
            )}
          </div>
          <h1
            className="bg-main-red-color text-white font-semibold rounded-md p-2 mb-3"
            style={{ textTransform: "capitalize" }}
          >
            {User?.userName}
          </h1>
          {/* <h6 className="mb-3 p-2">desc</h6> */}
          <hr
            className={`mb-3 w-full ${
              currentMode === "dark" ? "border-white" : "border-black"
            }`}
          ></hr>
          <h1 className="font-semibold mb-3">
            <LiveDateTimeComponent />
          </h1>
          <hr
            className={`mb-3 w-full ${
              currentMode === "dark" ? "border-white" : "border-black"
            }`}
          ></hr>

          {check === "in" ? (
            <>
              <h6
                className="mb-3 bg-[#008000] text-white p-2 rounded-md"
                style={{ textTransform: "capitalize", cursor: "pointer" }}
              >
                Check In
              </h6>
            </>
          ) : (
            <>
              <h6
                className="mb-3 mt-2 bg-main-red-color text-white p-2 rounded-md"
                style={{ textTransform: "capitalize", curson: "pointer" }}
              >
                Check Out
              </h6>
            </>
          )}
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
