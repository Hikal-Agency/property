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

const Etisalat = () => {
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
  const [etisalatData, setEtisalatData] = useState({
    etisalat_user: null,
    etisalat_password: null,
  });

  const token = localStorage.getItem("auth-token");

  const integrateTwillio = async () => {
    if (!etisalatData?.etisalat_user || !etisalatData?.etisalat_password) {
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
      const etisalatIntegration = await axios.post(
        `${BACKEND_URL}/store-etisalat-credentials`,
        etisalatData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("etisalat integration response::: ", etisalatIntegration);
      toast.success("Your Etisalat account successfully integrated.", {
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
            } p-5 rounded-lg w-4/6 h-50 `}
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
                      label={t("label_etisalat_user")}
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={etisalatData?.etisalat_user}
                      onChange={(e) =>
                        setEtisalatData({
                          ...etisalatData,
                          etisalat_user: e.target.value,
                        })
                      }
                      required
                    />
                    <TextField
                      id="notes"
                      type={"text"}
                      label={t("label_etisalat_password")}
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={etisalatData?.etisalat_password}
                      onChange={(e) =>
                        setEtisalatData({
                          ...etisalatData,
                          etisalat_password: e.target.value,
                        })
                      }
                      required
                    />
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

export default Etisalat;
