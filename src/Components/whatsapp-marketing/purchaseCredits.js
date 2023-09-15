import { useState } from "react";
import {
  CircularProgress,
  Modal,
  Backdrop,
  Button,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { HiCreditCard } from "react-icons/hi";
import { GridCloseIcon } from "@mui/x-data-grid";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const style = {
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
};

const PurchaseCreditsModal = ({ purchaseCreditsModal, handleClose }) => {
  const { currentMode, BACKEND_URL, darkModeColors, setUserCredits } =
    useStateContext();
  const [creditsToPurchase, setCreditsToPurchase] = useState("");
  const [formValues, setFormValues] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
    credits: "",
  });
  const [btnloading, setbtnloading] = useState(false);

  const subscribe = async (data) => {
    try {
      const token = localStorage.getItem("auth-token");
      setbtnloading(true);
      const response = await axios.post(
        `${BACKEND_URL}/createToken`,
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const stripeToken = response.data;
      const resp = await axios.post(
        `${BACKEND_URL}/purchase-credits`,
        JSON.stringify({
          credits: formValues?.credits,
          stripe_token: stripeToken,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setbtnloading(false);
      toast.success("Credits purchased!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setUserCredits(resp.data?.credits);
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Purchase credits failed!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setbtnloading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribe(formValues);
  };

  return (
    <Modal
      keepMounted
      open={purchaseCreditsModal}
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
        style={style}
        className={`w-[calc(100%-20px)] md:w-[40%]  ${
          currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
        } absolute top-1/2 left-1/2 p-5 rounded-md`}
      >
        <IconButton
          sx={{
            position: "absolute",
            right: 15,
            top: 10,
            color: "#000000",
          }}
          onClick={handleClose}
        >
          <GridCloseIcon size={18} />
        </IconButton>

        <div className="flex flex-col justify-center items-center mb-10">
          <HiCreditCard size={50} className="text-main-red-color text-2xl" />
          <h1 className="font-semibold pt-2 text-lg">Purchase Credits</h1>
        </div>

        <Box sx={darkModeColors}>
          <form onSubmit={handleSubmit}>
            <TextField
              id="credits"
              type={"number"}
              label="No. of Credits"
              className="w-full mb-5"
              style={{ marginBottom: "14px" }}
              variant="outlined"
              size="medium"
              sx={{ "& input": { color: "#da1f26" } }}
              required
              value={formValues.credits}
              onChange={(e) =>
                setFormValues({ ...formValues, credits: e.target.value })
              }
            />
            <TextField
              id="cardNumber"
              type={"number"}
              label="Card Number"
              className="w-full mb-5"
              style={{ marginBottom: "14px" }}
              variant="outlined"
              size="small"
              required
              value={formValues.cardNumber}
              onChange={(e) =>
                setFormValues({ ...formValues, cardNumber: e.target.value })
              }
            />
            <TextField
              id="exp-month"
              type={"number"}
              label="Expiry Month"
              className="w-full mb-5"
              style={{ marginBottom: "14px" }}
              variant="outlined"
              size="small"
              required
              value={formValues.expMonth}
              onChange={(e) =>
                setFormValues({ ...formValues, expMonth: e.target.value })
              }
            />
            <TextField
              id="exp-year"
              type={"number"}
              label="Expiry Year"
              className="w-full mb-5"
              style={{ marginBottom: "14px" }}
              variant="outlined"
              size="small"
              required
              value={formValues.expYear}
              onChange={(e) =>
                setFormValues({ ...formValues, expYear: e.target.value })
              }
            />
            <TextField
              id="cvc"
              type={"number"}
              label="CVC"
              className="w-full mb-5"
              style={{ marginBottom: "14px" }}
              variant="outlined"
              size="small"
              required
              value={formValues.cvc}
              onChange={(e) =>
                setFormValues({ ...formValues, cvc: e.target.value })
              }
            />
            <Button
              fullWidth
              style={{ background: "#da1f26" }}
              type="submit"
              variant="contained"
            >
              {btnloading ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Box>
      </div>
    </Modal>
  );
};

export default PurchaseCreditsModal;
