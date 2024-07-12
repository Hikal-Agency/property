import React from "react";
import { Button } from "@material-tailwind/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";

import { IoMdClose } from "react-icons/io";
import { GoDuplicate } from "react-icons/go";

import { useStateContext } from "../../context/ContextProvider";
const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const languages = [
  {
    name: "English",
    code: "en",
  },
  {
    name: "Arabic",
    code: "ar",
  },
  {
    name: "Chinese",
    code: "zh",
  },
  {
    name: "French",
    code: "fr",
  },
  {
    name: "Urdu",
    code: "ur",
  },
  {
    name: "Hindi",
    code: "hi",
  },
];

const LanguageDetectModal = ({
  language,
  setLanguage,
  setLanguageModal,
  languageModal,
  setIsVoiceSearchState,
}) => {
  const { darkModeColors, currentMode, User, BACKEND_URL, t, primaryColor } =
    useStateContext();

  return (
    <Modal
      keepMounted
      open={languageModal}
      onClose={() => setLanguageModal(false)}
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
        className={`w-[calc(30%-20px)] md:w-[30%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <h3 className="text-2xl mb-6 mt-3 font-medium text-gray-700">
          Select Language For Speech to Text{" "}
          <span className="text-red-600">*</span>
        </h3>
        <Select
          id="languageDetect"
          value={language}
          //   label="Language"
          onChange={(e) => {
            setLanguage(e?.target?.value);
            setIsVoiceSearchState((pre) => !pre);
            setLanguageModal(false);
          }}
          size="medium"
          className="w-full"
          displayEmpty
          required
        >
          {languages?.map((lang) => {
            return <MenuItem value={lang?.code}>{lang?.name}</MenuItem>;
          })}
        </Select>
      </div>
    </Modal>
  );
};

export default LanguageDetectModal;
