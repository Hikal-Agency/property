import React, { useEffect } from "react";

import axios from "../../axoisConfig";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBed } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";

import { Md360 } from "react-icons/md";
import { FaCheck, FaMinus } from "react-icons/fa";
import { BsPatchQuestionFill, BsSearch } from "react-icons/bs";
import BedInfo from "./BedInfo";
import { useState } from "react";
import AddDeveloper from "./AddDeveloper";
import AddProject from "./AddProject";
import SinglePropertyModal from "./SinglePropertyModal";
import usePermission from "../../utils/usePermission";
import { MdOutlineExpandLess } from "react-icons/md";

const PropertyPortfolio = () => {
  const {
    currentMode,
    DevProData,
    setDevProData,
    BACKEND_URL,
    themeBgImg,
    t,
    blurDarkColor,
    blurLightColor,
    darkModeColors,
  } = useStateContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { hasPermission } = usePermission();

  const [openAddDev, setOpenAddDev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openModal, setOpenModal] = useState({ open: false });
  const token = localStorage.getItem("auth-token");

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModal = (data, developer) => {
    console.log("open modal clicked:::::::::::::::");
    setOpenModal({ open: true, project: data, developer: developer });
  };

  const FetchProperty = async () => {
    await axios
      .get(`${BACKEND_URL}/dev-with-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        setDevProData(result.data?.data?.developers);
        console.log("projects list :: ", result.data?.data?.developers);
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

  const clearFilter = () => {
    setSearchQuery("");

    const token = localStorage.getItem("auth-token");
    FetchProperty(token);
  };

  const SearchListings = async (token, page = 1) => {
    setLoading(true);

    let url = `${BACKEND_URL}/project/search?name=${searchQuery}`;

    try {
      const searchProperty = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      console.log("all search properties: ", searchProperty);
      // let filteredProperty = searchProperty?.data?.data?.data || []

      setDevProData(searchProperty.data?.data);

      setLoading(false);
    } catch (error) {
      console.log("property not fetched. ", error);
      toast.error("Unable to search Property.", {
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
    const token = localStorage.getItem("auth-token");
    FetchProperty(token);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (searchQuery !== "") {
      SearchListings(token);
    } else {
      FetchProperty(token);
    }

    // eslint-disable-next-line
  }, [searchQuery]);

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
            {hasPermission("property_add_dev_project") && (
              <>
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
              </>
            )}
            {searchQuery && (
              <Button
                onClick={clearFilter}
                className="w-max btn py-2 px-3 bg-btn-primary mr-2"
              >
                {t("clear")}
              </Button>
            )}
            <Box sx={darkModeColors}>
              <TextField
                className={`${
                  themeBgImg &&
                  (currentMode === "dark"
                    ? "blur-bg-dark rounded-md"
                    : "blur-bg-light rounded-md")
                } w-[250px]`}
                // label="Search"
                size="small"
                placeholder={t("search")}
                sx={{
                  ".css-2ehmn7-MuiInputBase-root-MuiOutlinedInput-root": {
                    paddingLeft: "0px !important",
                    paddingRight: "10px !important",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <BsSearch
                        color={currentMode === "dark" ? "#EEEEEE" : "#333333"}
                      />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                onChange={handleSearchQueryChange}
                value={searchQuery}
              />
            </Box>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center w-full mt-3">
                <CircularProgress />
              </div>
            ) : !searchQuery ? (
              DevProData?.length > 0 ? (
                DevProData?.map((developer) => {
                  return (
                    <>
                      <Accordion
                        className={"bg-primary mt-4"}
                        sx={{
                          backgroundColor: !themeBgImg
                            ? currentMode === "dark"
                              ? "#1C1C1C"
                              : "#EEEEEE"
                            : currentMode === "dark"
                            ? blurDarkColor
                            : blurLightColor,
                          color: currentMode === "dark" ? "#FFFFFF" : "#000000",
                          borderRadius: "10px",
                          marginBottom: "20px",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <MdOutlineExpandLess
                              className={`${
                                currentMode === "dark"
                                  ? "text-white"
                                  : "text-black"
                              }`}
                            />
                          }
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography
                            variant="h6"
                            className={`font-semibold text-white text-center w-full bg-primary p-2 uppercase rounded-lg shadow-sm`}
                          >
                            {developer.developerName}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {developer?.projects?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                              {developer?.projects?.map((project) => (
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
                                                        project?.projectStatus ===
                                                        "Available"
                                                          ? "border-green-600"
                                                          : project.projectStatus ===
                                                            "Sold Out"
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
                                                            project.projectStatus ===
                                                            "Available"
                                                              ? "bg-green-600"
                                                              : project.projectStatus ===
                                                                "Sold Out"
                                                              ? "bg-red-600"
                                                              : "bg-yellow-600"
                                                          }  
                                                        `}
                                        ></div>
                                        <div
                                          className={`
                                                          -top-1 right-3 w-4 h-8 rounded-bl-full
                                                          ${
                                                            project.projectStatus ===
                                                            "Available"
                                                              ? "bg-green-600"
                                                              : project.projectStatus ===
                                                                "Sold Out"
                                                              ? "bg-red-600"
                                                              : "bg-yellow-600"
                                                          }  
                                                        `}
                                        ></div>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <div className="mr-3">
                                        <FaBed
                                          size={14}
                                          className="text-green-600"
                                        />
                                      </div>
                                      {project?.bedrooms &&
                                        project?.bedrooms !== null &&
                                        project?.bedrooms.length > 0 &&
                                        project?.bedrooms?.map((bed, index) => (
                                          <h6 key={index}>
                                            {bed} <span>&nbsp;</span>{" "}
                                          </h6>
                                        ))}
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
                                // <Accordion key={project.projectId}>
                                //   <AccordionSummary
                                //     expandIcon={<MdOutlineExpandLess />}
                                //     aria-controls="panel1a-content"
                                //     id="panel1a-header"
                                //   >

                                //   </AccordionSummary>
                                // </Accordion>
                              ))}
                            </div>
                          ) : (
                            <p className="italic text-sm text-center">
                              {t("no_projects")}
                            </p>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </>
                  );
                })
              ) : (
                <div className="">
                  <h1
                    className={`${
                      currentMode === "dark" ? "text-white" : "text-dark"
                    } font-bold text-xl flex w-full justify-center items-center h-[300px]`}
                  >
                    No property found
                  </h1>
                </div>
              )
            ) : DevProData?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 mt-3">
                {DevProData?.map((project) => {
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
                        onClick={(e) => handleOpenModal(project)}
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

                        <div className="flex items-center">
                          <div className="mr-3">
                            <FaBed size={14} className="text-green-600" />
                          </div>
                          {project?.bedrooms &&
                            project?.bedrooms !== null &&
                            project?.bedrooms.length > 0 &&
                            project?.bedrooms?.map((bed) => <h6>{bed} </h6>)}
                          {/* <h6>{project?.bedrooms}</h6> */}
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
                        </div>
                        <div className="flex items-center">
                          <div className="my-3 mr-3">
                            <FaMoneyBill size={14} className="text-green-600" />
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
              <div className="h-[250px]">
                <p
                  className={` text-xl text-center ${
                    currentMode === "dark" ? "text-white" : "text-dark"
                  }`}
                >
                  {t("no_projects")}
                </p>
              </div>
            )}
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
          FetchProperty={FetchProperty}
        />
      )}
      {openModal?.open && (
        <SinglePropertyModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          FetchProperty={FetchProperty}
        />
      )}
    </>
  );
};

export default PropertyPortfolio;
