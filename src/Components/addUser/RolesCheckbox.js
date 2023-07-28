import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const RolesCheckbox = ({ role, defaultRole, formData, setFormData }) => {
  console.log("roles checkbox", role, defaultRole);
  const [checked, setChecked] = useState(false);

  const handleClick = (e) => {
    console.log("radio: ", role.id);
    const check = e.target.checked;
    const id = e.target.value;
    setChecked((prevCheck) => (prevCheck ? false : check));
    setFormData(id);
  };

  // useEffect(() => {
  //   const isSelectedRole = role?.id === defaultRole;
  //   console.log("selected checkbox: ", isSelectedRole);
  //   setFormData(role?.id);
  //   isSelectedRole ? setChecked(true) : setChecked(false);
  // }, []);

  return (
    <div>
      <RadioGroup name="roleRadio">
        <FormControlLabel
          key={role.id}
          value={role.id.toString()}
          control={<Radio onChange={handleClick} />}
          label={role.role}
        />
      </RadioGroup>
      {/* <FormControlLabel
        control={
          <Radio
            value={role?.id}
            onChange={handleClick}
            // checked={isSelectedRole}
            name=
          />
        }
        label={role?.role}
      /> */}
    </div>
  );
};

export default RolesCheckbox;
