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
import Error404 from "../Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { load } from "../App";

import { BiBed, BiBath } from "react-icons/bi";
import {
  BsImages,
  BsFiles,
  BsPen,
  BsFileEarmarkText,
  BsTrash,
} from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { MdLocationPin, MdClose, Md360 } from "react-icons/md";
import {
  TbCurrentLocation,
} from "react-icons/tb";import SingleImageModal from "../listings/SingleImageModal";
import SingleDocModal from "../listings/SingleDocModal";
import usePermission from "../../utils/usePermission";
import { FaMoneyBillWave } from "react-icons/fa";
import EditPropertyModal from "./EditPropertyModal";
import PropertyDocModal from "./PropertyDocumentUpload";
import PropertyImageUpload from "./PropertyImageUpload";
import View360Modal from "./view360";
import { datetimeLong } from "../../Components/_elements/formatDateTime";
import { enquiry_options } from "../../Components/_elements/SelectOptions";

const SinglePropertyModal = ({
  setOpenModal,
  openModal,
  FetchProperty,
  loading,
  setloading,
}) => {
  console.log("single property data::: ", openModal);
  let project = openModal?.project;
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
      setOpenModal({
        open: false,
      });
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
  const [view360Modal, setView360Modal] = useState({ open: false });
  const handleView360Modal = (data) => {
    setView360Modal({ open: true, project: data });
  };

  // TRANSLATED BEDS 
  const getBedLabel = (bedValue, t) => {
    const options = enquiry_options(t);
    const option = options.find((option) => option.value === bedValue);
    return option ? option.label : bedValue;
  };

  return (
    <>
      <Modal
        keepMounted
        open={openModal?.open}
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
          w-[100vw] h-[100vh] flex items-start justify-end`}
        >
          <button
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
            } p-4 h-[100vh] w-[80vw] overflow-y-scroll ${
              currentMode === "dark" &&
              (isLangRTL(i18n.language)
                ? "border-r-2 border-primary"
                : "border-l-2 border-primary")
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
                    <div className="w-full flex items-center pb-3">
                      <div className="bg-primary h-10 w-1 rounded-full mr-2 my-1"></div>
                      <h1
                        className={`text-lg font-semibold ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {project?.projectName}
                      </h1>
                    </div>
                    {/* IMAGES  */}
                    <div className="w-full flex items-center gap-x-1 mb-3 overflow-x-scroll">
                      {project?.images?.map((pic) =>
                        pic?.img_url ? (
                          <img
                            onClick={() =>
                              setSingleImageModal({
                                isOpen: true,
                                url: pic?.img_url,
                                id: pic?.id,
                                listingId: project?.id,
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

                    <div className="grid sm:grid-cols-1 md:grid-cols-2 w-full">
                      <div className="w-full">
                        <div className="flex items-center">
                          <div className="border-2 border-primary rounded-md p-2 mr-2 font-semibold">
                            {project?.projectStatus}
                          </div>
                          <h1
                            className={`text-base`}
                          >
                            {project?.price === "null" ? "-" : project?.price}
                          </h1>
                        </div>
                      </div>

                      <div className="w-full">
                        {hasPermission("property_upload_img_doc") && (
                          <div className="flex items-center gap-1 justify-end">
                            {/* UPLOAD IMAGE AND DOCUMENT  */}
                            <div className="min-w-fit flex justify-center items-center my-2 gap-3">
                              {/* UPLOAD IMAGE  */}
                              <Tooltip title="Upload Image(s)" arrow>
                                <IconButton
                                  className={`card-hover rounded-full bg-btn-primary`}
                                  onClick={() =>
                                    setSelectImagesModal({
                                      isOpen: true,
                                    })
                                  }
                                >
                                  <BsImages size={16} color={"#FFFFFF"} />
                                </IconButton>
                              </Tooltip>

                              {/* <label htmlFor="contained-button-file">
                                <Button
                                  variant="contained"
                                  size="lg"
                                  className="bg-main-red-color w-full bg-btn-primary  text-white rounded-lg py-3 border-primary font-semibold my-3"
                                  onClick={() =>
                                    setSelectImagesModal({
                                      isOpen: true,
                                    })
                                  }
                                  style={{
                                    // backgroundColor: "#111827",
                                    color: "#ffffff",
                                    // border: "1px solid #DA1F26",
                                  }}
                                  component="span"
                                  disabled={loading ? true : false}
                                  // startIcon={loading ? null : <MdFileUpload />}
                                >
                                  <span>{t("button_upload_image")}</span>
                                </Button>
                                <p className="text-primary mt-2 italic">
                                  {allImages?.length > 0
                                    ? `${allImages?.length} images selected.`
                                    : null}
                                </p>
                              </label> */}

                              {/* UPLOAD DOCUMENT  */}
                              <Tooltip title="Upload Document(s)" arrow>
                                <IconButton
                                  className={`card-hover rounded-full bg-btn-primary`}
                                  onClick={() => {
                                    setDocumentModal(true);
                                  }}
                                >
                                  <BsFiles size={16} color={"#FFFFFF"} />
                                </IconButton>
                              </Tooltip>

                              {/* <label htmlFor="contained-button-document">
                                <Button
                                  variant="contained"
                                  size="lg"
                                  className="min-w-fit bg-main-red-color border-primary w-full text-white rounded-lg py-3 bg-btn-primary font-semibold my-3"
                                  style={{
                                    color: "#ffffff",
                                  }}
                                  onClick={() => {
                                    setDocumentModal(true);
                                  }}
                                  component="span"
                                  disabled={loading ? true : false}
                                  // startIcon={loading ? null : <MdFileUpload />}
                                >
                                  <span>{t("button_upload_document")}</span>
                                </Button>
                                <p className="text-primary mt-2 italic">
                                  {allDocs?.length > 0
                                    ? `${allDocs?.length} documents selected.`
                                    : null}
                                </p>
                              </label> */}

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

                              {project?.tourlink !== null &&
                              project?.tourlink !== "" &&
                              project?.tourlink !== "undefined" &&
                              project?.tourlink !== "null" && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleView360Modal(project)
                                  }}
                                  className="bg-primary text-white rounded-md card-hover shadow-sm gap-2 px-3 py-2 flex items-center"
                                >
                                  <Md360 size={16} />
                                  <span className="text-sm uppercase">
                                    {t("360_view")}
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DETAILS  */}
                    <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                      <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                        {/* ADDRESS  */}
                        <div className="flex gap-4">
                          <TbCurrentLocation
                            size={18}
                            className={`${
                              currentMode === "dark"
                                ? "text-[#EEEEEE]"
                                : "text-[#333333]"
                            }`}
                          />
                          <h6 className="flex flex-wrap">
                            {project?.projectLocation} 
                          </h6>
                        </div>
                        {/* Bedrooms  */}
                        <div className="flex gap-4">
                          <BiBed
                            size={18}
                            className={`${
                              currentMode === "dark"
                                ? "text-[#EEEEEE]"
                                : "text-[#333333]"
                            }`}
                          />
                          <div className="flex flex-wrap gap-2">
                            {project?.bedrooms &&
                            project?.bedrooms !== null &&
                            project?.bedrooms.length > 0 &&
                            project?.bedrooms?.map((bed, index) => (
                              <div key={index}>
                                {getBedLabel(bed, t)}
                                {(project?.bedrooms.length - 1) !== index && ","}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                        <div className="flex items-end justify-end h-full w-full">
                          <div className="text-right">
                            <p className="text-sm my-2">
                              {t("project_added_on")}{" "}
                              {datetimeLong(project?.created_at)}
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

                    {/* IN MAP  */}
                    {project?.latLong === null || project?.latLong === "" ? (
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

                    {/* ESSENTIAL DOCUMENTS  */}
                    <div
                      className={`${
                        currentMode === "dark"
                          ? "bg-[#000000]"
                          : "bg-[#EEEEEE]"
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
                          {t("documents")}
                        </h1>
                      </div>

                      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 flex justify-center">
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
                            <div className="flex w-full justify-center">
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
                            </div>
                          ) : (
                            <div className="py-2 text-xs italic text-primary">
                              {t("nothing_to_show")}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {singleImageModal?.isOpen && (
                  <SingleImageModal
                    singleImageModal={singleImageModal}
                    handleClose={() => setSingleImageModal({ isOpen: false })}
                    FetchProperty={FetchProperty}
                    module="property"
                    closeSingleModal={() =>
                      setOpenModal({
                        open: false,
                      })
                    }
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
                  <PropertyImageUpload
                    selectImagesModal={selectImagesModal}
                    handleClose={() => setSelectImagesModal({ isOpen: false })}
                    allImages={allImages}
                    setAllImages={setAllImages}
                    update="update"
                    project={project}
                    FetchProperty={FetchProperty}
                  />
                )}
                {documentModal && (
                  <PropertyDocModal
                    documentModal={documentModal}
                    handleClose={() => setDocumentModal(false)}
                    allDocs={allDocs}
                    setAllDocs={setAllDocs}
                    project={project}
                    update="update"
                    FetchProperty={FetchProperty}
                  />
                )}
                {openEdit && (
                  <EditPropertyModal
                    setOpenEdit={setOpenEdit}
                    openEdit={project}
                    setOpenModal={setOpenModal}
                    handleClose={() => setOpenEdit(false)}
                    FetchProperty={FetchProperty}
                    closeSingleModal={() =>
                      setOpenModal({
                        open: false,
                      })
                    }
                  />
                )}
                
                {view360Modal?.open && (
                  <View360Modal
                    view360Modal={view360Modal}
                    setView360Modal={setView360Modal}
                    loading={loading}
                    setloading={setloading}
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

export default SinglePropertyModal;
