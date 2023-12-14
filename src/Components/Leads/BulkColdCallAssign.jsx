
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { AiOutlineHistory } from "react-icons/ai";
import {
  Box,
  TextField,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Modal,
  Backdrop
} from "@mui/material";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { datetimeLong } from "../../Components/_elements/formatDateTime";
import Timeline from "../timeline";

import { 
  BiBlock, 
  BiBed 
} from "react-icons/bi";
import {
  BsShuffle,
  BsTrash,
  BsBuildingGear,
  BsPersonCircle,
  BsTelephone,
  BsEnvelopeAt,
  BsType,
  BsBuildings,
  BsHouse,
  BsBookmarkFill,
  BsChatLeftText,
  BsPersonPlus,
  BsPersonGear,
  BsHouseGear,
} from "react-icons/bs";
import {
  MdClose
} from "react-icons/md";
import { 
  VscCallOutgoing,
  VscMail
} from "react-icons/vsc";
import { TbLanguage, TbPhone, TbBuildingCommunity } from "react-icons/tb";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const BulkColdCallAssign = ({
  singleLeadModelOpen,
  handleClose,
}) => {
  const [loading, setloading] = useState(true);
  const [LeadData, setLeadData] = useState({});
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [LeadNotesData, setLeadNotesData] = useState(null);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const [timelinePopup, setTimelinePopup] = useState({ isOpen: false });

  const {
    currentMode,
    setopenBackDrop,
    User,
    BACKEND_URL,
    darkModeColors,
    isArabic,
    t,
    isLangRTL,
    i18n
  } = useStateContext();

  const { hasPermission } = usePermission();

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleClose();
    }, 1000);
  }


  return (
    <>
      <Modal
        keepMounted
        open={singleLeadModelOpen}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={`${isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"} ${isClosing ? (isLangRTL(i18n.language) ? "modal-close-left" : "modal-close-right") : ""}
        w-[100vw] h-[100vh] flex items-start justify-end `}>
          <button
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
            className={`${isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"}
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
            />
          </button>

          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${isLangRTL(i18n.language) ? (currentMode === "dark" && " border-primary border-r-2") : (currentMode === "dark" && " border-primary border-l-2")} 
             p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
            `}
          >
           lkajsdf

          
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BulkColdCallAssign;
