import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
} from "@mui/material";
import { IoIosAlert, IoMdClose } from "react-icons/io";

import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const SalaryDeductDailogue = ({ showDailogue, setDialogue }) => {
  console.log("showdialogue: ", showDailogue);
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
  const [reason, setReason] = useState(null);
  const [btnloading, setloading] = useState(false);

  const handleClick = async () => {
    setloading(true);
    try {
      const UpdateReason = await axios.post(
        `${BACKEND_URL}/attendance/${showDailogue?.id}`,
        { late_reason: reason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Reason updated successfully.", {
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
      setDialogue(false);

      console.log("Response: ", UpdateReason);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Unable to Reason.", {
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
              backgroundColor: "rgba(0, 0, 0, 0.5) !important",
            },
        }}
        open={showDailogue}
        onClose={(e) => setDialogue(false)}
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
          onClick={() => setDialogue(false)}
        >
          <IoMdClose size={18} />
        </IconButton>
        <div className="px-10 py-5">
          <div className="flex flex-col justify-center items-center">
            <IoIosAlert size={50} className="text-main-red-color text-2xl" />
            <h1 className="font-semibold pt-3 text-lg text-center mb-3">
              Enter late reason
            </h1>
            <TextField
              id="master"
              type={"text"}
              label="Enter reason"
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
              value={showDailogue?.late_reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            />

            <div className="action buttons mt-5 flex items-center justify-center space-x-2">
              <Button
                className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                ripple={true}
                size="lg"
                type="submit"
                onClick={handleClick}
              >
                {/* <span>Confirm</span> */}
                {btnloading ? (
                  <CircularProgress size={18} sx={{ color: "red" }} />
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

export default SalaryDeductDailogue;
