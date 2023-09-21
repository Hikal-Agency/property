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
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsFetched, setLeadsFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [adAccounts, setAdAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [forms, setForms] = useState([]);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [formResponses, setFormResponses] = useState([]);

  console.log("selected adaccount: ", selectedAccount);
  console.log("form data: ", forms);
  console.log("selected page: ", selectedPage);
  console.log("pages data: ", pages);
  console.log("pages data: ", pages);
  console.log("formreponse: ", formResponses);
  useEffect(() => {
    if (selectedPage) {
      setLeadsLoading(true);
      setLeadsFetched(false);
      window.FB.api(
        `/${selectedPage.id}/leadgen_forms`,
        { access_token: selectedPage.access_token },
        "GET",
        async (resp) => {
          setForms(resp.data);

          // Fetch data for each form
          const responses = await Promise.all(
            resp?.data?.map((form) => {
              return new Promise((resolve, reject) => {
                window.FB.api(
                  `/${form.id}/leads`,
                  { access_token: selectedPage.access_token },
                  "GET",
                  (response) => {
                    if (!response || response.error) {
                      console.error(
                        `Error fetching data for form ${form.id}:`,
                        response.error
                      );

                      reject(response.error);
                    } else {
                      resolve(response);
                    }
                  }
                );
              }).catch((error) => {
                console.error(
                  `Error fetching data for form ${form.id}:`,
                  error
                );

                toast.error("Error in fetching Form Data", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              });
            })
          );

          // Store the responses in state
          setFormResponses(responses);

          setLeadsLoading(false);
          setLeadsFetched(true);
          toast.success(
            "Leads fetched successfully. Please visit the Unassigned page.",
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
        }
      );
    }
  }, [selectedPage]);

  const handleAccountSelect = (event) => {
    setSelectedAccount(event.target.value);
  };

  const handlePageSelect = (event) => {
    const page = pages.find((page) => page.id === event.target.value);
    setSelectedPage(page);
  };

  // logout
  const handleLogout = () => {
    // Reset state variables
    setBtnVisible(true);
    setUserName("");
    setAdAccounts([]);
    setSelectedAccount("");
    setForms([]);
    setPages([]);
    setSelectedPage("");
    setFormResponses([]);

    // Remove token from localStorage
    localStorage.removeItem("fb_token");

    // FB logout process
    window.FB.logout(function (response) {
      console.log("User logged out.", response);
    });

    toast.success("You have logged out successfully.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

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
          // window.FB.api("/me/adaccounts?fields=id,name", "GET", (resp) => {
          //   setAdAccounts(resp.data);
          // });

          // Fetch user pages
          window.FB.api("/me/accounts", "GET", (resp) => {
            setPages(resp.data);
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
          setBtnVisible(true);
        } else {
          setBtnVisible(false);
        }
      });
    };
    checkTokenExpiry();
  }, []);

  // useEffect(() => {
  //   const token = localStorage.getItem("fb_token");
  //   if (token) {
  //     setFBToken(token);
  //     initiateFBLogin();
  //     setBtnVisible(false);
  //   }
  // }, []);
  return (
    <>
      {" "}
      <Box className="mt-1 p-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-1 gap-x-3 gap-y-3 pb-4 text-center">
          <div
            className={`${
              currentMode === "dark"
                ? "bg-[#1c1c1c] text-white"
                : "bg-gray-200 text-black"
            } p-5 rounded-md h-fit`}
          >
            <h1
              className="bg-primary text-white font-semibold rounded-md p-2 mb-3"
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
                      className={`bg-primary text-white px-4 text-center sm:px-6 mb-3`}
                    >
                      <Button
                        className={`min-w-fit mb-5 w-full  text-white rounded-md py-3 font-semibold disabled:opacity-50  disabled:cursor-not-allowed hover:shadow-none bg-btn-primary`}
                        ripple={true}
                        size="lg"
                        type="submit"
                        disabled={loading ? true : false}
                        onClick={initiateFBLogin}
                        style={{
                          color: "white"
                        }}
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
                      className={`bg-primary text-white px-4 text-center sm:px-6 mb-3 py-2`}
                    >
                      <h1 className="text-white font-bold">{userName}</h1>
                    </div>
                    <hr className="mb-3 text-primary"></hr>

                    <Box sx={darkModeColors}>
                      {/* <FormControl
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
                          value={selectedAccount}
                          labelId="ad-account"
                          onChange={handleAccountSelect}
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
                      </FormControl> */}

                      {/* pages */}
                      <FormControl
                        className="w-full mt-1 mb-5"
                        variant="outlined"
                      >
                        <InputLabel
                          id="page-label"
                          sx={{
                            color:
                              currentMode === "dark"
                                ? "#ffffff !important"
                                : "#000000 !important",
                          }}
                        >
                          Select Page
                        </InputLabel>
                        <Select
                          id="pages"
                          labelId="page-label"
                          label="Select Page"
                          size="medium"
                          className="w-full mb-5"
                          displayEmpty
                          required
                          value={selectedPage?.id}
                          onChange={handlePageSelect}
                        >
                          {pages?.length > 0 ? (
                            pages?.map((page) => (
                              <MenuItem value={page?.id}>{page?.name}</MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>No Pages Found</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Box>

                    {leadsLoading && (
                      <>
                        {" "}
                        <p
                          className={`${
                            currentMode === "dark" ? "#ffffff" : "#000000"
                          }`}
                        >
                          We are fetching your leads...
                        </p>
                        <CircularProgress />
                      </>
                    )}
                    {leadsFetched && formResponses.length === 0 && (
                      <h3
                        className={`${
                          currentMode === "dark" ? "#ffffff" : "#000000"
                        }`}
                      >
                        No leads found.
                      </h3>
                    )}

                    <hr />
                    <>
                      <div
                        className={`mt-2 bg-primary text-white px-4 text-center sm:px-6 mb-3`}
                      >
                        <Button
                          className={`min-w-fit mb-5 w-full  rounded-md py-3 font-semibold disabled:opacity-50  disabled:cursor-not-allowed hover:shadow-none text-white  bg-btn-primary`}
                          ripple={true}
                          size="lg"
                          type="submit"
                          disabled={loading ? true : false}
                          style={{
                            color: "white"
                          }}
                          onClick={handleLogout}
                        >
                          <span className="text-white">Logout</span>
                        </Button>
                      </div>
                      <hr className="mb-3"></hr>
                    </>
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
