import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Twillio = () => {
  const {
    t,
    primaryColor,
    darkModeColors,
    isLangRTL,
    i18n,
    currentMode,
    themeBgImg,
    BACKEND_URL,
  } = useStateContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [twillioData, setTwillioData] = useState({
    twilio_id: null,
    twilio_token: null,
    twilio_number: null,
  });
  const [value, setValue] = useState();
  const [error, setError] = useState(false);

  const handleContact = () => {
    setError(false);
    const inputValue = value;
    console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setTwillioData({
          ...twillioData,
          twilio_number: formatPhoneNumberIntl(inputValue),
        });
        // setLeadContact(formatPhoneNumberIntl(inputValue));
        console.log("Valid lead contact: ", twillioData?.twilio_number);
        console.log("Valid input: ", inputValue);
        setError(false);
      } else {
        setError("Not a valid number.");
      }
    } else {
      setError("Not a valid number.");
    }
  };

  const token = localStorage.getItem("auth-token");

  const integrateTwillio = async () => {
    if (
      !twillioData?.twilio_id ||
      !twillioData?.twilio_token ||
      !twillioData?.twilio_number
    ) {
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    try {
      const twillioIntegration = await axios.post(
        `${BACKEND_URL}/store-twilio-credentials`,
        twillioData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("twillio integration response::: ", twillioIntegration);
      toast.success("Your twillio account successfully integrated.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error=====> ", error);
      toast.error("Unable to connect your account.", {
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
  };
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          integrateTwillio();
        }}
        disabled={loading ? true : false}
      >
        <div className=" flex items-center pb-3 mt-3 ml-3 rounded rounded-full ">
          <IconButton
            className="rounded-full bg-primary"
            sx={{ borderRadius: "100%", backgroundColor: primaryColor }}
            onClick={() => navigate("/integrations")}
          >
            <FaArrowLeft className={`text-white`} />
          </IconButton>
        </div>

        <div className="grid place-items-center h-auto">
          <div
            className={`${
              themeBgImg &&
              (currentMode === "dark"
                ? // ? "blur-bg-dark shadow-sm"
                  // : "blur-bg-light shadow-sm")
                  "bg-blue-500 shadow-sm"
                : "blur-bg-light shadow-sm")
            } p-5 rounded-lg w-4/6 h-56  `}
            style={{
              background: currentMode === "dark" ? "#1c1c1c" : "#EEEEEE",
            }}
          >
            <div className=" mt-5">
              <div className="px-4">
                <Box
                  sx={{
                    ...darkModeColors,
                    "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                      {
                        right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                        transformOrigin: isLangRTL(i18n.language)
                          ? "right"
                          : "left",
                      },
                    "& legend": {
                      textAlign: isLangRTL(i18n.language) ? "right" : "left",
                    },
                  }}
                >
                  <div className="flex justify-between space-x-4">
                    <TextField
                      id="id"
                      type={"text"}
                      label={t("twillio_id")}
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={twillioData?.twilio_id}
                      onChange={(e) =>
                        setTwillioData({
                          ...twillioData,
                          twilio_id: e.target.value,
                        })
                      }
                      required
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label={t("twillio_token")}
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={twillioData?.twilio_token}
                      onChange={(e) =>
                        setTwillioData({
                          ...twillioData,
                          twilio_token: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <PhoneInput
                      placeholder={t("label_contact_number")}
                      value={value}
                      onChange={(value) => setValue(value)}
                      onKeyUp={handleContact}
                      error={error}
                      className={` ${classNames({
                        "dark-mode": currentMode === "dark",
                        "phone-input-light": currentMode !== "dark",
                        "phone-input-dark": currentMode === "dark",
                      })} mb-5`}
                      size="small"
                      style={{
                        background: `${
                          !themeBgImg
                            ? currentMode === "dark"
                              ? "#000000"
                              : "#FFFFFF"
                            : "transparent"
                          // : (currentMode === "dark" ? blurDarkColor : blurLightColor)
                        }`,
                        "& .PhoneInputCountryIconImg": {
                          color: "#fff",
                        },
                        color: currentMode === "dark" ? "white" : "black",
                        border: `1px solid ${
                          currentMode === "dark" ? "#EEEEEE" : "#666666"
                        }`,
                        borderRadius: "5px",
                        outline: "none",
                      }}
                      inputStyle={{
                        outline: "none !important",
                      }}
                      required
                    />
                    {error && (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    )}
                  </div>
                </Box>
              </div>
            </div>

            <div className="">
              <Button
                className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                ripple={true}
                style={{
                  background: `${primaryColor}`,
                }}
                size="lg"
                type="submit"
                disabled={loading ? true : false}
              >
                {loading ? (
                  <CircularProgress
                    size={20}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <span className="text-white">{t("twillio_add")}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Twillio;
