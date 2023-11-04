import React, { useEffect, useRef, useState } from "react";
import axios from "../axoisConfig";
import { useStateContext } from "../context/ContextProvider";
import "../styles/app.css";
import { Link } from "react-router-dom";
import { CircularProgress, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const MeetInvite = () => {
  let canvas = useRef();
  const { BACKEND_URL } = useStateContext();
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { meetingID } = useParams();

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
  }, []);

  const redirectUser = async () => {
    setloading(true);
    const fullName = formdata?.fullName;
    try {
      const joinAsAttendee = await axios.post(
        `${BACKEND_URL}/attendee`,
        JSON.stringify({
          meetingID,
          fullName: fullName?.replaceAll(" ", ""),
        }),
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: "Bearer " + token,
          },
        }
      );

      setloading(false);

      const urlForAttendee = joinAsAttendee?.data?.url;

      setIsRedirecting(true);
      setTimeout(() => {
        window.location = urlForAttendee;
        setIsRedirecting(false);
      }, 2500);
    } catch (error) {
      console.log(error);
      toast.error("Unable to join meeting at the moment.", {
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
    }
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="canvas absolute w-full overflow-x-hidden">
          <canvas ref={(elem) => (canvas = elem)} className="-z-[1]"></canvas>
        </div>
        <div
          className={`LoginWrapper md:h-screen w-screen flex items-center justify-center `}
          style={{
            backgroundImage: "url('/assets/wallapp.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex min-h-screen items-center justify-center mt-5 pl-3">
            <div className="w-[calc(100vw-50px)] md:max-w-[500px] space-y-4 md:space-y-6 bg-white py-8 px-5 md:px-10 rounded-lg md:rounded-md z-[5]">
              <div>
                <Link to={"/"} className="cursor-pointer">
                  <img
                    className="mx-auto h-[100px] w-auto"
                    src="/assets/blackLogo.png"
                    alt=""
                  />
                </Link>
                <h2 className="mt-6 text-center text-lg font-bold text-[#1c1c1c]">
                  Join the meeting!
                </h2>
              </div>

              <div>
                <form
                  className="mt-8 space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    redirectUser();
                  }}
                >
                  <div className="-space-y-px rounded-md">
                    <div>
                      <TextField
                        id="full-name"
                        type={"text"}
                        label="Full Name"
                        className="w-full"
                        variant="outlined"
                        size="medium"
                        required
                        value={formdata?.fullName}
                        onChange={(e) => {
                          setformdata({
                            ...formdata,
                            fullName: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      disabled={loading ? true : false}
                      type="submit"
                      className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-full border border-transparent bg-main-red-color py-3 px-4 text-white hover:bg-main-red-color-2 focus:outline-none focus:ring-2 focus:ring-main-red-color-2 focus:ring-offset-2 text-md font-bold uppercase"
                    >
                      {loading ? (
                        <CircularProgress
                          sx={{ color: "white" }}
                          size={25}
                          className="text-white"
                        />
                      ) : (
                        <span>Join</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isRedirecting && (
        <div className="flex fixed z-[100000] bg-black text-white top-0 left-0 w-screen h-screen flex-col justify-center items-center">
          <h1 className="text-4xl mb-6">
            Redirecting you to the meeting
          </h1>
          <div id="fountainG">
            <div id="fountainG_1" className="fountainG"></div>
            <div id="fountainG_2" className="fountainG"></div>
            <div id="fountainG_3" className="fountainG"></div>
            <div id="fountainG_4" className="fountainG"></div>
            <div id="fountainG_5" className="fountainG"></div>
            <div id="fountainG_6" className="fountainG"></div>
            <div id="fountainG_7" className="fountainG"></div>
            <div id="fountainG_8" className="fountainG"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default MeetInvite;
