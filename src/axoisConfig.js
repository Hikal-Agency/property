import axios from "axios";
import { useStateContext } from "./context/ContextProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const { BACKEND_URL } = useStateContext;
const axiosInstance = axios.create();

const showToastMessage = (message) => {
  toast.error(message);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Show toast message here
      console.log("Unauth::::::::");
      showToastMessage("System updated. Kindly logout and login again.");

      // Redirect the user to the "/" route
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
