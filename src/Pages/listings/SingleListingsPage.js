import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  Tooltip,
  IconButton,
} from "@mui/material";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";

import { 
  BiMoney,
  BiBed, 
  BiBath,
} from "react-icons/bi";
import {
  BsImages,
  BsFiles,
  BsPen
} from "react-icons/bs";
import {
  TbCurrentLocation,
  TbPhone,
} from "react-icons/tb";

const SingleListingsPage = () => {
  const [loading, setloading] = useState(true);
  const [listData, setListingData] = useState({});
  const [leadNotFound, setLeadNotFound] = useState(false);
  const {
    currentMode,
    setopenBackDrop,
    BACKEND_URL,
    isArabic,
  } = useStateContext();

  const static_img = "../assets/no-image.png";

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
                <div className="w-full flex items-center gap-x-1 mb-3 overflow-x-scroll">
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

                <div className="w-full flex items-center justify-between p-2">
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
                  <div className="flex items-center gap-1">
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
                        <h6>{listData?.bedrooms + " Bedrooms"}</h6>
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
                            : listData?.bathrooms + "  Bathrooms"}
                        </h6>

                        <h6>
                          {listData?.leadFor === "null"
                            ? "-"
                            : listData?.leadFor}
                        </h6>
                      </div>

                      
                      {/* LEAD CONTACT  */}
                      <div className="flex space-x-3">
                        <TbPhone size={18} className="mr-2 text-[#AAAAAA]" />
                        <h6>{listData?.seller_contact}</h6>
                        <h6>
                          {listData?.seller_email === "null"
                            ? ""
                            : listData?.seller_email}
                        </h6>
                      </div>

                    </div>

                    <div className="sm:col-span-1 md:col-span-3 lg:col-span-2 space-y-2 text-right">
                      <div className="flex items-center justify-end space-x-3 mb-4">
                        <span className="border border-primary px-3 py-1 rounded-md font-semibold text-base">
                          {listData?.project ?? "?"}
                        </span>
                      </div>
                      <div className="flex justify-end items-center space-x-3 mr-3">
                        <BiMoney size={17} className="text-primary" />
                        <p className="text-sm">{listData?.price} AED</p>
                      </div>
                      <p className="text-sm">
                        List added on{" "}
                        {moment(listData?.created_at).format(
                          "YYYY-MM-DD HH:MM"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary h-0.5 w-full my-5"></div>

                  <div className="w-full p-2">
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
                  </div>
                  {/* <div>
                    <img
                      src={static_img}
                      alt="offer"
                      className="w-full h-[300px] object-cover"
                    />
                  </div> */}
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
