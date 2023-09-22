import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { BiBed, BiBath } from "react-icons/bi";

import { useEffect } from "react";
import { Link } from "react-router-dom";

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

const SecondaryListings = ({
  lastPage,
  listing,
  currentPage,
  btnloading,
  setCurrentPage,
  setPageBeingScrolled,
}) => {
  const { currentMode } = useStateContext();
  const static_img = "assets/list-static-img.jpg";

  const imagePaths = ["../assets/offers_static_img.png"];

  const offers = [
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
    {
      id: 1,
      offer_image: static_img,
      offerPrice: "999,999 AED",
      offerSmallDesc: "605, Donald St",
      status: "Active",
    },
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

  return (
    <div className="relative ">
      <Box className="mt-1 p-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-3  text-center">
          {listing?.length > 0 ? (
            listing?.map((listing, index) => {
              return (
                <div
                  className={`relative overflow-hidden offers-page-${
                    listing?.page
                  } ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-gray-200 text-black"
                  } rounded-lg`}
                >
                  <div
                    // style={{
                    //   filter:
                    //     offer?.status?.toLowerCase() === "expired"
                    //       ? "grayscale(1)"
                    //       : "",
                    // }}
                    className="p-5 rounded-md  flex flex-col justify-between"
                  >
                    <div className=" top-0 left-0 z-10 flex gap-1 b-4">
                      <div className="h-1 w-7 bg-red-500"></div>
                      <div className="h-1 w-7 bg-red-500"></div>
                      <div className="h-1 w-7 bg-red-500"></div>
                    </div>
                    <div className="mt-4">
                      {/* {listing?.pictures[0] ? (
                        <img
                          src={listing?.pictures[0]}
                          alt="offer"
                          className="w-full object-cover h-[200px]"
                        />
                      ) : (
                        <img
                          src={imagePaths[0]}
                          alt="offer"
                          className="w-full h-[200px] object-cover"
                        />
                      )} */}
                      <img
                        src={static_img}
                        alt="offer"
                        className="w-full h-[200px] object-cover"
                      />
                    </div>

                    <hr />
                    <h1
                      className={`${
                        currentMode === "dark" ? "text-white" : "text-[#000000]"
                      }   flex justify-between mt-3 `}
                      style={{ textTransform: "capitalize" }}
                    >
                      <span className="text-2xl font-bold text-primary">
                        AED {listing?.price || "Price Unavailable"}
                      </span>
                      <span className={`text-sm font-bold text-primary`}>
                        {listing?.seller_name || "-"}
                      </span>
                    </h1>

                    <div className=" mt-4 mb-3">
                      <div className="flex space-x-3 items-center mb-3">
                        <p
                          className={`${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-[#000000]"
                          } text-white  rounded-md text-start text-lg font-semibold`}
                          style={{
                            textTransform: "capitalize",
                            color:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          }}
                        >
                          Project :
                        </p>
                        <p className=" text-start text-primary">
                          {listing?.project || "-"}
                        </p>
                      </div>
                      <div className="flex space-x-3 items-center ">
                        <p
                          className={`${
                            currentMode === "dark"
                              ? "text-white"
                              : "text-[#000000]"
                          } text-white  rounded-md text-start text-lg font-semibold`}
                          style={{
                            textTransform: "capitalize",
                            color:
                              currentMode === "dark" ? "#ffffff" : "#000000",
                          }}
                        >
                          Address :
                        </p>
                        <p className=" text-start text-primary">
                          {listing?.address || "-"}
                        </p>
                      </div>
                    </div>
                    <div className=" mb-3">
                      <div className="flex space-x-3 items-center mb-3">
                        <BiBed className="text-primary mr-2" size={20} /> :
                        <p className="text-start text-primary">
                          {listing?.bedrooms + " " + listing?.property_type ||
                            "-"}
                        </p>
                      </div>
                      <div className="flex space-x-3 items-center">
                        <BiBath className="text-primary mr-2" size={20} /> :
                        <p className="text-start text-primary">
                          {listing?.bathrooms || "-"}
                        </p>
                      </div>
                    </div>

                    <Link
                      sx={{ my: 0, w: "100%" }}
                      to={`/secondaryListings/${listing?.id}`}
                      target="_blank"
                    >
                      <Button
                        fullWidth
                        sx={{ my: 0 }}
                        variant="contained"
                        className="bg-btn-primary"
                        // style={{
                        //   backgroundColor: primaryColor,
                        // }}
                        size="medium"
                      >
                        Manager Listing
                      </Button>
                    </Link>

                    {/* <Button
                      disabled={btnloading}
                      onClick={() => setCurrentPage((page) => page + 1)}
                      variant="contained"
                      // color="error"
                      className="bg-btn-primary"
                      // sx={{ marginBottom: "10px" }}
                    >
                      {btnloading ? (
                        <div className="flex items-center justify-center space-x-1">
                          <CircularProgress size={18} sx={{ color: "blue" }} />
                        </div>
                      ) : (
                        <span>Manage Listing</span>
                      )}
                    </Button> */}
                  </div>
                </div>
              );
            })
          ) : (
            <h2>No listings available</h2>
          )}
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

export default SecondaryListings;
