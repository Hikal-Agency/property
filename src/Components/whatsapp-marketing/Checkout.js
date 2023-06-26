import React, { useState } from "react";
import { IconButton, Box, TextField, Button, CircularProgress } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import axios from "../../axoisConfig";
import {toast, ToastContainer} from "react-toastify";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";

const productIds = {
  "Basic": "prod_NhMOVUa2pkVdli",
  "Pro": "prod_NhMP8zMuo2V7FB"
};

const Checkout = ({ allPlans, plan }) => {

  const navigate = useNavigate();
  const selectedPlan = allPlans.find((p) => p.name === plan);
  const [formValues, setFormValues] = useState({
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvc: "",
  });
  const [btnloading, setbtnloading] = useState(false);
  const {BACKEND_URL, User, darkModeColors, currentMode} = useStateContext();

  const subscribe = async (data) => {
    try {
      const token = localStorage.getItem("auth-token");
      setbtnloading(true);
      const response = await axios.post(`${BACKEND_URL}/createToken`, JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const stripeToken = response.data;
       await axios.post(`${BACKEND_URL}/subscribe`, JSON.stringify({
        package_name: productIds[selectedPlan.name],
        package_id: productIds[selectedPlan.name],
        stripe_token: stripeToken,
        email: User?.userEmail,
       }), {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setbtnloading(false);
        toast.success("Subscription Added!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          localStorage.removeItem("user");
          window.location.href = "/dashboard";
        }, 2000);
    } catch (error) {
      console.log(error);
        toast.error("Subscription Failed!!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setbtnloading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    subscribe(formValues);
  };
  return (
    <>
      <IconButton onClick={() => navigate("")}>
        <BiArrowBack color={currentMode === "dark" ? "white" : "black"}/>
      </IconButton>

      <ToastContainer/>

      <Box className="flex justify-center items-start mt-4">
        <Box className="flex flex-col items-center h-[100%] mr-12">
          <Box className="p-5 bg-white rounded-md h-[100%] text-black">
            <h1>Subscribe to {selectedPlan.name}</h1>
            <Box className="flex items-center mt-2">
              <h1 className="font-black" style={{ fontSize: 40 }}>
                US${selectedPlan.price}
              </h1>
              <Box className="text-slate-400 font-light ml-2">
                <p>per</p>
                <p style={{ lineHeight: 1, fontSize: 13 }}>year</p>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="w-[50%]" sx={darkModeColors}>
          <form onSubmit={handleSubmit}>
            <TextField
              id="cardNumber"
              type={"number"}
              label="Card Number"
              className="w-full mb-5"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
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
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
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
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
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
              style={{ marginBottom: "20px" }}
              variant="outlined"
              size="medium"
              required
              value={formValues.cvc}
              onChange={(e) =>
                setFormValues({ ...formValues, cvc: e.target.value })
              }
            />
            <Button fullWidth sx={{ py: 2 }} type="submit" variant="contained">
              {btnloading ? <CircularProgress size={18} sx={{ color: "white" }} /> : <span>Submit</span>}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Checkout;
