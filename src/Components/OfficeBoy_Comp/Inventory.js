import { Backdrop, Modal } from "@mui/material";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { useStateContext } from "../../context/ContextProvider";
import Error404 from "../../Pages/Error";

const style = {
  transform: "translate(0%, 0%)",
  boxShadow: 24,
};

const Inventory = ({ openInventory, setOpenInventory }) => {
  const [leadNotFound, setLeadNotFound] = useState(false);

  const { t, currentMode, isLangRTL, i18n } = useStateContext();
  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenInventory(false);
    }, 1000);
  };
  return (
    <>
      <Modal
        keepMounted
        open={openInventory}
        onClose={() => setOpenInventory(false)}
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
            // onClick={handleCloseTimelineModel}
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
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } 
                 p-4 h-[100vh] w-[80vw] overflow-y-scroll border-primary
                `}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div>
                <div className="w-full grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="w-full flex items-center pb-3 ">
                    <div
                      className={`${isLangRTL(i18n.language) ? "ml-2" : "mr-2"}
                        bg-primary w-fit rounded-md my-1 py-1 px-2 text-white flex items-center justify-center`}
                    >
                      {t("product_inventory")}
                    </div>
                  </div>

                  <div className="w-full flex justify-end items-center">
                    Button
                  </div>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-5">
                  Tables
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Inventory;
