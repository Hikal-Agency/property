import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  Box,
  TextField,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import axios from "../../axoisConfig";
import Error404 from "../Error";
import usePermission from "../../utils/usePermission";
import { useStateContext } from "../../context/ContextProvider";
import Loader from "../../Components/Loader";
import { BiBed, BiBath } from "react-icons/bi";

import { BiImport, BiMessageRoundedDots, BiArchive } from "react-icons/bi";
import {
  BsSnow2,
  BsPatchQuestion,
  BsFire,
  BsSun,
  BsPersonCircle,
} from "react-icons/bs";
import {
  FaSnapchatGhost,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaWhatsapp,
  FaTwitter,
  FaRegComments,
  FaUser,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiLink } from "react-icons/fi";
import { GiMagnifyingGlass } from "react-icons/gi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { BiMoney } from "react-icons/bi";
import { MdCampaign } from "react-icons/md";
import {
  TbLanguage,
  TbPhone,
  TbBuildingCommunity,
  TbWorldWww,
} from "react-icons/tb";
import moment from "moment";

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

  const static_img = "/assets/list-static-img.jpg";

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

  const sourceIcons = {
    "campaign snapchat": () => <FaSnapchatGhost size={16} color={"#f6d80a"} />,

    "campaign facebook": () => <FaFacebookF size={16} color={"#0e82e1"} />,

    "campaign tiktok": () => (
      <FaTiktok
        size={16}
        color={`${currentMode === "dark" ? "#ffffff" : "#000000"}`}
      />
    ),

    "campaign googleads": () => <FcGoogle size={16} />,

    "campaign youtube": () => <FaYoutube size={16} color={"#FF0000"} />,

    "campaign twitter": () => <FaTwitter size={16} color={"#00acee"} />,

    "bulk import": () => <BiImport size={16} className="text-primary" />,

    "property finder": () => <GiMagnifyingGlass size={16} color={"#ef5e4e"} />,

    campaign: () => <MdCampaign size={16} color={"#696969"} />,

    cold: () => <BsSnow2 size={16} color={"#0ec7ff"} />,

    personal: () => <BsPersonCircle size={16} color={"#6C7A89"} />,

    whatsapp: () => <FaWhatsapp size={16} color={"#53cc60"} />,

    message: () => <BiMessageRoundedDots size={16} color={"#6A5ACD"} />,

    comment: () => <FaRegComments size={16} color={"#a9b3c6"} />,

    website: () => <TbWorldWww size={16} color={"#AED6F1"} />,

    self: () => <FaUser size={16} color={"#6C7A89"} />,
  };

  return (
    <>
      <div className="flex min-h-screen mt-3">
        {loading ? (
          <Loader />
        ) : (
          <div
            className={`w-full pl-3 pb-5 ${
              currentMode === "dark" ? "bg-black" : "bg-white"
            }`}
          >
            {leadNotFound ? (
              <Error404 />
            ) : (
              <div>
                <div className="w-full flex items-center mt-5">
                  {/* <div className="bg-[#DA1F26] h-10 w-1 rounded-full mr-2 my-1"></div> */}
                  <span className="text-sm font-bold tracking-wide bg-primary text-white px-2 py-1 mr-2 rounded-sm my-auto">
                    <span>{listData?.id}</span>
                  </span>
                  <h1
                    className={`text-lg font-bold mr-2 ${
                      currentMode === "dark" ? "text-white" : "text-black"
                    }`}
                    style={{
                      fontFamily: isArabic(listData?.seller_name)
                        ? "Noto Kufi Arabic"
                        : "inherit",
                    }}
                  >
                    {listData?.seller_name}
                  </h1>
                </div>

                {/* Lead Info */}
                <div
                  className={`${
                    currentMode === "dark" ? "text-[#CCCCCC]" : "text-[#1C1C1C]"
                  } px-3 text-base`}
                >
                  <div className="grid sm:grid-cols-1 md:grid-cols-5 mt-5 gap-5">
                    <div className="sm:col-span-1 md:col-span-3 space-y-3 font-semibold">
                      {/* LEAD CONTACT  */}
                      <div className="flex space-x-3">
                        <TbPhone size={17} className="mr-2 text-primary" />
                        <h6>{listData?.seller_contact}</h6>
                        <h6>
                          {listData?.seller_email === "null"
                            ? ""
                            : listData?.seller_email}
                        </h6>
                      </div>
                      {/* Bedrooms  */}
                      <div className="flex space-x-3">
                        <BiBed className="text-primary mr-2" size={17} />
                        <h6>{listData?.bedrooms + " Bedrooms"}</h6>
                        <h6>
                          {listData?.property_type === "null"
                            ? "-"
                            : listData?.property_type}
                        </h6>
                      </div>
                      {/* baths  */}
                      <div className="flex space-x-3">
                        <BiBath size={17} className="mr-2 text-primary" />
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
                    </div>

                    <div className="sm:col-span-1 md:col-span-2 space-y-2 text-right">
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
                  <div className="bg-primary h-0.5 w-full my-7"></div>
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
          </div>
        )}
      </div>
    </>
  );
};

export default SingleListingsPage;
