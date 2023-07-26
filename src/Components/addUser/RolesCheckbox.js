import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const RolesCheckbox = ({ role, defaultRole, formData, setFormData }) => {
  console.log("roles checkbox", role, defaultRole);

  const isSelectedRole = role.user_id === defaultRole;
  console.log("selected checkbox: ", isSelectedRole);

  const handleClick = (e) => {
    console.log("radio: ", role.id);
    setFormData(e.target.value);
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Radio
            value={role?.id}
            onChange={handleClick}
            // checked={isSelectedRole}
            name="roleRadio"
          />
        }
        label={role?.role}
      />
    </div>
  );
};

export default RolesCheckbox;
