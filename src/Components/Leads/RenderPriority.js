import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  // Select,
} from "@mui/material";
import Select from "@mui/material/Select";
import { socket } from "../../Pages/App";

import axios from "../../axoisConfig";
import React, { useState, useRef, useEffect } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

import { TbFlag3Filled, TbFlag3 } from "react-icons/tb";

const RenderPriority = ({ cellValues }) => {
  const [btnloading, setbtnloading] = useState(false);
  const [Priority, setPriority] = useState(cellValues?.row?.priority);
  const [newPriority, setnewPriority] = useState("");
  const [PriorityDialogue, setPriorityDialogue] = useState(false);
  // eslint-disable-next-line
  const [confirmbtnloading, setconfirmbtnloading] = useState(false);
  const { currentMode, setreloadDataGrid, reloadDataGrid, BACKEND_URL, User, Managers} =
    useStateContext();

  const [selectedPriority, setSelectedPriority] = useState(Priority);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleFlagClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(true);
  };
  
  const handlePriorityChange = (newPriority) => {
    setSelectedPriority(newPriority);
    setIsDropdownOpen(false);
    
    setnewPriority(newPriority);
    setPriorityDialogue(true);
  };


  console.log("Priority: ", Priority);

  const ChangePriority = (e) => {
    setnewPriority(e.target.value);
    setPriorityDialogue(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SelectStyles = {
    "& .MuiInputBase-root, & .MuiSvgIcon-fontSizeMedium,& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline ":
      {
        color: currentMode === "dark" ? "white" : "black",
        // borderColor: currentMode === "dark" ? "white" : "black",
        border: "none",
        fontSize: "12px",
        fontWeight: "400",
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
    UpdateLeadData.append("id", cellValues?.row?.leadId);
    UpdateLeadData.append("priority", newPriority);

    console.log(cellValues);

    await axios
      .post(`${BACKEND_URL}/leads/${cellValues?.row?.leadId}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Priority Updated successfull");
        console.log(result);
        socket.emit("notification_priority_update", {
          from: {id: User?.id, userName: User?.userName}, 
          leadName: cellValues?.row?.leadName, 
          newPriority,
          participants: [cellValues?.row?.assignedToManager || 0, cellValues?.row?.assignedToSales || 0]
        })
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

  const priorityColors = {
    High: "red",
    Medium: "yellow",
    Low: "gray",
  };

  const getFlagIcon = () => {
    if (!Priority) {
      return (
        <TbFlag3 size={20} className="text-[#AAAAAA]" />
      )
    }
    else {
      return (
        <TbFlag3Filled size={20} className={`text-${priorityColors[selectedPriority]}-500`} />
      )
    }
  }

  return (
    <div className="w-full h-full">
      <Box 
      sx={SelectStyles}
      className={`w-full h-full flex items-center justify-center`} >
        <IconButton onClick={handleFlagClick} style={{ zIndex: 1001 }}>
          {getFlagIcon()}
        </IconButton>
        {isDropdownOpen && (
          <FormControl className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
          sx={{".MuiSelect-select": {
            fontSize: 11,
          }}}>
            <Select
              id="priority"
              value={selectedPriority}
              onChange={(e) => handlePriorityChange(e.target.value)}
            >
              <MenuItem value={"High"}>High</MenuItem>
              <MenuItem value={"Medium"}>Medium</MenuItem>
              <MenuItem value={"Low"}>Low</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>
       
      <Box
        className={`w-full h-full flex items-center justify-center`}
        sx={SelectStyles}
      >
        {/* <FormControl sx={{ m: 1, minWidth: 80, border: 1, borderRadius: 1 }}>
          <Select
          sx={{
            "& .MuiSelect-select": {
              fontSize: 11,
            },
              color:
                currentMode === "dark"
                  ? "#ffffff !important"
                  : "#000000 !important",
          }}
            id="priority"
            value={Priority != null ? Priority : "set_priority"}
            label="Priority"
            onChange={ChangePriority}
            size="medium"
            className="w-[90%] h-[75%]"
            displayEmpty
            required
          >
            {Priority != null ? (
              <MenuItem value={Priority}>{Priority} Priority</MenuItem>
            ) : (
              <MenuItem value={"set_priority"}>---Priority---</MenuItem>
            )}
            <MenuItem value={"High"}>High</MenuItem>
            <MenuItem value={"Medium"}>Medium</MenuItem>
            <MenuItem value={"Low"}>Low</MenuItem>
          </Select>
        </FormControl> */}

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
              <IconButton
                sx={{
                  position: "absolute",
                  right: 12,
                  top: 10,
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={() => setPriorityDialogue(false)}
              >
                <IoMdClose size={18} />
              </IconButton>
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
    </div>
  );
};

export default RenderPriority;
