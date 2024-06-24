import { CircularProgress, TextField } from "@mui/material";
//import Image from "next/image";
//import Link from "next/link";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Styles from "../../styles/app.css";

const ForgotPassword = () => {
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <div
        className={`${Styles.LoginWrapper} md:h-screen w-screen flex items-center justify-center `}
      >
        <div className="flex min-h-screen items-center justify-center mt-5 pl-3">
          <div className="w-[calc(100vw-50px)] md:max-w-[500px] space-y-4 md:space-y-6 bg-white py-8 px-5 md:px-10 rounded-sm md:rounded-md z-[5]">
            <div>
              <Link href={"/"} className="cursor-pointer">
                <img
                  height={200}
                  width={200}
                  className="mx-auto h-20 w-auto"
                  src="/assets/blackLogo.png"
                  alt=""
                />
              </Link>
              <h2 className="mt-6 text-center text-lg font-bold text-[#1c1c1c]">
                Reset Your Password
              </h2>
            </div>

            <form
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="-space-y-px rounded-md">
                <div>
                  <TextField
                    id="email"
                    type={"text"}
                    label="Login ID / Email Address"
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
              </div>

              {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-main_bg_color focus:bg-hover_color"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-[#1c1c1c] cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="mt-2 md:mt-0 text-sm">
                <a
                  href="/qwertyui"
                  className="font-medium text-main_bg_color hover:text-hover_color"
                >
                  Forgot your password?
                </a>
              </div>
            </div> */}

              <div>
                {/* <Button
                variant="contained"
                className="w-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                size="large"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <CircularProgress size={25} className="text-white" />
                ) : (
                  <span>Sign In</span>
                )}
              </Button> */}
                <button
                  disabled={loading ? true : false}
                  type="submit"
                  style={{color: "white"}}
                  className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-btn-primary py-3 px-4 text-white focus:outline-none focus:ring-2  text-md font-bold uppercase"
                >
                  {loading ? (
                    <CircularProgress size={25} className="text-white" />
                  ) : (
                    <span>Reset Your Password</span>
                  )}
                </button>
                {/* <div className="flex justify-center">
                <Link href={"/auth/signup"}>
                  <button className="mt-1 h-10 rounded-md bg-transparent text-sm font-medium text-main_bg_color hover:text-hover_color focus:outline-none">
                    Dont Have an Account? Register Now
                  </button>
                </Link>
              </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
