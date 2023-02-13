import { Button } from "@material-tailwind/react";
import { CircularProgress, Dialog, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState } from "react";
import { IoIosAlert } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const RenderFeedback = (cellValues) => {
  const [btnloading, setbtnloading] = useState(false);
  const [Feedback, setFeedback] = useState(cellValues?.row?.feedback);
  const [newFeedback, setnewFeedback] = useState("");
  const [Dialogue, setDialogue] = useState(false);
  const { currentMode, setreloadDataGrid, reloadDataGrid } = useStateContext();
  const ChangeFeedback = (e) => {
    setnewFeedback(e.target.value);
    setDialogue(true);
  };

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium, & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        fontSize: "0.9rem",
        fontWeight: "500",
        // borderLeft: currentMode === "dark" ? "1px solid white" : "1px solid black",
        // borderRight: currentMode === "dark" ? "1px solid white" : "1px solid black",
        border: "none",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };
  const UpdateFeedback = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    UpdateLeadData.append("lid", cellValues?.row?.lid);
    UpdateLeadData.append("feedback", newFeedback);

    await axios
      .post(
        `https://staging.hikalcrm.com/api/leads/${cellValues?.row?.lid}`,
        UpdateLeadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("Feedback Updated successfull");
        console.log(result);
        toast.success("Feedback Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        setFeedback(newFeedback);
        setreloadDataGrid(!reloadDataGrid);
        setDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Feedback", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
      });
  };
  return (
    <Box
      className={`w-full h-full flex items-center justify-center ${
        currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
      }`}
      sx={SelectStyles}
    >
      <Select
        id="feedback"
        value={Feedback}
        label="Feedback"
        onChange={ChangeFeedback}
        size="medium"
        className="w-[100%] h-[75%] border-none"
        displayEmpty
        required
      >
        <MenuItem value={null} disabled>
          ---SELECT---
        </MenuItem>
        <MenuItem value={"New"}>New</MenuItem>
        <MenuItem value={"Follow Up"}>Follow Up</MenuItem>
        <MenuItem value={"Meeting"}>Meeting</MenuItem>
        <MenuItem value={"Booked"}>Booked</MenuItem>
        <MenuItem value={"Duplicate"}>Duplicate</MenuItem>
        <MenuItem value={"No Answer"}>No Answer</MenuItem>
        <MenuItem value={"Low Budget"}>Low Budget</MenuItem>
        <MenuItem value={"Not Interested"}>Not Interested</MenuItem>
        <MenuItem value={"Unreachable"}>Unreachable</MenuItem>
      </Select>
      {Dialogue && (
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
            open={Dialogue}
            onClose={(e) => setDialogue(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <div className="px-10 py-5">
              <div className="flex flex-col justify-center items-center">
                <IoIosAlert
                  size={50}
                  className="text-main-red-color text-2xl"
                />
                <h1 className="font-semibold pt-3 text-lg text-center">
                  Do You Really Want Change the Feedback from{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {Feedback}
                  </span>{" "}
                  to{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {newFeedback}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => UpdateFeedback(cellValues)}
                >
                  {btnloading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    <span>Confirm</span>
                  )}
                </Button>

                <Button
                  onClick={() => setDialogue(false)}
                  ripple={true}
                  variant="outlined"
                  className={`shadow-none  rounded-md text-sm  ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-main-red-color border-main-red-color"
                  }`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default RenderFeedback;
