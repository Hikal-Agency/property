import React, { useEffect, useRef, useState } from "react";

import axios from "../axoisConfig";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../context/ContextProvider";
import "../styles/app.css";
import { Link, useLocation } from "react-router-dom";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaEye, FaGoogle } from "react-icons/fa";
import { useGoogleSignIn } from "../context/GoogleAuthProvider";
import { gapi } from "gapi-script";

const Home = () => {
  let canvas = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { BACKEND_URL, User } = useStateContext();
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const {
    gapiInited,
    gisInited,
    gisLoaded,
    initializeGapiClient,
    gapiLoaded,
    tokenClient,
  } = useGoogleSignIn();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleGoogleLogin = async () => {
    console.log("auth clicked::: ");

    tokenClient.current.callback = async (resp) => {
      if (resp.error) {
        console.log("error: ", resp.error);
        toast.error("Failed to sign in with Google", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        throw resp;
      }

      console.log("google login::: ", resp);

      const { access_token, expires_in } = gapi.client.getToken();

      try {
        const getUserDetail = await axios.get(
          `${BACKEND_URL}/auth/google/callback`,
          {
            params: {
              code: access_token,
            },
          }
        );

        if (getUserDetail?.data?.error) {
          console.log("error: ", resp.error);
          toast.error(`${getUserDetail?.data?.error}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          return;
        }

        console.log("user details::: ", getUserDetail);

        if (getUserDetail?.data?.token) {
          const token = getUserDetail?.data?.token;
          localStorage.setItem("auth-token", token);

          document.location.href =
            getUserDetail?.data?.userData?.role === 5
              ? "/attendance/officeSettings"
              : getUserDetail?.data?.userData?.role === 6
              ? "/attendance_self"
              : location?.state?.continueURL || "/dashboard";

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
        }
      } catch (error) {
        console.log("error::: ", error);
        toast.error("This email is not registered.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      const user = {
        accessToken: access_token,
        expiresIn: expires_in,
      };
    };

    if (!(User.accessToken && User.expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new User.
      tokenClient.current.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip the display of the account chooser and consent dialog for an existing User.
      tokenClient.current.requestAccessToken({ prompt: "" });
    }
  };

  // const googleLogin = async () => {
  //   try {
  //     const googleLogin = await axios.get(`${BACKEND_URL}/auth/google`);

  //     console.log("Google response ::: ", googleLogin);
  //     toast.success("Login Successfull. Redirecting.....s", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } catch (error) {
  //     console.log("ERror::::::   ", error);
  //     toast.error("Unbale to login using google. Kindly try again", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };

  // const googleLogin = () => {
  //   try {
  //     const googleLoginURL = `${BACKEND_URL}/auth/google`;

  //     // Redirect to the Google login URL
  //     window.location.href = googleLoginURL;
  //   } catch (error) {
  //     console.log("Error: ", error);
  //     toast.error("Unable to login using Google. Kindly try again", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };

  const LoginUser = async () => {
    setloading(true);
    var bodyFormData = new FormData();
    bodyFormData.append("loginId", formdata.email);
    bodyFormData.append("password", formdata.password);
    // eslint-disable-next-line
    await axios
      .post(`${BACKEND_URL}/login`, bodyFormData)
      .then((result) => {
        setOpenBackDrop(true);
        if (result.data.success && result.data.data.token) {
          const token = result.data.data.token;

          localStorage.setItem("auth-token", token);
          // window.postMessage(
          //   { type: "userLoggedIn", data: token },
          //   window.origin
          // );

          document.location.href =
            result.data.data.role === 5
              ? "/attendance/officeSettings"
              : result.data.data.role === 6
              ? "/attendance_self"
              : location?.state?.continueURL || "/dashboard";
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
          console.log("Login completed successfully");
        }
      })
      .catch((err) => {
        setOpenBackDrop(false);
        toast.error("Wrong Credentials Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    setloading(false);
  };

  const dotsanimation = () => {
    canvas.width = window.innerWidth - 10;
    canvas.height = window.innerHeight;

    var c = canvas.getContext("2d");
    var mouse = {
      x: undefined,
      y: undefined,
    };
    var colorArray = ["#990f13", "#ffffff"];
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    function circle(x, y, dx, dy, radius) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
      this.draw = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        if (
          this.x + this.radius + 10 > window.innerWidth ||
          this.x - this.radius < 0
        ) {
          this.dx = -this.dx;
        }
        if (
          this.y + this.radius > window.innerHeight ||
          this.y - this.radius < 0
        ) {
          this.dy = -this.dy;
        }
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
      };
    }
    var circleArray = [];
    var loopcount = undefined;
    if (window.innerWidth < 800) {
      loopcount = 200;
    } else {
      loopcount = 500;
    }

    for (var i = 1; i <= loopcount; i++) {
      var x = Math.random() * window.innerWidth;
      var y = Math.random() * window.innerHeight;
      var radius = 2.5;
      var dx = (Math.random() - 0.5) * 1;
      var dy = (Math.random() - 0.5) * 1;
      circleArray.push(new circle(x, y, dx, dy, radius));
    }
    animate();
    function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].draw();
      }
    }
  };
  useEffect(() => {
    dotsanimation();
    if (location?.state?.error) {
      console.log("location data: ", location?.state);
      setErrorMsg("😀  The system has been updated, Please login again!");
      setTimeout(() => {
        setErrorMsg(false);
      }, 6000);
    }
    // if (location?.state?.error) {
    //   toast.error(
    //     location?.state?.error
    //       ? location?.state?.error
    //       : "Something Went Wrong! Try Again",
    //     {
    //       position: "top-center",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: false,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     }
    //   );
    // }

    const token = localStorage.getItem("auth-token");
    if (!location?.state?.error) {
      if (token) {
        setOpenBackDrop(true);
        navigate("/dashboard");
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="canvas absolute w-full overflow-x-hidden">
          <canvas ref={(elem) => (canvas = elem)} className="-z-[1]"></canvas>
        </div>
        <div
          className={`LoginWrapper md:h-screen w-screen flex items-center justify-center `}
        >
          <div className="flex min-h-screen items-center justify-center mt-5 pl-3">
            <div className="w-[calc(100vw-50px)] pb-40 md:max-w-[500px] space-y-4 md:space-y-6 bg-white pt-8 relative px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
              {errorMsg && (
                <div className="flex flex-col items-center text-center p-5 bg-[#d4edda] font-bold text-lg">
                  {errorMsg}
                </div>
              )}
              <div>
                <Link to={"/"} className="cursor-pointer">
                  <img
                    className="mx-auto h-[100px] w-auto"
                    src="/assets/blackLogo.png"
                    alt=""
                  />
                </Link>
                <h2 className="mt-6 text-center text-xl font-bold text-[#1c1c1c]">
                  Sign in to your account
                </h2>
              </div>
              <div>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={openBackDrop}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CircularProgress sx={{ color: "white" }} />

                    <h1 className="font-semibold text-lg">
                      Redirecting you to the New World of Real Estate! Please
                      wait a while.
                    </h1>
                  </div>
                </Backdrop>
                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    LoginUser();
                  }}
                >
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="-space-y-px rounded-md">
                    <div>
                      <TextField
                        id="email"
                        type={"text"}
                        label="Login ID"
                        className="w-full"
                        variant="outlined"
                        size="medium"
                        required
                        value={formdata?.email}
                        onChange={(e) => {
                          setformdata({ ...formdata, email: e.target.value });
                        }}
                      />
                    </div>

                    <div className="pt-5 space-y-6">
                      <TextField
                        id="password"
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        className="w-full"
                        variant="outlined"
                        size="medium"
                        required
                        value={formdata?.password}
                        onChange={(e) => {
                          setformdata({
                            ...formdata,
                            password: e.target.value,
                          });
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <FaEye size={18} />
                                ) : (
                                  <FaEye size={18} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
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
                        <span>Sign in</span>
                      )}
                    </button>

                    <hr />
                    <p className="text-center mt-3">Or Login With Google</p>

                    <Box
                      display="flex"
                      justifyContent="center"
                      sx={{
                        marginTop: "5px",
                      }}
                    >
                      <IconButton
                        onClick={handleGoogleLogin}
                        sx={{ borderRadius: "100%", border: "1px solid " }}
                      >
                        <FaGoogle />
                      </IconButton>
                    </Box>

                    <div className="absolute bottom-0 pl-5 py-5 left-0 right-0 flex items-center justify-between bg-main-red-color">
                      <a
                        href="/assets/app-release.apk"
                        download
                        className="text-white font-bold cursor-pointer"
                      >
                        DOWNLOAD THE APP NOW
                      </a>
                      <img
                        className="absolute -top-[40px] right-[12px]"
                        src={`${process.env.PUBLIC_URL}/assets/mockup.png`}
                        width={140}
                        height={140}
                        alt=""
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
