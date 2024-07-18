import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import Select from "react-select";
import { selectStyles } from "../../../Components/_elements/SelectStyles";

const Addlisting = () => {
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
      <h4 className={`text-primary text-center font-semibold pb-5`}>
        {t("heading_add_listing")}
      </h4>

      <div className="grid sm:grid-cols-1   md:grid-cols-2 lg:grid-cols-2 gap-3">
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
          <TextField
            id="name"
            type={"text"}
            label={t("title")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            // value={projectData?.projectLocation}
            name="projectLocation"
            // onChange={handleChange}
            required
          />
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("label_list_attr")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("label_country")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("status")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
        </Box>
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
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("label_listing_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("label_list_attr_type")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <Select
            id="Developer"
            // value={{
            //   value: projectData?.developer_id,
            //   label: projectData?.developer_id
            //     ? developer.find((dev) => dev.id === projectData?.developer_id)
            //         ?.developerName || ""
            //     : t("form_developer_name"),
            // }}
            // onChange={(selectedOption) => {
            //   handleChange({
            //     target: { name: "developer_id", value: selectedOption.value },
            //   });
            // }}
            // options={developer.map((dev) => ({
            //   value: dev.id,
            //   label: dev.developerName,
            // }))}
            className="w-full"
            placeholder={t("state")}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />

          <TextField
            id="Project"
            type={"text"}
            label={t("description")}
            className="w-full"
            sx={{
              marginBottom: "20px !important",
            }}
            variant="outlined"
            size="small"
            // value={projectData?.area}
            name="area"
            // onChange={handleChange}
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
        </Box>
      </div>
    </div>
  );
};

export default Addlisting;
