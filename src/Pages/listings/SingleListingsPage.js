import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Tooltip, IconButton } from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../App";

import { BiBed, BiBath } from "react-icons/bi";
import { BsImages, BsFiles, BsPen, BsFileEarmarkText } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdLocationPin } from "react-icons/md";
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

const SingleListingsPage = () => {
  const [loading, setloading] = useState(true);
  const [listData, setListingData] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [leadNotFound, setLeadNotFound] = useState(false);
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
  const { currentMode, setopenBackDrop, BACKEND_URL, isArabic, themeBgImg } =
    useStateContext();

  const handleEdit = () => {
    setOpenEdit(listData);
  };

  const { lid } = useParams();

  let lat = "";
  let long = "";

  const fetchSingleListing = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const listing = await axios.get(`${BACKEND_URL}/listings?id=${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("SINGLE Listings: ", listing);
      setListingData(listing?.data?.data?.data[0]);
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

  const latLongString = listData?.latlong;
  if (latLongString) {
    const [latValue, longValue] = latLongString.split(",");
    lat = latValue;
    long = longValue;
  }

  console.log("maps: ", load);

  return (
    <>
      <div
        className={`flex min-h-screen w-full p-4 ${
          !themeBgImg && (currentMode === "dark" ? "bg-black" : "bg-white")
        } ${
          currentMode === "dark" ? "text-white" : "text-black"
        }`}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div className="w-full">
                {/* IMAGES  */}
                <div className="w-full flex items-center gap-x-1 mb-3 overflow-x-scroll">
                  {listData?.images?.map((pic) =>
                    pic?.img_url ? (
                      <img
                        onClick={() =>
                          setSingleImageModal({
                            isOpen: true,
                            url: pic?.img_url,
                            id: pic?.id,
                            listingId: listData?.id,
                          })
                        }
                        src={pic?.img_url}
                        alt={pic?.img_alt}
                        className="w-auto h-[200px] object-cover m-1 rounded-md"
                      />
                    ) : (
                      <></>
                    )
                  )}
                </div>
                
                <div className={`${
                  themeBgImg && (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                } rounded-xl w-full p-4`}>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2">
                    <div className="w-full p-1">
                      <div className="flex items-center">
                        <div className="bg-primary rounded-lg text-white p-2 mr-2 font-semibold">
                          {listData?.price}
                        </div>
                        <h1
                          className={`text-lg font-bold mr-2 ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          }`}
                          style={{
                            fontFamily: isArabic(listData?.project)
                              ? "Noto Kufi Arabic"
                              : "inherit",
                          }}
                        >
                          {listData?.project}
                        </h1>
                      </div>
                    </div>
                    <div className="w-full p-1">
                      <div className="flex items-center gap-1 justify-end">
                        {/* EDIT DETAILS  */}
                        <Tooltip title="Edit Listing Details" arrow>
                          <IconButton
                            className={`rounded-full bg-btn-primary`}
                            onClick={handleEdit}
                          >
                            <BsPen size={16} color={"#FFFFFF"} />
                          </IconButton>
                        </Tooltip>

                        {/* UPLOAD PICTURES  */}
                        <Tooltip title="Upload Pictures" arrow>
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
                        </Tooltip>

                        {/* UPLOAD DOCUMENTS  */}
                        <Tooltip title="Upload Documents" arrow>
                          <IconButton
                            onClick={() =>
                              setSelectDocumentModal({
                                isOpen: true,
                                listingId: lid,
                              })
                            }
                            className={`rounded-full bg-btn-primary`}
                          >
                            <BsFiles size={16} color={"#FFFFFF"} />
                          </IconButton>
                        </Tooltip>

                        <div className="mx-1"></div>

                        <div className="border border-primary p-2 font-semibold rounded-md shadow-sm">
                          {listData?.listing_type}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                    <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                      {/* ADDRESS  */}
                      <div className="flex space-x-3">
                        <TbCurrentLocation
                          size={18}
                          className={`mr-2 ${currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#333333]"}`}
                        />
                        <h6>{listData?.address} </h6>
                      </div>
                      {/* Bedrooms  */}
                      <div className="flex space-x-3">
                        <BiBed size={18} className={`mr-2 ${currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#333333]"}`} />
                        <h6>{listData?.bedrooms}</h6>
                        <h6>
                          {listData?.property_type === "null"
                            ? "-"
                            : listData?.property_type}
                        </h6>
                      </div>
                      {/* baths  */}
                      <div className="flex space-x-3">
                        <BiBath size={18} className={`mr-2 ${currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#333333]"}`} />
                        <h6>
                          {listData?.bathrooms === "null"
                            ? "-"
                            : listData?.bathrooms}
                        </h6>

                        <h6>
                          {listData?.leadFor === "null"
                            ? "-"
                            : listData?.leadFor}
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
                              color={`${currentMode === "dark" ? "#EEEEEE" : "#333333"}`}
                              className="mr-2"
                            />
                            {listData?.addedBy_name}
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
                  <div className="w-full my-5 h-[50vh] border border-primary">
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

                <div className={`${
                  themeBgImg && (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
                } rounded-xl w-full p-4`}>
                  <div className="w-full">
                    <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5">
                      <div className="sm:col-span-1 md:col-span-3 lg:col-span-2">
                        <div className="w-full flex items-center pb-3">
                          <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                          <h1
                            className={`text-lg font-semibold ${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-black"
                            }`}
                          >
                            Seller details
                          </h1>
                        </div>

                        <div className="space-y-3">
                          {/* SELLER NAME  */}
                          <div className="flex space-x-3">
                            <TbUserCircle
                              size={18}
                              className={`mr-2 ${currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#333333]"}`}
                            />
                            <h6>{listData?.seller_name}</h6>
                          </div>
                          {/* SELLER CONTACT  */}
                          <div className="flex space-x-3">
                            <TbPhone
                              size={18}
                              className={`mr-2 ${currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#333333]"}`}
                            />
                            <h6>{listData?.seller_contact}</h6>
                          </div>
                          {/* SELLER EMAIL  */}
                          <div className="flex space-x-3">
                            <TbMail size={18} className={`mr-2 ${currentMode === "dark" ? "text-[#EEEEEE]" : "text-[#333333]"}`} />
                            <h6>
                              {listData?.seller_email === "null"
                                ? ""
                                : listData?.seller_email}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 ">
                        <div
                          className={`${
                            !themeBgImg ? (currentMode === "dark"
                              ? "bg-[#1C1C1C]"
                              : "bg-[#EEEEEE]")
                            : (
                              currentMode === "dark"
                              ? "blur-bg-dark"
                              : "blur-bg-light"
                            )
                          } rounded-xl shadow-sm p-4`}
                        >
                          <div className="w-full flex items-center pb-3">
                            <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                            <h1
                              className={`text-lg font-semibold ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            >
                              Essential Documents
                            </h1>
                          </div>

                          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 flex justify-center">
                            {listData?.documents?.map((l) => {
                              return l?.doc_url ? (
                                <div
                                  onClick={() =>
                                    setSingleDocModal({
                                      isOpen: true,
                                      url: l?.doc_url,
                                      id: l?.id,
                                    })
                                  }
                                  className="p-2 flex items-center justify-center hover:cursor-pointer"
                                  // hover:rounded-full hover:shadow-lg
                                >
                                  <div className="w-full text-center ">
                                    <div className="w-full flex justify-center">
                                      <BsFileEarmarkText
                                        size={70}
                                        color={"#AAAAAA"}
                                        className="hover:-mt-1 hover:mb-1"
                                      />
                                    </div>
                                    <div className="my-3">{l?.doc_name}</div>
                                  </div>
                                </div>
                              ) : (
                                <div className="py-2 text-xs italic text-primary">
                                  No documents to show
                                </div>
                              );
                            })}
                          </div>
                          {/* )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <Footer /> */}

            {singleImageModal?.isOpen && (
              <SingleImageModal
                singleImageModal={singleImageModal}
                handleClose={() => setSingleImageModal({ isOpen: false })}
                fetchSingleListing={fetchSingleListing}
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
                handleClose={() => setSelectDocumentModal({ isOpen: false })}
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
    </>
  );
};

export default SingleListingsPage;
