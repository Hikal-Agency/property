import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateFolderModal = ({ folderModal, setFolderModal, fetchFolders }) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    t,
    primaryColor,
    themeBgImg,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [folderName, setFolderName] = useState("");

  const primaryToRgba = (alpha) => {
    if (!primaryColor) {
      return "";
    }
    let primary = primaryColor;
    if (primaryColor === "default") {
      primary = "rgb(86, 141, 221)";
    }
    // const alpha = 0.25;
    const rgbValues = primary.match(/\d+/g);
    return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${alpha})`;
  };

  const createFolder = async () => {
    const token = localStorage.getItem("auth-token");
    const folder = new FormData();
    folder.append("name", folderName);
    try {
      const res = await axios.post(`${BACKEND_URL}/folders`, folder, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      fetchFolders();
      if (res?.status) {
        toast.success("Folder is Created Successfully", {
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

      setFolderModal(false);
    } catch (error) {
      toast.error("can't create folder", {
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
  };

  return (
    <Modal
      keepMounted
      open={folderModal}
      onClose={() => setFolderModal(false)}
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
          themeBgImg
            ? currentMode === "dark"
              ? "blur-bg-dark shadow-sm text-white"
              : "blur-bg-light shadow-sm"
            : currentMode === "dark"
            ? "bg-dark-neu text-white"
            : "bg-light-neu  shadow-sm"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div
              className="rotate-180 rounded-full p-[7px]"
              style={{ backgroundColor: primaryToRgba(0.3) }}
            >
              <div className="bg-white rounded-full">
                <div
                  className="rounded-full  p-2"
                  style={{ backgroundColor: primaryToRgba(0.15) }}
                >
                  <GoDuplicate size={26} className="text-black " />
                </div>
              </div>
            </div>
            <IconButton
              sx={{
                // position: "absolute",
                // right: 12,
                // top: 10,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => setFolderModal(false)}
            >
              <IoMdClose size={18} />
            </IconButton>
          </div>
          <h2 className="text-[18px] font-medium">Create Folder</h2>
          <p className="text-gray-600">Folder will help to organize forms</p>
          <div className="flex flex-col gap-3">
            {/* <label htmlFor="">
              Folder name <span className="text-red-400"> &nbsp;&nbsp;*</span>
            </label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Folder name"
              className="border rounded p-3 w-full focus:outline-none"
              value={folderName}
              onChange={(e) => setFolderName(e?.target?.value)}
            /> */}
            <TextField
              id="folder"
              aria-label="folder"
              type={"text"}
              label={t("Folder")}
              className="w-full"
              required
              // sx={{
              //   "&": {
              //     marginBottom: "1.25rem !important",
              //   },
              // }}
              sx={{
                ...darkModeColors,
                "& .MuiFormLabel-root, .MuiInputLabel-root, .MuiInputLabel-formControl":
                  {
                    right: isLangRTL(i18n.language) ? "2.5rem" : "inherit",
                    transformOrigin: isLangRTL(i18n.language)
                      ? "right"
                      : "left",
                  },
                "& legend": {
                  textAlign: isLangRTL(i18n.language) ? "right" : "left",
                },
              }}
              variant="outlined"
              size="small"
              value={folderName}
              onChange={(e) => setFolderName(e?.target?.value)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setFolderModal(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-3 rounded-md text-sm flex gap-2 border-black text-black bg-white`}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => createFolder(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-5 rounded-md text-sm flex gap-2 bg-black text-white border-black`}
            >
              {t("Confirm")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateFolderModal;
