import React, { useEffect, useRef, useState } from "react";

import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";
import "../../styles/app.css";
import { Link, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { gapi } from "gapi-script";
// some comments
const TwoStepAuth = ({
  user,
  token,
  setisTwoStepVerification,
  sendCodeForTwoFA,
}) => {
  let canvas = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { BACKEND_URL, User } = useStateContext();
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendOtpTime, setResendOtpTime] = useState(60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const verifyOpt = async () => {
    let bodyFormData = new FormData();
    bodyFormData.append("email_otp", otp);
    bodyFormData.append("userEmail", user?.userEmail);
    // JSON.stringify({
    //   otp: otp,
    //   userEmail: email,
    // })
    try {
      const res = await axios.post(
        `${BACKEND_URL}/verify_email_otp`,
        bodyFormData
      );

      // console.log(, "status");
      if (res.data.status) {
        document.location.href =
          user.role === 5
            ? "/officeSettings"
            : user.role === 6
            ? "/attendance_self"
            : location?.state?.continueURL || "/dashboard";
        localStorage.setItem("auth-token", token);

        toast.success("Login Successfull", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("Invalid Code", {
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

      console.log("Login completed successfully");
    } catch (error) {
      toast.error("Something Went Wrong", {
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
    if (resendOtpTime > 0) {
      const timerId = setInterval(() => {
        setResendOtpTime(resendOtpTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      setIsButtonDisabled(false);
    }
  }, [resendOtpTime]);

  const handleResendOtp = () => {
    // Logic to resend OTP goes here
    setResendOtpTime(60);
    setIsButtonDisabled(true);
    sendCodeForTwoFA();
  };

  return (
    <>
      <div className="flex min-h-screen mb-5 items-center justify-center mt-5 pl-3">
        <div className="w-[calc(100vw-50px)]  pb-10 md:max-w-[500px] space-y-4 md:space-y-6 bg-white  relative px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
          <div className="px-9">
            <h2 className="mt-6 text-center text-3xl font-bold text-[#1c1c1c] py-6 ">
              Enter Verification Code
            </h2>
            <p className="text-gray-400 text-[14px] px-4">
              {`Please enter the verification code sent to your email ${user?.userEmail}.`}
            </p>
            <div className="mt-5 flex flex-col gap-[20px]">
              {/* <input
                type="text"
                name=""
                id=""
                placeholder="Enter verification code"
                className=" px-3 py-3 border w-full rounded"
                onChange={(e) => setOtp(e?.target?.value)}
              /> */}
              <TextField
                id="code"
                type={"text"}
                label="Code"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={otp}
                onChange={(e) => {
                  setOtp(e?.target?.value);
                }}
              />

              <button
                className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-main-red-color py-3 px-4 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
                onClick={() => verifyOpt()}
              >
                Verify
              </button>
              <button
                className="text-center  w-full py-3 text-gray-400"
                onClick={() => setisTwoStepVerification(false)}
              >
                Cancel
              </button>
              <p className="text-[14px] text-center">
                Didn't receive a code? <br></br>{" "}
                {isButtonDisabled ? (
                  <>
                    {" "}
                    <span>Please wait</span>{" "}
                    <span className="text-sky-600">
                      00:
                      {resendOtpTime > 9
                        ? resendOtpTime
                        : `0${resendOtpTime}`}{" "}
                    </span>
                  </>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="hover:text-sky-500"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default TwoStepAuth;
