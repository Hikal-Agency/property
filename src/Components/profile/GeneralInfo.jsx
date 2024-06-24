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
  const { currentMode, darkModeColors, t } = useStateContext();
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
      
      <div className="w-full">
        <form action="">
          <Box sx={darkModeColors} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <div className="col-span-1 w-full">
              <TextField
                id="contact-number"
                type={"tel"}
                label={t("label_contact_number")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
                variant="outlined"
                size="medium"
                required
                value={GeneralInfo?.userContact}
                onInput={handleContact}
              />
            </div>
            <div className="col-span-1 w-full">
              <TextField
                id="alternative-contact-number"
                type={"tel"}
                label={t("label_alt_contact_number")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
                variant="outlined"
                size="medium"
                value={GeneralInfo?.userAltContact}
                error={contactError && contactError}
                helperText={contactError && contactError}
                onInput={handlePhone}
              />
            </div>
            <div className="col-span-1 w-full">
              <TextField
                id="email"
                type={"email"}
                label={t("label_email_address")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
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
            <div className="col-span-1 w-full">
              <TextField
                id="alternative-email"
                type={"email"}
                label={t("label_alt_email_address")}
                className="w-full"
                style={{
                  marginBottom: "15px",
                }}
                variant="outlined"
                size="medium"
                value={GeneralInfo?.userAltEmail}
                error={emailError && emailError}
                helperText={emailError && emailError}
                onChange={handleEmail}
              />
            </div>
            <div className="col-span-1  w-full">
              <Button
                onClick={UpdateProfileFunc}
                className={`min-w-full card-hover text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
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
                  <span>{t("update_profile")}</span>
                )}
              </Button>
            </div>
            <div className="col-span-1 w-full">
              <Button
                onClick={ResetGeneralInfo}
                ripple={true}
                variant="outlined"
                type="reset"
                className={`shadow-none card-hover w-full rounded-md text-sm  ${
                  currentMode === "dark"
                    ? "text-white border-white"
                    : "text-primary border-primary"
                }`}
              >
                {t("btn_reset")}
              </Button>
            </div>
          </Box>
        </form>
      </div>
    </>
  );
};
