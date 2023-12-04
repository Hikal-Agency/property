import { Tab, Tabs } from "@mui/material";
import React from "react";

const TransferTabs = ({ leadTypes, value, setValue, handleChange }) => {
  return (
    <div className="flex justify-between">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="standard"
        className="w-full px-1 m-1"
      >
        {/* <Tab value={} label={t("fresh")} />
    <Tab label={t("menu_thirdparty")} />
    <Tab label={t("menu_archived")} />
    <Tab label={t("menu_secondary")} />
    <Tab label={t("menu_cold")} />
    <Tab label={t("menu_personal")} />
    <Tab label={t("menu_location_live")} /> */}
        {leadTypes?.map((leadType) => (
          <Tab value={leadType?.value} label={leadType?.name} />
        ))}
      </Tabs>
    </div>
  );
};

export default TransferTabs;
