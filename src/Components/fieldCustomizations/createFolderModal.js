import React from "react";
import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";
import {
  pageStyles,
  renderStyles,
  renderStyles2,
} from "../_elements/SelectStyles";

import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const CreateFolderModal = ({ folderModal, setFolderModal }) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, primaryColor } =
    useStateContext();

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
        className={`w-[calc(22%-20px)] md:w-[22%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 rounded-md px-8 pb-8`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="text-center font-semibold w-full text-gray-400">
              New Custom Field Folder
            </div>

            <div className="mt-[-7px]">
              <IconButton
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
                onClick={() => setFolderModal(false)}
              >
                <IoMdClose size={18} className="font-bold" />
              </IconButton>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label htmlFor="">
              Folder name <span className="text-red-400"> &nbsp;&nbsp;*</span>
            </label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Folder name"
              className="border rounded p-3 w-full focus:outline-none"
            />
            <label htmlFor="">
              Select Object <span className="text-red-400"> &nbsp;&nbsp;*</span>
            </label>
            <Select
              id="select-page-size-label"
              //   value={{ label: , value: pageState.pageSize }}
              //   onChange={handleRangeChange}
              options={[14, 30, 50, 75, 100].map((size) => ({
                label: size,
                value: size,
              }))}
              className="min-w-[60px] my-2"
              menuPortalTarget={document.body}
              styles={pageStyles(currentMode, primaryColor)}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              //   onClick={() => setFolderModal(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-8 rounded-md text-sm flex gap-2 border-red-500 text-white bg-red-500`}
            >
              Back
            </Button>
            <Button
              //   onClick={() => setDialogue(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-8 rounded-md text-sm flex gap-2 bg-black text-white border-black`}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateFolderModal;
