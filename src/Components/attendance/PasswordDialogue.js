import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";

import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const PasswordDialogue = ({
  passwordConfirm,
  exportDataGridAsPDF,
  setPasswordConfirm,
}) => {
  const token = localStorage.getItem("auth-token");
  const {
    User,
    currentMode,
    darkModeColors,
    setopenBackDrop,
    BACKEND_URL,
    setUser,
    DataGridStyles,
    pageState,
    setpageState,
  } = useStateContext();
  const [password, setPassword] = useState();
  const [btnloading, setloading] = useState(false);

  const handleClick = async () => {
    setloading(true);
    if (!password) {
      setloading(false);
      toast.error("Kindy enter a password.", {
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
    try {
      const UserData = new FormData();
      UserData.append("loginId", User?.loginId);
      UserData.append("password", password);

      const AuthUser = await axios.post(`${BACKEND_URL}/login`, UserData);

      toast.success("Pdf will be downloaded in a while.", {
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
      setPasswordConfirm(false);
      exportDataGridAsPDF();

      console.log("Response: ", AuthUser);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Password Invalid.", {
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
  };

  return (
    <>
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            boxShadow: "none !important",
          },
          "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
            {
              backgroundColor: "rgba(0, 0, 0, 0.6) !important",
            },
        }}
        open={passwordConfirm}
        onClose={(e) => setPasswordConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="relative"
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 12,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={() => setPasswordConfirm(false)}
        >
          <IoMdClose size={18} />
        </IconButton>
        <div className="px-10 py-5">
          <div className="flex flex-col justify-center items-center">
            {/* <IoIosAlert size={50} className="text-main-red-color text-2xl" /> */}
            <h1 className="font-semibold pt-3 text-lg text-center mt-7 mb-5">
              Kindly Enter the login password to download pdf.
            </h1>

            <TextField
              id="master"
              type={"password"}
              label="Enter Password"
              className={`w-full mb-5 ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
              sx={{
                marginBottom: "20px",
                // input: {
                //   color: `${currentMode === "dark" ? "#ffffff" : "#000000"}`,
                // },
              }}
              variant="outlined"
              size="medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />

            <div className="action buttons mt-5 flex items-center justify-center space-x-2">
              <Button
                className={` rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                ripple={true}
                size="lg"
                type="submit"
                onClick={handleClick}
              >
                {/* <span>Confirm</span> */}
                {btnloading ? (
                  <CircularProgress size={18} className="text-primary" />
                ) : (
                  <span>Confirm</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PasswordDialogue;
