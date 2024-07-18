import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";

const AddListingType = () => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    fontFam,
  } = useStateContext();

  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="my-4">
      <Box
        sx={{
          ...darkModeColors,
          "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
            {
              right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
              transformOrigin: isLangRTL(i18n.language) ? "right" : "left",
            },
          "& legend": {
            textAlign: isLangRTL(i18n.language) ? "right" : "left",
          },
        }}
      >
        <h4 className={`text-primary text-center font-semibold pb-5`}>
          {t("heading_listing_type")}
        </h4>{" "}
        <div className="flex items-center justify-center space-x-3">
          <TextField
            id="ProjectName"
            type={"text"}
            label={t("label_listing_type")}
            //   value={projectData?.projectName}
            name="projectName"
            //   onChange={handleChange}
            //   className="w-full"

            variant="outlined"
            size="small"
            required
          />
          <Button
            className={`min-w-fit text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
            ripple={true}
            style={{
              fontFamily: fontFam,
              background: `${primaryColor}`,
            }}
            size="lg"
            type="submit"
            disabled={btnLoading ? true : false}
          >
            {btnLoading ? (
              <CircularProgress
                size={20}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <span className="text-white">{t("submit")}</span>
            )}
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default AddListingType;
