import { CircularProgress, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/app.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Signup = () => {
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [UserRole, setUserRole] = useState("");
  const [SamePasswordError, setSamePasswordError] = useState(false);
  const { BACKEND_URL } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();

  const ChangeUserRole = (event) => {
    setUserRole(event.target.value);
    if (event.target.value === "manager") {
      setformdata({ ...formdata, isParent: 3 });
    } else if (event.target.value === "agent") {
      setformdata({ ...formdata, isParent: 7 });
    }
  };

  const RegisterUser = async () => {
    if (formdata.password === formdata.c_password) {
      setloading(true);
      await axios
        .post(`${BACKEND_URL}/register`, formdata)
        .then((result) => {
          console.log(result);
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
            navigate(location?.state?.continueURL || "/dashboard");
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
      setSamePasswordError(true);
    }
  };
  return (
    <>
      <ToastContainer />
      {/* <Head>
        <title>HIKAL CRM - Create a new Account</title>
        <meta name="description" content="Create a New Account - HIKAL CRM" />
      </Head> */}
      <div className="relative overflow-hidden">
        <div
          className={`LoginWrapper md:h-screen w-screen flex items-center justify-center `}
        >
          <div className="flex min-h-screen items-center justify-center mt-5 px-2">
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
                      onChange={(e) => {
                        setSamePasswordError(false);
                        setformdata({ ...formdata, password: e.target.value });
                      }}
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
                        setSamePasswordError(false);
                        setformdata({
                          ...formdata,
                          c_password: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {SamePasswordError && (
                    <div className="col-span-6">
                      <p className="italic text-red-900">
                        Your Password & Confirm Password must be Same
                      </p>
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
                    <TextField
                      id="username"
                      type={"text"}
                      label="Username"
                      className="w-full"
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
                      required
                      value={formdata?.userEmail}
                      onChange={(e) => {
                        setformdata({ ...formdata, userEmail: e.target.value });
                      }}
                    />
                  </div>
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
                    <Link to={"/"} state={{continueURL: location?.state?.continueURL}}>
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
