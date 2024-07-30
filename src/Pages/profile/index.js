import { Button } from "@material-tailwind/react";
import { Avatar, Box } from "@mui/material";

import axios from "../../axoisConfig";
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Tab, Tabs } from "@mui/material";
import { GeneralInfo as GeneralInfoTab } from "../../Components/profile/GeneralInfo.jsx";
import { PersonalInfo as PersonalInfoTab } from "../../Components/profile/PersonalInfo";
import { ChangePassword as ChangePasswordTab } from "../../Components/profile/ChangePassword";
import Loader from "../../Components/Loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ImagePicker from "./ImagePicker";
import { datetimeLong } from "../../Components/_elements/formatDateTime";

import {
  BsTelephone,
  BsEnvelopeAt,
  BsFillPlusCircleFill,
  BsPersonPlus,
} from "react-icons/bs";
import { MdEmail } from "react-icons/md";

const ProfilePage = () => {
  const [loading, setloading] = useState(true);
  const {
    User,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    setUser,
    t,
    themeBgImg,
    primaryColor,
  } = useStateContext();
  const [GeneralInfoData, setGeneralInfo] = useState({
    userAltContact: "",
    userAltEmail: "",
    userEmail: "",
    userContact: "",
  });
  const [PersonalInfo, setPersonalInfo] = useState({});
  const navigate = useNavigate();
  const [imagePickerModal, setImagePickerModal] = useState(false);

  // Btn loading
  const [btnloading, setbtnloading] = useState(false);

  // COUNTER FOR TABS
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const SetUserProfilePic = (url) => {
    setUser((user) => ({
      ...user,
      displayImg: url,
    }));
    const localStorageUser = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...localStorageUser,
        displayImg: url,
      })
    );
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

        const user = {
          permissions: result.data.roles.permissions,
          addedBy: result.data.user[0].addedBy,
          addedFor: result.data.user[0].addedFor,
          agency: result.data.user[0].agency,
          created_at: result.data.user[0].created_at,
          creationDate: result.data.user[0].creationDate,
          displayImg: result.data.user[0].profile_picture,
          expiry_date: result.data.user[0].expiry_date,
          credits: result.data.user[0].credits,
          gender: result.data.user[0].gender,
          id: result.data.user[0].id,
          idExpiryDate: result.data.user[0].idExpiryDate,
          isParent: result.data.user[0].isParent,
          is_online: result.data.user[0].is_online,
          joiningDate: result.data.user[0].joiningDate,
          loginId: result.data.user[0].loginId,
          loginStatus: result.data.user[0].loginStatus,
          master: result.data.user[0].master,
          nationality: result.data.user[0].nationality,
          notes: result.data.user[0].notes,
          old_password: result.data.user[0].old_password,

          package_name: result.data.user[0].package_name,
          plusSales: result.data.user[0].plusSales,
          position: result.data.user[0].position,
          profile_picture: result.data.user[0].profile_picture,
          role: result.data.user[0].role,
          status: result.data.user[0].status,
          target: result.data.user[0].target,
          uid: result.data.user[0].uid,
          updated_at: result.data.user[0].updated_at,
          userEmail: result.data.user[0].userEmail,
          userContact: result.data.user[0].userContact,
          userName: result.data.user[0].userName,
          userType: result.data.user[0].userType,
          is_alert: result.data.user[0].is_alert,
          timezone: result.data.user[0].timezone,
          pinned: result.data.user[0].pinned,
        };

        setUser(user);

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

        if (result.data.user[0].profile_picture !== User?.displayImg) {
          SetUserProfilePic(result.data.user[0].profile_picture);
        }

        console.log("Personal info: ", PersonalInfo.address);
        // setgender(User?.gender);
        setloading(false);
      })
      .catch((err) => {
        console.log("here is error");
        console.log(err);
        toast.error("Sorry something went wrong. Kindly refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        // navigate("/", {
        //   state: {
        //     error: "Something Went Wrong! Please Try Again",
        //     continueURL: location.pathname,
        //   },
        // });
      });
  };

  useEffect(() => {
    setopenBackDrop(false);
    const token = localStorage.getItem("auth-token");
    FetchProfile(token);
    // eslint-disable-next-line
  }, []);

  const UpdateProfile = async (data) => {
    console.log("Profile: ", data);

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
        const errors = result?.data;

        if (errors && !errors?.message) {
          const errorMessages = Object.values(errors).flat().join(" ");
          toast.error(`Errors: ${errorMessages}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setbtnloading(false);
          return;
        }
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

  return (
    <>
      <div className="flex min-h-screen">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full ${
              !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
            }`}
          >
            <div
              className={`w-full p-4 ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              <div className="grid grid-cols-4 gap-5">
                {/* PROFILE  */}
                <div className="col-span-4 sm:col-span-4 md:col-span-2 lg:col-span-1">
                  <div
                    className={`${
                      themeBgImg
                        ? currentMode === "dark"
                          ? "blur-bg-dark"
                          : "blur-bg-light"
                        : currentMode === "dark"
                        ? "bg-[#1C1C1C]"
                        : "bg-[#EEEEEE]"
                    } rounded-xl shadow-sm p-4 min-w-[200px] min-h-[200px]`}
                  >
                    <h1 className="text-lg font-semibold text-center">
                      {t("user_account")}
                    </h1>
                    <div className="my-3 h-0.5 w-full rounded-full bg-primary"></div>
                    <div className="accountinfo p-4">
                      <div className="flex justify-center flex-col items-center gap-4">
                        <label htmlFor="pick-image">
                          <div
                            onClick={() =>
                              setImagePickerModal({ isOpen: true })
                            }
                            className="relative"
                          >
                            <img
                              src={User?.displayImg}
                              width={200}
                              height={200}
                              alt=""
                              className="rounded-full mx-auto w-28"
                            />
                            <div className="absolute -top-2.5 -right-2.5 ">
                              <BsFillPlusCircleFill
                                className="text-primary bg-white border-white border-[3px] rounded-full w-full h-full"
                                size={30}
                              />
                            </div>
                          </div>
                        </label>
                        <div className="text-center my-2">
                          <h1 className="text-lg my-1 font-semibold text-center uppercase">
                            {User?.userName}
                          </h1>
                          <h3 className="text-sm my-1 uppercase">
                            {User?.position}
                          </h3>
                        </div>
                        <div className="text-center w-full my-1">
                          <div className="flex items-center justify-center font-semibold gap-3 my-2">
                            <BsTelephone size={16} className="block" />
                            {t("label_contact_number")}
                          </div>
                          <div className="my-2">{User?.userContact}</div>
                        </div>
                        <div className="text-center w-full my-1">
                          <div className="flex items-center justify-center font-semibold gap-3 my-2">
                            <BsEnvelopeAt size={16} className="block" />
                            {t("label_email_address")}
                          </div>
                          <div className="my-2">{User?.userEmail}</div>
                        </div>
                        <div className="text-center w-full my-1">
                          <div className="flex items-center justify-center font-semibold gap-3 my-2">
                            <BsPersonPlus size={16} className="block" />
                            {t("profile_created_on")}
                          </div>
                          <div className="my-2">
                            {datetimeLong(User?.creationDate)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`bg-green-600 text-white rounded-md text-center shadow-sm text-sm font-semibold uppercase p-2`}
                    >
                      {t("status_active")}
                    </div>
                  </div>
                </div>

                {/* UPDATE  */}
                <div className="col-span-4 sm:col-span-4 md:col-span-2 lg:col-span-3">
                  <div
                    className={`${
                      themeBgImg &&
                      (currentMode === "dark"
                        ? "blur-bg-dark"
                        : "blur-bg-light")
                    } rounded-xl shadow-sm p-4`}
                  >
                    <Box sx={darkModeColors} className="pt-2 pb-4 mb-4">
                      <Tabs
                        sx={darkModeColors}
                        value={value}
                        onChange={handleChange}
                        variant="standard"
                      >
                        <Tab label={t("general_info")?.toUpperCase()} />
                        <Tab label={t("personal_info")?.toUpperCase()} />
                        <Tab label={t("change_password")?.toUpperCase()} />
                      </Tabs>
                    </Box>
                    <div className="p-5">
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
        )}
      </div>

      {imagePickerModal.isOpen && (
        <ImagePicker
          imagePickerModal={imagePickerModal}
          setImagePickerModal={setImagePickerModal}
        />
      )}
    </>
  );
  function TabPanel(props) {
    const { children, value, index } = props;
    return <div>{value === index && <div>{children}</div>}</div>;
  }
};

export default ProfilePage;
