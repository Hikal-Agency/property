import {
  CircularProgress,
  Modal,
  Backdrop,
  Box,
  Typography,
} from "@mui/material";
import PhoneInput, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import classNames from "classnames";
import { useStateContext } from "../../context/ContextProvider";
import { TextField } from "@mui/material";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import "../../styles/app.css";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { GridCloseIcon } from "@mui/x-data-grid";
import { selectStyles } from "../_elements/SelectStyles";

import { MdClose } from "react-icons/md";
import { t } from "i18next";

const style = {
  transform: "translate(-0%, -0%)",
  boxShadow: 24,
};

const AddUserModel = ({ handleOpenModel, addUserModelClose }) => {
  const {
    BACKEND_URL,
    currentMode,
    isLangRTL,
    i18n,
    t,
    darkModeColors,
    primaryColor,
    Managers,
    User,
  } = useStateContext();
  const [formdata, setformdata] = useState({});
  const [loading, setloading] = useState(false);
  const [fetchingRoles, setFetchingRoles] = useState(true);
  const [UserRole, setUserRole] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [filterRole, setFilterRole] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [filterUser, setFilterUser] = useState([]);

  const handlePassword = (e) => {
    setPasswordError(false);
    const password = e.target.value;

    // Check if password meets the required criteria
    const validPassword =
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[@#$%^&+=]/.test(password);

    if (validPassword) {
      setPasswordError(false);
    } else {
      setPasswordError(
        "Password must be at least 8 characters long, include numbers, characters, and special characters. Example: Abc123@#"
      );
    }

    setformdata({
      ...formdata,
      password: e.target.value,
    });
  };

  const handleEmail = (e) => {
    setEmailError(false);
    const email = e.target.value;
    const emailRegex = /^\S+@\S+\.\S+$/; // regex pattern to match email address format
    const isValidEmail = emailRegex.test(email);
    if (isValidEmail) {
      setEmailError(false);
    } else {
      setEmailError("Please enter a valid email address");
    }

    setformdata({ ...formdata, userEmail: email });
  };

  const ChangeUserRole = (event) => {
    const defaultParent = 102;
    const selectedRole = event.value;
    setUserRole(selectedRole);
    if (selectedRole === 3) {
      fetchUserRole();
    }
    setformdata({
      ...formdata,
      role: selectedRole,
      isParent: defaultParent,
    });
  };

  // sql injuction,
  function isSafeInput(input) {
    const regex = /([';\/*-])/g; // Characters to look for in input
    return !regex.test(input);
  }

  const RegisterUser = async () => {
    const { userName, userEmail, password, c_password, loginId } = formdata;

    if (
      !isSafeInput(userName) ||
      !isSafeInput(userEmail) ||
      !isSafeInput(password) ||
      !isSafeInput(c_password) ||
      !isSafeInput(loginId)
    ) {
      toast.error("Input contains invalid email", {
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

    if (formdata.password === formdata.c_password) {
      setloading(true);
      const form = {
        ...formdata,
        addedBy: User?.id,
        userContact: LeadContact,
        agency: 1,
      };
      // let isParent;
      // if (UserRole !== 1 || UserRole !== 7 || UserRole !== 3) {
      //   isParent = 102;
      // } else {
      //   form["isParent"] = isParent;
      // }

      // console.log("formdata::: ", form);

      await axios
        .post(`${BACKEND_URL}/register`, form)
        .then((result) => {
          // console.log("result", result);
          if (result.data.success) {
            toast.success("Registration Completed Successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
          setloading(false);
          addUserModelClose();
        })
        .catch((err) => {
          // console.log("error : ", err);
          toast.error("Something went Wrong! Please Try Again", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setloading(false);
        });
    } else {
      setPasswordError("Your Password & Confirm Password must be Same");
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("auth-token");
    const rolesResult = await axios.get(`${BACKEND_URL}/roles`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const data = rolesResult.data?.role?.data;

    const filterRole = data?.filter(
      (role) =>
        role?.role.toLowerCase() === "admin" ||
        role?.role.toLowerCase() === "administrator" ||
        role?.role.toLowerCase() === "head of sales"
    );

    setFilterRole(filterRole);

    // console.log("filtered Roles: ", filterRole);
    setAllRoles(data);
    setFetchingRoles(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log("User Model: ", formdata);

  // MODAL CLOSE
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      addUserModelClose();
    }, 1000);
  };

  // USER ROLE SELECTION
  const role_options = allRoles.map((role) => ({
    value: role.id,
    label: role.role,
  }));
  const selectedOption = role_options.find((role) => role.value === UserRole);

  // MANAGER SELECTION
  const manager_options = Managers.map((manager) => ({
    value: manager.id,
    label: manager.userName,
  }));

  // SUPERVISOR SELECTION
  const sup_options = filterUser.map((parent) => ({
    value: parent.id,
    label: parent.userName,
  }));

  // USER CONTACT
  const [LeadContact, setLeadContact] = useState("");
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const handleContact = () => {
    setError(false);
    const inputValue = value;
    // console.log("Phone: ", inputValue);
    if (inputValue && isPossiblePhoneNumber(inputValue)) {
      // console.log("Possible: ", inputValue);
      if (isValidPhoneNumber(inputValue)) {
        setLeadContact(formatPhoneNumberIntl(inputValue));
        // console.log("Valid lead contact: ", LeadContact);
        // console.log("Valid input: ", inputValue);
        setError(false);
      } else {
        setError("Not a valid number.");
      }
    } else {
      setError("Not a valid number.");
    }
  };

  // CHANGE PARENT
  const ChangeParent = (event) => {
    const selectedParent = event.value;
    setformdata({ ...formdata, isParent: selectedParent });
  };

  // SUPERVISORS
  const fetchUserRole = async () => {
    const token = localStorage.getItem("auth-token");
    // FETCH ROLE 1
    // const r1Result = await axios.get(`${BACKEND_URL}/users?role=1`, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + token,
    //   },
    // });
    // FETCH ROLE 2
    const r2Result = await axios.get(`${BACKEND_URL}/users?role=2`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    // const dataR1 = r1Result.data.managers?.data || [];
    const dataR2 = r2Result.data.managers?.data || [];

    const combinedData = [
      // ...dataR1,
      ...dataR2,
    ];
    setFilterUser(combinedData);
  };

  return (
    <Modal
      keepMounted
      open={handleOpenModel}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      className="relative"
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
        } w-[100vw] h-[100vh] flex items-start justify-end`}
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
          } ${
            isLangRTL(i18n.language)
              ? currentMode === "dark" && " border-primary border-r-2"
              : currentMode === "dark" && " border-primary border-l-2"
          }
          p-4 h-[100vh] w-[80vw] overflow-y-scroll 
          `}
        >
          {fetchingRoles ? (
            <CircularProgress />
          ) : (
            <>
              <div className="w-full flex items-center pb-3 ">
                <div
                  className={`${
                    isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                  } bg-primary h-10 w-1 rounded-full my-1`}
                ></div>
                <h1
                  className={`text-lg font-semibold ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {t("button_add_user")}
                </h1>
              </div>

              <div className="w-full">
                <form
                  className="p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    RegisterUser();
                  }}
                >
                  <input type="hidden" name="remember" defaultValue="true" />
                  <Box sx={darkModeColors}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* USER DETAILS  */}
                      <div className="p-4">
                        <div className="text-primary w-full text-center font-semibold mb-5">
                          {t("user_details")}
                        </div>
                        {/* USER NAME  */}
                        <TextField
                          id="username"
                          type={"text"}
                          label={t("label_user_name")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          size="small"
                          required
                          value={formdata?.userName}
                          onChange={(e) => {
                            setformdata({
                              ...formdata,
                              userName: e.target.value,
                            });
                          }}
                        />
                        {/* USER EMAIL  */}
                        <TextField
                          id="userEmail"
                          type={"email"}
                          label={t("label_email_address")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          size="small"
                          // error={!!emailError}
                          required
                          value={formdata?.userEmail}
                          onChange={handleEmail}
                        />
                        {emailError && (
                          <p className="italic text-primary">{emailError}</p>
                        )}
                        {/* USER CONTACT  */}
                        <PhoneInput
                          id="userContact"
                          placeholder={t("label_contact_number")}
                          value={value}
                          onChange={handleContact}
                          // onKeyUp={handleContact}
                          error={error}
                          className={` ${classNames({
                            "dark-mode": currentMode === "dark",
                            "phone-input-light": currentMode !== "dark",
                            "phone-input-dark": currentMode === "dark",
                          })} mb-5`}
                          size="small"
                          style={{
                            background: "transparent",
                            "& .PhoneInputCountryIconImg": {
                              color: "#fff",
                            },
                            color: currentMode === "dark" ? "white" : "black",
                            border: `1px solid ${
                              currentMode === "dark" ? "#EEEEEE" : "#666666"
                            }`,
                            borderRadius: "5px",
                            outline: "none",
                          }}
                          inputStyle={{
                            outline: "none !important",
                          }}
                        />
                        {error && (
                          <Typography variant="body2" color="error">
                            {error}
                          </Typography>
                        )}
                        {/* USER ROLE  */}
                        <Select
                          id="user-role"
                          value={selectedOption}
                          onChange={ChangeUserRole}
                          options={role_options}
                          placeholder={t("account_type")}
                          menuPortalTarget={document.body}
                          className="w-full"
                          styles={{
                            ...selectStyles(currentMode, primaryColor),
                          }}
                        />

                        {/* IF AGENT, SELECT MANAGER  */}
                        {UserRole === 7 && (
                          <Select
                            id="parentId"
                            value={manager_options.find(
                              (option) => option.value === formdata?.isParent
                            )}
                            onChange={ChangeParent}
                            options={manager_options}
                            placeholder={t("label_select_manager")}
                            className="w-full"
                            styles={selectStyles(currentMode, primaryColor)}
                          />
                        )}

                        {/* IF MANAGER, SELECT SUPERVISOR  */}
                        {UserRole === 3 && (
                          <Select
                            id="parentId"
                            value={sup_options.find(
                              (option) => option.value === formdata?.isParent
                            )}
                            onChange={ChangeParent}
                            options={sup_options}
                            placeholder={t("label_select_manager")}
                            className="w-full mb-3"
                            styles={selectStyles(currentMode, primaryColor)}
                          />
                        )}
                      </div>

                      {/* LOGIN DETAILS  */}
                      <div className="p-4">
                        <div className="text-primary w-full text-center font-semibold mb-5">
                          {t("login_details")}
                        </div>
                        {/* LOGIN ID  */}
                        <TextField
                          id="login-id"
                          type={"text"}
                          label={t("login_id")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          size="small"
                          required
                          value={formdata?.loginId}
                          onChange={(e) => {
                            setformdata({
                              ...formdata,
                              loginId: e.target.value,
                            });
                          }}
                        />
                        {/* PASSWORD  */}
                        <TextField
                          id="password"
                          type={"password"}
                          label={t("label_new_password")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          size="small"
                          required
                          value={formdata?.password}
                          onChange={handlePassword}
                          placeholder={"Abc123@#"}
                        />
                        {/* CONFIRM PASSWORD  */}
                        <TextField
                          id="confirm-password"
                          type={"password"}
                          label={t("label_confirm_password")}
                          className="w-full"
                          style={{
                            marginBottom: "20px",
                          }}
                          variant="outlined"
                          size="small"
                          required
                          value={formdata?.c_password}
                          onChange={(e) => {
                            setPasswordError(false);
                            setformdata({
                              ...formdata,
                              c_password: e.target.value,
                            });
                          }}
                        />
                        {passwordError && (
                          <p className="italic text-primary">{passwordError}</p>
                        )}
                      </div>
                    </div>
                  </Box>
                  <div className="p-4">
                    <button
                      disabled={loading ? true : false}
                      type="submit"
                      className="disabled:opacity-50 disabled:cursor-not-allowed group relative flex w-full justify-center rounded-md border border-transparent bg-btn-primary py-3 px-4 text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 text-md font-bold uppercase"
                    >
                      {loading ? (
                        <CircularProgress
                          sx={{ color: "white" }}
                          size={18}
                          className="text-white"
                        />
                      ) : (
                        <span>{t("button_add_user")}</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModel;
