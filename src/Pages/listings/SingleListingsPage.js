import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";

import { 
  BiBed, 
  BiBath
} from "react-icons/bi";
import {
  BsImages,
  BsFiles,
  BsPen,
  BsFileEarmarkText
} from "react-icons/bs";
import {
  FaUserPlus
} from "react-icons/fa";
import {
  TbCurrentLocation,
  TbPhone,
  TbMail,
  TbUserCircle,
} from "react-icons/tb";

const SingleListingsPage = () => {
  const [loading, setloading] = useState(true);
  const [listData, setListingData] = useState({});
  const [lastNote, setLastNote] = useState("");
  const [AddNoteTxt, setAddNoteTxt] = useState("");
  const [LeadNotesData, setLeadNotesData] = useState(null);
  const [leadNotFound, setLeadNotFound] = useState(false);
  const [addNoteloading, setaddNoteloading] = useState(false);
  const {
    currentMode,
    setopenBackDrop,
    User,
    BACKEND_URL,
    darkModeColors,
    isArabic,
  } = useStateContext();

  const static_img = "../assets/no-image.png";

  const { hasPermission } = usePermission();

  const { lid } = useParams();

  console.log("LID: ", lid);

  console.log("list data: ", listData);

  const fetchSingleLead = async () => {
    try {
      setloading(true);
      const token = localStorage.getItem("auth-token");
      const listing = await axios.get(`${BACKEND_URL}/listings/${lid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("SINGLE Listings: ", listing);
      setListingData(listing?.data?.data[0]);
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
    fetchSingleLead(lid);
  }, []);

  return (
    <>
      <div className={`flex min-h-screen w-full p-4 ${
              currentMode === "dark" ? "bg-black text-white" : "bg-white text-black"
            }`}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div className="w-full">
                {/* IMAGES  */}
                <div className="w-full flex items-center gap-x-1 mb-3overflow-x-scroll">
                  <img
                    src={static_img}
                    alt="secondary"
                    className="w-auto h-[200px] object-cover m-1 rounded-md"
                  />
                  <img
                    src={static_img}
                    alt="secondary"
                    className="w-auto h-[200px] object-cover m-1 rounded-md"
                  />
                  <img
                    src={static_img}
                    alt="secondary"
                    className="w-auto h-[200px] object-cover m-1 rounded-md"
                  />
                  <img
                    src={static_img}
                    alt="secondary"
                    className="w-auto h-[200px] object-cover m-1 rounded-md"
                  />
                </div>

                <div className="grid sm:grid-cols-1 md:grid-cols-2">
                  <div className="w-full p-2">
                    <div className="flex items-center">
                      <div className="bg-primary rounded-md text-white p-2 mr-2 font-semibold">
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
                  <div className="w-full p-2">
                    <div className="flex items-center gap-1 justify-end">
                      {/* EDIT DETAILS  */}
                      <Tooltip title="Edit Listing Details" arrow>
                        <IconButton className={`rounded-full`}>
                          <BsPen size={20} color={"#AAAAAA"}  />
                        </IconButton>
                      </Tooltip>

                      {/* UPLOAD PICTURES  */}
                      <Tooltip title="Upload Pictures" arrow>
                        <IconButton className={`rounded-full`}>
                          <BsImages size={20} color={"#AAAAAA"}  />
                        </IconButton>
                      </Tooltip>

                      {/* UPLOAD DOCUMENTS  */}
                      <Tooltip title="Upload Documents" arrow>
                        <IconButton className={`rounded-full`}>
                          <BsFiles size={20} color={"#AAAAAA"}  />
                        </IconButton>
                      </Tooltip>

                      <div className="mx-1"></div>

                      <div className="border border-primary p-2 font-semibold rounded-md shadow-sm">
                        {listData?.listing_type}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`${
                    currentMode === "dark" ? "text-[#CCCCCC]" : "text-[#1C1C1C]"
                  } p-2 text-base`}
                >
                  <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-5">
                    <div className="sm:col-span-1 md:col-span-3 lg:col-span-4 space-y-3">
                      {/* ADDRESS  */}
                      <div className="flex space-x-3">
                        <TbCurrentLocation size={18} className="mr-2 text-[#AAAAAA]" />
                        <h6>
                          {listData?.address}{" "}
                        </h6>
                      </div>
                      {/* Bedrooms  */}
                      <div className="flex space-x-3">
                        <BiBed size={18} className="mr-2 text-[#AAAAAA]" />
                        <h6>{listData?.bedrooms}</h6>
                        <h6>
                          {listData?.property_type === "null"
                            ? "-"
                            : listData?.property_type}
                        </h6>
                      </div>
                      {/* baths  */}
                      <div className="flex space-x-3">
                        <BiBath size={18} className="mr-2 text-[#AAAAAA]" />
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
                            <FaUserPlus size={16} color={"#AAAAAA"} className="mr-2" />
                            {listData?.addedBy_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IN MAP  */}

                  <div className="bg-primary h-0.5 w-full my-5"></div>

                  <div className="w-full p-2">
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
                            <TbUserCircle size={18} className="mr-2 text-[#AAAAAA]" />
                            <h6>{listData?.seller_name}</h6>
                          </div>
                          {/* SELLER CONTACT  */}
                          <div className="flex space-x-3">
                            <TbPhone size={18} className="mr-2 text-[#AAAAAA]" />
                            <h6>{listData?.seller_contact}</h6>
                          </div>
                          {/* SELLER EMAIL  */}
                          <div className="flex space-x-3">
                            <TbMail size={18} className="mr-2 text-[#AAAAAA]" />
                            <h6>
                              {listData?.seller_email === "null"
                                ? ""
                                : listData?.seller_email}
                            </h6>
                          </div>
                        </div>
                      </div>
                      <div className="sm:col-span-1 md:col-span-3 lg:col-span-4">
                        <div className={`${currentMode === "dark" ? "bg-[#1C1C1C]" : "bg-[#EEEEEE]"} rounded-md shadow-md p-5`}>
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

                          {listData?.documents === null ? (
                            <div className="text-primary italic">
                              No documents to show
                            </div>
                          ) : (
                            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 flex justify-center">
                              
                              <div className="p-2 flex items-center justify-center">
                                <div className="text-center">
                                  <BsFileEarmarkText size={70} color={"#AAAAAA"} />
                                  <div className="mt-3">Filename</div>
                                </div>
                              </div>

                              <div className="p-2 flex items-center justify-center">
                                <div className="text-center">
                                  <BsFileEarmarkText size={70} color={"#AAAAAA"} />
                                  <div className="mt-3">Filename</div>
                                </div>
                              </div>

                              <div className="p-2 flex items-center justify-center">
                                <div className="text-center">
                                  <BsFileEarmarkText size={70} color={"#AAAAAA"} />
                                  <div className="mt-3">Filename</div>
                                </div>
                              </div>

                              <div className="p-2 flex items-center justify-center">
                                <div className="text-center">
                                  <BsFileEarmarkText size={70} color={"#AAAAAA"} />
                                  <div className="mt-3">Filename</div>
                                </div>
                              </div>
                            </div>
                          )}
                          

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
    </>
  );
};

export default SingleListingsPage;
