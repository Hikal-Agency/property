import { CircularProgress, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/app.css";
// import axios from "axios";
import axios from "../../axoisConfig";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [UserRole, setUserRole] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const { BACKEND_URL } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("role: ", UserRole);

  const handlePassword = (e) => {
    setPasswordError(false);
    const password = e.target.value;

    // Check if password meets the required criteria
    const validPassword =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@#$%^&+=]/.test(password);

    if (validPassword) {
      setPasswordError(false);
    } else {
      setPasswordError(
        "Password must be at least 8 characters long, include numbers, characters, and special characters. Example: Abc123@#"
      );
    }

    setformdata({
      ...formdata,
      password: e.target.value,
    });
  };
  const handleEmail = (e) => {
    setEmailError(false);
    const email = e.target.value;
    const emailRegex = /^\S+@\S+\.\S+$/; // regex pattern to match email address format
    const isValidEmail = emailRegex.test(email);
    if (isValidEmail) {
      setEmailError(false);
    } else {
      setEmailError("Please enter a valid email address");
    }

    setformdata({ ...formdata, userEmail: email });
  };

  const ChangeUserRole = (event) => {
    setUserRole(event.target.value);
    if (event.target.value === "manager") {
      setformdata({ ...formdata, isParent: 3 });
    } else if (event.target.value === "agent") {
      setformdata({ ...formdata, isParent: 7 });
    }
  };

  // sql injuction
  function isSafeInput(input) {
    const regex = /([';\/*-])/g; // Characters to look for in input
    return !regex.test(input);
  }

  const RegisterUser = async () => {
    const { userName, userEmail, password, c_password, loginId, managerId } =
      formdata;
    if (
      !isSafeInput(userName) ||
      !isSafeInput(userEmail) ||
      !isSafeInput(password) ||
      !isSafeInput(c_password) ||
      !isSafeInput(loginId)
    ) {
      toast.error("Input contains invalid email", {
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
    if (formdata.password === formdata.c_password) {
      setloading(true);
      await axios
        .post(`${BACKEND_URL}/register`, formdata)
        .then((result) => {
          console.log("result", result);
          if (result.data.success) {
            toast.success("Registration Completed Successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
            localStorage.setItem("auth-token", result.data.data.token);
            // router.push("/dashboard");
            window.location.href = location?.state?.continueURL || "/dashboard";
          }
          setloading(false);
        })
        .catch((err) => {
          toast.error("Something went Wrong! Please Try Again", {
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
        });
    } else {
      setPasswordError("Your Password & Confirm Password must be Same");
    }
  };
  return (
    <>
      
      {/* <Head>
        <title>HIKAL CRM - Create a new Account</title>
        <meta name="description" content="Create a New Account - HIKAL CRM" />
      </Head> */}
      <div className="relative overflow-hidden">
        <div
          className={`LoginWrapper md:h-screen w-screen flex items-center justify-center `}
        >
          <div className="flex min-h-screen items-center justify-center mt-5 pl-3">
            <div className="w-[calc(100vw-50px)] md:max-w-[600px] space-y-4 md:space-y-6 bg-white py-8 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
              <div>
                <Link to={"/"} className="cursor-pointer">
                  <img
                    height={200}
                    width={200}
                    className="mx-auto h-20 w-auto"
                    src="/assets/blackLogo.png"
                    alt=""
                  />
                </Link>
                <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
                  Create A New Account
                </h2>
              </div>

              <form
                className="mt-8 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  RegisterUser();
                }}
              >
                <input type="hidden" name="remember" defaultValue="true" />
                <div className="grid grid-cols-6 gap-x-3 gap-y-5 rounded-md">
                  <div className="col-span-6">
                    <TextField
                      id="login-id"
                      type={"text"}
                      label="Login ID"
                      className="w-full"
                      variant="outlined"
                      size="medium"
                      required
                      value={formdata?.loginId}
                      onChange={(e) => {
                        setformdata({ ...formdata, loginId: e.target.value });
                      }}
                    />
                  </div>
                  <div className="col-span-3">
                    <TextField
                      id="password"
                      type={"password"}
                      label="Password"
                      className="w-full"
                      variant="outlined"
                      size="medium"
                      required
                      value={formdata?.password}
                      onChange={handlePassword}
                      helperText={"Example: Abc123@#"}
                    />
                  </div>
                  <div className="col-span-3">
                    <TextField
                      id="confirm-password"
                      type={"password"}
                      label="Confirm Password"
                      className="w-full"
                      variant="outlined"
                      size="medium"
                      required
                      value={formdata?.c_password}
                      onChange={(e) => {
                        setPasswordError(false);
                        setformdata({
                          ...formdata,
                          c_password: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {passwordError && (
                    <div className="col-span-6">
                      <p className="italic text-red-900">{passwordError}</p>
                    </div>
                  )}

                  <div className="col-span-3">
                    <Select
                      id="user-role"
                      value={UserRole}
                      label="User Role"
                      onChange={ChangeUserRole}
                      size="medium"
                      className="w-full"
                      displayEmpty
                      required
                    >
                      <MenuItem value="" disabled>
                        User Role
                      </MenuItem>
                      {/* <MenuItem value={"admin"}>Admin</MenuItem> */}
                      <MenuItem value={"manager"}>Manager</MenuItem>
                      <MenuItem value={"agent"}>Agent</MenuItem>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    {UserRole === "agent" && (
                      <TextField
                        id="managerId"
                        type={"text"}
                        label="Enter your managers code"
                        className="w-full mb-3"
                        variant="outlined"
                        size="medium"
                        sx={{ marginBottom: "7px" }}
                        required
                        value={formdata?.isParent}
                        onChange={(e) => {
                          setformdata({
                            ...formdata,
                            isParent: e.target.value,
                          });
                        }}
                      />
                    )}
                    <TextField
                      id="username"
                      type={"text"}
                      label="Username"
                      className="w-full mt-3"
                      variant="outlined"
                      size="medium"
                      required
                      value={formdata?.userName}
                      onChange={(e) => {
                        setformdata({ ...formdata, userName: e.target.value });
                      }}
                    />
                  </div>
                  <div className="col-span-6">
                    <TextField
                      id="email"
                      type={"email"}
                      label="User Email Address"
                      className="w-full"
                      variant="outlined"
                      size="medium"
                      // error={!!emailError}
                      required
                      value={formdata?.userEmail}
                      onChange={handleEmail}
                    />
                  </div>
                  {emailError && (
                    <div className="col-span-6">
                      <p className="italic text-red-900">{emailError}</p>
                    </div>
                  )}
                </div>
                <div>
                  <button
                    disabled={loading ? true : false}
                    type="submit"
                    className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-main-red-color py-3 px-4 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
                  >
                    {loading ? (
                      <CircularProgress
                        sx={{ color: "white" }}
                        size={25}
                        className="text-white"
                      />
                    ) : (
                      <span>Register</span>
                    )}
                  </button>
                  <div className="flex justify-center">
                    <Link
                      to={"/"}
                      state={{ continueURL: location?.state?.continueURL }}
                    >
                      <button className="mt-1 h-10 rounded-md bg-transparent text-sm font-medium text-main_bg_color hover:text-hover_color focus:outline-none">
                        Already have an Account? Sign in
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
