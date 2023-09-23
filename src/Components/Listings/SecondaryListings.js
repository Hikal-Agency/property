import React from "react";
import { Box, Button, CircularProgress, IconButton, Tooltip } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import { 
  BiBed, 
  BiBath 
} from "react-icons/bi";
import {
  BsListStars
} from "react-icons/bs";


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
  const static_img = "assets/no-image.png";
  const hikalre = "fullLogoRE.png";
  const hikalrewhite = "fullLogoREWhite.png";

  const imagePaths = ["../assets/offers_static_img.png"];

  const isElementVisible = (element) => {
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return elementRect.bottom >= 0 && elementRect.bottom <= viewportHeight;
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     let updatedPage = 1;
  //     for (let i = 0; i < offers?.length; i++) {
  //       const element = document.querySelector(
  //         `.offers-page-${offers[i].page}`
  //       );
  //       if (element && isElementVisible(element)) {
  //         updatedPage = offers[i]?.page;
  //         break;
  //       }
  //     }

  //     if (updatedPage) {
  //       setPageBeingScrolled(updatedPage);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div className="relative">
      <Box className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {listing?.length > 0 ? (
            listing?.map((listing, index) => {
              return (
                <div
                  className={`relative overflow-hidden offers-page-${
                    listing?.page
                  } ${
                    currentMode === "dark"
                      ? "bg-[#1C1C1C] text-white"
                      : "bg-[#EEEEEE] text-black"
                  } rounded-lg`}
                >
                  <div
                    // style={{
                    //   filter:
                    //     offer?.status?.toLowerCase() === "expired"
                    //       ? "grayscale(1)"
                    //       : "",
                    // }}
                    className="rounded-md flex flex-col justify-between"
                  >
                    <div className="">
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
                        alt="secondary"
                        className="w-full h-[200px] object-cover"
                      />
                      <div className={`absolute top-0 right-2 p-2 pb-5 rounded-b-full bg-primary`}>
                        <Tooltip title="View Property">
                          <Link
                            sx={{w: "100%" }}
                            to={`/secondaryListings/${listing?.id}`}
                            target="_blank"
                          >
                            <IconButton className="my-1">
                              <BsListStars size={20} color={"#FFFFFF"} />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </div>
                      <div className={`absolute top-[200px] right-0 p-2 rounded-b-full`}>
                        <img
                          src={currentMode === "dark" ? hikalrewhite : hikalre}
                          alt="secondary"
                          className="h-[30px]"
                        />
                      </div>
                    </div>
                    
                    <div className="px-5 py-3">
                      <h1
                        className={`${
                          currentMode === "dark" ? "text-white" : "text-[#000000]"
                        } my-2 flex justify-between `}
                        style={{ textTransform: "capitalize" }}
                      >
                        <span className="text-xl font-bold text-primary">
                          {listing?.price || "Unavailable"}
                        </span>
                      </h1>
                      <div className={`${
                          currentMode === "dark" ? "text-white" : "text-[#000000]"
                        }  my-2 font-semibold`}>
                        {listing?.project || "Project unknown"}
                      </div>
                      <div className={`${
                          currentMode === "dark" ? "text-white" : "text-[#000000]"
                        }  my-2`}>
                        {listing?.address || "Address unknown"}
                      </div>
                      
                      <div className="my-2">
                        <div className="flex space-x-3 items-center">
                          <BiBed className="text-[#AAAAAA]" size={20} />
                          <p className="text-start">
                            <span>{listing?.bedrooms === "null" ? "-" : listing?.bedrooms}</span>{" "} 
                            <span>{listing?.property_type === "null" ? "-" : listing?.property_type}</span>
                          </p>
                        </div>
                      </div>
                      <div className="my-2">
                        <div className="flex space-x-3 items-center">
                          <BiBath className="text-[#AAAAAA]" size={20} />
                          <p className="text-start">
                            <span>{listing?.bathrooms === "null" ? "-" : listing?.bathrooms}</span>
                          </p>
                        </div>
                      </div>

                      {/* <Link
                        sx={{w: "100%" }}
                        to={`/secondaryListings/${listing?.id}`}
                        target="_blank"
                      >
                        <Button
                          fullWidth
                          sx={{ mt: 1 }}
                          variant="contained"
                          className="bg-btn-primary"
                          // style={{
                          //   backgroundColor: primaryColor,
                          // }}
                          size="medium"
                        >
                          Manage Listing
                        </Button>
                      </Link> */}

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
