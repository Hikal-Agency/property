import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import {
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineCalendar,
  AiOutlineFolder,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { BsCodeSlash } from "react-icons/bs";
import { BiSlideshow } from "react-icons/bi";

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

const SecondaryListings = ({
  user,
  lastPage,
  //   offers,
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
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-x-3 gap-y-3 pb-4 text-center">
          {offers?.map((offer, index) => {
            return (
              <div
                className={`relative overflow-hidden offers-page-${
                  offer?.page
                } ${
                  currentMode === "dark"
                    ? "bg-[#1C1C1C] text-white"
                    : "bg-gray-200 text-black"
                } rounded-lg`}
              >
                <div
                  style={{
                    filter:
                      offer?.status?.toLowerCase() === "expired"
                        ? "grayscale(1)"
                        : "",
                  }}
                  className="p-5 rounded-md h-[430px] flex flex-col justify-between"
                >
                  <div className=" top-0 left-0 z-10 flex gap-1 b-4">
                    <div className="h-1 w-7 bg-red-500"></div>
                    <div className="h-1 w-7 bg-red-500"></div>
                    <div className="h-1 w-7 bg-red-500"></div>
                  </div>
                  <div className="mt-4">
                    {offer?.offer_image ? (
                      <img
                        src={offer?.offer_image}
                        alt="offer"
                        className="w-full object-cover h-[200px]"
                      />
                    ) : (
                      <img
                        src={imagePaths[0]}
                        alt="offer"
                        className="w-full h-[200px] object-cover"
                      />
                    )}
                  </div>
                  {/* icons  */}
                  <div className=" flex justify-between my-3 pb-5 ">
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <AiOutlineEye />
                      </span>{" "}
                      <span>1</span>
                    </div>
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <AiOutlineHeart />
                      </span>{" "}
                      <span>2</span>
                    </div>
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <AiOutlineCalendar />
                      </span>{" "}
                      <span>3</span>
                    </div>
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <IoExtensionPuzzleOutline />
                      </span>{" "}
                      <span>4</span>
                    </div>
                  </div>
                  <hr />
                  <h1
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-[#000000]"
                    }   flex justify-between my-4`}
                    style={{ textTransform: "capitalize" }}
                  >
                    <span className="text-2xl font-bold">
                      {offer?.offerPrice}
                    </span>
                    <span
                      className={`${
                        offer?.status.toLowerCase() === "active"
                          ? "text-[#14ae5c]"
                          : "text-[#b91c1c]"
                      } text-xs font-bold`}
                    >
                      {offer?.status}
                    </span>
                  </h1>
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-[#000000]"
                    } text-white  rounded-md mb-4 text-start text-base`}
                    style={{
                      textTransform: "capitalize",
                      color: currentMode === "dark" ? "#ffffff" : "#000000",
                    }}
                  >
                    {offer?.offerSmallDesc}
                  </p>
                  <p className="mb-1 text-start">{offer?.offerDescription}</p>
                  {/* icons  */}
                  <div className=" flex justify-between mb-5 ">
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <BiSlideshow />
                      </span>{" "}
                    </div>
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <BsCodeSlash />
                      </span>{" "}
                    </div>
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <AiOutlineFolder />
                      </span>{" "}
                    </div>
                    <div className="h-1 w-7 flex space-x-1 ">
                      <span className="mt-1">
                        <AiOutlineShareAlt />
                      </span>{" "}
                    </div>
                  </div>
                  <hr className="mb-1" style={{ marginBottom: "10px" }}></hr>
                  <Button
                    disabled={btnloading}
                    onClick={() => setCurrentPage((page) => page + 1)}
                    variant="contained"
                    // color="error"
                    className="bg-btn-primary"
                    sx={{ marginBottom: "10px" }}
                  >
                    {btnloading ? (
                      <div className="flex items-center justify-center space-x-1">
                        <CircularProgress size={18} sx={{ color: "blue" }} />
                      </div>
                    ) : (
                      <span>Manage Listing</span>
                    )}
                  </Button>
                  <hr className="mb-5" style={{ marginBottom: "10px" }}></hr>
                </div>
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

export default SecondaryListings;
