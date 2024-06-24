import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { Link } from "react-router-dom";
import { BsFillBuildingFill } from "react-icons/bs";

import { BiBed, BiBath } from "react-icons/bi";
import { BsListStars, BsFillTrashFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { IoIosAlert } from "react-icons/io";
import usePermission from "../../utils/usePermission";
import { BsCaretDownFill } from "react-icons/bs";
import { HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding } from "react-icons/hi";
import { style } from "@mui/system";

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

const useStyles = styled({
  customAccordion: {
    backgroundColor: "lightblue",
  },
});

const Sellers = ({
  lastPage,
  manualSellers,
  currentPage,
  btnloading,
  setCurrentPage,
  setPageBeingScrolled,
  FetchListings,
  loading,
  setLoading,
  leadSellers,
  setLeadSellers,
}) => {
  const classes = useStyles();

  const { currentMode, BACKEND_URL } = useStateContext();
  const { hasPermission } = usePermission();
  const static_img = "assets/no-image.png";
  const hikalre = "fullLogoRE.png";
  const hikalrewhite = "fullLogoREWhite.png";
  const token = localStorage.getItem("auth-token");

  const imagePaths = ["../assets/offers_static_img.png"];

  const isElementVisible = (element) => {
    const elementRect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    return elementRect.bottom >= 0 && elementRect.bottom <= viewportHeight;
  };

  const [showOverlay, setShowOverlay] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const handleCloseModal = () => setOpenDialogue(false);

  // count lead seller listings
  const leadListingsCount = {};
  manualSellers?.forEach((listing) => {
    if (listing?.lead_id === leadListingsCount[listing?.id]) {
      if (!leadListingsCount[listing.id]) {
        leadListingsCount[listing.id] = 0;
      }
      leadListingsCount[listing.id]++;
    }
  });

  // count manual seller listings
  // Initialize an object to store the counts
  const repeatedListingsCount = {};
  manualSellers?.forEach((listing) => {
    const key = `${listing?.seller_name}_${listing?.seller_contact}`;
    if (!repeatedListingsCount[key]) {
      repeatedListingsCount[key] = 0;
    }
    repeatedListingsCount[key]++;
  });

  console.log("lead listings count :: ", leadListingsCount);

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
      const deleteList = await axios.delete(`${BACKEND_URL}/listings/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
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

  return (
    <div className="relative">
      <Box className="">
        <Accordion
          className={`mb-4 shadow-none`}
          defaultExpanded={true}
          sx={{
            ".css-15v22id-MuiAccordionDetails-root": {
              background: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
              shadow: "none",
              border: "none !important",
            }
          }}
        >
          <AccordionSummary
            expandIcon={
              <BsCaretDownFill
                color={"#AAAAAA"}
              />
            }
            sx={{
              color: currentMode === "dark" && "#ffffff",
              backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
              // borderRadius: "10px",
            }}
            className="shadow-sm font-bold text-lg"
          >
              Manual Sellers
          </AccordionSummary>

          <AccordionDetails>
            {loading === true ? (
              <div className="flex col-span-3 justify-center items-center w-full">
                <CircularProgress />
              </div>
            ) : manualSellers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {manualSellers?.map((listing, index) => {
                  const countForSpecificCombination =
                    repeatedListingsCount[
                      `${listing?.seller_name}_${listing?.seller_contact}`
                    ];

                  return (
                    <>
                      <div
                        key={index}
                        className={`card-hover relative overflow-hidden offers-page-${
                          listing?.page
                        } ${
                          currentMode === "dark"
                            ? "bg-[#000000] text-white"
                            : "bg-[#FFFFFF] text-black"
                        } rounded-lg`}
                      >
                        <div className="rounded-md flex flex-col justify-between">
                          <div className="">
                            <div
                              className={`absolute top-0 right-3 p-2 pb-4 rounded-b-full bg-primary`}
                            >
                              <Tooltip title="View Property">
                                <Link
                                  sx={{ w: "100%" }}
                                  to={`/secondaryListings/${listing?.id}`}
                                  target="_blank"
                                >
                                  <IconButton className="">
                                    <BsFillBuildingFill
                                      size={16}
                                      color={"#FFFFFF"}
                                    />
                                  </IconButton>
                                </Link>
                              </Tooltip>
                            </div>
                          </div>
                          {/* <Link
                            sx={{ w: "100%" }}
                            to={`/secondaryListings/${listing?.id}`}
                            target="_blank"
                          > */}
                          <div className="p-4">
                            <h1 className="text-lg font-bold text-primary">
                              {listing?.seller_name || "---"}
                            </h1>

                            <div className="my-2 grid grid-cols-8 gap-3">
                              <HiOutlinePhone
                                className="col-span-1 text-[#AAAAAA]"
                                size={20}
                              />
                              <p className="col-span-7 text-start">
                                <span>
                                  {listing?.seller_contact === "null"
                                    ? "-"
                                    : listing?.seller_contact}
                                </span>{" "}
                              </p>
                            </div>
                            <div className="my-2 grid grid-cols-8 gap-3">
                              <HiOutlineMail
                                className="col-span-1 text-[#AAAAAA]"
                                size={20}
                              />
                              <p className="col-span-7 text-start">
                                <span>
                                  {listing?.seller_email === "null"
                                  ? "-"
                                  : listing?.seller_email}
                                </span>{" "}
                              </p>
                            </div>
                            {/* <div className="my-2 grid grid-cols-8 gap-3">
                              <HiOutlineOfficeBuilding
                                className="col-span-1 text-[#AAAAAA]"
                                size={20}
                              />
                              <p className="col-span-7 text-start">
                                <span>
                                  {countForSpecificCombination === "null"
                                    ? "-"
                                    : countForSpecificCombination}
                                </span>
                              </p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center items-center col-span-3 w-full">
                <h2 className="text-primary italic">
                  No manual sellers available
                </h2>
              </div>
            )}
          </AccordionDetails>
        </Accordion>

        <Accordion 
          className={`mb-4 shadow-none`} 
          defaultExpanded={true}
          sx={{
            ".MuiAccordionDetails-root": {
              background: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
              shadow: "none",
              border: "none !important",
            }
          }}
        >
          <AccordionSummary
            expandIcon={
              <BsCaretDownFill
                color={"#AAAAAA"}
              />
            }
            sx={{
              color: currentMode === "dark" && "#ffffff",
              backgroundColor: currentMode === "dark" ? "#1C1C1C" : "#EEEEEE",
              // borderRadius: "10px",
            }}
            className="shadow-sm font-bold text-lg"
          >
              Seller From leads
          </AccordionSummary>

          <AccordionDetails>
            {leadSellers?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {loading === false ? (
                  leadSellers?.map((listing, index) => {
                    const listingsCount = leadListingsCount[listing?.id] || 0;
                    console.log("listings count : ", listingsCount);
                    return (
                      <>
                        <div
                          key={index}
                          className={`card-hover relative overflow-hidden offers-page-${
                            listing?.page
                          } ${
                            currentMode === "dark"
                              ? "bg-[#000000] text-white"
                              : "bg-[#FFFFFF] text-black"
                          } rounded-lg`}
                        >
                          <div className="rounded-md flex flex-col justify-between">
                            <div className="">
                              <div
                                className={`absolute top-0 right-3 p-2 pb-4 rounded-b-full bg-primary`}
                              >
                                <Tooltip title="View Property">
                                  <Link
                                    sx={{ w: "100%" }}
                                    to={`/secondaryListings/${listing?.id}`}
                                    target="_blank"
                                  >
                                    <IconButton className="my-1">
                                      <BsFillBuildingFill
                                        size={16}
                                        color={"#FFFFFF"}
                                      />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <h1 className="text-lg font-bold text-primary">
                                {listing?.seller_name || "---"}
                              </h1>

                              <div className="my-2 grid grid-cols-8 gap-3">
                                <HiOutlinePhone
                                  className="col-span-1 text-[#AAAAAA]"
                                  size={20}
                                />
                                <p className="col-span-7 text-start">
                                  <span>
                                    {listing?.seller_contact === "null"
                                      ? "-"
                                      : listing?.seller_contact}
                                  </span>{" "}
                                </p>
                              </div>
                              <div className="my-2 grid grid-cols-8 gap-3">
                                <HiOutlineMail
                                  className="col-span-1 text-[#AAAAAA]"
                                  size={20}
                                />
                                <p className="col-span-7 text-start">
                                  <span>
                                    {listing?.seller_email === "null"
                                      ? "-"
                                      : listing?.seller_email}
                                  </span>
                                </p>
                              </div>
                              {/* <div className="my-2 grid grid-cols-8 gap-3">
                                <HiOutlineOfficeBuilding
                                  className="col-span-1 text-[#AAAAAA]"
                                  size={20}
                                />
                                <p className="col-span-7 text-start">
                                  <span>
                                    {listing?.lead_id === "null"
                                      ? "-"
                                      : listing?.lead_id}
                                  </span>
                                </p>
                              </div> */}

                              {/* {hasPermission("delete_listing") && (
                                  <IconButton
                                    className="bg-btn-primary p-3 rounded-fulls"
                                    onClick={(e) =>
                                      handleOpenDialogue(
                                        e,
                                        listing?.id,
                                        listing?.project
                                      )
                                    }
                                  >
                                    <BsFillTrashFill color="#ffffff" />
                                  </IconButton>
                                )} */}
                            </div>
                            
                          </div>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <div className="flex col-span-3 justify-center items-center w-full">
                    <CircularProgress />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center col-span-3 w-full">
                <h2 className="text-primary italic">
                  No sellers available
                </h2>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
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
                    <span>Confirm</span>
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
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
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

export default Sellers;
