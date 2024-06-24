import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const UpdatePermissionsCheckbox = ({
  permission,
  defaultRole,
  selectedPermission,
  setSelectedPermission,
  allPermissions,
}) => {
  const [checked, setChecked] = useState(permission.isPermitted);
  const { currentMode } = useStateContext();

  console.log("update permisssions checkbox::: ", permission);
  console.log("update Alllpermisssions checkbox::: ", allPermissions);

  useEffect(() => {
    const selectedPermissionIds = allPermissions?.selectedPermissions?.map(
      (permission) => permission?.id
    );
    console.log("selectedids: ", selectedPermissionIds);
    setSelectedPermission(selectedPermissionIds);

    console.log("useeffect:::::::");
  }, []);

  console.log("seleted permissions array: ", selectedPermission);

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
        return [...prevPermissionData, Number(permissionId)];
      }
    });

    console.log("selected permisssion::::::::::::: ", selectedPermission);
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
            style={{
              color: currentMode === "dark" ? "#fff" : "#000",
            }}
          />
        }
        label={permission?.permission}
      />
    </div>
  );
};

export default UpdatePermissionsCheckbox;
