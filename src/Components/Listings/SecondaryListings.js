import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Tooltip,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";

import { BiBed, BiBath } from "react-icons/bi";
import { BsListStars, BsTrash } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { IoIosAlert } from "react-icons/io";
import usePermission from "../../utils/usePermission";
import SingleListingsModal from "../../Pages/listings/SingleListingsModal";

const SecondaryListings = ({
  lastPage,
  listing,
  currentPage,
  btnloading,
  setCurrentPage,
  setPageBeingScrolled,
  FetchListings,
  loading,
  setLoading,
}) => {
  console.log("loading status: ", loading);
  console.log("listing:: ", listing);
  const { currentMode, BACKEND_URL, t, themeBgImg, isLangRTL, i18n } =
    useStateContext();
  const { hasPermission } = usePermission();
  const static_img = "assets/no-image.png";
  const hikalre = "fullLogoRE.png";
  const hikalrewhite = "fullLogoREWhite.png";
  const token = localStorage.getItem("auth-token");

  const [showOverlay, setShowOverlay] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const handleCloseModal = () => setOpenDialogue(false);

  const style = {
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
  };

  const handleImageClick = (imageUrl) => {
    setActiveImage(imageUrl);
    setShowOverlay(true);
  };

  const handleOpenDialogue = (e, id, name) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDialogue([id, name]);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setBtnLoading(true);
    try {
      const deleteList = await axios.delete(
        `${BACKEND_URL}/new-listings/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("list deleted: ", deleteList);
      toast.success("List deleted successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setBtnLoading(false);
      setOpenDialogue(false);
      FetchListings(token);
    } catch (error) {
      setBtnLoading(false);
      console.log("error delete list: ", error);
      toast.error("Unable to delete list.", {
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

  const handleCloseOverlay = () => {
    setShowOverlay(false);
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

  const [singleListingData, setSingleListingData] = useState({});
  const [singleListingModelOpen, setSingleListingModelOpen] = useState(false);

  const HandleSingleListing = (params) => {
    setSingleListingData(params);
    setSingleListingModelOpen(true);
  };

  return (
    <div className="relative">
      <Box className="p-0">
        {loading ? (
          <div className="flex col-span-3 justify-center items-center h-[500px] w-full">
            <CircularProgress />
          </div>
        ) : listing?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {listing?.map((listing, index) => {
              return (
                <div
                  key={index}
                  className={`card-hover relative overflow-hidden offers-page-${
                    listing?.page
                  } ${
                    !themeBgImg
                      ? currentMode === "dark"
                        ? "bg-[#1C1C1C] text-white"
                        : "bg-[#EEEEEE] text-black"
                      : currentMode === "dark"
                      ? "blur-bg-dark text-white"
                      : "blur-bg-light text-black"
                  } rounded-lg`}
                >
                  <div className="rounded-md flex flex-col justify-between">
                    <div className="">
                      {listing?.meta_tags_for_listings?.banner ? (
                        <img
                          src={listing?.meta_tags_for_listings?.banner}
                          alt="secondary"
                          className="w-full h-[200px] object-cover"
                          onClick={() =>
                            handleImageClick(
                              listing?.meta_tags_for_listings?.banner
                            )
                          }
                        />
                      ) : (
                        <img
                          src={static_img}
                          alt="secondary"
                          className="w-full h-[200px] object-cover"
                        />
                      )}

                      <div
                        className={`absolute top-0 ${
                          isLangRTL(i18n.language) ? "left-0" : "right-0"
                        } p-2`}
                      >
                        <div className="flex flex-col gap-2">
                          <Tooltip title="View Property" arrow>
                            <button
                              onClick={() => HandleSingleListing(listing?.id)}
                              className="bg-primary hover:bg-black hover:border-white border-2 border-transparent p-2 rounded-full"
                            >
                              <BsListStars size={16} color={"#FFFFFF"} />
                            </button>
                          </Tooltip>
                          {hasPermission("delete_listing") && (
                            <Tooltip title="Delete Listing" arrow>
                              <button
                                className="bg-primary hover:bg-black hover:border-white border-2 border-transparent p-2 rounded-full"
                                onClick={(e) =>
                                  handleOpenDialogue(
                                    e,
                                    listing?.id,
                                    listing?.project
                                  )
                                }
                              >
                                <BsTrash size={16} color="#ffffff" />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      <div
                        className={`absolute top-[200px] ${
                          isLangRTL(i18n.language) ? "left-0" : "right-0"
                        } p-2 rounded-b-full`}
                      >
                        <img
                          src={currentMode === "dark" ? hikalrewhite : hikalre}
                          alt="secondary"
                          className="h-[30px]"
                        />
                      </div>
                    </div>
                    <div
                      onClick={() => HandleSingleListing(listing?.id)}
                      className="px-5 py-3"
                    >
                      <h1
                        className={`${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-[#000000]"
                        } my-2 flex justify-between `}
                        style={{ textTransform: "capitalize" }}
                      >
                        <span
                          className={`text-lg p-1 rounded-md font-bold ${
                            !themeBgImg
                              ? "text-primary"
                              : "bg-primary text-white"
                          }`}
                        >
                          {listing?.listing_attribute_type?.price ||
                            t("label_unavailable")}
                        </span>
                      </h1>
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-[#000000]"
                        }  my-2 font-semibold`}
                      >
                        {listing?.title ||
                          `${t("label_project")} ${t("unknown")}`}
                      </div>
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "text-white"
                            : "text-[#000000]"
                        }  my-2`}
                      >
                        {`${t("label_area")} ${
                          listing?.listing_attribute?.area
                        }` || `${t("label_area")} ${t("unknown")}`}
                      </div>

                      <div className="my-2">
                        <div className="flex gap-2 items-center">
                          <BiBed
                            className={`${
                              !themeBgImg
                                ? "text-[#AAAAAA]"
                                : currentMode === "dark"
                                ? "text-[#CCCCCC]"
                                : "text-[#333333]"
                            }`}
                            size={20}
                          />
                          <p className="text-start">
                            <span>
                              {listing?.listing_attribute?.bedroom === "null"
                                ? "-"
                                : listing?.listing_attribute?.bedroom}
                            </span>{" "}
                            <span>
                              {listing?.listing_type?.name === "null"
                                ? "-"
                                : listing?.listing_type?.name}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="my-2 w-full flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <BiBath
                            className={`${
                              !themeBgImg
                                ? "text-[#AAAAAA]"
                                : currentMode === "dark"
                                ? "text-[#CCCCCC]"
                                : "text-[#333333]"
                            }`}
                            size={20}
                          />
                          <p className="text-start">
                            <span>
                              {listing?.listing_attribute?.bathroom === "null"
                                ? "-"
                                : listing?.listing_attribute?.bathroom}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* </Link> */}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center items-center col-span-3 h-[500px] w-full">
            <h2 className="text-primary font-bold text-2xl">
              {t("no_listings_available")}
            </h2>
          </div>
        )}

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
                <span>{t("show_more")}</span>
              )}
            </Button>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        {openDialogue[0] && (
          <Modal
            keepMounted
            open={openDialogue[0]}
            onClose={handleCloseModal}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
            closeAfterTransition
            // BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <div
              style={style}
              className={`w-[calc(100%-20px)] md:w-[40%]  ${
                currentMode === "dark" ? "bg-[#1c1c1c]" : "bg-white"
              } absolute top-1/2 left-1/2 p-5 pt-16 rounded-md`}
            >
              <div className="flex flex-col justify-center items-center">
                <IoIosAlert
                  size={50}
                  className="text-main-red-color text-2xl"
                />
                <h1
                  className={`font-semibold pt-3 text-lg ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  {`Do you really want to delete this List ${openDialogue[1]}?`}
                </h1>
              </div>

              <div className="action buttons mt-5 flex items-center justify-center space-x-2">
                <Button
                  className={` text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none bg-main-red-color shadow-none`}
                  ripple="true"
                  size="lg"
                  onClick={(e) => handleDelete(e, openDialogue[0])}
                >
                  {btnLoading ? (
                    <CircularProgress size={18} sx={{ color: "blue" }} />
                  ) : (
                    <span>{t("confirm")}</span>
                  )}
                </Button>

                <Button
                  onClick={handleCloseModal}
                  ripple="true"
                  variant="outlined"
                  className={`shadow-none  rounded-md text-sm  ${
                    currentMode === "dark"
                      ? "text-white border-white"
                      : "text-main-red-color border-main-red-color"
                  }`}
                >
                  {t("cancel")}
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* SINGLE LISTING  */}
        {singleListingModelOpen && (
          <SingleListingsModal
            singleListingModelOpen={singleListingModelOpen}
            handleCloseSingleListingModel={() =>
              setSingleListingModelOpen(false)
            }
            ListingData={singleListingData}
          />
        )}

        {/* PICTURE OVERLAY  */}
        {showOverlay && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-75"></div>
            <div className="relative z-10 bg-white">
              <img src={activeImage} alt="overlay" className="h-[90vh]" />
              <button
                onClick={handleCloseOverlay}
                className="absolute top-4 right-4 text-2xl text-white bg-primary p-2 rounded-full m-0"
              >
                <MdClose />
              </button>
              <img
                src={hikalrewhite}
                alt="hikal real estate"
                className="absolute right-4 bottom-4 w-[100px] p-2 bg-[#000000] bg-opacity-70"
              />
            </div>
          </div>
        )}
      </Box>
    </div>
  );
};

export default SecondaryListings;
