import {
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import {
  RiCheckLine as CheckIcon,
  RiCloseLine as CloseIcon,
} from "react-icons/ri";

import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const SalaryDeductDailogue = ({
  showDailogue,
  setDialogue,
  FetchAttendance,
}) => {
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
  const [reason, setReason] = useState(showDailogue[0]?.late_reason);
  const [btnloading, setloading] = useState(false);
  const [approveLoading, setApproveloading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleClick = async () => {
    setloading(true);
    if (!reason) {
      setloading(false);
      toast.error("Kindy enter a reason.", {
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
      const UpdateReason = await axios.post(
        `${BACKEND_URL}/attendance/${showDailogue[0]?.id}`,
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
      FetchAttendance();

      console.log("Response: ", UpdateReason);
    } catch (error) {
      setloading(false);
      console.log("Error: ", error);
      toast.error("Unable to Add Reason.", {
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

  const DeductionApproval = async (e, btn) => {
    const formData = new FormData();

    if (btn === 1) {
      setApproveloading(true);
      formData.append("notify_status", "Approved");
      formData.append("deduct_salary", 2);
      formData.append("cut_salary", "No");
      formData.append("is_late", 2);
    } else {
      setCancelLoading(true);
      formData.append("notify_status", "Rejected");
    }

    try {
      const UpdateReason = await axios.post(
        `${BACKEND_URL}/attendance/${showDailogue[0]?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      setApproveloading(false);
      setCancelLoading(false);

      toast.success(
        btn === 1
          ? "Salary undeduction approved."
          : "Salary undeduction rejected.",
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

      setDialogue(false);

      console.log("Response: ", UpdateReason);
    } catch (error) {
      setApproveloading(false);
      setCancelLoading(false);
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
            width: "60%",
          },
          "& .MuiBackdrop-root, & .css-yiavyu-MuiBackdrop-root-MuiDialog-backdrop":
            {
              backgroundColor: "rgba(0, 0, 0, 0.6) !important",
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
            <IoIosAlert size={50} className="text-primary text-2xl" />
            <h1 className="font-semibold pt-3 text-lg text-center mb-5">
              {showDailogue[1] === 0
                ? "Enter Late Reason"
                : showDailogue[0]?.notify_deduct_salary === 1
                ? "Approval required to deduct salary."
                : "Approval required to undeduct salary."}
            </h1>
            {showDailogue[1] === 0 && (
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
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                fullWidth
              />
            )}

            {showDailogue[1] === 1 && (
              <>
                <TextField
                  id="master"
                  type={"text"}
                  label=" reason"
                  className={`w-full mb-5 ${
                    currentMode === "dark" ? "text-white" : "text-black"
                  }`}
                  sx={{
                    marginBottom: "20px",
                  }}
                  variant="outlined"
                  size="medium"
                  value={reason}
                  // onChange={(e) => setReason(e.target.value)}
                  fullWidth
                />
                <TextField
                  id="master"
                  type={"text"}
                  label=" check Time"
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
                  value={showDailogue[0]?.check_datetime}
                  fullWidth
                />
                <TextField
                  id="master"
                  type={"text"}
                  label="Late Minutes"
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
                  value={showDailogue[0]?.late_minutes}
                  // onChange={(e) => setReason(e.target.value)}
                  fullWidth
                />
              </>
            )}

            <div className="action buttons mt-5 flex items-center justify-center space-x-2">
              {showDailogue[1] === 0 ? (
                <Button
                  className={`rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
                  ripple={true}
                  size="lg"
                  type="submit"
                  onClick={handleClick}
                  syle={{
                    color: "white !important",
                  }}
                >
                  {/* <span>Confirm</span> */}
                  {btnloading ? (
                    <CircularProgress size={18} />
                  ) : (
                    <span className="text-white">Confirm</span>
                  )}
                </Button>
              ) : (
                <div className="flex justify-between px-5 py-3 space-x-5">
                  <Tooltip title="Approved" arrow>
                    <IconButton
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontSize: "1rem",
                      }}
                      className="rounded-full"
                      onClick={(event) => DeductionApproval(event, 1)}
                      disabled={approveLoading}
                    >
                      {approveLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <CheckIcon />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Rejected" arrow>
                    <IconButton
                      style={{
                        backgroundColor: "#DC2626",
                        color: "white",
                        fontSize: "1rem",
                        marginLeft: "5%",
                      }}
                      className="rounded-full"
                      onClick={(event) => DeductionApproval(event, 1)}
                      disabled={cancelLoading}
                    >
                      {cancelLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <CloseIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SalaryDeductDailogue;
