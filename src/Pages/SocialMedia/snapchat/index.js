import React, { useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import PixelStatistics from "../../../Components/campaigns/PixelStatistics";

const Snapchat = () => {
  const { t, themeBgImg, currentMode } = useStateContext();

  const [pageState, setpageState] = useState({
    isLoading: false,
    data: [],
    total: 0,
    page: 1,
    pageSize: 15,
  });

  // const fetchAccountInfo = async () => {
  //   try {
  //       const result = await axios.get("https://adsapi.snapchat.com/v1/me", {
  //         headers: {
  //           "Authorization": "Bearer " + accessToken
  //         }
  //       });

  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong!", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // }

  // useEffect(() => {
  //   fetchAccountInfo();
  // }, []);
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

          <div className={`w-full mt-12`}>
            <PixelStatistics
              pageState={pageState}
              setpageState={setpageState}
            />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Snapchat;
