import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import axios from "../../axoisConfig";
import { useEffect } from "react";
import { useState } from "react";

const ManagerOffers = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, BACKEND_URL } = useStateContext();
  const [offers, setOffers] = useState();
  const [lastPage, setLastPage] = useState(0);
  const [btnloading, setbtnloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const imagePaths = [
    "../assets/offers_static_img.png",
    "../assets/offers_static_img_2.png",
  ];

  console.log("Offers: ", offers);

  const FetchOffers = async (token, page = 1) => {
    if (page > 1) {
      setbtnloading(true);
    }
    try {
      const all_offers = await axios.get(`${BACKEND_URL}/offers?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if(page > 1) {
        setOffers((offers) => [...offers, all_offers?.data?.offers?.data]);
      } else {
        setOffers(all_offers?.data?.offers?.data);
      }
      setLastPage(all_offers?.data?.offers?.last_page);
      setbtnloading(false);
      //   console.log("All Offers: ",all_offers)
    } catch (error) {
      console.log("Offers not fetched. ", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchOffers(token, currentPage);
  }, [currentPage]);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchOffers(token);
  }, []);

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
              offer?.validToManager === 1 && (
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
                        alt="offer"
                        className="w-full h-[200px]"
                      />
                    ) : (
                      <img
                        src={
                          imagePaths[
                            Math.floor(Math.random() * imagePaths.length)
                          ]
                        }
                        alt="offer"
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
                      {offer?.offerFromName}
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
            );
          })}
        </div>
        {(currentPage < lastPage) &&
        <div className="flex justify-center mt-5">
          <Button
            disabled={btnloading}
            onClick={() => setCurrentPage((page) => page + 1)}
            variant="contained"
            color="error"
          >
            {btnloading ? (
              <div className="flex items-center justify-center space-x-1">
                <CircularProgress size={18} sx={{ color: "blue" }} />
              </div>
            ) : (
              <span>Show More</span>
            )}
          </Button>
        </div>
        }
      </Box>
    </div>
  );
};

export default ManagerOffers;
