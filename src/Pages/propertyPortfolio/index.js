import React, { useEffect } from "react";

import axios from "../../axoisConfig";
import { Button, Tooltip } from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBed } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";

import { Md360 } from "react-icons/md";
import { FaCheck, FaMinus } from "react-icons/fa";
import { BsPatchQuestionFill } from "react-icons/bs";
import BedInfo from "./BedInfo";
import { useState } from "react";
import AddDeveloper from "./AddDeveloper";
import AddProject from "./AddProject";
import SinglePropertyModal from "./SinglePropertyModal";

const PropertyPortfolio = () => {
  const { currentMode, DevProData, setDevProData, BACKEND_URL, themeBgImg, t } =
    useStateContext();
  const navigate = useNavigate();
  const [openAddDev, setOpenAddDev] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openModal, setOpenModal] = useState({ open: false });

  const handleOpenModal = (data, developer) => {
    console.log("open modal clicked:::::::::::::::");
    setOpenModal({ open: true, project: data, developer: developer });
  };

  const FetchProperty = async (token) => {
    await axios
      .get(`${BACKEND_URL}/dev-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setDevProData(result.data?.data?.developers);
      })
      .catch((err) => {
        toast.error("Something went wrong kindly force refresh the page.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    FetchProperty(token);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full p-4  ${
            !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
          }`}
        >
          <div className="w-full flex items-center pb-3">
            <div className="bg-primary h-10 w-1 rounded-full"></div>
            <h1
              className={`text-lg font-semibold mx-2 uppercase ${
                currentMode === "dark" ? "text-white" : "text-black"
              }`}
            >
              {t("menu_property_portfolio")}
            </h1>
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              onClick={() => setOpenAddDev(true)}
              className="bg-btn-primary text-white px-4 py-4 rounded-md "
            >
              <span className="text-white">{t("add_dev_btn")}</span>
            </Button>
            <Button
              onClick={() => setOpenAddProject(true)}
              className="bg-btn-primary text-white px-4 py-4 rounded-md "
            >
              <span className="text-white">{t("add_project_btn")}</span>
            </Button>
          </div>

          <div className="space-y-3">
            {/* {DevProData.length > 0 ? ( */}
            {DevProData?.map((developer) => {
              return (
                <>
                  <div
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-black"
                    } w-full p-4 space-y-5`}
                  >
                    <div className="font-semibold text-white text-center w-full bg-primary p-2 uppercase rounded-lg shadow-sm">
                      {developer.developerName}
                    </div>
                    {developer?.projects?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                        {developer?.projects?.map((project) => {
                          return (
                            <div
                              className={`${
                                !themeBgImg
                                  ? currentMode === "dark"
                                    ? "bg-[#1C1C1C]"
                                    : "bg-[#EEEEEE]"
                                  : currentMode === "dark"
                                  ? "blur-bg-dark"
                                  : "blur-bg-light"
                              } card-hover w-full h-full rounded-md space-y-1 border-t-2
                                ${
                                  project?.projectStatus === "Available"
                                    ? "border-green-600"
                                    : project.projectStatus === "Sold Out"
                                    ? "border-red-600"
                                    : "border-yellow-600"
                                }
                                `}
                            >
                              <div
                                className="p-4 cursor-pointer"
                                onClick={(e) =>
                                  handleOpenModal(project, developer)
                                }
                              >
                                <div className="uppercase font-semibold mb-3 flex justify-between items-center">
                                  <div>{project?.projectName}</div>
                                  <div className="flex">
                                    <div
                                      className={`
                                   top-0 right-5 w-4 h-8 rounded-br-full
                                  ${
                                    project.projectStatus === "Available"
                                      ? "bg-green-600"
                                      : project.projectStatus === "Sold Out"
                                      ? "bg-red-600"
                                      : "bg-yellow-600"
                                  }  
                                `}
                                    ></div>
                                    <div
                                      className={`
                                   -top-1 right-3 w-4 h-8 rounded-bl-full
                                  ${
                                    project.projectStatus === "Available"
                                      ? "bg-green-600"
                                      : project.projectStatus === "Sold Out"
                                      ? "bg-red-600"
                                      : "bg-yellow-600"
                                  }  
                                `}
                                    ></div>
                                  </div>
                                </div>
                                {/* <div className="flex items-center gap-3 my-2">
                                  {project.studio === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_studio")}</p>
                                </div>
                                <div className="flex items-center gap-3 my-2">
                                  {project.onebed === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_1bed")}</p>
                                </div>
                                <div className="flex items-center gap-3 my-2">
                                  {project.twobed === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_2bed")}</p>
                                </div>
                                <div className="flex items-center gap-3 my-2">
                                  {project.threebed === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_3bed")}</p>
                                </div>
                                <div className="flex items-center gap-3 my-2">
                                  {project.fourbed === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_4bed")}</p>
                                </div>
                                <div className="flex items-center gap-3 my-2">
                                  {project.fivebed === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_5bed")}</p>
                                </div>
                                <div className="flex items-center gap-3 my-2">
                                  {project.sixbed === 1 ? (
                                    <FaCheck
                                      size={14}
                                      className="text-green-600"
                                    />
                                  ) : (
                                    <FaMinus
                                      size={14}
                                      className="text-red-600"
                                    />
                                  )}
                                  <p>{t("enquiry_6bed")}</p>
                                </div> */}
                                <div className="flex items-center">
                                  <div className="mr-3">
                                    <FaBed
                                      size={14}
                                      className="text-green-600"
                                    />
                                  </div>
                                  <BedInfo
                                    value={project.studio}
                                    label="enquiry_studio"
                                    t={t}
                                  />

                                  <BedInfo
                                    value={project.bedrooms}
                                    label="enquiry_1bed"
                                    t={t}
                                  />
                                  <BedInfo
                                    value={project.retail}
                                    label="enquiry_retail"
                                    t={t}
                                  />

                                  {/* <BedInfo
                                    value={project.twobed}
                                    label="enquiry_2bed"
                                    t={t}
                                  />

                                  <BedInfo
                                    value={project.threebed}
                                    label="enquiry_3bed"
                                    t={t}
                                  />

                                  <BedInfo
                                    value={project.fourbed}
                                    label="enquiry_4bed"
                                    t={t}
                                  />

                                  <BedInfo
                                    value={project.fivebed}
                                    label="enquiry_5bed"
                                    t={t}
                                  />

                                  <BedInfo
                                    value={project.sixbed}
                                    label="enquiry_6bed"
                                    t={t}
                                  /> */}
                                </div>
                                <div className="flex items-center">
                                  <div className="my-3 mr-3">
                                    <FaMoneyBill
                                      size={14}
                                      className="text-green-600"
                                    />
                                  </div>
                                  {project?.price}
                                </div>

                                {project?.tour360 === 1 ? (
                                  <div className="flex items-center justify-end gap-3 text-white text-sm">
                                    <button
                                      onClick={() =>
                                        navigate(
                                          `/propertyPortfolio/tour360/${project.proId}`
                                        )
                                      }
                                      className="bg-primary text-white rounded-md gap-2 px-3 py-2 flex items-center"
                                    >
                                      <Md360 size={"25px"} />
                                      <span className="text-xs uppercase">
                                        {t("360_view")}
                                      </span>
                                    </button>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="italic text-sm text-center">
                        {t("no_projects")}
                      </p>
                    )}
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
      {openAddDev && (
        <AddDeveloper openAddDev={openAddDev} setOpenAddDev={setOpenAddDev} />
      )}
      {openAddProject && (
        <AddProject
          openAddProject={openAddProject}
          setOpenAddProject={setOpenAddProject}
        />
      )}
      {openModal?.open && (
        <SinglePropertyModal
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default PropertyPortfolio;
