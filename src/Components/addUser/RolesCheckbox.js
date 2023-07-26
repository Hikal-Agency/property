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

  const handleClick = () => {
    console.log("radio: ", role.id);
    setFormData(role.id);
  };

  return (
    <div>
      {/* <FormControlLabel
        control={
          <Radio
            value={role?.id}
            onClick={handleClick}
            // checked={isSelectedRole}
            name="radio-buttons"
          />
        }
        label={role?.role}
      /> */}
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={role?.id}
          onChange={handleClick}
        >
          <FormControlLabel
            // value={role?.id}
            control={<Radio />}
            label={role?.role}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

export default RolesCheckbox;
