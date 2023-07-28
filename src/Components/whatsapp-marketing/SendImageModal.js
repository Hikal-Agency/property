import { useState } from "react";
import {
  Modal,
  Button,
  Backdrop,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
// import axios from "axios";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { socket } from "../../Pages/App";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SendImageModal = ({ sendImageModal, handleCloseImageModal }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [imageCaption, setImageCaption] = useState("");
  const [btnloading, setbtnloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setbtnloading(true);

      const waDevice = localStorage.getItem("authenticated-wa-device");
      if (waDevice) {
        console.log(sendImageModal?.rows)
        socket.emit("send-bulk-image", {
          contacts: sendImageModal?.rows,
          img: sendImageModal?.img,
          id: waDevice,
          caption: imageCaption,
        });
      }

      setbtnloading(false);
      handleCloseImageModal();
    } catch (error) {
      console.log(error);
      toast.error("Template update failed", {
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
    <>
      <Modal
        keepMounted
        open={sendImageModal?.isOpen}
        onClose={handleCloseImageModal}
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
          className={`w-[calc(100%-20px)] md:w-[50%]  ${
            currentMode === "dark" ? "bg-gray-900" : "bg-white"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={handleCloseImageModal}
          >
            <IoMdClose size={18} />
          </IconButton>
          <h1 className="font-bold text-lg">Send Whatsapp Image</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <TextField
              id="caption"
              type={"text"}
              label="Caption"
              className="w-full mb-5"
              style={{ marginBottom: "10px" }}
              variant="outlined"
              size="medium"
              required
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
            />

            <img className="w-[60%] h-[60%] mx-auto rounded py-5" src={sendImageModal?.img} alt=""/>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ padding: "10px 0", backgroundColor: "#da1f26"}}
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <span>Send</span>
              )}
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default SendImageModal;
