import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const PermissionsCheckbox = ({
  permission,
  defaultRole,
  selectedPermission,
  setSelectedPermission,
  handleCheckboxChange,
}) => {
  console.log("roles checkbox", permission, defaultRole);
  const [checked, setchecked] = useState(true);

  const handleClick = (e) => {
    const permissionId = e.target.value;
    const checked = e.target.checked;
    setchecked(checked);
    console.log("permissionID, checked:::: ", permissionId, checked);
    handleCheckboxChange(permissionId, checked);
  };

  useEffect(() => {
    // When the component mounts, add the permission ID to the selectedPermission array
    setSelectedPermission((prevSelected) => [...prevSelected, permission.id]);
  }, []);

  return (
    <div className="w-[30%]">
      <FormControlLabel
        control={
          <Checkbox
            value={permission?.id}
            onClick={handleClick}
            checked={checked}
            name="permissionCheckbox"
            fullWidth
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label={permission?.permission}
      />
    </div>
  );
};

export default PermissionsCheckbox;
