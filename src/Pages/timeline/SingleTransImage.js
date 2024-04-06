import {
  Modal,
  Backdrop,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { GiShare } from "react-icons/gi";
import { AiOutlineDownload } from "react-icons/ai";
import { FiTrash } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";

import { useStateContext } from "../../context/ContextProvider";

import { MdClose } from "react-icons/md";
import usePermission from "../../utils/usePermission";

const SingleTransImage = ({
  imageModal,
  handleCloseTransactionModal,
  setOpenImageModal,
}) => {
  const { BACKEND_URL } = useStateContext();
  const { hasPermission } = usePermission();

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseTransactionModal();
    }, 1000);
  };

  return (
    <Modal
      keepMounted
      open={imageModal}
      onClose={handleClose}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-75"></div>
        <div className="relative z-10 bg-white">
          <img src={imageModal?.image} alt="overlay" className="h-[90vh]" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-2xl text-white bg-[#AAAAAA] p-2 rounded-full m-0"
          >
            <MdClose />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SingleTransImage;
