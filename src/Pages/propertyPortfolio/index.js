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
  Typography,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBed } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";

import { Md360 } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import BedInfo from "./BedInfo";
import { useState } from "react";
import AddDeveloper from "./AddDeveloper";
import AddProject from "./AddProject";
import SinglePropertyModal from "./SinglePropertyModal";
import usePermission from "../../utils/usePermission";
import { MdOutlineExpandMore } from "react-icons/md";
import { enquiry_options } from "../../Components/_elements/SelectOptions";

import {
  BsBookmarkCheckFill,
  BsBookmarkXFill,
  BsFillBookmarkDashFill
} from "react-icons/bs";
import View360Modal from "./view360";

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
    isLangRTL,
    i18n,
    fontFam,
    primaryColor
  } = useStateContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { hasPermission } = usePermission();

  const [openAddDev, setOpenAddDev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openAddProject, setOpenAddProject] = useState(false);
  const [openModal, setOpenModal] = useState({ open: false });
  const [view360Modal, setView360Modal] = useState({ open: false });
  const token = localStorage.getItem("auth-token");

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenModal = (data, developer) => {
    setOpenModal({ open: true, project: data, developer: developer });
  };

  const handleView360Modal = (data) => {
    setView360Modal({ open: true, project: data });
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
    const fetchData = async () => {
      const token = localStorage.getItem("auth-token");
      if (searchQuery !== "") {
        await SearchListings(token);
      } else {
        await FetchProperty(token);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, [searchQuery]);

  // TRANSLATED BEDS 
  const getBedLabel = (bedValue, t) => {
    const options = enquiry_options(t);
    const option = options.find((option) => option.value === bedValue);
    return option ? option.label : bedValue;
  };

  return (
    <>
      <div className="min-h-screen">
        <div
          className={`w-full p-4  ${
            !themeBgImg & (currentMode === "dark" ? "bg-black" : "bg-white")
          } ${
            currentMode === "dark" ? "text-white" : "text-black"
          }`}
        >
          <div className="flex flex-wrap items-center pb-3 justify-between gap-4">
            <div className="flex items-center">
              <div className="bg-primary h-10 w-1 rounded-full"></div>
              <h1
                className={`text-lg font-semibold mx-2 uppercase ${
                  currentMode === "dark" ? "text-white" : "text-black"
                }`}
              >
                {t("menu_property_portfolio")}
              </h1>
            </div>
            {hasPermission("property_add_dev_project") && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setOpenAddDev(true)}
                  className="bg-btn-primary text-white px-3 py-2 rounded-md"
                  style={{
                    fontFamily: fontFam,
                  }}
                >
                  <span className="text-white">{t("add_dev_btn")}</span>
                </Button>
                <Button
                  onClick={() => setOpenAddProject(true)}
                  className="bg-btn-primary text-white px-3 py-2 rounded-md"
                  style={{
                    fontFamily: fontFam,
                  }}
                >
                  <span className="text-white">{t("add_project_btn")}</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* SEARCH  */}
          <div className="flex justify-end pb-3">
            {searchQuery && (
              <Button
                onClick={clearFilter}
                className={`w-max btn py-2 px-3 bg-btn-primary mr-2`}
              >
                <span className={currentMode === "dark" ? "text-white" : "text-black"}>
                  {t("clear")}
                </span>
              </Button>
            )}
            <Box sx={{
              ...darkModeColors,
              minWidth: "120px",
            }}>
              <TextField
                className={`${
                  themeBgImg &&
                  (currentMode === "dark"
                    ? "blur-bg-dark rounded-md"
                    : "blur-bg-light rounded-md")
                } w-fit`}
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
                        className="shadow-sm"
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
                          "& .css-sh22l5-MuiButtonBase-root-MuiAccordionSummary-root.Mui-expanded": {
                            background: primaryColor,
                            color: "#FFFFFF",
                            borderRadius: "5px 5px 0 0",
                          }
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <MdOutlineExpandMore
                            size={20}
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
                          <div className={`flex gap-3 items-center font-semibold`}>
                            <div className="bg-primary rounded-md px-2 py-1 text-white border-2">
                              {developer?.projects?.length}
                            </div>
                            {developer.developerName}
                          </div>
                        </AccordionSummary>
                        <AccordionDetails>
                          {developer?.projects?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                              {developer?.projects?.map((project) => (
                                <div
                                  className={`${
                                    !themeBgImg
                                      ? currentMode === "dark"
                                        ? "bg-[#000000]"
                                        : "bg-[#FFFFFF]"
                                      : currentMode === "dark"
                                      ? "blur-bg-dark"
                                      : "blur-bg-light"
                                  } card-hover shadow-sm w-full h-full rounded-xl space-y-1 border-t-2
                                  ${
                                    project?.projectStatus.toLowerCase() === "available"
                                      ? "border-green-600"
                                      : project.projectStatus.toLowerCase() === "sold out"
                                      ? "border-red-600"
                                      : "border-yellow-600"
                                  }`}
                                >
                                  <div
                                    className="p-4 flex flex-col gap-3 cursor-pointer"
                                    onClick={(e) =>
                                      handleOpenModal(project, developer)
                                    }
                                  >
                                    <div className="font-semibold flex gap-3 justify-between items-center">
                                      <div>{project?.projectName}</div>
                                      {project?.projectStatus.toLowerCase() === "available" ? (
                                        <BsBookmarkCheckFill size={18} className="text-green-600" />
                                      ) : project?.projectStatus.toLowerCase() === "sold out" ? (
                                        <BsBookmarkXFill size={18} className="text-red-600" />
                                      ) : (
                                        <BsFillBookmarkDashFill size={18} className="text-yellow-600" />
                                      )}
                                    </div>
                                    <div className="grid grid-cols-8 gap-3 items-center">
                                      <FaBed
                                        size={16}
                                        className="text-primary"
                                      />
                                      <div className="col-span-7 flex flex-wrap gap-2">
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
                                    <div className="grid grid-cols-8 gap-3 items-center">
                                      <FaMoneyBill
                                        size={16}
                                        className="text-primary"
                                      />
                                      <div className="col-span-7 flex flex-wrap gap-2">
                                        {project?.price}
                                      </div>
                                    </div>
                                    {project?.tourlink !== null &&
                                    project?.tourlink !== "" &&
                                    project?.tourlink !== "undefined" &&
                                    project?.tourlink !== "null" ? (
                                      <div className="flex items-center justify-end gap-3 text-white">
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
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
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
                    {t("no_projects")}
                  </h1>
                </div>
              )
            ) : DevProData?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
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
                      } card-hover w-full h-full rounded-xl shadow-sm space-y-1 border-t-2
                      ${
                        project?.projectStatus === "Available"
                          ? "border-green-600"
                          : project.projectStatus === "Sold-out"
                          ? "border-red-600"
                          : "border-yellow-600"
                      }`}
                    >
                      <div
                        className="p-4 flex flex-col gap-3 cursor-pointer"
                        onClick={(e) => handleOpenModal(project)}
                      >
                        <div className="font-semibold flex gap-3 justify-between items-center">
                          <div>{project?.projectName}</div>
                          {project?.projectStatus === "Available" ? (
                            <BsBookmarkCheckFill size={18} className="text-green-600" />
                          ) : project?.projectStatus === "Sold-out" ? (
                            <BsBookmarkXFill size={18} className="text-red-600" />
                          ) : (
                            <BsFillBookmarkDashFill size={18} className="text-yellow-600" />
                          )}
                        </div>
                        <div className="grid grid-cols-8 gap-3 items-center">
                          <FaBed
                            size={16}
                            className="text-primary"
                          />
                          <div className="col-span-7 flex flex-wrap gap-2">
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
                        <div className="grid grid-cols-8 gap-3 items-center">
                          <FaMoneyBill
                            size={16}
                            className="text-primary"
                          />
                          <div className="col-span-7 flex flex-wrap gap-2">
                            {project?.price}
                          </div>
                        </div>
                        {project?.tourlink !== null &&
                        project?.tourlink !== "" &&
                        project?.tourlink !== "undefined" &&
                        project?.tourlink !== "null" ? (
                          <div className="flex items-center justify-end gap-3 text-white">
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
          loading={loading}
          setloading={setLoading}
        />
      )}
      {view360Modal?.open && (
        <View360Modal
          view360Modal={view360Modal}
          setView360Modal={setView360Modal}
          loading={loading}
          setloading={setLoading}
        />
      )}
    </>
  );
};

export default PropertyPortfolio;
