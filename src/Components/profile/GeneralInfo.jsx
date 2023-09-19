import { Button } from "@material-tailwind/react";
import { Box, TextField, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";

export const GeneralInfo = ({
  GeneralInfoData,
  User,
  UpdateProfile,
  btnloading,
}) => {
  const [emailError, setEmailError] = useState(false);
  const [contactError, setContactError] = useState(false);
  const [GeneralInfo, setGeneralInfo] = useState(GeneralInfoData);
  const { currentMode, darkModeColors } = useStateContext();
  // eslint-disable-next-line
  const ResetGeneralInfo = () => {
    setGeneralInfo({
      userAltContact: "",
      userAltEmail: "",
      userEmail: "",
      userContact: "",
    });
  };

  const handlePhone = (e) => {
    setContactError(false);
    const value = e.target.value;
    const onlyDigitsAndPlus = /^[0-9+]*$/;
    if (onlyDigitsAndPlus.test(value)) {
      setContactError(false);
    } else {
      setContactError("Kindly enter a valid contact number with country code.");
    }

    setGeneralInfo({
      ...GeneralInfo,
      userAltContact: e.target.value,
    });
  };

  const handleContact = (e) => {
    const value = e.target.value;
    const onlyDigitsAndPlus = /^[0-9+]*$/;
    if (onlyDigitsAndPlus.test(value)) {
      setGeneralInfo({
        ...GeneralInfo,
        userContact: e.target.value,
      });
    }
    console.log(GeneralInfo?.userContact);
  };

  const handleEmail = (e) => {
    setEmailError(false);
    const value = e.target.value;
    console.log(value);
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(value)) {
      setEmailError(false);
    } else {
      setEmailError("Kindly enter a valid email.");
      // return;
    }

    setGeneralInfo({
      ...GeneralInfo,
      userAltEmail: value, // update userAltEmail to the updated email value
    });
    console.log("Email state: ", GeneralInfo?.userAltEmail);
  };

  const UpdateProfileFunc = () => {
    if (contactError !== false) {
      toast.error("Kindly enter a valid contact number.", {
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
    UpdateProfile(GeneralInfo);
  };

  return (
    <>
      
      <div className="relative w-full">
        <form action="">
          <Box sx={darkModeColors} className="grid grid-cols-6 gap-x-3 gap-y-5">
            <div className="col-span-3 w-full">
              <TextField
                id="contact-number"
                type={"tel"}
                label="Contact Number"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userContact}
                onInput={handleContact}
              />
            </div>
            <div className="col-span-3 w-full">
              <TextField
                id="alternative-contact-number"
                type={"tel"}
                label="Alternative Contact Number"
                className="w-full"
                variant="outlined"
                size="medium"
                value={GeneralInfo?.userAltContact}
                // onInput={(e) =>
                //   setGeneralInfo({
                //     ...GeneralInfo,
                //     userAltContact: e.target.value,
                //   })
                // }
                error={contactError && contactError}
                helperText={contactError && contactError}
                onInput={handlePhone}
              />
            </div>
            <div className="col-span-3 w-full">
              <TextField
                id="email"
                type={"email"}
                label="Email Address"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userEmail}
                onInput={(e) =>
                  setGeneralInfo({
                    ...GeneralInfo,
                    userEmail: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-3 w-full">
              <TextField
                id="alternative-email"
                type={"email"}
                label="AlternativeEmail Address"
                className="w-full"
                variant="outlined"
                size="medium"
                value={GeneralInfo?.userAltEmail}
                error={emailError && emailError}
                helperText={emailError && emailError}
                onChange={handleEmail}
              />
              {/* <TextField
                id="alternative-email"
                type={"email"}
                label="AlternativeEmail Address"
                className="w-full"
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userAltEmail}
                onInput={(e) =>
                  setGeneralInfo({
                    ...GeneralInfo,
                    userAltEmail: e.target.value,
                  })
                }
              /> */}
            </div>
            <div className="col-span-3 w-full">
              <Button
                onClick={UpdateProfileFunc}
                className={`min-w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                ripple={true}
                style={{
                  color: "white"
                }}
                size="lg"
              >
                {btnloading ? (
                  <CircularProgress
                    sx={{ color: "white" }}
                    size={16}
                    className="text-white"
                  />
                ) : (
                  <span>Update Profile</span>
                )}
              </Button>
            </div>
            <div className="col-span-3 w-full">
              <Button
                onClick={ResetGeneralInfo}
                ripple={true}
                variant="outlined"
                type="reset"
                className={`shadow-none w-full rounded-md text-sm  ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary border-primary"
                }`}
              >
                Reset
              </Button>
            </div>
          </Box>
        </form>
        <div className="flex justify-between px-10 w-full pt-10">
          <div
            className={`text-center ${
              currentMode === "dark" ? "text-gray-50" : "text-gray-600"
            }`}
          >
            <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
              <h1>Created</h1>
            </div>
            {User?.creationDate}
          </div>
          <div
            className={`text-center ${
              currentMode === "dark" ? "text-gray-50" : "text-gray-600"
            }`}
          >
            <div className="flex items-center space-x-1 justify-center font-bold  mb-1">
              <h1>Last Updated</h1>
            </div>
            {User?.lastEdited}
          </div>
        </div>
      </div>
    </>
  );
};
