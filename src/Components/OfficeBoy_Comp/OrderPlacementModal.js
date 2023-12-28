import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { IoMdClose } from "react-icons/io";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const OrderPlacementModal = ({ openOrderModal, setOpenOrderModal }) => {
  const { currentMode, t, darkModeColors } = useStateContext();
  const [orderBtnLoading, setOrderBtnLoading] = useState(false);
  return (
    <Modal
      keepMounted
      open={openOrderModal}
      onClose={() => setOpenOrderModal(false)}
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
        className={`w-[calc(100%-20px)] md:w-[40%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
      >
        <div className="flex items">
          <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => setOpenOrderModal(false)}
          >
            <IoMdClose size={18} />
          </IconButton>
          <div
            className="w-full flex items-center py-1 mb-2"
            style={{
              position: "absolute",
              right: -3,
              top: 2,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <div className="bg-primary h-10 w-1 rounded-full"></div>
            <h1
              className={`text-lg font-semibold mx-2 uppercase ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              {t("btn_send_bulk_sms")}
            </h1>
          </div>
        </div>

        <div className="px-5">
          <Box sx={darkModeColors}>
            <div>
              <TextField
                type={"number"}
                id="Manager"
                // sx={{
                //   "&": {
                //     marginBottom: "1.25rem !important",
                //   },
                // }}
                placeholder="Recipients"
                multiline
                minRows={2}
                label={t("label_recipients")}
                //   value={contactsList?.join(",")}
                //   onChange={handleContacts}
                size="small"
                className="w-full p-2"
                displayEmpty
              />
              <TextField
                type={"text"}
                id="Manager"
                // sx={{
                //   "&": {
                //     marginBottom: "1.25rem !important",
                //   },
                // }}
                placeholder="Recipients"
                multiline
                minRows={2}
                label={t("label_recipients")}
                //   value={contactsList?.join(",")}
                //   onChange={handleContacts}
                size="small"
                className="w-full p-2"
                displayEmpty
              />
            </div>
          </Box>
        </div>

        <div className="action buttons mt-5 flex items-center justify-center space-x-2">
          <Button
            className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none`}
            ripple="true"
            size="lg"
            style={{
              color: "white",
            }}
          >
            {orderBtnLoading ? (
              <CircularProgress size={18} sx={{ color: "blue" }} />
            ) : (
              <span>{t("order")}</span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OrderPlacementModal;
