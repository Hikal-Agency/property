import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Tooltip, IconButton, Modal, Backdrop } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../App";

import { BiBed, BiBath } from "react-icons/bi";
import { BsImages, BsFiles, BsPen, BsFileEarmarkText } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdLocationPin, MdClose } from "react-icons/md";
import {
  TbCurrentLocation,
  TbPhone,
  TbMail,
  TbUserCircle,
} from "react-icons/tb";
import SelectImagesModal from "./SelectImagesModal";
import SelectDocumentModal from "./SelectDocumentModal";
import EditListingModal from "../../Components/Leads/listings/EditListingComponent";
import SingleImageModal from "./SingleImageModal";
import SingleDocModal from "./SingleDocModal";
import usePermission from "../../utils/usePermission";
import { IoIosVideocam } from "react-icons/io";

const SingleListingsModal = ({
  ListingData,
  handleCloseSingleListingModel,
  singleListingModelOpen,
}) => {
  console.log("single listing Data:: ", ListingData);
  const [loading, setloading] = useState(true);
  const [listData, setListingData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const { hasPermission } = usePermission();
  const [singleImageModal, setSingleImageModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });
  const [singleDocModal, setSingleDocModal] = useState({
    isOpen: false,
    url: "",
    id: null,
  });
  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });
  const [selectDocumentModal, setSelectDocumentModal] = useState({
    isOpen: false,
    listingId: null,
  });
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
    isLangRTL,
    i18n,
    User,
    t,
  } = useStateContext();

  const handleEdit = () => {
    setOpenEdit(listData);
  };

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      handleCloseSingleListingModel();
    }, 1000);
  };

  // const { lid } = useParams();
  const lid = ListingData;
  console.log("lid ===================", lid);

  const openDoc = (open, url) => {
    window.open(url, "__blank");
  };

  let lat = "";
  let long = "";

  const fetchSingleListing = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const listing = await axios.get(`${BACKEND_URL}/new-listings/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("SINGLE Listings: ", listing);
      setListingData(listing?.data?.data);
      setloading(false);
    } catch (error) {
      setloading(false);
      console.log("Error", error);
      if (error?.response?.status === 404) {
        setLeadNotFound(true);
      } else {
        toast.error("Something went wrong!", {
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
    }
  };

  useEffect(() => {
    setopenBackDrop(false);
    fetchSingleListing(lid);
  }, []);

  const mapContainerStyle = {
    width: "100%",
    height: "100%",
  };

  const options = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  };

  lat = listData?.listing_attribute_type?.latitude;
  long = listData?.listing_attribute_type?.longitude;

  console.log("maps: ", load);

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  return (
    <>
      {/* <div
        className={`flex min-h-screen w-full p-4 ${
          !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
        } ${currentMode === "dark" ? "text-white" : "text-black"}`}
      > */}
      <Modal
        keepMounted
        open={singleListingModelOpen}
        // onClose={handleCloseTimelineModel}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div
          className={`${
            isLangRTL(i18n.language) ? "modal-open-left" : "modal-open-right"
          } ${
            isClosing
              ? isLangRTL(i18n.language)
                ? "modal-close-left"
                : "modal-close-right"
              : ""
          }
          w-[100vw] h-[100vh] flex items-start justify-end `}
        >
          <button
            // onClick={handleCloseTimelineModel}
            onClick={handleClose}
            className={`${
              isLangRTL(i18n.language) ? "rounded-r-full" : "rounded-l-full"
            }
            bg-primary w-fit h-fit p-3 my-4 z-10`}
          >
            <MdClose
              size={18}
              color={"white"}
              className=" hover:border hover:border-white hover:rounded-full"
            />
          </button>

          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#1C1C1C] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-primary border-r-2"
                : "border-primary border-l-2")
            }
              p-4 h-[100vh] w-[80vw] overflow-y-scroll
              `}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                {leadNotFound ? (
                  <Error404 />
                ) : (
                  <div className="w-full">
                    {/* BANNER  */}
                    <div className="w-full  mb-3 ">
                      {listData?.meta_tags_for_listings?.banner ? (
                        <img
                          onClick={() =>
                            setSingleImageModal({
                              isOpen: true,
                              url: listData?.meta_tags_for_listings?.banner,
                              // id: pic?.id,
                              listingId: listData?.id,
                            })
                          }
                          src={listData?.meta_tags_for_listings?.banner}
                          alt={"banner"}
                          className="w-full h-[350px] object-cover m-1 rounded-md"
                        />
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className={`w-full py-5`}>
                      <div className="grid sm:grid-cols-1 md:grid-cols-2">
                        <div className="w-full p-1">
                          <div className="flex items-center">
                            <div
                              className={`bg-primary rounded-md text-white p-2 ${
                                isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                              } font-semibold`}
                            >
                              {listData?.listing_attribute_type?.price}
                            </div>
                            <h1
                              className={`text-lg font-bold mx-2 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                              style={{
                                fontFamily: isArabic(listData?.title)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {listData?.title}
                            </h1>
                          </div>
                        </div>
                        <div className="w-full p-1">
                          <div className="flex items-center gap-2 justify-end">
                            {/* EDIT DETAILS  */}
                            {/* <Tooltip title="Edit Listing Details" arrow>
                              <IconButton
                                className={`rounded-full bg-btn-primary`}
                                onClick={handleEdit}
                              >
                                <BsPen size={16} color={"#FFFFFF"} />
                              </IconButton>
                            </Tooltip> */}

                            {/* UPLOAD PICTURES  */}
                            {/* <Tooltip title="Upload Pictures" arrow>
                              <IconButton
                                onClick={() =>
                                  setSelectImagesModal({
                                    isOpen: true,
                                    listingId: lid,
                                  })
                                }
                                className={`rounded-full bg-btn-primary`}
                              >
                                <BsImages size={16} color={"#FFFFFF"} />
                              </IconButton>
                            </Tooltip> */}

                            {/* WATCH VIDEO  */}
                            {listData?.meta_tags_for_listings?.promo_video && (
                              <Tooltip title="Promo Video" arrow>
                                <IconButton
                                  onClick={() => {
                                    window.open(
                                      listData?.meta_tags_for_listings
                                        ?.promo_video,
                                      "_blank"
                                    );
                                  }}
                                  className={`rounded-full bg-btn-primary`}
                                >
                                  <IoIosVideocam size={16} color={"#FFFFFF"} />
                                </IconButton>
                              </Tooltip>
                            )}

                            <div className="mx-1"></div>

                            <div className="border border-primary p-2 font-semibold rounded-md shadow-sm">
                              {listData?.listing_attribute_type?.type}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                          {/* ADDRESS  */}
                          <div className="flex gap-3">
                            <TbCurrentLocation
                              size={18}
                              className={
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }
                            />
                            <h6>
                              {listData?.listing_attribute_type?.near_by}{" "}
                            </h6>
                          </div>
                          {/* Bedrooms  */}
                          <div className="flex gap-3">
                            <BiBed
                              size={18}
                              className={
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }
                            />
                            <h6>{listData?.listing_attribute?.bedroom}</h6>
                            <h6>
                              {listData?.listing_type === "null"
                                ? "-"
                                : listData?.listing_type?.name}
                            </h6>
                          </div>
                          {/* baths  */}
                          <div className="flex gap-3">
                            <BiBath
                              size={18}
                              className={
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }
                            />
                            <h6>
                              {listData?.listing_attribute?.bathroom === "null"
                                ? "-"
                                : listData?.listing_attribute?.bathroom}
                            </h6>
                          </div>
                        </div>

                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                          <div className="flex items-end justify-end h-full w-full">
                            <div className="text-right">
                              <p className="text-sm my-2">
                                Listing added on{" "}
                                {moment(listData?.created_at).format(
                                  "YYYY-MM-DD HH:MM"
                                )}
                              </p>
                              <p className="text-sm my-2 flex items-center">
                                <FaUserPlus
                                  size={16}
                                  color={`${
                                    currentMode === "dark"
                                      ? "#EEEEEE"
                                      : "#333333"
                                  }`}
                                  className="mx-2"
                                />
                                {listData?.user?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* IN MAP  */}

                    {listData?.latlong === null || listData?.latlong === "" ? (
                      <></>
                    ) : (
                      <div className="w-full h-[50vh] border border-primary">
                        {!load?.isLoaded ? (
                          <div>Your map is loading...</div>
                        ) : (
                          <GoogleMap
                            zoom={12}
                            center={{
                              lat: parseFloat(lat),
                              lng: parseFloat(long),
                            }}
                            mapContainerStyle={mapContainerStyle}
                            options={options}
                          >
                            <Marker
                              key={listData?.id}
                              position={{
                                lat: Number(parseFloat(lat)),
                                lng: Number(parseFloat(long)),
                              }}
                              icon={{
                                url: (
                                  <MdLocationPin size={30} color={"#DA1F26"} />
                                ),
                                scaledSize: window.google.maps
                                  ? new window.google.maps.Size(50, 50)
                                  : null,
                              }}
                            />
                          </GoogleMap>
                        )}
                      </div>
                    )}

                    {/* <div className="bg-primary h-0.5 w-full my-5"></div> */}

                    {(listData?.addedBy === User?.id ||
                      hasPermission("seller_details") ||
                      User.role === 1) && (
                      <div className={`w-full py-5`}>
                        <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5">
                          <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
                            <div className="w-full flex items-center pb-3">
                              <div
                                className={`bg-primary h-10 w-1 rounded-full ${
                                  isLangRTL(i18n.language) ? "ml-2" : "mr-2"
                                } my-1`}
                              ></div>
                              <h1
                                className={`text-lg font-semibold ${
                                  currentMode === "dark"
                                    ? "text-white"
                                    : "text-black"
                                }`}
                              >
                                {t("label_seller_details")}
                              </h1>
                            </div>

                            <div className="space-y-3">
                              {/* SELLER NAME  */}
                              <div className="flex gap-3">
                                <TbUserCircle
                                  size={18}
                                  className={
                                    currentMode === "dark"
                                      ? "text-[#EEEEEE]"
                                      : "text-[#333333]"
                                  }
                                />
                                <h6>{listData?.user?.name}</h6>
                              </div>
                              {/* SELLER CONTACT  */}
                              {/* <div className="flex gap-3">
                                <TbPhone
                                  size={18}
                                  className={
                                    currentMode === "dark"
                                      ? "text-[#EEEEEE]"
                                      : "text-[#333333]"
                                  }
                                />
                                <h6>{listData?.user?.phone}</h6>
                              </div> */}
                              {/* SELLER EMAIL  */}
                              <div className="flex gap-3">
                                <TbMail
                                  size={18}
                                  className={
                                    currentMode === "dark"
                                      ? "text-[#EEEEEE]"
                                      : "text-[#333333]"
                                  }
                                />
                                <h6>
                                  {listData?.user?.email === "null"
                                    ? ""
                                    : listData?.user?.email}
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 ">
                            {/* IMAGES */}
                            <div className={` rounded-xl shadow-sm p-4`}>
                              <div className="w-full flex items-center gap-x-1 mb-3 overflow-x-scroll">
                                {listData?.meta_tags_for_listings?.additional_gallery?.map(
                                  (pic) =>
                                    pic ? (
                                      <img
                                        onClick={() =>
                                          setSingleImageModal({
                                            isOpen: true,
                                            url: pic,

                                            listingId: listData?.id,
                                          })
                                        }
                                        src={pic}
                                        alt={pic}
                                        className="w-auto h-[200px] object-cover m-1 rounded-md cursor-pointer"
                                      />
                                    ) : (
                                      <></>
                                    )
                                )}
                              </div>
                              {/* )} */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* <Footer /> */}

                {singleImageModal?.isOpen && (
                  <SingleImageModal
                    singleImageModal={singleImageModal}
                    handleClose={() => setSingleImageModal({ isOpen: false })}
                    fetchSingleListing={fetchSingleListing}
                    listing="true"
                  />
                )}

                {singleDocModal?.isOpen && (
                  <SingleDocModal
                    singleImageModal={singleDocModal}
                    handleClose={() => setSingleDocModal({ isOpen: false })}
                    fetchSingleListing={fetchSingleListing}
                  />
                )}

                {selectImagesModal?.isOpen && (
                  <SelectImagesModal
                    fetchSingleListing={fetchSingleListing}
                    selectImagesModal={selectImagesModal}
                    handleClose={() => setSelectImagesModal({ isOpen: false })}
                  />
                )}
                {selectDocumentModal?.isOpen && (
                  <SelectDocumentModal
                    fetchSingleListing={fetchSingleListing}
                    selectDocumentModal={selectDocumentModal}
                    handleClose={() =>
                      setSelectDocumentModal({ isOpen: false })
                    }
                  />
                )}
                {openEdit && (
                  <EditListingModal
                    setOpenEdit={setOpenEdit}
                    openEdit={openEdit}
                    fetchSingleListing={fetchSingleListing}
                    handleClose={() => setOpenEdit(false)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default SingleListingsModal;
