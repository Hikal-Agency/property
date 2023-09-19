import React, { useState } from "react";
import {
  Box,
  TextField, Button,
  CircularProgress,
  Select,
  MenuItem
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";

const AddNewsletter = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, BACKEND_URL } =
    useStateContext();
  const [loading, setloading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [newsletterData, setNewsletterData] = useState({
    email: "",
    status: "",
  });

  const handleEmail = (e) => {
    setEmailError(false);
    const value = e.target.value;
    setNewsletterData({ ...newsletterData, email: value });

    console.log(value);
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (emailRegex.test(value)) {
      setEmailError(false);
      setNewsletterData({ ...newsletterData, email: value });
    } else {
      setEmailError("Kindly enter a valid email.");
      return;
    }
    // setNewsletterData({ ...newsletterData, email: value });
    // setEmail(value);
    console.log("Email state: ", newsletterData?.email);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setloading(true);
    if (!newsletterData?.email || !newsletterData?.status) {
      toast.error("Kindly enter all fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setloading(false);

      return;
    }

    if (!emailError === false) {
      toast.error("Kindly enter a valid email.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setloading(false);

      return;
    }

    const token = localStorage.getItem("auth-token");
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("User", user);
    const NewsLetter = new FormData();

    NewsLetter.append("email", newsletterData?.email);
    NewsLetter.append("status", newsletterData?.status);

    console.log("NewsLetter append: ", NewsLetter);

    try {
      const submitOffer = await axios.post(
        `${BACKEND_URL}/newsletters`,
        NewsLetter,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("OFFer submitted: ", submitOffer);

      toast.success("NewsLetter Added Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setNewsletterData({
        email: "",
        status: "",
      });

      setloading(false);
    } catch (error) {
      console.log("Error: ", error);
      setloading(false);
      toast.error("Something went wrong! Please Try Again", {
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
    <div>
      
      <div
        className={`${
          currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
        } rounded-md p-5`}
      >
        <h3 className="text-primary font-semibold mb-3 text-center">
          Add New Subscriber
        </h3>
        <hr className="mb-5"></hr>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-5 py-5">
          <Box sx={darkModeColors}>
            <TextField
              id="email"
              type={"email"}
              label="Email "
              className="w-full mb-3"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              name="email"
              size="medium"
              value={newsletterData?.email}
              // value={email}
              // onChange={(e) =>
              //   setNewsletterData({ ...newsletterData, email: e.target.value })
              // }
              error={emailError && emailError}
              helperText={emailError && emailError}
              onChange={handleEmail}
            />

            <Select
              id="LeadSource"
              value={newsletterData?.status}
              label="Source"
              onChange={(e) =>
                setNewsletterData({ ...newsletterData, status: e.target.value })
              }
              size="medium"
              className="w-full mb-5"
              displayEmpty
              required
            >
              <MenuItem value="" disabled>
                Status
              </MenuItem>
              <MenuItem value={"Subscribed"}>Subscribe</MenuItem>
              <MenuItem value={"Unsubscribed"}>Un-Subscribed</MenuItem>
            </Select>
          </Box>
        </div>

        <Button
          type="submit"
          size="medium"
          className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold mb-3"
          style={{color: "#ffffff" }}
          onClick={handleClick}
          disabled={loading ? true : false}
        >
          {loading ? (
            <CircularProgress
              size={23}
              sx={{ color: "white" }}
              className="text-white"
            />
          ) : (
            <span> Add </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AddNewsletter;
