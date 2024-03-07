import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
} from "@mui/material";
import Select from "@mui/material/Select";
import { socket } from "../../Pages/App";

import axios from "../../axoisConfig";
import React, { useState, useRef, useEffect } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const UpdateAssigneSelect = ({ cellValues, setSupportUser, supportUser }) => {
  console.log("Support users list:: ", supportUser);
  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [Priority, setPriority] = useState(cellValues?.row?.assigned_to);
  const [newPriority, setnewPriority] = useState("");
  const [PriorityDialogue, setPriorityDialogue] = useState(false);
  const {
    currentMode,
    setreloadDataGrid,
    reloadDataGrid,
    BACKEND_URL,
    User,
    t,
  } = useStateContext();

  const [selectedPriority, setSelectedPriority] = useState(Priority);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("auth-token");

  const handlePriorityChange = (newPriority) => {
    setSelectedPriority(newPriority);
    setIsDropdownOpen(false);

    setnewPriority(newPriority);
    setPriorityDialogue(true);
  };

  const fetchsupportUsers = async () => {
    setLoading(false);
    try {
      const response = await axios.get(`${BACKEND_URL}/supportusers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("support  users::: ", response);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error::: ", error);
      toast.error("Unable to fetch support users.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  console.log("Priority: ", Priority);

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

  const selectedItemColor = {
    closed: "#B95454",
    open: "#49DA7D",
    pending: "#3B659A",
    resolved: "#AF78E5",
    "in process": "#2445b6",
  };

  const UpdatePriority = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    // UpdateLeadData.append("id", cellValues?.row?.id);
    UpdateLeadData.append("status", newPriority);

    console.log(cellValues);

    await axios
      .post(`${BACKEND_URL}/tickets/${cellValues?.row?.id}`, UpdateLeadData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Ticket Updated successfull");
        console.log(result);
        socket.emit("notification_ticket_update", {
          from: { id: User?.id, userName: User?.userName },
          ticketNumber: result?.data?.ticket?.id,
          newStatus: result?.data?.ticket?.status,
          participants: [],
        });
        toast.success("Ticket Updated Successfully", {
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
        toast.error("Error in Updating Ticket", {
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

  return (
    <div className="w-full h-full">
      <Box
        sx={SelectStyles}
        className={`w-full h-full flex items-center justify-center`}
      >
        <FormControl
          className={`${currentMode === "dark" ? "text-white" : "text-black"}`}
          sx={{
            ".MuiSelect-select": {
              fontSize: 11,
            },
          }}
        >
          <Select
            id="status"
            value={selectedPriority || "select"}
            onChange={(e) => handlePriorityChange(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                // color: selectedItemColor[selectedPriority],
                fontWeight: "bold",
              },
            }}
            MenuProps={{
              sx: {
                "&& .Mui-selected": {
                  // color: selectedItemColor[selectedPriority.toLowerCase()],
                },
              },
            }}
          >
            <MenuItem value={"select"}>{t("label_select_support")}</MenuItem>
            {selectedPriority === 102 && (
              <MenuItem value={selectedPriority}>
                {cellValues?.row?.assigned_to_name}
              </MenuItem>
            )}

            {supportUser?.length > 0 &&
              supportUser?.map((user) => (
                <MenuItem value={user?.id}>{user?.userName}</MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Box
        className={`w-full h-full flex items-center justify-center`}
        sx={SelectStyles}
      >
        {PriorityDialogue && (
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
                  <IoIosAlert size={50} className="text-primary text-2xl" />
                  <h1 className="font-semibold pt-3 text-lg text-center">
                    {t("want_to_change_priority")} {t("from")}{" "}
                    <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                      {Priority === null ? "Null" : Priority}
                    </span>{" "}
                    {t("to")}{" "}
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
                      <span>{t("confirm")}</span>
                    )}
                  </Button>

                  <Button
                    onClick={() => setPriorityDialogue(false)}
                    ripple={true}
                    variant="outlined"
                    className={`shadow-none  rounded-md text-sm  ${
                      currentMode === "dark"
                        ? "text-white border-white"
                        : "text-primary border-primary"
                    }`}
                  >
                    {t("cancel")}
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

export default UpdateAssigneSelect;
