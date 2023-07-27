import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";

const PermissionsCheckbox = ({
  permission,
  defaultRole,
  selectedPermission,
  setSelectedPermission,
  handleCheckboxChange,
}) => {
  const [checked, setChecked] = useState(true);

  useEffect(() => {
    // When the component mounts, add the permission ID to the selectedPermission array
    setSelectedPermission((prevSelected) => [...prevSelected, permission.id]);
    setChecked(true);
    console.log("useeffect:::::::");
  }, []);

  const handleClick = (e) => {
    const permissionId = e.target.value;
    const checked = e.target.checked;
    console.log("checked:   ", checked);
    setChecked(checked);

    setSelectedPermission((prevPermissionData) => {
      if (!checked) {
        // If checked, add the permissionId to the array

        return prevPermissionData.filter(
          (id) => Number(id) !== Number(permissionId)
        );
      } else {
        // If unchecked, remove the permissionId from the array
        return [...prevPermissionData, permissionId];
      }
    });

    console.log();
  };

  console.log("updated permisssion: ", selectedPermission);

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
