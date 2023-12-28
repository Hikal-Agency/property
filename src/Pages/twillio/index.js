import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import axios from "../../axoisConfig";

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
  const [twillioData, setTwillioData] = useState({
    twilio_id: null,
    twilio_token: null,
  });

  const token = localStorage.getItem("auth-token");

  const integrateTwillio = async () => {
    try {
      const twillioIntegration = await axios.post(
        `${BACKEND_URL}/store-tw-credentials`,
        twillioData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("twillio integration response::: ", twillioIntegration);
    } catch (error) {
      console.log("Error=====> ", error);
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
        <div className="w-full flex items-center pb-3">
          <div className="bg-primary h-10 w-1 rounded-full"></div>
          <h1
            className={`text-lg font-semibold mx-2 uppercase ${
              currentMode === "dark" ? "text-white" : "text-black"
            }`}
          >
            {t("integrate_twillio")}
          </h1>
        </div>

        <div
          className={`${
            themeBgImg &&
            (currentMode === "dark"
              ? "blur-bg-dark shadow-sm"
              : "blur-bg-light shadow-sm")
          } p-5 rounded-lg `}
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
      </form>
    </div>
  );
};

export default Twillio;
