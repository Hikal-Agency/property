import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  Backdrop,
  CircularProgress,
  Modal,
  TextField,
  Button,
  Tooltip,
  Drawer,
  MenuItem,
  Box,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Checkbox,
  FormGroup,
} from "@mui/material";
import { useStateContext } from "../../context/ContextProvider";
import usePermission from "../../utils/usePermission";
import axios from "../../axoisConfig";

import { VscCallOutgoing, VscMail, VscEdit } from "react-icons/vsc";
import { IoIosAlert } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { BiBlock, BiBed } from "react-icons/bi";
import {
  BsShuffle,
  BsTelephone,
  BsEnvelopeAt,
  BsType,
  BsHouseGear,
  BsBuildings,
  BsTrash,
  BsBuildingGear,
  BsPersonPlus,
  BsBookmarkFill,
  BsPersonGear,
  BsChatLeftText,
} from "react-icons/bs";
import PortfolioLocation from "./PortfolioLocation";
import PropertyImageUpload from "./PropertyImageUpload";

const AddProject = ({ openAddProject, setOpenAddProject, FetchProperty }) => {
  const {
    darkModeColors,
    currentMode,
    User,
    BACKEND_URL,
    isArabic,
    primaryColor,
    t,
    isLangRTL,
    i18n,
    themeBgImg,
  } = useStateContext();

  const [allImages, setAllImages] = useState([]);

  console.log("imagesss:: ", allImages);

  const [listingLocation, setListingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });

  const [documentModal, setDocumentModal] = useState(false);

  const [selectImagesModal, setSelectImagesModal] = useState({
    isOpen: false,
    listingId: null,
  });

  const [projectData, setprojectData] = useState({
    projectName: null,
    developer_id: null,
    price: null,
    projectLocation: null,
    area: null,
    tourLink: null,
    projectStatus: null,
    bedrooms: [],
    city: null,
    country: null,
    location: null,
    addedBy: User?.id,
  });

  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [developer, setDeveloper] = useState([]);
  const token = localStorage.getItem("auth-token");

  const [isClosing, setIsClosing] = useState(false);

  const handleBeds = (value) => {
    setprojectData((prev) => {
      if (prev.bedrooms.includes(value)) {
        // Remove the value from the array if already selected
        return {
          ...prev,
          bedrooms: prev.bedrooms.filter((item) => item !== value),
        };
      } else {
        // Add the value to the array if not selected
        return { ...prev, bedrooms: [...prev.bedrooms, value] };
      }
    });
  };

  const handleChange = (e) => {
    const data = e.target.value;
    const name = e.target.name;

    console.log("data,name:: ", data, name);

    setprojectData((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setOpenAddProject(false);
    }, 1000);
  };

  const style = {
    transform: "translate(0%, 0%)",
    boxShadow: 24,
  };

  const getDevelopers = () => {
    setLoading(true);
    const token = localStorage.getItem("auth-token");

    axios
      .get(`${BACKEND_URL}/dev-with-projects`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setDeveloper(result?.data?.data?.developers);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error("Unable to fetch developers.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  console.log("Project data::: ", projectData);
  const AddDeveloper = () => {
    setBtnLoading(true);

    if (
      !projectData?.projectName ||
      !projectData?.projectLocation ||
      !projectData?.area ||
      !projectData?.developer_id
    ) {
      setBtnLoading(false);
      toast.error("Kindly fill all the required fields.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      return;
    }

    projectData["latLong"] = [listingLocation?.lat, listingLocation?.lng].join(
      ","
    );
    projectData["location"] = listingLocation?.addressText;

    // if (allImages?.length > 0)
    //   allImages?.forEach((image, index) => {
    //     console.log("i am image: ", image);
    //     // LeadData.append(`img_name[${index}]`, image);
    //   });

    if (allImages?.length > 0) {
      projectData["images"] = [...allImages];
    }

    axios
      .post(`${BACKEND_URL}/projects`, projectData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then((result) => {
        console.log("Result: ");
        console.log("Result: ", result);
        setBtnLoading(false);
        setprojectData({
          projectName: "",
          developer_id: "",
          price: "",
          projectLocation: "",
          area: "",
          tourLink: "",
          projectStatus: "",
          bedrooms: "",
          city: "",
          country: "",
          location: "",
          addedBy: User?.id,
        });
        toast.success("Project added successfully.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setOpenAddProject(false);
        FetchProperty(token);
      })
      .catch((err) => {
        setBtnLoading(false);
        console.log(err);
        toast.error("Soemthing Went Wrong! Please Try Again", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    getDevelopers();
  }, []);

  return (
    <>
      <Modal
        keepMounted
        open={openAddProject}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        openAfterTransition
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 1000,
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
              className="hover:border hover:border-white hover:rounded-full"
            />
          </button>
          <div
            style={style}
            className={` ${
              currentMode === "dark"
                ? "bg-[#000000] text-white"
                : "bg-[#FFFFFF] text-black"
            } ${
              isLangRTL(i18n.language)
                ? currentMode === "dark" && " border-primary border-r-2"
                : currentMode === "dark" && " border-primary border-l-2"
            }
             p-4 h-[100vh] w-[80vw] overflow-y-scroll 
            `}
          >
            {loading ? (
              <div className="flex justify-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <div className="mx-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      AddDeveloper();
                    }}
                    disabled={loading ? true : false}
                  >
                    <div className="w-full flex items-center pb-3">
                      <div className="bg-primary h-10 w-1 rounded-full"></div>
                      <h1
                        className={`text-lg font-semibold mx-2 uppercase ${
                          currentMode === "dark" ? "text-white" : "text-black"
                        }`}
                      >
                        {t("add_project_modal")}
                      </h1>
                    </div>

                    <div
                      className={`${
                        themeBgImg &&
                        (currentMode === "dark"
                          ? "blur-bg-dark shadow-sm"
                          : "blur-bg-light shadow-sm")
                      } p-5 rounded-lg `}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 gap-5 mt-5">
                        <div className="px-4">
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? `text-white`
                                  : "text-black"
                              } text-center font-semibold pb-5`}
                            >
                              {t("project_details_form")}
                            </h4>{" "}
                            <TextField
                              id="LeadEmailAddress"
                              type={"text"}
                              label={t("project_form_name")}
                              value={projectData?.projectName}
                              name="projectName"
                              onChange={handleChange}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              required
                            />
                            <TextField
                              id="Manager"
                              select
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              label={t("form_developer_name")}
                              size="small"
                              className="w-full"
                              displayEmpty
                              value={projectData?.developer_id}
                              onChange={handleChange}
                              name="developer_id"
                              required
                            >
                              {developer?.map((developer, index) => (
                                <MenuItem key={index} value={developer?.id}>
                                  {developer?.developerName}
                                </MenuItem>
                              ))}
                            </TextField>
                            <TextField
                              id="Manager"
                              type="text"
                              label={t("form_project_priceRange")}
                              className="w-full"
                              value={projectData?.price}
                              name="price"
                              onChange={handleChange}
                              sx={{
                                marginBottom: "1.25rem !important",
                                color:
                                  currentMode === "dark"
                                    ? "#ffffff"
                                    : "#000000",
                              }}
                              variant="outlined"
                              size="small"
                            />
                          </Box>
                        </div>

                        <div className="px-4">
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? `text-white`
                                  : "text-black"
                              } text-center font-semibold pb-5`}
                            >
                              {t("location_details")}
                            </h4>
                            <TextField
                              id="Project"
                              type={"text"}
                              label={t("form_project_location")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={projectData?.projectLocation}
                              name="projectLocation"
                              onChange={handleChange}
                              required
                            />
                            <TextField
                              id="Project"
                              type={"text"}
                              label={t("form_project_area")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={projectData?.area}
                              name="area"
                              onChange={handleChange}
                              required
                            />

                            <TextField
                              id="LeadEmailAddress"
                              type={"text"}
                              label={t("form_project_360View")}
                              className="w-full"
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              variant="outlined"
                              size="small"
                              value={projectData?.tourLink}
                              name="tourLink"
                              onChange={handleChange}
                            />
                          </Box>
                        </div>

                        <div className="px-4">
                          <Box sx={darkModeColors}>
                            <h4
                              className={`${
                                currentMode === "dark"
                                  ? `text-white`
                                  : "text-black"
                              } text-center font-semibold pb-5`}
                            >
                              {t("project_availability")}
                            </h4>
                            <TextField
                              id="Manager"
                              select
                              sx={{
                                "&": {
                                  marginBottom: "1.25rem !important",
                                },
                              }}
                              label={t("form_project_status")}
                              size="small"
                              className="w-full"
                              value={projectData?.projectStatus}
                              name="projectStatus"
                              onChange={handleChange}
                              displayEmpty
                              required
                            >
                              <MenuItem value="available">Available</MenuItem>
                              <MenuItem value="sold-out">Sold-Out</MenuItem>
                            </TextField>

                            <div>
                              <FormControl>
                                <FormLabel id="demo-checkbox-group-label">
                                  Bedrooms
                                </FormLabel>
                                <FormGroup>
                                  <div className="flex">
                                    <div>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Studio"
                                        onChange={() => handleBeds("Studio")}
                                        checked={projectData.bedrooms.includes(
                                          "Studio"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="1 Bedroom"
                                        onChange={() => handleBeds("1 Bedroom")}
                                        checked={projectData.bedrooms.includes(
                                          "1 Bedroom"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="2 Bedrooms"
                                        onChange={() =>
                                          handleBeds("2 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "2 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="3 Bedrooms"
                                        onChange={() =>
                                          handleBeds("3 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "3 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="4 Bedrooms"
                                        onChange={() =>
                                          handleBeds("4 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "4 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="5 Bedrooms"
                                        onChange={() =>
                                          handleBeds("5 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "5 Bedrooms"
                                        )}
                                      />
                                    </div>
                                    <div>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="6 Bedrooms"
                                        onChange={() =>
                                          handleBeds("6 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "6 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="7 Bedrooms"
                                        onChange={() =>
                                          handleBeds("7 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "7 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="8 Bedrooms"
                                        onChange={() =>
                                          handleBeds("8 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "8 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="9 Bedrooms"
                                        onChange={() =>
                                          handleBeds("9 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "9 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="10 Bedrooms"
                                        onChange={() =>
                                          handleBeds("10 Bedrooms")
                                        }
                                        checked={projectData.bedrooms.includes(
                                          "10 Bedrooms"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Retail"
                                        onChange={() => handleBeds("Retail")}
                                        checked={projectData.bedrooms.includes(
                                          "Retail"
                                        )}
                                      />
                                    </div>
                                  </div>
                                </FormGroup>
                              </FormControl>
                            </div>
                          </Box>
                        </div>
                      </div>

                      <div className="min-w-fit w-full flex justify-center mr-4 items-center my-4 space-x-5">
                        <label htmlFor="contained-button-file">
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
                          {/* <p className="text-primary mt-2 italic">
                          {allImages?.length > 0
                            ? `${allImages?.length} images selected.`
                            : null}
                        </p> */}
                        </label>

                        <label htmlFor="contained-button-document">
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
                          {/* <p className="text-primary mt-2 italic">
                          {allDocs?.length > 0
                            ? `${allDocs?.length} documents selected.`
                            : null}
                        </p> */}
                        </label>
                      </div>

                      {/* location */}
                      <div>
                        <PortfolioLocation
                          listingLocation={listingLocation}
                          currLocByDefault={true}
                          setListingLocation={setListingLocation}
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <Button
                          className={`min-w-fit w-full text-white rounded-md py-3 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-none`}
                          ripple={true}
                          style={{
                            background: `${primaryColor}`,
                          }}
                          size="lg"
                          type="submit"
                          disabled={btnLoading ? true : false}
                        >
                          {btnLoading ? (
                            <CircularProgress
                              size={20}
                              sx={{ color: "white" }}
                              className="text-white"
                            />
                          ) : (
                            <span className="text-white">
                              {t("submit_project_btn")}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
                {selectImagesModal?.isOpen && (
                  <PropertyImageUpload
                    selectImagesModal={selectImagesModal}
                    handleClose={() => setSelectImagesModal({ isOpen: false })}
                    allImages={allImages}
                    setAllImages={setAllImages}
                  />
                )}
                {/* {documentModal && (
                  <AddDocumentModal
                    documentModal={documentModal}
                    handleClose={() => setDocumentModal(false)}
                    allDocs={allDocs}
                    setAllDocs={setAllDocs}
                  />
                )} */}
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddProject;
