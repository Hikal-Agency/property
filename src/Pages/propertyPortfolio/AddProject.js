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

const AddProject = ({ openAddProject, setOpenAddProject }) => {
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

  const [projectData, setprojectData] = useState({
    projectName: null,
    developer_id: null,
    price: null,
  });

  const { hasPermission } = usePermission();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [error, setError] = useState(false);
  const [listingLocation, setListingLocation] = useState({
    lat: 0,
    lng: 0,
    addressText: "",
  });

  const [isClosing, setIsClosing] = useState(false);
  // const handleEmail = (e) => {
  //   setEmailError(false);
  //   const value = e.target.value;
  //   console.log(value);

  //   const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  //   if (emailRegex.test(value)) {
  //     setEmailError(false);
  //   } else {
  //     setEmailError("Kindly enter a valid email.");
  //     // setLeadEmail("");
  //     return;
  //   }
  //   setLeadEmail(value);
  //   console.log("Email state: ", LeadEmail);
  // };

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

  const AddLead = () => {
    // setaddNoteloading(true);
    const token = localStorage.getItem("auth-token");

    // const data = {
    //   leadId: LeadData.leadId || LeadData.id,
    //   leadNote: note || AddNoteTxt,
    //   addedBy: User?.id,
    //   addedByName: User?.userName,
    // };
    // axios
    //   .post(`${BACKEND_URL}/leadNotes`, data, {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   })
    //   .then((result) => {
    //     console.log("Result: ");
    //     console.log("Result: ", result);
    //     setaddNoteloading(false);
    //     setAddNoteTxt("");
    //     if (!note) {
    //       toast.success("Note added Successfully", {
    //         position: "top-right",
    //         autoClose: 3000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //         progress: undefined,
    //         theme: "light",
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     setaddNoteloading(false);
    //     console.log(err);
    //     toast.error("Soemthing Went Wrong! Please Try Again", {
    //       position: "top-right",
    //       autoClose: 3000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //     });
    //   });
  };

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
                      AddLead();
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
                              label={t("form_developer_name")}
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
                              // value={Manager}
                              disabled={User?.role === 3 && true}
                              label={t("form_developer_name")}
                              // onChange={ChangeManager}
                              size="small"
                              className="w-full"
                              displayEmpty
                              required
                            >
                              {/* {Managers?.map((person, index) => (
                                <MenuItem key={index} value={person?.id}>
                                  {person?.userName}
                                </MenuItem>
                              ))} */}
                            </TextField>
                            <TextField
                              id="Manager"
                              type="number"
                              label={t("form_project_priceRange")}
                              className="w-full"
                              sx={{
                                marginBottom: "1.25rem !important",
                                color:
                                  currentMode === "dark"
                                    ? "#ffffff"
                                    : "#000000",
                                pointerEvents: "none",
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
                              //   value={LeadProject}
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
                              //   value={LeadProject}
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
                              // value={Manager}
                              disabled={User?.role === 3 && true}
                              label={t("form_project_status")}
                              // onChange={ChangeManager}
                              size="small"
                              className="w-full"
                              displayEmpty
                              required
                            >
                              <MenuItem value="available">Available</MenuItem>
                              <MenuItem value="sold-out">Sold-Out</MenuItem>
                            </TextField>

                            <div>
                              <FormControl>
                                <FormLabel id="demo-radio-buttons-group-label">
                                  Bedrooms
                                </FormLabel>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  // defaultValue="female"
                                  name="radio-buttons-group"
                                >
                                  <div className="flex justify-between">
                                    <div>
                                      <FormControlLabel
                                        value="studio"
                                        control={<Radio />}
                                        label="Studio"
                                      />
                                      <FormControlLabel
                                        value="onebedroom"
                                        control={<Radio />}
                                        label="One Bedroom"
                                      />
                                      <FormControlLabel
                                        value="twobedroom"
                                        control={<Radio />}
                                        label="Two Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="threebedroom"
                                        control={<Radio />}
                                        label="Three Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="fourbedroom"
                                        control={<Radio />}
                                        label="Four Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="fivebedroom"
                                        control={<Radio />}
                                        label="Five Bedrooms"
                                      />
                                    </div>
                                    <div>
                                      <FormControlLabel
                                        value="sixbedroom"
                                        control={<Radio />}
                                        label="Six Bedroom"
                                      />
                                      <FormControlLabel
                                        value="sevenbedroom"
                                        control={<Radio />}
                                        label="Seven Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="eightbedroom"
                                        control={<Radio />}
                                        label="Eight Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="ninebedroom"
                                        control={<Radio />}
                                        label="Nine Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="tenbedroom"
                                        control={<Radio />}
                                        label="Ten Bedrooms"
                                      />
                                      <FormControlLabel
                                        value="retail"
                                        control={<Radio />}
                                        label="Retail"
                                      />
                                    </div>
                                  </div>
                                </RadioGroup>
                              </FormControl>

                              {/* <FormControl>
                                <RadioGroup
                                  aria-labelledby="demo-radio-buttons-group-label"
                                  // defaultValue="female"
                                  name="radio-buttons-group"
                                  required
                                >
                                  <FormControlLabel
                                    value="sixbedroom"
                                    control={<Radio />}
                                    label="Six Bedroom"
                                  />
                                  <FormControlLabel
                                    value="sevenbedroom"
                                    control={<Radio />}
                                    label="Seven Bedrooms"
                                  />
                                  <FormControlLabel
                                    value="eightbedroom"
                                    control={<Radio />}
                                    label="Eight Bedrooms"
                                  />
                                  <FormControlLabel
                                    value="ninebedroom"
                                    control={<Radio />}
                                    label="Nine Bedrooms"
                                  />
                                  <FormControlLabel
                                    value="tenbedroom"
                                    control={<Radio />}
                                    label="Ten Bedrooms"
                                  />
                                  <FormControlLabel
                                    value="retail"
                                    control={<Radio />}
                                    label="Retail"
                                  />
                                </RadioGroup>
                              </FormControl> */}
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
                            // onClick={() =>
                            //   setSelectImagesModal({
                            //     isOpen: true,
                            //   })
                            // }
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
                            // onClick={() => {
                            //   setDocumentModal(true);
                            // }}
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
                          disabled={loading ? true : false}
                        >
                          {loading ? (
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
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddProject;
