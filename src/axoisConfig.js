import axios from "axios";
import { useStateContext } from "./context/ContextProvider";

const { BACKEND_URL } = useStateContext;

// const apiClient = axios.create();
const apiClient = axios.create({
  baseURL: BACKEND_URL,
});

console.log("BACKEND_URL: ", BACKEND_URL);
apiClient.interceptors.request.use(
  (config) => {
    console.log("API Client: ", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response && error.response.status === 429) {
//       window.location.reload();
//     }
//     return Promise.reject(error);
//   }
// );

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 429) {
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
