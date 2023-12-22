import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
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
import { FaUserPlus, FaPen } from "react-icons/fa";
import { MdLocationPin, MdClose } from "react-icons/md";
import {
  TbCurrentLocation,
  TbPhone,
  TbMail,
  TbUserCircle,
} from "react-icons/tb";
import { IoLocation } from "react-icons/io5";
import { FaUserAlt } from "react-icons/fa";

import {
  FaUser,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchat,
  FaLinkedin,
} from "react-icons/fa";
import { IoIosMail, IoLogoYoutube } from "react-icons/io";

import usePermission from "../../utils/usePermission";
import { FaMoneyBillWave } from "react-icons/fa";
import EditClient from "./EditClient";

const SingleClient = ({
  ListingData,
  setOpenModal,
  openModal,
  fetchCrmClients,
  client,
}) => {
  console.log("single property data::: ", openModal);
  console.log("single property data (client)::: ", client);
  const [singleClient, setSingleClient] = useState(client);

  const [loading, setloading] = useState(false);

  const social_links = [
    {
      name: "linkedin",
      icon: <FaLinkedin color="#0A66C2" size={14} />,
    },
    {
      name: "facebook",
      icon: <FaFacebookF color="#0866FF" size={14} />,
    },
    {
      name: "instagram",
      icon: <FaInstagram color="#C40FEC" size={14} />,
    },
    {
      name: "tiktok",
      icon: <FaTiktok color="#2CF5F0" size={14} />,
    },
    {
      name: "snapchat",
      icon: <FaSnapchat color="#FFFC09" size={14} />,
    },
    {
      name: "youtube",
      icon: <IoLogoYoutube color="#FE0808" size={14} />,
    },
  ];
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

  const openDoc = (open, url) => {
    window.open(url, "__blank");
  };

  let lat = "";
  let long = "";

  const handleDeleteDocument = async (id) => {
    setBtnLoading(true);
    try {
      const token = localStorage.getItem("auth-token");
      const data = new FormData();
      data.append("onboarding_id[0]", id);
      const deleteDoc = await axios.delete(
        `${BACKEND_URL}/onboarding/documents/${singleClient?.id}`,
        {
          params: data,
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

  useEffect(() => {
    setopenBackDrop(false);
    if (allDocs?.length > 0 || allImages?.length > 0) {
      handleClose();
      FetchProperty();
    }
    // fetchSingleListing(lid);
  }, []);

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
                    <div className="w-full flex justify-between items-center pb-3">
                      <div className="flex items-center">
                        <h1
                          className={`text-lg font-semibold ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          } bg-primary py-2 px-5`}
                        >
                          {singleClient?.account_type || "-"}
                        </h1>
                        <h1
                          className={`text-lg font-semibold ${
                            currentMode === "dark" ? "text-white" : "text-black"
                          } ml-2`}
                        >
                          {singleClient?.bussiness_name || "-"}
                        </h1>
                      </div>
                      <div className="bg-primary rounded-full p-1">
                        <IconButton onClick={() => setOpenEdit(true)}>
                          <FaPen
                            className={`${
                              currentMode === "dark"
                                ? "text-white"
                                : "text-dark"
                            }`}
                          />
                        </IconButton>
                      </div>
                    </div>

                    {/* business details */}

                    <div
                      className={`rounded-xl w-full  my-3 border border-[#eeeeee] `}
                    >
                      <div
                        className={`grid sm:grid-cols-1 md:grid-cols-2 bg-primary ${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#eeeeee]"
                        } p-3  `}
                      >
                        <div className="w-full p-1">
                          <div className="flex items-center">
                            <h1
                              className={`text-lg font-bold mr-2 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                              style={{
                                fontFamily: isArabic(
                                  singleClient?.bussiness_name
                                )
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {t("business_details")}
                            </h1>
                          </div>
                        </div>
                        <div className="w-full p-1">
                          <div className="flex items-center gap-1 justify-end space-x-2">
                            {social_links?.map(
                              (social) =>
                                singleClient[social?.name] && (
                                  <span
                                    key={social?.name}
                                    className={`p-3 border rounded rounded-full ${
                                      currentMode === "dark"
                                        ? "border-[#fff]"
                                        : "border-[#000]"
                                    } cursor-pointer `}
                                    onClick={() =>
                                      window.open(
                                        singleClient[social?.name],
                                        "_blank"
                                      )
                                    }
                                  >
                                    {social?.icon}
                                  </span>
                                )
                            )}

                            <div className="mx-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                          {/* ADDRESS  */}
                          <div className="flex space-x-3">
                            <IoLocation
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            <h6>{singleClient?.country} </h6>
                          </div>
                          {/* no of users  */}
                          <div className="flex space-x-3">
                            <FaUserAlt
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            <h6>{singleClient?.name_of_person} </h6>
                          </div>
                          {/* contact  */}
                          <div className="flex space-x-3">
                            <FaPhone
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            <h6>{singleClient?.contact}</h6>
                          </div>
                          {/* email  */}
                          <div className="flex space-x-3">
                            <IoIosMail
                              size={18}
                              className={`mr-2 ${
                                currentMode === "dark"
                                  ? "text-[#EEEEEE]"
                                  : "text-[#333333]"
                              }`}
                            />
                            <h6>{singleClient?.email}</h6>
                          </div>
                        </div>

                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                          <div className="flex items-end justify-end h-full w-full">
                            {singleClient?.logo && (
                              <img src={singleClient?.logo} />
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          {singleClient?.documents?.length > 0 &&
                            singleClient?.documents?.map((l) => {
                              return (
                                <div
                                  key={l?.id}
                                  className="relative w-min mr-4 "
                                >
                                  <div
                                    onClick={() => {
                                      window.open(l?.doc_url, "_blank");
                                    }}
                                    className="p-2  flex items-center justify-center hover:cursor-pointer space-x-5 "
                                  >
                                    <a
                                      href={l?.doc_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <div className="w-full text-center ">
                                        <div className="w-full flex justify-center">
                                          <BsFileEarmarkText
                                            size={70}
                                            color={"#AAAAAA"}
                                            className="hover:-mt-1 hover:mb-1"
                                          />
                                        </div>
                                        <div className="my-3 ">
                                          {l?.doc_name}
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                  <div className="absolute top-0 -right-4 p-1 cursor-pointer">
                                    <IconButton
                                      className="bg-btn-primary"
                                      onClick={() =>
                                        handleDeleteDocument(l?.id)
                                      }
                                      disabled={loading}
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
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    {/* subscription details */}
                    <div
                      className={`rounded-xl w-full  my-3 border border-[#eeeeee] `}
                    >
                      <div
                        className={`grid sm:grid-cols-1 md:grid-cols-2 bg-primary ${
                          currentMode === "dark"
                            ? "bg-[#000000]"
                            : "bg-[#eeeeee]"
                        } p-3  `}
                      >
                        <div className="w-full p-1">
                          <div className="flex items-center">
                            <h1
                              className={`text-lg font-bold mr-2 ${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                              style={{
                                fontFamily: isArabic(
                                  singleClient?.bussiness_name
                                )
                                  ? "Noto Kufi Arabic"
                                  : "inherit",
                              }}
                            >
                              {t("subscription_details")}
                            </h1>
                          </div>
                        </div>
                        <div className="w-full p-1"></div>
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                          {/* number of users  */}
                          <div className="flex space-x-3">
                            <h6 className="">
                              {t("form_account_usersList")}:{" "}
                            </h6>
                            <h6 className="">{singleClient?.no_of_users} </h6>
                          </div>
                          {/* payment type  */}
                          <div className="flex space-x-3">
                            <h6>{t("payment_duration")}: </h6>
                            <h6>{singleClient?.payment_duration} </h6>
                          </div>
                        </div>

                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                          <div className="flex items-end justify-end h-full w-full">
                            <div className="flex space-x-3">
                              <h6>{t("registered_on")}: </h6>
                              <h6>
                                {moment(singleClient?.created_at).format(
                                  "YYYY-MM-DD HH:MM"
                                )}{" "}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* <Footer /> */}
              </>
            )}
          </div>
          {openEdit && (
            <EditClient
              openEdit={openEdit}
              setOpenEdit={setOpenEdit}
              client={client}
              loading={loading}
              setloading={setloading}
              singleClient={singleClient}
              setSingleClient={setSingleClient}
              fetchCrmClients={fetchCrmClients}
            />
          )}
        </div>
      </Modal>
      {/* </div> */}
    </>
  );
};

export default SingleClient;
