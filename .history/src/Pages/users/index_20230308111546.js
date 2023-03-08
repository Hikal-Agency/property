import { Button } from "@material-tailwind/react";
import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Sidebarmui from "../../Components/Sidebar/Sidebarmui";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import { GeneralInfo as GeneralInfoTab } from "../../Components/profile/GeneralInfo.jsx";
import { PersonalInfo as PersonalInfoTab } from "../../Components/profile/PersonalInfo";
import { ChangePassword as ChangePasswordTab } from "../../Components/profile/ChangePassword";
import Loader from "../../Components/Loader";
import Footer from "../../Components/Footer/Footer";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [loading, setloading] = useState(true);
  const {
    User,
    setUser,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();

  return (
    <>
    {/* <ToastContainer/> */}
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            <div className="flex">
              <Sidebarmui />
              <div className={`w-full `}>
                <div className="px-5">
                  <Navbar />

                  <div className="my-5 mb-10">
                    <div
                      className={`grid grid-cols-8 ${
                        currentMode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900 "
                      } rounded-md shadow-md`}
                    >
                      <div className="col-span-2 border-r-2 border-gray-400  py-10 ">
                        <h1 className="text-xl font-semibold pb-10 text-center">
                          User Account
                        </h1>
                        <div className="accountinfo border-t-2 border-gray-400 px-5 pt-10 ">
                          <div className="flex justify-center flex-col items-center">
                            <div className="relative">
                              <img
                                src={User?.displayImg}
                                width={200}
                                height={200}
                                alt=""
                                className="rounded-full mx-auto w-28"
                              />
                              <div className="absolute -top-1 right-1 ">
                                <BsFillPlusCircleFill
                                  className="text-main-red-color bg-white border-white border-[3px] rounded-full w-full h-full"
                                  size={30}
                                />
                              </div>
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
                                <h1 className="block">Status: </h1>{" "}
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
                                  className="bg-main-red-color shadow-none hover:shadow-none p-3"
                                  ripple={true}
                                >
                                  DELETE
                                </Button>
                              </div>
                            ) : (
                              <></>
                            )}
                            
                          </div>
                        </div>
                      </div>
                      {/* section 2 */}
                      <div className="col-span-6 ">
                        <Box
                          sx={darkModeColors}
                          className="pb-7 mt-8 border-b-2 border-gray-400 pl-5"
                        >
                          <Tabs
                            sx={darkModeColors}
                            value={value}
                            onChange={handleChange}
                            variant="standard"
                          >
                            <Tab label="General Info" />
                            <Tab label="Personal Info " />
                            <Tab label="Change Password"/>
                          </Tabs>
                        </Box>
                        <div className="px-7 pt-12">
                          <TabPanel value={value} index={0}>
                            <GeneralInfoTab
                              btnloading={btnloading}
                              GeneralInfoData={GeneralInfoData}
                              UpdateProfile={UpdateProfile}
                              User={User}
                            />
                          </TabPanel>
                          <TabPanel value={value} index={1}>
                            <PersonalInfoTab
                              UpdateProfile={UpdateProfile}
                              btnloading={btnloading}
                              PersonalInfoData={PersonalInfo}
                              User={User}
                            />
                          </TabPanel>
                          <TabPanel value={value} index={2}>
                            <ChangePasswordTab />
                          </TabPanel>
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
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default Users;
