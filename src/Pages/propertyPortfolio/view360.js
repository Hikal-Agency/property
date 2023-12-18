import React, { useState } from "react";
import {
  Modal,
  Backdrop,
} from "@mui/material";
import Error404 from "../Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { MdClose } from "react-icons/md";

const View360Modal = ({
  setView360Modal,
  view360Modal,
  loading,
  setloading,
}) => {
  console.log("single property data::: ", view360Modal);
  let project = view360Modal?.project;
  const [leadNotFound, setLeadNotFound] = useState(false);
  const {
    currentMode,
    isLangRTL,
    i18n,
  } = useStateContext();

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setView360Modal({
        open: false,
      });
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  return (
    <>
      <Modal
        keepMounted
        open={view360Modal?.open}
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
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
          w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
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
                ? "bg-[#1C1C1C] text-white"
                : "bg-[#FFFFFF] text-black"
            } p-4 h-[100vh] w-[80vw] overflow-y-scroll ${
                currentMode === "dark" &&
            (isLangRTL(i18n.language)
                ? "border-r-2 border-primary"
                : "border-l-2 border-primary")
            }`}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                {leadNotFound ? (
                  <Error404 />
                ) : (
                  <div className="w-full">
                    <div className="w-full flex items-center pb-3">
                      <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                      <h1
                        className={`text-lg font-semibold ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {project?.projectName}
                      </h1>
                    </div>
                    <div className="w-full h-[85vh]">
                        <iframe
                            width="100%"
                            height="100%"
                            frameborder="0"
                            allow="xr-spatial-tracking; gyroscope; accelerometer"
                            allowfullscreen
                            scrolling="yes"
                            src={project?.tourlink}
                        ></iframe>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default View360Modal;
