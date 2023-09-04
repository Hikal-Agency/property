import { Switch } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const SwitchButtonComponent = ({
  cellValues,
  call,
  value,
  permitObj,
  fetchNotifPermissions,
}) => {
  console.log("call , value, permitObj::: ", call, value, permitObj);

  // console.log(
  //   "array: ",
  //   permitObj[call?.type]?.includes(value) ? permitObj[call?.type] : false
  // );

  const keyToUse =
    permitObj && permitObj.hasOwnProperty(call?.type) ? call?.type : null;
  console.log("keyToUse: ", keyToUse);
  const isValueIncluded = keyToUse
    ? permitObj[keyToUse]?.includes(value)
    : false;

  console.log("type::: ", isValueIncluded, keyToUse);

  const { currentMode, BACKEND_URL, User } = useStateContext();
  const token = localStorage.getItem("auth-token");
  const [loading, setLoading] = useState(false);

  const updateNotifications = async () => {
    if (call?.type === "priority" || call?.type === "feedback") {
      toast.error(`The feature has bee .`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }
    setLoading(true);

    const permitted = (permitObj && permitObj[call?.type]) || [];
    const alerts = {
      ...permitObj,
      [call?.type]: permitted?.includes(value)
        ? permitted.filter((val) => val !== value)
        : [...permitted, value],
    };

    console.log("alert:: ", alerts);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/updateuser/${User?.id}`,
        JSON.stringify({ is_alert: alerts }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("notification updated: ", response);
      fetchNotifPermissions();

      toast.success(
        `Notification setting for ${call?.type} ${value} updated.`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } catch (error) {
      console.error("Error updating notification:", error);
      toast.error(`Unable to update notification settings.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {" "}
      <div className=" ">
        <Switch
          checked={isValueIncluded}
          onChange={() => updateNotifications(cellValues)}
          disabled={call?.type === "priority" || call?.type === "feedback"}
          sx={{
            color: "green !important",

            "& .MuiSwitch-thumb": {
              color:
                call?.type === "priority" || call?.type === "feedback"
                  ? "#EAEAEA"
                  : isValueIncluded
                  ? "green !important"
                  : "#B91C1C !important",
            },
            "& .Mui-checked": {
              color: isValueIncluded
                ? "green !important"
                : "#B91C1C !important",
            },

            "& .MuiSwitch-track": {
              backgroundColor:
                call?.type === "priority" || call?.type === "feedback"
                  ? "#B91C1C"
                  : isValueIncluded
                  ? "green !important"
                  : "#B91C1C !important",
            },
            "& .css-1q0bjt2-MuiSwitch-root .MuiSwitch-thumb": {
              backgroundColor:
                cellValues?.formattedValue === 1
                  ? "green !important"
                  : "#B91C1C !important",
            },
          }}
        />
      </div>
    </>
  );
};

export default SwitchButtonComponent;
