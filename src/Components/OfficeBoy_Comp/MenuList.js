import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { useEffect } from "react";
import OrderPlacementModal from "./OrderPlacementModal";

const MenuList = ({
  user,
  lastPage,
  menu,
  currentPage,
  btnloading,
  setCurrentPage,
  setPageBeingScrolled,
}) => {
  const { currentMode, isArabic, primaryColor, t, themeBgImg } =
    useStateContext();
  const [openOrderModal, setOpenOrderModal] = useState({
    open: false,
    data: null,
  });

  const imagePaths = ["../assets/offers_static_img.png"];

  const isElementVisible = (element) => {
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return elementRect.bottom >= 0 && elementRect.bottom <= viewportHeight;
  };

  useEffect(() => {
    const handleScroll = () => {
      let updatedPage = 1;
      for (let i = 0; i < menu?.length; i++) {
        const element = document.querySelector(`.menu-page-${menu[i].page}`);
        if (element && isElementVisible(element)) {
          updatedPage = menu[i]?.page;
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

  const ribbonStyles = {
    width: "100px",
    height: "40px",
    // filter: "grayscale(0) !important",
    lineHeight: "52px",
    position: "absolute",
    top: "0",
    right: "0",
    color: "white",
    zIndex: 2,
    overflow: "hidden",
    // transform: "rotate(45deg)",
    // border: "1px dashed",
    boxShadow: `0 0 0 3px ${primaryColor}, 0px 21px 5px -18px rgba(0,0,0,0.6)`,
    background: primaryColor,
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

  return (
    <div className="relative">
      <Box className="mt-1 p-5">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-x-3 gap-y-3 pb-4 text-center">
          {menu?.map((menu, index) => {
            return (
              <div
                className={`card-hover cursor-pointer relative overflow-hidden rounded-lg shadow-sm offers-page-${
                  menu?.page
                } ${
                  !themeBgImg
                    ? currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-gray-100 text-black"
                    : currentMode === "dark"
                    ? "blur-bg-dark text-white"
                    : "blur-bg-light text-black"
                } `}
                onClick={() => setOpenOrderModal({ open: true, data: menu })}
              >
                {menu?.itemPrice && menu?.itemPrice !== 0 ? (
                  <Box sx={{ ...ribbonStyles }}>
                    <div className="wrap">
                      {menu?.currency}
                      <span className="ml-2">{menu?.itemPrice}</span>
                    </div>
                  </Box>
                ) : null}

                <div className="p-5 h-full flex flex-col">
                  <div className="my-1">
                    {menu?.image_path ? (
                      <img
                        src={menu?.image_path}
                        alt="menu"
                        className="w-full object-cover h-[200px]"
                      />
                    ) : (
                      <img
                        src={imagePaths[0]}
                        alt="menu"
                        className="w-full h-[200px] object-cover"
                      />
                    )}
                  </div>
                  {/* MENU INFO  */}
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } text-center font-bold rounded-md my-3`}
                    style={{
                      fontFamily: isArabic(menu?.itemName)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {menu?.itemName}
                  </p>
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
              className="bg-btn-primary"
            >
              {btnloading ? (
                <div className="flex items-center justify-center space-x-1">
                  <CircularProgress size={18} sx={{ color: "blue" }} />
                </div>
              ) : (
                <span>{t("show_more")}</span>
              )}
            </Button>
          </div>
        )}
      </Box>
      <OrderPlacementModal
        openOrderModal={openOrderModal}
        setOpenOrderModal={setOpenOrderModal}
      />
    </div>
  );
};

export default MenuList;
