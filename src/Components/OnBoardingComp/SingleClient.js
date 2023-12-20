import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  Tooltip,
  IconButton,
  Modal,
  Backdrop,
  CircularProgress,
  Button,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";

import axios from "../../axoisConfig";
import Error404 from "../../Pages/Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../../Pages/App";

import { BiBed, BiBath } from "react-icons/bi";
import {
  BsImages,
  BsFiles,
  BsPen,
  BsFileEarmarkText,
  BsTrash,
} from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdLocationPin, MdClose } from "react-icons/md";
import {
  TbCurrentLocation,
  TbPhone,
  TbMail,
  TbUserCircle,
} from "react-icons/tb";

import usePermission from "../../utils/usePermission";
import { FaMoneyBillWave } from "react-icons/fa";

const SingleClient = ({
  ListingData,
  setOpenModal,
  openModal,
  FetchProperty,
  loading,
  setloading,
  client,
}) => {
  console.log("single property data::: ", openModal);
  let project = client;
  // const [loading, setloading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
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

  const [selectDocumentModal, setSelectDocumentModal] = useState({
    isOpen: false,
    listingId: null,
  });

  const [documentModal, setDocumentModal] = useState(false);

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });
  const [allDocs, setAllDocs] = useState([]);
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
  const [allImages, setAllImages] = useState([]);

  const [isClosing, setIsClosing] = useState(false);
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenModal(false);
    }, 1000);
  };

  const handleEdit = () => {
    setOpenEdit(listData);

    // setTimeout(() => {
    //   setIsClosing(false);
    //   setOpenModal({
    //     open: false,
    //   });
    // }, 1000);
  };
  // const { lid } = useParams();
  const lid = project?.id;
  console.log("lid ===================", lid);

  const openDoc = (open, url) => {
    window.open(url, "__blank");
  };

  let lat = "";
  let long = "";

  const handleDeleteDocument = async (id) => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const deleteDoc = await axios.delete(
        `${BACKEND_URL}/destroy/documents/${project?.id}`,
        {
          params: {
            document_id: id,
          },
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      toast.success("Document deleted successfully.", {
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
      handleClose();
      FetchProperty();
    } catch (error) {
      setBtnLoading(false);
      console.log("Error", error);

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
  };
  const fetchSingleListing = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const listing = await axios.get(`${BACKEND_URL}/projects/${lid}`, {
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
    if (allDocs?.length > 0 || allImages?.length > 0) {
      handleClose();
      FetchProperty();
    }
    // fetchSingleListing(lid);
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

  const latLongString = project?.latLong;
  if (latLongString) {
    const [latValue, longValue] = latLongString.split(",");
    lat = latValue;
    long = longValue;
  }

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
        open={openModal}
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
                    <div className="w-full flex items-center pb-3">
                      <h1
                        className={`text-lg font-semibold ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } bg-primary py-2 px-5`}
                      >
                        {client?.account_type || "-"}
                      </h1>
                      <h1
                        className={`text-lg font-semibold ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        } ml-2`}
                      >
                        {client?.bussiness_name || "-"}
                      </h1>
                    </div>

                    <div
                      className={`${
                        currentMode === "dark" ? "bg-[#000000]" : "bg-[#EEEEEE]"
                      } rounded-xl w-full p-4 mb-3`}
                    >
                      <div className="grid sm:grid-cols-1 md:grid-cols-2">
                        <div className="w-full p-1">
                          <div className="flex items-center">
                            <div className="bg-primary rounded-lg text-white p-2 mr-2 font-semibold">
                              {/* {project?.price} */}
                            </div>
                            <h1
                              className={`text-lg font-bold mr-2 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                              style={{
                                fontFamily: isArabic(project?.projectName)
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {project?.projectStatus}
                            </h1>
                          </div>
                        </div>
                        <div className="w-full p-1">
                          {hasPermission("property_upload_img_doc") && (
                            <div className="flex items-center gap-1 justify-end">
                              {/* UPLOAD IMAGE AND DOCUMENT  */}

                              {/* EDIT DETAILS  */}
                              {hasPermission("property_update_dev_project") && (
                                <Tooltip title="Edit Listing Details" arrow>
                                  <IconButton
                                    className={`rounded-full bg-btn-primary`}
                                    onClick={handleEdit}
                                  >
                                    <BsPen size={16} color={"#FFFFFF"} />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <div className="mx-1"></div>

                              {project?.tourlink && (
                                <div className="border border-primary p-2 font-semibold rounded-md shadow-sm cursor-pointer">
                                  <a
                                    href={project?.tourlink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    360 view
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                          {/* ADDRESS  */}
                          <div className="flex space-x-3">
                            <TbCurrentLocation
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            <h6>{project?.projectLocation} </h6>
                          </div>
                          {/* Bedrooms  */}
                          <div className="flex space-x-3">
                            <BiBed
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            {project?.bedrooms &&
                              project?.bedrooms?.map((bed) => <h6>{bed} </h6>)}
                          </div>
                          {/* baths  */}
                          <div className="flex space-x-3">
                            <FaMoneyBillWave
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            <h6>
                              {project?.price === "null" ? "-" : project?.price}
                            </h6>
                          </div>
                        </div>

                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                          <div className="flex items-end justify-end h-full w-full">
                            <div className="text-right">
                              <p className="text-sm my-2">
                                Project added on{" "}
                                {moment(project?.created_at).format(
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
                                  className="mr-2"
                                />
                                {openModal?.developer?.developerName}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="bg-primary h-0.5 w-full my-5"></div> */}

                    {(project?.addedBy === User?.id ||
                      hasPermission("seller_details") ||
                      User.role === 1) && (
                      <div
                        className={`${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#EEEEEE]"
                        } rounded-xl w-full p-4`}
                      >
                        <div className="w-full">
                          {/* <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5"> */}
                          <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 ">
                            <div
                              className={`${
                                currentMode === "dark"
                                  ? "bg-[#1C1C1C]"
                                  : "bg-[#FFFFFF]"
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
                                  Essential Document
                                </h1>
                              </div>

                              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 flex justify-center">
                                {project?.documents?.map((l) => {
                                  return l?.doc_url ? (
                                    // <div
                                    //   onClick={() =>
                                    //     setSingleDocModal({
                                    //       isOpen: true,
                                    //       url: l?.doc_url,
                                    //       id: l?.id,
                                    //     })
                                    //   }
                                    //   className="p-2 flex items-center justify-center hover:cursor-pointer"
                                    //   // hover:rounded-full hover:shadow-lg
                                    // >
                                    //   <div className="w-full text-center ">
                                    //     <div className="w-full flex justify-center">
                                    //       <BsFileEarmarkText
                                    //         size={70}
                                    //         color={"#AAAAAA"}
                                    //         className="hover:-mt-1 hover:mb-1"
                                    //       />
                                    //     </div>
                                    //     <div className="my-3">
                                    //       {l?.doc_name}
                                    //     </div>
                                    //   </div>
                                    // </div>
                                    <div className="relative w-min">
                                      <div
                                        onClick={() => {
                                          window.open(l?.doc_url, "_blank");
                                        }}
                                        className="p-2 flex items-center justify-center hover:cursor-pointer"
                                      >
                                        <a
                                          href={l?.doc_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <div className="w-full text-center">
                                            <div className="w-full flex justify-center">
                                              <BsFileEarmarkText
                                                size={70}
                                                color={"#AAAAAA"}
                                                className="hover:-mt-1 hover:mb-1"
                                              />
                                            </div>
                                            <div className="my-3">
                                              {l?.doc_name}
                                            </div>
                                          </div>
                                        </a>
                                      </div>
                                      {hasPermission("property_delete_doc") && (
                                        <div className="absolute top-0 -right-4 p-1 cursor-pointer">
                                          <IconButton
                                            className="bg-btn-primary"
                                            onClick={() =>
                                              handleDeleteDocument(l?.id)
                                            }
                                          >
                                            {btnLoading ? (
                                              <CircularProgress />
                                            ) : (
                                              <BsTrash
                                                size={20}
                                                color={
                                                  currentMode === "dark"
                                                    ? "#ffffff"
                                                    : "#000000"
                                                }
                                              />
                                            )}
                                          </IconButton>
                                        </div>
                                      )}
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
                          {/* </div> */}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* <Footer /> */}
              </>
            )}
          </div>
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default SingleClient;
