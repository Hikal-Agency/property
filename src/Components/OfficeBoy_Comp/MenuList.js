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
  const { currentMode, isArabic, isLangRTL, i18n, t, themeBgImg } =
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

  return (
    <div className="relative">
      <Box className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 pb-5 text-center">
          {menu?.map((menu, index) => {
            return (
              <div
                className={`${
                  themeBgImg
                    ? currentMode === "dark"
                      ? "blur-bg-dark"
                      : "blur-bg-light"
                    : currentMode === "dark"
                    ? "bg-dark-neu"
                    : "bg-light-neu"
                } cursor-pointer relative p-5 overflow-hidden offers-page-${
                  menu?.page
                } ${currentMode === "dark" ? "text-white" : "text-black"} `}
                onClick={
                  menu?.itemStatus?.toLowerCase() === "available"
                    ? () => setOpenOrderModal({ open: true, data: menu })
                    : undefined
                }
              >
                {menu?.itemPrice && menu?.itemPrice !== 0 ? (
                  <div
                    className={`${
                      isLangRTL(i18n.language) ? "left-3" : "right-3"
                    } ${
                      themeBgImg
                        ? "bg-primary"
                        : currentMode === "dark"
                        ? "bg-primary-dark-neu"
                        : "bg-primary-light-neu"
                    } absolute top-3 rounded-md text-white p-2`}
                  >
                    <p className="m-0">
                      {menu?.currency} {menu?.itemPrice}
                    </p>
                  </div>
                ) : null}

                <div className="h-full flex flex-col">
                  {menu?.image_path ? (
                    <img
                      src={menu?.image_path}
                      alt="menu"
                      className={`w-full object-cover h-[250px] lg:h-[200px] rounded-xl ${
                        menu?.itemStatus?.toLowerCase() !== "available" &&
                        "grayscale"
                      }`}
                    />
                  ) : (
                    <img
                      src={imagePaths[0]}
                      alt="menu"
                      className={`w-full object-cover h-[250px] lg:h-[200px] rounded-xl ${
                        menu?.itemStatus?.toLowerCase() !== "available" &&
                        "grayscale"
                      }`}
                    />
                  )}
                  {/* MENU INFO  */}
                  <h6
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } text-center mt-5 capitalize`}
                    style={{
                      fontFamily: isArabic(menu?.itemName)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {menu?.itemName}
                  </h6>
                </div>
                {menu?.itemStatus?.toLowerCase() !== "available" && (
                  <div
                    className="absolute w-full h-full top-0 left-0 flex items-center justify-center font-semibold uppercase"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                    }}
                  >
                    OUT OF STOCK
                  </div>
                )}
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
