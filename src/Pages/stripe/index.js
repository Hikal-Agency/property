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

const Stripe = () => {
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
  const [stripeData, setStripeData] = useState({
    stripe_api_key: null,
  });

  const token = localStorage.getItem("auth-token");

  const integrationStripe = async () => {
    setLoading(true);
    if (!stripeData?.stripe_api_key) {
      toast.error("Kindly enter the stripe key.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoading(false);
      return;
    }
    try {
      const stripeIntegration = await axios.post(
        `${BACKEND_URL}/store-stripe-credentials`,
        stripeData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Stripe integration response::: ", stripeIntegration);
      setLoading(false);
      toast.success("Your Stripe account successfully integrated.", {
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
      setLoading(false);
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
          integrationStripe();
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
                  <div className="">
                    <TextField
                      id="id"
                      type={"text"}
                      label={t("label_stripe_key")}
                      className="w-full"
                      sx={{
                        "&": {
                          marginBottom: "1.25rem !important",
                          zIndex: 1,
                        },
                      }}
                      variant="outlined"
                      size="small"
                      value={stripeData?.stripe_api_key}
                      onChange={(e) =>
                        setStripeData({
                          ...stripeData,
                          stripe_api_key: e.target.value,
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
                  <span className="text-white">{t("stipe_add")}</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Stripe;
