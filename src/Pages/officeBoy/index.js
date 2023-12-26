import React from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";

import { useEffect } from "react";

const Menu = ({
  user,
  lastPage,
  offers,
  currentPage,
  btnloading,
  setCurrentPage,
  setPageBeingScrolled,
}) => {
  const { currentMode, isArabic, primaryColor, t, themeBgImg } =
    useStateContext();

  const imagePaths = ["../assets/offers_static_img.png"];

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

  const offersArr =
    user === "manager"
      ? offers?.filter((off) => off?.validToManager === 1)
      : offers?.filter((off) => off?.validToSales === 1);

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
          {offersArr?.map((offer, index) => {
            return (
              <div
                className={`card-hover relative overflow-hidden rounded-lg shadow-sm offers-page-${
                  offer?.page
                } ${
                  !themeBgImg
                    ? currentMode === "dark"
                      ? "bg-[#1c1c1c] text-white"
                      : "bg-gray-100 text-black"
                    : currentMode === "dark"
                    ? "blur-bg-dark text-white"
                    : "blur-bg-light text-black"
                } `}
              >
                {offer?.status?.toLowerCase() === "expired" && (
                  <Box sx={{ ...ribbonStyles }}>
                    <div className="wrap">
                      <span>{t("offer_expired")}</span>
                    </div>
                  </Box>
                )}
                <div
                  style={{
                    filter:
                      offer?.status?.toLowerCase() === "expired"
                        ? "grayscale(1)"
                        : "",
                  }}
                  className="p-5 h-full flex flex-col"
                >
                  <div className="mb-2 top-0 left-0 z-10 flex gap-1">
                    <div className="h-1 w-7 bg-primary rounded-md"></div>
                    <div className="h-1 w-7 bg-primary rounded-md"></div>
                    <div className="h-1 w-7 bg-primary rounded-md"></div>
                  </div>
                  <div className="my-1">
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
                  {/* OFFER INFO  */}
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } text-center font-bold rounded-md my-3`}
                    style={{
                      fontFamily: isArabic(offer?.offerTitle)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {offer?.offerTitle}
                  </p>
                  <p
                    className="mb-4 text-center"
                    style={{
                      fontFamily: isArabic(offer?.offerDescription)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {offer?.offerDescription}
                  </p>

                  <hr className="mb-4"></hr>

                  {/* VALIDITY  */}
                  <p className="font-semibold text-base mb-3">
                    {t("label_valid_from")}{" "}
                    <span className="text-primary">{offer?.validFrom}</span> -{" "}
                    <span className="text-primary">{offer?.validTill}</span>
                  </p>

                  {/* OFFER FROM  */}
                  <p
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-[#000000]"
                    }  text-sm text-center mb-2`}
                    style={{ textTransform: "capitalize" }}
                  >
                    {t("label_offer_from")}{" "}
                    <span className="text-primary font-semibold">
                      {offer?.offerFromName}
                    </span>
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
    </div>
  );
};

export default Menu;
