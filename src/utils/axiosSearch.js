import axios from "axios";
import { toast } from "react-toastify";

const makeRequestCreator = () => {
  let token;

  return async (query, authToken) => {
    // Allow users to pass the Bearer token
    // Check if we made a request
    if (token) {
      // Cancel the previous request before making a new request
      token.cancel("Request canceled"); // Pass a cancellation message
    }
    // Create a new CancelToken
    token = axios.CancelToken.source();
    try {
      const config = {
        cancelToken: token.token,
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the Bearer token to the headers
        },
      };
      const res = await axios(query, config);
      const result = res.data;
      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if the request was canceled
        console.log("Request canceled", error.message);
      } else {
        // Handle usual errors
        console.log("Something went wrong: ", error.message);
        toast.error("Unable to search.", {
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
    }
  };
};

export const search = makeRequestCreator();
