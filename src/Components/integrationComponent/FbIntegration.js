import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { FaFacebook } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

const FbIntegration = () => {
  const { currentMode, fbToken, setFBToken, darkModeColors } =
    useStateContext();
  const [loading, setLoading] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [adAccounts, setAdAccounts] = useState([]);

  const initiateFBLogin = () => {
    window.FB.login(
      (response) => {
        setLoading(true);
        if (response.status === "connected") {
          console.log("Facebook login successful!", response);
          // User successfully logged in to the app.
          // Now use the access token (response.authResponse.accessToken)
          // to make requests to the Facebook Graph API.

          setBtnVisible(false);
          const token = localStorage.setItem(
            "fb_token",
            response.authResponse.accessToken
          );
          setFBToken(token);
          console.log("fb token: ", token);

          // Fetch user name
          window.FB.api("/me", (resp) => {
            setUserName(resp.name);
          });

          // Fetch user ad accounts
          window.FB.api("/me/adaccounts?fields=id,name", "GET", (resp) => {
            setAdAccounts(resp.data);
          });

          setLoading(false);

          toast.success("Your facebook account connected.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          setLoading(false);
          // User could not log in.
          toast.error("Account not connected kindly try again.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log("Facebook login failed:", response);
        }
      },
      { scope: "public_profile,email,ads_management,ads_read,leads_retrieval" }
    );
  };

  useEffect(() => {
    const checkTokenExpiry = () => {
      if (!fbToken) return;
      window.FB.getLoginStatus((response) => {
        if (response.status !== "connected") {
          // Token has expired, refresh it
          initiateFBLogin();
        }
      });
    };
    checkTokenExpiry();
  }, []);
  return (
    <>
      <ToastContainer />{" "}
      <Box className="mt-1 p-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-3 gap-y-3 pb-4 text-center">
          <div
            className={`${
              currentMode === "dark"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-black"
            } p-5 rounded-md h-fit`}
          >
            <h1
              className="bg-main-red-color text-white font-semibold rounded-md p-2 mb-3"
              style={{ textTransform: "capitalize" }}
            >
              Facebook Integration
            </h1>
            <h6 className="mb-3 p-2">
              <label htmlFor="pick-image">
                <div className="relative flex items-center justify-center mx-auto w-28 h-28 bg-blue-600 rounded-full">
                  <FaFacebook className="text-white text-6xl" />
                </div>
              </label>
            </h6>
            <hr className="mb-3"></hr>
            {loading ? (
              <CircularProgress
                size={23}
                sx={{ color: "white" }}
                className="text-white"
              />
            ) : (
              <>
                {btnVisible && (
                  <>
                    <div
                      className={`bg-main-red-color text-white px-4 text-center sm:px-6 mb-3`}
                    >
                      <Button
                        className={`min-w-fit mb-5 w-full  text-white rounded-md py-3 font-semibold disabled:opacity-50  disabled:cursor-not-allowed hover:shadow-none text-white  bg-main-red-color`}
                        ripple={true}
                        size="lg"
                        type="submit"
                        disabled={loading ? true : false}
                        onClick={initiateFBLogin}
                      >
                        <span className="text-white"> Connect Facebook</span>
                      </Button>
                    </div>
                    <hr className="mb-3"></hr>
                  </>
                )}

                {!btnVisible && (
                  <>
                    <div
                      className={`bg-main-red-color text-white px-4 text-center sm:px-6 mb-3 py-2`}
                    >
                      <h1 className="text-white font-bold">{userName}</h1>
                    </div>
                    <hr className="mb-3" style={{ color: "red" }}></hr>

                    <Box sx={darkModeColors}>
                      <FormControl
                        className="w-full mt-1 mb-5"
                        variant="outlined"
                      >
                        <InputLabel
                          id="ad-account"
                          sx={{
                            color:
                              currentMode === "dark"
                                ? "#ffffff !important"
                                : "#000000 !important",
                          }}
                        >
                          Select Account
                        </InputLabel>
                        <Select
                          id="adAccounts"
                          // value={newsletterData?.status}
                          labelId="ad-account"
                          // onChange={(e) =>
                          //   setNewsletterData({
                          //     ...newsletterData,
                          //     status: e.target.value,
                          //   })
                          // }
                          label="Select Account"
                          size="medium"
                          className="w-full mb-5"
                          displayEmpty
                          required
                        >
                          {adAccounts?.length > 0 ? (
                            adAccounts?.map((adAccount) => (
                              <MenuItem value={adAccount?.id}>
                                {adAccount?.name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>Not Ad Accounts</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Box>
    </>
  );
};

export default FbIntegration;
