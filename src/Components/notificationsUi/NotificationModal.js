import { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { MdClose } from "react-icons/md";
import useApi from "../../utils/useApi";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Box,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import Select from "react-select";
import { selectStyles } from "../_elements/SelectStyles";
import { useStateContext } from "../../context/ContextProvider";

const NotificationModal = ({
  isNotificationModal,
  setIsNotificationModal,
  notificationId,
  setIsViewState,
  isViewState,
  setIsNewState,
  isNewState,
  fetchAllNotifications,
}) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    formatNum,
    t,
    isLangRTL,
    i18n,
    fontFam,
    isArabic,
    primaryColor,
  } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  // const [frequencyr, setFrequency] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    frequency: null,
    specific_days: "",
    day: "",
  });
  // const [times, setTimes] = useState([""]);
  const [times, setTimes] = useState([""]);

  const formChangeHandler = (name, value) => {
    setFormData((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const [updateData, updateError, updateLoading, updateFetchData] = useApi(
    "http://localhost:8000/api/updateUserNotification/",
    "POST",
    formData
  );
  const [newData, newError, newLoading, newFetchData] = useApi(
    "http://localhost:8000/api/createUserNotification/",
    "POST",
    { user_id: "6669991a8f57044526545c69", ...formData }
  );
  const [
    getNotificationData,
    getNotificationError,
    getNotificationLoading,
    getNotificationFunc,
  ] = useApi("http://localhost:8000/api/getUserNotification/", "POST", {
    id: notificationId,
  });
  useEffect(() => {
    if (!isNewState) {
      getNotificationFunc();
    }
  }, []);
  useEffect(() => {
    if (Object.keys(newData || {}).length) {
      const {
        _id = "",
        title = "",
        description = "",
        frequency = null,
        specific_days = "",
      } = newData ?? {};
      setFormData({
        title,
        description,
        frequency,
        specific_days,
        id: _id,
      });
    }
    fetchAllNotifications();
  }, [newData]);
  useEffect(() => {
    if (Object.keys(updateData || {}).length) {
      const {
        _id = "",
        title = "",
        description = "",
        frequency = null,
        specific_days = "",
      } = updateData ?? {};

      setFormData({
        title,
        description,
        frequency,
        specific_days,
        id: _id,
      });
    }
    fetchAllNotifications();
  }, [updateData]);

  const handleNotificationModelClose = () => {};
  useEffect(() => {
    if (Object.keys(getNotificationData || {}).length) {
      const {
        _id = "",
        title = "",
        description = "",
        frequency = null,
        specific_days = "",
      } = getNotificationData ?? {};
      setFormData({
        title,
        description,
        frequency,
        specific_days,
        id: _id,
      });
    }
  }, [getNotificationData]);

  useEffect(() => {
    setTimes([""]);
    formChangeHandler("day", "");
  }, [formData.frequency]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsNewState(false);
      setIsViewState(false);
      setIsNotificationModal(false);
    }, 1000);
  };
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const handleAddTime = () => {
    setTimes([...times, ""]);
  };

  const handleRemoveTime = (index) => {
    const newTimes = times.filter((_, i) => i !== index);
    setTimes(newTimes);
  };

  const handleChange = (index, event) => {
    const newTimes = times.map((time, i) =>
      i === index ? event.target.value : time
    );
    setTimes(newTimes);
  };

  const daysOfWeekOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];
  return (
    <Modal
      keepMounted
      open={isNotificationModal}
      onClose={handleNotificationModelClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        className={`${
          isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
        } ${
          isClosing
            ? isLangRTL(i18n.language)
              ? "modal-close-left"
              : "modal-close-right"
            : ""
        }
        w-[100vw] h-[100vh] flex items-start justify-end`}
      >
        <button
          // onClick={handleLeadModelClose}
          onClick={handleClose}
          className={`${
            isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
          }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
        >
          <MdClose
            size={18}
            color={"white"}
            className="hover:border hover:border-white hover:rounded-full"
          />
        </button>
        <div
          style={style}
          className={` ${
            currentMode === "dark"
              ? "bg-[#000000] text-white"
              : "bg-[#FFFFFF] text-black"
            // ? "blur-bg-dark-nr text-white"
            // : "blur-bg-white-nr text-black"
          } ${
            isLangRTL(i18n.language)
              ? currentMode === "dark" && " border-primary border-r-2"
              : currentMode === "dark" && " border-primary border-l-2"
          }
            p-4 h-[100vh] w-[80vw] overflow-y-scroll 
          `}
        >
          <div className="flex h-full w-full p-5 flex-col gap-5">
            <div className="flex ">
              <div className="flex-1  p-5">
                <TextField
                  id="notification_title"
                  type={"text"}
                  label={t("title")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  name="title"
                  // error={emailError && emailError}
                  // helperText={emailError && emailError}
                  value={formData?.title}
                  onChange={(e) => formChangeHandler("title", e?.target?.value)}
                  disabled={isViewState}
                />
                <Select
                  id="notification_frequency"
                  options={[
                    { label: "Daily", vlaue: "Daily" },
                    { label: "Weekly", value: "Weekly" },
                    { label: "Monthly", value: "Monthly" },
                    { label: "Quarterly", value: "Quarterly" },
                    { label: "Semi - Annually", value: "Semi - Annually" },
                    { label: "Annually", value: "Annually" },
                  ]}
                  // value={SalesPerson2}
                  value={{
                    label: formData?.frequency,
                    value: formData?.frequency,
                  }}
                  onChange={(e) => {
                    formChangeHandler("frequency", e?.label);
                  }}
                  placeholder={t("Select Frequency")}
                  className={`mb-5`}
                  name="frequency"
                  menuPortalTarget={document.body}
                  styles={selectStyles(currentMode, primaryColor)}
                  isDisabled={isViewState}
                />
                {(formData?.frequency == "Weekly" ||
                  formData?.frequency == "Monthly") && (
                  <Select
                    id="notification_frequency"
                    options={daysOfWeekOptions}
                    // value={SalesPerson2}
                    value={{
                      label: formData?.day,
                      value: formData?.day,
                    }}
                    onChange={(e) => {
                      formChangeHandler("day", e?.label);
                    }}
                    placeholder={t("Select Day")}
                    className={`mb-5`}
                    name="day"
                    menuPortalTarget={document.body}
                    styles={selectStyles(currentMode, primaryColor)}
                    isDisabled={isViewState}
                  />
                )}
                {(formData?.frequency === "Daily" || formData?.day) && (
                  <>
                    {times.map((time, index) => (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <TextField
                          id="notification_specific_days"
                          type="time"
                          label={"HH:MM:SS"}
                          className="w-full"
                          sx={{
                            "&": {
                              marginBottom: "1.25rem !important",
                            },
                          }}
                          placeholder=""
                          variant="outlined"
                          size="small"
                          name="time"
                          onChange={(e) => handleChange(index, e)}
                          disabled={isViewState}
                        />
                        {index != 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTime(index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {(!formData?.day || times?.length == 3) && (
                      <button type="button" onClick={handleAddTime}>
                        Add Time
                      </button>
                    )}
                  </>
                )}
              </div>
              <div className="flex-1 p-5">
                <TextField
                  id="notification_description"
                  type={"text"}
                  label={t("descripiton")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  // error={emailError && emailError}
                  // helperText={emailError && emailError}
                  name="description"
                  value={formData?.description}
                  onChange={(e) =>
                    formChangeHandler("description", e?.target?.value)
                  }
                  disabled={isViewState}
                />
                <TextField
                  id="notification_specific_days"
                  type={"text"}
                  label={t("specific days")}
                  className="w-full"
                  sx={{
                    "&": {
                      marginBottom: "1.25rem !important",
                    },
                  }}
                  variant="outlined"
                  size="small"
                  name="specific_days"
                  // error={emailError && emailError}
                  // helperText={emailError && emailError}
                  value={formData?.specific_days}
                  onChange={(e) =>
                    formChangeHandler("specific_days", e?.target?.value)
                  }
                  disabled={isViewState}
                />
              </div>
            </div>
            <div className="">
              {!isViewState && (
                <Button
                  className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                  ripple={true}
                  style={{
                    background: `${primaryColor}`,
                  }}
                  size="lg"
                  type="submit"
                  //   disabled={loading ? true : false}
                  onClick={async () => {
                    try {
                      if (isNewState) {
                        await newFetchData();
                        handleClose();
                      } else {
                        await updateFetchData();
                        handleClose();
                      }
                    } catch {
                      console.log("some error occured");
                    }
                  }}
                >
                  {
                    <span>
                      {isNewState
                        ? t("create notifcation")
                        : t("update notifcation")}
                    </span>
                  }
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
