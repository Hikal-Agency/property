import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

const PermissionsCheckbox = ({
  permission,
  selectedPermission,
  setSelectedPermission,
  allChecked,
}) => {
  const [checked, setChecked] = useState(true);
  const { currentMode } = useStateContext();

  useEffect(() => {
    if (allChecked) {
      console.log("checked all: ", allChecked);
      setSelectedPermission((prevSelected) => [...prevSelected, permission.id]);
    } else {
      setSelectedPermission([]);
    }
    setChecked(allChecked);
  }, [allChecked]);

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

export default PermissionsCheckbox;
