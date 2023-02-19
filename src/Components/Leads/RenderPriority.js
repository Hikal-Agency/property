import { Button } from "@material-tailwind/react";
import { Box, CircularProgress, Dialog, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { IoIosAlert } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const RenderPriority = ({cellValues}) => {
  const [btnloading, setbtnloading] = useState(false);
  const [Priority, setPriority] = useState(cellValues?.row?.priority);
  const [newPriority, setnewPriority] = useState("");
  const [PriorityDialogue, setPriorityDialogue] = useState(false);
  // eslint-disable-next-line
  const [confirmbtnloading, setconfirmbtnloading] = useState(false);
  const { currentMode, setreloadDataGrid, reloadDataGrid } = useStateContext();

  const ChangePriority = (e) => {
    setnewPriority(e.target.value);
    setPriorityDialogue(true);
  };
  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium,& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        border: "none",
        fontSize: "0.9rem",
        fontWeight: "500",
      },
    "& .MuiOutlinedInput-notchedOutline": {
      // borderColor: currentMode === "dark" ? "white" : "black",
      border: "none",
    },
  };
  const UpdatePriority = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    UpdateLeadData.append("lid", cellValues?.row?.lid);
    UpdateLeadData.append("priority", newPriority);

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
        console.log("Priority Updated successfull");
        console.log(result);
        toast.success("Priority Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        setPriority(newPriority);
        setreloadDataGrid(!reloadDataGrid);
        setPriorityDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Priority", {
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
      className={`${
        currentMode === "dark" ? "bg-gray-800" : "bg-gray-200"
      } w-full h-full flex items-center justify-center`}
      sx={SelectStyles}
    >
      <Select
        id="priority"
        value={Priority}
        label="Priority"
        onChange={ChangePriority}
        size="medium"
        className="w-[90%] h-[75%]"
        displayEmpty
        required
      >
        <MenuItem value={null} disabled>
          Set Priority
        </MenuItem>
        <MenuItem value={"Not Set"}>Not Set</MenuItem>
        <MenuItem value={"High"}>High</MenuItem>
        <MenuItem value={"Medium"}>Medium</MenuItem>
        <MenuItem value={"Low"}>Low</MenuItem>
      </Select>
      {PriorityDialogue && (
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
            open={PriorityDialogue}
            onClose={(e) => setPriorityDialogue(false)}
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
                  Do You Really Want Change the Priority from{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {Priority === null ? "Null" : Priority}
                  </span>{" "}
                  to{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {newPriority}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => UpdatePriority(cellValues)}
                >
                  {btnloading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    <span>Confirm</span>
                  )}
                </Button>

                <Button
                  onClick={() => setPriorityDialogue(false)}
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

export default RenderPriority;
