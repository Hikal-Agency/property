// import axios from "axios";
// import { useStateContext } from "./context/ContextProvider";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // const { BACKEND_URL } = useStateContext;
// const axiosInstance = axios.create();

// const showToastMessage = (message) => {
//   toast.error(message);
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Show toast message here
//       console.log("Unauth::::::::");
//       showToastMessage("System updated. Kindly logout and login again.");
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from "axios";
import { useStateContext } from "./context/ContextProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

// const { BACKEND_URL } = useStateContext;
const axiosInstance = axios.create();

const showToastMessage = (message) => {
  toast.error(message);
};

let isRedirecting = false; // Flag to check if redirection is already in progress

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !isRedirecting) {
      // Show toast message here
      console.log("Unauth::::::::");
      // showToastMessage("System updated. Kindly logout and login again.");

      // Redirect the user to the "/" route
      isRedirecting = true;
      // window.location.href = "/";
      const navigate = useNavigate();
      const location = useLocation();
      const continueURL = location.pathname;

      navigate("/", {
        state: {
          error: "System updated. Kindly logout and login again.",
          continueURL: continueURL,
        },
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
