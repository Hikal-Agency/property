import React from "react";
import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useEffect } from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const AllOffers = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [offers, setOffers] = useState();

  console.log("Offers: ", offers);
  const FetchOffers = async (token) => {
    try {
      const all_offers = await axios.get(`${BACKEND_URL}/offers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      setOffers(all_offers?.data?.offers?.data);

      //   console.log("All Offers: ",all_offers)
    } catch (error) {
      console.log("Offers not fetched. ", error);
      toast.error("Unable to fetch offers.", {
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
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchOffers(token);
  }, []);

  const offer = [
    {
      creationDate: "2022-03-03",
      offerTitle: "Win iPad ",
      offerDescription:
        "Get a chance to win latest iPad 14 Pro Max by closing AED 7 Million plus direct deals this month.",
      valid_from: "2022-03-01",
      valid_to: "2023-03-30",
      validToManager: 1,
      validToSales: 1,
      offerBy: "Mohamed Hikal",
    },
    {
      creationDate: "2022-03-03",
      offerTitle: "Win iPhone 14 Pro Max",
      offerDescription:
        "Get a chance to win latest iPhone 14 Pro Max by closing AED 3 Million plus deals this month.",
      valid_from: "2022-03-01",
      valid_to: "2023-03-30",
      validToManager: 0,
      validToSales: 1,
      offerBy: "Belal Hikal",
    },
    {
      creationDate: "2022-03-07",
      offerTitle: "Win iPhone 14 Pro Max",
      offerDescription:
        "Get a chance to win latest iPhone 14 Pro Max by closing AED 10 Million plus deals this month.",
      valid_from: "2022-03-01",
      valid_to: "2023-03-30",
      validToManager: 1,
      validToSales: 0,
      offerBy: "Mohamed Hikal",
    },
  ];

  return (
    <div>
      <ToastContainer />
      <Box
        className="mt-1 p-5"
        sx={
          isLoading && {
            opacity: 0.3,
          }
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-4 ">
          {offers?.map((offer, index) => {
            return (
              // offer.validToManager === 1 && offer.validToSales === 1 ? (
              <div
                className={`${
                  currentMode === "dark"
                    ? "bg-black text-white"
                    : "bg-white text-black"
                } p-5 rounded-md h-[450px] flex flex-col justify-between`}
              >
                <div>
                  <img
                    src="../assets/offers_static_img.png"
                    alt="offers image"
                  />
                </div>
                <p
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-[#000000]"
                  }  text-xs`}
                  style={{ textTransform: "capitalize" }}
                >
                  Offer from:{" "}
                  <span className="text-[#DA1F26]">Mr. {offer?.offerFrom}</span>
                </p>

                <h1
                  className={`${
                    currentMode === "dark" ? "text-white" : "text-[#000000]"
                  } text-white font-bold rounded-md mb-3 text-start text-lg`}
                  style={{ textTransform: "capitalize" }}
                >
                  {offer?.offerTitle}
                </h1>
                <h6 className="mb-3 p-2">{offer?.offerDescription}</h6>
                <hr className="mb-3"></hr>
                <h1 className="font-semibold mb-3">
                  Valid from {offer?.validFrom} to {offer?.validTill}
                </h1>
                <hr className="mb-3"></hr>
                {/* <h6
                  className="mb-3 bg-main-red-color text-white p-2 rounded-md"
                  style={{ textTransform: "capitalize" }}
                >
                  Offer from Mr. {offer?.offerFrom}
                </h6> */}
              </div>

              // ) : (
              //     <>l
              //     </>
              // )
            );
          })}
        </div>
      </Box>
    </div>
  );
};

export default AllOffers;
