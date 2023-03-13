import { Button } from "@material-tailwind/react";
import {
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosAlert, IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";

const RenderManagers = ({ cellValues }) => {
  const [manager2, setmanager2] = useState(cellValues?.row?.assignedToManager);
  const [newManager, setnewManager] = useState("");
  const [Dialogue, setDialogue] = useState(false);
  const {
    currentMode,
    reloadDataGrid,
    setreloadDataGrid,
    BACKEND_URL,
    Managers,
  } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);

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
  // await axios
  //   .get("https://staging.hikalcrm.com/api/managers")
  //   .then((result) => {
  //     console.log("manager response is");
  //     console.log(result);
  //     setManagers(result?.data?.managers);
  //   });
  // await axios
  //   .get("https://staging.hikalcrm.com/api/agents")
  //   .then((result) => {
  //     setAgents(result?.data?.agents);
  //   });
  useEffect(() => {
    setmanager2(cellValues?.row?.assignedToManager);
      // axios.get(`${BACKEND_URL}/managers`).then((result) => {
      //   console.log("manager response is");
      //   console.log(result);
      //   setManagers(result?.data?.managers);
      // });
    // axios.get("https://staging.hikalcrm.com/api/agents").then((result) => {
    //   setAgents(result?.data?.agents);
    // });
    // eslint-disable-next-line
  }, [cellValues?.row?.assignedToManager]);

  const ChangeManager = (e) => {
    setnewManager(e.target.value);
    setDialogue(true);
  };
  const UpdateManager = async () => {
    setbtnloading(true);
    const token = localStorage.getItem("auth-token");
    const UpdateLeadData = new FormData();
    UpdateLeadData.append("lid", cellValues?.row?.lid);
    UpdateLeadData.append("assignedToManager", newManager);

    await axios
      .post(
        `${BACKEND_URL}/leads/${cellValues?.row?.lid}`,
        UpdateLeadData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      )
      .then((result) => {
        console.log("Manager Updated successfull");
        console.log(result);
        toast.success("Manager Updated Successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
        setmanager2(newManager);
        setreloadDataGrid(!reloadDataGrid);
        setDialogue(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error in Updating Manager", {
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
        id="manager"
        value={manager2}
        label="Manager"
        onChange={ChangeManager}
        size="medium"
        className="w-[100%] h-[75%]"
        displayEmpty
        required
      >
        <MenuItem value="" disabled>
        - - - - -
        </MenuItem>
        {Managers.map((manager, index) => {
          return (
            <MenuItem key={index} value={manager?.id}>
              {manager?.userName}
            </MenuItem>
          );
        })}
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
                <IoIosAlert
                  size={50}
                  className="text-main-red-color text-2xl"
                />
                <h1 className="font-semibold pt-3 text-lg text-center">
                  Do You Really Want Change the Manager from{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {manager2}
                  </span>{" "}
                  to{" "}
                  <span className="text-sm bg-gray-400 px-2 py-1 rounded-md font-bold">
                    {newManager}
                  </span>{" "}
                  ?
                </h1>
              </div>
              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple={true}
                  size="lg"
                  onClick={() => UpdateManager(cellValues)}
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

export default RenderManagers;
