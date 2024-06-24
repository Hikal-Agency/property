import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { FaFacebook } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { SiGooglecalendar } from "react-icons/si";

const GoogleCalendarIntegration = () => {
  const { currentMode, session, setSession } = useStateContext();

  const gapi = window.gapi;
  const google = window.google;
  const CLIENT_ID = process.env.REACT_APP_GC_CLIENT_ID;
  const API_KEY = process.env.REACT_APP_GC_API;
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnVisible, setBtnVisible] = useState(true);
  const [userName, setUserName] = useState("");
  const [authInstance, setAuthInstance] = useState(null);

  const tokenClient = useRef({});

  useEffect(() => {
    // Load the Google Sign-In API
    gapi.load("auth", () => {
      gapi.auth2
        .init({
          client_id: CLIENT_ID,
          plugin_name: "my-app",
        })
        .then(() => {
          gapiLoaded();
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error initializing Google Sign-In:", error);
          toast.error("Failed to initialize Google Sign-In", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    });
    gisLoaded();
  }, []);

  useEffect(() => {
    if (gapiInited && gisInited) {
      setLoading(false);
    }
  }, [gapiInited, gisInited]);

  function gisLoaded() {
    tokenClient.current = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "", // defined later
    });

    setGisInited(true);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);

    if (session.accessToken && session.expiresIn) {
      gapi.client.setToken({
        access_token: session.accessToken,
        expires_in: session.expiresIn,
      });
      //   await listUpcomingEvents();
    }
  }

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  //Enables user interaction after all libraries are loaded.

  function handleAuthClick() {
    tokenClient.current.callback = async (resp) => {
      if (resp.error) {
        console.log("error: ", resp.error);
        toast.error("Failed to sign in with Google", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        throw resp;
      }
      const { access_token, expires_in } = gapi.client.getToken();
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("expires_in", expires_in);
      setSession({
        accessToken: access_token,
        expiresIn: expires_in,
      });
      // setUserName(resp.profile.name);
      setBtnVisible(false);
    };

    if (!(session.accessToken && session.expiresIn)) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.current.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.current.requestAccessToken({ prompt: "" });
    }
  }

  // function handleAuthClick() {
  //   const auth2 = gapi.auth2.getAuthInstance();

  //   if (!auth2.isSignedIn.get()) {
  //     auth2.signIn().then(
  //       () => {
  //         const user = auth2.currentUser.get();
  //         const profile = user.getBasicProfile();
  //         const username = profile.getName();

  //         const { access_token, expires_in } = user.getAuthResponse();

  //         // Save the username, access_token, and expires_at (in milliseconds) to localStorage
  //         localStorage.setItem("username", username);
  //         localStorage.setItem("expires_in", expires_in);
  //         localStorage.setItem("access_token", access_token);

  //         setSession({
  //           accessToken: access_token,
  //           expiresIn: expires_in,
  //           userName: username,
  //         });

  //         toast.success("Successfully Sign In.", {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //         setBtnVisible(false);
  //       },
  //       (error) => {
  //         toast.error("Sorry Unable To SignIn.", {
  //           position: "top-right",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //         console.error("Sign-in error:", error);
  //       }
  //     );
  //   } else {
  //     tokenClient.current.requestAccessToken({ prompt: "" });
  //     toast.success("Successfully Sign In.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //     setBtnVisible(false);
  //   }
  // }

  // signout
  function handleSignOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken("");
      localStorage.removeItem("access_token");
      localStorage.removeItem("expires_in");
      setSession({
        accessToken: "",
        expiresIn: "",
      });
      setBtnVisible(true);
    }
  }

  return (
    <>
      <ToastContainer />{" "}
      <Box className="mt-1 p-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-1 gap-x-3 gap-y-3 pb-4 text-center">
          <div
            className={`${
              currentMode === "dark"
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-black"
            } p-5 rounded-md h-fit`}
          >
            <h1
              className="bg-primary text-white font-semibold rounded-md p-2 mb-3"
              style={{ textTransform: "capitalize" }}
            >
              Google Calendar Integration
            </h1>
            <h6 className="mb-3 p-2">
              <label htmlFor="pick-image">
                <div className="relative flex items-center justify-center mx-auto w-28 h-28 bg-[#FBBC04] rounded-full">
                  <SiGooglecalendar className="text-white text-6xl" />
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
                        className={`min-w-fit mb-5 w-full rounded-md py-3 font-semibold disabled:opacity-50  disabled:cursor-not-allowed hover:shadow-none text-white  bg-btn-primary`}
                        ripple={true}
                        size="lg"
                        type="submit"
                        style={{
                          color: "white"
                        }}
                        disabled={loading ? true : false}
                        onClick={handleAuthClick}
                      >
                        <span className="text-white"> Connect Gmail</span>
                      </Button>
                    </div>
                    <hr className="mb-3"></hr>
                  </>
                )}

                {!btnVisible && (
                  <>
  
                    <hr />
                    <>
                      <div
                        className={`mt-2 bg-primary text-white px-4 text-center sm:px-6 mb-3`}
                      >
                        <Button
                          className={`min-w-fit mb-5 w-full rounded-md py-3 font-semibold disabled:opacity-50  disabled:cursor-not-allowed hover:shadow-none text-white  bg-btn-primary`}
                          ripple={true}
                          size="lg"
                          style={{
                            color: "white"
                          }}
                          type="submit"
                          disabled={loading ? true : false}
                          onClick={handleSignOut}
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

export default GoogleCalendarIntegration;
