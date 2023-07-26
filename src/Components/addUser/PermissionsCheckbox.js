import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";

const PermissionsCheckbox = ({
  permission,
  defaultRole,
  formData,
  setFormData,
}) => {
  console.log("roles checkbox", permission, defaultRole);

  const handleClick = (e) => {
    setFormData(e.target.value);
  };

  return (
    <div className="w-[30%]">
      <FormControlLabel
        control={
          <Checkbox
            value={permission?.id}
            // onChange={handleClick}
            checked
            name="roleRadio"
            fullWidth
          />
        }
        label={permission?.permission}
      />
    </div>
  );
};

export default PermissionsCheckbox;
