import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { Backdrop, Modal } from "@mui/material";
import HeadingTitle from "../../Components/_elements/HeadingTitle";

const UpdateListModal = ({ openEdit, fetchSingleLissting, handleClose }) => {
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    t,
  } = useStateContext();
  const data = openEdit?.data;
  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };
  const [isClosing, setIsClosing] = useState(false);

  return (
    <>
      {/* <div
          className={`flex min-h-screen w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          } ${currentMode === "dark" ? "text-white" : "text-black"}`}
        > */}
      <Modal
        keepMounted
        open={openEdit?.open}
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
            } ${
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-primary border-r-2"
                : "border-primary border-l-2")
            }
                p-4 h-[100vh] w-[80vw] overflow-y-scroll
                `}
          >
            <>
              <div className="w-full">
                <HeadingTitle title={data?.title} />
              </div>
            </>
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default UpdateListModal;
