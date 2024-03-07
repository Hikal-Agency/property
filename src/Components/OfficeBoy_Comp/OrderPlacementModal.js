import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [showError, setShowError] = useState(false);
  const token = localStorage.getItem("auth-token");
  const data = openOrderModal?.data;

  console.log("order placment :::: ", data);

  const [orderDetails, setOrderDetails] = useState({
    itemId: null,
    quantity: null,
    amount: null,
    notes: null,
    orderStatus: null,
  });

  console.log("orderdetails:::: ", orderDetails);

  const handleQuantity = (e) => {
    console.log("quantity: ", e.target.value);
    setShowError(false);
    const quantity = e.target.value;
    if (quantity < 1 || quantity > 10) {
      setShowError(true);
    }
    const totalAmount = quantity * orderDetails?.amount;
    setOrderDetails({
      ...orderDetails,
      [e.target.name]: quantity,
      amount: quantity != 0 ? totalAmount : data?.itemPrice,
    });
  };

  const placeOrder = async () => {
    setOrderBtnLoading(true);

    if (
      !orderDetails?.quantity ||
      orderDetails?.quantity < 1 ||
      orderDetails?.quantity > 10
    ) {
      toast.error(`Order quantity should be in between 1-10.`, {
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
      setOpenOrderModal({
        open: false,
        data: null,
      });

      console.log("order place:::: ", placeOrder);

      toast.success(`Order for ${data?.itemName} is placed.`, {
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

  useEffect(() => {
    if (data) {
      setOrderDetails({
        itemId: String(data?.id),
        quantity: 1,
        amount: data?.itemPrice,
        notes: null,
        orderStatus: "pending",
      });
    }
  }, [data]);
  return (
    <Modal
      keepMounted
      open={openOrderModal?.open}
      onClose={() =>
        setOpenOrderModal({
          open: false,
        })
      }
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
        <div className="flex items-center justify-center">
          {/* <IconButton
            sx={{
              position: "absolute",
              right: 5,
              top: 2,
              cursor: "pointer",
              color: (theme) => theme.palette.grey[500],
            }}
            onClick={() => {
              console.log("clicked:: ");
              setOpenOrderModal({
                open: false,
              });
            }}
          >
            <IoMdClose size={18} />
          </IconButton> */}
          <button
            style={{
              position: "absolute",
              right: 5,
              top: 2,
              cursor: "pointer",
              zIndex: 9999,
            }}
            onClick={() => {
              console.log("clicked:: ");
              setOpenOrderModal({
                open: false,
              });
            }}
          >
            <IoMdClose
              size={18}
              color={currentMode === "dark" ? "#ffffff" : "#000000"}
            />
          </button>
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
              {data?.itemName}
            </h1>
          </div>
        </div>

        <div className="px-5">
          <Box sx={darkModeColors}>
            <div className="flex justify-between space-x-4">
              <TextField
                type={"number"}
                id="demo-helper-text-misaligned-no-helper"
                name="quantity"
                placeholder={t("label_order_qty")}
                label={t("label_order_qty")}
                value={orderDetails?.quantity}
                onChange={(e) => handleQuantity(e)}
                size="small"
                className="w-full p-2"
                displayEmpty
                helperText={
                  showError && "Quantity should be in limit of 1 - 10"
                }
              />

              <TextField
                type={"number"}
                name="amount"
                placeholder={t("label_order_amount")}
                label={t("label_order_amount")}
                value={orderDetails?.amount}
                onChange={(e) => e.preventDefault()}
                size="small"
                className="w-full p-2"
                readOnly={true}
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
