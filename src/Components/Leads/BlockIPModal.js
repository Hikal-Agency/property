import { useState } from "react";
import {
  CircularProgress,
  Modal,
  Backdrop,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";
import { useStateContext } from "../../context/ContextProvider";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const BlockIPModal = ({ addNote, handleCloseIPModal, blockIPModalOpened, lead }) => {
  const { currentMode, BACKEND_URL, User, darkModeColors } = useStateContext();
  const [btnloading, setbtnloading] = useState(false);
  const [reason, setReason] = useState("");

  const blockIP = async (e, ip) => {
    e.preventDefault();
    setbtnloading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const data = {
        byIP: ip,
        reason,
      };

      if (User?.role === 1) {
        data["status"] = 1;
      }
      await axios.post(`${BACKEND_URL}/blocked`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      addNote(reason);
      toast.success("Requested successfuly to block this IP!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
      handleCloseIPModal();
    } catch (error) {
      console.log(error);
      toast.error("Request to block IP failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setbtnloading(false);
    }
  };
  return (
    <Modal
      keepMounted
      open={blockIPModalOpened}
      onClose={handleCloseIPModal}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div
        style={style}
        className={`w-[calc(100%-20px)] md:w-[40%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <div className="flex flex-col justify-center items-center">
          <IoIosAlert size={50} className="text-main-red-color text-2xl" />
          <h1 className="font-semibold pt-3 text-lg w-[60%] mx-auto text-center">
            <span
              className={`${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              Are you sure that you want to block the leads from IP{" "}
            </span>
            <span className="text-primary">{lead?.ip}</span>?
          </h1>
        </div>

        <form action="" className="mt-6" onSubmit={(e) => blockIP(e, lead?.ip)}>
          <Box sx={darkModeColors}>
            <TextField
              id="reason"
              type="text"
              label="Reason"
              className="w-full"
              sx={{
                color: currentMode === "dark" ? "#ffffff" : "#000000",
                marginBottom: "30px",
              }}
              variant="outlined"
              size="medium"
              value={reason}
              required
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
          </Box>

          <div className="action buttons flex items-center justify-center space-x-2">
            <Button
              className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
              ripple="true"
              size="lg"
              type="submit"
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "blue" }} />
              ) : (
                <span>Confirm</span>
              )}
            </Button>
            <Button
              onClick={handleCloseIPModal}
              ripple="true"
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
        </form>
      </div>
    </Modal>
  );
};

export default BlockIPModal;
