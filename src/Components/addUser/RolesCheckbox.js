import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

const RolesCheckbox = () => {
  return (
    <>
      <div>
        {" "}
        <FormControlLabel required control={<Checkbox />} label="Required" />
      </div>
    </>
  );
};

export default RolesCheckbox;
