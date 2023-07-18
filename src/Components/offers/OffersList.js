import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
// import axios from "axios";
import { useEffect } from "react";

const ribbonStyles = {
  width: "200px",
  height: "40px",
  filter: "grayscale(0) !important",
  lineHeight: "52px",
  position: "absolute",
  top: "30px",
  right: "-50px",
  color: "white",
  zIndex: 2,
  overflow: "hidden",
  transform: "rotate(45deg)",
  border: "1px dashed",
  boxShadow: "0 0 0 3px #da1f26, 0px 21px 5px -18px rgba(0,0,0,0.6)",
  background: "#da1f26",
  textAlign: "center",

  "& .wrap": {
    width: "100%",
    height: "188px",
    position: "absolute",
    top: "-8px",
    left: "8px",
    overflow: "hidden",
  },
  "& .wrap:before, .wrap:after": {
    content: "''",
    position: "absolute",
  },
  "& .wrap:before": {
    width: "40px",
    height: "8px",
    right: "100px",
    background: "#4D6530",
    borderRadius: "8px 8px 0px 0px",
  },
  "& .wrap:after": {
    width: "8px",
    height: "40px",
    right: "0px",
    top: "100px",
    background: "#4D6530",
    borderRadius: "0px 8px 8px 0px",
  },
};

const OffersList = ({ user, lastPage, offers, currentPage, btnloading, setCurrentPage, setPageBeingScrolled }) => {
  const { currentMode, } = useStateContext();


  const imagePaths = [
    "../assets/offers_static_img.png",
    "../assets/offers_static_img_2.png",
  ];


  const isElementVisible = (element) => {
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return elementRect.bottom >= 0 && elementRect.bottom <= viewportHeight;
  };

  useEffect(() => {
    const handleScroll = () => {
      let updatedPage = 1;
      for (let i = 0; i < offers?.length; i++) {
        const element = document.querySelector(
          `.offers-page-${offers[i].page}`
        );
        if (element && isElementVisible(element)) {
          updatedPage = offers[i]?.page;
          break;
        }
      }

      if (updatedPage) {
        setPageBeingScrolled(updatedPage);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const offersArr = user === "manager" ? offers?.filter((off) => off?.validToManager === 1) : offers?.filter((off) => off?.validToSales === 1);
  return (
    <div className="relative">
      <Box
        className="mt-1 p-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-4 text-center">
          {offersArr?.map((offer, index) => {
            return (
                <div
                  className={`relative overflow-hidden offers-page-${offer?.page} ${
                    currentMode === "dark"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } `}
                >
                {offer?.status?.toLowerCase() === "expired" &&
                  <Box sx={{ ...ribbonStyles }}>
                    <div className="wrap">
                      <span>Expired</span>
                    </div>
                  </Box>
                }
                  <div style={{
                          filter: offer?.status?.toLowerCase() === "expired" ? "grayscale(1)" : ""
                        }}  className="p-5 rounded-md h-[500px] flex flex-col justify-between">
                    <div className=" top-0 left-0 z-10 flex gap-1">
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
                  </div>
                  {/* <h6
                  className="mb-3 bg-main-red-color text-white p-2 rounded-md"
                  style={{ textTransform: "capitalize" }}
                >
                  Offer from Mr. {offer?.offerFrom}
                </h6> */}
                </div>
            );
          })}
        </div>
        {currentPage < lastPage && (
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
        )}
      </Box>
    
    </div>
  );
};

export default OffersList;
