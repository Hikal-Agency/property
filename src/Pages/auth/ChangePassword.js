import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { ChangePassword as ChangePasswordComponent } from "../../Components/profile/ChangePassword";
import Footer from "../../Components/Footer/Footer";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MdEmail } from "react-icons/md";
import { Button } from "@material-tailwind/react";

const ChangePassword = () => {
  const { User, currentMode } =
  useStateContext();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setloading(false);
  }, []);
  return (
    <>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${currentMode === "dark" ? "bg-black" : "bg-white"}`}
          >
              <div className="w-full">
                <div className="px-5 w-full">
                  <Navbar />
                  <div className="mt-3">
                    <h1
                      className={`text-xl border-l-[4px] ml-1 pl-1 mb-5 font-bold ${
                        currentMode === "dark"
                          ? "text-white border-white"
                          : "text-red-600 font-bold border-red-600"
                      }`}
                    >
                      Change Password
                    </h1>
                  </div>
                  <div className="my-5 mb-10">
                    <div
                      className={`grid grid-cols-12 sm:grid-cols-12 md:grid-cols-8 ${
                        currentMode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900 "
                      } rounded-md shadow-md`}
                    >
                      <div className="col-span-12 sm:col-span12 md:col-span-3 py-10 ">
                        <div className="accountinfo px-5 pt-10 ">
                          <div className="flex justify-center flex-col items-center">
                            <div className="relative">
                              <img
                                src={User?.displayImg}
                                width={200}
                                height={200}
                                alt=""
                                className="rounded-full mx-auto w-28"
                              />
                            </div>
                            <div className="mt-3">
                              <h1 className="text-lg font-bold text-center">
                                {User?.userName}
                              </h1>
                              <h3
                                className={`${
                                  currentMode === "dark"
                                    ? "text-gray-50"
                                    : "text-gray-600"
                                }  text-center`}
                              >
                                {User?.position}
                              </h3>
                            </div>
                            <div
                              className={`mt-5 text-center ${
                                currentMode === "dark"
                                  ? "text-gray-50"
                                  : "text-gray-600"
                              }`}
                            >
                              <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
                                <MdEmail size={25} className="block" />
                                <h1>Email Address</h1>
                              </div>
                              {User?.userEmail}
                            </div>
                            <div
                              className={`mt-3 text-center ${
                                currentMode === "dark"
                                  ? "text-gray-50"
                                  : "text-gray-600"
                              }`}
                            >
                              <div className="flex items-center justify-center font-semibold mb-1">
                                <h1 className="block">Status:&nbsp;</h1>{" "}
                                <p className="font-bold">Active</p>
                              </div>
                              <div className="mt-3">
                                <h1>Profile Created on: </h1>
                                <p className="font-bold">
                                  {User?.creationDate}
                                </p>
                              </div>
                            </div>

                            {User?.role === 1 ? (
                              <div className="mt-5 text-center text-gray-600">
                                <Button
                                  className="px-2 bg-main-red-color shadow-none hover:shadow-none"
                                  ripple={true}
                                >
                                  Delete Acount
                                </Button>
                              </div>
                            ) : (
                              <></>
                            )}
                            
                          </div>
                        </div>
                      </div>
                      {/* section 2 */}
                      <div className="col-span-12 sm:col-span-12 md:col-span-5 mr-10">
                        <div className="h-full w-full flex items-center justify-center">
                          <div className={` ${currentMode === "dark" ? "bg-gray-900" : "bg-white"} px-10 py-20 shadow-sm w-full rounded-md`}>
                            <ChangePasswordComponent />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <Footer />
          </div>
        )}
      </div>
    </>
  );
};

export default ChangePassword;
