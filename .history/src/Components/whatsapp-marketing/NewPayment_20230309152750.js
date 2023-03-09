
import React, { useEffect, useState } from "react";
import {
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { BiSupport, BiMailSend } from "react-icons/bi"; 
import { BsWhatsapp } from "react-icons/bs";
import { MdVideoCameraFront, MdOutlineWhatsapp } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";

const NewPayment = () => {
  const { currentMode } = useStateContext();

  return (
    <div className={`${currentMode === "dark" ? "text-white" : "text-black"} w-full h-full rounded-md p-5`}>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-5">
        <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-md space-3 p-7`}>
          <h3 className="mb-3 font-semibold text-main-red-color text-center">Payment Method</h3>
          <hr className="mb-5"></hr>

          <FormControl>
            <RadioGroup
              defaultValue="Invoice"
              name="radio-buttons-group"
              className="mb-5"
            >
              <FormControlLabel className="mb-3" value="Invoice" control={<Radio />} label="Invoice (Free)" />
              <FormControlLabel className="mb-3" value="CreditDebitCard" control={<Radio />} label="Credit / Debit Card (Free)" />
              <FormControlLabel className="mb-3" value="Paypal" control={<Radio />} label="Paypal (Free)" />
            </RadioGroup>
          </FormControl>

          <Button 
            type="submit"
            size="medium"
            className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
            style={{ backgroundColor: "#da1f26", color: "#ffffff"}}
          >
            SUBMIT
          </Button>
        </div>
        <div className="space-3 p-1 sm:pb-1 sm:pt-5 md:pb-1 md:pt-5 lg:pb-3 lg:pt-5 xl:p-5">
          
          {/* TICKET DESCRIPTION  */}
          <label className="font-semibold mb-3"><span className="text-main-red-color">Voucher / Gift Card</span> (optional)</label>
          <TextField
            id="voucher"
            type={"text"}
            className="w-full mb-5 mt-5"
            style={{ marginBottom: "20px"}}
            variant="standard"
            size="medium"
            value=""
          />
          
          {/* <h6 className="mb-3 text-center">Need help with our system? Contact our support team or create ticket for prompt assistance.</h6> */}
          <div className={`${currentMode === "dark" ? "bg-black" : "bg-white"} rounded-lg p-3`}>
            <div className="grid grid-cols-2 gap-5 p-5">
              <div className="text-left font-semibold">Delivery</div>
              <div className="text-right font-semibold">Free</div>
            </div>
            <hr className="my-5"></hr>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPayment;
