import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import "../../styles/app.css";
import { Link, useLocation } from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AttendanceLogin = () => {
  let canvas = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { BACKEND_URL } = useStateContext();
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [openBackDrop, setOpenBackDrop] = useState(false);

  // function useQuery() {
  //   return new URLSearchParams(location.search);
  // }

  // let query = useQuery();

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
        // console.log(result);
        if (result.data.success && result.data.data.token) {
          localStorage.setItem("auth-token", result.data.data.token);

          let continueURL = location?.state?.continueURL || "/attendance";
          let params = new URLSearchParams(location.search);
          let check = params.get("check");

          // Append the 'check' parameter to the continueURL
          if (check) {
            continueURL += "?check=" + check;
          }

          document.location.href = continueURL;

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
      toast.error(
        location?.state?.error
          ? location?.state?.error
          : "Something Went Wrong! Try Again",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
    const token = localStorage.getItem("auth-token");
    if (!location?.state?.error) {
      if (token) {
        setOpenBackDrop(true);
        navigate("/attendance");
      }
    }
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* <Head>
        <title>HIKAL CRM - LOGIN</title>
        <meta
          name="description"
          content="Login into Your Account - HIKAL CRM"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head> */}
      <ToastContainer />
      <div className="relative overflow-hidden">
        <div className="canvas absolute w-full overflow-x-hidden">
          <canvas ref={(elem) => (canvas = elem)} className="-z-[1]"></canvas>
        </div>
        <div
          className={`LoginWrapper md:h-screen w-screen flex items-center justify-center `}
        >
          <div className="flex min-h-screen items-center justify-center mt-5 pl-3">
            <div className="w-[calc(100vw-50px)] md:max-w-[500px] space-y-4 md:space-y-6 bg-white py-8 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
              <div>
                <Link to={"/"} className="cursor-pointer">
                  <img
                    className="mx-auto h-[100px] w-auto"
                    src="/assets/blackLogo.png"
                    alt=""
                  />
                </Link>
                <h2 className="mt-6 text-center text-xl font-bold text-gray-900">
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
                      Redirecting you to the New World of Real Estate ! Please
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
                        type={"password"}
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
                      />
                    </div>
                    {/* <div className="pt-5 space-y-6">
                      <FormControl
                        className="w-full mt-1 mb-5"
                        variant="outlined"
                        required
                      >
                        <InputLabel
                          id="check"
                          sx={{
                            color: "#000000 !important",
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
                        >
                          <MenuItem value="" disabled>
                            Check
                          </MenuItem>

                          <MenuItem value={"checkin"}>Check In</MenuItem>
                          <MenuItem value={"agent"}>Check Out</MenuItem>
                        </Select>
                      </FormControl>
                    </div> */}
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
                    {/* <div className="flex justify-center">
                      <Link
                        to={"/auth/signup"}
                        state={{ continueURL: location?.state?.continueURL }}
                        onClick={() => setOpenBackDrop(true)}
                      >
                        <button className="mt-1 h-10 rounded-md bg-transparent text-sm font-medium text-main_bg_color hover:text-hover_color focus:outline-none">
                          Don&apos;t Have an Account? Register Now
                        </button>
                      </Link>
                    </div> */}
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

export default AttendanceLogin;
