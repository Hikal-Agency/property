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

const SingleImageModal = ({
  singleImageModal,
  handleClose,
  fetchSingleListing,
}) => {
  const { BACKEND_URL } = useStateContext();

  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  async function downloadImage(id) {
    let url = `${BACKEND_URL}/listings/${singleImageModal?.listingId}/images/download?image_ids[0]=${id}`;
    const token = localStorage.getItem("auth-token");
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="picture.png"',
        Authorization: "Bearer " + token,
      },
    });
  }

  const handleDownloadSingle = () => {
    downloadImage(singleImageModal?.id);
    handleClose();
  };

  const handleDelete = async () => {
    try {
      setDeleteBtnLoading(true);
      const token = localStorage.getItem("auth-token");
      console.log("TOken: ", singleImageModal?.id);
      await axios.delete(
        `${BACKEND_URL}/listings/${singleImageModal?.listingId}/images`,

        {
          data: JSON.stringify({
            image_ids: [singleImageModal?.id],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Image deleted succesfuly!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchSingleListing();
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
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
    setDeleteBtnLoading(false);
  };

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
  };

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
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="fixed inset-0 bg-black opacity-75"></div>
        <div className="relative z-10 bg-white">
          <img src={singleImageModal?.url} alt="overlay" className="h-[90vh]" />
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-2xl text-white bg-[#AAAAAA] p-2 rounded-full m-0"
          >
            <MdClose />
          </button>
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center">
              <button
                onClick={handleClick}
                className="text-white bg-primary p-2 rounded-full mx-2"
              >
                <AiOutlineDownload size={19} />
              </button>
              <button
                onClick={handleCopyLink}
                className="text-white bg-primary p-2 rounded-full mx-2"
              >
                <GiShare size={19} />
              </button>
              <button
                onClick={handleDelete}
                className="text-white bg-primary p-2 rounded-full mx-2"
              >
                {deleteBtnLoading ? (
                  <CircularProgress
                    size={14}
                    sx={{ color: "white" }}
                    className="text-white"
                  />
                ) : (
                  <FiTrash size={19} />
                )}
              </button>

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
          </div>
        </div>
      </div>

      {/* <div
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
      </div> */}
    </Modal>
  );
};

export default SingleImageModal;
