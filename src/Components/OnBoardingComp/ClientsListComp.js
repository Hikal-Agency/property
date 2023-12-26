import { Card } from "@mui/material";
import React, { useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import {
  FaUser,
  FaPhone,
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaSnapchatGhost,
  FaLinkedin,
} from "react-icons/fa";
import {
  BsPerson,
  BsTelephone,
  BsEnvelopeAt
} from "react-icons/bs";
import { IoIosMail, IoLogoYoutube } from "react-icons/io";
import { ImUsers } from "react-icons/im";
import moment from "moment";
import SingleClient from "./SingleClient";

const ClientsListComp = ({ client, fetchCrmClients }) => {
  console.log("clients in child comp: ", client);
  const { 
    currentMode,
    themeBgImg,
    t
  } = useStateContext();
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(client);
  };

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
      icon: <IoLogoYoutube color="#FE0808" size={14} />,
    },
  ];
  return (
    <>
      <div
        className={`border-2 rounded-xl shadow-sm mb-3 cursor-pointer ${
          currentMode === "dark" ? "border-[#1C1C1C] text-white" : "border-[#EEEEEE] text-black"
        } ${
          themeBgImg && (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light")
        }`}
        onClick={handleOpenModal}
      >
        {/* HEADING  */}
        <div
          className={`flex justify-between gap-3 p-2 items-center ${
            themeBgImg ? (currentMode === "dark" ? "blur-bg-dark" : "blur-bg-light") : (currentMode === "dark" ? "#1C1C1C" : "#EEEEEE")
          }`}
        >
          <div className="flex items-center justify-start gap-2">
            <div className="bg-primary rounded-md text-white font-semibold p-2">
              {client?.account_type}
            </div>
            <div className="font-semibold py-2 capitalize">
              {client?.bussiness_name || "-"}
            </div>
          </div>
          {/* SOCIAL LINKS */}
          <div className="flex items-center gap-2 p-1">
            {social_links?.map(
              (social) => client[social?.name] && (
                <span
                  className={`p-2 border border-[#AAA] rounded rounded-full ${
                    currentMode === "dark" ? "bg-[#000]" : "bg-[#FFF]"
                  } cursor-pointer`}
                >
                  {social?.icon}
                </span>
              )
            )}
          </div>
        </div>

        {/* CONTENT  */}
        <div className={`flex justify-between p-4`}>
          <div className="flex flex-col gap-3">
            {/* <div className="flex space-between space-x-2">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Subdomain:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                business.hikalcrm.com
              </p>
            </div> */}
            <div className="flex space-between gap-3">
              <h2>
                {t("no_of_users")}:{" "}
              </h2>
              <p>
                {client?.no_of_users}
              </p>
            </div>
            <div className="flex space-between gap-3">
              <h2>
                {t("label_country")}:{" "}
              </h2>
              <p>
                {client?.country}
              </p>
            </div>
            <div className="flex space-between gap-3">
              <h2>
                {t("registered_on")}:{" "}
              </h2>
              <p>
                {moment(client?.created_at).format("YYYY-MM-DD")}
              </p>
            </div>
            {/* <div className="flex space-between space-x-2 mt-3">
              <h2
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Expires on:{" "}
              </h2>
              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                Date
              </p>
            </div> */}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex space-between gap-3 items-center">
              <BsPerson
                size={16}
              />
              <p>
                {client?.name_of_person || "-"}
              </p>
            </div>
            <div className="flex space-between gap-3 items-center">
              <BsTelephone
                size={16}
              />
              <p>
                {client?.contact || "-"}
              </p>
            </div>
            <div className="flex space-between gap-3 items-center">
              <BsEnvelopeAt
                size={16}
              />
              <p>
                {client?.email || "-"}
              </p>
            </div>
            {/* <div className="flex space-between space-x-3 mt-3 items-center">
              <ImUsers
                size={16}
                color={currentMode === "dark" ? "#fff" : "#000"}
              />

              <p
                className={`${
                  currentMode === "dark" ? "text-white" : "text-dark"
                }`}
              >
                {client?.no_of_users || "-"}
              </p>
            </div> */}
          </div>
        </div>
      </div>
      {openModal && (
        <SingleClient
          client={client}
          openModal={openModal}
          setOpenModal={setOpenModal}
          fetchCrmClients={fetchCrmClients}
        />
      )}
    </>
  );
};

export default ClientsListComp;
