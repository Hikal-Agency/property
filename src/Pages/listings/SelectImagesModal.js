import {useState} from "react";
import { CircularProgress, Modal, Backdrop, Button } from "@mui/material";
import { IoIosAlert } from "react-icons/io";
import { useStateContext } from "../../context/ContextProvider";
import axios from "../../axoisConfig";
import {toast} from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SelectImagesModal = ({
    selectImagesModal,
    handleClose, 
}) => {
  const { currentMode, fetchSidebarData, BACKEND_URL } = useStateContext();
  const [deletebtnloading, setdeletebtnloading] = useState(false);

  return (
    <Modal
      keepMounted
      open={selectImagesModal}
      onClose={handleClose}
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
        
      </div>
    </Modal>
  );
};

export default SelectImagesModal;
