import React from "react";
import { Button } from "@material-tailwind/react";
import { Backdrop, Modal } from "@mui/material";

import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";

import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const ConfirmDeleteModal = ({
  deleteConfirmModal,
  setDeleteConfirmModal,
  selectedRow,
  handleDelete,
  message,
  inFolder,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, primaryColor } =
    useStateContext();

  return (
    <Modal
      keepMounted
      open={deleteConfirmModal}
      onClose={() => setDeleteConfirmModal(false)}
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
        className={` w-[calc(100%-20px)] md:w-[30%]  ${
          // currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
          currentMode === "dark"
            ? "bg-dark-neu text-white"
            : "bg-light text-black"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <div className="flex flex-col gap-8 py-2">
          <h3
            className={`text-xl mb-6 mt-3 font-medium  ${
              currentMode === "dark" ? "text-white" : "text-gray-700"
            } `}
            style={{ whiteSpace: "pre-line" }}
          >
            {message}
            <br />
            {inFolder && t("delete_folder_warning")}
            {/* <span className="text-red-600 ml-3">"{selectedRow?.name}"</span> */}
          </h3>
          <div className="flex justify-end gap-5 items-center">
            <Button
              onClick={() => setDeleteConfirmModal(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-3 rounded-md text-sm flex gap-2 border-none  text-black bg-transparent`}
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                handleDelete(selectedRow?.id);
                setDeleteConfirmModal(false);
              }}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-3 rounded-md text-sm flex gap-2 text-white border-none bg-red-600`}
            >
              {t("Delete")}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
