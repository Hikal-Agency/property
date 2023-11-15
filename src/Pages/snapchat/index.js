import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../../axoisConfig";

const accessToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNjk5ODc2Mjk2LCJzdWIiOiJkNzUxOGRkOS02YWM0LTQ0YjUtYmY5Ni0xY2JmNWUwZDBmOTR-UFJPRFVDVElPTn4zNTRkYTA3Yy03ODYwLTQ2ODAtYWI5NC0wOTExOWY0MDk3NWEifQ.WHNeFgWzdcj8lYGe0Fcug1FA7vxkeJr7rDP3CBOFruo";

const Snapchat = () => {
  const { t, themeBgImg, currentMode } =
    useStateContext();

    const fetchAccountInfo = async () => {
      try {
          const result = await axios.get("https://adsapi.snapchat.com/v1/me", {
            headers: {
              "Authorization": "Bearer " + accessToken
            }
          });

      } catch (error) {
        console.log(error); 
        toast.error("Something went wrong!", {
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

    useEffect(() => {
      fetchAccountInfo();
    }, []);
  return (
    <>
      
      <div className="flex min-h-screen">
        <div
          className={`w-full p-4 ${
            !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="flex items-center">
            <div className="bg-primary h-10 w-1 rounded-full"></div>
            <h1
              className={`text-lg font-semibold mx-2 uppercase ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              Snapchat
            </h1>
          </div>


        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Snapchat;
