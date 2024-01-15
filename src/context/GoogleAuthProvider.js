import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useStateContext } from "./ContextProvider";
import { toast } from "react-toastify";

const GoogleAuthContext = createContext();

export const useGoogleSignIn = () => useContext(GoogleAuthContext);

const GoogleAuthProvider = ({ children }) => {
  const { User } = useStateContext();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
  const apiKey = process.env.REACT_APP_GOOGLE_API;

  console.log("clientID:::: ", clientId);

  const gapi = window.gapi;
  const google = window.google;
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/people/v1/rest";
  const SCOPES =
    "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube.upload";

  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [loading, setLoading] = useState(false);

  const tokenClient = useRef({});

  useEffect(() => {
    // Load the Google Sign-In API
    gapi.load("auth", () => {
      gapi.auth2
        .init({
          client_id: clientId,
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
      client_id: clientId,
      scope: SCOPES,
      callback: "", // defined later
    });

    setGisInited(true);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: [DISCOVERY_DOC],
    });
    setGapiInited(true);

    if (User.accessToken && User.expiresIn) {
      gapi.client.setToken({
        access_token: User.accessToken,
        expires_in: User.expiresIn,
      });
      //   await listUpcomingEvents();
    }
  }

  function gapiLoaded() {
    gapi.load("client", initializeGapiClient);
  }

  const contextValue = {
    gapiInited,
    gisInited,
    loading,
    gisLoaded,
    initializeGapiClient,
    gapiLoaded,
    clientId,
    clientSecret,
    apiKey,
    tokenClient,
  };

  return (
    <GoogleAuthContext.Provider value={contextValue}>
      {children}
    </GoogleAuthContext.Provider>
  );
};

export default GoogleAuthProvider;
