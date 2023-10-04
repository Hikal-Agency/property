import {
  Modal,
  Backdrop,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import fileDownload from 'js-file-download'; 
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import {GiShare} from "react-icons/gi";
import {AiOutlineDownload} from "react-icons/ai"
import axios from "axios";
import {toast} from "react-toastify";

import { useStateContext } from "../../context/ContextProvider";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const SingleImageModal = ({ singleImageModal, handleClose }) => {
  const { currentMode } = useStateContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function downloadImage(url) {
    axios.get(url, {
      responseType: 'blob',
      
    }).then(res => {
      fileDownload(res.data, "download");
    });
  }
  const handleDownloadSingle = () => {
    downloadImage(singleImageModal?.url);
    handleClose();
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(singleImageModal?.url);

    toast.success("Image URL is copied", {
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

  return (
    <Modal
      keepMounted
      open={singleImageModal?.isOpen}
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
        className={`w-[calc(100%-20px)] md:w-[70%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-5 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 5,
            top: 2,
            zIndex: 10000,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <IoMdClose size={18} />
        </IconButton>

        <div className="flex items-center">
          <Button
            onClick={handleClick}
            style={{ color: "white", marginRight: "8px" }}
            variant="contained"
            className="bg-btn-primary"
          >
            <AiOutlineDownload size={19}/>
          </Button>
          <Button
          onClick={handleCopyLink}
            style={{ color: "white" }}
            variant="contained"
            className="bg-btn-primary"
          >
            <GiShare size={19}/>
          </Button>
          
          <Menu
            elevation={0}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleDownloadSingle} disableRipple>
              Download
            </MenuItem>
            <MenuItem onClick={handleCloseMenu} disableRipple>
              Download All
            </MenuItem>
          </Menu>
        </div>

        <div className="mt-4">
          <img
            className="w-full rounded h-auto object-contain"
            src={singleImageModal?.url}
            alt=""
          />
        </div>
      </div>
    </Modal>
  );
};

export default SingleImageModal;
