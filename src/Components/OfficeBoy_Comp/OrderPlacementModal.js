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
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const OrderPlacementModal = ({ openOrderModal, setOpenOrderModal }) => {
  const { currentMode, t, darkModeColors, BACKEND_URL } = useStateContext();
  const [orderBtnLoading, setOrderBtnLoading] = useState(false);
  const token = localStorage.getItem("auth-token");

  const [orderDetails, setOrderDetails] = useState({
    itemId: String(openOrderModal?.id),
    quantity: null,
    amount: openOrderModal?.itemPrice || null,
    notes: null,
    orderStatus: "pending",
  });

  console.log("orderdetails:::: ", orderDetails);

  const placeOrder = async () => {
    setOrderBtnLoading(true);

    if (!orderDetails?.quantity) {
      toast.error(`Order quantity is required.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setOrderBtnLoading(false);
      return;
    }
    try {
      const placeOrder = await axios.post(
        `${BACKEND_URL}/orders/store`,
        JSON.stringify(orderDetails),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setOrderBtnLoading(false);
      setOpenOrderModal(false);

      console.log("order place:::: ", placeOrder);

      toast.success(`Order for ${openOrderModal?.itemName} is placed.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("error::::: ", error);
      setOrderBtnLoading(false);

      toast.error(`An error occured.Kindly try again.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
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
              cursor: "pointer",
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
              {openOrderModal?.itemName}
            </h1>
          </div>
        </div>

        <div className="px-5">
          <Box sx={darkModeColors}>
            <div className="flex justify-between space-x-4">
              <TextField
                type={"number"}
                id="Manager"
                name="quantity"
                placeholder={t("label_order_qty")}
                label={t("label_order_qty")}
                value={orderDetails?.quantity}
                onChange={(e) =>
                  setOrderDetails({
                    ...orderDetails,
                    [e.target.name]: e.target.value,
                  })
                }
                size="small"
                className="w-full p-2"
                displayEmpty
              />
              <TextField
                type={"number"}
                id="Manager"
                name="amount"
                placeholder={t("label_order_amount")}
                label={t("label_order_amount")}
                value={orderDetails?.amount}
                onChange={(e) =>
                  setOrderDetails({
                    ...orderDetails,
                    [e.target.name]: e.target.value,
                  })
                }
                size="small"
                className="w-full p-2"
                displayEmpty
              />
            </div>
          </Box>
          <Box sx={darkModeColors}>
            <TextField
              type={"text"}
              id="Note"
              sx={{
                "&": {
                  marginTop: "1.25rem !important",
                },
              }}
              placeholder={t("label_order_note")}
              name="notes"
              label={t("label_order_note")}
              value={orderDetails?.notes}
              onChange={(e) =>
                setOrderDetails({
                  ...orderDetails,
                  [e.target.name]: e.target.value,
                })
              }
              size="small"
              className="w-full p-2"
              displayEmpty
            />
          </Box>
        </div>

        <div className="action buttons mt-5 flex items-center justify-center w-full">
          <Button
            className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-btn-primary shadow-none w-full`}
            ripple="true"
            size="lg"
            style={{
              color: "white",
            }}
            onClick={placeOrder}
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
