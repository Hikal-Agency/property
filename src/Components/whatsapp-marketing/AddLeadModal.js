import { useStateContext } from "../../context/ContextProvider";
import { Modal, Backdrop, IconButton } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import AddLeadComponent from "../Leads/AddLeadComponent";
import { useState } from "react";
import { MdClose } from "react-icons/md";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const AddLeadModal = ({
  addLeadModalOpen,
  handleCloseAddLeadModal,
  FetchLeads,
  noSourceDropdown,
}) => {
  const { currentMode, t, isLangRTL, i18n } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseAddLeadModal();
    }, 1000);
  };

  return (
    <>
      <Modal
        keepMounted
        open={addLeadModalOpen}
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
        w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
            // onClick={handleLeadModelClose}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {/* <IconButton
              sx={{
                position: "absolute",
                right: 5,
                top: 2,
                color: (theme) => theme.palette.grey[500],
              }}
              onClick={() => handleCloseAddLeadModal()}
            >
              <IoMdClose size={18} />
            </IconButton> */}

            <AddLeadComponent
              handleCloseAddLeadModal={handleCloseAddLeadModal}
              noSourceDropdown={noSourceDropdown}
              FetchLeads={FetchLeads}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddLeadModal;
