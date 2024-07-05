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
import { MdClose } from "react-icons/md";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import HeadingTitle from "../_elements/HeadingTitle";
import { BsPlus, BsDash } from "react-icons/bs";
import { areDayPropsEqual } from "@mui/x-date-pickers/internals";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const OrderPlacementModal = ({ openOrderModal, setOpenOrderModal }) => {
  const {
    currentMode,
    t,
    darkModeColors,
    BACKEND_URL,
    themeBgImg,
    isLangRTL,
    i18n,
  } = useStateContext();
  const [orderBtnLoading, setOrderBtnLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const token = localStorage.getItem("auth-token");
  const data = openOrderModal?.data;

  console.log("order placment :::: ", data);

  const [orderDetails, setOrderDetails] = useState({
    itemId: null,
    quantity: null,
    sugar: null,
    currency: "AED",
    amount: null,
    notes: null,
    orderStatus: null,
  });

  console.log("orderdetails:::: ", orderDetails);

  // const handleQuantity = (e) => {
  //   console.log("quantity: ", e.target.value);
  //   setShowError(false);
  //   const quantity = e.target.value;
  //   if (quantity < 1 || quantity > 10) {
  //     setShowError(true);
  //   }
  //   const totalAmount = quantity * orderDetails?.amount;
  //   setOrderDetails({
  //     ...orderDetails,
  //     [e.target.name]: quantity,
  //     amount: quantity != 0 ? totalAmount : data?.itemPrice,
  //   });
  // };
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      setOrderDetails({
        ...orderDetails,
        quantity: value,
        amount: value * data?.itemPrice,
      });
      setShowError(false);
    } else if (e.target.value === "") {
      setOrderDetails({
        ...orderDetails,
        quantity: "",
        amount: data?.itemPrice,
      });
    }
  };
  const handleIncrement = () => {
    setOrderDetails((prev) => {
      const newQuantity = Math.min((prev.quantity || 0) + 1, 10);
      return {
        ...prev,
        quantity: newQuantity,
        amount: newQuantity * data?.itemPrice,
      };
    });
  };

  const handleDecrement = () => {
    setOrderDetails((prev) => {
      const newQuantity = Math.max((prev.quantity || 0) - 1, 1);
      return {
        ...prev,
        quantity: newQuantity,
        amount: newQuantity * data?.itemPrice,
      };
    });
  };

  // SUGAR QUANTITY
  const handleSugarChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 10 && value % 0.5 === 0) {
      setOrderDetails({
        ...orderDetails,
        sugar: value,
      });
      setShowError(false);
    } else if (e.target.value === "") {
      setOrderDetails({
        ...orderDetails,
        sugar: "",
      });
    }
  };
  const handleSugarIncrement = () => {
    setOrderDetails((prev) => {
      const newSugar = Math.min((prev.sugar || 0) + 0.5, 10);
      return {
        ...prev,
        sugar: newSugar,
      };
    });
  };

  const handleSugarDecrement = () => {
    setOrderDetails((prev) => {
      const newSugar = Math.max((prev.sugar || 0) - 0.5, 0);
      return {
        ...prev,
        sugar: newSugar,
      };
    });
  };

  const handleBlur = () => {
    if (orderDetails.quantity === "") {
      setOrderDetails((prev) => ({
        ...prev,
        quantity: 1,
        amount: data?.itemPrice,
      }));
    }
    if (orderDetails.sugar === "") {
      setOrderDetails((prev) => ({
        ...prev,
        sugar: 0,
      }));
    }
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

      setOrderDetails({
        itemId: "",
        quantity: "",
        suagr: "",
        currency: "AED",
        amount: "",
        notes: "",
        orderStatus: "",
      });

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
        sugar: null,
        currency: String(data?.currency) || "AED",
        amount: data?.itemPrice || 0,
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
          data: null,
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
        className={`w-[calc(100%-7%)] md:w-[450px] ${
          themeBgImg
            ? currentMode === "dark"
              ? "bg-dark"
              : "bg-light"
            : currentMode === "dark"
            ? "bg-dark-neu"
            : "bg-light-neu"
        } absolute top-1/2 left-1/2 p-5`}
      >
        <div className="absolute top-2 right-2 bg-red-600 p-2 cursor-pointer text-white rounded-full">
          <button
            style={{
              zIndex: 9999,
            }}
            onClick={() => {
              console.log("clicked:: ", openOrderModal);
              setOpenOrderModal({
                open: false,
                data: null,
              });
            }}
          >
            <MdClose size={16} />
          </button>
        </div>
        <div>
          <HeadingTitle title={data?.itemName} />
          <Box sx={darkModeColors}>
            <div className="grid grid-cols-2 gap-5 mb-5">
              {/* Quantity */}
              <TextField
                type="number"
                name="quantity"
                placeholder={t("label_order_qty")}
                label={t("label_order_qty")}
                value={orderDetails?.quantity || 1}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                size="small"
                className="w-full p-2"
                inputProps={{ min: 1, max: 10 }}
                helperText={
                  showError && "Quantity should be in limit of 1 - 10"
                }
                FormHelperTextProps={{
                  sx: { color: currentMode === "dark" ? "#fff" : "#000" },
                }}
                InputProps={{
                  startAdornment: (
                    <IconButton
                      onClick={handleDecrement}
                      disabled={orderDetails?.quantity <= 1}
                    >
                      <BsDash color={"#AAAAAA"} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={handleIncrement}
                      disabled={orderDetails?.quantity >= 10}
                    >
                      <BsPlus color={"#AAAAAA"} />
                    </IconButton>
                  ),
                  inputProps: {
                    style: { textAlign: "center" },
                  },
                }}
              />
              {/* SUGAR */}
              <TextField
                type="number"
                name="sugar"
                placeholder={t("sugar")}
                label={t("spoon_of_sugar")}
                value={orderDetails?.sugar || 0}
                onChange={handleSugarChange}
                onBlur={handleBlur}
                size="small"
                className="w-full p-2"
                inputProps={{ min: 0, max: 10, step: 0.5 }}
                helperText={showError && "Sugar should be in limit of 0 - 10"}
                FormHelperTextProps={{
                  sx: { color: currentMode === "dark" ? "#fff" : "#000" },
                }}
                InputProps={{
                  startAdornment: (
                    <IconButton
                      onClick={handleSugarDecrement}
                      disabled={orderDetails?.sugar <= 0}
                    >
                      <BsDash color={"#AAAAAA"} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      onClick={handleSugarIncrement}
                      disabled={orderDetails?.sugar >= 10}
                    >
                      <BsPlus color={"#AAAAAA"} />
                    </IconButton>
                  ),
                  inputProps: {
                    style: { textAlign: "center" },
                  },
                }}
              />
            </div>
            {/* NOTE */}
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
          {orderDetails?.amount !== 0 && (
            <div
              className={`${
                currentMode === "dark"
                  ? "bg-dark-neu text-white"
                  : "bg-light-neu text-black"
              } my-5 p-3 text-center`}
            >
              {orderDetails?.currency || ""} {orderDetails?.amount}
            </div>
          )}
        </div>

        <button
          className={`${
            currentMode === "dark"
              ? "bg-primary-dark-neu"
              : "bg-primary-light-neu"
          } my-5 text-white p-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full`}
          // ripple="true"
          // size="lg"
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
        </button>
      </div>
    </Modal>
  );
};

export default OrderPlacementModal;
