import React from "react";
import { Box } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useEffect } from "react";
import { useState } from "react";

const SalesPersonOffers = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [offers, setOffers] = useState();

  const imagePaths = [
    "../assets/offers_static_img.png",
    "../assets/offers_static_img_2.png",
    // "../assets/offers_static_img3.png",
  ];

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
      <Box
        className="mt-1 p-5"
        sx={
          isLoading && {
            opacity: 0.3,
          }
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-4 text-center">
          {offers?.map((offer, index) => {
            return (
              offer?.validToSales === 1 && (
                <div
                  className={`${
                    currentMode === "dark"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } p-5 rounded-md h-[500px] flex flex-col justify-between`}
                >
                  <div className=" top-0 left-0   z-10 flex gap-1">
                    <div className="h-1 w-7 bg-red-500"></div>
                    <div className="h-1 w-7 bg-red-500"></div>
                    <div className="h-1 w-7 bg-red-500"></div>
                  </div>

                  <div>
                    {offer?.offer_image ? (
                      <img
                        src={offer?.offer_image}
                        alt="offers image"
                        className="w-full h-[200px]"
                      />
                    ) : (
                      <img
                        src={
                          imagePaths[
                            Math.floor(Math.random() * imagePaths.length)
                          ]
                        }
                        alt="offers image"
                        className="w-full h-[200px]"
                      />
                    )}
                  </div>

                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-[#000000]"
                    }  text-xs text-start`}
                    style={{ textTransform: "capitalize" }}
                  >
                    Offer from:{" "}
                    <span className="text-[#DA1F26] font-bold">
                      Mr. {offer?.offerFromName}
                    </span>
                  </p>

                  <h1
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-[#000000]"
                    } text-white font-bold rounded-md mb-3 text-start text-lg`}
                    style={{
                      textTransform: "capitalize",
                      color: currentMode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    {offer?.offerTitle}
                  </h1>
                  <p className="mb-3 text-start">{offer?.offerDescription}</p>
                  <hr className="mb-1"></hr>
                  <h1 className="font-semibold mb-1">
                    Valid from{" "}
                    <span className="text-[#DA1F26]">{offer?.validFrom}</span>{" "}
                    to{" "}
                    <span className="text-[#DA1F26]">{offer?.validTill}</span>
                  </h1>
                  <hr className="mb-1"></hr>
                  {/* <h6
                  className="mb-3 bg-main-red-color text-white p-2 rounded-md"
                  style={{ textTransform: "capitalize" }}
                >
                  Offer from Mr. {offer?.offerFrom}
                </h6> */}
                </div>
              )
              //  : (
              //     <>
              //     No valid offers for agents
              //     </>
              // )
            );
          })}
        </div>
      </Box>
    </div>
  );
};

export default SalesPersonOffers;
