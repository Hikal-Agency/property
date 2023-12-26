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

import { MdClose } from "react-icons/md";
import { 
  BsFileEarmarkText,
  BsTrash,
  BsPencil,
  BsPinMap,
  BsPerson,
  BsTelephone,
  BsEnvelopeAt
} from "react-icons/bs";

import {
  FaYoutube,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
  FaLinkedin,
} from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";

import usePermission from "../../utils/usePermission";
import { FaMoneyBillWave } from "react-icons/fa";
import EditClient from "./EditClient";

const SingleClient = ({
  setOpenModal,
  openModal,
  fetchCrmClients,
  client,
}) => {
  
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
      icon: <FaTiktok color={currentMode === "dark" ? "#FFF" : "#000"} size={14} />,
    },
    {
      name: "snapchat",
      icon: <FaSnapchatGhost color="#f7d100" size={14} />,
    },
    {
      name: "youtube",
      icon: <FaYoutube color="#FE0808" size={14} />,
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
      const data = {
        documnet_id: id,
      };

      const deleteDoc = await axios.post(
        `${BACKEND_URL}/onboarding/documents/${singleClient?.id}`,
        data,
        {
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
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            } p-4 h-[100vh] w-[80vw] overflow-y-scroll `}
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
                      <div className="flex items-center gap-3">
                        <h1
                          className={`font-semibold text-white bg-primary py-2 px-3 rounded-md`}
                        >
                          {singleClient?.account_type || "-"}
                        </h1>
                        <h1
                          className={`text-lg font-semibold capitalize`}
                        >
                          {singleClient?.bussiness_name || "-"}
                        </h1>
                      </div>
                      <button 
                        onClick={() => setOpenEdit(true)}
                        className="bg-primary rounded-full p-2"
                      >
                        <BsPencil
                          size={16}
                          color={"#FFF"}
                        />
                      </button>
                    </div>

                    {/* business details */}

                    <div
                      className={`rounded-xl w-full my-3 shadow-sm ${
                        currentMode === "dark" ? "bg-black" : "bg-[#EEEEEE]"
                      }`}
                    >
                      <div
                        className={`rounded-t-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 bg-primary p-2 px-4`}
                      >
                        <div className="flex items-center font-semibold">
                          {t("business_details")}
                        </div>
                        
                        <div className="flex items-center gap-2 justify-end">
                          {social_links?.map(
                            (social) =>
                              singleClient[social?.name] && (
                                <span
                                  key={social?.name}
                                  className={`p-2 border border-[#AAA] rounded rounded-full ${
                                    currentMode === "dark"
                                      ? "bg-[#000]"
                                      : "bg-[#FFF]"
                                  } cursor-pointer`}
                                >
                                  {social?.icon}
                                </span>
                              )
                          )}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 space-x-5 p-4">
                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 flex flex-col gap-3">
                          {/* ADDRESS  */}
                          <div className="flex gap-3">
                            <BsPinMap
                              size={16}
                            />
                            <h6>{singleClient?.country} </h6>
                          </div>
                          {/* no of users  */}
                          <div className="flex gap-3">
                            <BsPerson
                              size={16}
                            />
                            <h6>{singleClient?.name_of_person} </h6>
                          </div>
                          {/* contact  */}
                          <div className="flex gap-3">
                            <BsTelephone
                              size={16}
                            />
                            <h6>{singleClient?.contact}</h6>
                          </div>
                          {/* email  */}
                          <div className="flex gap-3">
                            <BsEnvelopeAt
                              size={16}
                            />
                            <h6>{singleClient?.email}</h6>
                          </div>
                        </div>

                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                          <div className="flex items-end justify-end h-min w-full rounded-md">
                            {singleClient?.logo_url && (
                              <img
                                src={singleClient?.logo_url}
                                width="150px"
                                className="rounded-md"
                              />
                            )}
                          </div>
                        </div>

                        <div className="flex pt-5 w-full">
                          {singleClient?.documents?.length > 0 &&
                            singleClient?.documents?.map((l) => {
                              return (
                                <div
                                  key={l?.id}
                                  className="relative w-min mx-3"
                                >
                                  <div
                                    onClick={() => {
                                      window.open(l?.doc_url, "_blank");
                                    }}
                                    className="p-2 flex items-center justify-center hover:cursor-pointer space-x-5 "
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
                      className={`rounded-xl w-full my-3 ${
                        currentMode === "dark" ? "bg-black text-white" : "bg-[#EEEEEE] text-black"
                      }`}
                    >
                      <div
                        className={`w-full flex rounded-t-xl bg-primary text-white p-2 px-4`}
                      >
                        <div className="flex items-center font-semibold">
                          {t("subscription_details")}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5 p-4">
                        <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3 capitalize">
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
