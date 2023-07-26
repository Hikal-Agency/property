import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

const RolesCheckbox = ({ role, defaultRole }) => {
  console.log("roles checkbox", role);

  const isSelectedRole = defaultRole && role.id === defaultRole;
  console.log("selected checkbox: ", isSelectedRole);

  return (
    <>
      <div>
        {" "}
        <FormControlLabel
          control={<Checkbox checked={isSelectedRole} />}
          label={role?.role}
        />
      </div>
    </>
  );
};

export default RolesCheckbox;
