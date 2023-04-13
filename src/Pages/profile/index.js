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
import { useNavigate, useLocation } from "react-router-dom";

const ProfilePage = () => {
  const [loading, setloading] = useState(true);
  const {
    User,
    setUser,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
  } = useStateContext();
  const [error, setError] = useState(null);
  const [GeneralInfoData, setGeneralInfo] = useState({
    userAltContact: "",
    userAltEmail: "",
    userEmail: "",
    userContact: "",
  });
  const [PersonalInfo, setPersonalInfo] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(null);

  // Btn loading
  const [btnloading, setbtnloading] = useState(false);

  // COUNTER FOR TABS
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const FetchProfile = async (token) => {
    await axios
      .get(`${BACKEND_URL}/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("fetched profile ", result.data);
        setUser(result.data.user[0]);
        setGeneralInfo({
          userContact: result.data.user[0].userContact,
          userAltContact: result.data.user[0].userAltContact,
          userEmail: result.data.user[0].userEmail,
          userAltEmail: result.data.user[0].userAltEmail,
        });
        setPersonalInfo({
          nationality: result.data.user[0].nationality,
          currentAddress: result.data.user[0].currentAddress,
          dob: result.data.user[0].dob,
          gender: result.data.user[0].gender,
        });

        console.log("Personal info: ", PersonalInfo.address);
        // setgender(User?.gender);
        setloading(false);
      })
      .catch((err) => {
        console.log("here is error");
        console.log(err);
        navigate("/", {
          state: {
            error: "Something Went Wrong! Please Try Again",
            continueURL: location.pathname,
          },
        });
      });
  };

  useEffect(() => {
    setopenBackDrop(false);
    const token = localStorage.getItem("auth-token");
    if (token) {
      FetchProfile(token);
    } else {
      navigate("/", {
        state: { error: "Something Went Wrong! Please Try Again" },
      });
    }
    // eslint-disable-next-line
  }, []);

  // const UpdateProfile = async (data) => {
  //   console.log("Profile: ", data);
  //   if (data?.userAltEmail) {
  //     console.log("email: ", data?.userAltEmail);

  //     const onlyLetters = /^[A-Za-z]*$/;
  //     if (!onlyLetters.test(data?.userAltEmail)) {
  //       return;
  //     }
  //   }
  //   setbtnloading(true);
  //   const token = localStorage.getItem("auth-token");
  //   await axios
  //     .post(`${BACKEND_URL}/updateuser/${User.id}`, JSON.stringify(data), {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + token,
  //       },
  //     })
  //     .then((result) => {
  //       console.log("Profile Updated successfull");
  //       console.log(result);
  //       toast.success("Profile Updated Successfully", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       const token = localStorage.getItem("auth-token");
  //       if (token) {
  //         FetchProfile(token);
  //       } else {
  //         navigate("/", {
  //           state: { error: "Something Went Wrong! Please Try Again" },
  //         });
  //       }
  //       setbtnloading(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Error in Updating Profile", {
  //         position: "top-right",
  //         autoClose: 3000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       setbtnloading(false);
  //     });
  // };

  // const handlePickImage = (event) => {
  //   const reader = new FileReader();
  //   const file = event.target.files[0];
  //   console.log("file: ", file);
  //   reader.onloadend = () => {
  //     setSelectedImage(reader?.result);
  //     console.log("onload: ", file);
  //   };
  //   // reader.readAsDataURL(file);

  //   reader?.readAsDataURL(new Blob([file], { type: file.type.slice(6) }));

  //   console.log("reader: ", reader);
  //   console.log("reader result: ", reader.result);
  //   console.log("Uploaded image: ", selectedImage);
  // };

  // const handlePickImage = (event) => {
  //   console.log(event);
  //   if (event.target && event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     console.log("file: ", file);
  //     setSelectedImage((imageFile) => file);
  //     console.log("Select: ", selectedImage);

  //     if (file.type.startsWith("image/")) {
  //       // setSelectedImage(file);
  //       console.log("selected IMAGE: ", selectedImage);
  //     } else {
  //       console.log("Invalid file type: ", file.type);
  //     }
  //   } else {
  //     console.log("No file selected");
  //   }
  //   console.log("selected image: ", selectedImage);
  // };

  const UpdateProfile = async (data) => {
    console.log("Profile: ", data);

    // if (data?.userAltEmail) {
    //   // check if data contains userAltEmail
    //   console.log("email: ", data?.userAltEmail);

    //   const emailRegex = /^\S+@\S+\.\S+$/;
    //   if (!emailRegex.test(data?.userAltEmail)) {
    //     return;
    //   }
    // }

    // if (data?.userAltEmail) {
    //   // check if data contains userAltEmail
    //   console.log("email is here: ", data?.userAltEmail);

    //   // regex for validating the username
    //   const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$/;
    //   // regex for validating the domain name
    //   const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
    //   // regex for validating the TLD
    //   const tldRegex = /^[a-zA-Z]+$/;

    //   const parts = data.userAltEmail.split("@");
    //   if (parts.length !== 2) {
    //     // the email address must contain one "@" symbol

    //     return;
    //   }

    //   const username = parts[0];
    //   const domain = parts[1].split(".");
    //   if (domain.length < 2) {
    //     // the domain name must contain at least one "." symbol
    //     return;
    //   }

    //   const tld = domain[domain.length - 1];
    //   const domainName = domain.slice(0, domain.length - 1).join(".");

    //   if (
    //     !usernameRegex.test(username) ||
    //     !domainRegex.test(domainName) ||
    //     !tldRegex.test(tld)
    //   ) {
    //     console.log("Email is not valid");
    //     toast.error("Invalid Email", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //     return;
    //   }
    // }

    const validateEmail = (email) => {
      // regex for validating the username
      const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]$/;
      // regex for validating the domain name
      const domainRegex = /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$/;
      // regex for validating the TLD
      const tldRegex = /^[a-zA-Z]+$/;

      const parts = email.split("@");
      if (parts.length !== 2) {
        // the email address must contain one "@" symbol
        return false;
      }

      const username = parts[0];
      const domain = parts[1].split(".");
      if (domain.length < 2) {
        // the domain name must contain at least one "." symbol
        return false;
      }

      const tld = domain[domain.length - 1];
      const domainName = domain.slice(0, domain.length - 1).join(".");

      if (
        !usernameRegex.test(username) ||
        !domainRegex.test(domainName) ||
        !tldRegex.test(tld)
      ) {
        // the email address contains invalid characters
        return false;
      }

      return true;
    };

    if (data?.userAltEmail) {
      // check if data contains userAltEmail
      console.log("email is here: ", data?.userAltEmail);
      if (!validateEmail(data.userAltEmail)) {
        console.log("Email is not valid");
        toast.error("Invalid Alternate Email", {
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
    }

    if (data?.userEmail) {
      // check if data contains userEmail
      console.log("email is here: ", data?.userEmail);
      if (!validateEmail(data.userEmail)) {
        console.log("Email is not valid");
        toast.error("Invalid Email", {
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
    }

    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    await axios
      .post(`${BACKEND_URL}/updateuser/${User.id}`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Profile Updated successfull");
        console.log(result);
        toast.success("Profile Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        const token = localStorage.getItem("auth-token");
        if (token) {
          FetchProfile(token);
        } else {
          navigate("/", {
            state: { error: "Something Went Wrong! Please Try Again" },
          });
        }
        setbtnloading(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Profile", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };

  const handlePickImage = (e) => {
    const file = e.target.files[0];
    console.log("File: ", file);
    setSelectedImage(file);
    console.log("Selected: ", selectedImage);
  };

  const UpdateProfileImage = async (file) => {
    try {
      const token = localStorage.getItem("auth-token");
      const imageData = new FormData();
      imageData.append("image", selectedImage);
      // imageData.append("image", file);

      console.log("Image Data: ", imageData);

      const result = await axios.post(
        `${BACKEND_URL}/user/profile-picture`,
        imageData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Result", result);
    } catch (err) {
      console.error(err);
      toast.error("Error in Updating Profile Image", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  // useEffect(() => {
  //   if (selectedImage) {
  //     UpdateProfileImage(selectedImage);
  //   }
  // }, [selectedImage]);

  return (
    <>
      <ToastContainer />
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
                            <label htmlFor="pick-image">
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
                            </label>
                            {/* <input
                              accept="image/*"
                              onInput={handlePickImage}
                              id="pick-image"
                              type="file"
                              hidden
                            /> */}
                            <input
                              accept="image/*"
                              onChange={handlePickImage}
                              id="pick-image"
                              type="file"
                              hidden
                            />
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
                            <Tab label="Change Password" />
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

export default ProfilePage;
