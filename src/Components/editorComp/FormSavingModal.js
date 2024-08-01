import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  // Select,
} from "@mui/material";
import Select from "react-select";
import { selectStyles } from "../_elements/SelectStyles";

import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";
import CreateFolderModal from "./CreateFolderModal";

import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const FormSavingModal = ({
  formSavingModal,
  setFormSavingModal,
  folders,
  fetchFolders,
  selectedFolder,
  setSelectedFolder,
  saveForm,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, primaryColor } =
    useStateContext();
  const [folderModal, setFolderModal] = useState(false);

  console.log("i am the error:::::::");

  return (
    <>
      <Modal
        keepMounted
        open={formSavingModal}
        onClose={() => setFormSavingModal(false)}
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
          className={`w-[calc(100%-20px)] md:w-[30%]  ${
            // currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
            currentMode === "dark"
              ? "bg-dark-neu text-white"
              : "bg-light text-black"
          } absolute top-1/2 left-1/2 p-5 rounded-md`}
        >
          <h3
            className={`text-2xl mb-6 mt-3 font-medium  ${
              currentMode === "dark" ? "text-white" : "text-gray-700"
            } `}
          >
            {t("select_folder_message")}
          </h3>
          <p className="mb-4 text-red-500">
            {folders?.length === 0 && t("folder_create_message")}
          </p>

          <Select
            aria-label="select Manager"
            id="select-language"
            options={folders.map((folder) => ({
              value: folder?.id,
              label: folder?.name,
            }))}
            value={selectedFolder}
            onChange={(e) => {
              setSelectedFolder(e);
            }}
            placeholder={t("Select Folder")}
            className={`mb-5`}
            menuPortalTarget={document.body}
            styles={selectStyles(currentMode, primaryColor)}
          />
          <div className="flex gap-3 justify-end items-center">
            <Button
              onClick={() => setFormSavingModal(false)}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-3 rounded-lg h-full text-sm flex gap-2 border border-gray-300 text-black bg-white`}
            >
              {/* <TiArrowLeft size={16} /> */}
              {t("Cancel")}
            </Button>
            {folders?.length === 0 && (
              <Button
                onClick={() => setFolderModal(true)}
                ripple={true}
                variant="outlined"
                className={`shadow-none px-3 rounded-lg h-full text-sm flex gap-2 border border-gray-300 text-black bg-white`}
              >
                {/* <TiArrowLeft size={16} /> */}
                {t("Create Folder")}
              </Button>
            )}
            <Button
              onClick={() => saveForm()}
              ripple={true}
              variant="outlined"
              className={`shadow-none px-3 rounded-lg h-full text-sm flex gap-2 border border-gray-300 text-black bg-white`}
              disabled={!selectedFolder}
            >
              {/* <TiArrowLeft size={16} /> */}
              {t("Continue")}
            </Button>
          </div>
        </div>
      </Modal>
      <CreateFolderModal
        folderModal={folderModal}
        setFolderModal={setFolderModal}
        fetchFolders={fetchFolders}
      />
    </>
  );
};

export default FormSavingModal;
