import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Modal,
  Tooltip,
} from "@mui/material";

import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import "react-phone-number-input/style.css";
import { datetimeLong } from "../_elements/formatDateTime";

import {
  MdClose
} from "react-icons/md";

const AddMeetLink = ({
  LeadModelOpen,
  handleLeadModelClose,
  LeadData,
}) => {
  const {
    currentMode,
    i18n,
    isLangRTL,
    t
  } = useStateContext();

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const openLink = () => {
    window.open(LeadData?.admin_link, "_blank");
    handleLeadModelClose();
  };

  const [isCopied, setIsCopied] = useState(false);
  const copyLink = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(LeadData?.meet_link);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleLeadModelClose();
    }, 1000);
  }

  return (
    <>
      {/* MODAL FOR SINGLE LEAD SHOW */}
      <Modal
        keepMounted
        open={LeadModelOpen}
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
            <div className="w-full flex items-center pb-3">
              <div className="bg-primary h-10 w-1 rounded-full my-1"></div>
              <h1
                className={`mx-2 text-lg font-semibold ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("meeting_link")}
              </h1>
            </div>

            {LeadData.meet_link === null ||
            LeadData.meet_link === "" ||
            LeadData.meet_link === "null" ? (
              <div className="w-full p-5 text-center flex flex-col gap-5">
                <div>
                  {t("waiting_time_over")}
                </div>
                <div>
                  {t("reach_by_other_source")}
                </div>
                <div className="h-0.5 w-full bg-primary my-5 rounded-full"></div>
                <div className="flex flex-col gap-5">
                  <div className="uppercase font-semibold">
                    {t("registered_lead_on")}
                  </div>
                  <div className="flex justify-center">
                    <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} p-3 rounded-xl w-fit shadow-sm`}>
                      {datetimeLong(LeadData?.creationDate)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full p-5 pt-0 text-center">
                {t("live_call_meeting_created_shared")}
                <br />
                <br />
                {t("meeting_link")}
                <br />
                <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} p-3 rounded-xl card-hover w-full my-2`}>
                  <Tooltip title="Go to Meeting" arrow>
                    <button 
                      className="w-full break-words break-all" 
                      onClick={openLink}
                    >
                      <span className="min-w-0">{LeadData?.admin_link}</span>
                    </button>
                  </Tooltip>
                </div>
                <br />
                <br />
                {t("client_meeting_link")}
                <br />
                <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} rounded-xl w-full my-2`}>
                  <div className="grid grid-cols-12 w-full h-full justify-between items-center">
                    <div className="col-span-10 p-3 w-full h-full break-words break-all">
                      <span className="min-w-0">{LeadData?.meet_link}</span>
                    </div>
                    <button
                      onClick={copyLink}
                      className="col-span-2 w-full h-full bg-primary text-white font-semibold p-3 rounded-md card-hover"
                    >
                      {isCopied ? "Link Copied!" : "Copy Link"}
                    </button>
                  </div>  
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddMeetLink;
